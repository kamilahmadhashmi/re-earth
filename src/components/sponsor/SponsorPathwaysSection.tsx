import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, Building, Landmark, Globe, HelpCircle } from 'lucide-react'
import { SPONSORSHIP_PATHWAYS, type SponsorshipPathway } from '../../data/sponsorProgramData'
import type { SponsorshipPathwayId } from '../../services/sponsorEnquiryService'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'

interface SponsorPathwaysSectionProps {
  onSelectPathway: (pathwayId: SponsorshipPathwayId) => void
}

export const SponsorPathwaysSection: React.FC<SponsorPathwaysSectionProps> = ({
  onSelectPathway
}) => {
  return (
    <section id="pathways" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber">
          Founding Pilot Tiers
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Choose Your Sponsorship Pathway
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Three flexible pathways designed for businesses of different scales—from a neighborhood store
          backing its local university to multinational corporations deploying multi-city pilots.
        </p>

        {/* Pricing & Pilot Notice */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-text-muted mt-2">
          <Sparkles className="w-3.5 h-3.5 text-amber" />
          <span>Scope, locations, and contributions are customized per founding partner agreement</span>
        </div>
      </div>

      {/* 3 Pathway Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {SPONSORSHIP_PATHWAYS.map((pathway, index) => {
          const isFeatured = pathway.id === 'corporate_sustainability'
          const icon =
            pathway.id === 'local_business' ? (
              <Building className="w-5 h-5" />
            ) : pathway.id === 'corporate_sustainability' ? (
              <Landmark className="w-5 h-5" />
            ) : (
              <Globe className="w-5 h-5" />
            )

          return (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-card p-7 flex flex-col justify-between transition-all duration-300 relative group ${
                isFeatured
                  ? 'liquid-glass border-emerald/50 bg-emerald/[0.04] shadow-liquid-glass lg:-translate-y-2'
                  : 'liquid-glass border-white/10 hover:border-white/20'
              }`}
            >
              {/* Top Banner Tag */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${pathway.badgeColor}`}
                  >
                    {pathway.badge}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {pathway.recommendedScope}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="mt-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-text-primary mb-3">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-emerald transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {pathway.subtitle}
                  </p>
                </div>

                {/* Target Profile */}
                <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                    Ideal Participant
                  </span>
                  <p className="text-xs text-text-secondary mt-1 leading-normal">
                    {pathway.targetAudience}
                  </p>
                </div>

                {/* Possible Contributions */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[11px] font-mono font-bold text-text-primary uppercase tracking-wider block">
                    Possible Contributions
                  </span>
                  {pathway.contributions.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0 mt-1.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

                {/* Potential Benefits */}
                <div className="mt-6 space-y-2.5 pt-5 border-t border-white/[0.06]">
                  <span className="text-[11px] font-mono font-bold text-text-primary uppercase tracking-wider block">
                    Partner Benefits
                  </span>
                  {pathway.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-8 mt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => {
                    trackSponsorEvent('sponsor_package_selected', {
                      packageId: pathway.id,
                      packageName: pathway.title
                    })
                    onSelectPathway(pathway.id)
                  }}
                  className={`w-full py-3.5 px-4 rounded-full font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-emerald hover:brightness-105 active:scale-[0.98] text-background shadow-emerald-glow'
                      : 'bg-white/10 hover:bg-white/15 active:scale-[0.98] text-text-primary hover:border-white/20 border border-white/10'
                  }`}
                >
                  <span>{pathway.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="text-center mt-2.5 text-[10px] font-mono text-text-muted">
                  Prefills the corporate enquiry form below
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Flexible Budget Consultation Callout */}
      <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber/15 text-amber flex items-center justify-center shrink-0 border border-amber/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-text-primary">
              Have a tailored CSR requirement or equipment in-kind?
            </h4>
            <p className="text-xs text-text-secondary mt-0.5">
              We do not impose rigid commercial pricing. Select “Prefer to discuss” in the form to explore a custom contribution.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectPathway('corporate_sustainability')}
          className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold text-amber bg-amber/10 border border-amber/30 hover:bg-amber/20 transition-all cursor-pointer"
        >
          Discuss Custom Pilot
        </button>
      </div>
    </section>
  )
}
