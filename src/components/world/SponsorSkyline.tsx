import React, { useMemo } from 'react'
import { Sparkles } from '@react-three/drei'
import type { RankedSponsor } from '../../shared/ranking'
import { CyberneticTree } from './CyberneticTree'
import {
  computeCyberneticTreeLayout,
  validateTreeClearances
} from '../../utils/treeSpatialLayout'

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
  // Compute deterministic, collision-free spatial layout and validate clearances
  const { treeConfigs, validationReport } = useMemo(() => {
    const configs = computeCyberneticTreeLayout(sponsors, 5.2)
    const report = validateTreeClearances(configs, 1.0)
    
    if (import.meta.env.DEV) {
      console.log(
        `[Cybernetic Forest] 0-Overlap Validation: ${report.isValid ? 'PASSED' : 'FAILED'} (Min clearance: ${report.minClearanceMargin} units across ${report.totalPairsChecked} pairs)`
      )
    }
    return { treeConfigs: configs, validationReport: report }
  }, [sponsors])

  return (
    <group position={[0, -1.0, 0]}>
      {/* 1. Forest Glade Ground Substrate & Tech Grid */}
      <gridHelper args={[32, 32, '#10B981', '#1E293B']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[38, 38]} />
        <meshStandardMaterial
          color="#06090D"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Soft Bioluminescent Forest Spores & Ambient Motes */}
      <Sparkles
        count={50}
        scale={[18, 6, 18]}
        position={[0, 2.5, 0]}
        size={2.2}
        speed={0.35}
        opacity={0.45}
        color="#10B981"
      />
      <Sparkles
        count={28}
        scale={[18, 6, 18]}
        position={[0, 2.5, 0]}
        size={2.6}
        speed={0.25}
        opacity={0.38}
        color="#38BDF8"
      />

      {/* 3. Cybernetic Forest Trees with Zero Overlapping Canopies */}
      {treeConfigs.map((config) => {
        const sponsor = sponsors.find((s) => s.id === config.sponsorId)
        if (!sponsor) return null

        return (
          <CyberneticTree
            key={sponsor.id}
            sponsor={sponsor}
            config={config}
            isSelected={selectedSponsorId === sponsor.id}
            onSelect={() => onSelectSponsor(sponsor.id)}
          />
        )
      })}
    </group>
  )
}

export default SponsorSkyline
