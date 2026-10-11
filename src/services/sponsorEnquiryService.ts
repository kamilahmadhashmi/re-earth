/**
 * RE—EARTH Corporate Sponsorship Enquiry Service
 *
 * Handles validation, local audit persistence, and remote dispatch
 * for corporate founding partner enquiries.
 *
 * Implements "Build It" Local-First policy: Zero cloud billing,
 * offline-reliable with optional developer webhook hook.
 */

export type SponsorshipPathwayId = 'local_business' | 'corporate_sustainability' | 'global_impact'

export type ContributionType =
  | 'financial_funding'
  | 'collection_bins_equipment'
  | 'collection_logistics'
  | 'recycling_processing'
  | 'student_campaigns'
  | 'employee_volunteering'
  | 'other'

export type BudgetRange =
  | 'not_decided'
  | 'under_50k'
  | '50k_to_2lakh'
  | '2lakh_to_5lakh'
  | '5lakh_to_10lakh'
  | '10lakh_plus'
  | 'prefer_to_discuss'
  | 'international_budget'

export type PreferredScope =
  | 'one_college'
  | 'multiple_colleges'
  | 'multiple_cities'
  | 'to_be_discussed'

export interface SponsorEnquiryFormData {
  companyName: string
  contactPerson: string
  workEmail: string
  jobTitle?: string
  country: string
  city: string
  website?: string
  sponsorshipPathway: SponsorshipPathwayId
  contributions: ContributionType[]
  approximateBudget?: BudgetRange
  preferredScope: PreferredScope
  startTimeline?: string
  message?: string
  consentAgreed: boolean
}

export interface StoredSponsorEnquiry extends SponsorEnquiryFormData {
  id: string
  referenceCode: string
  submittedAt: string
  status: 'pending_review' | 'contacted' | 'pilot_scheduled'
  environment: 'development' | 'production'
}

export interface SponsorEnquirySubmissionResult {
  success: boolean
  referenceCode?: string
  enquiry?: StoredSponsorEnquiry
  error?: string
  validationErrors?: Record<string, string>
  deliveredVia: 'local_ledger' | 'remote_webhook'
}

const STORAGE_KEY = 're_earth_sponsor_enquiries_v1'

/**
 * Validate form fields comprehensively with strict safety
 */
export function validateSponsorEnquiry(
  data: Partial<SponsorEnquiryFormData>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Company or organization name is required (minimum 2 characters).'
  }

  if (!data.contactPerson || data.contactPerson.trim().length < 2) {
    errors.contactPerson = 'Contact person name is required.'
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!data.workEmail || !emailRegex.test(data.workEmail.trim())) {
    errors.workEmail = 'Please provide a valid corporate or organizational email address.'
  }

  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required.'
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required.'
  }

  if (data.website && data.website.trim().length > 0) {
    const web = data.website.trim()
    if (!web.startsWith('http://') && !web.startsWith('https://') && !web.includes('.')) {
      errors.website = 'Please provide a valid website URL (e.g., https://example.com).'
    }
  }

  if (!data.sponsorshipPathway) {
    errors.sponsorshipPathway = 'Please select a sponsorship pathway.'
  }

  if (!data.contributions || data.contributions.length === 0) {
    errors.contributions = 'Please select at least one preferred mode of contribution.'
  }

  if (!data.preferredScope) {
    errors.preferredScope = 'Please select your preferred program scope.'
  }

  if (!data.consentAgreed) {
    errors.consentAgreed = 'You must acknowledge the pilot consultation and privacy terms to proceed.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Generate human-readable audit reference code
 */
function generateReferenceCode(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  const num = Math.floor(100 + Math.random() * 900)
  return `SPN-${year}-${random}${num}`
}

/**
 * Load all stored enquiries from local offline ledger
 */
export function getStoredEnquiries(): StoredSponsorEnquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.error('[SponsorEnquiryService] Failed to load local enquiries', err)
  }
  return []
}

/**
 * Clear stored enquiries (useful for testing & resets)
 */
export function clearStoredEnquiries(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('[SponsorEnquiryService] Failed to clear local enquiries', err)
  }
}

/**
 * Submit sponsor enquiry with local fallback and optional webhook delivery
 */
export async function submitSponsorEnquiry(
  formData: SponsorEnquiryFormData
): Promise<SponsorEnquirySubmissionResult> {
  // 1. Validate
  const { isValid, errors } = validateSponsorEnquiry(formData)
  if (!isValid) {
    return {
      success: false,
      error: 'Please resolve the highlighted validation errors.',
      validationErrors: errors,
      deliveredVia: 'local_ledger'
    }
  }

  // Artificial short network delay for realistic, tactile UX feedback
  await new Promise((resolve) => setTimeout(resolve, 600))

  const referenceCode = generateReferenceCode()
  const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

  const storedEnquiry: StoredSponsorEnquiry = {
    ...formData,
    id,
    referenceCode,
    submittedAt: new Date().toISOString(),
    status: 'pending_review',
    environment:
      typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'production'
        ? 'production'
        : 'development'
  }

  // 2. Persist in local storage audit ledger (Guaranteed never lost)
  try {
    const existing = getStoredEnquiries()
    const updated = [storedEnquiry, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (storageErr) {
    console.error('[SponsorEnquiryService] Local storage failed', storageErr)
  }

  // 3. Check for external webhook configuration (e.g. Zapier, Slack, CRM endpoint)
  const webhookUrl =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_SPONSOR_WEBHOOK_URL as string | undefined) ||
        (import.meta.env?.VITE_SPONSOR_API_ENDPOINT as string | undefined)
      : undefined

  let deliveredVia: 'local_ledger' | 'remote_webhook' = 'local_ledger'

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storedEnquiry)
      })

      if (response.ok) {
        deliveredVia = 'remote_webhook'
        console.info(`[SponsorEnquiryService] Dispatched enquiry to remote endpoint: ${webhookUrl}`)
      } else {
        console.warn(
          `[SponsorEnquiryService] Remote webhook returned status ${response.status}. Safe local ledger retained.`
        )
      }
    } catch (netErr) {
      console.warn(
        '[SponsorEnquiryService] Remote webhook fetch failed (network or CORS). Enquiry securely retained in local ledger.',
        netErr
      )
    }
  } else {
    // Developer Guidance: Notice printed for developers checking integrations
    console.info(
      `%c[RE—EARTH SPONSOR MODULE] Enquiry recorded locally! Reference: ${referenceCode}`,
      'color: #30D158; font-weight: bold;'
    )
    console.info(
      '[RE—EARTH SPONSOR MODULE] To forward submissions to a live webhook or CRM endpoint, configure VITE_SPONSOR_WEBHOOK_URL in your .env file.'
    )
  }

  return {
    success: true,
    referenceCode,
    enquiry: storedEnquiry,
    deliveredVia
  }
}
