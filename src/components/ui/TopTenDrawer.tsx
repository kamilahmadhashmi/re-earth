import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSOR_MAP } from '../../data/sponsors'

export const TopTenDrawer: React.FC = () => {
  const {
    campuses,
    selectedCampusId,
    selectCampus,
    isLeftDrawerOpen,
    toggleLeftDrawer,
    viewMode,
    isIntro,
    activeChapter,
    isDemoMode,
    toggleDemoMode
  } = useWorldStore()

  if (viewMode !== 'globe') return null

  // Computed Top 10 by allTimeKg
  const topTen = campuses.slice(0, 10)

  return (
    <>
      {/* DESKTOP COLLAPSIBLE LEFT DRAWER */}
      <aside className="hidden lg:block fixed left-5 top-20 bottom-16 z-30 pointer-events-none">
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
                <div className="px-4 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald/15 flex items-center justify-center text-emerald">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        Global Rankings
                      </h2>
                      <p className="text-[10px] text-text-muted">Top 10 Verified Campuses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald/10 border border-emerald/20 text-[10px] font-semibold text-emerald">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* List of 10 with Framer Motion Layout Reordering */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
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
                              {/* Medal or Rank Badge */}
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

                            {/* Mini Sponsor Sparkline & Weight */}
                            <div className="text-right shrink-0 pl-2 flex flex-col items-end">
                              <span className="font-mono text-xs font-bold text-text-primary block">
                                {Math.round(campus.allTimeKg).toLocaleString()}
                                <span className="text-[10px] text-text-muted font-normal ml-0.5">kg</span>
                              </span>
                              
                              {/* Micro Branded Sparkline */}
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
                </div>

                {/* Footer hint with Demo / Simulation Mode switch */}
                <div className="px-4 py-2.5 border-t border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                  <p className="text-[10px] text-text-muted">
                    Click campus to inspect
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

      {/* MOBILE BOTTOM SHEET FOR TOP 3 */}
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

