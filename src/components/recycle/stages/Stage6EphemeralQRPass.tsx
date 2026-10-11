import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import {
  QrCode,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  Flame,
  AlertTriangle,
  RotateCcw,
  MonitorCheck,
  FolderArchive
} from 'lucide-react'
import { useRecycleStore } from '../../../store/useRecycleStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { PrintableCertificateModal } from '../PrintableCertificate'

export const Stage6EphemeralQRPass: React.FC = () => {
  const { currentUser } = useAuthStore()
  const {
    activePass,
    setActiveTab,
    lookupPass,
    resetWizard,
    condition
  } = useRecycleStore()

  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  // Calculate remaining time for 1-Day Pass (in hours, and in minutes when <= 1 hour; no seconds)
  const getRemainingStatus = () => {
    if (!activePass?.expiresAt) {
      return { text: '24h REMAINING', isLow: false }
    }
    const diffMs = activePass.expiresAt - Date.now()
    if (diffMs <= 0) {
      return { text: 'EXPIRED', isLow: true }
    }
    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)

    if (hours >= 1) {
      // More than 1 hour remaining: display strictly in hours
      return { text: `${hours}h REMAINING`, isLow: false }
    } else {
      // 1 hour or less remaining: display in minutes (no seconds)
      const minutes = Math.max(1, totalMinutes)
      return { text: `${minutes}m REMAINING`, isLow: minutes < 15 }
    }
  }

  const [timeRemaining, setTimeRemaining] = useState(getRemainingStatus)

  useEffect(() => {
    if (activePass?.qrPayload) {
      QRCode.toDataURL(activePass.qrPayload, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#050608',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err))
    }
  }, [activePass])

  // Periodic timer: updates calmly every 30 seconds without ticking every second
  useEffect(() => {
    setTimeRemaining(getRemainingStatus())
    const timer = setInterval(() => {
      setTimeRemaining(getRemainingStatus())
    }, 30000)
    return () => clearInterval(timer)
  }, [activePass?.expiresAt])

  const copyRef = () => {
    if (activePass?.passId) {
      navigator.clipboard.writeText(activePass.passId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!activePass) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-text-muted">No active pass. Return to Stage 1 to discover a product.</p>
        <button
          type="button"
          onClick={resetWizard}
          className="px-4 py-2 rounded-full bg-emerald text-background text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-emerald-glow"
        >
          Start New Drop-Off
        </button>
      </div>
    )
  }

  const isAccepted = activePass.status === 'accepted'

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1 text-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          STAGE 6 OF 6 • HANDOVER READY
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Your device is ready for handover
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
          Present this optical 1-day pass at the collection pod. The automated scale will verify your mass and lock the disposal hatch.
        </p>
      </div>

      {/* PASS TICKET / CARD (APPLE PASSBOOK / SPATIAL TICKET STYLE) */}
      <div className="max-w-md mx-auto rounded-3xl liquid-glass specular-rim overflow-hidden shadow-2xl border border-white/15">
        {/* TOP STATUS BAR */}
        <div
          className={`px-5 py-3 border-b flex items-center justify-between text-xs font-mono ${
            isAccepted
              ? 'bg-emerald/20 border-emerald/40 text-emerald'
              : 'bg-white/[0.04] border-white/10 text-cyan'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {isAccepted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald" />
                <span>HANDOVER VERIFIED & ACCEPTED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan" />
                <span>1-DAY DEPOSIT PASS</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-copper" />
            <span className={timeRemaining.isLow ? 'text-amber font-bold animate-pulse' : 'text-text-secondary'}>
              {isAccepted ? 'REDEEMED' : timeRemaining.text}
            </span>
          </div>
        </div>

        {/* MAIN BODY: QR CODE & TELEMETRY */}
        <div className="p-6 text-center space-y-4">
          {/* TOKEN REFERENCE PILL */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-mono font-bold text-text-primary">
              {activePass.passId}
            </span>
            <button
              type="button"
              onClick={copyRef}
              className="text-text-muted hover:text-emerald transition-colors cursor-pointer active:scale-95 p-0.5"
              title="Copy Reference"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] text-emerald font-mono">COPIED</span>}
          </div>

          {/* SCANNABLE QR CODE CONTAINER */}
          <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Pass ${activePass.passId}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="animate-pulse w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-mono text-xs">
                Generating QR...
              </div>
            )}

            {isAccepted && (
              <div className="absolute inset-0 bg-emerald/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-black font-bold p-3">
                <CheckCircle2 className="w-12 h-12 text-black mb-1 animate-bounce" />
                <span className="text-base font-extrabold">VERIFIED & DEPOSITED</span>
                <span className="text-xs font-mono">Receipt In Tech Vault</span>
              </div>
            )}
          </div>

          {/* TELEMETRY SPECS GRID */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-text-muted block">HARDWARE MODEL</span>
              <span className="font-bold text-text-primary truncate block">
                {activePass.productName}
              </span>
              <span className="text-[10px] text-text-secondary truncate block">
                {activePass.variant}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-text-muted block">VERIFIED MASS</span>
              <span className="font-bold text-emerald text-sm block">
                {activePass.declaredMassGrams} g
              </span>
              <span className="text-[10px] text-text-secondary block">
                {(activePass.declaredMassGrams / 1000).toFixed(3)} kg
              </span>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] text-text-muted block">CONDITION TRIAGE</span>
              <span
                className={`font-bold capitalize ${
                  activePass.isHazmat ? 'text-amber' : 'text-text-primary'
                }`}
              >
                {activePass.condition.replace('_', ' ')}
              </span>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-right">
              <span className="text-[10px] text-text-muted block">DATA-WIPE STATE</span>
              <span className="font-bold text-cyan">
                {activePass.dataWipeException ? 'Shredder Exception' : 'Cryptographic Wipe'}
              </span>
            </div>
          </div>

          {/* KIOSK LOCATION NOTE */}
          <div className="p-3 rounded-xl bg-cyan/10 border border-cyan/20 text-xs text-left flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold text-text-primary block truncate">
                {activePass.kioskName}
              </span>
              <span className="text-[11px] text-text-secondary block truncate">
                {activePass.campusName} • Assigned Locker Slot Reserved
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-text-muted hover:text-text-primary hover:bg-white/5 transition-all border border-white/10 cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save Pass (1 Page)</span>
          </button>

          {/* FOR STUDENTS: VIEW IN MY TECH VAULT. FOR ADMIN/OPERATOR: SIMULATE TERMINAL */}
          {currentUser?.role === 'college_admin' || currentUser?.role === 'kiosk_operator' ? (
            <button
              type="button"
              onClick={() => {
                lookupPass(activePass.passId)
                setActiveTab('kiosk_terminal')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              <span>Launch Kiosk Terminal Scan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTab('tech_vault')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>View in My Tech Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* START ANOTHER DROP-OFF BUTTON */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={resetWizard}
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-emerald transition-all font-mono cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Prepare another device submission</span>
        </button>
      </div>

      {/* PRINTABLE OFFICIAL CERTIFICATE MODAL */}
      {isPrintModalOpen && activePass && (
        <PrintableCertificateModal
          pass={activePass}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  )
}
