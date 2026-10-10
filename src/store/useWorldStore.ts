import { create } from 'zustand'
import { mockApi } from '../services/mockApi'
import type { RankedCampus, RankedSponsor } from '../shared/ranking'
import { REGIONS, type Region } from '../data/regions'
import type { CampusCluster } from '../utils/clusterMath'

export type ViewMode = 'globe' | 'skyline'

interface WorldState {
  viewMode: ViewMode
  campuses: RankedCampus[]
  sponsors: RankedSponsor[]
  selectedCampusId: string | null
  selectedRegionId: string | null
  selectedSponsorId: string | null
  isIntro: boolean
  isLeftDrawerOpen: boolean
  activeModal: string | null
  quality: 'high' | 'low'
  isBoosting: boolean
  boostEffectTrigger: number

  // Dynamic Camera Zoom & Cluster System
  cameraRadius: number // 4.5 (close) to 15.0 (far), default ~9.0
  activeCluster: CampusCluster | null
  isClusterExploded: boolean

  // Scroll Storytelling State
  scrollProgress: number // 0.0 to 1.0
  activeChapter: number // 0 to 4
  isFreeOrbit: boolean
  lenisScrollTo: ((target: string | number) => void) | null

  // Direct 3D Orbit Immersive Mode
  isEarthImmersive: boolean
  immersiveResetTrigger: number
  orbitalPreset: { phi: number; theta: number; radius: number; label: string; id: number } | null

  // Actions
  loadData: () => Promise<void>
  setViewMode: (mode: ViewMode) => void
  selectCampus: (id: string | null) => void
  selectRegion: (regionId: string) => void
  selectSponsor: (id: string | null) => void
  boostSelectedCampus: (kg?: number) => Promise<void>
  enterWorld: () => void
  returnToWorld: () => void
  toggleLeftDrawer: () => void
  openModal: (modal: string | null) => void
  setQuality: (q: 'high' | 'low') => void
  resetDemo: () => Promise<void>

  // Direct 3D Orbit Actions
  enterImmersiveOrbit: () => void
  exitImmersiveOrbit: () => void
  resetImmersiveCamera: () => void
  setOrbitalPreset: (preset: { phi: number; theta: number; radius?: number; label: string }) => void

  // Cluster Actions
  setCameraRadius: (r: number) => void
  setActiveCluster: (cluster: CampusCluster | null) => void
  setClusterExploded: (exploded: boolean) => void

  // Scroll Actions
  setScrollProgress: (progress: number) => void
  setActiveChapter: (chapter: number) => void
  setFreeOrbit: (free: boolean) => void
  scrollToChapter: (chapter: number) => void
  registerLenisScrollTo: (fn: ((target: string | number) => void) | null) => void

  // Gated Demo / Simulation Mode
  isDemoMode: boolean
  toggleDemoMode: () => void
  setDemoMode: (enabled: boolean) => void
}

export const useWorldStore = create<WorldState>((set, get) => ({
  viewMode: 'globe',
  campuses: [],
  sponsors: [],
  selectedCampusId: null,
  selectedRegionId: null,
  selectedSponsorId: null,
  isIntro: true,
  isLeftDrawerOpen: false,
  activeModal: null,
  quality: 'high',
  isBoosting: false,
  boostEffectTrigger: 0,

  // Camera & Cluster defaults
  cameraRadius: 9.2,
  activeCluster: null,
  isClusterExploded: false,

  // Scroll Storytelling Defaults
  scrollProgress: 0,
  activeChapter: 0,
  isFreeOrbit: false,
  lenisScrollTo: null,

  // Direct 3D Orbit Immersive Defaults
  isEarthImmersive: false,
  immersiveResetTrigger: 0,
  orbitalPreset: null,

  // Gated Demo / Simulation Mode (Default: false for pure production view)
  isDemoMode:
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('demo') ||
      localStorage.getItem('re_earth_demo_mode') === 'true'),

  loadData: async () => {
    const campuses = await mockApi.getLeaderboard()
    const sponsors = await mockApi.getSponsors()
    set({ campuses, sponsors })
  },

  setViewMode: (mode) => {
    set({
      viewMode: mode,
      selectedCampusId: null,
      selectedRegionId: null,
      selectedSponsorId: null,
      activeCluster: null,
      isClusterExploded: false
    })
  },

  selectCampus: (id) => {
    set({
      selectedCampusId: id,
      selectedRegionId: null,
      selectedSponsorId: null,
      activeCluster: null
    })
  },

  selectRegion: (regionId) => {
    const region = REGIONS.find((r) => r.id === regionId)
    if (!region) return
    set({
      selectedRegionId: regionId,
      selectedCampusId: null,
      selectedSponsorId: null,
      activeCluster: null,
      isClusterExploded: false
    })
  },

  selectSponsor: (id) => {
    set({
      selectedSponsorId: id,
      selectedCampusId: null,
      selectedRegionId: null,
      activeCluster: null
    })
  },

  boostSelectedCampus: async (kg = 250) => {
    const { selectedCampusId, isBoosting } = get()
    if (!selectedCampusId || isBoosting) return

    set({ isBoosting: true })
    try {
      const res = await mockApi.boostCampus(selectedCampusId, kg)
      const sponsors = await mockApi.getSponsors()
      set((state) => ({
        campuses: res.campuses,
        sponsors,
        boostEffectTrigger: state.boostEffectTrigger + 1,
        isBoosting: false
      }))
    } catch (err) {
      console.error('Boost failed', err)
      set({ isBoosting: false })
    }
  },

  enterWorld: () => {
    set({ isIntro: false })
  },

  returnToWorld: () => {
    set({
      selectedCampusId: null,
      selectedRegionId: null,
      selectedSponsorId: null,
      activeCluster: null,
      isClusterExploded: false
    })
  },

  toggleLeftDrawer: () => {
    set((state) => ({ isLeftDrawerOpen: !state.isLeftDrawerOpen }))
  },

  openModal: (modal) => {
    set({ activeModal: modal })
  },

  setQuality: (quality) => {
    set({ quality })
  },

  resetDemo: async () => {
    await mockApi.resetDemo()
    const campuses = await mockApi.getLeaderboard()
    const sponsors = await mockApi.getSponsors()
    set({
      campuses,
      sponsors,
      selectedCampusId: null,
      selectedRegionId: null,
      selectedSponsorId: null,
      activeCluster: null,
      isClusterExploded: false
    })
  },

  setCameraRadius: (cameraRadius) => {
    set({ cameraRadius })
  },

  setActiveCluster: (activeCluster) => {
    set({ activeCluster })
  },

  setClusterExploded: (isClusterExploded) => {
    set({ isClusterExploded })
  },

  setScrollProgress: (scrollProgress) => {
    set({ scrollProgress })
  },

  setActiveChapter: (activeChapter) => {
    set({
      activeChapter,
      // When user reaches interactive chapter 3, make sure intro is disabled
      isIntro: activeChapter > 0 ? false : get().isIntro
    })
  },

  setFreeOrbit: (isFreeOrbit) => {
    set({ isFreeOrbit })
  },

  registerLenisScrollTo: (lenisScrollTo) => {
    set({ lenisScrollTo })
  },

  scrollToChapter: (chapter) => {
    const { lenisScrollTo } = get()
    if (lenisScrollTo) {
      const chapterIds = ['chapter-genesis', 'chapter-crisis', 'chapter-beacons', 'chapter-derby', 'chapter-action']
      const targetId = chapterIds[Math.max(0, Math.min(chapterIds.length - 1, chapter))]
      lenisScrollTo(`#${targetId}`)
    }
  },

  enterImmersiveOrbit: () => {
    set({
      isEarthImmersive: true,
      viewMode: 'globe',
      isIntro: false,
      isLeftDrawerOpen: false,
      activeModal: null,
      selectedCampusId: null,
      selectedRegionId: null,
      activeCluster: null,
      isClusterExploded: false
    })
  },

  exitImmersiveOrbit: () => {
    set({
      isEarthImmersive: false,
      selectedCampusId: null
    })
  },

  resetImmersiveCamera: () => {
    set((state) => ({
      immersiveResetTrigger: state.immersiveResetTrigger + 1,
      selectedCampusId: null
    }))
  },

  setOrbitalPreset: (preset) => {
    set((state) => ({
      orbitalPreset: {
        phi: preset.phi,
        theta: preset.theta,
        radius: preset.radius ?? 8.5,
        label: preset.label,
        id: (state.orbitalPreset?.id ?? 0) + 1
      },
      selectedCampusId: null
    }))
  },

  toggleDemoMode: () => {
    set((state) => {
      const next = !state.isDemoMode
      if (typeof window !== 'undefined') {
        localStorage.setItem('re_earth_demo_mode', String(next))
      }
      return { isDemoMode: next }
    })
  },

  setDemoMode: (enabled) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('re_earth_demo_mode', String(enabled))
    }
    set({ isDemoMode: enabled })
  }
}))

if (typeof window !== 'undefined') {
  ;(window as any).__WORLD_STORE__ = useWorldStore
}
