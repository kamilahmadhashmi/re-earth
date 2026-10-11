import React from 'react'
import { motion } from 'framer-motion'
import {
  Globe2,
  Building2,
  Layers,
  Trophy,
  Volume2,
  VolumeX
} from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { useSpatialAudio } from '../../hooks/useSpatialAudio'

export const TopNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    returnToWorld,
    openModal,
    scrollToChapter,
    activeChapter,
    toggleLeftDrawer,
    isLeftDrawerOpen
  } = useWorldStore()

  const { isAudioEnabled, toggleAudio } = useSpatialAudio()

  const navChapters = [
    { id: 0, label: 'Story' },
    { id: 1, label: 'The Crisis' },
    { id: 2, label: 'Beacons' },
    { id: 3, label: 'Live Hub' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-5 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* BRAND BUTTON */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              returnToWorld()
              scrollToChapter(0)
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-surface/95 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-5 h-5 rounded bg-emerald/15 flex items-center justify-center text-emerald">
              <Layers className="w-3 h-3 text-copper" />
            </div>
            <span className="font-bold tracking-tight text-xs text-text-primary">
              RE<span className="text-copper font-extrabold mx-0.5">—</span>EARTH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald ml-1" />
          </button>
        </div>

        {/* RESTRAINED EDITORIAL NAV SEGMENTS */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-md bg-surface/95 border border-white/10 pointer-events-auto relative">
          {navChapters.map((ch) => {
            const isActive = activeChapter === ch.id
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                className={`relative px-3 py-1 rounded text-xs font-medium transition-colors z-10 ${
                  isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeChapterPill"
                    className="absolute inset-0 rounded bg-white/10 border border-white/15 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{ch.label}</span>
              </button>
            )
          })}

          <div className="w-[1px] h-3.5 bg-white/10 mx-1" />

          <button
            onClick={() => openModal('recycle')}
            className="px-2.5 py-1 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Recycle
          </button>
          <button
            onClick={() => openModal('vault')}
            className="px-2.5 py-1 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            Vault
          </button>
        </nav>

        {/* ACTIONS & VIEW SWITCHER */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Spatial Synthetic Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              isAudioEnabled
                ? 'bg-surface-elevated text-emerald border border-emerald/50'
                : 'bg-surface/95 border border-white/10 text-text-muted hover:text-text-primary'
            }`}
            title="Toggle Spatial Synthetic Audio Drone & Clicks"
          >
            {isAudioEnabled ? (
              <span className="flex items-end gap-0.5 h-3 w-3">
                <span className="w-0.5 bg-emerald h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald h-2/3 animate-[pulse_1.2s_ease-in-out_infinite]" />
                <span className="w-0.5 bg-emerald h-4/5 animate-[pulse_0.5s_ease-in-out_infinite]" />
              </span>
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline text-xs font-medium">
              {isAudioEnabled ? 'Audio On' : 'Muted'}
            </span>
          </button>

          {/* Rankings Drawer Toggle */}
          {viewMode === 'globe' && (
            <button
              onClick={toggleLeftDrawer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                isLeftDrawerOpen
                  ? 'bg-surface-elevated text-copper border border-copper/50'
                  : 'bg-surface/95 border border-white/10 text-text-secondary hover:text-text-primary'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-copper" />
              <span className="hidden sm:inline">Rankings</span>
            </button>
          )}

          {/* Mode Switcher with Segmented Tab Selection */}
          <div className="flex items-center p-0.5 rounded-md bg-surface/95 border border-white/10 relative">
            <button
              onClick={() => setViewMode('globe')}
              className={`relative flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold tracking-wide transition-colors z-10 ${
                viewMode === 'globe' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {viewMode === 'globe' && (
                <motion.div
                  layoutId="activeViewPill"
                  className="absolute inset-0 rounded bg-white/10 border border-white/15 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Globe2 className={`w-3.5 h-3.5 ${viewMode === 'globe' ? 'text-copper' : 'text-text-muted'}`} />
              <span className="hidden sm:inline">World</span>
            </button>
            <button
              onClick={() => setViewMode('skyline')}
              className={`relative flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold tracking-wide transition-colors z-10 ${
                viewMode === 'skyline' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {viewMode === 'skyline' && (
                <motion.div
                  layoutId="activeViewPill"
                  className="absolute inset-0 rounded bg-white/10 border border-white/15 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Building2 className={`w-3.5 h-3.5 ${viewMode === 'skyline' ? 'text-gold' : 'text-text-muted'}`} />
              <span className="hidden sm:inline">Sponsors</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  )
}

export default TopNav
