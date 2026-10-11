# 🌍 RE—EARTH | End-to-End AWS Architecture Blueprint

![RE—EARTH Full AWS Cloud Architecture & Workflow](./re_earth_aws_architecture.jpg)

---

### System Architecture Overview

RE—EARTH utilizes an enterprise-grade, serverless event-driven architecture on **Amazon Web Services (AWS)** in `us-east-1`. The pipeline connects physical campus e-waste recycling kiosks with cryptographic data sanitization and institutional sustainability reporting.

```mermaid
sequenceDiagram
    autonumber
    actor Student as 🎓 Student / User
    participant Amplify as 🚀 AWS Amplify Hosting
    participant APIGW as ⚡ Amazon API Gateway (v2)
    participant Lambda as ⚙️ AWS Lambda (Python 3.11)
    participant DDB as 🗄️ DynamoDB (TTL)
    participant S3 as 🪣 Amazon S3 Vault
    actor Kiosk as 🤖 Smart Kiosk Pod / Operator
    participant CW as 📊 CloudWatch

    Student->>Amplify: 1. Load 3D Web App (Edge CDN)
    Student->>Student: 2. Triage Device & Wipe Protocol
    Student->>APIGW: 3. Request 1-Day Locker Reservation
    APIGW->>Lambda: 4. Forward Payload
    Lambda->>DDB: 5. PutItem (reservationExpiresAt = +24h)
    Lambda-->>Student: 6. Return Signed 1-Day QR Pass Token
    Student->>Kiosk: 7. Present QR Code & Place Device on Scale
    Kiosk->>APIGW: 8. Scan QR & Verify Mass / Safety
    APIGW->>Lambda: 9. Execute NIST SP 800-88 R1 Validation
    Lambda->>DDB: 10. Update Locker Status to REDEEMED
    Lambda->>DDB: 11. Append Diversion Metrics to Ledger
    Lambda->>S3: 12. Generate NIST Certificate & Presigned URL
    Lambda-->>Kiosk: 13. Unlock Hatch & Complete Deposit
    Amplify-->>CW: 14. Edge Telemetry (185ms Latency)
    CW-->>CW: 15. Operational Alarms (Health [OK])
```

---

### The 4 Architectural Zones

#### 🔹 Zone 1: Student Client & Smart Kiosk
* **3D Planetary Experience**: High-performance Three.js WebGL interface allowing students to view global e-waste beacons, campus transit shuttles, and collection hubs.
* **Triage & Data-Wipe Wizard**: Automated step-by-step guidance following NIST guidelines with simulated cryptographic sanitization certificate generation.
* **1-Day Optical QR Token**: Generates a tamper-proof QR code containing device telemetry, declared mass, and destination pod identifier valid for 24 hours.
* **Physical Smart Kiosk Pod**: Campus collection pod equipped with an integrated optical barcode scanner, load-cell mass scale, and an automated solenoid-locked disposal compartment.

#### 🔹 Zone 2: Edge & API Ingress Layer
* **AWS Amplify Hosting** (`d3cukmq7nr5vg3`):
  * **Global CDN Distribution**: Serves static bundles with automated SSL and edge caching.
  * **Zero Idle Cost**: Continuous global availability with instant cache invalidation.
* **Amazon API Gateway HTTP API v2** (`bzj8npggw7`):
  * **High Throughput / Low Latency**: 70% cost reduction compared to legacy REST APIs.
  * **Unified CORS Policy**: Permits seamless access from both local development (`http://localhost:5174`) and production (`https://main.d3cukmq7nr5vg3.amplifyapp.com`).

#### 🔹 Zone 3: Serverless Processing Microservice
* **AWS Lambda Microservice** (`re-earth-api-service`):
  * **Runtime**: Python 3.11 with `boto3`.
  * **Cryptographic Verification**: Validates digital signatures on scanned optical tokens.
  * **NIST SP 800-88 R1 Engine**: Calculates data sanitization compliance and environmental impact ($CO_2e$ avoided, eco-credits, and campus XP).
  * **Zero Cold-Start Overhead**: Lightweight bundle size for sub-100ms response times.

#### 🔹 Zone 4: Cloud Persistence, Compliance Vault & Telemetry
* **Amazon DynamoDB NoSQL Tables**:
  * `SmrtKioskReservations`: Handles atomic locker allocation with automated Time-To-Live (`reservationExpiresAt`) to auto-expire unredeemed holds without custom cron jobs.
  * `SmrtInstitutionalLedger`: Immutable ledger tracking university-wide recycling volume, inter-college derbies (e.g., DTU vs. NSUT vs. IIT Bombay), and verified corporate sponsor contributions.
* **Amazon S3 Compliance Vault** (`re-earth-certificates-346560662330`):
  * Secure archive for official verification certificates and printable handover passes.
  * **Presigned URLs**: Grants temporary (15–60 min) read access directly to client browsers without exposing public bucket access.
* **Amazon CloudWatch**:
  * **Operational Dashboard**: `RE-EARTH-Amplify-Operations` tracking end-to-end telemetry.
  * **Alarms**: Real-time health check probes ensuring 99.99% uptime and sub-2.5s edge latency.

---

### Live AWS Deployment Reference

| Resource | AWS Identifier | Endpoint / Reference |
| :--- | :--- | :--- |
| **AWS Amplify App** | `d3cukmq7nr5vg3` | [https://main.d3cukmq7nr5vg3.amplifyapp.com](https://main.d3cukmq7nr5vg3.amplifyapp.com) |
| **HTTP API Gateway** | `bzj8npggw7` | `https://bzj8npggw7.execute-api.us-east-1.amazonaws.com` |
| **AWS Lambda** | `re-earth-api-service` | `arn:aws:lambda:us-east-1:346560662330:function:re-earth-api-service` |
| **DynamoDB (Reservations)** | `SmrtKioskReservations` | TTL Enabled on `reservationExpiresAt` |
| **DynamoDB (Ledger)** | `SmrtInstitutionalLedger` | On-Demand (Pay-Per-Request) |
| **S3 Certificate Vault** | `re-earth-certificates-346560662330` | `us-east-1` (Private with Presigned Access) |
| **CloudWatch Dashboard** | `RE-EARTH-Amplify-Operations` | Region: `us-east-1` |
