import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, ShieldCheck, ArrowRight, Info, AlertTriangle, Layers } from 'lucide-react'
import { ILLUSTRATIVE_LEADERBOARD_PREVIEW } from '../../data/sponsorProgramData'
import { useWorldStore } from '../../store/useWorldStore'

interface LeaderboardPreviewSectionProps {
  onReturnToOrbit: () => void
}

export const LeaderboardPreviewSection: React.FC<LeaderboardPreviewSectionProps> = ({
  onReturnToOrbit
}) => {
  const { campuses } = useWorldStore()

  return (
    <section id="leaderboard-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-lavender">
          Attribution Telemetry
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          How Sponsors Appear on the Leaderboard
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          When verified e-waste and recyclables are collected on campus, the kilograms are attributed
          directly to both the university and its supporting sponsor in real-time.
        </p>

        {/* Clear Simulation Notice */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-mono font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Illustrative preview — Founding pilot simulation (no live production data yet)</span>
        </div>
      </div>

      {/* Leaderboard Table Preview Container */}
      <div className="rounded-card border border-white/10 liquid-glass overflow-hidden shadow-liquid-glass">
        {/* Table Top Controls & Filter Simulation */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Collegiate Circularity Leaderboard
              </h3>
              <p className="text-[11px] text-text-muted font-mono">
                Attribution Metric: Verified Kilograms Diverted (Dual Digital Receipts)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-text-muted">
              PERIOD: 90-DAY PILOT
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald/10 border border-emerald/30 text-emerald flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span>LIVE TELEMETRY</span>
            </span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-text-muted font-mono uppercase text-[10px] border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-5 w-16">Rank</th>
                <th className="py-3 px-5">Participating College</th>
                <th className="py-3 px-5">Sponsoring Brand</th>
                <th className="py-3 px-5 text-right">Diverted (Kg)</th>
                <th className="py-3 px-5 text-center">Collection Drives</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {ILLUSTRATIVE_LEADERBOARD_PREVIEW.map((row) => (
                <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors">
                  {/* Rank */}
                  <td className="py-4 px-5 font-mono font-bold">
                    <span
                      className={`inline-block w-6 h-6 rounded-md text-center leading-6 text-xs ${
                        row.rank === 1
                          ? 'bg-amber/20 text-amber border border-amber/40 font-extrabold'
                          : row.rank === 2
                          ? 'bg-cyan/20 text-cyan border border-cyan/40'
                          : row.rank === 3
                          ? 'bg-lavender/20 text-lavender border border-lavender/40'
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      #{row.rank}
                    </span>
                  </td>

                  {/* College */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-text-primary text-xs sm:text-sm">
                      {row.collegeName}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono">{row.city}</div>
                  </td>

                  {/* Sponsoring Brand */}
                  <td className="py-4 px-5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: row.sponsorColor }}
                      />
                      <span className="font-medium text-text-primary text-xs">
                        {row.sponsorName}
                      </span>
                    </div>
                  </td>

                  {/* Material Diverted */}
                  <td className="py-4 px-5 text-right font-mono text-emerald font-bold text-sm">
                    {row.verifiedKg.toLocaleString()} kg
                  </td>

                  {/* Drives */}
                  <td className="py-4 px-5 text-center font-mono text-text-secondary">
                    {row.completedDrives} drives
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 font-mono text-[10px] text-text-muted">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      SIMULATED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Attribution Rules Explanation */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
            <div>
              <strong className="text-text-primary block font-medium">
                1:1 Attribution Rule (Zero Double-Counting)
              </strong>
              Each collection drive is tied to exactly one sponsor package and one university
              chapter. The same physical material is never duplicated across multiple sponsors.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-text-primary block font-medium">
                Connected to 3D Planetary Orbit
              </strong>
              In the live platform, these rankings drive the physical height of holographic towers
              rising from geographical coordinates on the 3D globe.
            </div>
          </div>
        </div>
      </div>

      {/* Button to view current 3D Globe Leaderboard */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onReturnToOrbit}
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald hover:text-emerald-light active:scale-95 transition-all cursor-pointer"
        >
          <span>View 3D Planetary Skyline in Interactive Orbit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  )
}
