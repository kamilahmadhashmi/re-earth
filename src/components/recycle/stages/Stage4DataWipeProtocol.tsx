import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Key,
  RotateCcw
} from 'lucide-react'
import { useRecycleStore } from '../../../store/useRecycleStore'

export const Stage4DataWipeProtocol: React.FC = () => {
  const {
    selectedProduct,
    customProduct,
    condition,
    wipeStepsCompleted,
    toggleWipeStep,
    wipeExceptionRequested,
    setWipeExceptionRequested,
    wipeFinalConfirmed,
    setWipeFinalConfirmed,
    setCurrentStep
  } = useRecycleStore()

  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  // Default fallback guidance if custom
  const defaultSteps = [
    {
      step: 1,
      title: 'Sign Out of Personal Cloud Accounts',
      detail: 'Disconnect Apple Account, Google Account, or Microsoft credentials to remove activation lock and cloud backups.',
      officialDocUrl: 'https://support.google.com/android/answer/6088915'
    },
    {
      step: 2,
      title: 'Perform Cryptographic Factory Reset',
      detail: 'Use the device system settings menu to erase all user partitions and purge encryption keys.',
      officialDocUrl: 'https://support.apple.com/HT201252'
    },
    {
      step: 3,
      title: 'Eject Physical SIM / MicroSD Cards',
      detail: 'Ensure all removable storage media and subscriber identity cards are taken out of the chassis.',
      officialDocUrl: 'https://www.ifixit.com'
    }
  ]

  const guidance = selectedProduct?.wipeGuidance || {
    platform: 'generic',
    summary: 'Universal Electronic Data Sanitization Protocol',
    steps: defaultSteps
  }

  const steps = guidance.steps
  const allStepsChecked = steps.every((s) => !!wipeStepsCompleted[s.step])
  const canProceed = (allStepsChecked && wipeFinalConfirmed) || wipeExceptionRequested

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          STAGE 4 OF 6 • PRIVACY SANITIZATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Interactive Data-Wipe Protocol
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Prepare your device and protect your personal privacy before handing it over at the kiosk.
        </p>
      </div>

      {/* PLATFORM SPECIFIC CALLOUT */}
      <div className="p-3.5 rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan/20 flex items-center justify-center text-cyan shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan font-bold block">
              PLATFORM PROTOCOL: {guidance.platform.toUpperCase()}
            </span>
            <p className="text-text-primary font-medium text-xs">
              {guidance.summary}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-text-muted hidden sm:inline">
          NIST SP 800-88 R1
        </span>
      </div>

      {/* INTERACTIVE CHECKLIST */}
      <div className="space-y-2.5">
        {steps.map((s) => {
          const isDone = !!wipeStepsCompleted[s.step]
          const isExpanded = expandedStep === s.step

          return (
            <motion.div
              key={s.step}
              className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                isDone
                  ? 'bg-emerald/10 border-emerald/40 shadow-emerald-glow'
                  : 'liquid-glass-subtle border-white/[0.08] hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleWipeStep(s.step)}
                  className="flex items-start gap-3 text-left flex-1 min-w-0"
                >
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-emerald border-emerald text-black'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-text-muted">
                        STEP 0{s.step}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold transition-colors ${
                          isDone ? 'text-emerald line-through opacity-85' : 'text-text-primary'
                        }`}
                      >
                        {s.title}
                      </h4>
                    </div>

                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {s.detail}
                    </p>
                  </div>
                </button>

                {s.officialDocUrl && (
                  <a
                    href={s.officialDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-text-muted hover:text-cyan hover:bg-white/5 transition-colors shrink-0"
                    title="Official Manufacturer Guide"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CONFIRMATION CHECKBOX */}
      <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={wipeFinalConfirmed}
            disabled={wipeExceptionRequested}
            onChange={(e) => setWipeFinalConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 text-emerald focus:ring-emerald/40 bg-white/5"
          />
          <div className="text-xs">
            <span className="font-bold text-text-primary block">
              I have confirmed personal account sign-out and initiated factory erasure
            </span>
            <span className="text-text-muted block mt-0.5 leading-relaxed text-[11px]">
              Note: User declaration provides preliminary verification. Complete physical sanitized verification will be recorded by kiosk operator.
            </span>
          </div>
        </label>

        {/* BROKEN DEVICE EXCEPTION PATH */}
        <div className="pt-3 border-t border-white/[0.06] flex items-start gap-3">
          <input
            type="checkbox"
            checked={wipeExceptionRequested}
            onChange={(e) => {
              setWipeExceptionRequested(e.target.checked)
              if (e.target.checked) setWipeFinalConfirmed(false)
            }}
            className="mt-0.5 w-4 h-4 rounded border-amber/40 text-amber focus:ring-amber/40 bg-white/5"
          />
          <div className="text-xs">
            <span className="font-bold text-amber block">
              Device Inoperable / Cannot Access Screen (Hardware Shredder Protocol)
            </span>
            <span className="text-text-secondary block mt-0.5 text-[11px] leading-relaxed">
              If your device does not turn on or screen is dead, check this box. Kiosk operator will physically route the logic board for audited mechanical perforation/shredding.
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hazard Profile</span>
        </button>

        <button
          disabled={!canProceed}
          onClick={() => setCurrentStep(5)}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            canProceed
              ? 'bg-emerald text-background shadow-emerald-glow hover:brightness-105 active:scale-[0.98]'
              : 'bg-white/10 text-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <span>Continue to Select Kiosk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
