/**
 * RE—EARTH Sponsor Journey Analytics Instrumentation
 *
 * Implements privacy-preserving event logging for the sponsor journey.
 * Never sends personal identifiable information (PII) such as names or emails.
 */

export type SponsorAnalyticsEvent =
  | 'sponsor_page_view'
  | 'sponsor_package_selected'
  | 'sponsor_form_started'
  | 'sponsor_form_submitted'
  | 'sponsor_form_completed'

export interface SponsorAnalyticsPayload {
  packageId?: string
  packageName?: string
  source?: string
  budgetCategory?: string
  scope?: string
  contributionsCount?: number
  timestamp?: string
  deliveredVia?: string
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackSponsorEvent(
  eventName: SponsorAnalyticsEvent,
  metadata?: SponsorAnalyticsPayload
): void {
  const payload = {
    event: eventName,
    ...metadata,
    timestamp: new Date().toISOString()
  }

  // 1. Dispatch to window.dataLayer if present (e.g. Google Tag Manager / PostHog / Plausible)
  if (typeof window !== 'undefined') {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload)
    }

    // 2. Custom DOM Event for internal components or telemetry hooks
    try {
      window.dispatchEvent(
        new CustomEvent('reearth:sponsor_event', { detail: payload })
      )
    } catch {
      // ignore
    }
  }

  // 3. Debug logging in development mode
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.debug(`[Analytics: ${eventName}]`, payload)
  }
}
