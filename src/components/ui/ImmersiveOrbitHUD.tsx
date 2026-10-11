import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, RotateCcw, Compass, Globe2 } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { useSpatialAudio } from '../../hooks/useSpatialAudio'

const DEG2RAD = Math.PI / 180

interface OrbitPresetItem {
  id: string
  label: string
  shortLabel: string
  keyHint: string
  phi: number
  theta: number
  radius: number
}

const ORBITAL_PRESETS: OrbitPresetItem[] = [
  {
    id: 'asia',
    label: 'DELHI',
    shortLabel: 'DELHI',
    keyHint: '1',
    phi: (90 - 28.6) * DEG2RAD,
    theta: (77.2 + 180) * DEG2RAD,
    radius: 7.8
  },
  {
    id: 'europe',
    label: 'EUROPE',
    shortLabel: 'EU',
    keyHint: '2',
    phi: (90 - 50) * DEG2RAD,
    theta: (5 + 180) * DEG2RAD,
    radius: 8.2
  },
  {
    id: 'americas',
    label: 'AMERICAS',
    shortLabel: 'US',
    keyHint: '3',
    phi: (90 - 38) * DEG2RAD,
    theta: (-98 + 180) * DEG2RAD,
    radius: 8.4
  },
  {
    id: 'polar',
    label: 'POLAR',
    shortLabel: 'POLAR',
    keyHint: '4',
    phi: 18 * DEG2RAD,
    theta: 0,
    radius: 9.0
  }
]

export const ImmersiveOrbitHUD: React.FC = () => {
  const {
    isEarthImmersive,
    exitImmersiveOrbit,
    resetImmersiveCamera,
    selectedCampusId,
    orbitalPreset,
    setOrbitalPreset
  } = useWorldStore()

  const { playClick, playHover } = useSpatialAudio()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitImmersiveOrbit()
      } else if (e.key.toLowerCase() === 'r') {
        resetImmersiveCamera()
      } else if (e.key === '1') {
        setOrbitalPreset(ORBITAL_PRESETS[0])
      } else if (e.key === '2') {
        setOrbitalPreset(ORBITAL_PRESETS[1])
      } else if (e.key === '3') {
        setOrbitalPreset(ORBITAL_PRESETS[2])
      } else if (e.key === '4') {
        setOrbitalPreset(ORBITAL_PRESETS[3])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [exitImmersiveOrbit, resetImmersiveCamera, setOrbitalPreset])

  if (!isEarthImmersive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none">
      {/* 1. Top Restrained Control Bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-md bg-surface/95 border border-white/10 shadow-xl">
          {/* Active Orbit Indicator */}
          <div className="flex items-center gap-2 pr-1">
            <span className="w-2 h-2 rounded-full bg-emerald" />
            <span className="text-xs tracking-wider text-text-primary uppercase font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-copper" />
              <span className="hidden sm:inline">Direct 3D Orbit</span>
            </span>
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Continental Viewpoint Presets */}
          <div className="flex items-center gap-1 bg-surface-elevated p-0.5 rounded border border-white/10">
            {ORBITAL_PRESETS.map((preset) => {
              const isActive = orbitalPreset?.label === preset.label
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    playClick()
                    setOrbitalPreset(preset)
                  }}
                  onMouseEnter={() => playHover()}
                  title={`Focus ${preset.label} viewpoint (${preset.keyHint})`}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                    isActive
                      ? 'bg-copper text-background font-bold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <span className="hidden sm:inline">{preset.label}</span>
                  <span className="sm:hidden">{preset.shortLabel}</span>
                  <kbd className={`hidden lg:inline text-[9px] px-1 rounded border ${
                    isActive ? 'bg-black/20 border-black/30 text-background' : 'bg-black/40 border-white/10 text-text-muted'
                  }`}>
                    {preset.keyHint}
                  </kbd>
                </button>
              )
            })}
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Reset Camera View */}
          <button
            onClick={() => {
              playClick()
              resetImmersiveCamera()
            }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-1 px-2 py-1 rounded text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs transition-colors"
            title="Reset camera zoom and center (R)"
          >
            <RotateCcw className="w-3 h-3 text-copper" />
            <span className="hidden sm:inline text-xs font-medium">Reset</span>
          </button>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Exit Orbit Button */}
          <button
            onClick={() => {
              playClick()
              exitImmersiveOrbit()
            }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-text-primary text-xs font-semibold transition-colors active:scale-98"
            title="Exit Immersive Orbit (Esc)"
          >
            <span>Exit Orbit</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-black/40 rounded border border-white/20 text-text-secondary">
              Esc
            </kbd>
            <X className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </motion.div>

      {/* 2. Bottom Instruction Pill */}
      {!selectedCampusId && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-md bg-surface/90 border border-white/10 text-xs text-text-secondary font-medium tracking-wide">
            <Compass className="w-3.5 h-3.5 text-copper" />
            <span>Drag to rotate · Scroll to zoom · Jump 1-4 · Click tower to inspect</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ImmersiveOrbitHUD
