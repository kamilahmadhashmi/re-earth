import { create } from 'zustand'
import { PRODUCT_CATALOG, type ProductRecord, type DeviceCategory } from '../data/productVaultCatalog'
import { CAMPUS_KIOSKS, type CampusKiosk } from '../data/kiosks'
import { useWorldStore } from './useWorldStore'
import { useAuthStore } from './useAuthStore'

export type ConditionTriage = 'mint' | 'cracked' | 'dead' | 'swollen_battery'

export interface CustomDeviceEntry {
  manufacturer: string
  model: string
  variant: string
  category: DeviceCategory
  estimatedMassGrams: number
  batteryType: 'Lithium-ion' | 'Lithium-polymer' | 'NiMH' | 'Lead-acid' | 'None (Mains Powered)'
  notes: string
}

export interface EphemeralPassReceipt {
  acceptedAt: string
  operatorName: string
  kioskId: string
  kioskName: string
  campusId: string
  campusName: string
  verifiedWeightGrams: number
  scaleVariancePercent: number
  awardedEcoCredits: number
  awardedXp: number
  kgAddedToCampus: number
  certificateId: string
  digitalSignature: string
}

export interface EphemeralPassRejection {
  rejectedAt: string
  operatorName: string
  kioskId: string
  reason: string
  notes: string
}

export interface EphemeralPass {
  passId: string
  timestamp: number
  expiresAt: number
  productId?: string
  customProduct?: CustomDeviceEntry
  productName: string
  manufacturer: string
  variant: string
  category: DeviceCategory
  condition: ConditionTriage
  declaredMassGrams: number
  isHazmat: boolean
  dataWipeConfirmed: boolean
  dataWipeException: boolean
  kioskId: string
  kioskName: string
  campusId: string
  campusName: string
  turfMultiplier: number
  estimatedCo2eKg: number
  projectedEcoCredits: number
  projectedXp: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  qrPayload: string
  // Submitter identity for role-based privacy & admin audits
  userId?: string
  studentName?: string
  studentRollNo?: string
  department?: string
  receipt?: EphemeralPassReceipt
  rejection?: EphemeralPassRejection
}

export type MascotMood =
  | 'welcome'
  | 'curious'
  | 'evaluating'
  | 'alert_hazard'
  | 'eco_impact'
  | 'security_wipe'
  | 'kiosk_routing'
  | 'celebrating'
  | 'operator_scan'

export type RecycleModuleTab = 'student_flow' | 'kiosk_terminal' | 'tech_vault' | 'sponsorships'

interface RecycleStoreState {
  // Navigation & View Mode
  activeTab: RecycleModuleTab
  currentStep: number // 1 to 6
  isManualEntryOpen: boolean

  // Stage 1: Product Selection
  searchQuery: string
  categoryFilter: DeviceCategory | 'all'
  selectedProduct: ProductRecord | null
  customProduct: CustomDeviceEntry | null

  // Stage 2: Condition Assessment
  condition: ConditionTriage | null

  // Stage 3: Hazardous Materials & Measured Mass
  measuredMassGrams: number
  isCustomMassEntered: boolean

  // Stage 4: Data-Wipe Protocol
  wipeStepsCompleted: Record<number, boolean>
  wipeExceptionRequested: boolean
  wipeFinalConfirmed: boolean

  // Stage 5: Campus Kiosk Selection
  selectedKioskId: string | null

  // Stage 6: Ephemeral QR Pass
  activePass: EphemeralPass | null
  savedPasses: EphemeralPass[]

  // Mascot State
  mascotMood: MascotMood
  mascotMessage: string

  // Kiosk Operator Terminal State
  operatorInputToken: string
  operatorInspectedPass: EphemeralPass | null
  operatorChecklist: {
    modelMatches: boolean
    conditionMatches: boolean
    scaleWeightVerified: boolean
    batterySafetyVerified: boolean
    wipeVerified: boolean
  }
  simulatedScaleGrams: number
  operatorRejectionReason: string
  operatorRejectionNotes: string

  // Actions
  setActiveTab: (tab: RecycleModuleTab) => void
  setCurrentStep: (step: number) => void
  setSearchQuery: (query: string) => void
  setCategoryFilter: (cat: DeviceCategory | 'all') => void
  selectProduct: (prod: ProductRecord | null) => void
  setCustomProduct: (custom: CustomDeviceEntry | null) => void
  setManualEntryOpen: (open: boolean) => void
  setCondition: (cond: ConditionTriage) => void
  setMeasuredMassGrams: (grams: number) => void
  toggleWipeStep: (stepNumber: number) => void
  setWipeExceptionRequested: (val: boolean) => void
  setWipeFinalConfirmed: (val: boolean) => void
  selectKiosk: (kioskId: string) => void
  generateQrPass: () => Promise<EphemeralPass>
  resetWizard: () => void

  // Operator Actions
  setOperatorInputToken: (token: string) => void
  lookupPass: (passId: string) => void
  toggleOperatorChecklist: (key: keyof RecycleStoreState['operatorChecklist']) => void
  setSimulatedScaleGrams: (grams: number) => void
  setOperatorRejectionReason: (reason: string) => void
  setOperatorRejectionNotes: (notes: string) => void
  acceptCurrentInspection: (operatorName?: string) => Promise<boolean>
  rejectCurrentInspection: (operatorName?: string) => Promise<boolean>
}

const PASSES_STORAGE_KEY = 're_earth_recycle_passes_v2'

function loadSavedPasses(): EphemeralPass[] {
  try {
    const raw = localStorage.getItem(PASSES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('Failed to parse saved passes', err)
  }

  // Seed with realistic demo completed submissions across multiple students
  // to rigorously test student privacy isolation and admin oversight
  return [
    {
      passId: 'SIG-88F4B91-DTU',
      timestamp: Date.now() - 3600000 * 24 * 2,
      expiresAt: Date.now() - 3600000 * 24 * 2 + 900000,
      productId: 'prod-iphone-11-64',
      productName: 'iPhone 11',
      manufacturer: 'Apple',
      variant: '64GB (A2111)',
      category: 'smartphones',
      condition: 'cracked',
      declaredMassGrams: 194,
      isHazmat: false,
      dataWipeConfirmed: true,
      dataWipeException: false,
      kioskId: 'kiosk-dtu-mech',
      kioskName: 'DTU Mechanical Block Kiosk',
      campusId: 'dtu',
      campusName: 'Delhi Technological University',
      turfMultiplier: 1.5,
      estimatedCo2eKg: 72.0,
      projectedEcoCredits: 180,
      projectedXp: 225,
      status: 'accepted',
      userId: 'usr_student_dtu_01',
      studentName: 'Aarav Sharma',
      studentRollNo: '2023/EE/042',
      department: 'Electrical Engineering',
      qrPayload: JSON.stringify({
        ref: 'SIG-88F4B91-DTU',
        prod: 'iPhone 11',
        kiosk: 'kiosk-dtu-mech',
        status: 'accepted'
      }),
      receipt: {
        acceptedAt: new Date(Date.now() - 3600000 * 24 * 2).toLocaleString(),
        operatorName: 'Arun Verma (Lead Lab Tech)',
        kioskId: 'kiosk-dtu-mech',
        kioskName: 'DTU Mechanical Block Kiosk',
        campusId: 'dtu',
        campusName: 'Delhi Technological University',
        verifiedWeightGrams: 192.8,
        scaleVariancePercent: -0.6,
        awardedEcoCredits: 180,
        awardedXp: 225,
        kgAddedToCampus: 0.194,
        certificateId: 'REC-DTU-2026-0941',
        digitalSignature: 'SHA256:7B8C24D9E9F01A4B'
      }
    },
    {
      passId: 'SIG-39A7C12-NSUT',
      timestamp: Date.now() - 3600000 * 24 * 5,
      expiresAt: Date.now() - 3600000 * 24 * 5 + 900000,
      productId: 'prod-mb-air-m1',
      productName: 'MacBook Air M1',
      manufacturer: 'Apple',
      variant: '256GB / 8GB Unified',
      category: 'laptops',
      condition: 'mint',
      declaredMassGrams: 1290,
      isHazmat: false,
      dataWipeConfirmed: true,
      dataWipeException: false,
      kioskId: 'kiosk-nsut-admin',
      kioskName: 'NSUT Main Admin Quad Kiosk',
      campusId: 'nsut',
      campusName: 'Netaji Subhas University of Technology',
      turfMultiplier: 1.2,
      estimatedCo2eKg: 165.0,
      projectedEcoCredits: 520,
      projectedXp: 680,
      status: 'accepted',
      userId: 'usr_student_nsut_02',
      studentName: 'Priya Verma',
      studentRollNo: '2023/CS/118',
      department: 'Computer Science',
      qrPayload: JSON.stringify({
        ref: 'SIG-39A7C12-NSUT',
        prod: 'MacBook Air M1',
        kiosk: 'kiosk-nsut-admin',
        status: 'accepted'
      }),
      receipt: {
        acceptedAt: new Date(Date.now() - 3600000 * 24 * 5).toLocaleString(),
        operatorName: 'Deepak Joshi (Kiosk Operator)',
        kioskId: 'kiosk-nsut-admin',
        kioskName: 'NSUT Main Admin Quad Kiosk',
        campusId: 'nsut',
        campusName: 'Netaji Subhas University of Technology',
        verifiedWeightGrams: 1292.0,
        scaleVariancePercent: 0.15,
        awardedEcoCredits: 520,
        awardedXp: 680,
        kgAddedToCampus: 1.29,
        certificateId: 'REC-NSUT-2026-0318',
        digitalSignature: 'SHA256:4C9F10A38E221DB7'
      }
    },
    {
      passId: 'SIG-21F5D88-DTU',
      timestamp: Date.now() - 3600000 * 18,
      expiresAt: Date.now() - 3600000 * 18 + 900000,
      productId: 'prod-sony-wh1000xm4',
      productName: 'Sony WH-1000XM4',
      manufacturer: 'Sony',
      variant: 'Wireless ANC Black',
      category: 'audio',
      condition: 'dead',
      declaredMassGrams: 254,
      isHazmat: false,
      dataWipeConfirmed: true,
      dataWipeException: false,
      kioskId: 'kiosk-dtu-mech',
      kioskName: 'DTU Mechanical Block Kiosk',
      campusId: 'dtu',
      campusName: 'Delhi Technological University',
      turfMultiplier: 1.5,
      estimatedCo2eKg: 32.5,
      projectedEcoCredits: 120,
      projectedXp: 150,
      status: 'pending',
      userId: 'usr_student_dtu_01',
      studentName: 'Aarav Sharma',
      studentRollNo: '2023/EE/042',
      department: 'Electrical Engineering',
      qrPayload: JSON.stringify({
        ref: 'SIG-21F5D88-DTU',
        prod: 'Sony WH-1000XM4',
        kiosk: 'kiosk-dtu-mech',
        status: 'pending'
      })
    }
  ]
}

function savePassesToStorage(passes: EphemeralPass[]) {
  try {
    localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(passes))
  } catch (err) {
    console.error('Failed to save passes to localStorage', err)
  }
}

export const useRecycleStore = create<RecycleStoreState>((set, get) => ({
  activeTab: 'student_flow',
  currentStep: 1,
  isManualEntryOpen: false,

  searchQuery: '',
  categoryFilter: 'all',
  selectedProduct: null,
  customProduct: null,

  condition: null,
  measuredMassGrams: 194,
  isCustomMassEntered: false,

  wipeStepsCompleted: {},
  wipeExceptionRequested: false,
  wipeFinalConfirmed: false,

  selectedKioskId: 'kiosk-dtu-mech',
  activePass: null,
  savedPasses: loadSavedPasses(),

  mascotMood: 'welcome',
  mascotMessage: "Hi! I'm Volt, your circular tech guide. Let's find your device in the vault!",

  operatorInputToken: '',
  operatorInspectedPass: null,
  operatorChecklist: {
    modelMatches: false,
    conditionMatches: false,
    scaleWeightVerified: false,
    batterySafetyVerified: false,
    wipeVerified: false
  },
  simulatedScaleGrams: 194.0,
  operatorRejectionReason: 'mismatch_model',
  operatorRejectionNotes: '',

  setActiveTab: (activeTab) => {
    set({ activeTab })
    if (activeTab === 'kiosk_terminal') {
      set({
        mascotMood: 'operator_scan',
        mascotMessage: 'Kiosk Terminal Online. Scan a student pass or enter token to begin physical inspection.'
      })
    } else if (activeTab === 'tech_vault') {
      set({
        mascotMood: 'celebrating',
        mascotMessage: 'Welcome to your Tech Vault! Here are all verified drop-offs and environmental certificates.'
      })
    }
  },

  setCurrentStep: (currentStep) => {
    const { condition, selectedProduct } = get()
    let mood: MascotMood = 'curious'
    let message = "Let's keep going!"

    if (currentStep === 1) {
      mood = 'welcome'
      message = "Search your device or pick a category above. I'll automatically fetch its specs!"
    } else if (currentStep === 2) {
      mood = condition === 'swollen_battery' ? 'alert_hazard' : 'evaluating'
      message = condition === 'swollen_battery'
        ? "⚠️ Safety Alert! Punctured or swollen batteries are dangerous. I'll lock out standard bins!"
        : "How is the physical state of your device? Honest condition helps determine reuse vs parts recycling."
    } else if (currentStep === 3) {
      mood = 'eco_impact'
      message = `Look at the impact! Diverting this ${selectedProduct?.model || 'device'} keeps hazardous e-waste out of landfills!`
    } else if (currentStep === 4) {
      mood = 'security_wipe'
      message = "Your privacy is paramount! Follow each wipe step to ensure your personal accounts are sanitized."
    } else if (currentStep === 5) {
      mood = 'kiosk_routing'
      message = "Choose an authorized collection pod. Check out the turf multiplier bonus for your college!"
    } else if (currentStep === 6) {
      mood = 'celebrating'
      message = "Your Ephemeral QR Pass is active! Present this screen at the campus kiosk optical scanner."
    }

    set({ currentStep, mascotMood: mood, mascotMessage: message })
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),

  selectProduct: (selectedProduct) => {
    if (!selectedProduct) {
      set({
        selectedProduct: null,
        measuredMassGrams: 0,
        wipeStepsCompleted: {},
        wipeFinalConfirmed: false
      })
      return
    }

    set({
      selectedProduct,
      customProduct: null,
      measuredMassGrams: selectedProduct.defaultMassGrams,
      isCustomMassEntered: false,
      wipeStepsCompleted: {},
      wipeFinalConfirmed: false,
      mascotMood: 'curious',
      mascotMessage: `Great choice! Found ${selectedProduct.manufacturer} ${selectedProduct.model} (${selectedProduct.defaultMassGrams}g). Let's check its condition!`
    })
  },

  setCustomProduct: (customProduct) => {
    if (!customProduct) return
    set({
      customProduct,
      selectedProduct: null,
      measuredMassGrams: customProduct.estimatedMassGrams,
      isCustomMassEntered: true,
      wipeStepsCompleted: {},
      wipeFinalConfirmed: false,
      isManualEntryOpen: false,
      mascotMood: 'curious',
      mascotMessage: `Got it! Custom hardware entry: ${customProduct.manufacturer} ${customProduct.model}. Let's inspect its condition.`
    })
  },

  setManualEntryOpen: (isManualEntryOpen) => set({ isManualEntryOpen }),

  setCondition: (condition) => {
    const isSwollen = condition === 'swollen_battery'
    set({
      condition,
      mascotMood: isSwollen ? 'alert_hazard' : 'evaluating',
      mascotMessage: isSwollen
        ? '⚠️ CRITICAL SAFETY WARNING: Swollen lithium-ion cells pose a thermal fire risk. Standard collection bins are disabled. We will route you strictly to Hazmat-certified collection points.'
        : condition === 'mint'
        ? 'Mint condition! This device is a prime candidate for circular refurbishment and re-homing to other students.'
        : 'Assessment recorded. Next, review the hazardous material profile and environmental impact.'
    })
  },

  setMeasuredMassGrams: (measuredMassGrams) => {
    set({ measuredMassGrams, isCustomMassEntered: true })
  },

  toggleWipeStep: (stepNumber) => {
    const prev = get().wipeStepsCompleted
    const updated = { ...prev, [stepNumber]: !prev[stepNumber] }
    set({ wipeStepsCompleted: updated })
  },

  setWipeExceptionRequested: (wipeExceptionRequested) => {
    set({
      wipeExceptionRequested,
      mascotMood: wipeExceptionRequested ? 'evaluating' : 'security_wipe',
      mascotMessage: wipeExceptionRequested
        ? 'Flagged for Hardware Shredder Protocol: Campus staff will verify physical chip destruction at the kiosk.'
        : 'Standard secure cryptographic wipe selected.'
    })
  },

  setWipeFinalConfirmed: (wipeFinalConfirmed) => set({ wipeFinalConfirmed }),

  selectKiosk: (selectedKioskId) => {
    const kiosk = CAMPUS_KIOSKS.find((k) => k.id === selectedKioskId)
    set({
      selectedKioskId,
      mascotMood: 'kiosk_routing',
      mascotMessage: kiosk
        ? `Selected ${kiosk.name}! It has a ${kiosk.turfBonusMultiplier}x Turf Bonus for ${kiosk.campusName}.`
        : 'Select an authorized kiosk.'
    })
  },

  generateQrPass: async () => {
    const state = get()
    const product = state.selectedProduct
    const custom = state.customProduct
    const kiosk = CAMPUS_KIOSKS.find((k) => k.id === state.selectedKioskId) || CAMPUS_KIOSKS[0]

    // Generate unique short token: SIG-[HEX6]-[CAMPUS]
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase()
    const campusTag = (kiosk.campusId || 'CAMPUS').toUpperCase()
    const passId = `SIG-${randomHex}-${campusTag}`

    const productName = product?.model || custom?.model || 'Hardware Device'
    const manufacturer = product?.manufacturer || custom?.manufacturer || 'Generic'
    const variant = product?.variant || custom?.variant || 'Standard Edition'
    const category = product?.category || custom?.category || 'other'
    const condition = state.condition || 'mint'
    const isHazmat = condition === 'swollen_battery'
    const declaredMassGrams = state.measuredMassGrams || product?.defaultMassGrams || 200

    const turfMultiplier = kiosk.turfBonusMultiplier || 1.0
    const baseCredits = product?.baseEcoCredits || Math.round(declaredMassGrams * 0.5)
    const baseXp = product?.baseXp || Math.round(declaredMassGrams * 0.7)
    const projectedEcoCredits = Math.round(baseCredits * turfMultiplier)
    const projectedXp = Math.round(baseXp * turfMultiplier)
    const estimatedCo2eKg = product?.co2eAvoidedKg || parseFloat((declaredMassGrams * 0.08).toFixed(1))

    // Secure QR payload: clean structured JSON without sensitive credentials
    const qrPayload = JSON.stringify({
      v: 1,
      ref: passId,
      ts: Date.now(),
      mfg: manufacturer,
      mod: productName,
      kg: declaredMassGrams / 1000,
      cond: condition,
      haz: isHazmat,
      kid: kiosk.id
    })

    const currentUser = useAuthStore.getState().currentUser

    const newPass: EphemeralPass = {
      passId,
      timestamp: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minute locker reservation
      productId: product?.id,
      customProduct: custom || undefined,
      productName,
      manufacturer,
      variant,
      category,
      condition,
      declaredMassGrams,
      isHazmat,
      dataWipeConfirmed: state.wipeFinalConfirmed,
      dataWipeException: state.wipeExceptionRequested,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      campusId: kiosk.campusId,
      campusName: kiosk.campusName,
      turfMultiplier,
      estimatedCo2eKg,
      projectedEcoCredits,
      projectedXp,
      status: 'pending',
      qrPayload,
      userId: currentUser?.id,
      studentName: currentUser?.name || 'Aarav Sharma',
      studentRollNo: currentUser?.studentRollNo || '2023/EE/042',
      department: currentUser?.department || 'Electrical Engineering'
    }

    const updatedPasses = [newPass, ...state.savedPasses]
    savePassesToStorage(updatedPasses)

    set({
      activePass: newPass,
      savedPasses: updatedPasses,
      currentStep: 6,
      mascotMood: 'celebrating',
      mascotMessage: `Pass ${passId} generated! Your 15-minute slot at ${kiosk.name} is locked in. Let's drop it off!`
    })

    return newPass
  },

  resetWizard: () => {
    set({
      currentStep: 1,
      selectedProduct: null,
      customProduct: null,
      condition: null,
      measuredMassGrams: 194,
      isCustomMassEntered: false,
      wipeStepsCompleted: {},
      wipeExceptionRequested: false,
      wipeFinalConfirmed: false,
      activePass: null,
      mascotMood: 'welcome',
      mascotMessage: "Ready for another device! Search or pick a category above."
    })
  },

  // --- KIOSK OPERATOR TERMINAL ACTIONS ---
  setOperatorInputToken: (token) => set({ operatorInputToken: token }),

  lookupPass: (passIdToFind) => {
    const term = passIdToFind.trim().toUpperCase()
    const { savedPasses } = get()
    const found = savedPasses.find(
      (p) => p.passId.toUpperCase() === term || p.passId.toUpperCase().includes(term)
    )

    if (found) {
      // Simulate physical scale reading slightly varying by ±1-3% around expected mass
      const jitter = (Math.random() - 0.45) * 4.0
      const simWeight = parseFloat((found.declaredMassGrams + jitter).toFixed(1))

      set({
        operatorInspectedPass: found,
        simulatedScaleGrams: simWeight,
        operatorChecklist: {
          modelMatches: false,
          conditionMatches: false,
          scaleWeightVerified: false,
          batterySafetyVerified: false,
          wipeVerified: false
        },
        mascotMood: 'operator_scan',
        mascotMessage: `Pass ${found.passId} located for ${found.productName}! Begin physical verification checklist.`
      })
    } else {
      set({
        operatorInspectedPass: null,
        mascotMood: 'alert_hazard',
        mascotMessage: `Pass token "${passIdToFind}" not found. Verify the reference code on student's screen.`
      })
    }
  },

  toggleOperatorChecklist: (key) => {
    const prev = get().operatorChecklist
    const updated = { ...prev, [key]: !prev[key] }
    set({ operatorChecklist: updated })
  },

  setSimulatedScaleGrams: (grams) => set({ simulatedScaleGrams: grams }),
  setOperatorRejectionReason: (reason) => set({ operatorRejectionReason: reason }),
  setOperatorRejectionNotes: (notes) => set({ operatorRejectionNotes: notes }),

  acceptCurrentInspection: async (operatorName = 'Kavita Sharma (Lead Lab Tech)') => {
    const { operatorInspectedPass, savedPasses, simulatedScaleGrams } = get()
    if (!operatorInspectedPass || operatorInspectedPass.status === 'accepted') return false

    const variance = parseFloat(
      (
        ((simulatedScaleGrams - operatorInspectedPass.declaredMassGrams) /
          operatorInspectedPass.declaredMassGrams) *
        100
      ).toFixed(1)
    )

    const kgDiverted = parseFloat((simulatedScaleGrams / 1000).toFixed(3))

    const receipt: EphemeralPassReceipt = {
      acceptedAt: new Date().toLocaleString(),
      operatorName,
      kioskId: operatorInspectedPass.kioskId,
      kioskName: operatorInspectedPass.kioskName,
      campusId: operatorInspectedPass.campusId,
      campusName: operatorInspectedPass.campusName,
      verifiedWeightGrams: simulatedScaleGrams,
      scaleVariancePercent: variance,
      awardedEcoCredits: operatorInspectedPass.projectedEcoCredits,
      awardedXp: operatorInspectedPass.projectedXp,
      kgAddedToCampus: kgDiverted,
      certificateId: `REC-${operatorInspectedPass.campusId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      digitalSignature: `SHA256:${Math.random().toString(16).substring(2, 10).toUpperCase()}`
    }

    const updatedPass: EphemeralPass = {
      ...operatorInspectedPass,
      status: 'accepted',
      receipt
    }

    const updatedList = savedPasses.map((p) =>
      p.passId === updatedPass.passId ? updatedPass : p
    )

    savePassesToStorage(updatedList)

    // BOOST CAMPUS TELEMETRY IN THE MAIN 3D GLOBE ENGINE!
    try {
      const worldStore = useWorldStore.getState()
      if (operatorInspectedPass.campusId) {
        // Boost campus by the verified kilograms (or round up to 5kg demo chunk)
        await worldStore.boostSelectedCampus(Math.max(1, Math.round(kgDiverted)))
      }
    } catch (err) {
      console.warn('Campus boost integration notice', err)
    }

    set({
      operatorInspectedPass: updatedPass,
      savedPasses: updatedList,
      activePass: get().activePass?.passId === updatedPass.passId ? updatedPass : get().activePass,
      mascotMood: 'celebrating',
      mascotMessage: `🎉 Handover Confirmed! +${kgDiverted} kg credited to ${updatedPass.campusName}. Digital certificate generated!`
    })

    return true
  },

  rejectCurrentInspection: async (operatorName = 'Kavita Sharma (Lead Lab Tech)') => {
    const { operatorInspectedPass, savedPasses, operatorRejectionReason, operatorRejectionNotes } = get()
    if (!operatorInspectedPass || operatorInspectedPass.status === 'accepted') return false

    const rejection: EphemeralPassRejection = {
      rejectedAt: new Date().toLocaleString(),
      operatorName,
      kioskId: operatorInspectedPass.kioskId,
      reason: operatorRejectionReason,
      notes: operatorRejectionNotes || 'Physical inspection failed criteria.'
    }

    const updatedPass: EphemeralPass = {
      ...operatorInspectedPass,
      status: 'rejected',
      rejection
    }

    const updatedList = savedPasses.map((p) =>
      p.passId === updatedPass.passId ? updatedPass : p
    )

    savePassesToStorage(updatedList)

    set({
      operatorInspectedPass: updatedPass,
      savedPasses: updatedList,
      activePass: get().activePass?.passId === updatedPass.passId ? updatedPass : get().activePass,
      mascotMood: 'alert_hazard',
      mascotMessage: `Submission flagged and rejected: ${operatorRejectionReason}. Logged in incident audit trail.`
    })

    return true
  }
}))
