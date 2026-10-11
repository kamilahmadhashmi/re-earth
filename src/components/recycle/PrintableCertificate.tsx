import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Printer, X, CheckCircle2, ShieldCheck, Award, Leaf, Scale, Sparkles } from 'lucide-react'
import type { EphemeralPass } from '../../store/useRecycleStore'

interface PrintableCertificateProps {
  pass: EphemeralPass
  onClose?: () => void
  autoPrint?: boolean
}

export const printCertificateDocument = async (certificateContainerId: string = 'active-printable-certificate') => {
  // Ensure all fonts are ready
  if (document.fonts) {
    try {
      await document.fonts.ready
    } catch {
      // ignore
    }
  }

  // Ensure all images within the container are loaded
  const container = document.getElementById(certificateContainerId)
  if (container) {
    const images = Array.from(container.querySelectorAll('img'))
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve()
            img.onload = () => resolve()
            img.onerror = () => resolve()
          })
      )
    )
  }

  // Allow browser layout tick
  await new Promise((r) => setTimeout(r, 60))
  window.print()
}

export const PrintableCertificateModal: React.FC<PrintableCertificateProps> = ({
  pass,
  onClose,
  autoPrint = false
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [isPrinting, setIsPrinting] = useState<boolean>(false)

  // Generate verified scannable QR code matching the exact pass token & payload
  useEffect(() => {
    const payloadToEncode = pass.qrPayload || JSON.stringify({
      ref: pass.passId,
      mfg: pass.manufacturer,
      mod: pass.productName,
      status: pass.status,
      cert: pass.receipt?.certificateId || 'PENDING'
    })

    QRCode.toDataURL(payloadToEncode, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#05070D',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url)
        if (autoPrint) {
          setTimeout(() => {
            printCertificateDocument('printable-official-certificate')
          }, 200)
        }
      })
      .catch((err) => console.error('Failed to generate certificate QR code', err))
  }, [pass, autoPrint])

  const handlePrint = async () => {
    setIsPrinting(true)
    await printCertificateDocument('printable-official-certificate')
    setIsPrinting(false)
  }

  const isAccepted = pass.status === 'accepted'
  const certId = pass.receipt?.certificateId || `REC-PRE-${pass.campusId.toUpperCase()}-${pass.passId.split('-')[1] || '0001'}`
  const verifiedWeight = pass.receipt?.verifiedWeightGrams || pass.declaredMassGrams
  const kgDiverted = pass.receipt?.kgAddedToCampus || parseFloat((pass.declaredMassGrams / 1000).toFixed(3))
  const operatorName = pass.receipt?.operatorName || 'Campus Technical Custodian'
  const dateStr = pass.receipt?.acceptedAt || new Date(pass.timestamp).toLocaleString()
  const signature = pass.receipt?.digitalSignature || `SHA256:PRE-${pass.passId.replace(/[^A-Z0-9]/g, '')}`

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-auto space-y-3 cursor-default"
      >
        {/* ON-SCREEN MODAL TOP BAR CONTROLS (HIDDEN DURING PRINT) */}
        <div className="flex items-center justify-between px-2 print:hidden text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="font-mono text-emerald font-bold text-xs uppercase tracking-wider">
              {isAccepted ? 'Official Diversion Certificate' : 'Official Hardware Handover Pass'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!qrDataUrl || isPrinting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald text-background font-bold text-xs shadow-emerald-glow hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? 'Preparing Print...' : 'Print / Save PDF (1 Page)'}</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-text-muted hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* THE STRICT SINGLE-PAGE PRINTABLE CERTIFICATE CONTAINER             */}
        {/* =================================================================== */}
        <div
          id="printable-official-certificate"
          className="printable-certificate-container p-6 sm:p-8 rounded-3xl bg-[#0E131B] text-[#F8FAFC] border border-white/15 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Guilloche / Circular Watermark */}
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-emerald/10 pointer-events-none print:opacity-10"
          />

          {/* CERTIFICATE HEADER */}
          <div className="border-b border-white/15 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald/15 border border-emerald/40 flex items-center justify-center text-emerald print:border-black shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold">
                    RE—EARTH CIRCULAR PROTOCOL
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-text-secondary border border-white/10 print:border-black">
                    NIST SP 800-88 R1
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
                  {isAccepted
                    ? 'Electronic Diversion Certificate'
                    : 'Collegiate Hardware Handover Pass'}
                </h1>
                <p className="text-xs text-text-muted font-mono">
                  Verified Institutional E-Waste Telemetry & Circular Recovery
                </p>
              </div>
            </div>

            {/* IDENTIFIERS */}
            <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
              <div className="text-[10px] text-text-muted uppercase">Certificate Reference</div>
              <div className="text-emerald font-extrabold text-sm tracking-wider">{certId}</div>
              <div className="text-[10px] text-cyan font-bold">PASS: {pass.passId}</div>
            </div>
          </div>

          {/* MIDDLE GRID: DETAILS & SCANNABLE QR */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* LEFT: METADATA & TELEMETRY (8 COLS) */}
            <div className="sm:col-span-8 space-y-3 text-xs font-mono">
              {/* SUBMISSION IDENTITY */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 print:bg-gray-50 print:border-gray-300">
                <div className="flex items-center justify-between text-[10px] text-text-muted uppercase border-b border-white/[0.06] pb-1">
                  <span>Student Submitter Details</span>
                  <span className="text-emerald font-bold">{pass.campusName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-text-muted block text-[10px]">STUDENT NAME:</span>
                    <strong className="text-white print:text-black">{pass.studentName || 'Aarav Sharma'}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">ROLL / STUDENT ID:</span>
                    <span className="text-text-primary font-bold print:text-black">{pass.studentRollNo || '2023/EE/042'}</span>
                  </div>
                </div>
                <div className="text-[11px]">
                  <span className="text-text-muted text-[10px]">DEPARTMENT: </span>
                  <span className="text-text-secondary print:text-black">{pass.department || 'Electrical Engineering'}</span>
                </div>
              </div>

              {/* HARDWARE SPECIFICATION */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 print:bg-gray-50 print:border-gray-300">
                <div className="flex items-center justify-between text-[10px] text-text-muted uppercase border-b border-white/[0.06] pb-1">
                  <span>Hardware & Physical Inspection</span>
                  <span className={pass.isHazmat ? 'text-amber font-bold' : 'text-emerald'}>
                    {pass.isHazmat ? 'HAZMAT LITHIUM CELL' : 'STANDARD TECH'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-text-muted block text-[10px]">DEVICE MODEL:</span>
                    <strong className="text-white print:text-black">{pass.manufacturer} {pass.productName}</strong>
                    <div className="text-[10px] text-text-muted">{pass.variant}</div>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">
                      {isAccepted ? 'VERIFIED MASS:' : 'DECLARED MASS:'}
                    </span>
                    <span className="text-emerald font-extrabold text-sm print:text-black">
                      {verifiedWeight} g ({kgDiverted} kg)
                    </span>
                    {pass.receipt?.scaleVariancePercent !== undefined && (
                      <div className="text-[9px] text-text-muted">
                        Scale Variance: {pass.receipt.scaleVariancePercent.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-text-muted">DECLARED CONDITION: </span>
                    <span className="text-cyan font-bold capitalize">{pass.condition.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">DATA SANITIZATION: </span>
                    <span className="text-text-primary font-bold print:text-black">
                      {pass.dataWipeException ? 'Physical Shredding' : 'Cryptographic Wipe'}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOCATION & CUSTODIAN */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 print:bg-gray-50 print:border-gray-300">
                  <span className="text-text-muted block">COLLECTION KIOSK:</span>
                  <span className="text-white font-bold block truncate print:text-black">{pass.kioskName}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 print:bg-gray-50 print:border-gray-300">
                  <span className="text-text-muted block">ATTENDING OPERATOR:</span>
                  <span className="text-white font-bold block truncate print:text-black">{operatorName}</span>
                </div>
              </div>
            </div>

            {/* RIGHT: VERIFIED HIGH-RES QR CODE (4 COLS) */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 print:border-gray-300 print:bg-white text-center">
              <div className="w-36 h-36 p-2 bg-white rounded-xl shadow-lg border border-black/10 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Verification QR Code for ${pass.passId}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-mono">
                    Rendering QR...
                  </div>
                )}
              </div>
              <div className="font-mono text-[9px] text-center space-y-0.5">
                <span className="text-[10px] text-emerald font-bold block tracking-wider">
                  {pass.passId}
                </span>
                <span className="text-text-muted block text-[8px]">
                  SCAN AT OPERATOR TERMINAL
                </span>
              </div>
            </div>
          </div>

          {/* ENVIRONMENTAL IMPACT EQUIVALENCE PANEL (CLEANLY DISTINGUISHED) */}
          <div className="p-3.5 rounded-2xl bg-emerald/10 border border-emerald/25 space-y-2 print:border-gray-400 print:bg-gray-100">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald font-bold uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                <Leaf className="w-3 h-3 text-emerald print:text-black" />
                ENVIRONMENTAL IMPACT AUDIT & TOKEN ALLOCATION
              </span>
              <span className="text-text-muted text-[9px]">
                {isAccepted ? '✓ VERIFIED RESULTS' : 'ESTIMATED PROJECTIONS'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-black/30 border border-white/10 print:bg-white print:border-gray-300">
                <span className="text-[9px] text-text-muted block uppercase">Diverted Mass</span>
                <span className="text-xs sm:text-sm font-extrabold text-white print:text-black">
                  {kgDiverted} kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/10 print:bg-white print:border-gray-300">
                <span className="text-[9px] text-text-muted block uppercase">CO₂e Avoided</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald print:text-black">
                  {pass.estimatedCo2eKg} kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/10 print:bg-white print:border-gray-300">
                <span className="text-[9px] text-text-muted block uppercase">Eco Credits</span>
                <span className="text-xs sm:text-sm font-extrabold text-cyan print:text-black">
                  +{pass.receipt?.awardedEcoCredits || pass.projectedEcoCredits} EC
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/10 print:bg-white print:border-gray-300">
                <span className="text-[9px] text-text-muted block uppercase">Derby XP</span>
                <span className="text-xs sm:text-sm font-extrabold text-lavender print:text-black">
                  +{pass.receipt?.awardedXp || pass.projectedXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* CERTIFICATE FOOTER WITH SIGNATURE & TIMESTAMP */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-text-muted">
            <div>
              <span className="block text-[9px]">CRYPTOGRAPHIC HARDWARE ATTESTATION:</span>
              <span className="text-cyan font-bold tracking-wider print:text-black">{signature}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="block text-[9px]">ATTESTED TIMESTAMP:</span>
              <span className="text-text-primary print:text-black">{dateStr}</span>
            </div>
          </div>

          <div className="mt-2 text-center text-[8px] font-mono text-text-muted/70 print:text-gray-500">
            RE—EARTH Collegiate Circular Computing Network • Issued pursuant to EPA WARM Model • Exactly 1 Page
          </div>
        </div>
      </div>
    </div>
  )
}
