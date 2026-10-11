import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  GraduationCap,
  Truck,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Scale,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { ECOSYSTEM_STEPS, ECOSYSTEM_PARTICIPANTS } from '../../data/sponsorProgramData'

export const EcosystemFlowSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan">
          Operational Mechanics
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          How the Recycling Ecosystem Works
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Four interconnected participants collaborate in a closed-loop operational flow, ensuring
          every drop of e-waste and recyclable material is accounted for.
        </p>
      </div>

      {/* Animated Flow Circuit Connector Diagram (Sponsors -> Colleges -> Kabadiwalas -> Platform) */}
      <div className="mb-10 p-5 rounded-2xl liquid-glass border border-white/10 bg-white/[0.01] relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] flex-wrap gap-2">
          <span className="text-[10px] font-mono uppercase text-emerald font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Closed-Loop Circular Material & Capital Circuit
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            Directional Hand-Off Telemetry
          </span>
        </div>

        {/* Dynamic Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 relative">
          {[
            {
              title: '1. Capital & Bins',
              subtitle: 'Corporate Sponsors',
              color: 'border-amber/40 bg-amber/[0.04]',
              badge: 'text-amber',
              flow: 'Underwrite infrastructure'
            },
            {
              title: '2. E-Waste Intake',
              subtitle: 'Campus Students',
              color: 'border-emerald/40 bg-emerald/[0.04]',
              badge: 'text-emerald',
              flow: 'Deposit at smart pods'
            },
            {
              title: '3. Fair-Wage Hauls',
              subtitle: 'Local Kabadiwalas',
              color: 'border-cyan/40 bg-cyan/[0.04]',
              badge: 'text-cyan',
              flow: 'Formalized route transport'
            },
            {
              title: '4. Scope 3 Audits',
              subtitle: 'RE—EARTH Engine',
              color: 'border-lavender/40 bg-lavender/[0.04]',
              badge: 'text-lavender',
              flow: 'Mint verified certificates'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between relative group`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase block ${item.badge}`}>
                  {item.subtitle}
                </span>
                <span className="text-xs font-bold text-text-primary block mt-0.5">
                  {item.title}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-mono">{item.flow}</span>
                {idx < 3 && (
                  <span className="text-xs font-mono text-emerald font-bold animate-pulse">➔</span>
                )}
                {idx === 3 && (
                  <span className="text-[10px] font-mono text-cyan font-bold">↺ Loop</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Interactive Flow Timeline (Desktop & Mobile Responsive) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 relative">
        {ECOSYSTEM_STEPS.map((step, idx) => {
          const isSelected = activeStepIndex === idx
          return (
            <motion.div
              key={step.stepNumber}
              whileHover={{ y: -4 }}
              onClick={() => setActiveStepIndex(idx)}
              className={`rounded-card p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'liquid-glass border-emerald/50 bg-emerald/[0.04] shadow-emerald-glow/20'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Step indicator top bar */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono font-bold text-text-muted">
                    STEP {step.stepNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      idx === 0
                        ? 'bg-amber/15 text-amber border border-amber/30'
                        : idx === 1
                        ? 'bg-emerald/15 text-emerald border border-emerald/30'
                        : idx === 2
                        ? 'bg-cyan/15 text-cyan border border-cyan/30'
                        : 'bg-lavender/15 text-lavender border border-lavender/30'
                    }`}
                  >
                    {step.actor}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-base font-bold text-text-primary mt-4 group-hover:text-emerald transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary mt-2.5 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Footer Highlight */}
              <div className="pt-4 mt-6 border-t border-white/[0.06]">
                <div className="flex items-start gap-2 text-[11px] text-text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
                  <span className="leading-tight">{step.highlight}</span>
                </div>
              </div>

              {/* Connecting Desktop Arrow */}
              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-background border border-white/20 text-text-muted flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-emerald" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Expanded Participant Deep Dive Card */}
      <div className="mt-12 rounded-card border border-white/10 liquid-glass p-6 sm:p-8 shadow-liquid-glass">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald font-bold tracking-wider">
              Ecosystem Roles & Responsibilities
            </span>
            <h3 className="text-lg font-bold text-text-primary mt-0.5">
              Transparent Attribution at Every Hand-off
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs font-mono text-text-secondary">Dual-Party Verified Receipts</span>
          </div>
        </div>

        {/* 4 Participant Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {ECOSYSTEM_PARTICIPANTS.map((p) => {
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono tracking-wider font-bold text-text-muted">
                      {p.role}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">{p.title}</h4>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-white/[0.06] space-y-1.5">
                  {p.responsibilities.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                      <span className="w-1 h-1 rounded-full bg-emerald shrink-0" />
                      <span className="truncate">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
