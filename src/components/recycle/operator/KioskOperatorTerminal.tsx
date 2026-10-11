import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Scan,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  ShieldCheck,
  UserCheck,
  Building2,
  Flame,
  Award,
  FileCheck2,
  Lock,
  Search,
  RotateCcw,
  Sparkles,
  Smartphone
} from 'lucide-react'
import { useRecycleStore } from '../../../store/useRecycleStore'
import { useAuthStore } from '../../../store/useAuthStore'

export const KioskOperatorTerminal: React.FC = () => {
  const { currentUser } = useAuthStore()
  const {
    operatorInputToken,
    setOperatorInputToken,
    operatorInspectedPass,
    lookupPass,
    operatorChecklist,
    toggleOperatorChecklist,
    simulatedScaleGrams,
    setSimulatedScaleGrams,
    operatorRejectionReason,
    setOperatorRejectionReason,
    operatorRejectionNotes,
    setOperatorRejectionNotes,
    acceptCurrentInspection,
    rejectCurrentInspection,
    savedPasses
  } = useRecycleStore()

  const defaultOperatorName = currentUser
    ? `${currentUser.name} (${currentUser.role === 'kiosk_operator' ? 'Kiosk Operator' : 'Campus Admin'})`
    : 'Arun Verma (Lead Lab Tech)'

  const [operatorName, setOperatorName] = useState(defaultOperatorName)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  const pass = operatorInspectedPass

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (operatorInputToken.trim()) {
      lookupPass(operatorInputToken.trim())
    }
  }

  // Scale variance check (within ±5% nominal is considered valid)
  const nominalMass = pass?.declaredMassGrams || 194
  const variancePercent = Math.abs(
    ((simulatedScaleGrams - nominalMass) / nominalMass) * 100
  )
  const isScaleWithinTolerance = variancePercent <= 5.0

  // All checklist items must be checked to enable acceptance
  const allChecksSatisfied =
    operatorChecklist.modelMatches &&
    operatorChecklist.conditionMatches &&
    operatorChecklist.scaleWeightVerified &&
    operatorChecklist.batterySafetyVerified &&
    operatorChecklist.wipeVerified

  const isAlreadyAccepted = pass?.status === 'accepted'
  const isRejected = pass?.status === 'rejected'

  const handleAccept = async () => {
    if (!pass || isAlreadyAccepted || !allChecksSatisfied) return
    setIsAccepting(true)

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#30D158', '#64D2FF', '#FFD60A', '#FFFFFF']
    })

    await acceptCurrentInspection(operatorName)
    setIsAccepting(false)
  }

  const handleReject = async () => {
    if (!pass) return
    await rejectCurrentInspection(operatorName)
    setIsRejectModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* TERMINAL HEADER & OPERATOR BADGE */}
      <div className="p-4 rounded-2xl liquid-glass specular-rim flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-liquid-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan/20 border border-cyan/40 flex items-center justify-center text-cyan shrink-0">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded-full bg-cyan/20 text-cyan font-bold">
                OPERATOR TERMINAL v2.6
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald animate-ping" />
            </div>
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Campus Collection Kiosk Ingestion Desk
            </h2>
          </div>
        </div>

        {/* OPERATOR CREDENTIALS */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <UserCheck className="w-3.5 h-3.5 text-emerald" />
          <span>Operator:</span>
          <input
            type="text"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-text-primary text-xs font-mono focus:outline-none focus:border-cyan"
          />
        </div>
      </div>

      {/* TOKEN SEARCH / BARCODE SCANNER INPUT */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={operatorInputToken}
            onChange={(e) => setOperatorInputToken(e.target.value)}
            placeholder="Scan QR token barcode or enter reference (e.g. SIG-...)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-subtle border border-white/10 text-xs sm:text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan/50"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-cyan text-background font-bold text-xs uppercase tracking-wider shadow-cyan-glow hover:brightness-105 transition-all"
        >
          Lookup Pass
        </button>
      </form>

      {/* QUICK SUGGESTIONS OF RECENT PASSES */}
      {savedPasses.length > 0 && !pass && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-text-muted uppercase">
            Recent Passes Available to Inspect:
          </span>
          <div className="flex flex-wrap gap-2">
            {savedPasses.slice(0, 4).map((p) => (
              <button
                key={p.passId}
                type="button"
                onClick={() => {
                  setOperatorInputToken(p.passId)
                  lookupPass(p.passId)
                }}
                className="px-3 py-1.5 rounded-xl liquid-glass-subtle border border-white/10 text-xs font-mono text-text-secondary hover:text-cyan hover:border-cyan/40 transition-all flex items-center gap-1.5"
              >
                <span>{p.passId}</span>
                <span className="text-text-muted">({p.productName})</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    p.status === 'accepted'
                      ? 'bg-emerald/20 text-emerald'
                      : p.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber/20 text-amber'
                  }`}
                >
                  {p.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE INSPECTED PASS CONTAINER */}
      {pass && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* DUPLICATE REDEMPTION WARNING */}
          {isAlreadyAccepted && (
            <div className="p-4 rounded-2xl bg-emerald/15 border border-emerald/40 shadow-emerald-glow flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-emerald text-sm">
                  Pass Already Accepted & Redeemed
                </h4>
                <p className="text-text-primary mt-1">
                  Certificate #{pass.receipt?.certificateId} was issued on {pass.receipt?.acceptedAt} by {pass.receipt?.operatorName}.
                  Duplicate deposit attempts are strictly prevented.
                </p>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-red-400 text-sm">
                  Submission Flagged & Rejected
                </h4>
                <p className="text-text-primary mt-1">
                  Reason: {pass.rejection?.reason}. Notes: {pass.rejection?.notes}.
                </p>
              </div>
            </div>
          )}

          {/* INSPECTION METRICS COMPARISON CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT: DECLARED DETAILS (5 cols) */}
            <div className="lg:col-span-5 p-4 rounded-2xl liquid-glass-subtle border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                DECLARED SUBMISSION TELEMETRY
              </span>

              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {pass.productName}
                </h3>
                <p className="text-xs text-text-secondary font-mono">
                  {pass.manufacturer} • {pass.variant}
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/[0.06]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Nominal Mass:</span>
                  <span className="text-text-primary font-bold">{pass.declaredMassGrams} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Condition Declaration:</span>
                  <span className="text-cyan font-bold capitalize">{pass.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Hazmat Classification:</span>
                  <span className={pass.isHazmat ? 'text-amber font-bold' : 'text-emerald'}>
                    {pass.isHazmat ? 'HAZARDOUS LITHIUM-ION' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Assigned Kiosk:</span>
                  <span className="text-text-primary truncate max-w-[160px]">{pass.kioskName}</span>
                </div>
              </div>

              {/* SIMULATED BUILT-IN OPTICAL SCALE */}
              <div className="mt-3 p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-cyan font-bold">
                    <Scale className="w-3.5 h-3.5" />
                    INTEGRATED PLATFORM SCALE
                  </span>
                  <span className="text-emerald font-bold">TARE OK</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={simulatedScaleGrams}
                      onChange={(e) => setSimulatedScaleGrams(Number(e.target.value))}
                      className="text-2xl font-black font-mono text-emerald bg-transparent w-28 focus:outline-none"
                    />
                    <span className="text-xs font-mono text-text-muted">g</span>
                  </div>

                  <div className="text-right text-[10px] font-mono">
                    <span className={isScaleWithinTolerance ? 'text-emerald' : 'text-amber'}>
                      Variance: {((simulatedScaleGrams - nominalMass) / nominalMass * 100).toFixed(1)}%
                    </span>
                    <span className="block text-text-muted">
                      {isScaleWithinTolerance ? '✓ In Tolerance' : '⚠️ Weight Mismatch'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: STRUCTURED PHYSICAL VERIFICATION CHECKLIST (7 cols) */}
            <div className="lg:col-span-7 p-4 rounded-2xl liquid-glass specular-rim space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-emerald font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PHYSICAL INSPECTION CRITERIA
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  5 of 5 Required
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Model match */}
                <label className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={operatorChecklist.modelMatches}
                    disabled={isAlreadyAccepted}
                    onChange={() => toggleOperatorChecklist('modelMatches')}
                    className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald bg-white/5"
                  />
                  <div>
                    <span className="font-bold text-text-primary block">
                      1. Hardware Model Verification
                    </span>
                    <span className="text-text-secondary text-[11px] block">
                      Physical chassis branding matches {pass.manufacturer} {pass.productName}.
                    </span>
                  </div>
                </label>

                {/* 2. Condition match */}
                <label className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={operatorChecklist.conditionMatches}
                    disabled={isAlreadyAccepted}
                    onChange={() => toggleOperatorChecklist('conditionMatches')}
                    className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald bg-white/5"
                  />
                  <div>
                    <span className="font-bold text-text-primary block">
                      2. Declared Condition Integrity
                    </span>
                    <span className="text-text-secondary text-[11px] block">
                      Enclosure state corresponds with declared condition ({pass.condition}).
                    </span>
                  </div>
                </label>

                {/* 3. Scale weight */}
                <label className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={operatorChecklist.scaleWeightVerified}
                    disabled={isAlreadyAccepted}
                    onChange={() => toggleOperatorChecklist('scaleWeightVerified')}
                    className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald bg-white/5"
                  />
                  <div>
                    <span className="font-bold text-text-primary block">
                      3. Scale Mass Consistency
                    </span>
                    <span className="text-text-secondary text-[11px] block">
                      Physical weight ({simulatedScaleGrams}g) matches expected nominal ({nominalMass}g ±5%).
                    </span>
                  </div>
                </label>

                {/* 4. Battery safety */}
                <label className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={operatorChecklist.batterySafetyVerified}
                    disabled={isAlreadyAccepted}
                    onChange={() => toggleOperatorChecklist('batterySafetyVerified')}
                    className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald bg-white/5"
                  />
                  <div>
                    <span className="font-bold text-text-primary block">
                      4. Thermal & Battery Safe Containment
                    </span>
                    <span className="text-text-secondary text-[11px] block">
                      {pass.isHazmat
                        ? 'Device placed inside fire-resistant sand isolation containment.'
                        : 'No active thermal runaway, punctures, or chemical leakage observed.'}
                    </span>
                  </div>
                </label>

                {/* 5. Wipe sanitized */}
                <label className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={operatorChecklist.wipeVerified}
                    disabled={isAlreadyAccepted}
                    onChange={() => toggleOperatorChecklist('wipeVerified')}
                    className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald bg-white/5"
                  />
                  <div>
                    <span className="font-bold text-text-primary block">
                      5. Data Sanitization / Destruction Tagged
                    </span>
                    <span className="text-text-secondary text-[11px] block">
                      {pass.dataWipeException
                        ? 'Hardware tagged for audited physical disk drill/shredder chamber.'
                        : 'Verified device displays factory setup screen with accounts decoupled.'}
                    </span>
                  </div>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isAlreadyAccepted}
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors disabled:opacity-40"
                >
                  Reject / Flag Mismatch
                </button>

                <button
                  type="button"
                  disabled={isAlreadyAccepted || !allChecksSatisfied || isAccepting}
                  onClick={handleAccept}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    !isAlreadyAccepted && allChecksSatisfied
                      ? 'bg-emerald text-background shadow-emerald-glow hover:brightness-105 active:scale-[0.98]'
                      : 'bg-white/10 text-text-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAlreadyAccepted ? 'Accepted' : 'Accept & Unlock Hatch'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* REJECTION MODAL */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md liquid-glass specular-rim p-6 rounded-2xl border border-red-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 text-red-400 pb-2 border-b border-white/10">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-text-primary">
                  Flag & Reject Submission
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    PRIMARY REJECTION REASON *
                  </label>
                  <select
                    value={operatorRejectionReason}
                    onChange={(e) => setOperatorRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D10] border border-white/10 text-text-primary focus:outline-none focus:border-red-400"
                  >
                    <option value="mismatch_model">Hardware Model / Brand Mismatch</option>
                    <option value="mass_deviation">Significant Mass Deviation (&gt;15%)</option>
                    <option value="unsafe_battery">Unsafe Damaged Battery at Non-Hazmat Kiosk</option>
                    <option value="incomplete_wipe">Cloud Account Locked / Incomplete Wipe</option>
                    <option value="counterfeit_replica">Suspected Counterfeit or Stripped Internal Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    OPERATOR AUDIT NOTES *
                  </label>
                  <textarea
                    rows={3}
                    value={operatorRejectionNotes}
                    onChange={(e) => setOperatorRejectionNotes(e.target.value)}
                    placeholder="Describe discrepancy for student notification and campus audit log..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-text-muted hover:text-text-primary hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-5 py-2 rounded-full bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
