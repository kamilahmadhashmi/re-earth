import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSOR_MAP } from '../../data/sponsors'
import { SponsorLogo } from './SponsorLogo'

export const TopTenDrawer: React.FC = () => {
  const {
    campuses,
    sponsors,
    selectedCampusId,
    selectedSponsorId,
    selectCampus,
    selectSponsor,
    isLeftDrawerOpen,
    toggleLeftDrawer,
    viewMode,
    isDemoMode,
    toggleDemoMode
  } = useWorldStore()

  const [activeTab, setActiveTab] = useState<'campuses' | 'sponsors'>('campuses')

  if (viewMode !== 'globe') return null

  // Computed Top 10 campuses by allTimeKg
  const topTen = campuses.slice(0, 10)

  // Sorted sponsors by totalKg
  const sortedSponsors = [...sponsors].sort((a, b) => b.totalKg - a.totalKg)

  return (
    <>
      {/* DESKTOP COLLAPSIBLE LEFT DRAWER */}
      <aside className="hidden lg:block fixed left-5 top-[84px] sm:top-[88px] bottom-16 z-30 pointer-events-none">
        <div className="flex items-start h-full pointer-events-auto">
          <AnimatePresence initial={false}>
            {isLeftDrawerOpen && (
              <motion.div
                initial={{ opacity: 0, x: -30, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 320 }}
                exit={{ opacity: 0, x: -30, width: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full liquid-glass specular-rim flex flex-col overflow-hidden shadow-liquid-glass"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald/15 flex items-center justify-center text-emerald">
                      {activeTab === 'campuses' ? (
                        <Trophy className="w-3.5 h-3.5 text-copper" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-text-primary tracking-wide">
                        Global Rankings
                      </h2>
                      <p className="text-[10px] text-text-muted">
                        {activeTab === 'campuses' ? 'Top 10 Campuses' : 'Corporate Underwriters'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald/10 border border-emerald/20 text-[10px] font-semibold text-emerald">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="p-2 border-b border-white/[0.06] bg-white/[0.01]">
                  <div className="grid grid-cols-2 p-0.5 rounded-lg bg-surface-elevated/70 border border-white/5">
                    <button
                      onClick={() => setActiveTab('campuses')}
                      className={`py-1 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === 'campuses'
                          ? 'bg-surface text-text-primary shadow-sm font-semibold'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      Campuses (10)
                    </button>
                    <button
                      onClick={() => setActiveTab('sponsors')}
                      className={`py-1 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === 'sponsors'
                          ? 'bg-surface text-text-primary shadow-sm font-semibold'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      Sponsors (8)
                    </button>
                  </div>
                </div>

                {/* List View */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {activeTab === 'campuses' ? (
                    /* Campus List */
                    <ul className="space-y-1.5">
                      {topTen.map((campus) => {
                        const isSelected = selectedCampusId === campus.id
                        const sponsor = SPONSOR_MAP.get(campus.sponsorId)

                        return (
                          <motion.li
                            key={campus.id}
                            layout
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          >
                            <button
                              onClick={() => selectCampus(campus.id)}
                              className={`w-full text-left p-2.5 rounded-md transition-all duration-150 border flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-surface-elevated border-copper shadow-sm'
                                  : 'bg-surface border-white/5 hover:border-white/15 hover:bg-surface-elevated'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                                  {campus.allTimeRank === 1 ? (
                                    <span className="text-gold font-extrabold text-xs px-1.5 py-0.5 rounded bg-gold/10 border border-gold/30">
                                      #1
                                    </span>
                                  ) : campus.allTimeRank === 2 ? (
                                    <span className="text-palladium-light font-extrabold text-xs px-1.5 py-0.5 rounded bg-palladium/10 border border-palladium/30">
                                      #2
                                    </span>
                                  ) : campus.allTimeRank === 3 ? (
                                    <span className="text-copper font-extrabold text-xs px-1.5 py-0.5 rounded bg-copper/10 border border-copper/30">
                                      #3
                                    </span>
                                  ) : (
                                    <span className="text-text-muted text-[11px]">
                                      #{campus.allTimeRank}
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-text-primary truncate group-hover:text-emerald transition-colors">
                                    {campus.shortName}
                                  </p>
                                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                                    <span>{campus.city}</span>
                                    {sponsor && (
                                      <>
                                        <span>•</span>
                                        <span style={{ color: sponsor.color }}>{sponsor.logoText}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0 pl-2 flex flex-col items-end">
                                <span className="font-mono text-xs font-bold text-text-primary block">
                                  {Math.round(campus.allTimeKg).toLocaleString()}
                                  <span className="text-[10px] text-text-muted font-normal ml-0.5">kg</span>
                                </span>

                                {sponsor && (
                                  <div className="flex items-center gap-1 mt-0.5" title={`Sponsored by ${sponsor.name}`}>
                                    <svg width="28" height="8" className="overflow-visible">
                                      <path
                                        d="M 0 6 Q 7 2, 14 5 T 28 1"
                                        fill="none"
                                        stroke={sponsor.color}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <span className="text-[8px] font-mono font-bold" style={{ color: sponsor.color }}>
                                      {sponsor.logoText.slice(0, 3)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          </motion.li>
                        )
                      })}
                    </ul>
                  ) : (
                    /* Sponsors List */
                    <ul className="space-y-1.5">
                      {sortedSponsors.map((sponsor, index) => {
                        const isSelected = selectedSponsorId === sponsor.id
                        const rank = index + 1

                        return (
                          <motion.li
                            key={sponsor.id}
                            layout
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          >
                            <button
                              onClick={() => selectSponsor(sponsor.id)}
                              className={`w-full text-left p-2.5 rounded-md transition-all duration-150 border flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-surface-elevated border-emerald shadow-sm'
                                  : 'bg-surface border-white/5 hover:border-white/15 hover:bg-surface-elevated'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-md bg-[#0E131A] border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-inner"
                                  style={{ boxShadow: `0 2px 6px -2px ${sponsor.color}35` }}
                                >
                                  <SponsorLogo sponsorId={sponsor.id} className="w-full h-full object-contain" />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border"
                                      style={{
                                        backgroundColor: `${sponsor.color}15`,
                                        color: sponsor.color,
                                        borderColor: `${sponsor.color}40`
                                      }}
                                    >
                                      #{rank}
                                    </span>
                                    <p className="text-xs font-bold text-text-primary truncate group-hover:text-emerald transition-colors">
                                      {sponsor.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-0.5">
                                    <span>{sponsor.ticker}</span>
                                    <span>•</span>
                                    <span>{sponsor.campusCount} {sponsor.campusCount === 1 ? 'Campus' : 'Campuses'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0 pl-2 flex flex-col items-end">
                                <span className="font-mono text-xs font-bold text-text-primary block">
                                  {Math.round(sponsor.totalKg).toLocaleString()}
                                  <span className="text-[10px] text-text-muted font-normal ml-0.5">kg</span>
                                </span>
                                <span className="text-[9px] font-medium text-emerald">
                                  Inspect Partner
                                </span>
                              </div>
                            </button>
                          </motion.li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer hint with Demo / Simulation Mode switch */}
                <div className="px-4 py-2.5 border-t border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                  <p className="text-[10px] text-text-muted">
                    {activeTab === 'campuses' ? 'Click campus to inspect' : 'Click sponsor to inspect'}
                  </p>
                  <button
                    onClick={toggleDemoMode}
                    className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border transition-all ${
                      isDemoMode
                        ? 'bg-emerald/20 border-emerald/40 text-emerald font-semibold'
                        : 'bg-white/5 border-white/10 text-text-muted hover:text-text-primary'
                    }`}
                    title="Toggle Demo / Simulation Mode (Shift+D)"
                  >
                    {isDemoMode ? 'Live Simulation' : 'Static Stream'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drawer Toggle Tab */}
          <button
            onClick={toggleLeftDrawer}
            title={isLeftDrawerOpen ? 'Collapse Leaderboard' : 'Expand Leaderboard'}
            className="p-2 rounded-r-2xl liquid-glass border border-l-0 border-white/[0.08] hover:border-emerald/40 text-text-muted hover:text-text-primary transition-all shadow-liquid-glass ml-0 liquid-glass-control"
          >
            {isLeftDrawerOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM SHEET FOR TOP CAMPUSES */}
      <div className="lg:hidden fixed bottom-24 left-3 right-3 z-30 pointer-events-auto">
        <div className="liquid-glass specular-rim p-3 max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2">
            <span className="text-[11px] font-bold text-emerald flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              TOP CAMPUSES
            </span>
            <span className="text-[10px] text-text-muted">Tap to focus</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {topTen.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => selectCampus(c.id)}
                className={`p-2.5 rounded-2xl border shrink-0 text-left w-32 transition-colors liquid-glass-control ${
                  selectedCampusId === c.id
                    ? 'bg-emerald/15 border-emerald/50'
                    : 'bg-white/[0.03] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-emerald">#{c.allTimeRank}</span>
                  <span className="text-text-muted font-mono">{Math.round(c.allTimeKg)}kg</span>
                </div>
                <p className="font-bold text-xs truncate text-text-primary mt-0.5">{c.shortName}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default TopTenDrawer
