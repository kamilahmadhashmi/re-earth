import type { RankedSponsor } from '../shared/ranking'

export interface TreeSpatialConfig {
  sponsorId: string
  name: string
  rank: number
  position: [number, number, number]
  treeHeight: number
  trunkBaseRadius: number
  trunkCrownRadius: number
  canopyRadius: number
  canopyHeight: number
  baseMoundRadius: number
  color: string
  accentColor: string
}

export interface TreeClearancePair {
  sponsorA: string
  sponsorB: string
  distance: number
  sumRadii: number
  clearanceMargin: number
  isSafe: boolean
}

export interface SpatialValidationResult {
  isValid: boolean
  minDistance: number
  maxCanopyRadius: number
  minClearanceMargin: number
  pairs: TreeClearancePair[]
  totalPairsChecked: number
}

// Minimum allowable clearance margin between outermost canopy radii
export const MIN_REQUIRED_CLEARANCE_MARGIN = 1.0

/**
 * Computes deterministic, strictly separated spatial configurations for all sponsor trees.
 * Ensures zero overlap between trunks, branches, canopies, roots, and grass bases.
 */
export function computeCyberneticTreeLayout(
  sponsors: RankedSponsor[],
  gridSpacing = 5.2
): TreeSpatialConfig[] {
  // Sort by rank to maintain consistent visual hierarchy
  const sorted = [...sponsors].sort((a, b) => a.rank - b.rank)

  return sorted.map((sponsor, index) => {
    // 3x3 spacious matrix arrangement (col: -1, 0, 1; row: -1, 0, 1)
    // index 0..7 cleanly distributed with ample breathing room
    const row = Math.floor(index / 3) - 1
    const col = (index % 3) - 1

    const posX = col * gridSpacing
    const posZ = row * gridSpacing

    // Height scaled gracefully by rank and total kg:
    // Tallest ~3.7 units (#1), down to ~2.5 units (#8)
    const normalizedRank = Math.max(0, Math.min(1, (8 - sponsor.rank) / 7))
    const treeHeight = 2.45 + normalizedRank * 1.25

    // Strict canopy radius constraints:
    // Clamped strictly between 1.15 and 1.42 units
    const canopyRadius = 1.18 + normalizedRank * 0.22
    const canopyHeight = 1.35 + normalizedRank * 0.45

    // Base root and grass footprint:
    // Strictly limited to 0.85 units, far smaller than the grid clearance
    const baseMoundRadius = 0.82
    const trunkBaseRadius = 0.16 + normalizedRank * 0.04
    const trunkCrownRadius = 0.06 + normalizedRank * 0.02

    return {
      sponsorId: sponsor.id,
      name: sponsor.name,
      rank: sponsor.rank,
      position: [posX, 0, posZ],
      treeHeight,
      trunkBaseRadius,
      trunkCrownRadius,
      canopyRadius,
      canopyHeight,
      baseMoundRadius,
      color: sponsor.color,
      accentColor: sponsor.accentColor
    }
  })
}

/**
 * Programmatically validates that every single pair of trees satisfies:
 *   d_ij >= r_i + r_j + margin
 * Returns a complete verification report.
 */
export function validateTreeClearances(
  configs: TreeSpatialConfig[],
  requiredMargin = MIN_REQUIRED_CLEARANCE_MARGIN
): SpatialValidationResult {
  const pairs: TreeClearancePair[] = []
  let isValid = true
  let minDistance = Infinity
  let minClearanceMargin = Infinity
  let maxCanopyRadius = 0

  for (let i = 0; i < configs.length; i++) {
    const a = configs[i]
    if (a.canopyRadius > maxCanopyRadius) {
      maxCanopyRadius = a.canopyRadius
    }

    for (let j = i + 1; j < configs.length; j++) {
      const b = configs[j]

      const dx = a.position[0] - b.position[0]
      const dz = a.position[2] - b.position[2]
      const distance = Math.hypot(dx, dz)
      const sumRadii = a.canopyRadius + b.canopyRadius
      const clearanceMargin = distance - sumRadii

      const isSafe = clearanceMargin >= requiredMargin
      if (!isSafe) {
        isValid = false
      }

      if (distance < minDistance) {
        minDistance = distance
      }
      if (clearanceMargin < minClearanceMargin) {
        minClearanceMargin = clearanceMargin
      }

      pairs.push({
        sponsorA: a.name,
        sponsorB: b.name,
        distance: parseFloat(distance.toFixed(3)),
        sumRadii: parseFloat(sumRadii.toFixed(3)),
        clearanceMargin: parseFloat(clearanceMargin.toFixed(3)),
        isSafe
      })
    }
  }

  return {
    isValid,
    minDistance: parseFloat(minDistance.toFixed(3)),
    maxCanopyRadius: parseFloat(maxCanopyRadius.toFixed(3)),
    minClearanceMargin: parseFloat(minClearanceMargin.toFixed(3)),
    pairs,
    totalPairsChecked: pairs.length
  }
}
