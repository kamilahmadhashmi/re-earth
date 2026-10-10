import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Droplets, ShieldAlert, Skull, Info } from 'lucide-react'

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
    <div className="w-full liquid-glass specular-rim rounded-3xl p-5 space-y-4 shadow-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Skull className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-rose-400 block">
              Landfill Leach Matrix
            </span>
            <span className="text-xs font-semibold text-text-primary">
              Chemical Dispersion Telemetry
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          SELECT ISOTOPE
        </span>
      </div>

      {/* Element Selector Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {TOXIC_ELEMENTS.map((el) => {
          const isSelected = activeElement.id === el.id
          return (
            <button
              key={el.id}
              onClick={() => setActiveElement(el)}
              className={`p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 liquid-glass-control ${
                isSelected
                  ? 'bg-white/[0.12] border-white/40 shadow-md scale-[1.02]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-text-muted">{el.atomicNumber}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: el.color }}
                />
              </div>
              <div>
                <span className="text-xl font-bold font-mono block leading-none" style={{ color: el.color }}>
                  {el.symbol}
                </span>
                <span className="text-[10px] text-text-secondary truncate block mt-0.5">
                  {el.name}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Element Detail Breakdown with Animated Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeElement.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-black/40 border border-white/[0.06] p-4 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span style={{ color: activeElement.color }}>{activeElement.name}</span>
              <span className="text-xs font-mono text-text-muted font-normal">
                ({activeElement.symbol} #{activeElement.atomicNumber})
              </span>
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Leach Half-Life: {activeElement.leachHalfLife}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Hardware Origin:</span>
              <span className="text-text-secondary font-medium text-[11px] block mt-0.5">{activeElement.primarySource}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Aquifer Diffusion Risk:</span>
              <span className="text-rose-400 font-medium text-[11px] block mt-0.5">{activeElement.groundwaterRisk}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] font-mono text-text-muted uppercase block">Toxicological Impact:</span>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
              {activeElement.biologicalImpact}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
