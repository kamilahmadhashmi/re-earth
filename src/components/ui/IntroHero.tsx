import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Orbit } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'

export const IntroHero: React.FC = () => {
  const { isIntro, enterWorld } = useWorldStore()

  if (!isIntro) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-30 flex items-center justify-center p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl w-full space-y-6 pointer-events-auto p-8 rounded-xl bg-[#131922] border border-white/10 shadow-2xl"
        >
          {/* Hardware Telemetry Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-[2px] bg-emerald" />
              <span className="text-xs font-medium text-text-primary">
                Global Impact Telemetry Console
              </span>
            </div>
            <span className="text-xs font-mono text-copper">
              18 Campuses Active
            </span>
          </div>

          {/* Solid Confident Typographic Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
              Turn Dead Tech into Living Earth.
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Universities rise as holographic architectural towers sized by verified e-waste diversion,
              crowned by corporate sustainability partners.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={enterWorld}
              className="w-full sm:w-auto px-7 py-3 rounded-md bg-emerald text-background font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all"
            >
              Enter the World Console
            </button>
          </div>

          {/* Reassurance Row */}
          <div className="flex items-center gap-4 text-xs font-mono text-text-muted pt-2 border-t border-white/[0.06]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-copper" />
              <span>Zero Honor-System Bias</span>
            </span>
            <span className="text-white/15">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-copper" />
              <span>Spatial WebGL Telemetry</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default IntroHero
