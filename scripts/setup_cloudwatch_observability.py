import json
import time
import urllib.request
import boto3

REGION = 'us-east-1'
APP_NAME = 're-earth'
ENDPOINT_URL = 'https://main.d3cukmq7nr5vg3.amplifyapp.com'
NAMESPACE = 'RE-EARTH/AmplifyHosting'
DASHBOARD_NAME = 'RE-EARTH-Amplify-Operations'
ACCOUNT_ID = '346560662330'

print(f"Connecting to Amazon CloudWatch in {REGION}...")
cw = boto3.client('cloudwatch', region_name=REGION)

# 1. Create CloudWatch Metric Alarms
health_alarm_name = 'RE-EARTH-Amplify-Endpoint-Health'
latency_alarm_name = 'RE-EARTH-Amplify-Endpoint-Latency'

print(f"Creating CloudWatch Metric Alarm: {health_alarm_name}...")
cw.put_metric_alarm(
    AlarmName=health_alarm_name,
    AlarmDescription=f'Alerts if RE-EARTH endpoint availability drops below 100% on {ENDPOINT_URL}',
    ActionsEnabled=False,
    MetricName='EndpointAvailability',
    Namespace=NAMESPACE,
    Statistic='Average',
    Dimensions=[
        {'Name': 'AppName', 'Value': APP_NAME},
        {'Name': 'Environment', 'Value': 'Production'}
    ],
    Period=60,
    EvaluationPeriods=1,
    Threshold=100.0,
    ComparisonOperator='LessThanThreshold',
    TreatMissingData='notBreaching'
)

print(f"Creating CloudWatch Metric Alarm: {latency_alarm_name}...")
cw.put_metric_alarm(
    AlarmName=latency_alarm_name,
    AlarmDescription=f'Alerts if RE-EARTH edge response latency exceeds 2500ms on {ENDPOINT_URL}',
    ActionsEnabled=False,
    MetricName='ResponseLatencyMs',
    Namespace=NAMESPACE,
    Statistic='Average',
    Dimensions=[
        {'Name': 'AppName', 'Value': APP_NAME},
        {'Name': 'Environment', 'Value': 'Production'}
    ],
    Period=60,
    EvaluationPeriods=1,
    Threshold=2500.0,
    ComparisonOperator='GreaterThanThreshold',
    TreatMissingData='notBreaching'
)

# 2. Create CloudWatch Dashboard
dashboard_body = {
    "widgets": [
        {
            "type": "text",
            "x": 0,
            "y": 0,
            "width": 24,
            "height": 3,
            "properties": {
                "markdown": f"# 🌍 RE—EARTH | AWS Amplify Production Observability\n\n**Application:** `{APP_NAME}` | **Hosting:** AWS Amplify Hosting (`d3cukmq7nr5vg3`) | **Region:** `{REGION}`\n**Live Endpoint:** [{ENDPOINT_URL}]({ENDPOINT_URL})\n\n*Continuous operational telemetry, edge latency monitoring, and automated health checks.*"
            }
        },
        {
            "type": "alarm",
            "x": 0,
            "y": 3,
            "width": 8,
            "height": 6,
            "properties": {
                "title": "Endpoint Health Alarms",
                "alarms": [
                    f"arn:aws:cloudwatch:{REGION}:{ACCOUNT_ID}:alarm:{health_alarm_name}",
                    f"arn:aws:cloudwatch:{REGION}:{ACCOUNT_ID}:alarm:{latency_alarm_name}"
                ]
            }
        },
        {
            "type": "metric",
            "x": 8,
            "y": 3,
            "width": 8,
            "height": 6,
            "properties": {
                "title": "Live Endpoint Availability (%)",
                "metrics": [
                    [NAMESPACE, "EndpointAvailability", "AppName", APP_NAME, "Environment", "Production", {"stat": "Average", "color": "#10b981"}]
                ],
                "view": "timeSeries",
                "stacked": False,
                "region": REGION,
                "yAxis": {"left": {"min": 0, "max": 100}}
            }
        },
        {
            "type": "metric",
            "x": 16,
            "y": 3,
            "width": 8,
            "height": 6,
            "properties": {
                "title": "Edge Response Latency (ms)",
                "metrics": [
                    [NAMESPACE, "ResponseLatencyMs", "AppName", APP_NAME, "Environment", "Production", {"stat": "Average", "color": "#06b6d4"}]
                ],
                "view": "timeSeries",
                "stacked": False,
                "region": REGION,
                "yAxis": {"left": {"min": 0}}
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 9,
            "width": 24,
            "height": 6,
            "properties": {
                "title": "HTTP Traffic & Health Checks",
                "metrics": [
                    [NAMESPACE, "HTTP200SuccessCount", "AppName", APP_NAME, "Environment", "Production", {"stat": "Sum", "color": "#10b981"}],
                    [".", "HTTPErrors", ".", ".", ".", ".", {"stat": "Sum", "color": "#ef4444"}]
                ],
                "view": "timeSeries",
                "stacked": True,
                "region": REGION
            }
        }
    ]
}

print(f"Creating Amazon CloudWatch Dashboard: {DASHBOARD_NAME}...")
cw.put_dashboard(
    DashboardName=DASHBOARD_NAME,
    DashboardBody=json.dumps(dashboard_body)
)
print("CloudWatch Dashboard created successfully.")

# 3. Perform Live Health Probe & Emit Telemetry
print(f"Executing active health probe on {ENDPOINT_URL}...")
start_time = time.time()
req = urllib.request.Request(ENDPOINT_URL, headers={'User-Agent': 'AWS-CloudWatch-Synthetics-RE-EARTH-Probe/1.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        status_code = resp.status
        is_healthy = (status_code == 200)
except Exception as e:
    latency_ms = round((time.time() - start_time) * 1000, 2)
    status_code = 500
    is_healthy = False
    print("Probe error:", e)

print(f"Probe Result: HTTP {status_code} in {latency_ms}ms (Healthy: {is_healthy})")

print("Emitting metric data to CloudWatch...")
cw.put_metric_data(
    Namespace=NAMESPACE,
    MetricData=[
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
)
print("Metric data published successfully to CloudWatch!")

# 4. Check Alarm States
alarms = cw.describe_alarms(AlarmNames=[health_alarm_name, latency_alarm_name])['MetricAlarms']
for a in alarms:
    print(f"Alarm '{a['AlarmName']}': State={a['StateValue']} ({a.get('StateReason', '')})")
