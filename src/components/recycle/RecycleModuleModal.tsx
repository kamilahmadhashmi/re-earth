import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  Scan,
  FolderArchive,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  LogOut,
  Shield,
  ShieldAlert,
  GraduationCap,
  Building2
} from 'lucide-react'
import { useRecycleStore } from '../../store/useRecycleStore'
import { useWorldStore } from '../../store/useWorldStore'
import { useAuthStore } from '../../store/useAuthStore'
import { MascotVolt } from './MascotVolt'
import { Stage1ProductVault } from './stages/Stage1ProductVault'
import { Stage2ConditionTriage } from './stages/Stage2ConditionTriage'
import { Stage3HazardousMaterials } from './stages/Stage3HazardousMaterials'
import { Stage4DataWipeProtocol } from './stages/Stage4DataWipeProtocol'
import { Stage5KioskSelection } from './stages/Stage5KioskSelection'
import { Stage6EphemeralQRPass } from './stages/Stage6EphemeralQRPass'
import { KioskOperatorTerminal } from './operator/KioskOperatorTerminal'
import { TechVaultDrawer } from './vault/TechVaultDrawer'
import { CollegeAdminSponsorships } from './admin/CollegeAdminSponsorships'

const STEPS = [
  { num: 1, title: 'Vault', desc: 'Identify Device' },
  { num: 2, title: 'Triage', desc: 'Condition & Safety' },
  { num: 3, title: 'Impact', desc: 'Material Profile' },
  { num: 4, title: 'Wipe', desc: 'Sanitization' },
  { num: 5, title: 'Kiosk', desc: 'Collection Pod' },
  { num: 6, title: 'Pass', desc: 'QR Handover' }
]

export const RecycleModuleModal: React.FC = () => {
  const { openModal } = useWorldStore()
  const { currentUser, logout } = useAuthStore()
  const {
    activeTab,
    setActiveTab,
    currentStep,
    setCurrentStep,
    mascotMood,
    mascotMessage,
    selectedProduct,
    customProduct,
    condition
  } = useRecycleStore()

  const contentRef = useRef<HTMLDivElement>(null)
  const outerOverlayRef = useRef<HTMLDivElement>(null)

  const isCollegeAdmin = currentUser?.role === 'college_admin' || currentUser?.role === 'central_admin'
  const isKioskOperator = currentUser?.role === 'kiosk_operator'
  const isStudent = currentUser?.role === 'student'

  // Route guard & state synchronization based on authenticated role
  useEffect(() => {
    if (isKioskOperator && activeTab !== 'kiosk_terminal') {
      setActiveTab('kiosk_terminal')
    } else if (isCollegeAdmin && activeTab === 'student_flow') {
      setActiveTab('sponsorships')
    } else if (isStudent && (activeTab === 'kiosk_terminal' || activeTab === 'sponsorships')) {
      setActiveTab('student_flow')
    }
  }, [currentUser?.role, activeTab, isKioskOperator, isCollegeAdmin, isStudent, setActiveTab])

  // Scroll to the very top whenever the step or tab shifts so the user always sees the top portion first
  useEffect(() => {
    const scrollToTop = () => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
      if (outerOverlayRef.current) {
        outerOverlayRef.current.scrollTop = 0
      }
    }

    scrollToTop()
    const rafId = requestAnimationFrame(scrollToTop)
    const t1 = setTimeout(scrollToTop, 30)
    const t2 = setTimeout(scrollToTop, 120)
    const t3 = setTimeout(scrollToTop, 250)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [currentStep, activeTab])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        openModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openModal])

  const handleStepClick = (stepNum: number) => {
    // Only allow navigating back to previously visited steps
    if (stepNum < currentStep) {
      setCurrentStep(stepNum)
    }
  }

  return (
    <div
      ref={outerOverlayRef}
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-2xl overscroll-contain"
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
    >
      {/* Centering wrapper that allows full scrolling back to top without clipping */}
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onWheel={(e) => {
            // Forward wheel events over header, stepper, or mascot bar directly to the scrollable content container
            if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
              contentRef.current.scrollTop += e.deltaY
            }
          }}
          className={`pointer-events-auto w-full ${
            (activeTab === 'student_flow' && currentStep === 5) || activeTab === 'sponsorships'
              ? 'max-w-6xl'
              : 'max-w-4xl'
          } my-auto rounded-3xl liquid-glass specular-rim shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300`}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          {/* ========================================================================= */}
          {/* HEADER: MODE SEGMENTED CONTROL, USER IDENTITY & LOGOUT                    */}
          {/* ========================================================================= */}
          <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02] shrink-0 flex-wrap sm:flex-nowrap">
            {/* TAB SWITCHER PILL WITH ROLE SECURITY */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 text-xs">
              {/* 1. STUDENT DROP-OFF: VISIBLE ONLY TO STUDENTS */}
              {isStudent && (
                <button
                  type="button"
                  onClick={() => setActiveTab('student_flow')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer active:scale-95 ${
                    activeTab === 'student_flow'
                      ? 'bg-emerald text-background font-bold shadow-emerald-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Student Drop-Off</span>
                </button>
              )}

              {/* 2. KIOSK OPERATOR TERMINAL: VISIBLE TO OPERATORS AND COLLEGE ADMINS (HIDDEN FROM STUDENTS) */}
              {(isKioskOperator || isCollegeAdmin) && (
                <button
                  type="button"
                  onClick={() => setActiveTab('kiosk_terminal')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer active:scale-95 ${
                    activeTab === 'kiosk_terminal'
                      ? 'bg-cyan text-background font-bold shadow-cyan-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Kiosk Operator Terminal</span>
                </button>
              )}

              {/* 3. TECH VAULT: VISIBLE TO STUDENTS (PERSONAL VAULT) & COLLEGE ADMINS (ADMIN VAULT), HIDDEN FROM OPERATORS */}
              {(isStudent || isCollegeAdmin) && (
                <button
                  type="button"
                  onClick={() => setActiveTab('tech_vault')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer active:scale-95 ${
                    activeTab === 'tech_vault'
                      ? 'bg-lavender text-background font-bold shadow-lavender-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>{isCollegeAdmin ? 'Admin Tech Vault' : 'My Tech Vault'}</span>
                </button>
              )}

              {/* 4. SPONSORSHIPS: VISIBLE ONLY TO COLLEGE ADMINS AND CENTRAL ADMINS */}
              {isCollegeAdmin && (
                <button
                  type="button"
                  id="tab-btn-sponsorships"
                  onClick={() => setActiveTab('sponsorships')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer active:scale-95 ${
                    activeTab === 'sponsorships'
                      ? 'bg-amber text-background font-bold shadow-amber-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Sponsor Applications</span>
                </button>
              )}
            </div>

            {/* USER IDENTITY BADGE, LOGOUT & CLOSE CONTROLS */}
            <div className="flex items-center gap-2">
              {/* Active User Identity Pill */}
              {currentUser && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
                  <span className="font-bold text-text-primary max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCollegeAdmin
                        ? 'bg-emerald/15 text-emerald border border-emerald/30'
                        : isKioskOperator
                        ? 'bg-amber/15 text-amber border border-amber/30'
                        : 'bg-cyan/15 text-cyan border border-cyan/30'
                    }`}
                  >
                    {isCollegeAdmin ? 'ADMIN' : isKioskOperator ? 'OPERATOR' : 'STUDENT'}
                  </span>
                </div>
              )}

              {/* Prominent Logout Button */}
              <button
                type="button"
                id="btn-kiosk-modal-logout"
                onClick={async () => {
                  openModal(null)
                  await logout()
                }}
                title="Log Out of Current Session"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber/20 hover:text-amber text-text-muted transition-all border border-white/10 hover:border-amber/30 text-xs font-mono font-bold cursor-pointer active:scale-95"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              <kbd className="hidden sm:inline text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
                ESC
              </kbd>

              <button
                type="button"
                id="btn-close-recycle-modal"
                onClick={() => openModal(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-text-muted hover:text-text-primary border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PERSISTENT STEPPER (VISIBLE ONLY IN STUDENT FLOW)                         */}
          {/* ========================================================================= */}
          {activeTab === 'student_flow' && isStudent && (
            <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.01] shrink-0">
              <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                {STEPS.map((step, idx) => {
                  const isCompleted = step.num < currentStep
                  const isCurrent = step.num === currentStep
                  const isClickable = isCompleted

                  return (
                    <React.Fragment key={step.num}>
                      <button
                        type="button"
                        disabled={!isClickable && !isCurrent}
                        onClick={() => handleStepClick(step.num)}
                        className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-mono transition-all text-left shrink-0 ${
                          isCurrent
                            ? 'bg-white/10 text-emerald font-bold border border-emerald/40 shadow-emerald-glow'
                            : isCompleted
                            ? 'text-text-secondary hover:text-text-primary hover:bg-white/5 cursor-pointer active:scale-95'
                            : 'text-text-muted opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald text-black'
                              : isCurrent
                              ? 'border-2 border-emerald text-emerald'
                              : 'border border-white/20 text-text-muted'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                        </div>

                        <div className="hidden md:block">
                          <span className="block leading-none">{step.title}</span>
                        </div>
                      </button>

                      {idx < STEPS.length - 1 && (
                        <div
                          className={`h-[1px] flex-1 min-w-3 mx-1 ${
                            step.num < currentStep ? 'bg-emerald/50' : 'bg-white/10'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* COMPANION MASCOT "VOLT" HERO STRIP (ONLY FOR STUDENT DROP-OFF)            */}
          {/* ========================================================================= */}
          {activeTab === 'student_flow' && isStudent && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-cyan/10 via-emerald/5 to-transparent border-b border-white/[0.06] shrink-0">
              <MascotVolt mood={mascotMood} message={mascotMessage} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* MAIN SCROLLABLE CONTENT BODY (min-h-0 + data-lenis-prevent for full scroll) */}
          {/* ========================================================================= */}
          <div
            ref={contentRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'student_flow' && (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onAnimationStart={() => {
                    if (contentRef.current) contentRef.current.scrollTop = 0
                  }}
                >
                  {isStudent ? (
                    <>
                      {currentStep === 1 && <Stage1ProductVault />}
                      {currentStep === 2 && <Stage2ConditionTriage />}
                      {currentStep === 3 && <Stage3HazardousMaterials />}
                      {currentStep === 4 && <Stage4DataWipeProtocol />}
                      {currentStep === 5 && <Stage5KioskSelection />}
                      {currentStep === 6 && <Stage6EphemeralQRPass />}
                    </>
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 rounded-2xl liquid-glass border border-amber/30">
                      <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center text-amber mx-auto shadow-amber-glow">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Access Restricted: Student Role Required
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Student Drop-Off is strictly reserved for students submitting hardware. College administrators and kiosk operators must use their dedicated modules.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab(isCollegeAdmin ? 'tech_vault' : 'kiosk_terminal')}
                        className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-bright active:scale-95 text-black font-bold text-xs shadow-cyan-glow transition-all cursor-pointer"
                      >
                        {isCollegeAdmin ? 'Go to Admin Tech Vault' : 'Go to Kiosk Terminal'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'kiosk_terminal' && (
                <motion.div
                  key="kiosk_terminal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCollegeAdmin || isKioskOperator ? (
                    <KioskOperatorTerminal />
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 rounded-2xl liquid-glass border border-amber/30">
                      <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center text-amber mx-auto shadow-amber-glow">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Access Restricted: Operator or Admin Authorization Required
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        You are authenticated as <strong>{currentUser?.name} (Student)</strong>. The Kiosk Operator Terminal and Hardware Verification console are restricted to authorized university facility managers and laboratory custodians.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('student_flow')}
                        className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-bright active:scale-95 text-black font-bold text-xs shadow-cyan-glow transition-all cursor-pointer"
                      >
                        Return to Student Drop-Off
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'tech_vault' && (
                <motion.div
                  key="tech_vault"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isStudent || isCollegeAdmin ? (
                    <TechVaultDrawer />
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 rounded-2xl liquid-glass border border-amber/30">
                      <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center text-amber mx-auto shadow-amber-glow">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Access Restricted: Kiosk Operator
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Kiosk operators are authorized exclusively for hardware intake at the physical pod and do not have access to institutional submission records.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('kiosk_terminal')}
                        className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-bright active:scale-95 text-black font-bold text-xs shadow-cyan-glow transition-all cursor-pointer"
                      >
                        Return to Operator Terminal
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'sponsorships' && (
                <motion.div
                  key="sponsorships"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCollegeAdmin ? (
                    <CollegeAdminSponsorships />
                  ) : (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 rounded-2xl liquid-glass border border-amber/30">
                      <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center text-amber mx-auto shadow-amber-glow">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Access Restricted: Campus Administrator Role Required
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Corporate sponsorship applications and partnership approvals are restricted strictly to authorized university administrators and platform secretariat officials.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab(isStudent ? 'student_flow' : 'kiosk_terminal')}
                        className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-bright active:scale-95 text-black font-bold text-xs shadow-cyan-glow transition-all cursor-pointer"
                      >
                        Return to Authorized Portal
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
