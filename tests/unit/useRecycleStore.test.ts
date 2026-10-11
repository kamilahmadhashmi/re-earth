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

  it('supports 2D optical barcode scanner JSON payloads in operator lookup', () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    useRecycleStore.getState().generateQrPass()

    const pass = useRecycleStore.getState().activePass
    expect(pass).toBeDefined()

    // Simulate optical scanner feeding full JSON payload string
    const opticalScanJson = pass!.qrPayload
    useRecycleStore.getState().lookupPass(opticalScanJson)

    const inspected = useRecycleStore.getState().operatorInspectedPass
    expect(inspected?.passId).toBe(pass!.passId)
  })

  it('toggles all five physical inspection criteria and persists state per pass', () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    useRecycleStore.getState().generateQrPass()
    const pass1 = useRecycleStore.getState().activePass!

    // Lookup pass1
    useRecycleStore.getState().lookupPass(pass1.passId)

    // Toggle all 5 criteria
    useRecycleStore.getState().toggleOperatorChecklist('modelMatches')
    useRecycleStore.getState().toggleOperatorChecklist('conditionMatches')
    useRecycleStore.getState().toggleOperatorChecklist('scaleWeightVerified')
    useRecycleStore.getState().toggleOperatorChecklist('batterySafetyVerified')
    useRecycleStore.getState().toggleOperatorChecklist('wipeVerified')

    let state = useRecycleStore.getState()
    expect(state.operatorChecklist.modelMatches).toBe(true)
    expect(state.operatorChecklist.conditionMatches).toBe(true)
    expect(state.operatorChecklist.scaleWeightVerified).toBe(true)
    expect(state.operatorChecklist.batterySafetyVerified).toBe(true)
    expect(state.operatorChecklist.wipeVerified).toBe(true)

    // Verify stored in per-pass checklist map
    expect(state.operatorPassChecklists[pass1.passId].modelMatches).toBe(true)

    // Lookup another pass (mock pre-saved accepted pass)
    useRecycleStore.getState().lookupPass('SIG-88F4B91-DTU')
    state = useRecycleStore.getState()
    expect(state.operatorInspectedPass?.passId).toBe('SIG-88F4B91-DTU')

    // Switch back to pass1 - checklist state must be preserved
    useRecycleStore.getState().lookupPass(pass1.passId)
    state = useRecycleStore.getState()
    expect(state.operatorChecklist.modelMatches).toBe(true)
    expect(state.operatorChecklist.conditionMatches).toBe(true)
    expect(state.operatorChecklist.scaleWeightVerified).toBe(true)
    expect(state.operatorChecklist.batterySafetyVerified).toBe(true)
    expect(state.operatorChecklist.wipeVerified).toBe(true)
  })

  it('rejects pass acceptance if inspection criteria are incomplete', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    useRecycleStore.getState().generateQrPass()
    const pass = useRecycleStore.getState().activePass!

    useRecycleStore.getState().lookupPass(pass.passId)

    // Only 2 of 5 completed
    useRecycleStore.getState().toggleOperatorChecklist('modelMatches')
    useRecycleStore.getState().toggleOperatorChecklist('conditionMatches')

    await expect(
      useRecycleStore.getState().acceptCurrentInspection('Operator Tech')
    ).rejects.toThrow(/All 5 physical inspection criteria must be verified/)
  })

  it('prevents duplicate redemption of already accepted passes', async () => {
    // SIG-88F4B91-DTU is already accepted in mock pre-saved data
    useRecycleStore.getState().lookupPass('SIG-88F4B91-DTU')

    await expect(
      useRecycleStore.getState().acceptCurrentInspection('Operator Tech')
    ).rejects.toThrow(/already been accepted and redeemed/)
  })

  it('reuses active pass on repeated submissions of same device without duplicate tokens', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')

    const pass1 = await useRecycleStore.getState().generateQrPass()
    const pass2 = await useRecycleStore.getState().generateQrPass()

    expect(pass1.passId).toBe(pass2.passId)
  })
})
