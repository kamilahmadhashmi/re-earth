import React, { useEffect, useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useWorldStore } from '../../store/useWorldStore'
import { REGIONS } from '../../data/regions'
import { geoToVector3 } from '../../utils/geo'

interface CameraParams {
  radius: number
  phi: number // polar angle (0 is +Y, PI is -Y)
  theta: number // azimuthal angle
  targetX: number
  targetY: number
  targetZ: number
}

interface ChapterWaypoint {
  progress: number
  radius: number
  phi: number
  theta: number
  targetX: number
  targetY: number
  targetZ: number
}

const DEG2RAD = Math.PI / 180

// 5 Cinematic Waypoints linked to narrative chapters
const WAYPOINTS: ChapterWaypoint[] = [
  // Chapter 0: Genesis / Macro Earth (orbital overview)
  {
    progress: 0.0,
    radius: 10.2,
    phi: 68 * DEG2RAD,
    theta: 45 * DEG2RAD,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  },
  // Chapter 1: The Silicon Crisis (dramatic tilted oblique view framing the dark limb and atmosphere)
  {
    progress: 0.28,
    radius: 8.4,
    phi: 52 * DEG2RAD,
    theta: 108 * DEG2RAD,
    targetX: 0,
    targetY: 0.45,
    targetZ: 0
  },
  // Chapter 2: Planetary Architecture (swoop down to high-density India / Asia / Europe towers corridor)
  {
    progress: 0.54,
    radius: 6.2,
    phi: 66 * DEG2RAD,
    theta: 235 * DEG2RAD,
    targetX: 0.35,
    targetY: 0.22,
    targetZ: 0
  },
  // Chapter 3: Competitive Derby & Interactive Hub (optimal stage for interactive inspection)
  {
    progress: 0.78,
    radius: 7.8,
    phi: 64 * DEG2RAD,
    theta: 195 * DEG2RAD,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  },
  // Chapter 4: The Circular OS (sweeping wide horizon looking forward)
  {
    progress: 1.0,
    radius: 9.8,
    phi: 78 * DEG2RAD,
    theta: 315 * DEG2RAD,
    targetX: 0,
    targetY: -0.35,
    targetZ: 0
  }
]

// Smooth Hermite interpolation between waypoints
function interpolateWaypoints(progress: number): CameraParams {
  const p = Math.max(0, Math.min(1, progress))

  // Find surrounding waypoints
  let i = 0
  while (i < WAYPOINTS.length - 2 && WAYPOINTS[i + 1].progress < p) {
    i++
  }

  const w0 = WAYPOINTS[i]
  const w1 = WAYPOINTS[i + 1]

  const segmentRange = Math.max(0.0001, w1.progress - w0.progress)
  const t = Math.max(0, Math.min(1, (p - w0.progress) / segmentRange))
  // Smoothstep easing
  const s = t * t * (3 - 2 * t)

  // Shortest angular path around theta
  let diffTheta = (w1.theta - w0.theta) % (2 * Math.PI)
  if (diffTheta > Math.PI) diffTheta -= 2 * Math.PI
  if (diffTheta < -Math.PI) diffTheta += 2 * Math.PI

  return {
    radius: THREE.MathUtils.lerp(w0.radius, w1.radius, s),
    phi: THREE.MathUtils.lerp(w0.phi, w1.phi, s),
    theta: w0.theta + diffTheta * s,
    targetX: THREE.MathUtils.lerp(w0.targetX, w1.targetX, s),
    targetY: THREE.MathUtils.lerp(w0.targetY, w1.targetY, s),
    targetZ: THREE.MathUtils.lerp(w0.targetZ, w1.targetZ, s)
  }
}

export const CameraController: React.FC = () => {
  const { camera } = useThree()
  const {
    viewMode,
    selectedCampusId,
    selectedRegionId,
    campuses,
    returnToWorld,
    setCameraRadius,
    scrollProgress,
    activeChapter,
    isEarthImmersive,
    exitImmersiveOrbit,
    resetImmersiveCamera,
    immersiveResetTrigger,
    orbitalPreset,
    setViewMode
  } = useWorldStore()

  // Current camera spherical coordinates and target lookAt point
  const current = useRef<CameraParams>({
    radius: 10.2,
    phi: 68 * DEG2RAD,
    theta: 45 * DEG2RAD,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  })

  // Target radius for smooth zoom overrides
  const targetRadius = useRef(10.2)

  // User manual drag offset accumulated from dragging in narrative mode
  const dragOffset = useRef({ theta: 0, phi: 0 })
  // Rotational velocity for natural physical damping / inertia
  const velocity = useRef({ theta: 0, phi: 0 })

  // Interaction tracking
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const isTargetingCampus = useRef(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  // Spherical limits based on active view mode
  const getLimits = useCallback(() => {
    if (viewMode === 'skyline') {
      return {
        minPhi: 0.15,
        maxPhi: Math.PI / 2 - 0.05,
        minRadius: 6.0,
        maxRadius: 24.0
      }
    }
    if (isEarthImmersive) {
      return {
        minPhi: 0.08,
        maxPhi: Math.PI - 0.08,
        minRadius: 4.8,
        maxRadius: 14.5
      }
    }
    return {
      minPhi: 0.1,
      maxPhi: Math.PI - 0.1,
      minRadius: 4.5,
      maxRadius: 15.0
    }
  }, [viewMode, isEarthImmersive])

  // Cancel any active tween
  const cancelTween = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill()
      tweenRef.current = null
    }
    isTargetingCampus.current = false
  }, [])

  // 1. Direct Mouse & Pointer Drag Listeners
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Don't intercept clicks on UI buttons, inputs, links, or drawer controls
      const target = e.target as HTMLElement
      if (
        target &&
        target.closest(
          'button, input, select, textarea, a, [role="button"], aside, .spatial-glass, [data-prevent-drag]'
        )
      ) {
        return
      }
      if (e.button !== 0) return // Left click only

      cancelTween()
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      velocity.current = { theta: 0, phi: 0 }
      document.body.style.cursor = 'grabbing'
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return

      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }

      const rotSpeed = 0.0055
      velocity.current.theta = -dx * rotSpeed
      velocity.current.phi = -dy * rotSpeed

      if (isEarthImmersive) {
        // Direct, unrestricted full-sphere rotation
        current.current.theta += velocity.current.theta
        current.current.phi = THREE.MathUtils.clamp(
          current.current.phi + velocity.current.phi,
          0.08,
          Math.PI - 0.08
        )
      } else if (viewMode === 'skyline') {
        // Free orbit around the towers above ground
        current.current.theta += velocity.current.theta
        current.current.phi = THREE.MathUtils.clamp(
          current.current.phi + velocity.current.phi,
          0.15,
          Math.PI / 2 - 0.05
        )
      } else {
        dragOffset.current.theta += velocity.current.theta
        dragOffset.current.phi = THREE.MathUtils.clamp(
          dragOffset.current.phi + velocity.current.phi,
          -Math.PI / 3,
          Math.PI / 3
        )
      }
    }

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.cursor = 'default'
      }
    }

    // Wheel zoom handling in immersive and skyline modes without interfering with page
    const handleWheel = (e: WheelEvent) => {
      if (!isEarthImmersive && viewMode !== 'skyline') return
      e.preventDefault()
      const zoomDelta = e.deltaY * 0.006
      targetRadius.current = THREE.MathUtils.clamp(
        targetRadius.current + zoomDelta,
        viewMode === 'skyline' ? 6.0 : 4.8,
        viewMode === 'skyline' ? 24.0 : 14.5
      )
    }

    // Keyboard zoom controls (+ / -), reset (R), and exit (Esc)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCampusId) {
          returnToWorld()
        } else if (isEarthImmersive) {
          exitImmersiveOrbit()
        } else if (viewMode === 'skyline') {
          setViewMode('globe')
        } else {
          returnToWorld()
        }
      } else if (e.key.toLowerCase() === 'r' && isEarthImmersive) {
        resetImmersiveCamera()
      } else if (e.key === '=' || e.key === '+') {
        targetRadius.current = Math.max(4.8, targetRadius.current - 0.8)
      } else if (e.key === '-' || e.key === '_') {
        targetRadius.current = Math.min(14.5, targetRadius.current + 0.8)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.cursor = 'default'
    }
  }, [cancelTween, returnToWorld, isEarthImmersive, exitImmersiveOrbit, resetImmersiveCamera, selectedCampusId])

  // 2. React to Immersive Mode Activation / Exit
  useEffect(() => {
    cancelTween()
    if (isEarthImmersive) {
      isTargetingCampus.current = true
      const targetR = window.innerWidth < 768 ? 10.5 : 8.8
      targetRadius.current = targetR

      tweenRef.current = gsap.to(current.current, {
        radius: targetR,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          isTargetingCampus.current = false
          tweenRef.current = null
        }
      })
    } else {
      // Exiting immersive mode: return smoothly to current scroll waypoint
      const base = interpolateWaypoints(scrollProgress)
      isTargetingCampus.current = true
      targetRadius.current = base.radius
      dragOffset.current = { theta: 0, phi: 0 }

      tweenRef.current = gsap.to(current.current, {
        radius: base.radius,
        phi: base.phi,
        theta: base.theta,
        targetX: base.targetX,
        targetY: base.targetY,
        targetZ: base.targetZ,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          isTargetingCampus.current = false
          tweenRef.current = null
        }
      })
    }
  }, [isEarthImmersive, cancelTween, scrollProgress])

  // 3. React to Reset Camera in Immersive Mode
  useEffect(() => {
    if (immersiveResetTrigger > 0 && isEarthImmersive) {
      cancelTween()
      isTargetingCampus.current = true
      const targetR = window.innerWidth < 768 ? 10.5 : 8.8
      targetRadius.current = targetR

      tweenRef.current = gsap.to(current.current, {
        radius: targetR,
        phi: 68 * DEG2RAD,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: () => {
          isTargetingCampus.current = false
          tweenRef.current = null
        }
      })
    }
  }, [immersiveResetTrigger, isEarthImmersive, cancelTween])

  // 3b. React to Orbital Preset Selection in Immersive Mode
  useEffect(() => {
    if (orbitalPreset && isEarthImmersive) {
      cancelTween()
      isTargetingCampus.current = true
      targetRadius.current = orbitalPreset.radius

      // Shortest angular path around theta
      let diffTheta = (orbitalPreset.theta - current.current.theta) % (2 * Math.PI)
      if (diffTheta > Math.PI) diffTheta -= 2 * Math.PI
      if (diffTheta < -Math.PI) diffTheta += 2 * Math.PI
      const targetTheta = current.current.theta + diffTheta

      tweenRef.current = gsap.to(current.current, {
        radius: orbitalPreset.radius,
        phi: orbitalPreset.phi,
        theta: targetTheta,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        onComplete: () => {
          isTargetingCampus.current = false
          tweenRef.current = null
        }
      })
    }
  }, [orbitalPreset, isEarthImmersive, cancelTween])

  // 4. React to Campus or Region Selection
  useEffect(() => {
    cancelTween()

    if (viewMode === 'skyline') {
      const target = {
        radius: 14.0,
        phi: 52 * DEG2RAD,
        theta: 35 * DEG2RAD,
        targetX: 0,
        targetY: 1.0,
        targetZ: 0
      }
      targetRadius.current = 14.0
      isTargetingCampus.current = true
      tweenRef.current = gsap.to(current.current, {
        ...target,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          isTargetingCampus.current = false
          tweenRef.current = null
        }
      })
      return
    } else if (selectedCampusId) {
      const campus = campuses.find((c) => c.id === selectedCampusId)
      if (campus) {
        const phi = (90 - campus.lat) * DEG2RAD
        const theta = (campus.lng + 180) * DEG2RAD
        const pos = geoToVector3(campus.lat, campus.lng, 3.0)

        // Shortest angular path around theta
        let diffTheta = (theta - current.current.theta) % (2 * Math.PI)
        if (diffTheta > Math.PI) diffTheta -= 2 * Math.PI
        if (diffTheta < -Math.PI) diffTheta += 2 * Math.PI
        const targetTheta = current.current.theta + diffTheta

        isTargetingCampus.current = true
        targetRadius.current = isEarthImmersive ? 7.2 : 6.8

        tweenRef.current = gsap.to(current.current, {
          radius: targetRadius.current,
          phi: Math.max(0.2, Math.min(Math.PI - 0.2, phi)),
          theta: targetTheta,
          targetX: pos.x * 0.3,
          targetY: pos.y * 0.3,
          targetZ: pos.z * 0.3,
          duration: 1.4,
          ease: 'power2.out',
          onComplete: () => {
            isTargetingCampus.current = false
            tweenRef.current = null
          }
        })
      }
    } else if (selectedRegionId && !isEarthImmersive) {
      const region = REGIONS.find((r) => r.id === selectedRegionId)
      if (region) {
        const phi = (90 - region.lat) * DEG2RAD
        const theta = (region.lng + 180) * DEG2RAD

        let diffTheta = (theta - current.current.theta) % (2 * Math.PI)
        if (diffTheta > Math.PI) diffTheta -= 2 * Math.PI
        if (diffTheta < -Math.PI) diffTheta += 2 * Math.PI
        const targetTheta = current.current.theta + diffTheta

        isTargetingCampus.current = true
        targetRadius.current = region.zoomRadius

        tweenRef.current = gsap.to(current.current, {
          radius: region.zoomRadius,
          phi,
          theta: targetTheta,
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          duration: 1.4,
          ease: 'power2.out',
          onComplete: () => {
            isTargetingCampus.current = false
            tweenRef.current = null
          }
        })
      }
    } else if (isEarthImmersive) {
      // Returned to world in immersive mode: smoothly restore camera target lookAt to planet center
      if (
        current.current.targetX !== 0 ||
        current.current.targetY !== 0 ||
        current.current.targetZ !== 0
      ) {
        isTargetingCampus.current = true
        tweenRef.current = gsap.to(current.current, {
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          duration: 1.0,
          ease: 'power2.out',
          onComplete: () => {
            isTargetingCampus.current = false
            tweenRef.current = null
          }
        })
      }
    } else if (!isEarthImmersive) {
      // Returned to world: gently reset drag offset
      dragOffset.current = { theta: 0, phi: 0 }
    }

    return () => {
      cancelTween()
    }
  }, [viewMode, selectedCampusId, selectedRegionId, campuses, cancelTween, isEarthImmersive])

  // 5. Frame Tick: Synchronize Camera Position
  useFrame((_, delta) => {
    const { minPhi, maxPhi, minRadius, maxRadius } = getLimits()

    if (isEarthImmersive) {
      // Free Orbit Inertial Decay
      if (Math.abs(velocity.current.theta) > 0.00005 || Math.abs(velocity.current.phi) > 0.00005) {
        current.current.theta += velocity.current.theta
        current.current.phi = THREE.MathUtils.clamp(
          current.current.phi + velocity.current.phi,
          minPhi,
          maxPhi
        )
        velocity.current.theta *= 0.92
        velocity.current.phi *= 0.92
      }

      if (!isTargetingCampus.current) {
        // Smooth zoom dampening toward targetRadius
        const lerpSpeed = Math.min(1, delta * 7.0)
        current.current.radius += (targetRadius.current - current.current.radius) * lerpSpeed
        current.current.targetX += (0 - current.current.targetX) * lerpSpeed
        current.current.targetY += (0 - current.current.targetY) * lerpSpeed
        current.current.targetZ += (0 - current.current.targetZ) * lerpSpeed

        setCameraRadius(current.current.radius)
      }
    } else if (viewMode === 'skyline') {
      // Free Orbit around the skyline towers
      if (Math.abs(velocity.current.theta) > 0.00005 || Math.abs(velocity.current.phi) > 0.00005) {
        current.current.theta += velocity.current.theta
        current.current.phi = THREE.MathUtils.clamp(
          current.current.phi + velocity.current.phi,
          minPhi,
          maxPhi
        )
        velocity.current.theta *= 0.92
        velocity.current.phi *= 0.92
      }

      if (!isTargetingCampus.current) {
        const lerpSpeed = Math.min(1, delta * 7.0)
        current.current.radius += (targetRadius.current - current.current.radius) * lerpSpeed
        current.current.targetX += (0 - current.current.targetX) * lerpSpeed
        current.current.targetY += (1.0 - current.current.targetY) * lerpSpeed
        current.current.targetZ += (0 - current.current.targetZ) * lerpSpeed

        setCameraRadius(current.current.radius)
      }
    } else {
      // Narrative Scroll Mode
      if (Math.abs(velocity.current.theta) > 0.00005 || Math.abs(velocity.current.phi) > 0.00005) {
        dragOffset.current.theta += velocity.current.theta
        dragOffset.current.phi = THREE.MathUtils.clamp(
          dragOffset.current.phi + velocity.current.phi,
          -Math.PI / 3,
          Math.PI / 3
        )
        velocity.current.theta *= 0.92
        velocity.current.phi *= 0.92
      }

      // If not actively tweening to a focused campus or skyline
      if (!isTargetingCampus.current && viewMode === 'globe') {
        const base = interpolateWaypoints(scrollProgress)

        let ambient = 0
        if (activeChapter === 0 && !isDragging.current) {
          ambient = delta * 0.02
          dragOffset.current.theta += ambient
        }

        const targetPhi = THREE.MathUtils.clamp(base.phi + dragOffset.current.phi, minPhi, maxPhi)
        const targetTheta = base.theta + dragOffset.current.theta
        const targetR = THREE.MathUtils.clamp(base.radius, minRadius, maxRadius)

        const lerpSpeed = Math.min(1, delta * 6.0)
        current.current.radius += (targetR - current.current.radius) * lerpSpeed
        current.current.phi += (targetPhi - current.current.phi) * lerpSpeed

        let diffTheta = (targetTheta - current.current.theta) % (2 * Math.PI)
        if (diffTheta > Math.PI) diffTheta -= 2 * Math.PI
        if (diffTheta < -Math.PI) diffTheta += 2 * Math.PI
        current.current.theta += diffTheta * lerpSpeed

        current.current.targetX += (base.targetX - current.current.targetX) * lerpSpeed
        current.current.targetY += (base.targetY - current.current.targetY) * lerpSpeed
        current.current.targetZ += (base.targetZ - current.current.targetZ) * lerpSpeed

        setCameraRadius(current.current.radius)
      }
    }

    const { radius, phi, theta, targetX, targetY, targetZ } = current.current

    // Spherical to Cartesian coordinates
    camera.position.x = -radius * Math.sin(phi) * Math.cos(theta)
    camera.position.y = radius * Math.cos(phi)
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta)

    camera.lookAt(targetX, targetY, targetZ)
  })

  return null
}
