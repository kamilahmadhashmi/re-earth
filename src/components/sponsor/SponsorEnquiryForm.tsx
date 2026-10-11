import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  GraduationCap
} from 'lucide-react'
import {
  submitSponsorEnquiry,
  getStoredEnquiries,
  type SponsorEnquiryFormData,
  type SponsorshipPathwayId,
  type ContributionType,
  type BudgetRange,
  type PreferredScope,
  type StoredSponsorEnquiry
} from '../../services/sponsorEnquiryService'
import {
  createSponsorApplication,
  formatInr,
  type SponsorApplication,
  type TargetScope
} from '../../services/sponsorApplicationService'
import { INITIAL_CAMPUSES } from '../../data/campuses'
import { TerraMascot } from './TerraMascot'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'

interface SponsorEnquiryFormProps {
  initialPathway?: SponsorshipPathwayId | null
  onReturnToOrbit: () => void
}

export const SponsorEnquiryForm: React.FC<SponsorEnquiryFormProps> = ({
  initialPathway = 'corporate_sustainability',
  onReturnToOrbit
}) => {
  // Form State
  const [formData, setFormData] = useState<SponsorEnquiryFormData>({
    companyName: '',
    contactPerson: '',
    workEmail: '',
    jobTitle: '',
    country: 'India',
    city: '',
    website: '',
    sponsorshipPathway: initialPathway || 'corporate_sustainability',
    contributions: ['financial_funding', 'collection_bins_equipment'],
    approximateBudget: 'not_decided',
    preferredScope: 'multiple_colleges',
    startTimeline: 'within_60_days',
    message: '',
    consentAgreed: false
  })

  // Sync initial pathway changes when selected from higher section CTAs
  useEffect(() => {
    if (initialPathway) {
      setFormData((prev) => ({
        ...prev,
        sponsorshipPathway: initialPathway
      }))
    }
  }, [initialPathway])

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Target College & Funding Commitment State (Phase 2.1)
  const [targetCollegeMode, setTargetCollegeMode] = useState<TargetScope>('single_college')
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('dtu')
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>(['dtu', 'nsut'])
  const [proposedFundingAmount, setProposedFundingAmount] = useState<number>(500000)
  const [proposedDuration, setProposedDuration] = useState<string>('1 Academic Year (2026–2027)')
  const [createdApplication, setCreatedApplication] = useState<SponsorApplication | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    referenceCode?: string
    enquiry?: StoredSponsorEnquiry
    deliveredVia?: string
    error?: string
  } | null>(null)

  // Dev Audit Ledger Drawer state
  const [showAuditLedger, setShowAuditLedger] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [storedAuditList, setStoredAuditList] = useState<StoredSponsorEnquiry[]>([])

  useEffect(() => {
    setStoredAuditList(getStoredEnquiries())
  }, [submissionResult])

  // Track form started on first input focus
  const handleFirstFocus = () => {
    trackSponsorEvent('sponsor_form_started', {
      packageId: formData.sponsorshipPathway
    })
  }

  // Input change handler
  const handleChange = (
    field: keyof SponsorEnquiryFormData,
    value: unknown
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error on change if already touched
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  // Multi-select contribution toggle
  const toggleContribution = (contribution: ContributionType) => {
    setFormData((prev) => {
      const exists = prev.contributions.includes(contribution)
      const updated = exists
        ? prev.contributions.filter((c) => c !== contribution)
        : [...prev.contributions, contribution]
      return { ...prev, contributions: updated }
    })
    if (errors.contributions) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy.contributions
        return copy
      })
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all required as touched
    setTouched({
      companyName: true,
      contactPerson: true,
      workEmail: true,
      country: true,
      city: true,
      sponsorshipPathway: true,
      contributions: true,
      preferredScope: true,
      consentAgreed: true
    })

    setIsSubmitting(true)
    trackSponsorEvent('sponsor_form_submitted', {
      packageId: formData.sponsorshipPathway,
      budgetCategory: formData.approximateBudget,
      contributionsCount: formData.contributions.length
    })

    try {
      // Map contribution types to human-readable strings
      const contributionLabelMap: Record<string, string> = {
        financial_funding: 'Financial Pilot Grant / CSR Budget',
        collection_bins_equipment: 'Smart IoT Bins & Hardware Equipment',
        collection_logistics: 'Logistics Hauls & Fleet Transport',
        recycling_processing: 'Certified Processing Facility Partnership',
        student_campaigns: 'Student Hackathons & Green Workshops',
        employee_volunteering: 'Corporate Employee Volunteering',
        other: 'Custom In-Kind Contribution'
      }

      const inKindResources = formData.contributions.map(
        (c) => contributionLabelMap[c] || c
      )

      let targetCampusIds: string[] = []
      if (targetCollegeMode === 'single_college') {
        targetCampusIds = [selectedCollegeId]
      } else if (targetCollegeMode === 'multiple_colleges') {
        targetCampusIds = selectedCollegeIds.length > 0 ? selectedCollegeIds : ['dtu', 'nsut']
      } else {
        targetCampusIds = []
      }

      // 1. Create real SponsorApplication for College Admin Dashboard
      const newApp = await createSponsorApplication({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        workEmail: formData.workEmail,
        jobTitle: formData.jobTitle,
        country: formData.country,
        city: formData.city,
        website: formData.website,
        sponsorshipPathway: formData.sponsorshipPathway,
        targetScope: targetCollegeMode,
        targetCampusIds,
        proposedFundingInr: proposedFundingAmount,
        inKindResources,
        proposedDuration,
        objectives: `Corporate sponsorship underwrite for ${targetCollegeMode.replace(/_/g, ' ')}`,
        expectedBenefits: 'Verified digital Scope 3 e-waste certificates & campus co-branding',
        applicationMessage: formData.message,
        submittingUserId: undefined
      })

      setCreatedApplication(newApp)

      // 2. Also record in local audit ledger for backwards compatibility
      const result = await submitSponsorEnquiry(formData)

      setSubmissionResult({
        success: true,
        referenceCode: newApp.referenceCode,
        enquiry: result.enquiry,
        deliveredVia: result.deliveredVia
      })

      trackSponsorEvent('sponsor_form_completed', {
        packageId: formData.sponsorshipPathway,
        deliveredVia: result.deliveredVia
      })
    } catch (err: any) {
      setSubmissionResult({
        success: false,
        error: err?.message || 'A temporary connection error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form to submit another enquiry
  const handleResetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      workEmail: '',
      jobTitle: '',
      country: 'India',
      city: '',
      website: '',
      sponsorshipPathway: 'corporate_sustainability',
      contributions: ['financial_funding'],
      approximateBudget: 'not_decided',
      preferredScope: 'multiple_colleges',
      startTimeline: 'within_60_days',
      message: '',
      consentAgreed: false
    })
    setErrors({})
    setTouched({})
    setSubmissionResult(null)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <section id="enquiry-form" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber">
          Founding Pilot Application
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Initiate a Corporate Sponsorship Enquiry
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Submit your preliminary interest. Our university partnership desk will review your target
          locations and schedule a 30-minute scoping call to tailor the founding pilot agreement.
        </p>
      </div>

      {/* Main Form Container / Card */}
      <div className="rounded-card border border-white/10 liquid-glass p-6 sm:p-10 shadow-liquid-glass relative">
        <AnimatePresence mode="wait">
          {submissionResult && submissionResult.success ? (
            /* ========================================================================= */
            /* SUCCESS STATE                                                            */
            /* ========================================================================= */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-center py-4"
            >
              {/* Mascot Terra in Joyful / Celebrating state */}
              <div className="flex justify-center">
                <TerraMascot pose="celebrating" size={88} speechBubbleText="Proposal Registered!" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber/15 text-amber border border-amber/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  <span>STATUS: PENDING REVIEW</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  Sponsorship Proposal Submitted
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-text-primary">{formData.contactPerson}</strong>. Your sponsorship proposal for{' '}
                  <strong className="text-text-primary">{formData.companyName}</strong> has been saved directly to the university administration portal.
                </p>
              </div>

              {/* Reference & Intended Scope Banner */}
              <div className="max-w-lg mx-auto p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-left">
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                      Application Reference Code
                    </span>
                    <span className="text-base font-mono font-bold text-emerald">
                      {submissionResult.referenceCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(submissionResult.referenceCode!)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald" />
                        <span className="text-emerald">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Scope & College Admin Routing Visibility */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-text-muted uppercase block font-bold">
                    Target Routing & Campus Admin Visibility:
                  </span>
                  {createdApplication?.targetScope === 'single_college' ? (
                    <div className="p-2.5 rounded-xl bg-cyan/[0.06] border border-cyan/20 text-cyan text-xs leading-relaxed">
                      ✓ Directed to <strong>{createdApplication.targetCampusNames.join(', ')}</strong>.
                      <span className="block text-[11px] text-text-secondary mt-0.5">
                        The campus administrator at {createdApplication.targetCampusNames[0]} can now review and evaluate this proposal in their College Admin Dashboard.
                      </span>
                    </div>
                  ) : createdApplication?.targetScope === 'multiple_colleges' ? (
                    <div className="p-2.5 rounded-xl bg-cyan/[0.06] border border-cyan/20 text-cyan text-xs leading-relaxed">
                      ✓ Directed to <strong>{createdApplication.targetCampusNames.join(', ')}</strong>.
                      <span className="block text-[11px] text-text-secondary mt-0.5">
                        Each relevant college admin has visibility into this multi-campus proposal with its full intended scope.
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber/[0.06] border border-amber/20 text-amber text-xs leading-relaxed">
                      ✓ Routed to <strong>RE—EARTH Central Platform Secretariat</strong>.
                      <span className="block text-[11px] text-text-secondary mt-0.5">
                        Our platform coordinators are reviewing your proposal for candidate university matching.
                      </span>
                    </div>
                  )}
                </div>

                {/* Proposed Commitment Details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-text-muted block">Proposed Funding</span>
                    <span className="font-bold text-text-primary">
                      {formatInr(proposedFundingAmount)} / year
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Duration</span>
                    <span className="font-bold text-text-primary">{proposedDuration}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps Timeline Card */}
              <div className="max-w-lg mx-auto text-left p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2.5">
                <span className="font-mono font-bold text-text-muted uppercase text-[10px] tracking-wider block">
                  Application Next Steps
                </span>
                <div className="flex items-start gap-2.5 text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-emerald/15 text-emerald font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span>Campus administration reviews technical feasibility and pod locations.</span>
                </div>
                <div className="flex items-start gap-2.5 text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-cyan/15 text-cyan font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span>Confirmation scoping call scheduled with <strong>{formData.workEmail}</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-amber/15 text-amber font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span>Upon approval, the partnership is verified on the campus skyline and leaderboard.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={onReturnToOrbit}
                  className="px-6 py-3 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Return to 3D Orbit
                </button>

                <button
                  onClick={handleResetForm}
                  className="px-5 py-3 rounded-full liquid-glass-pill liquid-glass-control text-text-secondary hover:text-text-primary text-xs font-semibold tracking-wide transition-all border border-white/10 cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* ACTIVE FORM                                                              */
            /* ========================================================================= */
            <form key="form" onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Recoverable Error Banner */}
              {submissionResult && !submissionResult.success && (
                <div className="p-4 rounded-2xl bg-pink/10 border border-pink/30 flex items-start gap-3 text-xs text-pink">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Submission Incomplete</span>
                    <span>{submissionResult.error}</span>
                  </div>
                </div>
              )}

              {/* 1. Core Organization Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <h3 className="text-xs font-mono font-bold uppercase text-text-primary tracking-wider">
                    1. Organization & Contact Details
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="companyName"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Company or Organization Name <span className="text-pink">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions Ltd."
                      value={formData.companyName}
                      onFocus={handleFirstFocus}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                        errors.companyName
                          ? 'border-pink/50 focus:ring-pink'
                          : 'border-white/10 focus:border-emerald focus:ring-emerald'
                      }`}
                    />
                    {errors.companyName && (
                      <span className="text-[11px] text-pink block">{errors.companyName}</span>
                    )}
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contactPerson"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Contact Person Name <span className="text-pink">*</span>
                    </label>
                    <input
                      id="contactPerson"
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                        errors.contactPerson
                          ? 'border-pink/50 focus:ring-pink'
                          : 'border-white/10 focus:border-emerald focus:ring-emerald'
                      }`}
                    />
                    {errors.contactPerson && (
                      <span className="text-[11px] text-pink block">{errors.contactPerson}</span>
                    )}
                  </div>

                  {/* Work Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="workEmail"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Work Email Address <span className="text-pink">*</span>
                    </label>
                    <input
                      id="workEmail"
                      type="email"
                      required
                      placeholder="e.g. p.sharma@acme.com"
                      value={formData.workEmail}
                      onChange={(e) => handleChange('workEmail', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                        errors.workEmail
                          ? 'border-pink/50 focus:ring-pink'
                          : 'border-white/10 focus:border-emerald focus:ring-emerald'
                      }`}
                    />
                    {errors.workEmail && (
                      <span className="text-[11px] text-pink block">{errors.workEmail}</span>
                    )}
                  </div>

                  {/* Job Title / Dept */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="jobTitle"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Job Title / Department <span className="text-text-muted">(Optional)</span>
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      placeholder="e.g. Head of Sustainability / CSR Director"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="country"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Country <span className="text-pink">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      placeholder="e.g. India"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors"
                    />
                    {errors.country && (
                      <span className="text-[11px] text-pink block">{errors.country}</span>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label htmlFor="city" className="block text-xs font-medium text-text-secondary">
                      City <span className="text-pink">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="e.g. New Delhi / Bengaluru / Mumbai"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                        errors.city
                          ? 'border-pink/50 focus:ring-pink'
                          : 'border-white/10 focus:border-emerald focus:ring-emerald'
                      }`}
                    />
                    {errors.city && (
                      <span className="text-[11px] text-pink block">{errors.city}</span>
                    )}
                  </div>

                  {/* Website */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label
                      htmlFor="website"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Company Website <span className="text-text-muted">(Optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                        errors.website
                          ? 'border-pink/50 focus:ring-pink'
                          : 'border-white/10 focus:border-emerald focus:ring-emerald'
                      }`}
                    />
                    {errors.website && (
                      <span className="text-[11px] text-pink block">{errors.website}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Sponsorship Pathway Selection */}
              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between pb-1">
                  <label className="block text-xs font-mono font-bold uppercase text-text-primary tracking-wider">
                    2. Preferred Sponsorship Pathway <span className="text-pink">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-text-muted">Select one</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'local_business' as SponsorshipPathwayId,
                      title: 'Local Business Partner',
                      desc: 'Single campus initiative'
                    },
                    {
                      id: 'corporate_sustainability' as SponsorshipPathwayId,
                      title: 'Corporate Sustainability',
                      desc: 'Regional multi-campus pilot'
                    },
                    {
                      id: 'global_impact' as SponsorshipPathwayId,
                      title: 'Global Impact Partner',
                      desc: 'Strategic multi-city pilot'
                    }
                  ].map((path) => {
                    const isSelected = formData.sponsorshipPathway === path.id
                    return (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => handleChange('sponsorshipPathway', path.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber/10 border-amber text-text-primary shadow-amber-glow/20'
                            : 'bg-white/[0.02] border-white/10 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-primary">{path.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber" />}
                        </div>
                        <span className="text-[11px] text-text-muted mt-1 block font-mono">
                          {path.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.sponsorshipPathway && (
                  <span className="text-[11px] text-pink block">{errors.sponsorshipPathway}</span>
                )}
              </div>

              {/* 3. Preferred Contributions (Multi-Select) */}
              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between pb-1">
                  <label className="block text-xs font-mono font-bold uppercase text-text-primary tracking-wider">
                    3. Preferred Contribution Modes <span className="text-pink">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-text-muted">
                    Check all that apply
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'financial_funding' as ContributionType,
                      label: 'Financial Funding (Pilot Grant / CSR Budget)'
                    },
                    {
                      id: 'collection_bins_equipment' as ContributionType,
                      label: 'Recycling Bins, Scales or Storage Lockers'
                    },
                    {
                      id: 'collection_logistics' as ContributionType,
                      label: 'Collection Logistics & Transportation Support'
                    },
                    {
                      id: 'recycling_processing' as ContributionType,
                      label: 'Recycling / Processing Facility Partnership'
                    },
                    {
                      id: 'student_campaigns' as ContributionType,
                      label: 'Student Campaigns, Hackathons & Workshops'
                    },
                    {
                      id: 'employee_volunteering' as ContributionType,
                      label: 'Corporate Employee Volunteering on Campus'
                    },
                    {
                      id: 'other' as ContributionType,
                      label: 'Other Custom Mode (Specify in Message)'
                    }
                  ].map((item) => {
                    const isChecked = formData.contributions.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleContribution(item.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald/10 border-emerald/50 text-text-primary'
                            : 'bg-white/[0.02] border-white/10 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                            isChecked
                              ? 'bg-emerald border-emerald text-background'
                              : 'border-white/20 bg-white/5'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.contributions && (
                  <span className="text-[11px] text-pink block">{errors.contributions}</span>
                )}
              </div>

              {/* 4. Target College Selection & Financial Commitment (Phase 2.1) */}
              <div className="space-y-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between pb-1">
                  <label className="block text-xs font-mono font-bold uppercase text-text-primary tracking-wider">
                    4. Target College & Campus Scope <span className="text-pink">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan">Routes directly to College Admin</span>
                </div>

                {/* Target Scope Mode Selector: Single College, Multiple Colleges, Help Choosing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'single_college' as TargetScope,
                      title: 'Specific College',
                      desc: 'Direct proposal to 1 campus'
                    },
                    {
                      id: 'multiple_colleges' as TargetScope,
                      title: 'Multiple Colleges',
                      desc: 'Regional / Inter-campus network'
                    },
                    {
                      id: 'unassigned_needs_matching' as TargetScope,
                      title: 'Help Us Choose',
                      desc: 'Platform Central Matching'
                    }
                  ].map((mode) => {
                    const isSelected = targetCollegeMode === mode.id
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTargetCollegeMode(mode.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan/10 border-cyan text-text-primary shadow-cyan-glow/20'
                            : 'bg-white/[0.02] border-white/10 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-primary">{mode.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan" />}
                        </div>
                        <span className="text-[10px] text-text-muted mt-0.5 block font-mono">
                          {mode.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Single College Selector */}
                {targetCollegeMode === 'single_college' && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <label
                      htmlFor="collegeSelect"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Select Target College Campus <span className="text-pink">*</span>
                    </label>
                    <select
                      id="collegeSelect"
                      value={selectedCollegeId}
                      onChange={(e) => setSelectedCollegeId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-white/10 text-xs text-text-primary focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors font-medium"
                    >
                      {INITIAL_CAMPUSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.shortName}) — {c.city}, {c.country}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-text-muted font-mono">
                      Your proposal will appear directly in the College Admin Dashboard for{' '}
                      <strong className="text-cyan">
                        {INITIAL_CAMPUSES.find((c) => c.id === selectedCollegeId)?.name || 'the selected campus'}
                      </strong>
                      .
                    </p>
                  </div>
                )}

                {/* Multiple Colleges Selector */}
                {targetCollegeMode === 'multiple_colleges' && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                    <label className="block text-xs font-medium text-text-secondary">
                      Select Target College Campuses <span className="text-pink">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {INITIAL_CAMPUSES.slice(0, 8).map((c) => {
                        const isChecked = selectedCollegeIds.includes(c.id)
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCollegeIds((prev) =>
                                isChecked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                              )
                            }}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                              isChecked
                                ? 'bg-cyan/10 border-cyan text-text-primary'
                                : 'bg-white/[0.02] border-white/10 text-text-secondary hover:border-white/20'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                                isChecked ? 'bg-cyan border-cyan text-black' : 'border-white/20 bg-white/5'
                              }`}
                            >
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="truncate">{c.name}</span>
                          </button>
                        )
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-text-muted block">
                      Each targeted college administration will receive this proposal with the multi-campus scope clearly noted.
                    </span>
                  </div>
                )}

                {/* Unassigned / Central Matching Note */}
                {targetCollegeMode === 'unassigned_needs_matching' && (
                  <div className="p-4 rounded-2xl bg-amber/[0.04] border border-amber/20 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-amber font-bold">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Platform Central Secretariat Matching</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed text-[11px]">
                      Your application will be routed to the central RE—EARTH secretariat. Our team will review your criteria, budget, and geographic goals to match your funding with a qualified university in need of recycling infrastructure.
                    </p>
                  </div>
                )}

                {/* Financial Funding & Duration Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Proposed Funding Amount (INR) */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fundingAmount"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Proposed Annual Funding (INR) <span className="text-pink">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald">
                        ₹
                      </span>
                      <input
                        id="fundingAmount"
                        type="number"
                        min="50000"
                        step="50000"
                        value={proposedFundingAmount}
                        onChange={(e) => setProposedFundingAmount(Number(e.target.value))}
                        className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-text-primary font-mono font-bold focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors"
                      />
                    </div>

                    {/* Quick Funding Presets */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[
                        { label: '₹2.5L', val: 250000 },
                        { label: '₹5L', val: 500000 },
                        { label: '₹10L', val: 1000000 },
                        { label: '₹15L', val: 1500000 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProposedFundingAmount(preset.val)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            proposedFundingAmount === preset.val
                              ? 'bg-emerald text-black font-bold'
                              : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Duration */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="proposedDuration"
                      className="block text-xs font-medium text-text-secondary"
                    >
                      Proposed Program Duration <span className="text-pink">*</span>
                    </label>
                    <select
                      id="proposedDuration"
                      value={proposedDuration}
                      onChange={(e) => setProposedDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-white/10 text-xs text-text-primary focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors font-medium"
                    >
                      <option value="6 Months Pilot">6 Months Pilot</option>
                      <option value="1 Academic Year (2026–2027)">1 Academic Year (2026–2027)</option>
                      <option value="2 Academic Years (Multi-Year)">2 Academic Years (Multi-Year)</option>
                      <option value="3 Years Multi-Year Grant">3 Years Multi-Year Grant</option>
                    </select>
                    <span className="text-[10px] font-mono text-text-muted block">
                      Agreed upon prior to campus MoU signing.
                    </span>
                  </div>
                </div>

                {/* Preferred Timeline */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="startTimeline"
                    className="block text-xs font-medium text-text-secondary"
                  >
                    Preferred Start Timeline <span className="text-text-muted">(Optional)</span>
                  </label>
                  <select
                    id="startTimeline"
                    value={formData.startTimeline}
                    onChange={(e) => handleChange('startTimeline', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-white/10 text-xs text-text-primary focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors"
                  >
                    <option value="immediate">Immediate (Next 30 days)</option>
                    <option value="within_60_days">Within 60 days</option>
                    <option value="upcoming_quarter">Next Academic Quarter</option>
                    <option value="exploratory">Exploratory / Next Fiscal Year</option>
                  </select>
                </div>

                {/* Additional Message */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-text-secondary"
                  >
                    Specific Colleges, Material Focus, or Questions <span className="text-text-muted">(Optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Tell us if you have specific target universities (e.g. DTU, IIT Bombay), specific waste categories (e-waste, batteries), or internal CSR criteria."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-colors"
                  />
                </div>
              </div>

              {/* 5. Consent and Privacy Notice */}
              <div className="pt-3 border-t border-white/[0.08] space-y-3">
                <label className="flex items-start gap-3 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentAgreed}
                    onChange={(e) => handleChange('consentAgreed', e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-emerald focus:ring-emerald"
                  />
                  <span>
                    I consent to being contacted by the RE—EARTH university partnership desk regarding
                    the founding corporate sponsorship pilot. I understand that submitting this enquiry
                    does not constitute a binding financial obligation until a formal MoU is agreed.
                  </span>
                </label>
                {errors.consentAgreed && (
                  <span className="text-[11px] text-pink block">{errors.consentAgreed}</span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber hover:brightness-105 active:scale-[0.98] disabled:opacity-50 text-background font-bold text-xs uppercase tracking-wider transition-all shadow-amber-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-background" />
                      <span>Recording Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Founding Partner Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="text-[11px] font-mono text-text-muted text-center sm:text-right">
                  Stored securely in local audit ledger • Zero spam
                </div>
              </div>
            </form>
          )}
        </AnimatePresence>

        {/* Collapsible Local Audit Ledger Toggle for Developers / Reviewers */}
        <div className="pt-6 mt-8 border-t border-white/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAuditLedger((prev) => !prev)}
            className="inline-flex items-center gap-2 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            {showAuditLedger ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Developer / Auditor Ledger ({storedAuditList.length} recorded leads)</span>
          </button>
          <span className="text-[10px] font-mono text-text-subtle">
            Offline Safe • LocalStorage
          </span>
        </div>

        {/* Audit Ledger Expandable Viewer */}
        {showAuditLedger && (
          <div className="mt-4 p-4 rounded-xl bg-background border border-white/10 font-mono text-[11px] space-y-3 max-h-60 overflow-y-auto">
            {storedAuditList.length === 0 ? (
              <div className="text-text-muted">No enquiries recorded yet. Submit the form above to generate an entry.</div>
            ) : (
              storedAuditList.map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-text-primary font-bold">
                    <span>{item.referenceCode} — {item.companyName}</span>
                    <span className="text-[10px] text-emerald">{item.status}</span>
                  </div>
                  <div className="text-text-secondary text-[10px]">
                    Contact: {item.contactPerson} ({item.workEmail}) • Scope: {item.preferredScope} • Pathway: {item.sponsorshipPathway}
                  </div>
                  <div className="text-text-muted text-[9px]">
                    Timestamp: {item.submittedAt}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
