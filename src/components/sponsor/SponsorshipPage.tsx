import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Sparkles,
  ArrowLeft,
  Menu,
  X,
  Send,
  RotateCcw
} from 'lucide-react'
import { SponsorshipHero } from './SponsorshipHero'
import { ProblemOpportunitySection } from './ProblemOpportunitySection'
import { EcosystemFlowSection } from './EcosystemFlowSection'
import { SponsorPathwaysSection } from './SponsorPathwaysSection'
import { SponsorBenefitsSection } from './SponsorBenefitsSection'
import { LeaderboardPreviewSection } from './LeaderboardPreviewSection'
import { FoundingPilotSection } from './FoundingPilotSection'
import { FundingAllocationSection } from './FundingAllocationSection'
import { SponsorEnquiryForm } from './SponsorEnquiryForm'
import { SponsorshipFAQSection } from './SponsorshipFAQSection'
import { SponsorshipCTASection } from './SponsorshipCTASection'
import type { SponsorshipPathwayId } from '../../services/sponsorEnquiryService'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'

interface SponsorshipPageProps {
  onReturnToOrbit: () => void
  initialPrefillPathway?: SponsorshipPathwayId | null
}

export const SponsorshipPage: React.FC<SponsorshipPageProps> = ({
  onReturnToOrbit,
  initialPrefillPathway = 'corporate_sustainability'
}) => {
  const [selectedPathway, setSelectedPathway] = useState<SponsorshipPathwayId | null>(
    initialPrefillPathway || 'corporate_sustainability'
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  // SEO Page Title and Meta Tags
  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Founding Corporate Partnerships | RE—EARTH Campus Recycling'

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    const originalDesc = metaDesc?.getAttribute('content') || ''
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      'Partner with universities and local recycling workers to power measurable campus waste diversion. Join the RE—EARTH founding corporate pilot.'
    )

    trackSponsorEvent('sponsor_page_view', { source: 'sponsorship_page_mount' })

    // Keyboard ESC listener to return to 3D orbit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReturnToOrbit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.title = originalTitle
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc)
      }
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onReturnToOrbit])

  // Sync initial prefill pathway
  useEffect(() => {
    if (initialPrefillPathway) {
      setSelectedPathway(initialPrefillPathway)
    }
  }, [initialPrefillPathway])

  // Scroll to section helper
  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false)
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle pathway selection from Pathway Cards
  const handleSelectPathway = (pathwayId: SponsorshipPathwayId) => {
    setSelectedPathway(pathwayId)
    scrollTo('enquiry-form')
  }

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem-opportunity', label: 'Problem & Opportunity' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pathways', label: 'Pathways' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'leaderboard-preview', label: 'Leaderboard' },
    { id: 'pilot-roadmap', label: '90-Day Pilot' },
    { id: 'budget-allocation', label: 'Allocation' },
    { id: 'enquiry-form', label: 'Apply' },
    { id: 'faq', label: 'FAQ' }
  ]

  return (
    <div className="relative min-h-screen bg-background text-text-primary selection:bg-emerald selection:text-background overflow-x-hidden">
      {/* ========================================================================= */}
      {/* FIXED OBSIDIAN TOP HEADER FOR SPONSORSHIP PORTAL                          */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
          {/* Left: Brand Pill & Return to Orbit button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToOrbit}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0E1015]/90 backdrop-blur-xl border border-white/[0.08] shadow-spatial group cursor-pointer hover:border-white/20 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-emerald/15 flex items-center justify-center text-emerald">
                <Globe2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold tracking-tight text-xs text-text-primary">
                RE<span className="text-emerald font-extrabold mx-0.5">—</span>EARTH
              </span>
              <span className="text-[10px] font-mono text-emerald border-l border-white/10 pl-2 hidden sm:inline">
                SPONSOR PORTAL
              </span>
            </button>
          </div>

          {/* Center: Desktop Nav Anchors */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-[#0E1015]/90 backdrop-blur-xl border border-white/[0.08] shadow-spatial text-xs font-medium">
            {navLinks.slice(0, 7).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('faq')}
              className="px-3 py-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Primary Action to Jump to Form */}
            <button
              onClick={() => scrollTo('enquiry-form')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 active:scale-[0.97] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Apply to Sponsor</span>
            </button>

            {/* Return to 3D Orbit Button */}
            <button
              onClick={onReturnToOrbit}
              title="Return to 3D Orbit (Esc)"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E1015]/90 backdrop-blur-xl border border-white/[0.08] text-xs font-mono text-text-secondary hover:text-text-primary cursor-pointer hover:border-white/20 transition-all shadow-spatial"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald" />
              <span className="hidden md:inline">Back to Orbit</span>
              <kbd className="hidden lg:inline text-[9px] font-mono px-1 rounded bg-white/5 border border-white/10 text-text-muted">
                Esc
              </kbd>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="xl:hidden w-8 h-8 rounded-full bg-[#0E1015]/90 backdrop-blur-xl flex items-center justify-center text-text-muted hover:text-text-primary border border-white/[0.08] cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="xl:hidden mt-3 max-w-sm mx-auto bg-surface border border-white/[0.08] rounded-2xl p-4 shadow-spatial pointer-events-auto space-y-2"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2 py-1">
                Jump to Section
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="p-2 rounded-lg text-left text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => scrollTo('enquiry-form')}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider text-center"
                >
                  Apply to Sponsor
                </button>
                <button
                  onClick={onReturnToOrbit}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated border border-white/10 text-text-primary text-xs font-mono text-center"
                >
                  Return to Orbit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT SECTIONS                                                     */}
      {/* ========================================================================= */}
      <main id="overview" className="relative z-10">
        {/* Section A: Hero */}
        <SponsorshipHero
          onExploreHowItWorks={() => scrollTo('how-it-works')}
          onBecomeSponsor={() => scrollTo('enquiry-form')}
        />

        {/* Section B: The Problem & Opportunity */}
        <ProblemOpportunitySection />

        {/* Section C: How the Ecosystem Works (4 Steps) */}
        <EcosystemFlowSection />

        {/* Section D: Choose Your Sponsorship Path (3 Tiers) */}
        <SponsorPathwaysSection onSelectPathway={handleSelectPathway} />

        {/* Section E: What the Sponsor Receives (Benefits) */}
        <SponsorBenefitsSection />

        {/* Section F: Showcase the Leaderboard (Attribution preview) */}
        <LeaderboardPreviewSection onReturnToOrbit={onReturnToOrbit} />

        {/* Section G: 90-Day Pilot Partnership Roadmap */}
        <FoundingPilotSection />

        {/* Section H: Where Sponsorship Funds Go (Allocation) */}
        <FundingAllocationSection />

        {/* Section I: Corporate Enquiry Form */}
        <SponsorEnquiryForm
          initialPathway={selectedPathway}
          onReturnToOrbit={onReturnToOrbit}
        />

        {/* Section J: FAQ Accordion */}
        <SponsorshipFAQSection />

        {/* Section K: Final CTA & Footer */}
        <SponsorshipCTASection
          onScrollToForm={() => scrollTo('enquiry-form')}
          onReturnToOrbit={onReturnToOrbit}
        />
      </main>
    </div>
  )
}
