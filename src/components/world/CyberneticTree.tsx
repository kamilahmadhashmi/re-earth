import React, { useRef, useMemo, useState, useEffect } from 'react'
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
 * Creates a realistic 3D curved leaf geometry with a creased midrib spine
 * and gentle downward arch at the tip.
 */
function createCurvedLeafGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()

  // 11 vertices with authentic 3D crease along midrib (x=0) and arch toward tip
  const positions = new Float32Array([
    // 0: stem base / petiole attachment point
    0, 0, 0,
    // Lower blade tier
    0, 0.22, -0.015,     // 1: midrib low (creased inward)
    -0.12, 0.22, 0.025,  // 2: left low
    0.12, 0.22, 0.025,   // 3: right low
    // Middle blade tier (widest point)
    0, 0.52, -0.035,     // 4: midrib mid
    -0.20, 0.52, 0.045,  // 5: left mid
    0.20, 0.52, 0.045,   // 6: right mid
    // Upper blade tier (tapering)
    0, 0.78, -0.06,      // 7: midrib high
    -0.14, 0.78, 0.03,   // 8: left high
    0.14, 0.78, 0.03,    // 9: right high
    // 10: apex tip (natural downward gravitational curl)
    0, 1.0, -0.09
  ])

  const indices = [
    // Stem to tier 1
    0, 2, 1,   0, 1, 3,
    // Tier 1 to tier 2
    1, 2, 5,   1, 5, 4,
    1, 4, 6,   1, 6, 3,
    // Tier 2 to tier 3
    4, 5, 8,   4, 8, 7,
    4, 7, 9,   4, 9, 6,
    // Tier 3 to apex tip
    7, 8, 10,  7, 10, 9
  ]

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

/**
 * Soothing natural botanical pigment palette:
 * Sage, muted emerald, fern green, and subtle spring yellow-green highlights.
 */
const BOTANICAL_PALETTE = [
  new THREE.Color('#4E9B66'), // Fresh fern green
  new THREE.Color('#5FA374'), // Soothing sage green
  new THREE.Color('#3B8759'), // Muted emerald green
  new THREE.Color('#68A87C'), // Soft sage
  new THREE.Color('#84B86A'), // Delicate spring yellow-green highlight
  new THREE.Color('#387C52'), // Deep forest fern
  new THREE.Color('#92C476')  // Young sunlit leaf highlight
]

interface LeafData {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
  color: THREE.Color
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
  const leafMeshRef = useRef<THREE.InstancedMesh>(null)

  const theme = SPONSOR_THEMES[sponsor.id]
  const brandColor = useMemo(() => new THREE.Color(sponsor.color), [sponsor.color])
  const accentColor = useMemo(() => new THREE.Color(sponsor.accentColor), [sponsor.accentColor])
  const leafGeometry = useMemo(() => createCurvedLeafGeometry(), [])

  // Build the complete procedural 3D model
  const treeModel = useMemo(() => {
    const rng = createSeededRng(sponsor.id)
    const H = config.treeHeight
    const maxCanopyR = config.canopyRadius
    const upVec = new THREE.Vector3(0, 1, 0)

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
    const branches: {
      geo: THREE.BufferGeometry
      origin: THREE.Vector3
      tip: THREE.Vector3
      nodePos: THREE.Vector3
      branchCurve: THREE.CatmullRomCurve3
    }[] = []

    const subTwigs: THREE.TubeGeometry[] = []
    const leaves: LeafData[] = []

    const tiers = [
      { tStart: 0.42, count: 3, radiusRatio: 0.82, yLift: 0.25 },
      { tStart: 0.65, count: 3, radiusRatio: 0.72, yLift: 0.35 },
      { tStart: 0.86, count: 2, radiusRatio: 0.55, yLift: 0.28 }
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
          0.55,
          maxCanopyR * 0.88
        )
        const tipY = origin.y + tier.yLift + (rng() - 0.5) * 0.12
        const tipX = origin.x + Math.cos(angle) * reachDist
        const tipZ = origin.z + Math.sin(angle) * reachDist
        const tip = new THREE.Vector3(tipX, tipY, tipZ)

        // Mid control point for graceful organic arch
        const midX = origin.x + Math.cos(angle) * reachDist * 0.55
        const midZ = origin.z + Math.sin(angle) * reachDist * 0.55
        const midY = origin.y + tier.yLift * 0.75 + 0.08

        const branchCurve = new THREE.CatmullRomCurve3([
          origin,
          new THREE.Vector3(midX, midY, midZ),
          tip
        ])
        const branchGeo = new THREE.TubeGeometry(branchCurve, 16, 0.034, 6, false)

        branches.push({
          geo: branchGeo,
          origin,
          tip,
          nodePos: new THREE.Vector3(
            origin.x + Math.cos(angle) * 0.035,
            origin.y,
            origin.z + Math.sin(angle) * 0.035
          ),
          branchCurve
        })

        // Sub-twigs branching off toward the foliage
        const subTwigT = 0.68 + rng() * 0.18
        const subTwigOrigin = branchCurve.getPoint(subTwigT)
        const subTwigTan = branchCurve.getTangent(subTwigT).normalize()
        const subTwigSide = new THREE.Vector3().crossVectors(subTwigTan, upVec).normalize()
        const subTwigEnd = subTwigOrigin.clone().addScaledVector(subTwigSide, (rng() > 0.5 ? 1 : -1) * 0.22).add(new THREE.Vector3(0, 0.1, 0))
        const subTwigCurve = new THREE.CatmullRomCurve3([subTwigOrigin, subTwigEnd])
        subTwigs.push(new THREE.TubeGeometry(subTwigCurve, 8, 0.018, 4, false))

        // Distribute natural, realistic leaf clusters along this branch
        const tSamples = [0.42, 0.60, 0.78, 0.92, 1.0]
        tSamples.forEach((t) => {
          const pt = branchCurve.getPoint(t)
          const tan = branchCurve.getTangent(t).normalize()
          const side = new THREE.Vector3().crossVectors(tan, upVec).normalize()
          const norm = new THREE.Vector3().crossVectors(side, tan).normalize()

          // Lush fanning leaf clusters
          const leafCountOnSprig = t === 1.0 ? 12 : 7
          for (let l = 0; l < leafCountOnSprig; l++) {
            const spreadAngle = (l - (leafCountOnSprig - 1) / 2) * 0.52 + (rng() - 0.5) * 0.25
            const droop = (rng() - 0.5) * 0.35
            const dir = new THREE.Vector3()
              .addScaledVector(side, Math.sin(spreadAngle))
              .addScaledVector(norm, Math.cos(spreadAngle) * 0.65 + 0.35 + droop)
              .addScaledVector(tan, t === 1.0 ? 0.55 : 0.28)
              .normalize()

            // Petiole offset from branch surface
            const leafPos = pt.clone().addScaledVector(dir, 0.07 + rng() * 0.12)

            // Leaf orientation: align spine along dir, with slight natural upward curl & roll
            const quat = new THREE.Quaternion().setFromUnitVectors(upVec, dir)
            const rollQuat = new THREE.Quaternion().setFromAxisAngle(dir, (rng() - 0.5) * 0.8)
            quat.multiply(rollQuat)

            // Distinct, recognizable leaf size: length ~0.28 to 0.38, width ~0.14 to 0.20
            const leafScaleL = 0.28 + rng() * 0.10
            const leafScaleW = 0.14 + rng() * 0.06
            const leafScale = new THREE.Vector3(leafScaleW, leafScaleL, leafScaleW * 0.75)

            // Color picked from soothing botanical palette
            const paletteColor = BOTANICAL_PALETTE[Math.floor(rng() * BOTANICAL_PALETTE.length)].clone()

            leaves.push({
              position: leafPos,
              quaternion: quat,
              scale: leafScale,
              color: paletteColor
            })
          }
        })
      }
    })

    // Apex Crown Foliage & Fine Crown Twigs
    const crownTip = trunkCurve.getPoint(1.0)
    const crownSprigCount = 7
    for (let cs = 0; cs < crownSprigCount; cs++) {
      const crownAngle = (cs * Math.PI * 2 / crownSprigCount) + (rng() - 0.5) * 0.35
      const crownDist = 0.38 + rng() * 0.25
      const crownEnd = new THREE.Vector3(
        crownTip.x + Math.cos(crownAngle) * crownDist,
        crownTip.y + 0.08 + rng() * 0.15,
        crownTip.z + Math.sin(crownAngle) * crownDist
      )
      const crownCurve = new THREE.CatmullRomCurve3([crownTip, crownEnd])
      subTwigs.push(new THREE.TubeGeometry(crownCurve, 8, 0.02, 4, false))

      // Radiate leaves along the crown sprig
      const crownLeafCount = 8
      for (let cl = 0; cl < crownLeafCount; cl++) {
        const t = cl / (crownLeafCount - 1)
        const pt = crownCurve.getPoint(t)
        const tan = crownCurve.getTangent(t).normalize()
        const side = new THREE.Vector3().crossVectors(tan, upVec).normalize()

        const leafDir = new THREE.Vector3()
          .addScaledVector(side, (cl % 2 === 0 ? 1 : -1) * (0.65 + rng() * 0.3))
          .addScaledVector(upVec, 0.7 + rng() * 0.3)
          .addScaledVector(tan, 0.35)
          .normalize()

        const leafPos = pt.clone().addScaledVector(leafDir, 0.07 + rng() * 0.08)
        const quat = new THREE.Quaternion().setFromUnitVectors(upVec, leafDir)
        const leafScaleL = 0.26 + rng() * 0.08
        const leafScaleW = 0.13 + rng() * 0.05
        const leafScale = new THREE.Vector3(leafScaleW, leafScaleL, leafScaleW * 0.75)
        const paletteColor = BOTANICAL_PALETTE[Math.floor(rng() * BOTANICAL_PALETTE.length)].clone()

        leaves.push({
          position: leafPos,
          quaternion: quat,
          scale: leafScale,
          color: paletteColor
        })
      }
    }

    // 5. Hanging Bioluminescent Fiber-Optic Tendrils / Vines
    const hangingVines: { curve: THREE.CatmullRomCurve3; endPt: THREE.Vector3 }[] = []
    branches.slice(0, 4).forEach((b) => {
      const vineLen = 0.28 + rng() * 0.22
      const startPt = new THREE.Vector3(
        b.tip.x + (rng() - 0.5) * 0.2,
        b.tip.y - 0.08,
        b.tip.z + (rng() - 0.5) * 0.2
      )
      const midPt = new THREE.Vector3(
        startPt.x + (rng() - 0.5) * 0.06,
        startPt.y - vineLen * 0.5,
        startPt.z + (rng() - 0.5) * 0.06
      )
      const endPt = new THREE.Vector3(
        startPt.x + (rng() - 0.5) * 0.04,
        startPt.y - vineLen,
        startPt.z + (rng() - 0.5) * 0.04
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
      const rootLen = 0.55 + rng() * 0.18
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
      const dist = 0.22 + rng() * 0.52
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
      subTwigs,
      leaves,
      hangingVines,
      roots,
      grassBlades,
      techNodes
    }
  }, [sponsor.id, config])

  // Sync InstancedMesh matrices and botanical colors
  useEffect(() => {
    if (!leafMeshRef.current || !treeModel.leaves.length) return
    const dummy = new THREE.Object3D()
    treeModel.leaves.forEach((l, i) => {
      dummy.position.copy(l.position)
      dummy.quaternion.copy(l.quaternion)
      dummy.scale.copy(l.scale)
      dummy.updateMatrix()
      leafMeshRef.current!.setMatrixAt(i, dummy.matrix)
      leafMeshRef.current!.setColorAt(i, l.color)
    })
    leafMeshRef.current.instanceMatrix.needsUpdate = true
    if (leafMeshRef.current.instanceColor) {
      leafMeshRef.current.instanceColor.needsUpdate = true
    }
  }, [treeModel.leaves])

  // Dynamic emissive pulsing materials
  const conduitMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const nodeMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const leafMatRef = useRef<THREE.MeshStandardMaterial>(null)
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
    if (leafMatRef.current) {
      // Subtle, calming living chlorophyll hint under natural green foliage
      leafMatRef.current.emissiveIntensity = (hovered || isSelected ? 0.32 : 0.18) * pulse
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
          {/* Main Branch Tube */}
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
        </group>
      ))}

      {/* 6b. SECONDARY FINE TWIGS REACHING INTO CANOPY */}
      {treeModel.subTwigs.map((twigGeo, idx) => (
        <mesh key={`twig-${idx}`} geometry={twigGeo}>
          <meshStandardMaterial
            color="#141E2B"
            roughness={0.62}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* 7. REALISTIC, DELICATE NATURAL LEAVES INSTANCED ON BRANCHES & CROWN */}
      {treeModel.leaves.length > 0 && (
        <instancedMesh
          ref={leafMeshRef}
          args={[leafGeometry, undefined, treeModel.leaves.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            ref={leafMatRef}
            color="#FFFFFF"
            roughness={0.38}
            metalness={0.04}
            side={THREE.DoubleSide}
            emissive="#1E462B"
            emissiveIntensity={hovered || isSelected ? 0.32 : 0.18}
          />
        </instancedMesh>
      )}

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

      {/* 10. REFINED ENVIRONMENTAL PLACARD (Sponsor Name & Environmental Good Done) */}
      <Html
        position={[0, config.treeHeight + 0.74, 0]}
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
            className="w-[224px] px-3 py-2 rounded-md border shadow-2xl flex flex-col text-left gap-1"
            style={{
              backgroundColor: '#131922',
              borderColor: hovered || isSelected ? sponsor.color : `${sponsor.color}80`,
              boxShadow: hovered || isSelected
                ? `0 10px 28px -4px ${sponsor.color}50`
                : '0 6px 18px -4px rgba(0, 0, 0, 0.75)'
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

export default CyberneticTree
