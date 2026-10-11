import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, Sparkles, Milestone } from 'lucide-react'
import { PILOT_ROADMAP } from '../../data/sponsorProgramData'

export const FoundingPilotSection: React.FC = () => {
  return (
    <section id="pilot-roadmap" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan">
          Proposed 90-Day Framework
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          The Founding Pilot Partnership
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          We invite select corporate visionaries to co-launch our initial 90-day pilot. The roadmap
          is structured into five transparent milestones to validate collection mechanics before
          broader geographic expansion.
        </p>

        {/* Status Clarification */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-text-muted mt-2">
          <Clock className="w-3.5 h-3.5 text-cyan" />
          <span>Status: Currently enrolling Founding Corporate Partners • Launch upon partner onboarding</span>
        </div>
      </div>

      {/* 5-Phase Horizontal / Responsive Stepper */}
      <div className="space-y-4">
        {PILOT_ROADMAP.map((stage, idx) => {
          return (
            <motion.div
              key={stage.phase}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-5 sm:p-6 border border-white/10 liquid-glass hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              {/* Left: Phase Number, Timeframe & Title */}
              <div className="flex items-start gap-4 md:w-2/5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-cyan shrink-0 group-hover:border-cyan/40 transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan font-bold tracking-wider">
                      {stage.phase}
                    </span>
                    <span className="text-text-muted text-[10px] font-mono">•</span>
                    <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald" />
                      <span>{stage.timeframe}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary mt-1 group-hover:text-cyan transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {stage.objective}
                  </p>
                </div>
              </div>

              {/* Right: Key Deliverables List */}
              <div className="md:w-3/5 w-full bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Expected Deliverables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                  {stage.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
                      <span className="leading-tight">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pilot Success Criteria Grid */}
      <div className="mt-12 p-6 rounded-card border border-white/10 liquid-glass shadow-liquid-glass">
        <div className="flex items-center gap-2.5 mb-4">
          <Milestone className="w-5 h-5 text-emerald" />
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Founding Pilot Success Criteria
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-text-primary block font-medium mb-1">
              1. 100% Digital Receipts
            </strong>
            Every kilogram of material weighed on campus generates a verified dual receipt signed
            by the student representative and the collecting kabadiwala.
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-text-primary block font-medium mb-1">
              2. Fair Recycling Honorariums
            </strong>
            Informal waste workers receive fair-market rates plus structured collection honorariums
            for handling campus segregation.
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-text-primary block font-medium mb-1">
              3. Certified Downstream Recovery
            </strong>
            Zero materials routed to unauthorized dumping. All accepted categories transferred to
            authorized, state-compliant processing partners.
          </div>
        </div>
      </div>
    </section>
  )
}
