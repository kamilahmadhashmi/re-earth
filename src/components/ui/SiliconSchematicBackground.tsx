import React, { useEffect, useRef } from 'react'
import { useWorldStore } from '../../store/useWorldStore'

export const SiliconSchematicBackground: React.FC = () => {
  const { activeChapter, isEarthImmersive, viewMode } = useWorldStore()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track cursor for subtle spatial specular lens over circuitry
  useEffect(() => {
    let frameId: number
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const x = `${(e.clientX / window.innerWidth) * 100}%`
          const y = `${(e.clientY / window.innerHeight) * 100}%`
          containerRef.current.style.setProperty('--mouse-x', x)
          containerRef.current.style.setProperty('--mouse-y', y)
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  // Chapter-aware atmospheric gradient color configurations
  const getAtmosphericGlow = () => {
    switch (activeChapter) {
      case 1:
        // Chapter 1: The Crisis — Smoldering e-waste copper & lithium amber
        return 'radial-gradient(circle at 50% 50%, rgba(68, 28, 12, 0.70) 0%, rgba(46, 20, 8, 0.48) 32%, rgba(18, 12, 24, 0.26) 58%, rgba(5, 8, 14, 0) 78%)'
      case 2:
        // Chapter 2: Architectural Beacons — Luminous verdigris & beacon teal
        return 'radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.62) 0%, rgba(5, 122, 85, 0.42) 34%, rgba(14, 26, 42, 0.24) 58%, rgba(5, 8, 14, 0) 78%)'
      case 3:
        // Chapter 3: The Derby & Live Hub — High-voltage emerald & solar gold
        return 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.65) 0%, rgba(217, 119, 6, 0.38) 32%, rgba(8, 70, 55, 0.25) 58%, rgba(5, 8, 14, 0) 78%)'
      case 4:
        // Chapter 4: Circular OS — Reclaimed gold, copper & closed-loop attestation
        return 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.50) 0%, rgba(200, 100, 50, 0.35) 34%, rgba(234, 179, 8, 0.20) 58%, rgba(11, 15, 20, 0) 78%)'
      case 0:
      default:
        // Chapter 0: Genesis — Celestial deep cyan, verdigris & reclaimed copper
        return 'radial-gradient(circle at 50% 50%, rgba(12, 52, 74, 0.65) 0%, rgba(8, 76, 60, 0.42) 30%, rgba(36, 24, 12, 0.25) 55%, rgba(5, 8, 14, 0) 78%)'
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      } as React.CSSProperties}
    >
      {/* 1. LAYER A: Rich Midnight-Navy & Graphite Obsidian Substrate */}
      <div className="absolute inset-0 bg-[#05070D]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 130% 90% at 50% 30%, rgba(12, 22, 40, 0.85) 0%, rgba(7, 13, 25, 0.7) 45%, rgba(4, 7, 13, 0.98) 100%)'
        }}
      />

      {/* 2. LAYER B: Living Chapter-Reactive Atmospheric Halo Behind Earth */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[130vh] max-w-[1700px] max-h-[1700px] rounded-full pointer-events-none animate-atmosphere-breathe transition-opacity duration-700 ${
          isEarthImmersive || viewMode === 'skyline' ? 'opacity-35' : 'opacity-100'
        }`}
        style={{
          background: getAtmosphericGlow(),
          filter: 'blur(45px)',
          transition: 'background 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* 3. Interactive Spatial Specular Lens (follows cursor gently over circuits in normal mode) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isEarthImmersive || viewMode === 'skyline' ? 'opacity-0' : 'opacity-60'
        }`}
        style={{
          background: 'radial-gradient(circle 420px at var(--mouse-x) var(--mouse-y), rgba(45, 212, 191, 0.08) 0%, rgba(14, 165, 233, 0.03) 45%, transparent 100%)'
        }}
      />

      {/* 4. LAYER H: Subtle Optical Edge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 42%, rgba(4, 6, 11, 0.78) 100%)'
        }}
      />

      {/* 5. LAYERS C, D, E, G: High-Precision Sub-Silicon Vector Schematics & Live Electronic Pulses */}
      <svg
        className={`absolute inset-0 w-full h-full transition-all duration-700 ${
          isEarthImmersive || viewMode === 'skyline' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Micro Grid Dot Pattern for Substrate */}
          <pattern id="pcb-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.75" fill="#38BDF8" opacity="0.18" />
          </pattern>

          {/* Copper Contact Pad Definition */}
          <g id="contact-pin-group">
            <rect x="0" y="0" width="6" height="12" rx="1" fill="#F59E0B" opacity="0.85" />
            <rect x="10" y="0" width="6" height="12" rx="1" fill="#F59E0B" opacity="0.85" />
            <rect x="20" y="0" width="6" height="12" rx="1" fill="#F59E0B" opacity="0.85" />
            <rect x="30" y="0" width="6" height="12" rx="1" fill="#F59E0B" opacity="0.85" />
          </g>

          {/* Circular Economy Recovery Icon Node */}
          <g id="circular-recovery-node">
            <circle cx="0" cy="0" r="16" fill="none" stroke="#34D399" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
            <circle cx="0" cy="0" r="9" fill="none" stroke="#2DD4BF" strokeWidth="1" opacity="0.75" />
            <circle cx="0" cy="0" r="2.5" fill="#34D399" />
          </g>

          {/* Linear Gradients for Traveling Signal Pulses */}
          <linearGradient id="pulseCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="1" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pulseEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pulseGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Substrate Dot Matrix Grid */}
        <rect width="100%" height="100%" fill="url(#pcb-grid)" />

        {/* ================================================================= */}
        {/* LAYER E: Central Planetary Circular Routing Orbits                */}
        {/* ================================================================= */}
        <g transform="translate(960, 540)">
          {/* Orbital Track Rings with Refined Weights & Hierarchy */}
          <circle r="340" fill="none" stroke="#38BDF8" strokeWidth="1.0" strokeDasharray="8 10" opacity="0.26" />
          <circle r="430" fill="none" stroke="#2DD4BF" strokeWidth="0.8" strokeDasharray="3 12" opacity="0.22" />
          <circle r="540" fill="none" stroke="#F59E0B" strokeWidth="1.0" strokeDasharray="14 18" opacity="0.28" />
          <circle r="670" fill="none" stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="4 8" opacity="0.16" />

          {/* Alignment Crosshairs */}
          <line x1="-720" y1="0" x2="-360" y2="0" stroke="#38BDF8" strokeWidth="0.8" opacity="0.24" />
          <line x1="360" y1="0" x2="720" y2="0" stroke="#38BDF8" strokeWidth="0.8" opacity="0.24" />
          <line x1="0" y1="-600" x2="0" y2="-360" stroke="#38BDF8" strokeWidth="0.8" opacity="0.24" />
          <line x1="0" y1="360" x2="0" y2="600" stroke="#38BDF8" strokeWidth="0.8" opacity="0.24" />

          {/* Calibrated Gold Angle Ticks (0, 45, 90, 135, 180, 225, 270, 315 deg) */}
          <line x1="-340" y1="0" x2="-354" y2="0" stroke="#F59E0B" strokeWidth="1.6" opacity="0.75" />
          <line x1="340" y1="0" x2="354" y2="0" stroke="#F59E0B" strokeWidth="1.6" opacity="0.75" />
          <line x1="0" y1="-340" x2="0" y2="-354" stroke="#F59E0B" strokeWidth="1.6" opacity="0.75" />
          <line x1="0" y1="340" x2="0" y2="354" stroke="#F59E0B" strokeWidth="1.6" opacity="0.75" />

          <line x1="-382" y1="-382" x2="-391" y2="-391" stroke="#F59E0B" strokeWidth="1.4" opacity="0.65" />
          <line x1="382" y1="-382" x2="391" y2="-391" stroke="#F59E0B" strokeWidth="1.4" opacity="0.65" />
          <line x1="-382" y1="382" x2="-391" y2="391" stroke="#F59E0B" strokeWidth="1.4" opacity="0.65" />
          <line x1="382" y1="382" x2="391" y2="391" stroke="#F59E0B" strokeWidth="1.4" opacity="0.65" />

          {/* Rotating Planetary Instrumentation Nodes (Smooth Slow Orbital Drift) */}
          <g className="animate-orbital-spin-cw">
            <circle cx="430" cy="0" r="3" fill="#2DD4BF" opacity="0.7" />
            <circle cx="430" cy="0" r="7" fill="none" stroke="#2DD4BF" strokeWidth="0.8" opacity="0.4" />
            <circle cx="-430" cy="0" r="2.5" fill="#38BDF8" opacity="0.6" />
          </g>

          <g className="animate-orbital-spin-ccw">
            <circle cx="0" cy="540" r="3.5" fill="#F59E0B" opacity="0.7" />
            <circle cx="0" cy="540" r="8" fill="none" stroke="#F59E0B" strokeWidth="0.8" opacity="0.4" />
            <circle cx="0" cy="-540" r="2.5" fill="#34D399" opacity="0.6" />
          </g>
        </g>

        {/* ================================================================= */}
        {/* LAYER C & D: Orthogonal Bus Lines & Traveling Signal Pulses        */}
        {/* ================================================================= */}

        {/* TOP LEFT BUS SYSTEM */}
        <g fill="none">
          {/* Base Copper Traces */}
          <path d="M 60,110 L 320,110 L 380,170 L 580,170" stroke="#475569" strokeWidth="1.2" opacity="0.25" />
          <path d="M 60,135 L 300,135 L 360,195 L 640,195" stroke="#334155" strokeWidth="0.8" opacity="0.20" />
          <path d="M 60,160 L 270,160 L 330,220 L 480,220 L 520,260 L 700,260" stroke="#475569" strokeWidth="1.2" opacity="0.25" />
          
          {/* Active Electronic Pulse Overlays */}
          <path
            d="M 60,110 L 320,110 L 380,170 L 580,170"
            stroke="url(#pulseCyan)"
            strokeWidth="2.2"
            strokeDasharray="28 180"
            className="animate-pulse-travel-1"
          />
          <path
            d="M 60,160 L 270,160 L 330,220 L 480,220 L 520,260 L 700,260"
            stroke="url(#pulseEmerald)"
            strokeWidth="2.0"
            strokeDasharray="24 190"
            className="animate-pulse-travel-2"
          />

          {/* Terminating Connection Pads */}
          <circle cx="580" cy="170" r="3" fill="#38BDF8" opacity="0.65" />
          <circle cx="640" cy="195" r="2.5" fill="#64748B" opacity="0.5" />
          <circle cx="700" cy="260" r="3" fill="#34D399" opacity="0.65" />
        </g>

        {/* BOTTOM LEFT BUS SYSTEM */}
        <g fill="none">
          {/* Base Traces */}
          <path d="M 80,950 L 290,950 L 350,890 L 550,890 L 590,850 L 730,850" stroke="#475569" strokeWidth="1.2" opacity="0.25" />
          <path d="M 60,980 L 330,980 L 390,920 L 650,920" stroke="#334155" strokeWidth="0.8" opacity="0.20" />

          {/* Active Pulses */}
          <path
            d="M 80,950 L 290,950 L 350,890 L 550,890 L 590,850 L 730,850"
            stroke="url(#pulseGold)"
            strokeWidth="2.2"
            strokeDasharray="30 200"
            className="animate-pulse-travel-3"
          />

          <circle cx="730" cy="850" r="3" fill="#F59E0B" opacity="0.65" />
          <circle cx="650" cy="920" r="2.5" fill="#64748B" opacity="0.5" />
        </g>

        {/* TOP RIGHT BUS SYSTEM */}
        <g fill="none">
          {/* Base Traces */}
          <path d="M 1860,120 L 1630,120 L 1570,180 L 1370,180 L 1330,220 L 1230,220" stroke="#475569" strokeWidth="1.2" opacity="0.25" />
          <path d="M 1860,145 L 1650,145 L 1590,205 L 1420,205" stroke="#334155" strokeWidth="0.8" opacity="0.20" />

          {/* Active Pulses */}
          <path
            d="M 1860,120 L 1630,120 L 1570,180 L 1370,180 L 1330,220 L 1230,220"
            stroke="url(#pulseCyan)"
            strokeWidth="2.2"
            strokeDasharray="26 180"
            className="animate-pulse-travel-4"
          />

          <circle cx="1230" cy="220" r="3" fill="#2DD4BF" opacity="0.65" />
          <circle cx="1420" cy="205" r="2.5" fill="#64748B" opacity="0.5" />
        </g>

        {/* BOTTOM RIGHT BUS SYSTEM */}
        <g fill="none">
          {/* Base Traces */}
          <path d="M 1860,930 L 1670,930 L 1610,870 L 1410,870 L 1370,830 L 1220,830" stroke="#475569" strokeWidth="1.2" opacity="0.25" />
          <path d="M 1860,960 L 1640,960 L 1580,900 L 1330,900" stroke="#334155" strokeWidth="0.8" opacity="0.20" />

          {/* Active Pulses */}
          <path
            d="M 1860,930 L 1670,930 L 1610,870 L 1410,870 L 1370,830 L 1220,830"
            stroke="url(#pulseEmerald)"
            strokeWidth="2.0"
            strokeDasharray="28 190"
            className="animate-pulse-travel-1"
          />

          <circle cx="1220" cy="830" r="3" fill="#34D399" opacity="0.65" />
          <circle cx="1330" cy="900" r="2.5" fill="#64748B" opacity="0.5" />
        </g>

        {/* ================================================================= */}
        {/* LAYER G: Corner Engineering IC Footprints & Recovery Nodes        */}
        {/* ================================================================= */}

        {/* Structural IC Footprint — TOP LEFT (ASIC // RE-EARTH) */}
        <g transform="translate(130, 220)">
          <rect x="0" y="0" width="130" height="96" rx="4" fill="rgba(8, 14, 26, 0.45)" stroke="#38BDF8" strokeWidth="1.2" opacity="0.45" />
          <rect x="10" y="10" width="110" height="76" rx="2" fill="none" stroke="#64748B" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.35" />
          <use href="#contact-pin-group" x="46" y="-12" />
          <use href="#contact-pin-group" x="46" y="96" />

          {/* Micro Power Indicator Dot */}
          <circle cx="20" cy="22" r="2" fill="#34D399" opacity="0.85" />
          <circle cx="20" cy="22" r="5" fill="none" stroke="#34D399" strokeWidth="0.6" opacity="0.4" />

          <text x="65" y="48" fill="#F1F5F9" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" opacity="0.75" fontWeight="600">
            ASIC // RE-EARTH
          </text>
          <text x="65" y="62" fill="#38BDF8" fontSize="6.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8" opacity="0.65">
            0.8nm CIRCULAR DIE
          </text>
        </g>

        {/* Secondary IC Footprint — BOTTOM RIGHT (PMIC // RECOVERY) */}
        <g transform="translate(1650, 700)">
          <rect x="0" y="0" width="124" height="88" rx="4" fill="rgba(8, 14, 26, 0.45)" stroke="#2DD4BF" strokeWidth="1.2" opacity="0.45" />
          <rect x="9" y="9" width="106" height="70" rx="2" fill="none" stroke="#64748B" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.35" />
          <use href="#contact-pin-group" x="44" y="-12" />
          <use href="#contact-pin-group" x="44" y="88" />

          {/* Micro Power Indicator Dot */}
          <circle cx="20" cy="20" r="2" fill="#38BDF8" opacity="0.85" />
          <circle cx="20" cy="20" r="5" fill="none" stroke="#38BDF8" strokeWidth="0.6" opacity="0.4" />

          <text x="62" y="46" fill="#F1F5F9" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" opacity="0.75" fontWeight="600">
            PMIC // RECOVERY
          </text>
          <text x="62" y="58" fill="#34D399" fontSize="6" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8" opacity="0.65">
            WEEE DUAL-LOOP
          </text>
        </g>

        {/* Circular Recovery Nodes at Trace Junctions */}
        <use href="#circular-recovery-node" x="580" y="170" />
        <use href="#circular-recovery-node" x="1370" y="180" />
        <use href="#circular-recovery-node" x="550" y="890" />
        <use href="#circular-recovery-node" x="1410" y="870" />

        {/* ================================================================= */}
        {/* Architectural Micro-Typography Annotations (Desktop Only)          */}
        {/* ================================================================= */}
        <g className="hidden md:inline" fill="#94A3B8" fontFamily="monospace" fontSize="7.5" letterSpacing="1.2" opacity="0.45">
          <text x="75" y="80">PCB-REV.2026 // SUB-SURFACE SILICON SUBSTRATE</text>
          <text x="75" y="94">CU-PURITY: 99.98% // AU-CONTACT: 24K VACUUM DEPOSITION</text>
          <text x="1845" y="80" textAnchor="end">CIRCULAR HARDWARE ARCHITECTURE // WEEE CLASS 4</text>
          <text x="1845" y="94" textAnchor="end">LITHIUM-COBALT CLOSED LOOP: OPERATIONAL</text>
          <text x="75" y="980">ANODIZED RECYCLED CHASSIS SPEC // ZERO VIRGIN MINING</text>
          <text x="75" y="995">TERRESTRIAL HARDWARE CAPTURE: 100% TRACEABLE</text>
          <text x="1845" y="980" textAnchor="end">ISO-14040 LIFE-CYCLE METRICS // REAL-TIME TELEMETRY</text>
          <text x="1845" y="995" textAnchor="end">RE-EARTH ENGINE // SPATIAL SILICON RECOVERY v2.6</text>
        </g>

        {/* ================================================================= */}
        {/* Optical Fiducial Alignment Markers (4 Corners)                    */}
        {/* ================================================================= */}
        <g stroke="#94A3B8" strokeWidth="0.9" fill="none" opacity="0.45">
          {/* Top Left */}
          <circle cx="45" cy="45" r="8" />
          <circle cx="45" cy="45" r="2.5" fill="#38BDF8" />
          <line x1="31" y1="45" x2="59" y2="45" />
          <line x1="45" y1="31" x2="45" y2="59" />

          {/* Top Right */}
          <circle cx="1875" cy="45" r="8" />
          <circle cx="1875" cy="45" r="2.5" fill="#38BDF8" />
          <line x1="1861" y1="45" x2="1889" y2="45" />
          <line x1="1875" y1="31" x2="1875" y2="59" />

          {/* Bottom Left */}
          <circle cx="45" cy="995" r="8" />
          <circle cx="45" cy="995" r="2.5" fill="#38BDF8" />
          <line x1="31" y1="995" x2="59" y2="995" />
          <line x1="45" y1="981" x2="45" y2="1009" />

          {/* Bottom Right */}
          <circle cx="1875" cy="995" r="8" />
          <circle cx="1875" cy="995" r="2.5" fill="#38BDF8" />
          <line x1="1861" y1="995" x2="1889" y2="995" />
          <line x1="1875" y1="981" x2="1875" y2="1009" />
        </g>
      </svg>
    </div>
  )
}
