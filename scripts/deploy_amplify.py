import os
import io
import zipfile
import urllib.request
import boto3
import time

REGION = 'us-east-1'
APP_ID = 'd3cukmq7nr5vg3'
BRANCH = 'main'
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')

print(f"Zipping dist directory from: {DIST_DIR}")
if not os.path.exists(DIST_DIR):
    raise FileNotFoundError(f"dist directory not found at {DIST_DIR}")

# Create in-memory zip
zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, DIST_DIR)
            zip_file.write(full_path, rel_path)

zip_data = zip_buffer.getvalue()
print(f"Zip package created: {len(zip_data) / 1024 / 1024:.2f} MB")

amp = boto3.client('amplify', region_name=REGION)

print(f"Creating Amplify deployment for App {APP_ID}, branch {BRANCH}...")
dep = amp.create_deployment(appId=APP_ID, branchName=BRANCH)
job_id = dep['jobId']
upload_url = dep['zipUploadUrl']
print(f"Deployment created with Job ID: {job_id}")

print("Uploading zip artifact to presigned S3 URL...")
req = urllib.request.Request(
    upload_url,
    data=zip_data,
    headers={'Content-Type': 'application/zip'},
    method='PUT'
)
with urllib.request.urlopen(req) as response:
    print(f"Upload response status: {response.status}")

print("Starting Amplify deployment...")
start_resp = amp.start_deployment(appId=APP_ID, branchName=BRANCH, jobId=job_id)
print("Deployment started successfully!")

# Monitor deployment status
print("Monitoring deployment progress...")
for _ in range(30):
    time.sleep(5)
    job = amp.get_job(appId=APP_ID, branchName=BRANCH, jobId=job_id)
    status = job['job']['summary']['status']
    print(f"Current status: {status}")
    if status in ['SUCCEED', 'FAILED', 'CANCELLED']:
        break

if status == 'SUCCEED':
    print(f"\nSUCCESS: Live at https://{BRANCH}.{APP_ID}.amplifyapp.com")
else:
    print(f"\nFinal status: {status}")
