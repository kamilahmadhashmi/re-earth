import { describe, it, expect } from 'vitest'
import { useWorldStore } from '../../src/store/useWorldStore'

describe('useWorldStore State Machine', () => {
  it('manages routing transitions between world and sponsor portal', () => {
    useWorldStore.getState().navigateToSponsor('global_impact')
    let state = useWorldStore.getState()
    expect(state.currentRoute).toBe('sponsor')
    expect(state.sponsorTierPrefill).toBe('global_impact')

    useWorldStore.getState().navigateToWorld()
    state = useWorldStore.getState()
    expect(state.currentRoute).toBe('world')
  })

  it('manages modal lifecycle and single active modal enforcement', () => {
    useWorldStore.getState().openModal('recycle')
    expect(useWorldStore.getState().activeModal).toBe('recycle')

    useWorldStore.getState().openModal('vault')
    expect(useWorldStore.getState().activeModal).toBe('vault')

    useWorldStore.getState().openModal(null)
    expect(useWorldStore.getState().activeModal).toBeNull()
  })

  it('toggles view modes between globe and skyline', () => {
    useWorldStore.getState().setViewMode('skyline')
    expect(useWorldStore.getState().viewMode).toBe('skyline')

    useWorldStore.getState().setViewMode('globe')
    expect(useWorldStore.getState().viewMode).toBe('globe')
  })

  it('updates selected campus and sponsor filtering', () => {
    useWorldStore.getState().selectCampus('dtu')
    expect(useWorldStore.getState().selectedCampusId).toBe('dtu')

    useWorldStore.getState().selectSponsor('tcs')
    expect(useWorldStore.getState().selectedSponsorId).toBe('tcs')
  })
})
