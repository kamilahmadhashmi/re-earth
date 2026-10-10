import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Building2 } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'

export const Modals: React.FC = () => {
  const { activeModal, openModal } = useWorldStore()

  if (!activeModal) return null

  const isPitch = activeModal === 'sponsor_pitch'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-surface border border-white/10 rounded-xl p-6 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={() => openModal(null)}
            className="absolute top-4 right-4 w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {isPitch ? (
            /* SPONSOR PITCH MODAL */
            <div className="space-y-5">
              <div className="w-9 h-9 rounded-md bg-copper/15 border border-copper/30 flex items-center justify-center text-copper">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-copper block">
                  Corporate Metallurgy Partner
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  Crown a University Beacon
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Directly underwrite high-density automated recycling kiosks across leading engineering campuses.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald shrink-0" />
                  <span>Audited Scope 3 electronic material diversion ledger</span>
                </div>
                <div className="flex items-center gap-2.5 text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald shrink-0" />
                  <span>Holographic crown architectural wordmark on towers</span>
                </div>
                <div className="flex items-center gap-2.5 text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-[2px] bg-emerald shrink-0" />
                  <span>Verified physical metallurgical recycling flow</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openModal(null)}
                  className="w-full py-3 px-4 rounded-md bg-copper hover:brightness-105 active:scale-[0.98] font-bold text-xs text-background transition-all"
                >
                  Contact University Partnership Desk
                </button>
              </div>
            </div>
          ) : (
            /* COMING NEXT MODAL FOR UNBUILT TABS */
            <div className="space-y-5">
              <div className="w-9 h-9 rounded-md bg-surface-elevated border border-white/15 flex items-center justify-center text-copper">
                <Layers className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-mono font-medium text-copper block">
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
                <p>• Procedural window-grid shaders & live telemetry updates</p>
                <p>• Sponsor Skyline night-city grid view</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openModal(null)}
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
