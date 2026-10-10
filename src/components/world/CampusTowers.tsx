import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { RankedCampus } from '../../shared/ranking'
import { geoToVector3, geoOrientation, GLOBE_RADIUS } from '../../utils/geo'
import { SPONSOR_MAP } from '../../data/sponsors'
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

  const sponsor = useMemo(() => {
    return SPONSOR_MAP.get(cluster.dominantSponsorId) || SPONSOR_MAP.get('google')!
  }, [cluster.dominantSponsorId])

  const quat = useMemo(() => {
    return geoOrientation(cluster.centerLat, cluster.centerLng)
  }, [cluster.centerLat, cluster.centerLng])

  const pointerDownPos = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle hovering breathing pulse
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.05
      groupRef.current.scale.setScalar(hovered ? 1.25 : pulse)
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
        <sphereGeometry args={[0.18, 16, 16]} />
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

      {/* Floating Apple Spatial Hub Badge (Shown on hover for clean globe clarity) */}
      {hovered && (
        <Html
          position={[0, 0.22, 0]}
          center
          distanceFactor={9.5}
          className="pointer-events-none select-none transition-all duration-200"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border shadow-spatial scale-105"
            style={{
              backgroundColor: 'rgba(11, 15, 20, 0.94)',
              borderColor: `${sponsor.color}88`,
              boxShadow: `0 4px 16px ${sponsor.color}33`
            }}
          >
            {/* Hub Count Circle */}
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold text-[9px] text-white"
              style={{ backgroundColor: sponsor.color }}
            >
              {cluster.campuses.length}
            </span>
            <span className="text-[11px] font-bold text-white tracking-tight">
              {cluster.campuses[0].city} Cluster
            </span>
          </div>
        </Html>
      )}
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

      {/* 3. ROOFTOP BEACON WITH REACTIVE BOOST FLARE */}
      <mesh ref={beaconMeshRef} position={[0, height + 0.02, 0]}>
        <sphereGeometry args={[0.022, 16, 16]} />
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

      {/* 5. DISTANCE-FADING CAMPUS & SPONSOR BADGE LABEL (Shown on hover or selection for pristine visual clarity) */}
      {(hovered || isSelected) && (
        <Html
          position={[0, height + 0.14, 0]}
          center
          distanceFactor={9.5}
          className="pointer-events-none select-none transition-all duration-300"
        >
          <div
            className={`flex flex-col items-center whitespace-nowrap transition-transform duration-200 ${
              isSelected ? 'scale-110 z-30' : 'scale-100'
            }`}
          >
            <div
              className="px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border text-[11px] font-semibold shadow-spatial"
              style={{
                backgroundColor: '#131922',
                borderColor: `${sponsor.color}88`,
                color: '#FFFFFF'
              }}
            >
              <span
                className="font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase"
                style={{
                  backgroundColor: `${sponsor.color}25`,
                  color: sponsor.color
                }}
              >
                {sponsor.logoText}
              </span>
              <span>{campus.shortName}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
