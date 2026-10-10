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
    <div className="w-full bg-[#131922] rounded-xl p-5 space-y-4 shadow-xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-copper block">
              Urban Mining Telemetry
            </span>
            <span className="text-xs text-text-secondary">
              Precious Elemental Yield Comparison
            </span>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded-md border border-emerald/20 font-medium">
          70x Ore Concentration
        </span>
      </div>

      {/* Yield Selector Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {PRECIOUS_YIELDS.map((item) => {
          const isSelected = selectedYield.id === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSelectedYield(item)}
              className={`p-2.5 rounded-md border transition-all text-center flex flex-col items-center justify-center h-18 ${
                isSelected
                  ? 'bg-white/[0.14] border-white/40 shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-lg font-mono font-bold block leading-none" style={{ color: item.color }}>
                {item.symbol}
              </span>
              <span className="text-xs text-text-secondary truncate mt-1">
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg bg-black/40 border border-white/[0.06] p-4 space-y-3"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-text-primary" style={{ color: selectedYield.color }}>
              {selectedYield.name}
            </span>
            <span className="text-xs font-mono font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-md border border-emerald/25">
              {selectedYield.concentrationMultiplier}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-md bg-emerald/10 border border-emerald/25 space-y-1">
              <span className="text-xs font-medium text-emerald block">
                RE-EARTH Collegiate Recovery:
              </span>
              <span className="text-sm font-bold font-mono text-text-primary block">
                {selectedYield.ewasteYieldPerTonne}
              </span>
              <span className="text-xs text-text-secondary">Closed-loop hydrometallurgical refining</span>
            </div>

            <div className="p-3 rounded-md bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-xs font-medium text-text-muted block">
                Conventional Open-Pit Mining:
              </span>
              <span className="text-sm font-bold font-mono text-text-muted block">
                {selectedYield.virginMiningPerTonne}
              </span>
              <span className="text-xs text-text-muted">Requires 1.8 tonnes diesel & explosives</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-text-muted">
            <span>Terminal Benchmark Value:</span>
            <span className="font-bold text-copper font-mono">{selectedYield.marketValueKg}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
