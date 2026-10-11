import React from 'react'
import { motion } from 'framer-motion'
import {
  Globe2,
  Building2,
  Layers,
  Trophy,
  Volume2,
  VolumeX,
  Shield,
  GraduationCap,
  Scan
} from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { useAuthStore } from '../../store/useAuthStore'
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
    isLeftDrawerOpen,
    navigateToSponsor
  } = useWorldStore()

  const { isAuthenticated, currentUser, openLoginModal } = useAuthStore()
  const { isAudioEnabled, toggleAudio } = useSpatialAudio()

  const navChapters = [
    { id: 0, label: 'Story' },
    { id: 1, label: 'The Crisis' },
    { id: 2, label: 'Beacons' },
    { id: 3, label: 'Live Hub' },
  ]

  return (
    <header className="fixed top-3 left-0 right-0 z-[60] px-3 sm:px-6 pointer-events-none flex justify-center">
      <div className="w-full max-w-6xl flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-[#090A0E]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto overflow-x-auto sm:overflow-visible no-scrollbar">
        
        {/* BRAND BUTTON */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              returnToWorld()
              scrollToChapter(0)
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald/15 border border-emerald/30 flex items-center justify-center text-emerald shadow-sm">
              <Layers className="w-3.5 h-3.5 text-copper" />
            </div>
            <span className="font-bold tracking-tight text-xs text-text-primary">
              RE<span className="text-copper font-extrabold mx-0.5">—</span>EARTH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse ml-0.5" />
          </button>
        </div>

        {/* RESTRAINED EDITORIAL NAV SEGMENTS */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] relative shrink-0">
          {navChapters.map((ch) => {
            const isActive = activeChapter === ch.id
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-colors z-10 cursor-pointer ${
                  isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeChapterPill"
                    className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 -z-10 shadow-sm"
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
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald hover:text-emerald-light hover:bg-emerald/10 transition-all cursor-pointer"
          >
            Recycle
          </button>
          <button
            onClick={() => openModal('vault')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all cursor-pointer"
          >
            Vault
          </button>
          <button
            onClick={() => navigateToSponsor('corporate_sustainability')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-amber hover:text-amber-light hover:bg-amber/10 transition-all cursor-pointer font-semibold"
          >
            Sponsor
          </button>
        </nav>

        {/* ACTIONS & VIEW SWITCHER */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Authentication Badge / Sign In */}
          {isAuthenticated && currentUser ? (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
              <span className="font-bold text-text-primary max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  currentUser.role === 'college_admin'
                    ? 'bg-emerald/15 text-emerald border border-emerald/30'
                    : currentUser.role === 'kiosk_operator'
                    ? 'bg-amber/15 text-amber border border-amber/30'
                    : 'bg-cyan/15 text-cyan border border-cyan/30'
                }`}
              >
                {currentUser.role === 'college_admin' ? 'ADMIN' : currentUser.role === 'kiosk_operator' ? 'OPERATOR' : 'STUDENT'}
              </span>
            </div>
          ) : (
            <button
              onClick={() => openLoginModal()}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Spatial Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isAudioEnabled
                ? 'bg-emerald/10 text-emerald border border-emerald/30'
                : 'bg-white/[0.04] border border-white/10 text-text-muted hover:text-text-primary'
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
            <span className="hidden xl:inline text-xs font-medium">
              {isAudioEnabled ? 'Audio On' : 'Muted'}
            </span>
          </button>

          {/* Rankings Drawer Toggle */}
          {viewMode === 'globe' && (
            <button
              onClick={toggleLeftDrawer}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isLeftDrawerOpen
                  ? 'bg-copper/15 text-copper border border-copper/40'
                  : 'bg-white/[0.04] border border-white/10 text-text-secondary hover:text-text-primary'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-copper" />
              <span className="hidden sm:inline">Rankings</span>
            </button>
          )}

          {/* Mode Switcher with Segmented Tab Selection */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/[0.03] border border-white/10 relative">
            <button
              onClick={() => setViewMode('globe')}
              className={`relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-colors z-10 cursor-pointer ${
                viewMode === 'globe' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {viewMode === 'globe' && (
                <motion.div
                  layoutId="activeViewPill"
                  className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Globe2 className={`w-3.5 h-3.5 ${viewMode === 'globe' ? 'text-copper' : 'text-text-muted'}`} />
              <span className="hidden sm:inline">World</span>
            </button>
            <button
              onClick={() => setViewMode('skyline')}
              title="3D Sponsor Skyline Forest"
              className={`relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-colors z-10 cursor-pointer ${
                viewMode === 'skyline' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {viewMode === 'skyline' && (
                <motion.div
                  layoutId="activeViewPill"
                  className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 -z-10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Building2 className={`w-3.5 h-3.5 ${viewMode === 'skyline' ? 'text-gold' : 'text-text-muted'}`} />
              <span className="hidden sm:inline">Forest</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  )
}

export default TopNav
