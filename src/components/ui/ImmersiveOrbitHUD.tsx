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
      {/* 1. Top Unobtrusive Control Pill with Orbital Presets */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 rounded-full liquid-glass-pill specular-rim shadow-2xl backdrop-blur-md">
          {/* Active Orbit Indicator */}
          <div className="flex items-center gap-2 pr-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
            </span>
            <span className="text-[11px] font-mono tracking-wider text-text-primary uppercase font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan" />
              <span className="hidden sm:inline">Direct 3D Orbit</span>
            </span>
          </div>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Continental / Regional Orbital Viewpoint Presets */}
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-full border border-white/10">
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
                  className={`px-2 sm:px-2.5 py-1 text-[10px] font-mono rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald text-black font-bold shadow-[0_0_10px_rgba(48,209,88,0.5)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">{preset.label}</span>
                  <span className="sm:hidden">{preset.shortLabel}</span>
                  <kbd className={`hidden lg:inline text-[8px] px-1 py-0.2 rounded border ${
                    isActive ? 'bg-black/30 border-black/40 text-black font-semibold' : 'bg-black/40 border-white/20 text-text-muted'
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
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10 text-xs transition-all duration-200"
            title="Reset camera zoom and center (R)"
          >
            <RotateCcw className="w-3 h-3 text-cyan" />
            <span className="hidden sm:inline text-[11px] font-medium">Reset</span>
          </button>

          <div className="w-px h-3.5 bg-white/15" />

          {/* Exit Orbit Button */}
          <button
            onClick={() => {
              playClick()
              exitImmersiveOrbit()
            }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-text-primary text-xs font-semibold transition-all duration-200 active:scale-95"
            title="Exit Immersive Orbit (Esc)"
          >
            <span>Exit Orbit</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono bg-black/40 rounded border border-white/20 text-text-secondary">
              Esc
            </kbd>
            <X className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </motion.div>

      {/* 2. Bottom Minimal Instruction Pill (Visible when no campus is inspected) */}
      {!selectedCampusId && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full liquid-glass-pill specular-rim text-[11px] text-text-secondary font-mono tracking-wide">
            <Compass className="w-3.5 h-3.5 text-cyan" />
            <span>Drag to rotate · Scroll to zoom · Jump 1-4 · Click tower to inspect</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ImmersiveOrbitHUD
