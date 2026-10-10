import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Laptop, Smartphone, BatteryCharging, Cable, Zap, CheckCircle2, ShieldCheck } from 'lucide-react'
import confetti from 'canvas-confetti'

export const HardwareFootprintTerminal: React.FC = () => {
  const [laptops, setLaptops] = useState(1)
  const [phones, setPhones] = useState(2)
  const [batteries, setBatteries] = useState(3)
  const [cables, setCables] = useState(4)
  const [isMinted, setIsMinted] = useState(false)

  // Calculations
  const totalKg = laptops * 2.2 + phones * 0.18 + batteries * 0.35 + cables * 0.12
  const copperGrams = Math.round(laptops * 310 + phones * 24 + batteries * 40 + cables * 85)
  const goldMg = Math.round(laptops * 48 + phones * 14 + batteries * 2)
  const waterSavedLiters = Math.round(totalKg * 420)

  const handleMintCertificate = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#30D158', '#64D2FF', '#BF5AF2', '#FFD60A', '#FFFFFF']
    })
    setIsMinted(true)
  }

  return (
    <div className="w-full liquid-glass specular-rim rounded-3xl p-6 space-y-5 shadow-2xl border border-white/[0.08] text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald/20 border border-emerald/40 flex items-center justify-center text-emerald">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Personal Hardware Salvage Terminal
            </h3>
            <p className="text-[10px] text-text-muted font-mono">
              Calculate your personal e-waste diversion ledger
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald bg-emerald/10 px-2.5 py-0.5 rounded-full border border-emerald/20 font-bold">
          LIVE COMPUTED
        </span>
      </div>

      {/* Steppers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Laptops */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <Laptop className="w-4 h-4 text-cyan" />
            <span className="text-[9px] font-mono">2.2kg / ea</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary block">Laptops</span>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setLaptops(Math.max(0, laptops - 1))}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold font-mono text-text-primary">{laptops}</span>
              <button
                onClick={() => setLaptops(laptops + 1)}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Phones */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <Smartphone className="w-4 h-4 text-emerald" />
            <span className="text-[9px] font-mono">0.18kg / ea</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary block">Smartphones</span>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setPhones(Math.max(0, phones - 1))}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold font-mono text-text-primary">{phones}</span>
              <button
                onClick={() => setPhones(phones + 1)}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Batteries */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <BatteryCharging className="w-4 h-4 text-amber" />
            <span className="text-[9px] font-mono">0.35kg / ea</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary block">Power Packs</span>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setBatteries(Math.max(0, batteries - 1))}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold font-mono text-text-primary">{batteries}</span>
              <button
                onClick={() => setBatteries(batteries + 1)}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Cables */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <Cable className="w-4 h-4 text-lavender" />
            <span className="text-[9px] font-mono">0.12kg / ea</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary block">Cables & Chargers</span>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setCables(Math.max(0, cables - 1))}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                -
              </button>
              <span className="text-sm font-bold font-mono text-text-primary">{cables}</span>
              <button
                onClick={() => setCables(cables + 1)}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-mono font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Metrics Box */}
      <div className="rounded-2xl bg-black/40 border border-white/[0.06] p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div>
          <span className="text-[9px] font-mono text-text-muted uppercase block">Total Diverted</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-emerald">
            {totalKg.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-text-muted block">KG</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-text-muted uppercase block">Pure Copper</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-cyan">
            {copperGrams}
          </span>
          <span className="text-[10px] font-mono text-text-muted block">GRAMS</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-text-muted uppercase block">24K Gold</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-amber">
            {goldMg}
          </span>
          <span className="text-[10px] font-mono text-text-muted block">MG</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-text-muted uppercase block">Aquifer Protected</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-lavender">
            {waterSavedLiters}
          </span>
          <span className="text-[10px] font-mono text-text-muted block">LITERS</span>
        </div>
      </div>

      {/* Certificate Minting Action */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          {isMinted
            ? '✓ Verified Ledger Attestation Generated: Hash #0x8F92...D41E'
            : 'Simulate personal drop-off and mint cryptographically attested hardware receipt.'}
        </p>
        <button
          onClick={handleMintCertificate}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
        >
          {isMinted ? (
            <>
              <CheckCircle2 className="w-4 h-4 fill-background" />
              <span>Attestation Minted</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Drop-Off Receipt</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
