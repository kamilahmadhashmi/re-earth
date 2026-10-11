import type { RecEarthApi } from './apiTypes'
export type { RecEarthApi }

// Global API instance selector (uses mockApi in Phase 1, ready for AWS hook)
export async function getApiClient(): Promise<RecEarthApi> {
  const { mockApi } = await import('./mockApi')
  return mockApi
}
