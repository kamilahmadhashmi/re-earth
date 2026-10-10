import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Layers, TrendingUp, Cpu } from 'lucide-react'

interface PreciousYield {
  id: string
  name: string
  symbol: string
  ewasteYieldPerTonne: string
  virginMiningPerTonne: string
  concentrationMultiplier: string
  marketValueKg: string
  purity: string
  color: string
}

const PRECIOUS_YIELDS: PreciousYield[] = [
  {
    id: 'gold',
    name: '24K Refined Gold',
    symbol: 'Au',
    ewasteYieldPerTonne: '340 grams / Tonne',
    virginMiningPerTonne: '4.8 grams / Tonne',
    concentrationMultiplier: '70.8x Richer than Ore',
    marketValueKg: '$78,400 / kg',
    purity: '99.99% Electronic Grade',
    color: '#F59E0B'
  },
  {
    id: 'copper',
    name: 'Cathode Copper',
    symbol: 'Cu',
    ewasteYieldPerTonne: '138 kg / Tonne',
    virginMiningPerTonne: '5.2 kg / Tonne',
    concentrationMultiplier: '26.5x Richer than Ore',
    marketValueKg: '$9.85 / kg',
    purity: '99.95% High Conductivity',
    color: '#FB923C'
  },
  {
    id: 'cobalt',
    name: 'Battery Cobalt',
    symbol: 'Co',
    ewasteYieldPerTonne: '32 kg / Tonne',
    virginMiningPerTonne: '1.4 kg / Tonne',
    concentrationMultiplier: '22.8x Richer than Ore',
    marketValueKg: '$32.50 / kg',
    purity: 'Battery Cathode Spec',
    color: '#38BDF8'
  },
  {
    id: 'silver',
    name: 'Fine Silver',
    symbol: 'Ag',
    ewasteYieldPerTonne: '1,250 grams / Tonne',
    virginMiningPerTonne: '45 grams / Tonne',
    concentrationMultiplier: '27.7x Richer than Ore',
    marketValueKg: '$940 / kg',
    purity: 'Photovoltaic Grade',
    color: '#E2E8F0'
  }
]

export const ElementalHarvest: React.FC = () => {
  const [selectedYield, setSelectedYield] = useState<PreciousYield>(PRECIOUS_YIELDS[0])

  return (
    <div className="w-full liquid-glass specular-rim rounded-3xl p-5 space-y-4 shadow-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-400 block">
              Urban Mining Telemetry
            </span>
            <span className="text-xs font-semibold text-text-primary">
              Precious Elemental Yield Comparison
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20 font-bold">
          70x ORE CONCENTRATION
        </span>
      </div>

      {/* Yield Selector Pills */}
      <div className="grid grid-cols-4 gap-2">
        {PRECIOUS_YIELDS.map((item) => {
          const isSelected = selectedYield.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSelectedYield(item)}
              className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center h-18 liquid-glass-control ${
                isSelected
                  ? 'bg-white/[0.14] border-white/40 shadow-md scale-[1.02]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-lg font-mono font-bold block leading-none" style={{ color: item.color }}>
                {item.symbol}
              </span>
              <span className="text-[10px] text-text-secondary truncate mt-1">
                {item.name.split(' ')[1] || item.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Comparison Visualizer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYield.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-black/40 border border-white/[0.06] p-4 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-text-primary" style={{ color: selectedYield.color }}>
              {selectedYield.name}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald bg-emerald/10 px-2.5 py-0.5 rounded-full border border-emerald/25">
              {selectedYield.concentrationMultiplier}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/25 space-y-1">
              <span className="text-[9px] font-mono uppercase text-emerald font-bold block">
                RE-EARTH Collegiate Recovery:
              </span>
              <span className="text-sm font-extrabold font-mono text-text-primary block">
                {selectedYield.ewasteYieldPerTonne}
              </span>
              <span className="text-[10px] text-text-secondary">Closed-loop hydrometallurgical refining</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[9px] font-mono uppercase text-text-muted block">
                Conventional Open-Pit Mining:
              </span>
              <span className="text-sm font-extrabold font-mono text-text-muted block">
                {selectedYield.virginMiningPerTonne}
              </span>
              <span className="text-[10px] text-text-muted">Requires 1.8 tonnes diesel & explosives</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-text-muted">
            <span>Terminal Benchmark Value:</span>
            <span className="font-bold text-cyan font-mono">{selectedYield.marketValueKg}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
