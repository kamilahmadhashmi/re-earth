import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Sliders, CheckCircle2, Info, Sparkles } from 'lucide-react'
import { PROPOSED_BUDGET_ALLOCATION } from '../../data/sponsorProgramData'

export const FundingAllocationSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <section id="budget-allocation" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald">
          Financial Governance
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Where Sponsorship Funds Go
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Every corporate sponsorship dollar is deployed into tangible hardware, fair compensation
          for recycling workers, and verified student mobilization—with zero opaque administrative waste.
        </p>

        {/* Clear Planning Disclaimer */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-text-muted mt-2">
          <Info className="w-3.5 h-3.5 text-emerald" />
          <span>Proposed framework — exact ratios adjusted based on in-kind donations vs cash funding</span>
        </div>
      </div>

      {/* Interactive Visual Breakdown Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-surface p-7 sm:p-9 shadow-spatial">
        {/* Horizontal Stacked Percentage Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-primary font-bold">Proposed Resource Allocation Model</span>
            <span className="text-text-muted">100% Program Deployment</span>
          </div>

          <div className="w-full h-5 rounded-full overflow-hidden flex bg-white/5 p-1 gap-1 border border-white/10">
            {PROPOSED_BUDGET_ALLOCATION.map((item) => (
              <div
                key={item.category}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color
                }}
                title={`${item.category}: ${item.percentage}%`}
                className="h-full rounded-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setSelectedCategory(item.category)}
              />
            ))}
          </div>

          {/* Legend Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 text-[11px] font-mono">
            {PROPOSED_BUDGET_ALLOCATION.map((item) => (
              <button
                key={item.category}
                type="button"
                onClick={() => setSelectedCategory(item.category)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === item.category
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/[0.06] bg-surface-elevated hover:border-white/20'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary">{item.category}</span>
                <span className="font-bold text-text-primary">({item.percentage}%)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Allocation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
          {PROPOSED_BUDGET_ALLOCATION.map((item) => {
            const isHighlighted = selectedCategory === item.category
            return (
              <motion.div
                key={item.category}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(item.category)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-surface-elevated border-emerald/50 shadow-sm'
                    : 'bg-surface-elevated border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">{item.category}</span>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                    style={{
                      color: item.color,
                      backgroundColor: `${item.color}15`,
                      border: `1px solid ${item.color}30`
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}

          {/* In-Kind Equipment Option Card */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-copper/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-copper text-xs font-bold font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>In-Kind Contribution Flexibility</span>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                If your company already manufactures or supplies collection bins, industrial scales,
                or transport vehicles, we credit that directly against program infrastructure requirements.
              </p>
            </div>
            <span className="text-[10px] font-mono text-copper mt-3 block font-bold">
              100% credited against budget
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
