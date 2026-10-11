import type { RankedCampus, RankedSponsor } from '../shared/ranking'
import type { Campus } from '../data/campuses'

export interface RecEarthApi {
  getCampuses(): Promise<Campus[]>
  getLeaderboard(): Promise<RankedCampus[]>
  getSponsors(): Promise<RankedSponsor[]>
  boostCampus(campusId: string, kgDelta?: number): Promise<{
    campuses: RankedCampus[]
    boostedCampus: RankedCampus
    previousRank: number
    newRank: number
  }>
  resetDemo(): Promise<void>
}
