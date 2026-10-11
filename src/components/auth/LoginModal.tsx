import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  GraduationCap,
  KeyRound,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Building,
  UserCheck,
  Scan
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useWorldStore } from '../../store/useWorldStore'
import { PRESET_USERS } from '../../types/auth'

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    authError,
    isLoading,
    expiredMessage,
    clearError
  } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'operator'>('student')
  const [email, setEmail] = useState<string>('aarav.sharma@dtu.ac.in')
  const [password, setPassword] = useState<string>('pass123')

  const handleClose = () => {
    closeLoginModal()
    const currentModal = useWorldStore.getState().activeModal
    if (
      currentModal === 'recycle' ||
      currentModal === 'vault' ||
      currentModal === 'terminal' ||
      currentModal === 'sponsorships'
    ) {
      useWorldStore.getState().openModal(null)
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoginModalOpen])

  if (!isLoginModalOpen) return null

  const handleTabChange = (tab: 'student' | 'admin' | 'operator') => {
    setActiveTab(tab)
    clearError()
    if (tab === 'student') {
      setEmail('aarav.sharma@dtu.ac.in')
      setPassword('pass123')
    } else if (tab === 'admin') {
      setEmail('kavita.sharma@dtu.ac.in')
      setPassword('admin123')
    } else {
      setEmail('arun.verma@dtu.ac.in')
      setPassword('operator123')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-2xl"
    >
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose()
        }}
        className="min-h-full flex items-center justify-center p-4 sm:p-6 pointer-events-none"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-lg my-auto rounded-3xl liquid-glass specular-rim shadow-2xl border border-white/15 overflow-hidden flex flex-col relative"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-text-muted hover:text-text-primary transition-all border border-white/10 z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Strip */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              SMRT KIOSK IDENTITY PORTAL
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Authenticate Session
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Sign in with verified credentials to access authorized drop-off lockers, view vault records, or operate kiosk terminals.
          </p>

          {/* Three-Role Segmented Controller */}
          <div className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold cursor-pointer transition-all active:scale-95 ${
                activeTab === 'student'
                  ? 'bg-cyan text-black shadow-cyan-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="truncate">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold cursor-pointer transition-all active:scale-95 ${
                activeTab === 'admin'
                  ? 'bg-emerald text-black shadow-emerald-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="truncate">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('operator')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold cursor-pointer transition-all active:scale-95 ${
                activeTab === 'operator'
                  ? 'bg-amber text-black shadow-amber-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span className="truncate">Operator</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Expired or Logout Notice */}
          {expiredMessage && (
            <div className="p-3 rounded-xl bg-cyan/10 border border-cyan/30 text-xs text-cyan flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{expiredMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="p-3 rounded-xl bg-amber/15 border border-amber/40 text-xs text-amber flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono text-text-secondary uppercase mb-1">
                Institutional Email / ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.ac.in"
                  className="w-full bg-black/60 text-text-primary text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-text-secondary uppercase mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 text-text-primary text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 mt-2 cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                activeTab === 'student'
                  ? 'bg-cyan hover:bg-cyan-bright text-black shadow-cyan-glow'
                  : activeTab === 'admin'
                  ? 'bg-emerald hover:bg-emerald-bright text-black shadow-emerald-glow'
                  : 'bg-amber hover:bg-amber-bright text-black shadow-amber-glow'
              }`}
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In To Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Fill Presets for Instant Testing */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              Quick-Fill Test Credentials:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              {activeTab === 'student' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('aarav.sharma@dtu.ac.in')
                      setPassword('pass123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-cyan">Aarav Sharma</div>
                      <div className="text-[10px] text-text-muted truncate">DTU Student • Roll #042</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('priya.verma@nsut.ac.in')
                      setPassword('pass123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-cyan">Priya Verma</div>
                      <div className="text-[10px] text-text-muted truncate">NSUT Student • Roll #118</div>
                    </div>
                  </button>
                </>
              )}

              {activeTab === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('kavita.sharma@dtu.ac.in')
                      setPassword('admin123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-emerald">Kavita Sharma</div>
                      <div className="text-[10px] text-text-muted truncate">DTU Facility Director (Admin)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('dean.sustainability@nsut.ac.in')
                      setPassword('admin123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-emerald">Dr. Mukherjee</div>
                      <div className="text-[10px] text-text-muted truncate">NSUT Sustainability Dean</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('central.admin@re-earth.eco')
                      setPassword('admin123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group sm:col-span-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-cyan shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-cyan">Dr. Alistair Vance (Central Admin)</div>
                      <div className="text-[10px] text-text-muted truncate">RE—EARTH Global Secretariat • Cross-Campus Matching</div>
                    </div>
                  </button>
                </>
              )}

              {activeTab === 'operator' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('arun.verma@dtu.ac.in')
                      setPassword('operator123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <Scan className="w-3.5 h-3.5 text-amber shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-amber">Arun Verma</div>
                      <div className="text-[10px] text-text-muted truncate">DTU Mech Pod Kiosk Operator</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('deepak.joshi@nsut.ac.in')
                      setPassword('operator123')
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] cursor-pointer border border-white/10 text-left transition-all flex items-center gap-2 group"
                  >
                    <Scan className="w-3.5 h-3.5 text-amber shrink-0" />
                    <div className="truncate">
                      <div className="text-text-primary font-bold group-hover:text-amber">Deepak Joshi</div>
                      <div className="text-[10px] text-text-muted truncate">NSUT Sector-3 Kiosk Operator</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-text-muted flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
            <span>
              Explicit Logout Security: User switching is disabled during an active session. You must explicitly log out before another user can sign in.
            </span>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
