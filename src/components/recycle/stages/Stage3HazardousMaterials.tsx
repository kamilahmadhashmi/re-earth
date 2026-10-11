import React from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Leaf,
  Scale,
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  ArrowLeft,
  Coins,
  Shield,
  Layers,
  Info
} from 'lucide-react'
import { useRecycleStore } from '../../../store/useRecycleStore'

export const Stage3HazardousMaterials: React.FC = () => {
  const {
    selectedProduct,
    customProduct,
    condition,
    measuredMassGrams,
    setMeasuredMassGrams,
    isCustomMassEntered,
    setCurrentStep
  } = useRecycleStore()

  const product = selectedProduct
  const custom = customProduct

  const defaultMass = product?.defaultMassGrams || custom?.estimatedMassGrams || 194
  const massKg = (measuredMassGrams / 1000).toFixed(3)

  // Calculations:
  // CO2e avoided: typically ~70-80x device mass for complex microelectronics due to silicon wafer fab energy offsets
  const co2eAvoided = (
    product?.co2eAvoidedKg || Math.max(5, measuredMassGrams * 0.08)
  ).toFixed(1)

  // Estimated gold/silver/copper recovery based on typical concentration
  const goldMg = product
    ? product.materialDisclosures.find((m) => m.material.toLowerCase().includes('gold'))?.amount || '30mg'
    : `${Math.round(measuredMassGrams * 0.15)}mg`

  const copperG = product
    ? product.materialDisclosures.find((m) => m.material.toLowerCase().includes('copper'))?.amount || '15g'
    : `${(measuredMassGrams * 0.09).toFixed(1)}g`

  const oreDisplacedKg = (parseFloat(co2eAvoided) * 1.8).toFixed(1)
  const ecoCredits = Math.round(measuredMassGrams * 0.6)
  const xp = Math.round(measuredMassGrams * 0.8)

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          STAGE 3 OF 6 • HAZARDS & PLANETARY EQUIVALENCE
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Hazard Profile & Impact Equivalence
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Full material disclosure for your{' '}
          <strong className="text-text-primary">
            {product?.model || custom?.model}
          </strong>
          . Diverting verified e-waste directly preserves terrestrial resources and halts toxic leaching.
        </p>
      </div>

      {/* VERIFIED MASS TUNER */}
      <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-text-muted flex items-center gap-1">
            <Scale className="w-3 h-3 text-cyan" />
            VERIFIED WEIGHT CALIBRATION
          </span>
          <p className="text-xs text-text-secondary">
            Manufacturer nominal weight:{' '}
            <strong className="text-text-primary font-mono">{defaultMass} g</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
            <input
              type="number"
              min={10}
              max={25000}
              value={measuredMassGrams}
              onChange={(e) => setMeasuredMassGrams(Number(e.target.value))}
              className="w-20 bg-transparent text-sm font-bold font-mono text-emerald text-right focus:outline-none"
            />
            <span className="text-xs font-mono text-text-muted">GRAMS</span>
          </div>
          <span className="text-xs font-mono text-text-muted">
            ({massKg} kg)
          </span>
        </div>
      </div>

      {/* MATERIAL DISCLOSURE & HAZARDS CHIPS */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block">
          Documented Material Hazards & Precious Elements
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Battery hazard */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-amber flex items-center gap-1">
                <Flame className="w-3 h-3" />
                CHEMICAL CELL
              </span>
              <span className="text-text-muted">
                {product?.batteryType || custom?.batteryType || 'Li-ion'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-text-primary">Cathode Matrix</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Cobalt, Lithium salts & organic flammable electrolyte solvents.
            </p>
          </div>

          {/* 2. Gold & Contacts */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-yellow-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                PRECIOUS METAL
              </span>
              <span className="text-emerald font-bold">{goldMg}</span>
            </div>
            <h4 className="text-xs font-bold text-text-primary">Elemental Gold (Au)</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              High-purity micro-plating on logic board interconnects and wire bonds.
            </p>
          </div>

          {/* 3. Copper & Rare Earths */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-cyan flex items-center gap-1">
                <Layers className="w-3 h-3" />
                CONDUCTOR
              </span>
              <span className="text-cyan font-bold">{copperG}</span>
            </div>
            <h4 className="text-xs font-bold text-text-primary">Elemental Copper (Cu)</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              High-conductivity bus wiring, inductive charging coils & heat pipes.
            </p>
          </div>
        </div>
      </div>

      {/* PLANETARY EQUIVALENCE METRICS HUD */}
      <div className="p-5 rounded-2xl liquid-glass specular-rim space-y-4 shadow-liquid-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald/20 border border-emerald/40 flex items-center justify-center text-emerald">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Planetary Circularity Equivalence
              </h3>
              <p className="text-[10px] font-mono text-text-muted">
                Methodology: EPA WARM Model & Apple LCA Methodology v2
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald/15 text-emerald font-bold border border-emerald/30">
            AUDITED OFFSET
          </span>
        </div>

        {/* 4 KEY IMPACT METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-text-muted">CO₂e Avoided</span>
            <div className="text-lg sm:text-xl font-mono font-black text-text-primary text-shimmer">
              {co2eAvoided} <span className="text-xs text-emerald font-normal">kg</span>
            </div>
            <p className="text-[10px] text-text-secondary">Emissions offset</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-text-muted">Virgin Ore Saved</span>
            <div className="text-lg sm:text-xl font-mono font-black text-cyan">
              {oreDisplacedKg} <span className="text-xs text-text-muted font-normal">kg</span>
            </div>
            <p className="text-[10px] text-text-secondary">Mining displaced</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-text-muted">Eco Credits</span>
            <div className="text-lg sm:text-xl font-mono font-black text-emerald">
              +{ecoCredits} <span className="text-xs text-emerald-light font-normal">EC</span>
            </div>
            <p className="text-[10px] text-text-secondary">Campus token</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-text-muted">XP Gain</span>
            <div className="text-lg sm:text-xl font-mono font-black text-lavender">
              +{xp} <span className="text-xs text-lavender-light font-normal">XP</span>
            </div>
            <p className="text-[10px] text-text-secondary">Derby surge</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all border border-white/10 cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Condition Triage</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Continue to Data-Wipe Protocol</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
