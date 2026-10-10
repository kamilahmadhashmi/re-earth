import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { RankedSponsor } from '../../shared/ranking'
import { SPONSOR_THEMES } from '../../data/sponsorBannerThemes'
import type { TreeSpatialConfig } from '../../utils/treeSpatialLayout'

interface CyberneticTreeProps {
  sponsor: RankedSponsor
  config: TreeSpatialConfig
  isSelected: boolean
  onSelect: () => void
}

/**
 * Deterministic PRNG seeded by sponsor ID for stable, organic procedural generation
 */
function createSeededRng(seedStr: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export const CyberneticTree: React.FC<CyberneticTreeProps> = ({
  sponsor,
  config,
  isSelected,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false)
  const pointerDownPos = useRef({ x: 0, y: 0 })

  const theme = SPONSOR_THEMES[sponsor.id]
  const brandColor = useMemo(() => new THREE.Color(sponsor.color), [sponsor.color])
  const accentColor = useMemo(() => new THREE.Color(sponsor.accentColor), [sponsor.accentColor])

  // Build the complete procedural 3D model
  const treeModel = useMemo(() => {
    const rng = createSeededRng(sponsor.id)
    const H = config.treeHeight
    const maxCanopyR = config.canopyRadius

    // 1. Slender organic trunk spline with natural curvature
    const swayX = (rng() - 0.5) * 0.4
    const swayZ = (rng() - 0.5) * 0.4
    const trunkPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(swayX * 0.2, H * 0.22, swayZ * 0.2),
      new THREE.Vector3(swayX * 0.6, H * 0.52, swayZ * 0.6),
      new THREE.Vector3(swayX * 0.4, H * 0.78, swayZ * 0.4),
      new THREE.Vector3(swayX * 0.1, H * 0.98, swayZ * 0.1)
    ]
    const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints)
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 32, config.trunkBaseRadius * 0.85, 10, false)

    // 2. Vertical luminous technological conduits along the bark
    const conduitCurves: THREE.CatmullRomCurve3[] = []
    const conduitCount = 3
    for (let c = 0; c < conduitCount; c++) {
      const startAngle = (c * (Math.PI * 2 / conduitCount)) + (rng() * 0.3)
      const pts: THREE.Vector3[] = []
      const steps = 18
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const basePt = trunkCurve.getPoint(t)
        // Gentle spiral
        const angle = startAngle + t * Math.PI * 1.8
        const r = THREE.MathUtils.lerp(config.trunkBaseRadius * 0.86, config.trunkCrownRadius * 1.1, t)
        pts.push(
          new THREE.Vector3(
            basePt.x + Math.cos(angle) * r,
            basePt.y,
            basePt.z + Math.sin(angle) * r
          )
        )
      }
      conduitCurves.push(new THREE.CatmullRomCurve3(pts))
    }

    // 3. Horizontal Energy Ring Collars around the trunk
    const energyRings: { y: number; r: number }[] = [
      { y: H * 0.25, r: config.trunkBaseRadius * 0.92 },
      { y: H * 0.52, r: config.trunkBaseRadius * 0.72 },
      { y: H * 0.76, r: config.trunkBaseRadius * 0.58 }
    ]

    // 4. Delicate Tiered Architectural Branches (Low, Mid, Crown)
    // Structured like a stylized cyberpunk bonsai/cedar with tiered foliage shelves
    const branches: {
      geo: THREE.BufferGeometry
      origin: THREE.Vector3
      tip: THREE.Vector3
      nodePos: THREE.Vector3
      shelfRadius: number
      shelfScale: [number, number, number]
    }[] = []

    // Proportional height scaling factor to ensure graceful branching at all tree heights
    const heightScaleFactor = Math.max(0.45, Math.min(2.0, H / 3.0))

    const tiers = [
      { tStart: 0.42, count: 3, radiusRatio: 0.82, yLift: 0.25 * heightScaleFactor },
      { tStart: 0.65, count: 3, radiusRatio: 0.72, yLift: 0.35 * heightScaleFactor },
      { tStart: 0.86, count: 2, radiusRatio: 0.55, yLift: 0.28 * heightScaleFactor }
    ]

    tiers.forEach((tier, tierIdx) => {
      const angleOffset = tierIdx * (Math.PI / 3) + rng() * 0.4
      for (let i = 0; i < tier.count; i++) {
        const branchT = tier.tStart + (rng() - 0.5) * 0.05
        const origin = trunkCurve.getPoint(branchT)
        const angle = angleOffset + (i * (Math.PI * 2 / tier.count)) + (rng() - 0.5) * 0.25

        // Strictly constrain reach within allowable canopy radius
        const reachDist = THREE.MathUtils.clamp(
          maxCanopyR * tier.radiusRatio * (0.85 + rng() * 0.2),
          0.40 * heightScaleFactor,
          maxCanopyR * 0.88
        )
        const tipY = origin.y + tier.yLift + (rng() - 0.5) * 0.10 * heightScaleFactor
        const tipX = origin.x + Math.cos(angle) * reachDist
        const tipZ = origin.z + Math.sin(angle) * reachDist
        const tip = new THREE.Vector3(tipX, tipY, tipZ)

        // Mid control point for graceful organic arch
        const midX = origin.x + Math.cos(angle) * reachDist * 0.55
        const midZ = origin.z + Math.sin(angle) * reachDist * 0.55
        const midY = origin.y + tier.yLift * 0.75 + 0.08 * heightScaleFactor

        const branchCurve = new THREE.CatmullRomCurve3([
          origin,
          new THREE.Vector3(midX, midY, midZ),
          tip
        ])
        const branchRadius = THREE.MathUtils.clamp(0.022 * heightScaleFactor, 0.018, 0.042)
        const branchGeo = new THREE.TubeGeometry(branchCurve, 16, branchRadius, 6, false)

        branches.push({
          geo: branchGeo,
          origin,
          tip,
          nodePos: new THREE.Vector3(
            origin.x + Math.cos(angle) * 0.035,
            origin.y,
            origin.z + Math.sin(angle) * 0.035
          ),
          shelfRadius: (0.32 + 0.16 * heightScaleFactor) * (0.88 + rng() * 0.24),
          // Flattened vertically for elegant Japanese pine / cyber-cedar shelf silhouette
          shelfScale: [1.15 + rng() * 0.2, 0.38 + rng() * 0.08, 1.15 + rng() * 0.2]
        })
      }
    })

    // Apex Crown Foliage Shelf
    const crownTip = trunkCurve.getPoint(1.0)
    const crownShelves = [
      {
        pos: new THREE.Vector3(crownTip.x, crownTip.y + 0.10 * heightScaleFactor, crownTip.z),
        radius: (0.36 + 0.16 * heightScaleFactor) + rng() * 0.10,
        scale: [1.2, 0.42, 1.2] as [number, number, number]
      },
      {
        pos: new THREE.Vector3(crownTip.x, crownTip.y - 0.14 * heightScaleFactor, crownTip.z),
        radius: (0.42 + 0.20 * heightScaleFactor) + rng() * 0.12,
        scale: [1.35, 0.45, 1.35] as [number, number, number]
      }
    ]

    // 5. Hanging Bioluminescent Fiber-Optic Tendrils / Vines
    // Delicate filaments descending gracefully from lower canopy shelves
    const hangingVines: { curve: THREE.CatmullRomCurve3; endPt: THREE.Vector3 }[] = []
    branches.slice(0, 4).forEach((b) => {
      const vineLen = (0.16 + 0.14 * heightScaleFactor) * (0.85 + rng() * 0.3)
      const startPt = new THREE.Vector3(
        b.tip.x + (rng() - 0.5) * 0.15 * heightScaleFactor,
        b.tip.y - 0.06 * heightScaleFactor,
        b.tip.z + (rng() - 0.5) * 0.15 * heightScaleFactor
      )
      const midPt = new THREE.Vector3(
        startPt.x + (rng() - 0.5) * 0.05 * heightScaleFactor,
        startPt.y - vineLen * 0.5,
        startPt.z + (rng() - 0.5) * 0.05 * heightScaleFactor
      )
      const endPt = new THREE.Vector3(
        startPt.x + (rng() - 0.5) * 0.03 * heightScaleFactor,
        startPt.y - vineLen,
        startPt.z + (rng() - 0.5) * 0.03 * heightScaleFactor
      )
      hangingVines.push({
        curve: new THREE.CatmullRomCurve3([startPt, midPt, endPt]),
        endPt
      })
    })

    // 6. Gnarled Tech Roots Radiating Outward
    const roots: THREE.TubeGeometry[] = []
    const rootCount = 5
    for (let r = 0; r < rootCount; r++) {
      const angle = (r / rootCount) * Math.PI * 2 + (rng() - 0.5) * 0.45
      const rootLen = (0.40 + 0.16 * heightScaleFactor) + rng() * 0.16
      const rootCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.14, 0),
        new THREE.Vector3(
          Math.cos(angle) * rootLen * 0.45,
          0.04,
          Math.sin(angle) * rootLen * 0.45
        ),
        new THREE.Vector3(
          Math.cos(angle) * rootLen,
          -0.01,
          Math.sin(angle) * rootLen
        )
      ])
      roots.push(new THREE.TubeGeometry(rootCurve, 12, 0.036, 5, false))
    }

    // 7. Ground Grass Blades & Moss Tufts
    const grassCount = 36
    const grassBlades: {
      position: [number, number, number]
      rotation: [number, number, number]
      scale: [number, number, number]
    }[] = []

    for (let g = 0; g < grassCount; g++) {
      const angle = rng() * Math.PI * 2
      const dist = 0.22 + rng() * 0.52 // strictly within base mound (0.78 max)
      const gx = Math.cos(angle) * dist
      const gz = Math.sin(angle) * dist
      const h = 0.15 + rng() * 0.16
      grassBlades.push({
        position: [gx, h / 2, gz],
        rotation: [(rng() - 0.5) * 0.35, rng() * Math.PI, (rng() - 0.5) * 0.35],
        scale: [0.016, h, 0.016]
      })
    }

    // 8. Technological Reclaimed Crystals / Data Nodes Nestled in Grass
    const techNodes: { pos: [number, number, number]; scale: number }[] = [
      { pos: [0.38, 0.04, 0.24], scale: 0.045 },
      { pos: [-0.32, 0.03, 0.35], scale: 0.038 },
      { pos: [0.18, 0.04, -0.42], scale: 0.042 }
    ]

    return {
      trunkGeo,
      conduitCurves,
      energyRings,
      branches,
      crownShelves,
      hangingVines,
      roots,
      grassBlades,
      techNodes
    }
  }, [sponsor.id, config])

  // Dynamic emissive pulsing materials
  const conduitMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const nodeMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const foliageMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const vineMatRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const pulse = 1.0 + 0.32 * Math.sin(t * 2.4 + sponsor.rank * 0.75)

    if (conduitMatRef.current) {
      conduitMatRef.current.emissiveIntensity = (hovered || isSelected ? 1.7 : 1.15) * pulse
    }
    if (nodeMatRef.current) {
      nodeMatRef.current.emissiveIntensity = (hovered || isSelected ? 2.4 : 1.6) * pulse
    }
    if (foliageMatRef.current) {
      foliageMatRef.current.emissiveIntensity = (hovered || isSelected ? 0.65 : 0.42) * pulse
    }
    if (vineMatRef.current) {
      vineMatRef.current.opacity = (hovered || isSelected ? 0.95 : 0.7) * (0.8 + 0.2 * Math.sin(t * 3.0))
    }
  })

  return (
    <group
      position={config.position}
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
      {/* 1. FOREST BASE MOUND (Organic Loam & Reclaimed Substrate) */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[config.baseMoundRadius * 0.85, config.baseMoundRadius, 0.08, 24]} />
        <meshStandardMaterial
          color="#0B1118"
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* 2. GNARLED TECH ROOTS */}
      {treeModel.roots.map((rootGeo, idx) => (
        <mesh key={`root-${idx}`} geometry={rootGeo}>
          <meshStandardMaterial
            color="#0F1722"
            roughness={0.68}
            metalness={0.55}
          />
        </mesh>
      ))}

      {/* 3. GROUND VEGETATION & CYBERNETIC GRASS */}
      {treeModel.grassBlades.map((blade, idx) => (
        <mesh
          key={`grass-${idx}`}
          position={blade.position}
          rotation={blade.rotation}
          scale={blade.scale}
        >
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial
            color="#063E2C"
            emissive="#10B981"
            emissiveIntensity={hovered ? 0.45 : 0.22}
            roughness={0.55}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* 3b. RECLAIMED DATA CRYSTALS IN MOSS */}
      {treeModel.techNodes.map((n, idx) => (
        <mesh key={`technode-${idx}`} position={n.pos}>
          <octahedronGeometry args={[n.scale, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.4}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* 4. SLENDER ORGANIC TRUNK */}
      <mesh geometry={treeModel.trunkGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#0B121A"
          roughness={0.62}
          metalness={0.78}
        />
      </mesh>

      {/* 5. VERTICAL LUMINOUS CONDUITS ALONG BARK */}
      {treeModel.conduitCurves.map((curve, idx) => (
        <mesh key={`conduit-${idx}`}>
          <tubeGeometry args={[curve, 28, 0.015, 6, false]} />
          <meshStandardMaterial
            ref={idx === 0 ? conduitMatRef : undefined}
            color={brandColor}
            emissive={brandColor}
            emissiveIntensity={1.2}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* 5b. HORIZONTAL ENERGY RINGS AROUND TRUNK */}
      {treeModel.energyRings.map((ring, idx) => (
        <mesh key={`ring-${idx}`} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.r, 0.012, 6, 20]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
      ))}

      {/* 6. DELICATE ARCHITECTURAL BRANCHES & JUNCTION NODES */}
      {treeModel.branches.map((b, idx) => (
        <group key={`branch-${idx}`}>
          {/* Branch Armature */}
          <mesh geometry={b.geo}>
            <meshStandardMaterial
              color="#0E1624"
              roughness={0.58}
              metalness={0.68}
            />
          </mesh>

          {/* Luminous Branch Fork Node */}
          <mesh position={b.nodePos}>
            <octahedronGeometry args={[0.042, 0]} />
            <meshStandardMaterial
              ref={idx === 0 ? nodeMatRef : undefined}
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={1.8}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Tiered Foliage Shelf at Branch Tip */}
          <group position={b.tip} scale={b.shelfScale}>
            {/* Organic Core Foliage Shelf (Deep Forest Emerald) */}
            <mesh>
              <dodecahedronGeometry args={[b.shelfRadius, 1]} />
              <meshStandardMaterial
                color="#06281D"
                roughness={0.55}
                metalness={0.2}
              />
            </mesh>

            {/* Bioluminescent Outer Foliage Shell (Delicate Translucent Veil) */}
            <mesh>
              <dodecahedronGeometry args={[b.shelfRadius * 1.08, 1]} />
              <meshStandardMaterial
                ref={idx === 0 ? foliageMatRef : undefined}
                color="#0A3C2A"
                emissive={brandColor}
                emissiveIntensity={hovered || isSelected ? 0.65 : 0.42}
                roughness={0.35}
                metalness={0.15}
                transparent
                opacity={hovered || isSelected ? 0.92 : 0.82}
              />
            </mesh>

            {/* Delicate Cybernetic Lattice Wireframe (Technological Leaf Matrix) */}
            <mesh>
              <dodecahedronGeometry args={[b.shelfRadius * 1.12, 1]} />
              <meshBasicMaterial
                color={accentColor}
                wireframe
                transparent
                opacity={hovered || isSelected ? 0.5 : 0.28}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* 7. APEX CROWN FOLIAGE SHELVES */}
      {treeModel.crownShelves.map((shelf, idx) => (
        <group key={`crown-shelf-${idx}`} position={shelf.pos} scale={shelf.scale}>
          <mesh>
            <dodecahedronGeometry args={[shelf.radius, 1]} />
            <meshStandardMaterial
              color="#06281D"
              roughness={0.55}
              metalness={0.2}
            />
          </mesh>
          <mesh>
            <dodecahedronGeometry args={[shelf.radius * 1.08, 1]} />
            <meshStandardMaterial
              color="#0A3C2A"
              emissive={brandColor}
              emissiveIntensity={hovered || isSelected ? 0.7 : 0.45}
              roughness={0.35}
              metalness={0.15}
              transparent
              opacity={hovered || isSelected ? 0.94 : 0.84}
            />
          </mesh>
          {/* Apex Geometric Leaf Lattice */}
          <mesh>
            <dodecahedronGeometry args={[shelf.radius * 1.12, 1]} />
            <meshBasicMaterial
              color={accentColor}
              wireframe
              transparent
              opacity={hovered || isSelected ? 0.55 : 0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 8. HANGING BIOLUMINESCENT FIBER-OPTIC TENDRILS */}
      {treeModel.hangingVines.map((vine, idx) => (
        <group key={`vine-${idx}`}>
          <mesh>
            <tubeGeometry args={[vine.curve, 10, 0.008, 4, false]} />
            <meshBasicMaterial
              ref={idx === 0 ? vineMatRef : undefined}
              color={brandColor}
              transparent
              opacity={0.75}
            />
          </mesh>
          {/* Glowing Spore Point at Vine Tip */}
          <mesh position={vine.endPt}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>
      ))}

      {/* 9. APEX CROWN SPIRE / LIGHT BEACON */}
      <mesh position={[0, config.treeHeight + 0.16, 0]}>
        <coneGeometry args={[0.04, 0.24, 4]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={hovered || isSelected ? 1.0 : 0.8}
        />
      </mesh>

      {/* 9b. HAIRLINE TETHER FROM SPIRE TO PLACARD */}
      <mesh position={[0, config.treeHeight + 0.45, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.38, 4]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={hovered || isSelected ? 0.85 : 0.4}
        />
      </mesh>

      {/* 9c. INVISIBLE CYLINDER FOR SMOOTH HOVER HIT DETECTION */}
      <mesh position={[0, config.treeHeight / 2, 0]}>
        <cylinderGeometry args={[config.canopyRadius, config.canopyRadius, config.treeHeight + 0.8, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 10. REFINED ENVIRONMENTAL PLACARD (Minimal Badge by Default, Full Detail Rectangle on Hover) */}
      <Html
        position={[0, config.treeHeight + 0.74, 0]}
        center
        distanceFactor={11.0}
        className="pointer-events-auto select-none transition-all duration-200"
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${
            hovered || isSelected ? 'scale-105 z-40' : 'scale-100 z-10'
          }`}
        >
          {hovered || isSelected ? (
            /* Full Detailed Rectangle (Visible Only on Cursor Hover / Selection) */
            <div
              className="w-[228px] px-3 py-2.5 rounded-md border shadow-2xl flex flex-col text-left gap-1.5 transition-all duration-200"
              style={{
                backgroundColor: '#131922',
                borderColor: sponsor.color,
                boxShadow: `0 10px 28px -4px ${sponsor.color}50`
              }}
            >
              {/* Header: Rank, Sponsor Name & Verified Weight */}
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

              {/* Environmental Good Extra Details */}
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
          ) : (
            /* Minimal Badge by Default (Only Company Name and kg) */
            <div
              className="px-2.5 py-1 rounded-md border shadow-lg flex items-center gap-2 transition-all duration-150 backdrop-blur-sm whitespace-nowrap"
              style={{
                backgroundColor: 'rgba(19, 25, 34, 0.92)',
                borderColor: `${sponsor.color}60`,
                boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.7)'
              }}
            >
              <span className="font-bold text-[11px] text-white tracking-tight">
                {sponsor.name}
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald">
                {Math.round(sponsor.totalKg).toLocaleString()} kg
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

export default CyberneticTree
