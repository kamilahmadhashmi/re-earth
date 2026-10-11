import json
import boto3

REGION = 'us-east-1'
BUCKET_NAME = 're-earth-certificates-346560662330'

print(f"Configuring S3 Bucket: {BUCKET_NAME} in {REGION}...")
s3 = boto3.client('s3', region_name=REGION)

# 1. Configure CORS
cors_config = {
    'CORSRules': [
        {
            'AllowedHeaders': ['*'],
            'AllowedMethods': ['GET', 'HEAD', 'PUT'],
            'AllowedOrigins': [
                'https://main.d3cukmq7nr5vg3.amplifyapp.com',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175'
            ],
            'ExposeHeaders': ['ETag', 'x-amz-server-side-encryption'],
            'MaxAgeSeconds': 3600
        }
    ]
}

s3.put_bucket_cors(Bucket=BUCKET_NAME, CORSConfiguration=cors_config)
print("CORS configuration applied.")

# 2. Upload initial NIST SP 800-88 R1 Electronic Diversion Certificate
sample_cert = {
    "certificateId": "REC-DTU-2026-0941",
    "protocol": "NIST SP 800-88 R1 Verified Circular Diversion",
    "institution": "Delhi Technological University (DTU)",
    "kioskId": "kiosk-dtu-mech",
    "timestamp": "2026-10-11T23:30:00Z",
    "student": {
        "name": "Aarav Sharma",
        "rollNumber": "2023/EE/042",
        "department": "Electrical Engineering"
    },
    "device": {
        "manufacturer": "Apple",
        "model": "iPhone 11",
        "verifiedMassGrams": 192.8,
        "condition": "Cracked Screen - Hardware Intact",
        "hazardousToxicityCheck": "PASSED (Zero Lithium Swelling)"
    },
    "environmentalEquivalencies": {
        "avoidedCO2eKg": 72.0,
        "recoveredCopperGrams": 18.4,
        "recoveredGoldGrams": 0.034,
        "reEarthTokensEarned": 180,
        "campusXP": 225
    },
    "cryptographicProof": {
        "hashAlgorithm": "SHA-256",
        "hash": "7b8c24d9e9f01a4b2c83d6a782e140d39e8f615b8045a193c72b53f698e401da",
        "storageBucket": BUCKET_NAME
    }
}

cert_key = "certificates/REC-DTU-2026-0941.json"
s3.put_object(
    Bucket=BUCKET_NAME,
    Key=cert_key,
    Body=json.dumps(sample_cert, indent=2),
    ContentType="application/json"
)
print(f"Sample certificate uploaded to s3://{BUCKET_NAME}/{cert_key}")

# 3. Generate a 7-day presigned download URL for instant access
presigned_url = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': BUCKET_NAME, 'Key': cert_key},
    ExpiresIn=604800  # 7 days
)

print("\n" + "=" * 60)
print("AMAZON S3 CERTIFICATE VAULT CONFIGURED!")
print(f"Bucket Name  : {BUCKET_NAME}")
print(f"Region       : {REGION}")
print(f"Stored Object: {cert_key}")
print(f"Presigned Access URL:")
print(presigned_url)
print("=" * 60)
