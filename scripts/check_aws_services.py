import boto3

REGION = 'us-east-1'

print("=" * 65)
print("RE--EARTH | ACTIVE AWS SERVICES AUDIT REPORT")
print("=" * 65)

# 1. AWS Amplify
amp = boto3.client('amplify', region_name=REGION)
apps = amp.list_apps().get('apps', [])
print(f"1. AWS Amplify Hosting ({REGION}):")
if apps:
    for a in apps:
        print(f"   • App Name   : {a['name']}")
        print(f"   • App ID     : {a['appId']}")
        print(f"   • Default URL: https://main.{a['defaultDomain']}")
else:
    print("   • No active Amplify apps found.")

# 2. Amazon S3
s3 = boto3.client('s3', region_name=REGION)
buckets = s3.list_buckets().get('Buckets', [])
print(f"\n2. Amazon S3 (Global/Storage):")
if buckets:
    for b in buckets:
        print(f"   • Bucket Name: {b['Name']}")
else:
    print("   • No active S3 buckets found.")

# 3. Amazon CloudWatch
cw = boto3.client('cloudwatch', region_name=REGION)
dashboards = cw.list_dashboards().get('DashboardEntries', [])
alarms = cw.describe_alarms(AlarmNamePrefix='RE-EARTH').get('MetricAlarms', [])

print(f"\n3. Amazon CloudWatch ({REGION}):")
print("   • Dashboards:")
for d in dashboards:
    print(f"     - {d['DashboardName']}")
print("   • Metric Alarms:")
for a in alarms:
    print(f"     - {a['AlarmName']} [{a['StateValue']}]")

print("=" * 65)
