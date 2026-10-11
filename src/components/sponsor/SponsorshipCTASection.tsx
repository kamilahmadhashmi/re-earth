import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, RotateCcw, Sparkles, Heart } from 'lucide-react'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'
import { TerraMascot } from './TerraMascot'

interface SponsorshipCTASectionProps {
  onScrollToForm: () => void
  onReturnToOrbit: () => void
}

export const SponsorshipCTASection: React.FC<SponsorshipCTASectionProps> = ({
  onScrollToForm,
  onReturnToOrbit
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* High-Impact CTA Banner */}
      <div className="rounded-card p-8 sm:p-14 liquid-glass border border-white/10 relative overflow-hidden text-center max-w-4xl mx-auto shadow-liquid-glass">
        {/* Soft Background Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/10 via-amber/5 to-transparent pointer-events-none" />

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/15 border border-emerald/30 text-emerald text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Founding Pilot Enrollment</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight max-w-2xl mx-auto leading-tight">
            Help Build the Next Generation of Campus Recycling.
          </h2>

          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Partner with colleges, support local recycling workers, and help make environmental action
            measurable.
          </p>

          {/* Terra Mascot in Pointing Pose */}
          <div className="flex justify-center pt-2">
            <TerraMascot
              pose="pointing"
              size={64}
              speechBubbleText="Ready to initiate your campus pilot?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                trackSponsorEvent('sponsor_package_selected', { source: 'final_cta_primary' })
                onScrollToForm()
              }}
              className="px-7 py-3.5 rounded-full bg-amber text-background font-bold text-xs uppercase tracking-wider shadow-amber-glow hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Become a Founding Sponsor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToForm}
              className="px-6 py-3.5 rounded-full liquid-glass-pill liquid-glass-control text-text-primary hover:text-white border-white/10 text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-cyan" />
              <span>Contact Partnership Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Return to Orbit Pill Button */}
      <div className="mt-12 text-center">
        <button
          onClick={onReturnToOrbit}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full liquid-glass-pill liquid-glass-control text-xs font-mono text-text-secondary hover:text-text-primary border border-white/10 transition-colors cursor-pointer"
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
