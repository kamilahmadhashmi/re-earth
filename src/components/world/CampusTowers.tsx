import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { RankedCampus } from '../../shared/ranking'
import { geoToVector3, geoOrientation, GLOBE_RADIUS } from '../../utils/geo'
import { SPONSOR_MAP } from '../../data/sponsors'
import { SponsorLogo } from '../ui/SponsorLogo'
import { createSponsorTowerBannerTexture } from '../../utils/sponsorTowerBannerTexture'
import {
  clusterCampusesByProximity,
  getExplodedOffsets,
  type CampusCluster
} from '../../utils/clusterMath'
import { useWorldStore } from '../../store/useWorldStore'

interface CampusTowersProps {
  campuses: RankedCampus[]
  selectedCampusId: string | null
  onSelectCampus: (id: string) => void
  boostTrigger?: number
}

export const CampusTowers: React.FC<CampusTowersProps> = ({
  campuses,
  selectedCampusId,
  onSelectCampus,
  boostTrigger = 0
}) => {
  const { cameraRadius, setActiveCluster } = useWorldStore()

  // ZOOM-ADAPTIVE HIERARCHY:
  // If cameraRadius > 7.5 (Global Overview): Cluster campuses within 4.5 degrees
  // If cameraRadius <= 7.5 (Regional & Inspection): Expand clusters so all towers are individually rendered
  const isGlobalView = cameraRadius > 7.4 && !selectedCampusId

  const { clusters, soloCampuses } = useMemo(() => {
    if (isGlobalView) {
      // Cluster nearby campuses within 4.5 degrees (e.g. DTU, NSUT, IIT Delhi in Delhi NCR)
      return clusterCampusesByProximity(campuses, 4.5)
    }
    // Fully separated in regional / campus inspection view
    return { clusters: [], soloCampuses: campuses }
  }, [campuses, isGlobalView])

  // Radial exploded visual offsets for close view so nearby towers don't touch
  const explodedOffsets = useMemo(() => {
    // When zoomed in, if campuses are very close (< 2 degrees), give them a tiny tangential offset
    const closeClusters = clusterCampusesByProximity(campuses, 2.0).clusters
    const offsetMap = new Map<string, THREE.Vector3>()

    closeClusters.forEach((cl) => {
      const offsets = getExplodedOffsets(cl.campuses, 0.08)
      offsets.forEach((val, key) => offsetMap.set(key, val))
    })

    return offsetMap
  }, [campuses])

  return (
    <group>
      {/* 1. CLUSTERS (Active only at Global Overview) */}
      {isGlobalView &&
        clusters.map((cluster) => (
          <CampusClusterNode
            key={cluster.id}
            cluster={cluster}
            onClick={() => setActiveCluster(cluster)}
          />
        ))}

      {/* 2. INDIVIDUAL SPONSOR-BRANDED TOWERS */}
      {soloCampuses.map((campus, index) => (
        <SingleCampusTower
          key={campus.id}
          campus={campus}
          index={index}
          isSelected={selectedCampusId === campus.id}
          onSelect={() => onSelectCampus(campus.id)}
          boostTrigger={boostTrigger}
          explodedOffset={explodedOffsets.get(campus.id)}
        />
      ))}
    </group>
  )
}

/* ========================================================================= */
/* CLUSTER NODE (CLEAN UNIFIED APPLE VISION PRO SPATIAL BEACON AT MACRO VIEW) */
/* ========================================================================= */
interface CampusClusterNodeProps {
  cluster: CampusCluster
  onClick: () => void
}

const CampusClusterNode: React.FC<CampusClusterNodeProps> = ({ cluster, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const clusterCrestRef = useRef<HTMLDivElement>(null)

  const sponsor = useMemo(() => {
    return SPONSOR_MAP.get(cluster.dominantSponsorId) || SPONSOR_MAP.get('google')!
  }, [cluster.dominantSponsorId])

  const quat = useMemo(() => {
    return geoOrientation(cluster.centerLat, cluster.centerLng)
  }, [cluster.centerLat, cluster.centerLng])

  const normal = useMemo(() => {
    return cluster.centerPosition.clone().normalize()
  }, [cluster.centerPosition])

  const pointerDownPos = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle hovering breathing pulse
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.05
      groupRef.current.scale.setScalar(hovered ? 1.25 : pulse)
    }

    // Horizon occlusion culling against spherical Earth
    if (clusterCrestRef.current) {
      const camDist = state.camera.position.length()
      const cosAngle = normal.dot(state.camera.position) / camDist
      const safeD = Math.max(GLOBE_RADIUS + 0.1, camDist)
      const maxAngle = Math.acos(GLOBE_RADIUS / safeD) + Math.acos(GLOBE_RADIUS / (GLOBE_RADIUS + 0.2))
      const cosCutoff = Math.cos(maxAngle) + 0.04
      const isVisible = cosAngle > cosCutoff
      clusterCrestRef.current.style.opacity = isVisible ? '1' : '0'
      clusterCrestRef.current.style.pointerEvents = isVisible ? 'auto' : 'none'
    }
  })

  return (
    <group
      ref={groupRef}
      position={cluster.centerPosition}
      quaternion={quat}
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
      {/* Invisible broad hit-sphere */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Radiant Base Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.06, 0.16, 32]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={hovered ? 0.8 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Monolithic Multi-Hub Core Beacon */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.16, 6]} />
        <meshStandardMaterial
          color="#0B0D14"
          emissive={sponsor.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Architectural Pylon Mounting Spire */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.007, 0.01, 0.06, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Prominent Dominant Corporate Partner Signage at Cluster Tip */}
      <Html
        position={[0, hovered ? 0.28 : 0.22, 0]}
        center
        zIndexRange={[10, 35]}
        className="pointer-events-auto select-none"
      >
        <div
          ref={clusterCrestRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
            hovered ? 'scale-105 z-40' : 'scale-100 z-10'
          }`}
        >
          {hovered ? (
            /* ENLARGED ON HOVER WITH CLUSTER NAME & CAMPUS COUNT */
            <div
              className="px-3 py-2 rounded-xl border shadow-2xl flex items-center gap-2.5 transition-all duration-200 animate-in fade-in zoom-in-95"
              style={{
                backgroundColor: 'rgba(10, 14, 21, 0.96)',
                borderColor: sponsor.color,
                boxShadow: `0 8px 24px -2px rgba(0, 0, 0, 0.85), 0 0 16px -2px ${sponsor.color}55`
              }}
            >
              <div
                className="w-8 h-8 rounded-lg bg-[#05070A] border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-inner"
                style={{
                  boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px ${sponsor.color}30`
                }}
              >
                <SponsorLogo
                  sponsorId={sponsor.id}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>

              <div className="flex flex-col text-left whitespace-nowrap min-w-0 pr-0.5">
                <span className="font-bold text-xs text-white tracking-tight">
                  {cluster.campuses[0].city} Cluster
                </span>
                <div className="flex items-center gap-1.5 text-[9.5px] font-mono mt-0.5">
                  <span className="text-emerald font-semibold">
                    {cluster.campuses.length} Campuses
                  </span>
                  <span className="text-text-muted">• Click to Expand</span>
                </div>
              </div>
            </div>
          ) : (
            /* SMALL LOGO AT CLUSTER TIP (BY DEFAULT) */
            <div
              className="relative w-7 h-7 rounded-lg border shadow-lg flex items-center justify-center p-1 transition-all duration-150 hover:scale-110"
              style={{
                backgroundColor: 'rgba(10, 14, 21, 0.94)',
                borderColor: `${sponsor.color}90`,
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.75), 0 0 8px ${sponsor.color}40`
              }}
            >
              <SponsorLogo
                sponsorId={sponsor.id}
                className="w-4 h-4 object-contain filter drop-shadow"
              />
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-mono font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: sponsor.color }}
              >
                {cluster.campuses.length}
              </span>
            </div>
          )}

          {/* Downward Architectural Mounting Anchor Pip */}
          <div
            className="w-2 h-2 -mt-1 rotate-45 border-r border-b"
            style={{
              backgroundColor: '#0A0E15',
              borderColor: hovered ? sponsor.color : `${sponsor.color}90`
            }}
          />
        </div>
      </Html>
    </group>
  )
}

/* ========================================================================= */
/* SINGLE CAMPUS TOWER (FULL-SURFACE SPONSOR BANNER TOWER AT REGIONAL/LOCAL)  */
/* ========================================================================= */
interface SingleCampusTowerProps {
  campus: RankedCampus
  index: number
  isSelected: boolean
  onSelect: () => void
  boostTrigger: number
  explodedOffset?: THREE.Vector3
}

const SingleCampusTower: React.FC<SingleCampusTowerProps> = ({
  campus,
  index,
  isSelected,
  onSelect,
  boostTrigger,
  explodedOffset
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const crestContainerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const growthProgress = useRef(0)

  const sponsor = useMemo(() => {
    return SPONSOR_MAP.get(campus.sponsorId) || SPONSOR_MAP.get('google')!
  }, [campus.sponsorId])

  const bannerTexture = useMemo(() => {
    return createSponsorTowerBannerTexture(sponsor, campus.shortName)
  }, [sponsor, campus.shortName])

  // Geographic positioning with optional micro-separation offset
  const { position, quaternion } = useMemo(() => {
    const pos = geoToVector3(campus.lat, campus.lng, GLOBE_RADIUS)
    if (explodedOffset) {
      pos.add(explodedOffset)
    }
    const quat = geoOrientation(campus.lat, campus.lng)
    return { position: pos, quaternion: quat }
  }, [campus.lat, campus.lng, explodedOffset])

  const normal = useMemo(() => {
    return position.clone().normalize()
  }, [position])

  const height = campus.towerHeight
  const towerWidth = Math.max(0.08, 0.05 + height * 0.038)
  const towerDepth = towerWidth * 0.75

  const materials = useMemo(() => {
    const bannerMaterial = new THREE.MeshStandardMaterial({
      map: bannerTexture,
      roughness: 0.35,
      metalness: 0.45,
      emissive: new THREE.Color(sponsor.color),
      emissiveIntensity: 0.32,
      emissiveMap: bannerTexture
    })

    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0A0D14'),
      roughness: 0.4,
      metalness: 0.8,
      emissive: new THREE.Color(sponsor.color),
      emissiveIntensity: 0.12
    })

    const topCapMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sponsor.color),
      roughness: 0.2,
      metalness: 0.9,
      emissive: new THREE.Color(sponsor.color),
      emissiveIntensity: 0.7
    })

    return [
      bannerMaterial,
      bannerMaterial,
      topCapMaterial,
      chassisMaterial,
      bannerMaterial,
      bannerMaterial
    ]
  }, [bannerTexture, sponsor.color])

  const boostSurge = useRef(0)
  const lastBoostTrigger = useRef(boostTrigger)
  const beaconMeshRef = useRef<THREE.Mesh>(null)

  // Trigger flare upon campus boost
  useMemo(() => {
    if (isSelected && boostTrigger !== lastBoostTrigger.current && boostTrigger > 0) {
      boostSurge.current = 1.0
      lastBoostTrigger.current = boostTrigger
    }
  }, [boostTrigger, isSelected])

  useFrame((state, delta) => {
    if (groupRef.current) {
      const delay = index * 0.04
      const elapsed = Math.max(0, state.clock.getElapsedTime() - delay)
      if (growthProgress.current < 1.0) {
        growthProgress.current = Math.min(1.0, elapsed * 1.5)
        groupRef.current.scale.set(1, growthProgress.current, 1)
      }

      if (boostSurge.current > 0) {
        boostSurge.current = Math.max(0, boostSurge.current - delta * 0.75)
        if (beaconMeshRef.current) {
          const s = 1.0 + boostSurge.current * 2.2
          beaconMeshRef.current.scale.set(s, s, s)
        }
      }

      const targetScale = isSelected ? 1.15 : hovered ? 1.08 : 1.0
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * Math.min(1, delta * 8)
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * Math.min(1, delta * 8)
    }

    // Horizon occlusion culling against spherical Earth
    if (crestContainerRef.current) {
      const camDist = state.camera.position.length()
      const cosAngle = normal.dot(state.camera.position) / camDist
      const safeD = Math.max(GLOBE_RADIUS + 0.1, camDist)
      const maxAngle = Math.acos(GLOBE_RADIUS / safeD) + Math.acos(GLOBE_RADIUS / (GLOBE_RADIUS + height))
      const cosCutoff = Math.cos(maxAngle) + 0.04
      const isVisible = cosAngle > cosCutoff
      crestContainerRef.current.style.opacity = isVisible ? '1' : '0'
      crestContainerRef.current.style.pointerEvents = isVisible ? 'auto' : 'none'
    }
  })

  const pointerDownPos = useRef({ x: 0, y: 0 })

  return (
    <group
      ref={groupRef}
      position={position}
      quaternion={quaternion}
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
      {/* Enlarged hit-target cylinder for raycast picking */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[towerWidth * 1.6, towerWidth * 1.6, height + 0.1, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. 3D SPONSOR BANNER TOWER */}
      <mesh
        position={[0, height / 2, 0]}
        material={materials}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[towerWidth, height, towerDepth]} />
      </mesh>

      {/* 2. EMISSIVE CORNER RAILS */}
      <mesh position={[towerWidth / 2, height / 2, towerDepth / 2]}>
        <boxGeometry args={[0.005, height, 0.005]} />
        <meshBasicMaterial color={sponsor.color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-towerWidth / 2, height / 2, towerDepth / 2]}>
        <boxGeometry args={[0.005, height, 0.005]} />
        <meshBasicMaterial color={sponsor.color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[towerWidth / 2, height / 2, -towerDepth / 2]}>
        <boxGeometry args={[0.005, height, 0.005]} />
        <meshBasicMaterial color={sponsor.color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-towerWidth / 2, height / 2, -towerDepth / 2]}>
        <boxGeometry args={[0.005, height, 0.005]} />
        <meshBasicMaterial color={sponsor.color} transparent opacity={0.8} />
      </mesh>

      {/* 3. ARCHITECTURAL ROOF CROWN & SIGNAGE MAST */}
      {/* Bevelled obsidian roof plate */}
      <mesh position={[0, height + 0.008, 0]}>
        <boxGeometry args={[towerWidth * 0.94, 0.016, towerDepth * 0.94]} />
        <meshStandardMaterial
          color="#0B0E15"
          metalness={0.9}
          roughness={0.2}
          emissive={sponsor.color}
          emissiveIntensity={hovered || isSelected ? 0.4 : 0.15}
        />
      </mesh>

      {/* Neon halo energy ring encircling roof mast */}
      <mesh position={[0, height + 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[Math.min(towerWidth, towerDepth) * 0.38, 0.0035, 8, 24]} />
        <meshBasicMaterial color={sponsor.color} transparent opacity={0.85} />
      </mesh>

      {/* Sleek vertical architectural sign pylon */}
      <mesh position={[0, height + 0.045, 0]}>
        <cylinderGeometry args={[0.006, 0.009, 0.07, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Optical beacon node with boost flare */}
      <mesh ref={beaconMeshRef} position={[0, height + 0.082, 0]}>
        <sphereGeometry args={[0.013, 12, 12]} />
        <meshBasicMaterial
          color={boostSurge.current > 0 ? '#FFFFFF' : hovered || isSelected ? '#FFFFFF' : sponsor.color}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* 4. BASE GROUND ILLUMINATION */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[towerWidth * 0.7, towerWidth * 1.8, 32]} />
        <meshBasicMaterial
          color={sponsor.color}
          transparent
          opacity={isSelected ? 0.75 : hovered ? 0.5 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. TOWER TIP SIGNAGE: SMALL LOGO BY DEFAULT, ENLARGED + COLLEGE NAME ON HOVER */}
      <Html
        position={[0, height + (hovered || isSelected ? 0.12 : 0.06), 0]}
        center
        zIndexRange={[10, 35]}
        className="pointer-events-auto select-none"
      >
        <div
          ref={crestContainerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
            hovered || isSelected ? 'scale-105 z-40' : 'scale-100 z-10'
          }`}
        >
          {hovered || isSelected ? (
            /* ENLARGED LOGO + VISIBLE COLLEGE NAME (ON HOVER / SELECTION) */
            <div
              className="px-3 py-2 rounded-xl border shadow-2xl flex items-center gap-2.5 transition-all duration-200 animate-in fade-in zoom-in-95"
              style={{
                backgroundColor: 'rgba(10, 14, 21, 0.96)',
                borderColor: sponsor.color,
                boxShadow: `0 8px 24px -2px rgba(0, 0, 0, 0.85), 0 0 16px -2px ${sponsor.color}55`
              }}
            >
              {/* Enlarged Company Logo Well */}
              <div
                className="w-8 h-8 rounded-lg bg-[#05070A] border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-inner"
                style={{
                  boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px ${sponsor.color}30`
                }}
              >
                <SponsorLogo
                  sponsorId={sponsor.id}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>

              {/* College Name & Telemetry */}
              <div className="flex flex-col text-left whitespace-nowrap min-w-0 pr-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white tracking-tight">
                    {campus.shortName}
                  </span>
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border"
                    style={{
                      backgroundColor: `${sponsor.color}20`,
                      color: sponsor.color,
                      borderColor: `${sponsor.color}40`
                    }}
                  >
                    {sponsor.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9.5px] text-text-muted font-mono mt-0.5">
                  <span className="font-bold text-emerald">
                    {Math.round(campus.allTimeKg).toLocaleString()} kg
                  </span>
                  <span>•</span>
                  <span>{campus.city}</span>
                </div>
              </div>
            </div>
          ) : (
            /* SMALL COMPANY LOGO AT TOWER TIP (BY DEFAULT) */
            <div
              className="w-7 h-7 rounded-lg border shadow-lg flex items-center justify-center p-1 transition-all duration-150 hover:scale-110"
              style={{
                backgroundColor: 'rgba(10, 14, 21, 0.94)',
                borderColor: `${sponsor.color}90`,
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.75), 0 0 8px ${sponsor.color}40`
              }}
            >
              <SponsorLogo
                sponsorId={sponsor.id}
                className="w-4 h-4 object-contain filter drop-shadow"
              />
            </div>
          )}

          {/* Downward Architectural Mounting Anchor Pip */}
          <div
            className="w-2 h-2 -mt-1 rotate-45 border-r border-b"
            style={{
              backgroundColor: '#0A0E15',
              borderColor: hovered || isSelected ? sponsor.color : `${sponsor.color}90`
            }}
          />
        </div>
      </Html>
    </group>
  )
}
