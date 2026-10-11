import React, { useEffect } from 'react'
import { SiliconSchematicBackground } from './components/ui/SiliconSchematicBackground'
import { WorldScene } from './components/world/WorldScene'
import { TopNav } from './components/ui/TopNav'
import { TopTenDrawer } from './components/ui/TopTenDrawer'
import { WeeklyDerbyTicker } from './components/ui/WeeklyDerbyTicker'
import { CampusInspectionCard } from './components/ui/CampusInspectionCard'
import { SponsorInspectionCard } from './components/ui/SponsorInspectionCard'
import { Modals } from './components/ui/Modals'
import { ClusterSelectionPopover } from './components/ui/ClusterSelectionPopover'
import { ScrollStorySections } from './components/ui/ScrollStorySections'
import { ScrollProgressHUD } from './components/ui/ScrollProgressHUD'
import { ImmersiveOrbitHUD } from './components/ui/ImmersiveOrbitHUD'
import { SponsorSkylineHUD } from './components/ui/SponsorSkylineHUD'
import { SpatialCyberneticCursor } from './components/ui/SpatialCyberneticCursor'
import { SponsorshipPage } from './components/sponsor/SponsorshipPage'
import { useWorldStore } from './store/useWorldStore'
import { useAuthStore } from './store/useAuthStore'
import { useLenis } from './hooks/useLenis'

export const App: React.FC = () => {
  const {
    loadData,
    isEarthImmersive,
    toggleDemoMode,
    viewMode,
    currentRoute,
    navigateToWorld,
    sponsorTierPrefill
  } = useWorldStore()
  const { checkSession } = useAuthStore()

  // Initialize Lenis smooth scroll engine
  useLenis()

  useEffect(() => {
    loadData()
    checkSession()

    // Global Browser History / Hash / Route Synchronization
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        const isSponsor =
          window.location.hash.includes('sponsor') ||
          window.location.pathname.includes('/sponsor')
        if (isSponsor) {
          useWorldStore.setState({ currentRoute: 'sponsor' })
        } else {
          useWorldStore.setState({ currentRoute: 'world' })
        }
      }
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'd') {
        toggleDemoMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [loadData, toggleDemoMode, checkSession])

  // Dedicated Sponsorship Portal View
  if (currentRoute === 'sponsor') {
    return (
      <div className="relative min-h-screen bg-background select-none overflow-x-hidden">
        <SponsorshipPage
          onReturnToOrbit={navigateToWorld}
          initialPrefillPathway={(sponsorTierPrefill as any) || 'corporate_sustainability'}
        />
        <SpatialCyberneticCursor />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background select-none overflow-x-hidden">
      {/* 0. Sub-Silicon Schematic Void & Reclaimed Material Core (Pinned) */}
      <SiliconSchematicBackground />

      {/* 1. 3D WebGL World Canvas (Pinned) */}
      <WorldScene />

      {/* 2. Direct 3D Orbit Immersive Controls (Exclusive to Immersive Mode) */}
      {isEarthImmersive && <ImmersiveOrbitHUD />}

      {/* 2b. Sponsor Skyline Direct Orbit HUD (Minimal Back Control, no text overlays on towers) */}
      {viewMode === 'skyline' && <SponsorSkylineHUD />}

      {/* 3. Campus Inspection Detail Card (Active in Globe Mode) */}
      {viewMode === 'globe' && <CampusInspectionCard />}

      {/* 3b. Sponsor Inspection Detail Card (Active when any sponsor is selected) */}
      <SponsorInspectionCard />

      {/* 4. Cluster Selection Popover for dense regional campus groups (Active in Globe Mode) */}
      {viewMode === 'globe' && <ClusterSelectionPopover />}

      {/* 5. Modals (Recycle, Sponsor Pitch, Vault, Learn) */}
      <Modals />

      {/* 6. Normal Narrative & Exploration Overlays (Completely unmounted in Immersive Orbit and Skyline modes) */}
      {!isEarthImmersive && viewMode === 'globe' && (
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

      {/* 7. Spatial Cybernetic Reticle Cursor (Desktop) */}
      <SpatialCyberneticCursor />
    </div>
  )
}

export default App
