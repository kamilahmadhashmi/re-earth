import React, { useMemo } from 'react'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSORS } from '../../data/sponsors'
import { SponsorLogo } from './SponsorLogo'

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
    <div className="w-full space-y-3.5 py-6 pointer-events-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
          <span className="text-text-secondary font-medium">
            Corporate Sustainability Guardians
          </span>
          <span className="text-text-muted text-[11px] hidden sm:inline">
            • 8 Official Enterprise Technology Partners
          </span>
        </div>
        <button
          onClick={() => openModal('sponsor_pitch')}
          className="text-[11px] font-semibold text-copper hover:text-copper-light transition-colors flex items-center gap-1 group"
        >
          <span>Underwrite an Engineering Campus</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Marquee Track with Linear Gradient Edge Vignettes */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-surface/90 border border-white/10 p-3 shadow-2xl">
        {/* Left & Right edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#131922] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#131922] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-3.5 pl-8 sm:pl-16 pr-4">
          {marqueeItems.map((sponsor, idx) => (
            <button
              key={`${sponsor.id}-${idx}`}
              onClick={() => selectSponsor(sponsor.id)}
              className="relative group shrink-0 px-4 py-3 rounded-xl bg-surface-elevated/80 hover:bg-surface-elevated border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex items-center gap-3.5 text-left shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              {/* Subtle brand color glow accent on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 20% 50%, ${sponsor.color}15 0%, transparent 75%)`,
                  borderColor: `${sponsor.color}50`
                }}
              />

              {/* Dedicated Official Logo Tile Container */}
              <div
                className="w-11 h-11 rounded-lg bg-[#0E131A] border border-white/10 group-hover:border-white/25 flex items-center justify-center p-2 shrink-0 shadow-inner transition-transform duration-200 group-hover:scale-105"
                style={{
                  boxShadow: `0 2px 8px -2px ${sponsor.color}30`
                }}
              >
                <SponsorLogo
                  sponsorId={sponsor.id}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Brand Typography & Hardware Diversion Telemetry */}
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary tracking-tight group-hover:text-white transition-colors">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border"
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

              {/* Hover Cue */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-0.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SponsorPartnerMarquee
