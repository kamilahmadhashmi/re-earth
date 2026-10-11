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
import { TerraMascot } from './TerraMascot'

interface SponsorshipHeroProps {
  onExploreHowItWorks: () => void
  onBecomeSponsor: () => void
}

export const SponsorshipHero: React.FC<SponsorshipHeroProps> = ({
  onExploreHowItWorks,
  onBecomeSponsor
}) => {
  return (
    <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-amber/8 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* 1. Header Typography */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        {/* Terra Mascot & Eyebrow Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <TerraMascot
            pose="welcome"
            size={56}
            speechBubbleText="Hi, I'm Terra — let's build campus circularity!"
          />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill specular-rim text-[11px] font-mono font-bold tracking-wider uppercase text-amber border border-amber/30 shadow-amber-glow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber animate-pulse" />
            <span>Founding Corporate Partnerships</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          </motion.div>
        </div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.12]"
        >
          Turn Your Brand Into a{' '}
          <span className="text-emerald">
            Force for Change.
          </span>
        </motion.h1>

        {/* Supporting Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Support college-led recycling, empower local recycling workers, and help turn environmental
          commitments into measurable action.
        </motion.p>

        {/* Primary & Secondary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 pt-3"
        >
          <button
            onClick={() => {
              trackSponsorEvent('sponsor_package_selected', { source: 'hero_primary_cta' })
              onBecomeSponsor()
            }}
            className="px-7 py-3.5 rounded-full bg-amber text-background font-bold text-sm tracking-wide shadow-amber-glow hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Become a Founding Sponsor</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              trackSponsorEvent('sponsor_page_view', { source: 'hero_secondary_cta' })
              onExploreHowItWorks()
            }}
            className="px-6 py-3.5 rounded-full liquid-glass-pill liquid-glass-control text-text-primary hover:text-white border-white/10 hover:border-emerald/40 text-sm font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore How It Works</span>
            <ChevronDown className="w-4 h-4 text-emerald" />
          </button>
        </motion.div>

        {/* Pilot Transparency Note */}
        <p className="text-[11px] font-mono text-text-muted pt-1">
          Proposed 90-day founding pilot • Direct campus attribution • Zero fabricated metrics
        </p>
      </div>

      {/* 2. Visual Representation of the Ecosystem & Real Campus Photo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left: Authentic Campus Collection Hub Image with VisionOS Treatment */}
        <div className="lg:col-span-7 relative rounded-card overflow-hidden border border-white/10 liquid-glass p-2 shadow-liquid-glass flex flex-col justify-between group">
          <div className="relative rounded-[16px] overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full bg-surface-elevated">
            <img
              src="/images/campus_recycling_hero.jpg"
              alt="Collegiate e-waste sorting workshop and student sustainability drive"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              loading="eager"
            />
            {/* Soft dark gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />

            {/* Inset Badge */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span>COLLEGIATE RECOVERY WORKSHOP</span>
            </div>

            {/* Inset Bottom Caption */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-text-primary bg-background/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
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
        <div className="lg:col-span-5 rounded-card border border-white/10 liquid-glass p-6 sm:p-7 flex flex-col justify-between shadow-liquid-glass">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
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
            <div className="space-y-3 mt-5">
              {/* Node 1: Corporate Sponsor */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-amber/20 hover:border-amber/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber/15 text-amber flex items-center justify-center shrink-0 font-bold text-xs border border-amber/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">1. Corporate Sponsor</h4>
                    <span className="text-[9px] font-mono text-amber">CATALYST</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Provides bins, weighing scales, and operational logistics funding.
                  </p>
                </div>
              </div>

              {/* Node 2: College Campus */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-emerald/20 hover:border-emerald/40 transition-colors">
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
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-cyan/20 hover:border-cyan/40 transition-colors">
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
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-lavender/20 hover:border-lavender/40 transition-colors">
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
          <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-text-muted font-mono">
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
