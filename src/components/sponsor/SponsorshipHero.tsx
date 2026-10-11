import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  Truck,
  Layers,
  ChevronDown,
  ShieldCheck,
  Scale
} from 'lucide-react'
import { trackSponsorEvent } from '../../utils/sponsorAnalytics'
import { SPONSORS } from '../../data/sponsors'
import { SponsorLogo } from '../ui/SponsorLogo'

interface SponsorshipHeroProps {
  onExploreHowItWorks: () => void
  onBecomeSponsor: () => void
}

export const SponsorshipHero: React.FC<SponsorshipHeroProps> = ({
  onExploreHowItWorks,
  onBecomeSponsor
}) => {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Restrained Ambient Depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-emerald/[0.06] blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* 1. Header Typography */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        {/* Institutional Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-[11px] font-mono tracking-wider uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          <span className="text-emerald font-bold">Founding Corporate Underwriting</span>
          <span className="text-white/20">•</span>
          <span className="text-text-muted">Collegiate Circularity Pilot</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.08]"
        >
          Turn Dead Tech Into{' '}
          <span className="bg-gradient-to-r from-emerald via-emerald-light to-cyan bg-clip-text text-transparent">
            Living Earth.
          </span>
        </motion.h1>

        {/* Supporting Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Direct corporate capital into verified campus recovery pods, empower local waste recovery workers, and achieve audit-grade Scope 3 ESG attribution.
        </motion.p>

        {/* Primary & Secondary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            type="button"
            onClick={() => {
              trackSponsorEvent('sponsor_package_selected', { source: 'hero_primary_cta' })
              onBecomeSponsor()
            }}
            className="px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-95 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-spatial flex items-center gap-2.5 group cursor-pointer"
          >
            <span>Initiate Corporate Underwriting</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => {
              trackSponsorEvent('sponsor_page_view', { source: 'hero_secondary_cta' })
              onExploreHowItWorks()
            }}
            className="px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-text-primary text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore 4-Node Ecosystem</span>
            <ChevronDown className="w-4 h-4 text-emerald" />
          </button>
        </motion.div>

        {/* Pilot Transparency Note */}
        <p className="text-[11px] font-mono text-text-muted pt-1">
          Proposed 90-day founding pilot • Direct campus attribution • Zero fabricated metrics
        </p>

        {/* Corporate Underwriter Partner Logo Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="pt-8 border-t border-white/[0.06] mt-8"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">
            Underwriting Alignment & Pilot Benchmarks
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-75 hover:opacity-100 transition-opacity">
            {SPONSORS.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/[0.06] hover:border-white/[0.15] transition-all"
                title={`${s.name} (${s.ticker})`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <SponsorLogo sponsorId={s.id} className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-text-primary font-sans">{s.name}</span>
                <span className="text-[9px] font-mono text-text-muted border-l border-white/10 pl-1.5">
                  {s.ticker}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 2. Visual Representation of the Ecosystem & Real Campus Photo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left: Authentic Campus Collection Hub Image with VisionOS Treatment */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/[0.08] bg-surface p-2 shadow-spatial flex flex-col justify-between group">
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full bg-surface-elevated">
            <img
              src="/images/campus_recycling_hero.jpg"
              alt="Collegiate e-waste sorting workshop and student sustainability drive"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              loading="eager"
            />
            {/* Soft dark gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />

            {/* Inset Badge */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span>COLLEGIATE RECOVERY WORKSHOP</span>
            </div>

            {/* Inset Bottom Caption */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-text-primary bg-background/70 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/[0.1]">
              <span className="font-medium truncate mr-2">
                Student mobilization meets local informal recycling collectors.
              </span>
              <span className="shrink-0 text-[10px] font-mono text-emerald font-bold">
                GROUND REALITY
              </span>
            </div>
          </div>
        </div>

        {/* Right: 4-Node Connected Ecosystem Schematic */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-spatial">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald" />
                <h3 className="text-xs font-bold font-mono uppercase text-text-primary tracking-wider">
                  The Four-Party Triangle
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/20">
                CLOSED-LOOP
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              RE—EARTH connects corporate funding to verified campus actions through local recycling
              workers with immutable digital accountability.
            </p>

            {/* 4 Interactive Nodes */}
            <div className="space-y-2.5 mt-5">
              {/* Node 1: Corporate Sponsor */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-white/[0.06] hover:border-copper/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-copper/15 text-copper flex items-center justify-center shrink-0 font-bold text-xs border border-copper/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">1. Corporate Sponsor</h4>
                    <span className="text-[9px] font-mono text-copper">CATALYST</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Provides bins, weighing scales, and operational logistics funding.
                  </p>
                </div>
              </div>

              {/* Node 2: College Campus */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-white/[0.06] hover:border-emerald/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald/15 text-emerald flex items-center justify-center shrink-0 font-bold text-xs border border-emerald/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">2. College Community</h4>
                    <span className="text-[9px] font-mono text-emerald">ACTIVATION</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Students coordinate campus drives and drop off recyclables.
                  </p>
                </div>
              </div>

              {/* Node 3: Kabadiwalas */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-white/[0.06] hover:border-cyan/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-cyan/15 text-cyan flex items-center justify-center shrink-0 font-bold text-xs border border-cyan/30">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">3. Kabadiwalas & Recyclers</h4>
                    <span className="text-[9px] font-mono text-cyan">RECOVERY</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Weighs, segregates, and routes material to certified processing.
                  </p>
                </div>
              </div>

              {/* Node 4: RE—EARTH Platform */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-white/[0.06] hover:border-lavender/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-lavender/15 text-lavender flex items-center justify-center shrink-0 font-bold text-xs border border-lavender/30">
                  <Scale className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">4. RE—EARTH Telemetry</h4>
                    <span className="text-[9px] font-mono text-lavender">VERIFICATION</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Attributes verified kilograms directly to sponsor & college.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Seal */}
          <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
              <span>Independent Digital Verification</span>
            </span>
            <span>Zero Double-Counting</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

