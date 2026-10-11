import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe2 } from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'

export const SponsorSkylineHUD: React.FC = () => {
  const { viewMode, setViewMode } = useWorldStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'skyline') {
        setViewMode('globe')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, setViewMode])

  if (viewMode !== 'skyline') return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.button
        type="button"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setViewMode('globe')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#131922] border border-white/10 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/20 active:scale-95 cursor-pointer shadow-xl transition-all"
        title="Return to World View (Esc)"
      >
        <Globe2 className="w-3.5 h-3.5 text-copper" />
        <span>Back to World</span>
        <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
          Esc
        </kbd>
      </motion.button>
    </div>
  )
}

export default SponsorSkylineHUD
