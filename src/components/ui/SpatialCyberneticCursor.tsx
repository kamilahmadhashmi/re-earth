import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export const SpatialCyberneticCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorText, setCursorText] = useState<string | null>(null)
  const [cursorVariant, setCursorVariant] = useState<'default' | 'interactive' | 'orbit' | 'inspect'>('default')
  const [coordinates, setCoordinates] = useState({ lat: '28.61', lng: '77.20' })

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for trailing optical reticle ring
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 })

  useEffect(() => {
    // Only enable on precise pointing devices (mouse/trackpad, not mobile touchscreen)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      // Calculate approximate latitude and longitude based on screen coordinates
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      const lat = (normY * -75).toFixed(2)
      const lng = (normX * 180).toFixed(2)
      setCoordinates({ lat, lng })

      // Check for hover target attributes
      const target = e.target as HTMLElement
      if (!target) return

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      const isClickable = !!target.closest('button, a, [role="button"], input, select')
      const isCanvas = !!target.closest('canvas')

      if (cursorAttr) {
        setCursorText(cursorAttr.toUpperCase())
        setCursorVariant(cursorAttr === 'orbit' ? 'orbit' : 'inspect')
      } else if (isClickable) {
        setCursorText(null)
        setCursorVariant('interactive')
      } else if (isCanvas) {
        setCursorText(null)
        setCursorVariant('default')
      } else {
        setCursorText(null)
        setCursorVariant('default')
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible, mouseX, mouseY])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* 1. Trailing Optical Reticle Ring */}
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
            width: cursorVariant === 'interactive' ? 44 : cursorVariant === 'orbit' || cursorVariant === 'inspect' ? 56 : 24,
            height: cursorVariant === 'interactive' ? 44 : cursorVariant === 'orbit' || cursorVariant === 'inspect' ? 56 : 24,
            borderColor: cursorVariant === 'interactive' ? '#30D158' : cursorVariant === 'orbit' ? '#64D2FF' : 'rgba(255, 255, 255, 0.28)',
            backgroundColor: cursorVariant === 'interactive' ? 'rgba(48, 209, 88, 0.08)' : 'rgba(255, 255, 255, 0.02)'
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="rounded-full border border-dashed flex items-center justify-center"
        >
          {/* Micro Corner Crosshairs */}
          {(cursorVariant === 'orbit' || cursorVariant === 'inspect') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-cyan/20 absolute" />
              <div className="h-full w-px bg-cyan/20 absolute" />
            </div>
          )}
        </motion.div>

        {/* Hover Label Badge */}
        {cursorText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#131922] border border-white/20 text-[9px] font-mono font-medium text-emerald shadow-lg"
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>

      {/* 2. Sharp Center Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        className="absolute pointer-events-none w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_#30D158]"
      />

      {/* 3. Subtle Screen Bottom-Left Telemetry Coordinates Ticker */}
      <div className="fixed bottom-3 left-4 pointer-events-none hidden lg:flex items-center gap-3 text-[9px] font-mono text-text-muted/60 tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald animate-pulse" />
          OPTICAL RETICLE
        </span>
        <span>LAT: {coordinates.lat}°</span>
        <span>LNG: {coordinates.lng}°</span>
        <span>PROJ: WGS-84</span>
      </div>
    </div>
  )
}
