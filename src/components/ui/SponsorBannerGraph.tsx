import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import type { RankedCampus } from '../../shared/ranking'
import { SPONSOR_MAP, SPONSORS, type Sponsor } from '../../data/sponsors'
import {
  SPONSOR_THEMES,
  generateCampusCollectionHistory,
  type CollectionDataPoint
} from '../../data/sponsorBannerThemes'

interface SponsorBannerGraphProps {
  campus: RankedCampus
  onSelectSponsor?: (sponsorId: string) => void
}

export const SponsorBannerGraph: React.FC<SponsorBannerGraphProps> = ({
  campus,
  onSelectSponsor
}) => {
  // Allow toggling/rotating sponsor if desired, default to campus's assigned sponsor
  const [activeSponsorId, setActiveSponsorId] = useState<string>(campus.sponsorId)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [viewMetric, setViewMetric] = useState<'period' | 'cumulative'>('period')

  const sponsor: Sponsor = useMemo(() => {
    return SPONSOR_MAP.get(activeSponsorId) || SPONSOR_MAP.get('google')!
  }, [activeSponsorId])

  const theme = useMemo(() => {
    return SPONSOR_THEMES[sponsor.id] || SPONSOR_THEMES.google
  }, [sponsor.id])

  // Deterministic realistic collection history
  const history: CollectionDataPoint[] = useMemo(() => {
    return generateCampusCollectionHistory(campus.allTimeKg, campus.weeklyKg)
  }, [campus.allTimeKg, campus.weeklyKg])

  // Max value calculation for SVG chart coordinates
  const values = history.map((d) => (viewMetric === 'period' ? d.kg : d.cumulativeKg))
  const maxVal = Math.max(...values) * 1.15
  const minVal = Math.min(...values) * 0.85

  // SVG dimensions
  const svgWidth = 320
  const svgHeight = 120
  const padX = 20
  const padTop = 15
  const padBottom = 25

  // Calculate curve points
  const points = useMemo(() => {
    return history.map((d, i) => {
      const val = viewMetric === 'period' ? d.kg : d.cumulativeKg
      const x = padX + (i / (history.length - 1)) * (svgWidth - padX * 2)
      const normY = (val - minVal) / (maxVal - minVal || 1)
      const y = svgHeight - padBottom - normY * (svgHeight - padTop - padBottom)
      return { x, y, data: d }
    })
  }, [history, viewMetric, minVal, maxVal])

  // Build SVG smooth path command
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' }

    let dLine = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cx = (p0.x + p1.x) / 2
      dLine += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
    }

    const dArea = `${dLine} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
    return { linePath: dLine, areaPath: dArea }
  }, [points])

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl transition-all duration-300 group">
      
      {/* ========================================================= */}
      {/* LAYER 1: THE SPONSOR'S BRAND CANVAS (THE GRAPH BACKGROUND) */}
      {/* ========================================================= */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: `linear-gradient(145deg, #07090D 0%, ${sponsor.color}14 45%, #050608 100%)`
        }}
      />

      {/* Integrated Brand Motif & Micro-Circuit Patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 200"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Fine Grid Motif */}
            <pattern id={`sponsor-grid-${sponsor.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke={sponsor.color} strokeWidth="0.5" strokeOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#sponsor-grid-${sponsor.id})`} />

          {/* Watermarked Giant Sponsor Brand Mark across Canvas */}
          <text
            x="95%"
            y="75%"
            textAnchor="end"
            fill={sponsor.color}
            fillOpacity="0.08"
            fontSize="54"
            fontFamily="monospace"
            fontWeight="900"
            letterSpacing="4"
          >
            {sponsor.logoText}
          </text>

          {/* Watermarked Corporate Mission Ribbon */}
          <line x1="0" y1="36" x2="320" y2="36" stroke={sponsor.color} strokeWidth="0.75" strokeDasharray="4 6" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* Radiant Sponsor Brand Light Beam behind Graph Apex */}
      {/* ========================================================= */}
      {/* LAYER 2: SPONSOR IDENTITY HEADER INTEGRATED INTO CHART     */}
      {/* ========================================================= */}
      <div className="relative z-10 px-4 pt-3.5 pb-2 flex items-center justify-between border-b border-white/[0.08] bg-surface-elevated">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-[10px] tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${sponsor.color}20`,
              color: sponsor.color,
              border: `1px solid ${sponsor.color}50`
            }}
          >
            {sponsor.logoText.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-text-primary tracking-tight">
                {sponsor.name}
              </span>
              <span
                className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold"
                style={{
                  backgroundColor: `${sponsor.color}25`,
                  color: sponsor.color
                }}
              >
                ESG CANVAS
              </span>
            </div>
            <p className="text-[9px] text-text-muted font-mono truncate max-w-[170px]">
              {theme.tagline}
            </p>
          </div>
        </div>

        {/* Metric Selector Toggle (Monthly Pace vs Cumulative Total) */}
        <div className="flex items-center p-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setViewMetric('period')}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono transition-all cursor-pointer active:scale-95 ${
              viewMetric === 'period'
                ? 'bg-white/20 text-white font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Pace
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('cumulative')}
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono transition-all cursor-pointer active:scale-95 ${
              viewMetric === 'cumulative'
                ? 'bg-white/20 text-white font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Total
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER 3: INTERACTIVE BRANDED SVG E-WASTE COLLECTION GRAPH */}
      {/* ========================================================= */}
      <div className="relative z-10 px-2 pt-2 pb-1">
        {/* Real-time Value Callout & Telemetry Tooltip */}
        <div className="px-3 py-1 flex items-baseline justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted block">
              {activePoint.data.period} Telemetry
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-2xl font-black font-mono tracking-tight"
                style={{ color: sponsor.color }}
              >
                {activePoint.data[viewMetric === 'period' ? 'kg' : 'cumulativeKg'].toLocaleString()}
              </span>
              <span className="text-xs font-bold font-mono text-emerald uppercase">
                KG DIVERTED
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-cyan-light block">
              {activePoint.data.devicesCount} devices recovered
            </span>
            <span className="text-[9px] font-mono text-text-muted block">
              CO₂ Offset: {activePoint.data.co2OffsetKg}kg
            </span>
          </div>
        </div>

        {/* SVG Interactive Chart Canvas */}
        <div className="relative w-full h-[120px] select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Vertical Gradient Area Reveal */}
              <linearGradient id={`area-grad-${sponsor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sponsor.color} stopOpacity="0.45" />
                <stop offset="50%" stopColor={theme.secondaryColor} stopOpacity="0.15" />
                <stop offset="100%" stopColor="#050608" stopOpacity="0.0" />
              </linearGradient>

              {/* Stroke Glow Filter */}
              <filter id={`glow-${sponsor.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={sponsor.color} floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Horizontal Baseline Guideline */}
            <line
              x1={padX}
              y1={svgHeight - padBottom}
              x2={svgWidth - padX}
              y2={svgHeight - padBottom}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Translucent Area Fill Revealing Sponsor Pattern */}
            <path d={areaPath} fill={`url(#area-grad-${sponsor.id})`} />

            {/* Dynamic Brand-Compliant Graph Line */}
            <path
              d={linePath}
              fill="none"
              stroke={sponsor.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${sponsor.id})`}
            />

            {/* Interactive Data Nodes */}
            {points.map((pt, i) => {
              const isHovered = hoveredIndex === i
              const isLatest = i === points.length - 1 && hoveredIndex === null

              return (
                <g key={i} className="cursor-pointer">
                  {/* Invisible broad hit-area for precise pointer tracking */}
                  <rect
                    x={pt.x - 16}
                    y={0}
                    width="32"
                    height={svgHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Vertical Guide Line on Hover */}
                  {(isHovered || isLatest) && (
                    <line
                      x1={pt.x}
                      y1={padTop}
                      x2={pt.x}
                      y2={svgHeight - padBottom}
                      stroke={sponsor.color}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      strokeOpacity="0.7"
                    />
                  )}

                  {/* Outer Pulsing Ring */}
                  {(isHovered || isLatest) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6.5"
                      fill="none"
                      stroke={sponsor.color}
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  )}

                  {/* Data Node Core */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '4' : '3'}
                    fill={isHovered || isLatest ? '#FFFFFF' : sponsor.color}
                    stroke="#050608"
                    strokeWidth="1.5"
                  />

                  {/* X-Axis Period Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill={isHovered || isLatest ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight={isHovered || isLatest ? 'bold' : 'normal'}
                  >
                    {pt.data.period.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER 4: SPONSOR ESG PLEDGE & PARTNER ROTATION FOOTER     */}
      {/* ========================================================= */}
      <div className="relative z-10 px-4 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald shrink-0" />
          <span className="truncate max-w-[210px]">{theme.esgPledge}</span>
        </div>

        {/* Sponsor Partner Switcher Dropdown / Pill */}
        <div className="flex items-center gap-1">
          {SPONSORS.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSponsorId(s.id)
                onSelectSponsor?.(s.id)
              }}
              title={`Switch canvas to ${s.name}`}
              className={`w-4 h-4 rounded-full border transition-all cursor-pointer active:scale-95 ${
                activeSponsorId === s.id
                  ? 'scale-125 border-white shadow-sm'
                  : 'opacity-40 hover:opacity-100 border-transparent'
              }`}
              style={{ backgroundColor: s.color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
