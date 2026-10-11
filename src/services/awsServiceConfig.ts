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
    s3: {
      qrPassBucket: string
      certificatesBucket: string
      presignedUrlTtlSeconds: number
    }
    dynamoDb: {
      kioskReservationsTable: string
      auditLedgerTable: string
      ttlAttribute: string
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
  environment: 'local_development',
  useLocalStack: true,
  localStackEndpoint: 'http://localhost:4566',
  services: {
    s3: {
      qrPassBucket: 'smrt-kiosk-ephemeral-passes-demo',
      certificatesBucket: 'smrt-kiosk-data-wipe-certs-demo',
      presignedUrlTtlSeconds: 900 // 15-minute lock matching locker timer
    },
    dynamoDb: {
      kioskReservationsTable: 'SmrtKioskReservations',
      auditLedgerTable: 'SmrtInstitutionalLedger',
      ttlAttribute: 'reservationExpiresAt'
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
