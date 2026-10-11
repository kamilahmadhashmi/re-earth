import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useWorldStore } from '../store/useWorldStore'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)
  const { setScrollProgress, setActiveChapter, registerLenisScrollTo, isEarthImmersive, activeModal } = useWorldStore()

  // Pause Lenis when in Direct 3D Orbit mode OR when any modal is open to ensure native modal scrolling
  useEffect(() => {
    if (!lenisRef.current) return
    if (isEarthImmersive || !!activeModal) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [isEarthImmersive, activeModal])

  useEffect(() => {
    // Initialize Lenis with cinematic physics
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      autoResize: true
    })

    lenisRef.current = lenis

    // Register scrollTo function in the store
    registerLenisScrollTo((target: string | number) => {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    })

    let rafId: number

    function onRaf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(onRaf)
    }

    rafId = requestAnimationFrame(onRaf)

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? Math.max(0, Math.min(1, scrollY / totalHeight)) : 0

      setScrollProgress(progress)

      // Chapter ranges:
      // 0: Genesis (0.00 - 0.18)
      // 1: The Silicon Crisis (0.18 - 0.42)
      // 2: Planetary Architecture / Towers (0.42 - 0.68)
      // 3: Competitive Derby & Live Hub (0.68 - 0.90)
      // 4: The Circular OS (0.90 - 1.00)
      let chapter = 0
      if (progress >= 0.90) {
        chapter = 4
      } else if (progress >= 0.68) {
        chapter = 3
      } else if (progress >= 0.42) {
        chapter = 2
      } else if (progress >= 0.18) {
        chapter = 1
      } else {
        chapter = 0
      }

      setActiveChapter(chapter)

      // When user scrolls back to Genesis (Chapter 0) or to closing Circular OS (Chapter 4), clear campus inspection card
      if (chapter === 0 || chapter === 4) {
        const { selectedCampusId, returnToWorld } = useWorldStore.getState()
        if (selectedCampusId) {
          returnToWorld()
        }
      }
    }

    lenis.on('scroll', handleScroll)
    // Run initial tick
    handleScroll()

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      registerLenisScrollTo(null)
    }
  }, [setScrollProgress, setActiveChapter, registerLenisScrollTo])

  return lenisRef
}
