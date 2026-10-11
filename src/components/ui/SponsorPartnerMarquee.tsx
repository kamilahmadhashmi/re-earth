import React, { useMemo } from 'react'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSORS } from '../../data/sponsors'

export const SponsorPartnerMarquee: React.FC = () => {
  const { selectSponsor, sponsors, openModal } = useWorldStore()

  // Match sponsors with ranked totals
  const enrichedSponsors = useMemo(() => {
    return SPONSORS.map((s) => {
      const ranked = sponsors.find((rs) => rs.id === s.id)
      return {
        ...s,
        totalKg: ranked?.totalKg ?? 0,
        campusCount: ranked?.campusCount ?? 1,
        rank: ranked?.rank ?? 1
      }
    })
  }, [sponsors])

  // Duplicate for continuous 50% translation loop
  const marqueeItems = [...enrichedSponsors, ...enrichedSponsors]

  return (
    <div className="w-full space-y-3 py-6 pointer-events-auto">
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
          <span className="text-text-secondary font-medium">
            Corporate Sustainability Guardians
          </span>
          <span className="text-text-muted text-[11px] hidden sm:inline">
            • 8 Global Technology Partners
          </span>
        </div>
        <button
          onClick={() => openModal('sponsor_pitch')}
          className="text-[11px] font-semibold text-copper hover:text-copper-light transition-colors flex items-center gap-1 group"
        >
          <span>Become a Collegiate Partner</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Marquee Track with Linear Fade Edges */}
      <div className="relative w-full overflow-hidden rounded-xl bg-surface/80 border border-white/10 p-2 shadow-xl">
        {/* Left & Right subtle edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#131922] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#131922] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-3">
          {marqueeItems.map((sponsor, idx) => (
            <button
              key={`${sponsor.id}-${idx}`}
              onClick={() => selectSponsor(sponsor.id)}
              className="group shrink-0 px-4 py-2.5 rounded-lg bg-surface-elevated/70 hover:bg-surface-elevated border border-white/5 hover:border-white/20 transition-all flex items-center gap-3.5 text-left"
            >
              {/* Brand Color Indicator */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                style={{ backgroundColor: sponsor.color }}
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary tracking-tight">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded border"
                    style={{
                      backgroundColor: `${sponsor.color}15`,
                      color: sponsor.color,
                      borderColor: `${sponsor.color}35`
                    }}
                  >
                    {sponsor.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                  <span className="font-mono font-medium text-emerald">
                    {Math.round(sponsor.totalKg).toLocaleString()} kg
                  </span>
                  <span>•</span>
                  <span>{sponsor.campusCount} {sponsor.campusCount === 1 ? 'Campus' : 'Campuses'}</span>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SponsorPartnerMarquee
