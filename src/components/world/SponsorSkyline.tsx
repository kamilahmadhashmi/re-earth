import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { RankedSponsor } from '../../shared/ranking'
import { SPONSOR_THEMES } from '../../data/sponsorBannerThemes'
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
      <gridHelper args={[26, 26, '#10B981', '#1E293B']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#050608" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 2. Arranged Sponsor Towers with Sponsor Name & Environmental Impact */}
      {sponsors.map((sponsor, index) => {
        // Position in a generous 3x3 layout with ample spacing
        const row = Math.floor(index / 3) - 1
        const col = (index % 3) - 1
        const posX = col * 4.3
        const posZ = row * 4.3

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
  const width = 1.15

  const brandColor = useMemo(() => new THREE.Color(sponsor.color), [sponsor.color])
  const accentColor = useMemo(() => new THREE.Color(sponsor.accentColor), [sponsor.accentColor])
  const theme = SPONSOR_THEMES[sponsor.id]

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
      <mesh position={[0, h1 / 2, 0]} material={towerMaterial} castShadow receiveShadow>
        <boxGeometry args={[w1, h1, w1]} />
      </mesh>

      {/* TIER 2 */}
      <mesh position={[0, h1 + h2 / 2, 0]} material={towerMaterial} castShadow receiveShadow>
        <boxGeometry args={[w2, h2, w2]} />
      </mesh>

      {/* TIER 3 */}
      <mesh position={[0, h1 + h2 + h3 / 2, 0]} material={towerMaterial} castShadow receiveShadow>
        <boxGeometry args={[w3, h3, w3]} />
      </mesh>

      {/* ROOFTOP ARCHITECTURAL LIGHT SPIRE */}
      <mesh position={[0, height + 0.12, 0]}>
        <coneGeometry args={[0.08, 0.28, 4]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.7}
        />
      </mesh>

      {/* TOWER ENVIRONMENTAL IMPACT PLACARD (Sponsor Name & Environmental Good Done) */}
      <Html
        position={[0, height + 0.42, 0]}
        center
        distanceFactor={11.0}
        className="pointer-events-none select-none transition-all duration-200"
      >
        <div
          className={`flex flex-col items-center transition-transform duration-200 ${
            hovered || isSelected ? 'scale-105 z-30' : 'scale-100 z-10'
          }`}
        >
          <div
            className="w-[250px] px-3.5 py-2.5 rounded-md border shadow-2xl flex flex-col text-left gap-1.5"
            style={{
              backgroundColor: '#131922',
              borderColor: hovered || isSelected ? sponsor.color : `${sponsor.color}80`,
              boxShadow: hovered || isSelected
                ? `0 10px 28px -4px ${sponsor.color}50`
                : '0 6px 18px -4px rgba(0, 0, 0, 0.75)'
            }}
          >
            {/* Header: Sponsor Name & Verified Weight */}
            <div className="flex items-center justify-between w-full pb-1.5 border-b border-white/[0.08] gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: `${sponsor.color}25`, color: sponsor.color }}
                >
                  #{sponsor.rank}
                </span>
                <span className="font-bold text-xs text-white tracking-tight truncate">
                  {sponsor.name}
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald shrink-0">
                {Math.round(sponsor.totalKg).toLocaleString()} kg
              </span>
            </div>

            {/* Environmental Good They Did */}
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between text-[8px] font-mono tracking-wider uppercase text-emerald">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0 animate-pulse" />
                  ENVIRONMENTAL GOOD
                </span>
                <span className="text-text-muted text-[8px]">
                  {sponsor.campusCount} {sponsor.campusCount === 1 ? 'Campus' : 'Campuses'}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-text-primary leading-snug">
                {theme?.esgPledge || sponsor.description}
              </p>
              {theme?.tagline && (
                <p className="text-[8.5px] text-text-muted leading-tight font-mono">
                  {theme.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
