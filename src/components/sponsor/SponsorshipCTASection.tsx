import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, RotateCcw, Sparkles } from 'lucide-react'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'

interface SponsorshipCTASectionProps {
  onScrollToForm: () => void
  onReturnToOrbit: () => void
}

export const SponsorshipCTASection: React.FC<SponsorshipCTASectionProps> = ({
  onScrollToForm,
  onReturnToOrbit
}) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* High-Impact CTA Banner */}
      <div className="rounded-3xl p-8 sm:p-14 bg-surface border border-white/[0.08] relative overflow-hidden text-center max-w-4xl mx-auto shadow-spatial">
        {/* Soft Background Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/[0.06] via-transparent to-transparent pointer-events-none" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-[11px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Founding Pilot Enrollment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight max-w-2xl mx-auto leading-tight">
            Help Build the Next Generation of Campus Recycling.
          </h2>

          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Partner with colleges, support local recycling workers, and turn corporate sustainability
            commitments into audit-grade verifiable action.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => {
                trackSponsorEvent('sponsor_package_selected', { source: 'final_cta_primary' })
                onScrollToForm()
              }}
              className="px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-spatial flex items-center gap-2 cursor-pointer"
            >
              <span>Initiate Sponsorship Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToForm}
              className="px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-primary border border-white/[0.08] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-cyan" />
              <span>Contact Partnership Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Return to Orbit Button */}
      <div className="mt-12 text-center">
        <button
          onClick={onReturnToOrbit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-white/[0.08] text-xs font-mono text-text-secondary hover:text-text-primary transition-colors cursor-pointer shadow-sm hover:border-white/20"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald" />
          <span>Return to 3D Planetary Orbit & Collegiate Skyline</span>
        </button>
      </div>

      {/* Footer Conventions */}
      <footer className="mt-16 pt-8 border-t border-white/[0.06] text-center space-y-3">
        <div className="text-xs text-text-secondary font-medium">
          RE<span className="text-emerald font-extrabold mx-0.5">—</span>EARTH • Planetary E-Waste Telemetry & Circular Collegiate Architecture
        </div>
        <div className="text-[11px] font-mono text-text-muted flex items-center justify-center gap-2">
          <span>MIT License</span>
          <span>•</span>
          <span>Open Source "Build It" Local-First Architecture</span>
          <span>•</span>
          <span>Empowering Informal Recycling Aggregators</span>
        </div>
      </footer>
    </section>
  )
}
