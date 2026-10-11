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
        print(f"   * App Name   : {a['name']}")
        print(f"   * App ID     : {a['appId']}")
        print(f"   * Default URL: https://main.{a['defaultDomain']}")
else:
    print("   * No active Amplify apps found.")

# 2. AWS Lambda
lam = boto3.client('lambda', region_name=REGION)
functions = lam.list_functions().get('Functions', [])
re_funcs = [f for f in functions if 're-earth' in f['FunctionName']]
print(f"\n2. AWS Lambda Microservices ({REGION}):")
if re_funcs:
    for f in re_funcs:
        print(f"   * Function   : {f['FunctionName']}")
        print(f"   * Runtime    : {f['Runtime']}")
        print(f"   * ARN        : {f['FunctionArn']}")
else:
    print("   * No active RE-EARTH Lambda functions found.")

# 3. Amazon API Gateway (v2)
apigw = boto3.client('apigatewayv2', region_name=REGION)
apis = apigw.get_apis().get('Items', [])
re_apis = [a for a in apis if 're-earth' in a['Name']]
print(f"\n3. Amazon API Gateway HTTP APIs ({REGION}):")
if re_apis:
    for a in re_apis:
        print(f"   * API Name   : {a['Name']}")
        print(f"   * API ID     : {a['ApiId']}")
        print(f"   * Endpoint   : {a['ApiEndpoint']}")
else:
    print("   * No active RE-EARTH API Gateway instances found.")

# 4. Amazon S3
s3 = boto3.client('s3', region_name=REGION)
buckets = s3.list_buckets().get('Buckets', [])
re_buckets = [b for b in buckets if 're-earth' in b['Name']]
print(f"\n4. Amazon S3 (Global/Storage):")
if re_buckets:
    for b in re_buckets:
        print(f"   * Bucket Name: {b['Name']}")
else:
    print("   * No active RE-EARTH S3 buckets found.")

# 5. Amazon DynamoDB
dynamodb = boto3.client('dynamodb', region_name=REGION)
tables = dynamodb.list_tables().get('TableNames', [])
re_tables = [t for t in tables if 'Smrt' in t or 're-earth' in t.lower()]
print(f"\n5. Amazon DynamoDB NoSQL Tables ({REGION}):")
if re_tables:
    for t in re_tables:
        desc = dynamodb.describe_table(TableName=t)['Table']
        ttl_info = dynamodb.describe_time_to_live(TableName=t).get('TimeToLiveDescription', {})
        ttl_status = ttl_info.get('TimeToLiveStatus', 'DISABLED')
        ttl_attr = ttl_info.get('AttributeName', 'None')
        print(f"   * Table Name : {t} [{desc.get('TableStatus')}]")
        print(f"     - Billing  : {desc.get('BillingModeSummary', {}).get('BillingMode', 'PAY_PER_REQUEST')}")
        print(f"     - TTL      : {ttl_status} (Attribute: {ttl_attr})")
else:
    print("   * No active RE-EARTH DynamoDB tables found.")

# 6. Amazon CloudWatch
cw = boto3.client('cloudwatch', region_name=REGION)
dashboards = cw.list_dashboards().get('DashboardEntries', [])
alarms = cw.describe_alarms(AlarmNamePrefix='RE-EARTH').get('MetricAlarms', [])

print(f"\n6. Amazon CloudWatch ({REGION}):")
print("   * Dashboards:")
for d in dashboards:
    print(f"     - {d['DashboardName']}")
print("   * Metric Alarms:")
for a in alarms:
    print(f"     - {a['AlarmName']} [{a['StateValue']}]")

print("=" * 65)
