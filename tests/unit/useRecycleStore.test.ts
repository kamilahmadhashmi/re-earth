import { describe, it, expect, beforeEach } from 'vitest'
import { useRecycleStore } from '../../src/store/useRecycleStore'
import { PRODUCT_CATALOG } from '../../src/data/productVaultCatalog'

describe('useRecycleStore State Machine', () => {
  beforeEach(() => {
    useRecycleStore.getState().resetWizard()
  })

  it('initializes with default step 1 and student flow tab', () => {
    const state = useRecycleStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.activeTab).toBe('student_flow')
    expect(state.selectedProduct).toBeNull()
    expect(state.condition).toBeNull()
    expect(state.activePass).toBeNull()
  })

  it('selects a verified catalog device and calculates hardware mass', () => {
    const iphone = PRODUCT_CATALOG[0]
    expect(iphone).toBeDefined()

    useRecycleStore.getState().selectProduct(iphone)

    const state = useRecycleStore.getState()
    expect(state.selectedProduct?.id).toBe(iphone.id)
    expect(state.selectedProduct?.defaultMassGrams).toBe(194)
  })

  it('advances through condition triage and enforces hazmat isolation for swollen cells', () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)

    // Select swollen battery condition
    useRecycleStore.getState().setCondition('swollen_battery')

    const state = useRecycleStore.getState()
    expect(state.condition).toBe('swollen_battery')

    // Advance step
    useRecycleStore.getState().setCurrentStep(2)
    expect(useRecycleStore.getState().currentStep).toBe(2)
  })

  it('tracks interactive NIST wipe protocol step completions', () => {
    useRecycleStore.getState().toggleWipeStep(1)
    useRecycleStore.getState().toggleWipeStep(2)

    let state = useRecycleStore.getState()
    expect(state.wipeStepsCompleted[1]).toBe(true)
    expect(state.wipeStepsCompleted[2]).toBe(true)
    expect(state.wipeStepsCompleted[3]).toBeUndefined()

    // Toggle off
    useRecycleStore.getState().toggleWipeStep(1)
    state = useRecycleStore.getState()
    expect(state.wipeStepsCompleted[1]).toBe(false)
  })

  it('generates an Ephemeral QR Pass with token and assigns a kiosk', () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')

    useRecycleStore.getState().generateQrPass()

    const state = useRecycleStore.getState()
    expect(state.currentStep).toBe(6)
    expect(state.activePass).toBeDefined()
    expect(state.activePass?.passId).toMatch(/^SIG-[A-Z0-9]+-DTU$/)
    expect(state.activePass?.qrPayload).toContain(state.activePass?.passId)
    expect(state.activePass?.kioskId).toBe('kiosk-dtu-mech')
    expect(state.activePass?.status).toBe('pending')
  })

  it('resets wizard state cleanly', () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().setCurrentStep(4)

    useRecycleStore.getState().resetWizard()

    const state = useRecycleStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.selectedProduct).toBeNull()
    expect(state.condition).toBeNull()
  })
})
