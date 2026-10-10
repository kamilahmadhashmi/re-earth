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

    // Dynamic kg-based height scaling:
    // Extract min/max kg across the sponsor pool to ensure maximum dynamic range
    const kgValues = sponsors
      .map((s) => s.totalKg)
      .filter((k): k is number => typeof k === 'number' && !isNaN(k) && k > 0)
    const minKg = kgValues.length > 0 ? Math.min(...kgValues) : 4000
    const maxKg = kgValues.length > 0 ? Math.max(...kgValues) : 27000
    const rangeKg = maxKg - minKg

    // Normalized weight factor strictly bounded between 0.0 (lowest kg) and 1.0 (highest kg)
    const normalizedKg =
      rangeKg > 0 && typeof sponsor.totalKg === 'number'
        ? Math.max(0, Math.min(1, (sponsor.totalKg - minKg) / rangeKg))
        : Math.max(0, Math.min(1, (8 - sponsor.rank) / 7))

    // Height scaled dramatically by kg contributed:
    // Minimum height ~1.35 units (Tesla ~4.6k kg), up to ~5.60 units (Google ~27k kg)
    // Over a 4.1x visual height variance makes the kg contribution immediately, dramatically visible
    const MIN_TREE_HEIGHT = 1.35
    const MAX_TREE_HEIGHT = 5.60
    const treeHeight = MIN_TREE_HEIGHT + normalizedKg * (MAX_TREE_HEIGHT - MIN_TREE_HEIGHT)

    // Strict canopy radius constraints scaled proportionally with height:
    // Clamped strictly between 0.95 and 1.45 units (guarantees >= 2.3 units clearance in 5.2m grid)
    const canopyRadius = 0.95 + normalizedKg * 0.50
    const canopyHeight = 0.90 + normalizedKg * 1.50

    // Base root and grass footprint scaled gracefully with trunk thickness
    const baseMoundRadius = 0.72 + normalizedKg * 0.16
    const trunkBaseRadius = 0.10 + normalizedKg * 0.12
    const trunkCrownRadius = 0.04 + normalizedKg * 0.045

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
