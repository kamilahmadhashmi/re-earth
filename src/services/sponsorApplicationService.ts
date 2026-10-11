/**
 * RE—EARTH Corporate Sponsorship Application Service
 *
 * Implements end-to-end Sponsor-to-College-Admin application lifecycle,
 * role-based access control (RBAC), multi-campus targeting, audit status history,
 * and verified campus partnership registration.
 *
 * Adheres to AWS "Build It" Open Source Local-First policy (zero cloud billing).
 */

import type { UserProfile } from '../types/auth'
import { INITIAL_CAMPUSES, type Campus } from '../data/campuses'
import { SPONSORS, type Sponsor } from '../data/sponsors'

export type SponsorshipPathwayId = 'local_business' | 'corporate_sustainability' | 'global_impact'

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'info_requested'
  | 'approved'
  | 'rejected'
  | 'withdrawn'

export type TargetScope = 'single_college' | 'multiple_colleges' | 'unassigned_needs_matching'

export interface ApplicationStatusHistoryEntry {
  id: string
  fromStatus: ApplicationStatus
  toStatus: ApplicationStatus
  changedAt: string
  changedBy: {
    id: string
    name: string
    role: string
    campusId?: string
  }
  reason?: string
  notes?: string
}

export interface SponsorApplication {
  id: string
  referenceCode: string
  companyName: string
  companyLogoUrl?: string
  contactPerson: string
  workEmail: string
  jobTitle?: string
  country: string
  city: string
  website?: string
  sponsorshipPathway: SponsorshipPathwayId
  targetScope: TargetScope
  targetCampusIds: string[]
  targetCampusNames: string[]
  proposedFundingInr: number
  proposedFundingDisplay: string
  inKindResources: string[]
  proposedDuration: string
  objectives?: string
  expectedBenefits?: string
  applicationMessage?: string
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
  submittingUserId?: string
  reviewingAdminId?: string
  reviewingAdminName?: string
  rejectionReason?: string
  internalNotes?: string
  statusHistory: ApplicationStatusHistoryEntry[]
}

export interface ApplicationMetrics {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  withdrawn: number
  totalProposedFundingInr: number
}

const STORAGE_APPLICATIONS_KEY = 're_earth_sponsor_applications_v1'
const STORAGE_CAMPUSES_KEY = 're_earth_campuses_v1'

/**
 * Pre-seeded realistic demo applications to showcase DTU, NSUT,
 * multi-campus proposals, and unassigned central secretariat proposals.
 */
const SEED_APPLICATIONS: SponsorApplication[] = [
  // 1. DTU Target: Cisco CleanTech Systems (Pending)
  {
    id: 'app_seed_dtu_cisco',
    referenceCode: 'SPN-2026-DTU-4821',
    companyName: 'Cisco CleanTech Systems',
    companyLogoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Meera Nambiar',
    workEmail: 'meera.nambiar@cisco.example.com',
    jobTitle: 'Head of Circular Logistics & ESG Initiatives',
    country: 'India',
    city: 'Bengaluru',
    website: 'https://cisco.com/sustainability',
    sponsorshipPathway: 'corporate_sustainability',
    targetScope: 'single_college',
    targetCampusIds: ['dtu'],
    targetCampusNames: ['Delhi Technological University'],
    proposedFundingInr: 500000,
    proposedFundingDisplay: '₹5,00,000 / year',
    inKindResources: [
      '4x Smart IoT Collection Bins',
      'Telemetry & Sensor Analytics Modules',
      'Electronic Board Component Scanners'
    ],
    proposedDuration: '1 Academic Year (2026–2027)',
    objectives: 'Establish an automated lithium and PCB diversion hub in northern Delhi universities.',
    expectedBenefits: 'Verified digital waste diversion certificates, campus co-branding, quarterly faculty reports.',
    applicationMessage: 'We would love to sponsor DTU’s upcoming hostel collection drive and equip the mechanical engineering block with smart scales.',
    status: 'pending',
    submittedAt: '2026-10-09T09:30:00.000Z',
    updatedAt: '2026-10-09T09:30:00.000Z',
    statusHistory: [
      {
        id: 'hist_seed_01',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-09T09:30:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        },
        notes: 'Initial corporate sponsorship proposal registered through public Become a Sponsor page.'
      }
    ]
  },

  // 2. DTU Target: Tata Sustainability Circular Mobility (Under Review)
  {
    id: 'app_seed_dtu_tata',
    referenceCode: 'SPN-2026-DTU-7102',
    companyName: 'Tata Sustainability Mobility',
    companyLogoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Vikramaditya Rao',
    workEmail: 'v.rao@tatasustainability.example.com',
    jobTitle: 'Director of Northern India Circular Alliances',
    country: 'India',
    city: 'New Delhi',
    website: 'https://tatasustainability.com',
    sponsorshipPathway: 'corporate_sustainability',
    targetScope: 'single_college',
    targetCampusIds: ['dtu'],
    targetCampusNames: ['Delhi Technological University'],
    proposedFundingInr: 850000,
    proposedFundingDisplay: '₹8,50,000 / year',
    inKindResources: [
      '2x Electric Cargo Vans for Kabadiwala Route Hauls',
      'Industrial Battery Isolation Chambers',
      'Semi-annual Student Fellowship Grants'
    ],
    proposedDuration: '2 Academic Years (Multi-Year)',
    objectives: 'Integrate the informal waste-picker kabadiwala ecosystem with university engineering labs.',
    expectedBenefits: 'ESG Scope 3 decarbonization credits, joint research publication with DTU Environmental Engineering.',
    applicationMessage: 'Our team has reviewed DTU’s weekly diversion figures. We propose underwriting a 2-year dedicated EV collection corridor.',
    status: 'under_review',
    submittedAt: '2026-10-07T14:15:00.000Z',
    updatedAt: '2026-10-08T11:20:00.000Z',
    reviewingAdminId: 'usr_admin_dtu_lead',
    reviewingAdminName: 'Kavita Sharma',
    internalNotes: 'Dean office scheduled preliminary meeting with Tata ESG representative for October 18.',
    statusHistory: [
      {
        id: 'hist_seed_02a',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-07T14:15:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        }
      },
      {
        id: 'hist_seed_02b',
        fromStatus: 'pending',
        toStatus: 'under_review',
        changedAt: '2026-10-08T11:20:00.000Z',
        changedBy: {
          id: 'usr_admin_dtu_lead',
          name: 'Kavita Sharma',
          role: 'college_admin',
          campusId: 'dtu'
        },
        notes: 'Transferred to campus sustainability review committee for logistics route assessment.'
      }
    ]
  },

  // 3. NSUT Target: Schneider Electric India (Pending)
  {
    id: 'app_seed_nsut_schneider',
    referenceCode: 'SPN-2026-NSUT-3918',
    companyName: 'Schneider Electric India',
    companyLogoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Ananya Deshmukh',
    workEmail: 'ananya.deshmukh@se.example.com',
    jobTitle: 'VP Sustainability & Smart Grids',
    country: 'India',
    city: 'Gurugram',
    website: 'https://se.com/in',
    sponsorshipPathway: 'corporate_sustainability',
    targetScope: 'single_college',
    targetCampusIds: ['nsut'],
    targetCampusNames: ['Netaji Subhas University of Technology'],
    proposedFundingInr: 450000,
    proposedFundingDisplay: '₹4,50,000 / year',
    inKindResources: [
      'Solar-Powered Battery Sorting Kiosks',
      'High-Precision Digital Weighbridges',
      'Student Hackathon Prize Sponsorship'
    ],
    proposedDuration: '1 Academic Year (2026–2027)',
    objectives: 'Drive student engagement and safe battery recovery at NSUT Dwarka campus.',
    expectedBenefits: 'Brand prominence on campus bins, student innovation awards, verified tonnage offset.',
    applicationMessage: 'We are eager to partner with Dr. Mukherjee and the NSUT Sustainability Council on solar e-waste kiosks.',
    status: 'pending',
    submittedAt: '2026-10-10T11:00:00.000Z',
    updatedAt: '2026-10-10T11:00:00.000Z',
    statusHistory: [
      {
        id: 'hist_seed_03',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-10T11:00:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        },
        notes: 'Submitted via public Become a Sponsor page targeting NSUT.'
      }
    ]
  },

  // 4. NSUT Target: Wipro Earthian Initiative (Under Review)
  {
    id: 'app_seed_nsut_wipro',
    referenceCode: 'SPN-2026-NSUT-6120',
    companyName: 'Wipro Earthian',
    companyLogoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Rohan Sengupta',
    workEmail: 'rohan.sengupta@wipro.example.com',
    jobTitle: 'Campus Ecology Lead',
    country: 'India',
    city: 'Noida',
    website: 'https://wipro.com/sustainability',
    sponsorshipPathway: 'local_business',
    targetScope: 'single_college',
    targetCampusIds: ['nsut'],
    targetCampusNames: ['Netaji Subhas University of Technology'],
    proposedFundingInr: 300000,
    proposedFundingDisplay: '₹3,00,000 / year',
    inKindResources: [
      'Eco-Scholarships for 10 Student Volunteers',
      'Campus Recycling Awareness Workshops'
    ],
    proposedDuration: '6 Months Pilot',
    objectives: 'Seed student-led waste segregation in residence halls.',
    expectedBenefits: 'Student fellowship certificates, monthly collection dashboards.',
    applicationMessage: 'Offering 10 funded eco-scholarships for student waste ambassadors at NSUT.',
    status: 'under_review',
    submittedAt: '2026-10-06T15:20:00.000Z',
    updatedAt: '2026-10-07T10:00:00.000Z',
    reviewingAdminId: 'usr_admin_nsut_dean',
    reviewingAdminName: 'Dr. R. K. Mukherjee',
    internalNotes: 'Reviewing budget allocation with NSUT student welfare committee.',
    statusHistory: [
      {
        id: 'hist_seed_04a',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-06T15:20:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        }
      },
      {
        id: 'hist_seed_04b',
        fromStatus: 'pending',
        toStatus: 'under_review',
        changedAt: '2026-10-07T10:00:00.000Z',
        changedBy: {
          id: 'usr_admin_nsut_dean',
          name: 'Dr. R. K. Mukherjee',
          role: 'college_admin',
          campusId: 'nsut'
        },
        notes: 'Evaluation initiated for student stipend distribution mechanics.'
      }
    ]
  },

  // 5. Multi-Campus: Infosys Green Initiative (Targeting DTU & NSUT)
  {
    id: 'app_seed_multi_infosys',
    referenceCode: 'SPN-2026-NCR-9912',
    companyName: 'Infosys Green Delhi-NCR Corridor',
    companyLogoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Sudhir Murthy',
    workEmail: 'sudhir.murthy@infosys.example.com',
    jobTitle: 'Regional CSR Lead — Northern Hubs',
    country: 'India',
    city: 'New Delhi',
    website: 'https://infosys.com/sustainability',
    sponsorshipPathway: 'global_impact',
    targetScope: 'multiple_colleges',
    targetCampusIds: ['dtu', 'nsut'],
    targetCampusNames: [
      'Delhi Technological University',
      'Netaji Subhas University of Technology'
    ],
    proposedFundingInr: 1200000,
    proposedFundingDisplay: '₹12,00,000 / year (₹6L per Campus)',
    inKindResources: [
      'Dual Campus Digital Leaderboard Terminals',
      'Cross-Campus Kabadiwala Fair-Wage Incentive Fund',
      'Direct Cloud Telemetry API Integrations'
    ],
    proposedDuration: '2 Academic Years (2026–2028)',
    objectives: 'Establish a cooperative Delhi inter-collegiate circular electronic recycling corridor.',
    expectedBenefits: 'Cross-campus green derby showcase, joint university press releases, state government citation.',
    applicationMessage: 'We want to sponsor both DTU and NSUT simultaneously to foster friendly inter-college recycling competition.',
    status: 'pending',
    submittedAt: '2026-10-08T16:45:00.000Z',
    updatedAt: '2026-10-08T16:45:00.000Z',
    statusHistory: [
      {
        id: 'hist_seed_05',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-08T16:45:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        },
        notes: 'Multi-campus proposal broadcast to authorized administrators at DTU and NSUT.'
      }
    ]
  },

  // 6. Unassigned / Central Matching: Patagonia Global Circularity Fund
  {
    id: 'app_seed_unassigned_patagonia',
    referenceCode: 'SPN-2026-CENTRAL-1044',
    companyName: 'Patagonia Global Circularity Fund',
    companyLogoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'Elena Rostova',
    workEmail: 'elena.rostova@patagoniafund.example.com',
    jobTitle: 'Global Grant Portfolio Manager',
    country: 'United States',
    city: 'Ventura',
    website: 'https://patagonia.com/actionworks',
    sponsorshipPathway: 'global_impact',
    targetScope: 'unassigned_needs_matching',
    targetCampusIds: [],
    targetCampusNames: ['Central Matching / Secretariat Allocation'],
    proposedFundingInr: 1500000,
    proposedFundingDisplay: '₹15,00,000 / year ($18,000 USD)',
    inKindResources: [
      'Open-source Waste Hardware Blueprints',
      'International Grassroots Certification Support'
    ],
    proposedDuration: '3 Academic Years Multi-Year Grant',
    objectives: 'Identify the highest-potential urban public engineering campus in India for full circular transformation.',
    expectedBenefits: 'Global impact case study, documentary feature, zero-carbon university accreditation.',
    applicationMessage: 'We request the RE—EARTH central secretariat team to match our funding with a high-impact campus needing infrastructure.',
    status: 'pending',
    submittedAt: '2026-10-05T08:10:00.000Z',
    updatedAt: '2026-10-05T08:10:00.000Z',
    statusHistory: [
      {
        id: 'hist_seed_06',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-10-05T08:10:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        },
        notes: 'Routed to Central Platform Secretariat for campus evaluation and candidate matching.'
      }
    ]
  },

  // 7. DTU Target: Rejected Application (Audit compliance demonstration)
  {
    id: 'app_seed_dtu_rejected',
    referenceCode: 'SPN-2026-DTU-1190',
    companyName: 'QuickScrap Direct Liquidators',
    companyLogoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=80&auto=format&fit=crop&q=80',
    contactPerson: 'K. L. Bansal',
    workEmail: 'bansal@quickscrap.example.com',
    jobTitle: 'Managing Partner',
    country: 'India',
    city: 'Delhi',
    sponsorshipPathway: 'local_business',
    targetScope: 'single_college',
    targetCampusIds: ['dtu'],
    targetCampusNames: ['Delhi Technological University'],
    proposedFundingInr: 100000,
    proposedFundingDisplay: '₹1,00,000 / year',
    inKindResources: ['Bulk Collection Gunny Bags'],
    proposedDuration: '3 Months',
    status: 'rejected',
    submittedAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-30T14:30:00.000Z',
    reviewingAdminId: 'usr_admin_dtu_lead',
    reviewingAdminName: 'Kavita Sharma',
    rejectionReason: 'Applicant lacks certified hazardous lithium battery handling and CPCB e-waste compliance certificates.',
    internalNotes: 'Disqualified per institutional safety guidelines section 4.2 (Hazmat standard non-compliance).',
    statusHistory: [
      {
        id: 'hist_seed_07a',
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: '2026-09-28T10:00:00.000Z',
        changedBy: {
          id: 'system_intake',
          name: 'Platform Public Intake Portal',
          role: 'system'
        }
      },
      {
        id: 'hist_seed_07b',
        fromStatus: 'pending',
        toStatus: 'rejected',
        changedAt: '2026-09-30T14:30:00.000Z',
        changedBy: {
          id: 'usr_admin_dtu_lead',
          name: 'Kavita Sharma',
          role: 'college_admin',
          campusId: 'dtu'
        },
        reason: 'Applicant lacks certified hazardous lithium battery handling and CPCB e-waste compliance certificates.'
      }
    ]
  }
]

// In-memory working copy
let inMemoryApplications: SponsorApplication[] = loadApplicationsFromStorage()

function loadApplicationsFromStorage(): SponsorApplication[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_APPLICATIONS_KEY) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('[SponsorApplicationService] Failed to load applications from localStorage', err)
  }
  return [...SEED_APPLICATIONS]
}

function persistApplications(apps: SponsorApplication[]): void {
  inMemoryApplications = apps
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(apps))
    }
  } catch (err) {
    console.error('[SponsorApplicationService] Failed to persist applications to localStorage', err)
  }
}

/**
 * Access Control Enforcement:
 * Check if the authenticated user has permission to view an application.
 */
export function canUserViewApplication(user: UserProfile | null | undefined, app: SponsorApplication): boolean {
  if (!user) return false

  // Central administrators can inspect all applications
  if (user.role === 'central_admin') return true

  // College administrators can inspect applications targeting their campus
  if (user.role === 'college_admin') {
    return app.targetCampusIds.includes(user.campusId)
  }

  return false
}

/**
 * Access Control Enforcement:
 * Check if the authenticated user has permission to update an application.
 */
export function canUserManageApplication(user: UserProfile | null | undefined, app: SponsorApplication): boolean {
  if (!user) return false

  // Central administrators can manage cross-campus or unassigned proposals
  if (user.role === 'central_admin') return true

  // College administrators can manage proposals directed to their campus
  if (user.role === 'college_admin') {
    return app.targetCampusIds.includes(user.campusId)
  }

  return false
}

/**
 * Retrieve all applications authorized for the current user.
 * Filters strictly to prevent confidential information leakage between universities.
 */
export function getApplicationsForUser(user: UserProfile | null | undefined): SponsorApplication[] {
  if (!user) return []

  const all = [...inMemoryApplications]

  if (user.role === 'central_admin') {
    return all
  }

  if (user.role === 'college_admin') {
    return all.filter((app) => app.targetCampusIds.includes(user.campusId))
  }

  return []
}

/**
 * Calculate dynamic application summary metrics from actual database records.
 */
export function getApplicationMetrics(user: UserProfile | null | undefined): ApplicationMetrics {
  const apps = getApplicationsForUser(user)

  const pending = apps.filter((a) => a.status === 'pending').length
  const underReview = apps.filter((a) => a.status === 'under_review' || a.status === 'info_requested').length
  const approved = apps.filter((a) => a.status === 'approved').length
  const rejected = apps.filter((a) => a.status === 'rejected').length
  const withdrawn = apps.filter((a) => a.status === 'withdrawn').length
  const total = apps.length
  const totalProposedFundingInr = apps.reduce((sum, a) => sum + (a.proposedFundingInr || 0), 0)

  return {
    total,
    pending,
    underReview,
    approved,
    rejected,
    withdrawn,
    totalProposedFundingInr
  }
}

/**
 * Retrieve a single application by ID with strict authorization validation.
 */
export function getApplicationById(id: string, user: UserProfile | null | undefined): SponsorApplication | null {
  const app = inMemoryApplications.find((a) => a.id === id)
  if (!app) return null

  if (!canUserViewApplication(user, app)) {
    throw new Error('403 Forbidden: You are not authorized to view applications for this campus.')
  }

  return { ...app }
}

/**
 * Generate human-readable reference code for sponsor applications
 */
export function generateApplicationReference(campusShortOrPrefix: string): string {
  const year = new Date().getFullYear()
  const cleanPrefix = (campusShortOrPrefix || 'CAMPUS').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `SPN-${year}-${cleanPrefix}-${randomNum}`
}

/**
 * Format currency in Indian Rupees with comma separation
 */
export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Create a new sponsor application from the public Become a Sponsor page.
 * Initial status is ALWAYS 'pending'. Never auto-approved.
 */
export async function createSponsorApplication(params: {
  companyName: string
  contactPerson: string
  workEmail: string
  jobTitle?: string
  country: string
  city: string
  website?: string
  sponsorshipPathway: SponsorshipPathwayId
  targetScope: TargetScope
  targetCampusIds: string[]
  proposedFundingInr: number
  inKindResources: string[]
  proposedDuration: string
  objectives?: string
  expectedBenefits?: string
  applicationMessage?: string
  submittingUserId?: string
}): Promise<SponsorApplication> {
  const now = new Date().toISOString()
  const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  // Resolve target campus names
  const targetCampusNames: string[] = []
  if (params.targetCampusIds.length > 0) {
    for (const cid of params.targetCampusIds) {
      const match = INITIAL_CAMPUSES.find((c) => c.id === cid)
      if (match) targetCampusNames.push(match.name)
      else targetCampusNames.push(cid.toUpperCase())
    }
  } else {
    targetCampusNames.push('Platform Central Matching')
  }

  const prefix = params.targetCampusIds.length === 1 ? params.targetCampusIds[0].toUpperCase() : 'MULTI'
  const referenceCode = generateApplicationReference(prefix)

  const newApp: SponsorApplication = {
    id,
    referenceCode,
    companyName: params.companyName.trim(),
    contactPerson: params.contactPerson.trim(),
    workEmail: params.workEmail.trim(),
    jobTitle: params.jobTitle?.trim() || undefined,
    country: params.country.trim(),
    city: params.city.trim(),
    website: params.website?.trim() || undefined,
    sponsorshipPathway: params.sponsorshipPathway,
    targetScope: params.targetScope,
    targetCampusIds: params.targetCampusIds,
    targetCampusNames,
    proposedFundingInr: params.proposedFundingInr,
    proposedFundingDisplay: `${formatInr(params.proposedFundingInr)} / year`,
    inKindResources: params.inKindResources,
    proposedDuration: params.proposedDuration,
    objectives: params.objectives,
    expectedBenefits: params.expectedBenefits,
    applicationMessage: params.applicationMessage,
    status: 'pending', // Strictly initialized as pending per requirement
    submittedAt: now,
    updatedAt: now,
    submittingUserId: params.submittingUserId,
    statusHistory: [
      {
        id: `hist_${Date.now()}_init`,
        fromStatus: 'pending',
        toStatus: 'pending',
        changedAt: now,
        changedBy: {
          id: params.submittingUserId || 'public_applicant',
          name: params.contactPerson,
          role: 'applicant'
        },
        notes: `Application submitted targeting ${targetCampusNames.join(', ')}.`
      }
    ]
  }

  // Artificial tactile feedback delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  persistApplications([newApp, ...inMemoryApplications])

  console.info(
    `%c[RE—EARTH SPONSOR APPLICATION] New application created: ${referenceCode} (${newApp.companyName}) -> [${targetCampusNames.join(', ')}]`,
    'color: #30D158; font-weight: bold;'
  )

  return newApp
}

/**
 * Update the status of an existing application with authorization enforcement,
 * status history audit trail, and campus partnership activation upon approval.
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  actor: UserProfile,
  options?: {
    reason?: string
    notes?: string
  }
): Promise<SponsorApplication> {
  const appIndex = inMemoryApplications.findIndex((a) => a.id === applicationId)
  if (appIndex === -1) {
    throw new Error('Application not found.')
  }

  const currentApp = inMemoryApplications[appIndex]

  // Enforce access control
  if (!canUserManageApplication(actor, currentApp)) {
    throw new Error('403 Forbidden: You are not authorized to update applications for this campus.')
  }

  // Validate rejection reason
  if (newStatus === 'rejected' && (!options?.reason || options.reason.trim().length < 5)) {
    throw new Error('A detailed reason is required to reject a sponsorship application.')
  }

  const now = new Date().toISOString()
  const historyEntry: ApplicationStatusHistoryEntry = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fromStatus: currentApp.status,
    toStatus: newStatus,
    changedAt: now,
    changedBy: {
      id: actor.id,
      name: actor.name,
      role: actor.role,
      campusId: actor.campusId
    },
    reason: options?.reason,
    notes: options?.notes
  }

  const updatedApp: SponsorApplication = {
    ...currentApp,
    status: newStatus,
    updatedAt: now,
    reviewingAdminId: actor.id,
    reviewingAdminName: actor.name,
    rejectionReason: newStatus === 'rejected' ? options?.reason : currentApp.rejectionReason,
    internalNotes: options?.notes ? `${currentApp.internalNotes ? currentApp.internalNotes + '\n' : ''}[${new Date().toLocaleDateString()}] ${options.notes}` : currentApp.internalNotes,
    statusHistory: [historyEntry, ...currentApp.statusHistory]
  }

  const updatedList = [...inMemoryApplications]
  updatedList[appIndex] = updatedApp
  persistApplications(updatedList)

  // CONSEQUENTIAL ACTION: When an application is approved, promote to active verified partnership
  if (newStatus === 'approved') {
    await registerApprovedPartnership(updatedApp, actor)
  }

  return updatedApp
}

/**
 * Add internal notes to an application without changing its status.
 */
export async function addApplicationInternalNote(
  applicationId: string,
  noteText: string,
  actor: UserProfile
): Promise<SponsorApplication> {
  const appIndex = inMemoryApplications.findIndex((a) => a.id === applicationId)
  if (appIndex === -1) {
    throw new Error('Application not found.')
  }

  const currentApp = inMemoryApplications[appIndex]
  if (!canUserManageApplication(actor, currentApp)) {
    throw new Error('403 Forbidden: You are not authorized to add notes to this application.')
  }

  const now = new Date().toISOString()
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  const formattedNote = `[${dateStr} by ${actor.name}]: ${noteText.trim()}`
  const combinedNotes = currentApp.internalNotes
    ? `${formattedNote}\n${currentApp.internalNotes}`
    : formattedNote

  const updatedApp: SponsorApplication = {
    ...currentApp,
    updatedAt: now,
    internalNotes: combinedNotes
  }

  const updatedList = [...inMemoryApplications]
  updatedList[appIndex] = updatedApp
  persistApplications(updatedList)

  return updatedApp
}

/**
 * Helper: Register or update approved partnership record in local storage campus dataset
 */
async function registerApprovedPartnership(app: SponsorApplication, admin: UserProfile): Promise<void> {
  try {
    const rawCampuses = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_CAMPUSES_KEY) : null
    let campuses: Campus[] = rawCampuses ? JSON.parse(rawCampuses) : [...INITIAL_CAMPUSES]

    // Create a normalized sponsor ID from company name
    const sponsorSlug = app.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)

    // Check if sponsor already exists in SPONSORS list or create dynamic entry
    let sponsor = SPONSORS.find((s) => s.id === sponsorSlug)
    if (!sponsor) {
      sponsor = {
        id: sponsorSlug,
        name: app.companyName,
        ticker: app.companyName.slice(0, 5).toUpperCase(),
        color: '#10B981',
        accentColor: '#34D399',
        logoText: app.companyName.slice(0, 6).toUpperCase(),
        description: `Verified Corporate Partner — ${app.proposedDuration}`,
        website: app.website || 'https://re-earth.eco'
      }
      SPONSORS.push(sponsor)
    }

    // Link targeted campuses to this approved sponsor
    const campusesToUpdate = app.targetCampusIds.length > 0 ? app.targetCampusIds : [admin.campusId]

    campuses = campuses.map((campus) => {
      if (campusesToUpdate.includes(campus.id)) {
        return {
          ...campus,
          sponsorId: sponsorSlug
        }
      }
      return campus
    })

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_CAMPUSES_KEY, JSON.stringify(campuses))
    }

    console.info(
      `%c[RE—EARTH PARTNERSHIP VERIFIED] Campus(es) [${campusesToUpdate.join(', ')}] linked with sponsor '${app.companyName}' (${sponsorSlug}).`,
      'color: #10B981; font-weight: bold;'
    )
  } catch (err) {
    console.error('[SponsorApplicationService] Failed to link approved partnership in campus data', err)
  }
}

/**
 * Reset applications back to seed state (useful for automated testing)
 */
export function resetApplicationsToSeed(): void {
  inMemoryApplications = [...SEED_APPLICATIONS]
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(SEED_APPLICATIONS))
    }
  } catch {}
}
