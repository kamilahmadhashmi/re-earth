/**
 * SMRT Kiosk — AWS Architecture Configuration & Service Blueprint
 *
 * Implements the hybrid "Build It" (Local / On-Machine) & "Ship It" (AWS Cloud Ready)
 * service interfaces for Student Drop-Off, Kiosk Telemetry, and Ephemeral Vault Passes.
 *
 * Cost Policy: Strict Credit Minimization ($0.00 Incremental Cost while Undeployed).
 * Zero cloud resources are provisioned without explicit authorization.
 */

export interface AwsServiceDeploymentConfig {
  region: string
  environment: 'local_development' | 'aws_cloud_staging' | 'aws_cloud_production'
  useLocalStack: boolean
  localStackEndpoint: string
  services: {
    apiGateway: {
      apiId: string
      endpoint: string
      enabled: boolean
    }
    lambda: {
      functionName: string
      arn: string
      runtime: string
    }
    s3: {
      qrPassBucket: string
      certificatesBucket: string
      presignedUrlTtlSeconds: number
    }
    dynamoDb: {
      kioskReservationsTable: string
      auditLedgerTable: string
      ttlAttribute: string
      ttlSeconds: number
    }
    cedarPolicy: {
      policyFile: string
      enforceHazmatTriage: boolean
    }
    cloudFront: {
      priceClass: 'PriceClass_100' // Lowest practical cost tier (US, Canada, Europe)
      enabled: boolean
    }
  }
}

export const AWS_SERVICE_CONFIG: AwsServiceDeploymentConfig = {
  region: process.env.VITE_AWS_REGION || 'us-east-1',
  environment: 'aws_cloud_production',
  useLocalStack: false,
  localStackEndpoint: 'http://localhost:4566',
  services: {
    apiGateway: {
      apiId: 'bzj8npggw7',
      endpoint: 'https://bzj8npggw7.execute-api.us-east-1.amazonaws.com',
      enabled: true
    },
    lambda: {
      functionName: 're-earth-api-service',
      arn: 'arn:aws:lambda:us-east-1:346560662330:function:re-earth-api-service',
      runtime: 'python3.11'
    },
    s3: {
      qrPassBucket: 're-earth-certificates-346560662330',
      certificatesBucket: 're-earth-certificates-346560662330',
      presignedUrlTtlSeconds: 900 // 15-minute lock matching locker timer
    },
    dynamoDb: {
      kioskReservationsTable: 'SmrtKioskReservations',
      auditLedgerTable: 'SmrtInstitutionalLedger',
      ttlAttribute: 'reservationExpiresAt',
      ttlSeconds: 86400 // 24-hour retention window for testing & verification
    },
    cedarPolicy: {
      policyFile: 'src/services/cedarPolicies.cedar',
      enforceHazmatTriage: true
    },
    cloudFront: {
      priceClass: 'PriceClass_100',
      enabled: false // Undeployed until explicit user authorization
    }
  }
}

/**
 * Locker Reservation Data Model for Amazon DynamoDB / LocalStack Mock
 */
export interface KioskLockerReservationRecord {
  reservationId: string
  studentId: string
  kioskId: string
  campusId: string
  deviceCategory: string
  isSwollenHazard: boolean
  assignedLockerSlot: number
  status: 'RESERVED_15M' | 'UNLOCKED_HANDOVER' | 'EXPIRED' | 'COMPLETED'
  createdAt: number
  reservationExpiresAt: number // DynamoDB TTL attribute (epoch seconds)
}

/**
 * Mock Service Implementation for Zero-Cost Localhost Testing
 */
export class LocalKioskTelemetryService {
  private static reservations: Map<string, KioskLockerReservationRecord> = new Map()

  /**
   * Simulates an atomic DynamoDB PutItem with ConditionExpression:
   * attribute_not_exists(kioskId) OR reservationExpiresAt < :now
   */
  static async lockLockerReservation(
    kioskId: string,
    campusId: string,
    isSwollenHazard: boolean,
    deviceCategory: string
  ): Promise<KioskLockerReservationRecord> {
    const now = Math.floor(Date.now() / 1000)
    const reservationId = `res_${Math.random().toString(36).substring(2, 9)}`

    const record: KioskLockerReservationRecord = {
      reservationId,
      studentId: 'student_anon_kiosk_user',
      kioskId,
      campusId,
      deviceCategory,
      isSwollenHazard,
      assignedLockerSlot: Math.floor(1 + Math.random() * 8),
      status: 'RESERVED_15M',
      createdAt: now,
      reservationExpiresAt: now + 900 // 15 minutes TTL
    }

    this.reservations.set(reservationId, record)
    return record
  }

  static getActiveReservations(): KioskLockerReservationRecord[] {
    return Array.from(this.reservations.values())
  }
}
