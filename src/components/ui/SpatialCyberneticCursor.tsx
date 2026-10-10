import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { useWorldStore } from '../../store/useWorldStore'

type CursorVariant = 'default' | 'interactive' | 'orbit' | 'grabbing' | 'target' | 'text'

interface ClickWave {
  id: number
  x: number
  y: number
}

export const SpatialCyberneticCursor: React.FC = () => {
  const { viewMode, isEarthImmersive } = useWorldStore()
  const [isVisible, setIsVisible] = useState(false)
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default')
  const [cursorLabel, setCursorLabel] = useState<string | null>(null)
  const [isClicking, setIsClicking] = useState(false)
  const [clickWaves, setClickWaves] = useState<ClickWave[]>([])

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for trailing optical silicon reticle chassis
  const springX = useSpring(mouseX, { stiffness: 480, damping: 28, mass: 0.45 })
  const springY = useSpring(mouseY, { stiffness: 480, damping: 28, mass: 0.45 })

  // DOM ref for telemetry coordinates to avoid triggering React re-renders on mousemove
  const coordsRef = useRef<HTMLSpanElement>(null)
  const currentVariantRef = useRef<CursorVariant>('default')
  const currentLabelRef = useRef<string | null>(null)
  const waveIdRef = useRef(0)

  useEffect(() => {
    // Only activate on precise desktop pointing devices (mouse/trackpad, not mobile touchscreen)
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('has-custom-cursor')

    const updateVariantAndLabel = (newVariant: CursorVariant, newLabel: string | null) => {
      if (newVariant !== currentVariantRef.current) {
        currentVariantRef.current = newVariant
        setCursorVariant(newVariant)
      }
      if (newLabel !== currentLabelRef.current) {
        currentLabelRef.current = newLabel
        setCursorLabel(newLabel)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Direct DOM update for telemetry coordinates (zero React re-renders)
      if (coordsRef.current) {
        const normX = (e.clientX / window.innerWidth) * 2 - 1
        const normY = (e.clientY / window.innerHeight) * 2 - 1
        const lat = (normY * -75).toFixed(1)
        const lng = (normX * 180).toFixed(1)
        coordsRef.current.textContent = `LAT: ${lat}°  LNG: ${lng}°`
      }

      const target = e.target as HTMLElement | null
      if (!target) return

      // 1. Check if dragging / grabbing in 3D canvas
      if (document.body.style.cursor === 'grabbing') {
        updateVariantAndLabel('grabbing', 'ORBITING')
        return
      }

      // 2. Check for explicit data-cursor attributes
      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (cursorAttr) {
        const attrUpper = cursorAttr.toUpperCase()
        if (cursorAttr === 'orbit') {
          updateVariantAndLabel('orbit', attrUpper)
        } else {
          updateVariantAndLabel('target', attrUpper)
        }
        return
      }

      // 3. Check for 3D interactive objects (trees, towers, Earth pins)
      if (document.body.style.cursor === 'pointer' && target.closest('canvas')) {
        updateVariantAndLabel('target', viewMode === 'skyline' ? 'BIO-NODE' : 'TELEMETRY')
        return
      }

      // 4. Check for interactive HTML buttons, links, controls
      const interactiveEl = target.closest('button, a, [role="button"], select, .cursor-pointer')
      if (interactiveEl) {
        const buttonText = interactiveEl.getAttribute('aria-label') || interactiveEl.getAttribute('title')
        let label = 'SELECT'
        if (buttonText) {
          label = buttonText.length < 12 ? buttonText.toUpperCase() : 'SELECT'
        } else if (interactiveEl.tagName === 'BUTTON') {
          const text = interactiveEl.textContent?.trim().slice(0, 10).toUpperCase()
          if (text && text.length > 2 && text.length < 12) label = text
        }
        updateVariantAndLabel('interactive', label)
        return
      }

      // 5. Check for text inputs
      if (target.closest('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')) {
        updateVariantAndLabel('text', 'INPUT')
        return
      }

      // 6. Check for canvas hovering (free orbit)
      if (target.closest('canvas')) {
        updateVariantAndLabel('orbit', isEarthImmersive ? 'ORBIT' : null)
        return
      }

      // Default state
      updateVariantAndLabel('default', null)
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)
      const newId = ++waveIdRef.current
      setClickWaves((prev) => [...prev.slice(-3), { id: newId, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setClickWaves((prev) => prev.filter((w) => w.id !== newId))
      }, 400)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      document.documentElement.classList.remove('has-custom-cursor')
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
      document.documentElement.classList.add('has-custom-cursor')
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY, viewMode, isEarthImmersive])

  // Reticle chassis configuration based on active variant
  const reticleConfig = useMemo(() => {
    switch (cursorVariant) {
      case 'interactive':
        return {
          size: 40,
          rotate: 45,
          color: '#10B981',
          accentColor: '#C86432',
          cornerLen: 7,
          ringOpacity: 0.35,
          strokeWidth: 1.5
        }
      case 'target':
        return {
          size: 46,
          rotate: 0,
          color: '#38BDF8',
          accentColor: '#10B981',
          cornerLen: 9,
          ringOpacity: 0.45,
          strokeWidth: 1.5
        }
      case 'orbit':
        return {
          size: 48,
          rotate: 0,
          color: '#38BDF8',
          accentColor: '#10B981',
          cornerLen: 8,
          ringOpacity: 0.5,
          strokeWidth: 1.3
        }
      case 'grabbing':
        return {
          size: 36,
          rotate: 180,
          color: '#06B6D4',
          accentColor: '#38BDF8',
          cornerLen: 6,
          ringOpacity: 0.8,
          strokeWidth: 1.8
        }
      case 'text':
        return {
          size: 26,
          rotate: 0,
          color: '#F8FAFC',
          accentColor: '#10B981',
          cornerLen: 5,
          ringOpacity: 0.2,
          strokeWidth: 1.2
        }
      case 'default':
      default:
        return {
          size: 24,
          rotate: 0,
          color: '#38BDF8',
          accentColor: '#10B981',
          cornerLen: 5,
          ringOpacity: 0.25,
          strokeWidth: 1.2
        }
    }
  }, [cursorVariant])

  if (!isVisible) return null

  const S = reticleConfig.size
  const C = reticleConfig.cornerLen

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* =========================================================================
          1. KINETIC TRAILING SILICON RETICLE CHASSIS (Spring-Weighted at springX/Y)
          ========================================================================= */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        className="absolute pointer-events-none flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: reticleConfig.size,
            height: reticleConfig.size,
            rotate: reticleConfig.rotate,
            scale: isClicking ? 0.88 : 1.0
          }}
          transition={{ type: 'spring', stiffness: 520, damping: 28 }}
          className="relative flex items-center justify-center"
        >
          {/* Photolithography Reticle SVG with L-Brackets & Alignment Ticks */}
          <svg
            width={S}
            height={S}
            viewBox={`0 0 ${S} ${S}`}
            fill="none"
            className="overflow-visible"
          >
            {/* A. Concentric Calibration Guide Ring */}
            <circle
              cx={S / 2}
              cy={S / 2}
              r={S * 0.36}
              stroke={reticleConfig.color}
              strokeOpacity={reticleConfig.ringOpacity}
              strokeWidth="1"
              strokeDasharray={cursorVariant === 'orbit' || cursorVariant === 'grabbing' ? '3 3' : 'none'}
            />

            {/* B. Four Precision L-Fiducial Framing Corners */}
            {/* Top-Left */}
            <path
              d={`M 1 ${1 + C} L 1 1 L ${1 + C} 1`}
              stroke={reticleConfig.color}
              strokeWidth={reticleConfig.strokeWidth}
              strokeLinecap="square"
            />
            {/* Top-Right */}
            <path
              d={`M ${S - 1 - C} 1 L ${S - 1} 1 L ${S - 1} ${1 + C}`}
              stroke={reticleConfig.color}
              strokeWidth={reticleConfig.strokeWidth}
              strokeLinecap="square"
            />
            {/* Bottom-Left */}
            <path
              d={`M 1 ${S - 1 - C} L 1 ${S - 1} L ${1 + C} ${S - 1}`}
              stroke={reticleConfig.color}
              strokeWidth={reticleConfig.strokeWidth}
              strokeLinecap="square"
            />
            {/* Bottom-Right */}
            <path
              d={`M ${S - 1 - C} ${S - 1} L ${S - 1} ${S - 1} L ${S - 1} ${S - 1 - C}`}
              stroke={reticleConfig.color}
              strokeWidth={reticleConfig.strokeWidth}
              strokeLinecap="square"
            />

            {/* C. Cardinal Wafer Notch Ticks (North, East, South, West) */}
            <line
              x1={S / 2}
              y1="0"
              x2={S / 2}
              y2="2.5"
              stroke={reticleConfig.accentColor}
              strokeWidth="1.2"
            />
            <line
              x1={S / 2}
              y1={S - 2.5}
              x2={S / 2}
              y2={S}
              stroke={reticleConfig.accentColor}
              strokeWidth="1.2"
            />
            <line
              x1="0"
              y1={S / 2}
              x2="2.5"
              y2={S / 2}
              stroke={reticleConfig.accentColor}
              strokeWidth="1.2"
            />
            <line
              x1={S - 2.5}
              y1={S / 2}
              x2={S}
              y2={S / 2}
              stroke={reticleConfig.accentColor}
              strokeWidth="1.2"
            />

            {/* D. Orbital Curved Trajectory Arcs (Active in Orbit/Grabbing Mode) */}
            {(cursorVariant === 'orbit' || cursorVariant === 'grabbing') && (
              <>
                <path
                  d={`M ${S * 0.15} ${S * 0.5} A ${S * 0.35} ${S * 0.35} 0 0 1 ${S * 0.5} ${S * 0.15}`}
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${S * 0.85} ${S * 0.5} A ${S * 0.35} ${S * 0.35} 0 0 1 ${S * 0.5} ${S * 0.85}`}
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </motion.div>

        {/* E. Telemetry Status Pill Tag */}
        <AnimatePresence>
          {cursorLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-6 -top-4 whitespace-nowrap px-1.5 py-0.5 rounded border flex items-center gap-1 shadow-lg bg-[#0B121A]"
              style={{
                borderColor: `${reticleConfig.color}60`,
                boxShadow: `0 4px 14px -2px rgba(0, 0, 0, 0.8), 0 0 8px ${reticleConfig.color}25`
              }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ backgroundColor: reticleConfig.color }}
              />
              <span
                className="text-[8.5px] font-mono font-bold tracking-wider"
                style={{ color: reticleConfig.color }}
              >
                {cursorLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* =========================================================================
          2. ZERO-LATENCY LASER FOCAL APERTURE & CLICK PULSES (Exactly at mouseX/Y)
          ========================================================================= */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        className="absolute pointer-events-none flex items-center justify-center w-6 h-6"
      >
        {/* Click Shockwave Expansion Pulse Rings */}
        {clickWaves.map((wave) => (
          <motion.div
            key={wave.id}
            initial={{ scale: 0.3, opacity: 0.95 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className="absolute w-5 h-5 rounded-full border border-emerald pointer-events-none"
            style={{
              borderColor: reticleConfig.color,
              boxShadow: `0 0 8px ${reticleConfig.color}`
            }}
          />
        ))}

        {/* Precision Micro Crosshair Needles */}
        {cursorVariant !== 'text' ? (
          <>
            {/* Horizontal Cross Needle */}
            <div
              className="absolute h-[1px] rounded-full transition-all duration-150"
              style={{
                width: cursorVariant === 'interactive' || cursorVariant === 'target' ? '12px' : '9px',
                backgroundColor: reticleConfig.color,
                opacity: 0.85
              }}
            />
            {/* Vertical Cross Needle */}
            <div
              className="absolute w-[1px] rounded-full transition-all duration-150"
              style={{
                height: cursorVariant === 'interactive' || cursorVariant === 'target' ? '12px' : '9px',
                backgroundColor: reticleConfig.color,
                opacity: 0.85
              }}
            />
            {/* High-Precision Center Laser Dot */}
            <div
              className="relative w-1.5 h-1.5 rounded-full transition-transform duration-100"
              style={{
                backgroundColor: cursorVariant === 'interactive' ? '#FFFFFF' : reticleConfig.color,
                transform: isClicking ? 'scale(0.7)' : 'scale(1.0)',
                boxShadow: `0 0 6px ${reticleConfig.color}, 0 0 12px ${reticleConfig.color}60`
              }}
            />
          </>
        ) : (
          /* Text Input Beam Caliper */
          <div className="relative flex flex-col items-center">
            <div className="w-2 h-[1px] bg-white opacity-80" />
            <div className="w-[1px] h-4 bg-emerald shadow-[0_0_6px_#10B981]" />
            <div className="w-2 h-[1px] bg-white opacity-80" />
          </div>
        )}
      </motion.div>

      {/* =========================================================================
          3. SUBTLE SCREEN BOTTOM-LEFT TELEMETRY DISPLAY (Globe & World Exploration)
          ========================================================================= */}
      {viewMode === 'globe' && !isEarthImmersive && (
        <div className="fixed bottom-3 left-4 pointer-events-none hidden lg:flex items-center gap-3 text-[9px] font-mono text-text-muted/60 tracking-wider">
          <span className="flex items-center gap-1.5 text-emerald">
            <span className="w-1 h-1 rounded-full bg-emerald animate-pulse" />
            WAFER RETICLE
          </span>
          <span ref={coordsRef} className="tabular-nums">
            LAT: 28.6°  LNG: 77.2°
          </span>
          <span>PROJ: WGS-84</span>
        </div>
      )}
    </div>
  )
}

export default SpatialCyberneticCursor
