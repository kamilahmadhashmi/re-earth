import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import type { RankedSponsor } from '../../shared/ranking'
import windowGridVert from '../../shaders/windowGrid.vert.glsl'
import windowGridFrag from '../../shaders/windowGrid.frag.glsl'

interface SponsorSkylineProps {
  sponsors: RankedSponsor[]
  selectedSponsorId: string | null
  onSelectSponsor: (id: string) => void
  onOpenPitch: () => void
}

export const SponsorSkyline: React.FC<SponsorSkylineProps> = ({
  sponsors,
  selectedSponsorId,
  onSelectSponsor
}) => {
  return (
    <group position={[0, -1.0, 0]}>
      {/* 1. Flat Night-City Neon Grid Ground */}
      <gridHelper args={[24, 24, '#10B981', '#1E293B']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050608" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 2. Arranged Sponsor Towers (No text overlays or distractions) */}
      {sponsors.map((sponsor, index) => {
        // Position in a symmetrical architectural layout
        const row = Math.floor(index / 3) - 1
        const col = (index % 3) - 1
        const posX = col * 3.6
        const posZ = row * 3.6

        return (
          <SponsorTower
            key={sponsor.id}
            sponsor={sponsor}
            position={[posX, 0, posZ]}
            isSelected={selectedSponsorId === sponsor.id}
            onSelect={() => onSelectSponsor(sponsor.id)}
          />
        )
      })}
    </group>
  )
}

interface SponsorTowerProps {
  sponsor: RankedSponsor
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
}

const SponsorTower: React.FC<SponsorTowerProps> = ({
  sponsor,
  position,
  isSelected,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false)
  const height = sponsor.towerHeight
  const width = 1.1

  const brandColor = useMemo(() => new THREE.Color(sponsor.color), [sponsor.color])
  const accentColor = useMemo(() => new THREE.Color(sponsor.accentColor), [sponsor.accentColor])

  const towerMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: windowGridVert,
      fragmentShader: windowGridFrag,
      uniforms: {
        uBaseColor: { value: brandColor },
        uGlowColor: { value: accentColor },
        uTime: { value: 0 },
        uTier: { value: sponsor.rank <= 3 ? 1.0 : 2.0 },
        uHeightProgress: { value: 1.0 }
      }
    })
  }, [brandColor, accentColor, sponsor.rank])

  useFrame((state) => {
    if (towerMaterial) {
      towerMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Stepped architecture: base, mid, top
  const h1 = height * 0.6
  const h2 = height * 0.3
  const h3 = height * 0.1
  const w1 = width
  const w2 = width * 0.78
  const w3 = width * 0.52

  const pointerDownPos = useRef({ x: 0, y: 0 })

  return (
    <group
      position={position}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY }
      }}
      onClick={(e) => {
        e.stopPropagation()
        const dist = Math.hypot(
          e.clientX - pointerDownPos.current.x,
          e.clientY - pointerDownPos.current.y
        )
        if (dist > 6) return
        onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* TIER 1 */}
      <mesh position={[0, h1 / 2, 0]} material={towerMaterial}>
        <boxGeometry args={[w1, h1, w1]} />
      </mesh>

      {/* TIER 2 */}
      <mesh position={[0, h1 + h2 / 2, 0]} material={towerMaterial}>
        <boxGeometry args={[w2, h2, w2]} />
      </mesh>

      {/* TIER 3 */}
      <mesh position={[0, h1 + h2 + h3 / 2, 0]} material={towerMaterial}>
        <boxGeometry args={[w3, h3, w3]} />
      </mesh>

      {/* ROOFTOP ARCHITECTURAL LIGHT CROWN SPIRE */}
      <mesh position={[0, height + 0.12, 0]}>
        <coneGeometry args={[0.08, 0.28, 4]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.65}
        />
      </mesh>
    </group>
  )
}
