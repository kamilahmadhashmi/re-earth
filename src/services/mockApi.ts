import type { RecEarthApi } from './apiTypes'
import { INITIAL_CAMPUSES, type Campus } from '../data/campuses'
import { SPONSORS } from '../data/sponsors'
import {
  computeCampusRankings,
  computeSponsorRankings,
  type RankedCampus,
  type RankedSponsor
} from '../shared/ranking'

const STORAGE_KEY = 're_earth_campuses_v1'

function loadCampuses(): Campus[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length === INITIAL_CAMPUSES.length) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to load campuses from localStorage', err)
  }
  return [...INITIAL_CAMPUSES]
}

function saveCampuses(campuses: Campus[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campuses))
  } catch (err) {
    console.error('Failed to save campuses to localStorage', err)
  }
}

let inMemoryCampuses: Campus[] = loadCampuses()

export const mockApi: RecEarthApi = {
  async getCampuses(): Promise<Campus[]> {
    return [...inMemoryCampuses]
  },

  async getLeaderboard(): Promise<RankedCampus[]> {
    return computeCampusRankings(inMemoryCampuses)
  },

  async getSponsors(): Promise<RankedSponsor[]> {
    return computeSponsorRankings(SPONSORS, inMemoryCampuses)
  },

  async boostCampus(campusId: string, kgDelta = 250): Promise<{
    campuses: RankedCampus[]
    boostedCampus: RankedCampus
    previousRank: number
    newRank: number
  }> {
    const previousRankings = computeCampusRankings(inMemoryCampuses)
    const targetPrev = previousRankings.find((c) => c.id === campusId)
    const previousRank = targetPrev ? targetPrev.allTimeRank : 18

    // Update raw kg in state
    inMemoryCampuses = inMemoryCampuses.map((c) => {
      if (c.id === campusId) {
        return {
          ...c,
          allTimeKg: parseFloat((c.allTimeKg + kgDelta).toFixed(1)),
          weeklyKg: parseFloat((c.weeklyKg + kgDelta).toFixed(1))
        }
      }
      return c
    })

    saveCampuses(inMemoryCampuses)

    const updatedRankings = computeCampusRankings(inMemoryCampuses)
    const boostedCampus = updatedRankings.find((c) => c.id === campusId)!
    const newRank = boostedCampus.allTimeRank

    return {
      campuses: updatedRankings,
      boostedCampus,
      previousRank,
      newRank
    }
  },

  async resetDemo(): Promise<void> {
    inMemoryCampuses = [...INITIAL_CAMPUSES]
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }
}
