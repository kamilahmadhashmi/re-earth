import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ArrowLeft,
  ExternalLink,
  Building2,
  Leaf,
  Globe2,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSOR_MAP } from '../../data/sponsors'
import { SPONSOR_THEMES, generateCampusCollectionHistory } from '../../data/sponsorBannerThemes'

export const SponsorInspectionCard: React.FC = () => {
  const {
    selectedSponsorId,
    selectSponsor,
    sponsors,
    campuses,
    selectCampus,
    openModal,
    viewMode,
    setViewMode
  } = useWorldStore()

  const rankedSponsor = useMemo(
    () => sponsors.find((s) => s.id === selectedSponsorId),
    [sponsors, selectedSponsorId]
  )

  const sponsorBase = useMemo(
    () => (selectedSponsorId ? SPONSOR_MAP.get(selectedSponsorId) : undefined),
    [selectedSponsorId]
  )

  const theme = useMemo(
    () => (selectedSponsorId ? SPONSOR_THEMES[selectedSponsorId] : undefined),
    [selectedSponsorId]
  )

  // Campuses underwritten by this sponsor
  const affiliatedCampuses = useMemo(() => {
    if (!selectedSponsorId) return []
    return campuses.filter((c) => c.sponsorId === selectedSponsorId)
  }, [campuses, selectedSponsorId])

  // Total metrics and trajectory
  const totalKg = rankedSponsor?.totalKg ?? 0
  const weeklyPace = useMemo(() => {
    return affiliatedCampuses.reduce((acc, c) => acc + c.weeklyKg, 0)
  }, [affiliatedCampuses])

  const trajectory = useMemo(() => {
    return generateCampusCollectionHistory(totalKg, Math.max(12, weeklyPace))
  }, [totalKg, weeklyPace])

  if (!selectedSponsorId || (!rankedSponsor && !sponsorBase)) return null

  const sponsor = {
    ...sponsorBase!,
    ...(rankedSponsor || {}),
    totalKg
  }

  // Calculated Scope 3 Metrics based on EPA and WEEE metallurgy models
  const co2AvoidedKg = Math.round(totalKg * 2.14)
  const copperReclaimedKg = Math.round(totalKg * 0.148)
  const rareEarthGrams = Math.round(totalKg * 4.35)

  const handleClose = () => {
    selectSponsor(null)
  }

  const handleFocusCampus = (campusId: string) => {
    if (viewMode !== 'globe') {
      setViewMode('globe')
    }
    selectCampus(campusId)
  }

  const handleOpenPitch = () => {
    selectSponsor(null)
    openModal('sponsor_pitch')
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 50, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-prevent-drag="true"
        className="fixed right-3 sm:right-5 top-16 sm:top-20 bottom-6 sm:bottom-16 z-50 w-[calc(100vw-24px)] sm:w-full max-w-[380px] pointer-events-auto"
      >
        <div className="h-full bg-[#131922] border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
          
          {/* HEADER BAR */}
          <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors px-2.5 py-1.5 rounded-md hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
              <kbd className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
                Esc
              </kbd>
            </button>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: `${sponsor.color}15`,
                  color: sponsor.color,
                  borderColor: `${sponsor.color}40`
                }}
              >
                {sponsor.ticker}
              </span>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            
            {/* SPONSOR IDENTITY */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border"
                  style={{
                    backgroundColor: `${sponsor.color}20`,
                    color: sponsor.color,
                    borderColor: `${sponsor.color}50`
                  }}
                >
                  Rank #{rankedSponsor?.rank ?? 1} Corporate Guardian
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald" />
                  Verified Partner
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  {sponsor.name}
                </h1>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-text-primary transition-colors shrink-0"
                  title="Visit official sustainability portal"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-snug">
                {theme?.tagline || sponsor.description}
              </p>
            </div>

            {/* HERO METRIC: TOTAL VERIFIED DIVERSION */}
            <div
              className="p-4 rounded-lg border text-center space-y-1 relative overflow-hidden"
              style={{
                backgroundColor: `${sponsor.color}08`,
                borderColor: `${sponsor.color}35`
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20"
                style={{ backgroundColor: sponsor.color }}
              />
              <span className="text-xs font-medium text-text-muted block">
                Total Verified Hardware Diversion
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-text-primary font-mono tracking-tight">
                  {Math.round(totalKg).toLocaleString()}
                </span>
                <span
                  className="text-base font-bold uppercase font-mono"
                  style={{ color: sponsor.color }}
                >
                  KG
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Diverted across {affiliatedCampuses.length} underwritten university campuses
              </p>
            </div>

            {/* SCOPE 3 ESG DIVIDENDS */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-white/[0.06]">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald" />
                  Audited Scope 3 Dividends
                </span>
                <span className="text-[10px] font-mono text-emerald font-semibold">
                  ISO 14064 Compliant
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-text-muted">CO₂ Avoided</p>
                  <p className="text-sm font-bold text-text-primary font-mono mt-0.5">
                    {(co2AvoidedKg / 1000).toFixed(1)}t
                  </p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-text-muted">Copper</p>
                  <p className="text-sm font-bold text-copper font-mono mt-0.5">
                    {copperReclaimedKg}kg
                  </p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-text-muted">Rare Earths</p>
                  <p className="text-sm font-bold text-gold font-mono mt-0.5">
                    {rareEarthGrams}g
                  </p>
                </div>
              </div>
            </div>

            {/* 6-MONTH COLLECTION TRAJECTORY CHART */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan" />
                  Diversion Trajectory
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  6-Month Ledger
                </span>
              </div>

              {/* Trajectory Bar Chart */}
              <div className="pt-2">
                <div className="h-16 flex items-end justify-between gap-1.5 px-1">
                  {trajectory.map((pt, idx) => {
                    const maxVal = Math.max(...trajectory.map((t) => t.kg))
                    const heightPercent = Math.max(15, Math.round((pt.kg / maxVal) * 100))
                    const isLatest = idx === trajectory.length - 1

                    return (
                      <div
                        key={pt.period}
                        className="flex-1 flex flex-col items-center gap-1.5 group relative"
                      >
                        <div
                          className="w-full rounded-t transition-all duration-200"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isLatest ? sponsor.color : 'rgba(255, 255, 255, 0.18)'
                          }}
                        />
                        <span className="text-[9px] font-mono text-text-muted group-hover:text-text-primary transition-colors">
                          {pt.period.slice(0, 3)}
                        </span>

                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap transition-opacity z-20">
                          {pt.kg.toLocaleString()} kg
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* UNDERWRITTEN CAMPUSES */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-copper" />
                  Endowed Campuses ({affiliatedCampuses.length})
                </span>
                <span className="text-[10px] text-text-muted">Click to inspect</span>
              </div>

              <div className="space-y-1.5">
                {affiliatedCampuses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleFocusCampus(c.id)}
                    className="w-full text-left p-2 rounded-md bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-text-primary group-hover:text-emerald transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {c.city}, {c.country} • Rank #{c.allTimeRank}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-text-primary block">
                        {Math.round(c.allTimeKg).toLocaleString()}
                        <span className="text-[10px] text-text-muted ml-0.5">kg</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ESG PLEDGE STATEMENT */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                Corporate Circular Charter
              </span>
              <p className="text-xs font-medium text-text-primary leading-relaxed italic">
                "{theme?.esgPledge || sponsor.description}"
              </p>
            </div>

          </div>

          {/* FOOTER CTA */}
          <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] space-y-2">
            <button
              onClick={handleOpenPitch}
              className="w-full py-2.5 px-4 rounded-md font-bold text-xs text-background hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: sponsor.color
              }}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sponsor Additional Engineering Campuses</span>
            </button>
            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              Expand your corporation's physical footprint across top global university engineering hubs.
            </p>
          </div>

        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

export default SponsorInspectionCard
