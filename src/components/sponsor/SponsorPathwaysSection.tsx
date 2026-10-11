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
              <Building className="w-5 h-5 text-copper" />
            ) : pathway.id === 'corporate_sustainability' ? (
              <Landmark className="w-5 h-5 text-emerald" />
            ) : (
              <Globe className="w-5 h-5 text-cyan" />
            )

          return (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative group ${
                isFeatured
                  ? 'bg-[#0E1318] border border-emerald/40 shadow-spatial lg:-translate-y-1.5'
                  : 'bg-surface border border-white/[0.08] hover:border-white/[0.15] shadow-spatial'
              }`}
            >
              {/* Top Banner Tag */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
                  <span
                    className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                      isFeatured
                        ? 'bg-emerald/15 text-emerald border-emerald/30'
                        : 'bg-white/[0.04] text-text-muted border-white/[0.08]'
                    }`}
                  >
                    {pathway.badge}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {pathway.recommendedScope}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="mt-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-white/[0.08] flex items-center justify-center text-text-primary mb-3.5">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-emerald transition-colors tracking-tight">
                    {pathway.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {pathway.subtitle}
                  </p>
                </div>

                {/* Target Profile */}
                <div className="mt-5 p-3.5 rounded-xl bg-surface-elevated border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block font-bold">
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
              <div className="pt-8 mt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    trackSponsorEvent('sponsor_package_selected', {
                      packageId: pathway.id,
                      packageName: pathway.title
                    })
                    onSelectPathway(pathway.id)
                  }}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-emerald hover:bg-emerald-light active:scale-[0.98] text-black shadow-spatial'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] text-text-primary border border-white/[0.08]'
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
      <div className="mt-12 p-6 rounded-2xl bg-surface border border-white/[0.08] shadow-spatial flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-copper/15 text-copper flex items-center justify-center shrink-0 border border-copper/30">
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
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-text-primary bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-all cursor-pointer uppercase font-mono tracking-wider"
        >
          Discuss Custom Pilot
        </button>
      </div>
    </section>
  )
}
