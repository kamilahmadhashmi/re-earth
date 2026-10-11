import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull } from 'lucide-react'

interface ToxicElement {
  id: string
  symbol: string
  atomicNumber: number
  name: string
  primarySource: string
  leachHalfLife: string
  groundwaterRisk: string
  biologicalImpact: string
  color: string
}

const TOXIC_ELEMENTS: ToxicElement[] = [
  {
    id: 'lead',
    symbol: 'Pb',
    atomicNumber: 82,
    name: 'Lead',
    primarySource: 'Cathode Ray Tubes, Circuit Board Solder',
    leachHalfLife: '450+ Years',
    groundwaterRisk: 'Critical (Bioaccumulative)',
    biologicalImpact: 'Severe neurological damage, cognitive deficit, kidney necrosis.',
    color: '#FF6B6B'
  },
  {
    id: 'mercury',
    symbol: 'Hg',
    atomicNumber: 80,
    name: 'Mercury',
    primarySource: 'Flat Panel Backlights, Tilt Sensors',
    leachHalfLife: 'Indefinite',
    groundwaterRisk: 'Extreme (Methylmercury vapor)',
    biologicalImpact: 'Central nervous system decay, congenital birth defects, sensory impairment.',
    color: '#FF922B'
  },
  {
    id: 'cadmium',
    symbol: 'Cd',
    atomicNumber: 48,
    name: 'Cadmium',
    primarySource: 'Chip Resistors, Ni-Cd Battery Packs',
    leachHalfLife: '300+ Years',
    groundwaterRisk: 'High (Soluble in acid rain)',
    biologicalImpact: 'Itai-itai osteomalacia (bone softening), irreversible renal failure.',
    color: '#FCC419'
  },
  {
    id: 'bfr',
    symbol: 'Br',
    atomicNumber: 35,
    name: 'Brominated Flame Retardants',
    primarySource: 'Printed Circuit Substrates, Plastic Casings',
    leachHalfLife: '120+ Years',
    groundwaterRisk: 'High (Endocrine disruptor)',
    biologicalImpact: 'Thyroid hormone disruption, cancer risk upon thermal open-air incineration.',
    color: '#E599F7'
  }
]

export const ToxicityMatrix: React.FC = () => {
  const [activeElement, setActiveElement] = useState<ToxicElement>(TOXIC_ELEMENTS[0])

  return (
    <div className="w-full bg-[#0D0F14]/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Skull className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-400 block tracking-wide uppercase font-mono">
              Landfill Leach Matrix
            </span>
            <span className="text-xs text-zinc-400">
              Chemical Dispersion Telemetry
            </span>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
          Isotope Profile
        </span>
      </div>

      {/* Element Selector Tabs */}
      <div className="grid grid-cols-4 gap-2.5">
        {TOXIC_ELEMENTS.map((el) => {
          const isSelected = activeElement.id === el.id
          return (
            <button
              key={el.id}
              onClick={() => setActiveElement(el)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.08] border-white/25 shadow-sm scale-[1.02]'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-zinc-400 font-bold">{el.atomicNumber}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: el.color }}
                />
              </div>
              <div>
                <span className="text-xl font-bold font-mono block leading-none" style={{ color: el.color }}>
                  {el.symbol}
                </span>
                <span className="text-xs text-zinc-300 truncate block mt-0.5 font-medium">
                  {el.name}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Element Detail Breakdown */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeElement.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl bg-black/40 border border-white/[0.06] p-4.5 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span style={{ color: activeElement.color }}>{activeElement.name}</span>
              <span className="text-xs font-mono text-zinc-400 font-normal">
                ({activeElement.symbol} #{activeElement.atomicNumber})
              </span>
            </h4>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Half-Life: <span className="font-bold">{activeElement.leachHalfLife}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">Hardware Origin:</span>
              <span className="text-zinc-200 font-medium text-xs block mt-0.5">{activeElement.primarySource}</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">Aquifer Diffusion Risk:</span>
              <span className="text-rose-400 font-medium text-xs block mt-0.5">{activeElement.groundwaterRisk}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">Toxicological Impact:</span>
            <p className="text-xs text-zinc-300 leading-relaxed mt-0.5">
              {activeElement.biologicalImpact}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
