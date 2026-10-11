import React from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  Award,
  Users,
  FileCheck2,
  Trophy,
  TrendingUp,
  ShieldAlert
} from 'lucide-react'
import { SPONSOR_BENEFITS } from '../../data/sponsorProgramData'

export const SponsorBenefitsSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Scale: <Scale className="w-5 h-5 text-emerald" />,
    Award: <Award className="w-5 h-5 text-amber" />,
    Users: <Users className="w-5 h-5 text-cyan" />,
    FileCheck2: <FileCheck2 className="w-5 h-5 text-lavender" />,
    Trophy: <Trophy className="w-5 h-5 text-emerald" />,
    TrendingUp: <TrendingUp className="w-5 h-5 text-pink" />
  }

  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald">
          Real Deliverables & Accountability
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          What Your Sponsorship Receives
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Grounded, tangible outcomes designed for corporate sustainability leaders who require
          verifiable physical evidence, not vague marketing claims.
        </p>
      </div>

      {/* 6 Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {SPONSOR_BENEFITS.map((benefit, index) => {
          return (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-card p-6 border border-white/10 liquid-glass hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {iconMap[benefit.icon]}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-text-muted">
                    {benefit.metricsTag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary mt-4 group-hover:text-emerald transition-colors">
                  {benefit.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/[0.06] text-[10px] font-mono text-text-muted flex items-center justify-between">
                <span>FOUNDING PARTNER BENEFIT</span>
                <span className="text-emerald">VERIFIED</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Honest Boundary Notice (Anti-Greenwashing Commitment) */}
      <div className="mt-12 p-5 rounded-2xl bg-amber/[0.03] border border-amber/20 flex items-start gap-3.5 max-w-4xl mx-auto">
        <ShieldAlert className="w-5 h-5 text-amber shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary space-y-1">
          <span className="font-bold text-text-primary block font-mono text-[11px] uppercase tracking-wide">
            Our Commitment to Credibility & Honest Claims
          </span>
          <p className="leading-relaxed">
            RE—EARTH does not promise guaranteed recruitment pipelines, carbon credit offsets,
            or regulatory exemptions. What we deliver is verified kilograms of waste collected,
            clear digital paper trails from certified recycling operators, and honest attribution
            for every collegiate initiative you empower.
          </p>
        </div>
      </div>
    </section>
  )
}
