import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderArchive,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Sparkles,
  Leaf,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Printer,
  GraduationCap,
  Shield,
  ShieldAlert
} from 'lucide-react'
import { useRecycleStore, type EphemeralPass } from '../../../store/useRecycleStore'
import { useAuthStore } from '../../../store/useAuthStore'

export const TechVaultDrawer: React.FC = () => {
  const { savedPasses, lookupPass, setActiveTab } = useRecycleStore()
  const { currentUser } = useAuthStore()
  const [selectedReceiptPass, setSelectedReceiptPass] = useState<EphemeralPass | null>(null)

  const isCollegeAdmin = currentUser?.role === 'college_admin'
  const isKioskOperator = currentUser?.role === 'kiosk_operator'

  // Filter submissions by role:
  // - Students can ONLY see their own submissions (privacy isolation).
  // - College Admins see all institutional submissions with full submitter telemetry.
  // - Kiosk Operators are restricted from vault view.
  const visiblePasses = isCollegeAdmin
    ? savedPasses
    : savedPasses.filter((p) => {
        if (!currentUser) return false
        if (p.userId && p.userId === currentUser.id) return true
        if (p.studentRollNo && currentUser.studentRollNo && p.studentRollNo === currentUser.studentRollNo) return true
        if (p.studentName && currentUser.name && p.studentName === currentUser.name) return true
        return false
      })

  const acceptedPasses = visiblePasses.filter((p) => p.status === 'accepted')
  const totalKg = acceptedPasses.reduce(
    (sum, p) => sum + (p.receipt?.kgAddedToCampus || p.declaredMassGrams / 1000),
    0
  )
  const totalEcoCredits = acceptedPasses.reduce(
    (sum, p) => sum + (p.receipt?.awardedEcoCredits || p.projectedEcoCredits),
    0
  )
  const totalXp = acceptedPasses.reduce(
    (sum, p) => sum + (p.receipt?.awardedXp || p.projectedXp),
    0
  )

  // Kiosk operators are not authorized to view the Tech Vault
  if (isKioskOperator) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-8 rounded-2xl liquid-glass border border-amber/30">
        <div className="w-12 h-12 rounded-2xl bg-amber/20 border border-amber/40 flex items-center justify-center text-amber mx-auto shadow-amber-glow">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          Access Restricted: Kiosk Operator Role
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Kiosk operators are authorized exclusively for the hardware verification terminal. Access to student personal submission histories and administrative ledgers is restricted.
        </p>
        <button
          onClick={() => setActiveTab('kiosk_terminal')}
          className="px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-bright text-black font-bold text-xs shadow-cyan-glow transition-all cursor-pointer"
        >
          Return to Operator Terminal
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* VAULT SUMMARY HERO */}
      <div className="p-6 rounded-3xl liquid-glass specular-rim space-y-4 shadow-liquid-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald/20 border border-emerald/40 flex items-center justify-center text-emerald shadow-emerald-glow">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold block">
                {isCollegeAdmin ? 'INSTITUTIONAL AUDIT LEDGER • CAMPUS ADMINISTRATION' : 'STUDENT TELEMETRY ARCHIVE • MY SUBMISSIONS'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                {isCollegeAdmin ? 'Campus Tech Vault & Institutional Audit Ledger' : 'My Tech Vault & Verified Certificates'}
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary">
            {visiblePasses.length} Submissions Logged
          </span>
        </div>

        {/* 3 AGGREGATE STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              {isCollegeAdmin ? 'Campus Diverted' : 'My Diverted Hardware'}
            </span>
            <div className="text-2xl font-black font-mono text-emerald mt-0.5">
              {totalKg.toFixed(2)} <span className="text-xs font-normal">KG</span>
            </div>
            <p className="text-[10px] text-text-secondary">Zero virgin extraction</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              {isCollegeAdmin ? 'Institutional Eco Credits' : 'My Eco Credits'}
            </span>
            <div className="text-2xl font-black font-mono text-cyan mt-0.5">
              +{totalEcoCredits} <span className="text-xs font-normal">EC</span>
            </div>
            <p className="text-[10px] text-text-secondary">Campus cafeteria & merch tokens</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              {isCollegeAdmin ? 'Campus Derby Contribution' : 'My Derby XP Surge'}
            </span>
            <div className="text-2xl font-black font-mono text-lavender mt-0.5">
              +{totalXp} <span className="text-xs font-normal">XP</span>
            </div>
            <p className="text-[10px] text-text-secondary">Contributed to campus leaderboard</p>
          </div>
        </div>
      </div>

      {/* SUBMISSION HISTORY LIST */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
          {isCollegeAdmin ? 'Audited Campus Submissions & Submitter Profiles' : 'My Audited Passes & Active Reservations'}
        </span>

        {/* Natural vertical flow inside parent modal scroll container (removes nested wheel trap) */}
        <div className="space-y-2.5">
          {visiblePasses.length === 0 && (
            <div className="p-8 rounded-2xl liquid-glass-subtle border border-white/10 text-center space-y-2">
              <FolderArchive className="w-8 h-8 text-text-muted mx-auto opacity-40" />
              <h4 className="text-sm font-bold text-text-primary">No Submissions Found</h4>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                {isCollegeAdmin
                  ? 'No student hardware submissions logged for this campus ledger.'
                  : `No drop-offs recorded for ${currentUser?.name || 'this account'}. Use Student Drop-Off to submit hardware.`}
              </p>
            </div>
          )}

          {visiblePasses.map((p) => {
            const isAccepted = p.status === 'accepted'
            const isRejected = p.status === 'rejected'

            return (
              <div
                key={p.passId}
                className="p-4 rounded-2xl liquid-glass-subtle border border-white/[0.08] hover:border-white/20 transition-all flex flex-col gap-3 group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isAccepted
                          ? 'bg-emerald/20 text-emerald border border-emerald/40'
                          : isRejected
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-cyan/20 text-cyan border border-cyan/40'
                      }`}
                    >
                      {isAccepted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isRejected ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-text-primary">
                          {p.passId}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded-full font-bold ${
                            isAccepted
                              ? 'bg-emerald/20 text-emerald'
                              : isRejected
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber/20 text-amber'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-text-primary truncate mt-0.5">
                        {p.productName} ({p.variant})
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5 font-mono">
                        <span>{p.declaredMassGrams}g</span>
                        <span>•</span>
                        <span className="truncate">{p.kioskName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isAccepted && p.receipt && (
                      <button
                        onClick={() => setSelectedReceiptPass(p)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald hover:bg-emerald/10 border border-emerald/30 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    )}

                    {/* KIOSK OPERATOR TERMINAL INSPECTION: RESTRICTED STRICTLY TO COLLEGE ADMIN */}
                    {isCollegeAdmin && (
                      <button
                        onClick={() => {
                          lookupPass(p.passId)
                          setActiveTab('kiosk_terminal')
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-mono text-text-muted hover:text-cyan border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Inspect in Terminal
                      </button>
                    )}
                  </div>
                </div>

                {/* COLLEGE ADMIN AUDIT DETAILS: SUBMITTER PROFILE & REPOSITORY METADATA */}
                {isCollegeAdmin && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="font-bold">{p.studentName || 'Student Submitter'}</span>
                    </span>
                    {p.studentRollNo && (
                      <span className="text-text-muted">
                        Roll: <strong className="text-text-primary">{p.studentRollNo}</strong>
                      </span>
                    )}
                    {p.department && (
                      <span className="text-text-secondary hidden sm:inline">
                        • {p.department}
                      </span>
                    )}
                    <span className="text-text-muted ml-auto text-[10px]">
                      {p.campusName}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL DIALOG FOR CERTIFICATE DETAIL */}
      <AnimatePresence>
        {selectedReceiptPass?.receipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg liquid-glass specular-rim p-6 rounded-3xl border border-emerald/40 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center text-emerald">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Official E-Waste Diversion Certificate
                    </h3>
                    <p className="text-[10px] font-mono text-emerald">
                      CERT ID: {selectedReceiptPass.receipt.certificateId}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReceiptPass(null)}
                  className="px-3 py-1 rounded-full text-xs text-text-muted hover:text-text-primary border border-white/10"
                >
                  Close
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">Item Diverted:</span>
                  <span className="font-bold text-text-primary">
                    {selectedReceiptPass.productName} ({selectedReceiptPass.variant})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Certified Mass:</span>
                  <span className="font-bold text-emerald">
                    {selectedReceiptPass.receipt.verifiedWeightGrams} g (
                    {selectedReceiptPass.receipt.kgAddedToCampus} kg)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Collection Pod:</span>
                  <span className="text-text-primary">{selectedReceiptPass.receipt.kioskName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Campus Host:</span>
                  <span className="text-text-primary">{selectedReceiptPass.receipt.campusName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Attending Operator:</span>
                  <span className="text-text-primary">{selectedReceiptPass.receipt.operatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Verification Timestamp:</span>
                  <span className="text-text-primary">{selectedReceiptPass.receipt.acceptedAt}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-text-muted">Cryptographic Proof:</span>
                  <span className="text-[10px] text-cyan font-mono">
                    {selectedReceiptPass.receipt.digitalSignature}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-text-primary flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
