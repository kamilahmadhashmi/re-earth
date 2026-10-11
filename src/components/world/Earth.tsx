import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLOBE_RADIUS } from '../../utils/geo'
import { useWorldStore } from '../../store/useWorldStore'
import atmosphereVert from '../../shaders/atmosphere.vert.glsl'
import atmosphereFrag from '../../shaders/atmosphere.frag.glsl'

interface EarthProps {
  autoRotate?: boolean
}

export const Earth: React.FC<EarthProps> = ({ autoRotate = false }) => {
  const earthGroupRef = useRef<THREE.Group>(null)

  // Load public domain textures from textures (compatible with local dev and GitHub Pages base)
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  const [dayMap, normalMap, specMap, nightMap] = useLoader(
    THREE.TextureLoader,
    [
      `${baseUrl}textures/earth_atmos_2048.jpg`,
      `${baseUrl}textures/earth_normal_2048.jpg`,
      `${baseUrl}textures/earth_specular_2048.jpg`,
      `${baseUrl}textures/earth_lights_2048.png`
    ]
  )

  // Configure texture parameters
  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace
    nightMap.colorSpace = THREE.SRGBColorSpace
    
    ;[dayMap, normalMap, specMap, nightMap].forEach((t) => {
      t.anisotropy = 4
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
    })
  }, [dayMap, normalMap, specMap, nightMap])

  // Sun direction matching main directional light
  const sunDir = useMemo(() => new THREE.Vector3(7, 4, 5).normalize(), [])

  // Custom Atmosphere Shader Material (Soft verdigris-cyan limb matching circular silicon)
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVert,
      fragmentShader: atmosphereFrag,
      uniforms: {
        uSunDirection: { value: sunDir },
        uAtmoColor: { value: new THREE.Color('#2DD4BF') },
        uIntensity: { value: 0.95 },
        uFalloff: { value: 4.6 },
        uSunInfluence: { value: 0.45 }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    })
  }, [sunDir])

  // Night lights material (additive blend over dark hemisphere)
  const nightMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: nightMap,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    })
  }, [nightMap])

  const { isEarthImmersive, enterImmersiveOrbit, returnToWorld, selectedCampusId } = useWorldStore()
  const pointerDownPos = useRef({ x: 0, y: 0 })

  // Frame tick for rotation
  useFrame((_, delta) => {
    if (autoRotate && earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.018 // slow realistic planetary rotation
    }
  })

  return (
    <group ref={earthGroupRef}>
      {/* 1. Day Earth Surface (Interactive target for immersive mode activation) */}
      <mesh
        castShadow
        receiveShadow
        onPointerDown={(e) => {
          pointerDownPos.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={(e) => {
          const dist = Math.hypot(
            e.clientX - pointerDownPos.current.x,
            e.clientY - pointerDownPos.current.y
          )
          if (dist > 6) return

          if (selectedCampusId) {
            returnToWorld()
          } else if (!isEarthImmersive) {
            enterImmersiveOrbit()
          }
        }}
        onPointerOver={() => {
          if (!isEarthImmersive) {
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          if (!isEarthImmersive) {
            document.body.style.cursor = 'default'
          }
        }}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specMap}
          roughness={0.65}
          metalness={0.1}
          color={new THREE.Color('#CBD5E1')}
        />
      </mesh>

      {/* 2. City Night Lights Layer (Visual only, bypass raycasting) */}
      <mesh renderOrder={1} raycast={() => null}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.001, 64, 64]} />
        <primitive object={nightMaterial} attach="material" />
      </mesh>

      {/* 3. Outer Atmosphere Limb Glow (Visual only, bypass raycasting) */}
      <mesh renderOrder={2} raycast={() => null}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.045, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  )
}
