import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Building2, TrendingUp, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { useRecycleStore } from '../../store/useRecycleStore'
import { useAuthStore } from '../../store/useAuthStore'
import { RecycleModuleModal } from '../recycle/RecycleModuleModal'
import { LoginModal } from '../auth/LoginModal'

export const Modals: React.FC = () => {
  const { activeModal, openModal, navigateToSponsor } = useWorldStore()
  const { setActiveTab } = useRecycleStore()
  const { isAuthenticated, currentUser, isLoginModalOpen, openLoginModal } = useAuthStore()

  const [tier, setTier] = useState<1 | 3 | 5>(3)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitted(true)
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setEmail('')
    openModal(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!activeModal) return

    const isStudent = currentUser?.role === 'student'
    const isCollegeAdmin = currentUser?.role === 'college_admin' || currentUser?.role === 'central_admin'
    const isKioskOperator = currentUser?.role === 'kiosk_operator'

    if (activeModal === 'sponsorships') {
      if (!isAuthenticated) {
        openLoginModal('Please authenticate with an authorized college administrator account to access Sponsor Applications.')
      } else if (!isCollegeAdmin) {
        setActiveTab('student_flow')
      } else {
        setActiveTab('sponsorships')
      }
    } else if (activeModal === 'vault') {
      if (!isAuthenticated) {
        openLoginModal('Please authenticate with your student or campus admin account to access the Tech Vault.')
      } else if (isKioskOperator) {
        setActiveTab('kiosk_terminal')
      } else {
        setActiveTab('tech_vault')
      }
    } else if (activeModal === 'recycle') {
      if (!isAuthenticated) {
        openLoginModal('Please authenticate to access the Student Drop-Off portal.')
      } else if (isCollegeAdmin) {
        setActiveTab('sponsorships')
      } else if (isKioskOperator) {
        setActiveTab('kiosk_terminal')
      } else {
        setActiveTab('student_flow')
      }
    } else if (activeModal === 'terminal') {
      if (!isAuthenticated) {
        openLoginModal('Please authenticate with an authorized kiosk operator or college admin account.')
      } else if (isStudent) {
        setActiveTab('student_flow')
      } else {
        setActiveTab('kiosk_terminal')
      }
    }
  }, [activeModal, isAuthenticated, currentUser?.role, setActiveTab, openLoginModal])

  // Always render LoginModal if open
  if (isLoginModalOpen) {
    return <LoginModal />
  }

  if (!activeModal) return null

  // If user opens Recycle, Vault, Terminal, or Sponsorships and is authenticated, render RecycleModuleModal
  if (
    isAuthenticated &&
    (activeModal === 'recycle' || activeModal === 'vault' || activeModal === 'terminal' || activeModal === 'sponsorships')
  ) {
    return (
      <AnimatePresence>
        <RecycleModuleModal />
      </AnimatePresence>
    )
  }

  // If unauthenticated and tried to open recycle/vault/terminal/sponsorships, show LoginModal
  if (
    !isAuthenticated &&
    (activeModal === 'recycle' || activeModal === 'vault' || activeModal === 'terminal' || activeModal === 'sponsorships')
  ) {
    return <LoginModal />
  }

  const isPitch = activeModal === 'sponsor_pitch'

  // Dynamic calculations based on underwritten campus count
  const metrics = {
    1: {
      label: 'Single Campus Node',
      campuses: '1 Flagship University (e.g. DTU or IIT Delhi)',
      kiosks: 3,
      annualKg: 4850,
      co2Tons: 10.4,
      students: '14,000+'
    },
    3: {
      label: 'Regional Engineering Cluster',
      campuses: '3 Premier Campuses (e.g. North India Technology Corridor)',
      kiosks: 9,
      annualKg: 14550,
      co2Tons: 31.2,
      students: '45,000+'
    },
    5: {
      label: 'National Collegiate Network',
      campuses: '5 Tier-1 Engineering Institutes across Bharat',
      kiosks: 15,
      annualKg: 24250,
      co2Tons: 52.0,
      students: '78,000+'
    }
  }[tier]


  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose()
        }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-white/10"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {isPitch ? (
            /* INTERACTIVE CORPORATE UNDERWRITING SUITE */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-copper/15 border border-copper/30 flex items-center justify-center text-copper shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-copper font-semibold block">
                    Corporate Underwriting Suite
                  </span>
                  <h3 className="text-xl font-bold text-text-primary tracking-tight">
                    Underwrite Collegiate Hardware Recovery
                  </h3>
                </div>
              </div>

              {!isSubmitted ? (
                <>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Directly endow automated IoT collection kiosks across leading engineering institutes. Receive audited Scope 3 diversion receipts, permanent 3D holographic tree architectural presence, and verifiable ESG metrics.
                  </p>

                  {/* Campus Scale Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">Select Underwriting Scope</span>
                      <span className="text-emerald font-mono font-semibold text-[11px]">
                        {metrics.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {([1, 3, 5] as const).map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setTier(count)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            tier === count
                              ? 'bg-copper/15 border-copper text-text-primary shadow-sm'
                              : 'bg-surface-elevated border-white/5 text-text-muted hover:text-text-primary hover:border-white/15'
                          }`}
                        >
                          <span className="block font-bold text-sm font-mono">
                            {count} {count === 1 ? 'Campus' : 'Campuses'}
                          </span>
                          <span className="text-[10px] text-text-secondary block mt-0.5">
                            {count * 3} Smart Kiosks
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reactive Scope 3 Forecast Cards */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/[0.06]">
                      <span className="text-text-secondary font-medium flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-copper" />
                        Annual Scope 3 Dividend Forecast
                      </span>
                      <span className="text-[10px] font-mono text-emerald">
                        Audited ESG Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-surface-elevated/60 border border-white/5">
                        <p className="text-[10px] text-text-muted">Hardware Diverted</p>
                        <p className="text-sm font-bold text-text-primary font-mono mt-0.5">
                          {metrics.annualKg.toLocaleString()}
                          <span className="text-[10px] text-text-muted ml-0.5">kg</span>
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-elevated/60 border border-white/5">
                        <p className="text-[10px] text-text-muted">CO₂e Avoided</p>
                        <p className="text-sm font-bold text-emerald font-mono mt-0.5">
                          {metrics.co2Tons}t
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-elevated/60 border border-white/5">
                        <p className="text-[10px] text-text-muted">Student Reach</p>
                        <p className="text-sm font-bold text-cyan font-mono mt-0.5">
                          {metrics.students}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-text-muted text-center pt-0.5">
                      Target Deployment: <strong className="text-text-primary">{metrics.campuses}</strong>
                    </p>
                  </div>

                  {/* Corporate Inquiry Form */}
                  <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary block">
                        Enterprise or Sustainability Lead Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sustainability-lead@enterprise.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-elevated border border-white/10 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-copper transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-lg bg-[#C86432] hover:bg-[#D4703D] active:scale-[0.98] font-bold text-xs text-white shadow-md transition-all cursor-pointer"
                    >
                      Request Campus Underwriting Prospectus
                    </button>
                  </form>
                </>
              ) : (
                /* SUBMISSION CONFIRMATION STATE */
                <div className="p-6 rounded-xl bg-emerald/10 border border-emerald/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-text-primary">
                    Prospectus & Onboarding Dossier Queued
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                    The Re—Earth University Consortium has prepared the {metrics.label} dossier for <strong className="text-emerald">{email}</strong>. Our partnership director will transmit the verified Scope 3 telemetry framework within 24 hours.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={handleClose}
                      className="px-5 py-2 rounded-lg bg-emerald text-background font-semibold text-xs hover:brightness-105 transition-all"
                    >
                      Return to Interactive Globe
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* COMING NEXT MODAL FOR UNBUILT TABS */
            <div className="space-y-5">
              <div className="w-9 h-9 rounded-md bg-surface-elevated border border-white/15 flex items-center justify-center text-copper">
                <Layers className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wide text-copper block uppercase">
                  System Module
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-1 capitalize">
                  {activeModal} Specification
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  You are exploring <strong className="text-text-primary">Phase 1: Global Impact Console</strong>. 
                  This interface module is queued for Phase 2 hardware deployment.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-elevated border border-white/10 text-xs text-text-secondary space-y-1.5">
                <p className="font-semibold text-text-primary">Phase 1 Live Capabilities:</p>
                <p>• Cinematic 3D Earth with architectural holographic towers</p>
                <p>• Cybernetic Forest with 8 Enterprise Sustainability Guardians</p>
                <p>• Procedural window-grid shaders & live telemetry updates</p>
                <p>• Verified Scope 3 closed-loop metallurgical recovery ledger</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-md bg-surface-elevated hover:bg-surface-hover text-text-primary font-semibold text-xs transition-colors border border-white/10"
                >
                  Return to Global Impact Console
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Modals
