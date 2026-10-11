#!/usr/bin/env python3
"""
RE—EARTH | AWS CloudWatch Observability & Telemetry Probe
Pings the live AWS Amplify production deployment and publishes health metrics to Amazon CloudWatch.
"""

import sys
import time
import urllib.request
import boto3

REGION = 'us-east-1'
APP_NAME = 're-earth'
ENDPOINT_URL = 'https://main.d3cukmq7nr5vg3.amplifyapp.com'
NAMESPACE = 'RE-EARTH/AmplifyHosting'
HEALTH_ALARM = 'RE-EARTH-Amplify-Endpoint-Health'
LATENCY_ALARM = 'RE-EARTH-Amplify-Endpoint-Latency'
DASHBOARD_NAME = 'RE-EARTH-Amplify-Operations'

def main():
    print("=" * 60)
    print("RE--EARTH | AWS CLOUDWATCH OBSERVABILITY PROBE")
    print("=" * 60)
    print(f"Target Endpoint : {ENDPOINT_URL}")
    print(f"AWS Region      : {REGION}")
    print(f"Namespace       : {NAMESPACE}")
    print("-" * 60)

    # 1. Execute live HTTP probe
    start_time = time.time()
    req = urllib.request.Request(
        ENDPOINT_URL,
        headers={'User-Agent': 'AWS-CloudWatch-Synthetics-RE-EARTH/1.0'}
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            latency_ms = round((time.time() - start_time) * 1000, 2)
            status_code = resp.status
            is_healthy = (status_code == 200)
    except Exception as err:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        status_code = 500
        is_healthy = False
        print(f"Probe Error: {err}")

    print(f"HTTP Status     : {status_code} ({'HEALTHY' if is_healthy else 'UNHEALTHY'})")
    print(f"Response Latency: {latency_ms} ms")

    # 2. Publish metrics to Amazon CloudWatch
    cw = boto3.client('cloudwatch', region_name=REGION)
    metric_data = [
        {
            'MetricName': 'EndpointAvailability',
            'Dimensions': [{'Name': 'AppName', 'Value': APP_NAME}, {'Name': 'Environment', 'Value': 'Production'}],
            'Value': 100.0 if is_healthy else 0.0,
            'Unit': 'Percent'
        },
        {
            'MetricName': 'ResponseLatencyMs',
            'Dimensions': [{'Name': 'AppName', 'Value': APP_NAME}, {'Name': 'Environment', 'Value': 'Production'}],
            'Value': latency_ms,
            'Unit': 'Milliseconds'
        },
        {
            'MetricName': 'HTTP200SuccessCount',
            'Dimensions': [{'Name': 'AppName', 'Value': APP_NAME}, {'Name': 'Environment', 'Value': 'Production'}],
            'Value': 1.0 if is_healthy else 0.0,
            'Unit': 'Count'
        },
        {
            'MetricName': 'HTTPErrors',
            'Dimensions': [{'Name': 'AppName', 'Value': APP_NAME}, {'Name': 'Environment', 'Value': 'Production'}],
            'Value': 0.0 if is_healthy else 1.0,
            'Unit': 'Count'
        }
    ]

    cw.put_metric_data(Namespace=NAMESPACE, MetricData=metric_data)
    print("Telemetry State : PUBLISHED to AWS CloudWatch")

    # 3. Retrieve CloudWatch Alarm states
    alarms = cw.describe_alarms(AlarmNames=[HEALTH_ALARM, LATENCY_ALARM])['MetricAlarms']
    print("-" * 60)
    print("LIVE CLOUDWATCH ALARM STATUSES:")
    for a in alarms:
        state = a['StateValue']
        icon = "[OK]" if state == "OK" else ("[ALARM]" if state == "ALARM" else "[PENDING]")
        print(f"  {icon} {a['AlarmName']}: {state}")
        if a.get('StateReason'):
            print(f"     Reason: {a['StateReason']}")

    dashboard_url = f"https://{REGION}.console.aws.amazon.com/cloudwatch/home?region={REGION}#dashboards/dashboard/{DASHBOARD_NAME}"
    print("-" * 60)
    print(f"CloudWatch Console Dashboard URL:")
    print(f"{dashboard_url}")
    print("=" * 60)

if __name__ == '__main__':
    main()
