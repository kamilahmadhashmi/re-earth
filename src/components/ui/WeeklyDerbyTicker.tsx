import React from 'react'
import { Swords, Flame } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'

export const WeeklyDerbyTicker: React.FC = () => {
  const { campuses, selectCampus, viewMode, activeChapter, selectedCampusId } = useWorldStore()

  // Only show strictly during Chapter 3 (Live Hub) when no campus card is currently open
  const isVisible = viewMode === 'globe' && activeChapter === 3 && !selectedCampusId
  if (!isVisible) return null

  // Find DTU and NSUT for the live rivalry spotlight
  const dtu = campuses.find((c) => c.id === 'dtu')
  const nsut = campuses.find((c) => c.id === 'nsut')

  // Top 3 weekly
  const topWeekly = [...campuses]
    .sort((a, b) => b.weeklyKg - a.weeklyKg)
    .slice(0, 3)

  const dtuWeekly = dtu ? dtu.weeklyKg : 147.1
  const nsutWeekly = nsut ? nsut.weeklyKg : 148.6
  const dtuIsLeading = dtuWeekly >= nsutWeekly
  const gap = Math.abs(dtuWeekly - nsutWeekly).toFixed(1)

  return (
    <div className="fixed bottom-4 left-4 right-4 z-20 pointer-events-none">
      <div className="max-w-4xl mx-auto liquid-glass specular-rim px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-liquid-glass pointer-events-auto">
        
        {/* WEEKLY DERBY MATCHUP: DTU VS NSUT */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-6 h-6 rounded-full bg-amber/20 border border-amber/35 flex items-center justify-center text-amber shrink-0 shadow-amber-glow">
            <Swords className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-amber text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Derby:
            </span>

            {/* NSUT Badge */}
            <button
              type="button"
              onClick={() => nsut && selectCampus(nsut.id)}
              className={`px-2.5 py-1 rounded-full border text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                !dtuIsLeading
                  ? 'bg-amber/20 border-amber/50 text-amber font-semibold shadow-amber-glow'
                  : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/20'
              }`}
            >
              NSUT <span className="font-bold font-mono ml-0.5">{nsutWeekly.toFixed(1)}kg</span>
            </button>

            <span className="text-text-muted text-[10px]">vs</span>

            {/* DTU Badge */}
            <button
              type="button"
              onClick={() => dtu && selectCampus(dtu.id)}
              className={`px-2.5 py-1 rounded-full border text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                dtuIsLeading
                  ? 'bg-emerald/20 border-emerald/50 text-emerald font-semibold shadow-emerald-glow'
                  : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/20'
              }`}
            >
              DTU <span className="font-bold font-mono ml-0.5">{dtuWeekly.toFixed(1)}kg</span>
            </button>

            {/* Live gap indicator */}
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border tracking-wide ${
                dtuIsLeading
                  ? 'bg-emerald/15 text-emerald border-emerald/30 shadow-emerald-glow'
                  : 'bg-amber/15 text-amber border-amber/30 shadow-amber-glow'
              }`}
            >
              {dtuIsLeading ? `DTU +${gap}kg ahead` : `NSUT +${gap}kg ahead`}
            </span>
          </div>
        </div>

        {/* TOP 3 WEEKLY TICKER */}
        <div className="hidden md:flex items-center gap-2.5 text-text-muted text-[11px] font-mono">
          <span className="text-text-secondary uppercase text-[10px] tracking-wider">Week Leaders:</span>
          {topWeekly.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCampus(c.id)}
              className="hover:text-emerald transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span className="text-emerald font-semibold">#{i + 1}</span>
              <span className="text-text-secondary">{c.shortName}</span>
              <span className="text-text-muted">({Math.round(c.weeklyKg)}kg)</span>
              {i < topWeekly.length - 1 && <span className="text-white/10 ml-2">•</span>}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

