import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, AlertTriangle, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react'
import type { MascotMood } from '../../store/useRecycleStore'

interface MascotVoltProps {
  mood: MascotMood
  message: string
  compact?: boolean
  className?: string
}

export const MascotVolt: React.FC<MascotVoltProps> = ({
  mood,
  message,
  compact = false,
  className = ''
}) => {
  // Eye expression variations based on mood
  const isBlinkingOrHappy = mood === 'celebrating' || mood === 'welcome'
  const isAlert = mood === 'alert_hazard'
  const isSecurity = mood === 'security_wipe'

  return (
    <div className={`relative flex items-center gap-3.5 select-none ${className}`}>
      {/* 1. ANIMATED VECTOR MASCOT CHARACTER */}
      <div className="relative shrink-0 flex items-center justify-center">
        <motion.div
          animate={
            isAlert
              ? { y: [0, -3, 0], scale: [1, 1.04, 1] }
              : isBlinkingOrHappy
              ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
              : { y: [0, -3, 0] }
          }
          transition={{
            duration: isAlert ? 1.2 : 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
        >
          {/* Ambient Cosmic Core Halo */}
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-40 transition-colors duration-500 ${
              isAlert
                ? 'bg-amber-400'
                : isSecurity
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
            }`}
          />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
          >
            <defs>
              {/* Body Gradient */}
              <linearGradient id="voltBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#64D2FF" />
                <stop offset="50%" stopColor="#0A84FF" />
                <stop offset="100%" stopColor="#0040DD" />
              </linearGradient>

              {/* Belly Soft Sheen */}
              <linearGradient id="voltBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
              </linearGradient>

              {/* Hazard Helmet Grad */}
              <linearGradient id="hazardHelmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD60A" />
                <stop offset="100%" stopColor="#FF9F0A" />
              </linearGradient>
            </defs>

            {/* Left Ear / Horn Antenna */}
            <motion.path
              d="M 28 32 C 18 18, 12 10, 20 6 C 26 2, 34 14, 38 28 Z"
              fill="#0A84FF"
              animate={{ rotate: isAlert ? [-5, 8, -5] : [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
            {/* Right Ear / Horn Antenna */}
            <motion.path
              d="M 72 32 C 82 18, 88 10, 80 6 C 74 2, 66 14, 62 28 Z"
              fill="#0A84FF"
              animate={{ rotate: isAlert ? [5, -8, 5] : [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />

            {/* Main Rounded Chibi Body */}
            <path
              d="M 50 14 C 26 14, 14 34, 15 62 C 16 84, 32 94, 50 94 C 68 94, 84 84, 85 62 C 86 34, 74 14, 50 14 Z"
              fill="url(#voltBodyGrad)"
            />

            {/* Soft Translucent Belly Patch */}
            <ellipse cx="50" cy="65" rx="22" ry="18" fill="url(#voltBellyGrad)" />

            {/* Rosy Cheeks */}
            <ellipse cx="28" cy="60" rx="5" ry="3" fill="#FF7AB6" opacity="0.6" />
            <ellipse cx="72" cy="60" rx="5" ry="3" fill="#FF7AB6" opacity="0.6" />

            {/* EYES */}
            {isAlert ? (
              // Alert / Concerned Eyes
              <g>
                <circle cx="36" cy="48" r="7" fill="#050608" />
                <circle cx="38" cy="46" r="2.5" fill="#FFFFFF" />
                <circle cx="64" cy="48" r="7" fill="#050608" />
                <circle cx="66" cy="46" r="2.5" fill="#FFFFFF" />
                {/* Slanted Brows */}
                <path d="M 28 38 L 44 42" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 72 38 L 56 42" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : isBlinkingOrHappy ? (
              // Joyful Crescent Happy Eyes (^_^)
              <g>
                <path
                  d="M 30 50 Q 36 42 42 50"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 58 50 Q 64 42 70 50"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              // Wide Anime-Style Eyes with Shiny Catchlights
              <g>
                <circle cx="36" cy="48" r="7.5" fill="#050608" />
                <circle cx="38" cy="45" r="3" fill="#FFFFFF" />
                <circle cx="34" cy="51" r="1.2" fill="#64D2FF" />

                <circle cx="64" cy="48" r="7.5" fill="#050608" />
                <circle cx="66" cy="45" r="3" fill="#FFFFFF" />
                <circle cx="62" cy="51" r="1.2" fill="#64D2FF" />
              </g>
            )}

            {/* MOUTH */}
            {isAlert ? (
              <ellipse cx="50" cy="68" rx="4" ry="5" fill="#050608" />
            ) : isBlinkingOrHappy ? (
              <path
                d="M 44 65 Q 50 73 56 65"
                fill="#FF7AB6"
                stroke="#050608"
                strokeWidth="1.5"
              />
            ) : (
              <path
                d="M 45 66 Q 50 71 55 66"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}

            {/* SPECIAL ACCESSORIES PER MOOD */}
            {isAlert && (
              // Protective Safety Hardhat Badge
              <g transform="translate(30, 2)">
                <path d="M 4 20 Q 20 6 36 20 Z" fill="url(#hazardHelmetGrad)" stroke="#FFD60A" strokeWidth="1" />
                <rect x="16" y="11" width="8" height="8" rx="2" fill="#050608" />
                <path d="M 20 13 L 20 16 M 20 17.5 L 20 18" stroke="#FFD60A" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            )}

            {isSecurity && (
              // Mini Shield Badge on Belly
              <g transform="translate(42, 66)">
                <path
                  d="M 0 0 L 16 0 L 16 8 Q 8 16 0 8 Z"
                  fill="#0A84FF"
                  stroke="#64D2FF"
                  strokeWidth="1"
                />
                <circle cx="8" cy="6" r="2.5" fill="#FFFFFF" />
              </g>
            )}

            {isBlinkingOrHappy && (
              // Star Sparkle on Cheek
              <path
                d="M 80 40 L 82 44 L 86 45 L 82 46 L 80 50 L 78 46 L 74 45 L 78 44 Z"
                fill="#FFD60A"
              />
            )}
          </svg>
        </motion.div>

        {/* Mascot Name Pill */}
        <span className="absolute -bottom-1 text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.2 rounded-full bg-black/60 border border-white/10 text-cyan">
          VOLT
        </span>
      </div>

      {/* 2. APPLE-GRADE DIALOGUE SPEECH BUBBLE */}
      <div className="flex-1 min-w-0">
        <div
          className={`relative p-3 rounded-2xl liquid-glass-subtle specular-rim transition-all border ${
            isAlert
              ? 'border-amber/40 bg-amber/10'
              : isSecurity
              ? 'border-cyan/30 bg-cyan/10'
              : 'border-white/[0.08] bg-white/[0.03]'
          }`}
        >
          {/* Subtle Speech Triangle Notch */}
          <div className="absolute -left-1.5 top-4 w-3 h-3 rotate-45 bg-[#0e1218] border-l border-b border-white/[0.08]" />

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold">
              {isAlert ? (
                <span className="text-amber flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  SAFETY ADVISOR
                </span>
              ) : isSecurity ? (
                <span className="text-cyan flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  PRIVACY PROTOCOL
                </span>
              ) : isBlinkingOrHappy ? (
                <span className="text-emerald flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  CIRCULAR RECOVERY
                </span>
              ) : (
                <span className="text-text-muted flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan" />
                  ASSISTANT
                </span>
              )}
            </div>
            <span className="text-[9px] text-text-muted font-mono">v2.6 AI Companion</span>
          </div>

          <p className="text-xs text-text-primary leading-relaxed mt-1 font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
