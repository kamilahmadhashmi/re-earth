import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, TrendingUp, Cpu } from 'lucide-react'

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
    color: '#EAB308'
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
    color: '#C86432'
  },
  {
    id: 'cobalt',
    name: 'Battery Cobalt',
    symbol: 'Co',
    ewasteYieldPerTonne: '32 kg / Tonne',
    virginMiningPerTonne: '1.4 kg / Tonne',
    concentrationMultiplier: '22.8x Richer than Ore',
    marketValueKg: '$32.50 / kg',
    purity: 'Li-Ion Cathode Grade',
    color: '#06B6D4'
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
    color: '#94A3B8'
  }
]

export const ElementalHarvest: React.FC = () => {
  const [selectedYield, setSelectedYield] = useState<PreciousYield>(PRECIOUS_YIELDS[0])

  return (
    <div className="w-full bg-[#0D0F14]/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-copper block tracking-wide uppercase font-mono">
              Urban Mining Telemetry
            </span>
            <span className="text-xs text-zinc-400">
              Precious Elemental Yield Comparison
            </span>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald bg-emerald/10 px-2.5 py-1 rounded-lg border border-emerald/20">
          70x Ore Concentration
        </span>
      </div>

      {/* Yield Selector Buttons */}
      <div className="grid grid-cols-4 gap-2.5">
        {PRECIOUS_YIELDS.map((item) => {
          const isSelected = selectedYield.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSelectedYield(item)}
              className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-center h-20 cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.08] border-white/25 shadow-sm scale-[1.02]'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <span className="text-xl font-mono font-bold block leading-none" style={{ color: item.color }}>
                {item.symbol}
              </span>
              <span className="text-xs text-zinc-300 truncate mt-1.5 font-medium">
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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl bg-black/40 border border-white/[0.06] p-4.5 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-white" style={{ color: selectedYield.color }}>
              {selectedYield.name}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald bg-emerald/10 px-2.5 py-0.5 rounded-lg border border-emerald/25">
              {selectedYield.concentrationMultiplier}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-emerald/10 border border-emerald/25 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald font-semibold block">
                Re-Earth Collegiate Recovery:
              </span>
              <span className="text-sm font-bold font-mono text-white block">
                {selectedYield.ewasteYieldPerTonne}
              </span>
              <span className="text-xs text-zinc-400">Closed-loop hydrometallurgical refining</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Conventional Open-Pit Mining:
              </span>
              <span className="text-sm font-bold font-mono text-zinc-400 block">
                {selectedYield.virginMiningPerTonne}
              </span>
              <span className="text-xs text-zinc-400">Requires 1.8 tonnes diesel & explosives</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 text-zinc-400 font-mono">
            <span>Benchmark Market Value:</span>
            <span className="font-bold text-copper">{selectedYield.marketValueKg}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
