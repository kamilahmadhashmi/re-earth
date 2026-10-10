import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Zap, Sparkles, MapPin, Award, Layers, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useWorldStore } from '../../store/useWorldStore'
import { SPONSOR_MAP } from '../../data/sponsors'
import { SponsorBannerGraph } from './SponsorBannerGraph'

export const CampusInspectionCard: React.FC = () => {
  const {
    campuses,
    selectedCampusId,
    returnToWorld,
    boostSelectedCampus,
    isBoosting
  } = useWorldStore()

  const campus = campuses.find((c) => c.id === selectedCampusId)
  if (!campus) return null

  const sponsor = SPONSOR_MAP.get(campus.sponsorId)

  const handleBoost = async () => {
    // Apple climate-tech confetti palette
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { x: 0.85, y: 0.6 },
      colors: ['#30D158', '#64D2FF', '#BF5AF2', '#FF7AB6', '#F5F5F7']
    })

    await boostSelectedCampus(250)
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 50, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-prevent-drag="true"
        className="fixed right-3 sm:right-5 top-16 sm:top-20 bottom-6 sm:bottom-16 z-50 w-[calc(100vw-24px)] sm:w-full max-w-[370px] pointer-events-auto"
      >
        <div className="h-full liquid-glass specular-rim flex flex-col overflow-hidden shadow-liquid-glass">
          
          {/* HEADER BAR */}
          <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <button
              onClick={returnToWorld}
              className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors px-2.5 py-1.5 rounded-full hover:bg-white/5 liquid-glass-control"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to World</span>
              <kbd className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
                Esc
              </kbd>
            </button>
            <button
              onClick={returnToWorld}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors liquid-glass-control"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            
            {/* CAMPUS IDENTITY */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald/15 text-emerald border border-emerald/30">
                  RANK #{campus.allTimeRank} GLOBAL
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan" />
                  {campus.city}, {campus.country}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                {campus.name}
              </h1>
            </div>

            {/* GIANT HERO NUMBER: VERIFIED DIVERTED WEIGHT WITH SHIMMER */}
            <div className="p-4 rounded-2xl liquid-glass-subtle text-center space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted block">
                Verified Diversion Telemetry
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-text-primary font-mono tracking-tight text-shimmer">
                  {Math.round(campus.allTimeKg).toLocaleString()}
                </span>
                <span className="text-base font-bold text-emerald font-mono uppercase">
                  KG
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Verified hardware diverted from landfills
              </p>
            </div>

            {/* DUAL METRIC CARDS */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-1">
                <p className="text-[10px] uppercase font-mono text-text-muted">Weekly Pace</p>
                <p className="text-xl font-extrabold text-cyan font-mono">
                  {campus.weeklyKg.toFixed(1)}
                  <span className="text-xs font-normal text-text-muted ml-0.5">kg</span>
                </p>
                <span className="text-[10px] text-cyan-light font-mono block">
                  #{campus.weeklyRank} in Derby
                </span>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-1">
                <p className="text-[10px] uppercase font-mono text-text-muted">Smart Kiosks</p>
                <p className="text-xl font-extrabold text-text-primary font-mono">
                  {campus.activeKiosks}
                  <span className="text-xs font-normal text-text-muted ml-0.5">active</span>
                </p>
                <span className="text-[10px] text-emerald font-mono block">
                  IoT Weight Sensors
                </span>
              </div>
            </div>

            {/* TOP RECYCLED STREAM */}
            <div className="p-3.5 rounded-2xl liquid-glass-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber" />
                  Dominant Stream
                </span>
                <span className="text-[10px] font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20">
                  {campus.topRecycledItem}
                </span>
              </div>
              
              {/* E-Waste Breakdown Bar */}
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald h-full w-[42%]" title="Laptops / Boards 42%" />
                  <div className="bg-cyan h-full w-[28%]" title="Smartphones 28%" />
                  <div className="bg-lavender h-full w-[18%]" title="Cables / Chargers 18%" />
                  <div className="bg-amber h-full w-[12%]" title="Peripherals 12%" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-text-muted pt-0.5">
                  <span>Laptops 42%</span>
                  <span>Phones 28%</span>
                  <span>Cables 18%</span>
                  <span>Other 12%</span>
                </div>
              </div>
            </div>

            {/* INTEGRATED SPONSOR BANNER DATA GRAPH (GRAPH IS SPONSOR BANNER) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">
                  E-Waste Trajectory & Sponsor Canvas
                </span>
                <span className="text-[9px] font-mono text-emerald">
                  Live Hardware Telemetry
                </span>
              </div>
              <SponsorBannerGraph campus={campus} />
            </div>

            {/* HOLOGRAPHIC TELEMETRY */}
            <div className="p-3 rounded-xl liquid-glass-subtle text-[10px] font-mono space-y-1">
              <div className="flex justify-between text-text-muted">
                <span>Holographic Tower Scale:</span>
                <span className="text-text-primary">{campus.towerHeight.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Geo Coordinates:</span>
                <span className="text-text-primary">
                  {campus.lat.toFixed(2)}°N, {campus.lng.toFixed(2)}°E
                </span>
              </div>
            </div>

          </div>

          {/* ACTION BUTTON: BOOST CAMPUS */}
          <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] space-y-2">
            <button
              onClick={handleBoost}
              disabled={isBoosting}
              className="w-full py-3.5 px-4 rounded-full font-bold text-sm text-background bg-emerald hover:brightness-105 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 shadow-emerald-glow disabled:opacity-50 liquid-glass-control"
            >
              <Zap className="w-4 h-4 fill-background" />
              <span>{isBoosting ? 'Recording Telemetry...' : 'Boost Campus (+250 kg)'}</span>
            </button>
            <p className="text-[10px] text-center text-text-muted">
              Simulates a 250 kg verified kiosk drop-off. Live re-sorts all global rankings.
            </p>
          </div>

        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

