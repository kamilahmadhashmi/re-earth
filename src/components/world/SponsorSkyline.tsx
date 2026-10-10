import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
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
  onSelectSponsor,
  onOpenPitch
}) => {
  return (
    <group position={[0, -1.0, 0]}>
      {/* 1. Flat Night-City Neon Grid Ground */}
      <gridHelper args={[24, 24, '#10B981', '#1E293B']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050608" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 2. Sponsor Towers */}
      {sponsors.map((sponsor, index) => {
        // Position in a staggered 3x3 layout
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

      {/* 3. Golden "Your Company Here" Empty Plot */}
      <EmptySponsorPlot position={[3.6, 0, 3.6]} onClick={onOpenPitch} />
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

      {/* ROOF SPONSOR LOGO CROWN BILLBOARD */}
      <Html
        position={[0, height + 0.35, 0]}
        center
        distanceFactor={11}
        className="pointer-events-none select-none transition-transform duration-200"
      >
        <div
          className={`flex flex-col items-center whitespace-nowrap ${
            hovered || isSelected ? 'scale-110 z-20' : 'scale-100'
          }`}
        >
          <div
            className="px-3 py-1.5 rounded-md border shadow-xl flex items-center gap-2"
            style={{
              backgroundColor: '#131922',
              borderColor: sponsor.color
            }}
          >
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${sponsor.color}25`, color: sponsor.color }}
            >
              #{sponsor.rank}
            </span>
            <span className="font-bold text-sm text-white">{sponsor.name}</span>
            <span className="font-mono text-xs font-semibold text-emerald-300">
              {Math.round(sponsor.totalKg).toLocaleString()}kg
            </span>
          </div>
          <span className="text-[10px] text-text-muted mt-0.5">
            {sponsor.campusCount} {sponsor.campusCount === 1 ? 'Campus' : 'Campuses'} Backed
          </span>
        </div>
      </Html>
    </group>
  )
}

// Glowing gold plot for potential sponsors
const EmptySponsorPlot: React.FC<{ position: [number, number, number]; onClick: () => void }> = ({
  position,
  onClick
}) => {
  const [hovered, setHovered] = useState(false)
  const beamRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

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
        onClick()
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
      {/* Golden Base Plot */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.6, 0.2, 1.6]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic upward beacon cylinder */}
      <mesh ref={beamRef} position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 3.8, 16, 1, true]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={hovered ? 0.45 : 0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Billboard prompt */}
      <Html position={[0, 2.2, 0]} center distanceFactor={11} className="pointer-events-none select-none">
        <div
          className={`flex flex-col items-center transition-transform duration-200 ${
            hovered ? 'scale-110' : 'scale-100'
          }`}
        >
          <div className="px-3 py-1.5 rounded-md border border-amber-400/80 bg-[#131922] shadow-sm flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <span className="w-1.5 h-1.5 rounded-[2px] bg-amber-400" />
            <span>RESERVE SPONSOR POSITION</span>
          </div>
          <span className="text-[10px] text-amber-200/80 mt-1 font-mono">
            Click to Sponsor a Campus
          </span>
        </div>
      </Html>
    </group>
  )
}
