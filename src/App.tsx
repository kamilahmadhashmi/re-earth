import React, { useEffect } from 'react'
import { SiliconSchematicBackground } from './components/ui/SiliconSchematicBackground'
import { WorldScene } from './components/world/WorldScene'
import { TopNav } from './components/ui/TopNav'
import { TopTenDrawer } from './components/ui/TopTenDrawer'
import { WeeklyDerbyTicker } from './components/ui/WeeklyDerbyTicker'
import { CampusInspectionCard } from './components/ui/CampusInspectionCard'
import { Modals } from './components/ui/Modals'
import { ClusterSelectionPopover } from './components/ui/ClusterSelectionPopover'
import { ScrollStorySections } from './components/ui/ScrollStorySections'
import { ScrollProgressHUD } from './components/ui/ScrollProgressHUD'
import { ImmersiveOrbitHUD } from './components/ui/ImmersiveOrbitHUD'
import { useWorldStore } from './store/useWorldStore'
import { useLenis } from './hooks/useLenis'

export const App: React.FC = () => {
  const { loadData, isEarthImmersive, toggleDemoMode } = useWorldStore()

  // Initialize Lenis smooth scroll engine
  useLenis()

  useEffect(() => {
    loadData()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'd') {
        toggleDemoMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loadData, toggleDemoMode])

  return (
    <div className="relative min-h-screen bg-background select-none overflow-x-hidden">
      {/* 0. Sub-Silicon Schematic Void & Reclaimed Material Core (Pinned) */}
      <SiliconSchematicBackground />

      {/* 1. 3D WebGL World Canvas (Pinned) */}
      <WorldScene />

      {/* 2. Direct 3D Orbit Immersive Controls (Exclusive to Immersive Mode) */}
      {isEarthImmersive && <ImmersiveOrbitHUD />}

      {/* 3. Campus Inspection Detail Card (Active in BOTH Normal and 3D World / Immersive Orbit Mode) */}
      <CampusInspectionCard />

      {/* 4. Cluster Selection Popover for dense regional campus groups (Active in BOTH modes) */}
      <ClusterSelectionPopover />

      {/* 5. Modals (Recycle, Sponsor Pitch, Vault, Learn) (Active in BOTH modes) */}
      <Modals />

      {/* 6. Normal Narrative & Exploration Overlays (Completely hidden/unmounted in Immersive Orbit) */}
      {!isEarthImmersive && (
        <>
          {/* Scroll Story Narrative Chapters (5 Cinematic Stages) */}
          <ScrollStorySections />

          {/* Top Navigation Bar (Fixed Spatial Header) */}
          <TopNav />

          {/* Orbital Progress HUD (Fixed Chapter Navigator & Zoom Controls) */}
          <ScrollProgressHUD />

          {/* Left Collapsible Top 10 Leaderboard */}
          <TopTenDrawer />

          {/* Bottom Weekly Derby Ticker: DTU vs NSUT */}
          <WeeklyDerbyTicker />
        </>
      )}
    </div>
  )
}

export default App
