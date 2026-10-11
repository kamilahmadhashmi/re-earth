import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ArrowRight, Users, Truck, Wrench, BarChart3 } from 'lucide-react'

export const ProblemOpportunitySection: React.FC = () => {
  return (
    <section id="problem-opportunity" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald">
          The Structural Bottleneck & The Opportunity
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Campus Sustainability Has Great Intentions.{' '}
          <span className="text-text-secondary">It Needs Shared Infrastructure.</span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Millions of students want to recycle, local informal recyclers handle tons of material
          every day, and corporate sustainability budgets seek measurable outcomes. What was
          missing is a cohesive bridge connecting them.
        </p>
      </div>

      {/* Side-by-side Structural Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Left: The Fragmented Reality (Problem) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-card border border-white/10 liquid-glass p-7 sm:p-8 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink/15 text-pink flex items-center justify-center border border-pink/30">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide">
                  The Fragmented Reality
                </h3>
              </div>
              <span className="text-[10px] font-mono text-pink bg-pink/10 px-2 py-0.5 rounded border border-pink/20">
                CURRENT BOTTLENECK
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Without dedicated infrastructure and verified attribution, good intentions stall in
              hostel closets and unstructured campus landfills:
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-pink/10 text-pink flex items-center justify-center shrink-0 mt-0.5">
                  ×
                </div>
                <div>
                  <strong className="text-text-primary block font-medium">
                    Student enthusiasm lacks consistent drop-off points:
                  </strong>
                  Discarded electronics and plastics sit abandoned in dorms because students do not
                  know where certified collection happens.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-pink/10 text-pink flex items-center justify-center shrink-0 mt-0.5">
                  ×
                </div>
                <div>
                  <strong className="text-text-primary block font-medium">
                    Informal recyclers remain invisible:
                  </strong>
                  Local kabadiwalas perform crucial recovery work but lack formal institutional
                  partnerships, protective gear, or stable collegiate collection routes.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-pink/10 text-pink flex items-center justify-center shrink-0 mt-0.5">
                  ×
                </div>
                <div>
                  <strong className="text-text-primary block font-medium">
                    Corporate sponsorships lack ground truth:
                  </strong>
                  Companies spend on generic branding or static banners with zero verifiable data
                  on how much waste was diverted from dumping grounds.
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.08] text-xs font-mono text-text-muted">
            Result: Uncollected waste, uncredited recyclers, unmeasured budgets.
          </div>
        </motion.div>

        {/* Right: The RE—EARTH Solution (Opportunity) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-card border border-emerald/30 bg-emerald/[0.03] liquid-glass p-7 sm:p-8 flex flex-col justify-between relative shadow-emerald-glow/20"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-text-primary uppercase tracking-wide">
                  The RE—EARTH Architecture
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded border border-emerald/20">
                PROPOSED PILOT SOLUTION
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              We align corporate capital, collegiate energy, and local recycling logistics into a
              single transparent recovery engine:
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block font-medium">
                    Colleges mobilize student communities:
                  </strong>
                  Designated smart drop-off bins, recurring collection drives, and friendly inter-campus
                  leaderboard competition inspire active circular habits.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block font-medium">
                    Recycling workers are respected and integrated:
                  </strong>
                  Local collection partners weigh items on calibrated scales, receive fair compensation,
                  and channel materials directly to certified recovery processors.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block font-medium">
                    Corporate sponsorship powers physical infrastructure:
                  </strong>
                  Every sponsor dollar underwrites actual collection receptacles, digital scales,
                  logistics, and worker honorariums—backed by verifiable telemetry.
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-emerald/20 text-xs font-mono text-emerald flex items-center justify-between">
            <span>Verified Kilograms Diverted</span>
            <span>Measurable ESG Outcomes</span>
          </div>
        </motion.div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
          <Users className="w-5 h-5 text-emerald mb-2.5" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Collegiate Mobilization
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Student-driven energy turns circular habits into campus culture.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
          <Truck className="w-5 h-5 text-cyan mb-2.5" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Dignified Recycling
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Fair honorariums and safety equipment for local waste workers.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
          <Wrench className="w-5 h-5 text-amber mb-2.5" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Hardware & Logistics
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Sponsored bins, weighing scales, and reliable transport routes.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
          <BarChart3 className="w-5 h-5 text-lavender mb-2.5" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Public Telemetry
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Zero double-counting. Public verification on the global leaderboard.
          </p>
        </div>
      </div>
    </section>
  )
}
