import React from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Smartphone,
  AlertTriangle,
  Skull,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Info
} from 'lucide-react'
import { useRecycleStore, type ConditionTriage } from '../../../store/useRecycleStore'

interface ConditionOption {
  id: ConditionTriage
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  color: string
  badgeColor: string
  isHazard?: boolean
}

const CONDITION_OPTIONS: ConditionOption[] = [
  {
    id: 'mint',
    title: 'Mint / Functional',
    subtitle: 'Device powers on & operates normally',
    description: 'Optimal for collegiate refurbishment and circular reuse. Minimal scratches, screen & battery operational.',
    icon: Sparkles,
    color: '#30D158',
    badgeColor: 'bg-emerald/15 text-emerald border-emerald/30'
  },
  {
    id: 'cracked',
    title: 'Cracked Screen / Casing',
    subtitle: 'Cosmetic or structural glass fracture',
    description: 'Hardware powers on, but housing or display is compromised. Internal circuits & lithium cells require diagnostic triage.',
    icon: Smartphone,
    color: '#64D2FF',
    badgeColor: 'bg-cyan/15 text-cyan border-cyan/30'
  },
  {
    id: 'dead',
    title: 'Dead / Non-functional',
    subtitle: 'Does not power on or accept charge',
    description: 'Component failure, liquid ingress, or logic board failure. Eligible for precious metal smelting and parts harvesting.',
    icon: Skull,
    color: '#BF5AF2',
    badgeColor: 'bg-lavender/15 text-lavender border-lavender/30'
  },
  {
    id: 'swollen_battery',
    title: 'Swollen / Punctured Battery',
    subtitle: 'CRITICAL HAZARDOUS THERMAL RISK',
    description: 'Battery bulging, pillowing, hot, smelling sweet, or punctured. Standard drop-off disabled. Strictly routed to Hazmat pods.',
    icon: Flame,
    color: '#FF9F0A',
    badgeColor: 'bg-amber/20 text-amber border-amber/40 shadow-amber-glow',
    isHazard: true
  }
]

export const Stage2ConditionTriage: React.FC = () => {
  const {
    selectedProduct,
    customProduct,
    condition,
    setCondition,
    setCurrentStep
  } = useRecycleStore()

  const currentDeviceName =
    selectedProduct?.model || customProduct?.model || 'Hardware Device'
  const currentDeviceMfg =
    selectedProduct?.manufacturer || customProduct?.manufacturer || 'Device'

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          STAGE 2 OF 6 • SAFETY & CONDITION TRIAGE
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Condition Assessment
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Assessing the physical state of your actual{' '}
          <strong className="text-text-primary font-semibold">
            {currentDeviceMfg} {currentDeviceName}
          </strong>
          . This determines whether your hardware is routed for student refurbishment, parts harvesting, or specialized hazardous materials handling.
        </p>
      </div>

      {/* CONDITION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {CONDITION_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const isSelected = condition === opt.id

          return (
            <motion.div
              key={opt.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Select condition: ${opt.title}`}
              whileHover={{ y: -2 }}
              onClick={() => setCondition(opt.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setCondition(opt.id)
                }
              }}
              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 text-left flex flex-col justify-between group relative focus:outline-none focus-visible:ring-2 ${
                opt.isHazard ? 'focus-visible:ring-amber' : 'focus-visible:ring-emerald'
              } ${
                isSelected
                  ? opt.isHazard
                    ? 'bg-amber/15 border-amber/60 shadow-amber-glow ring-1 ring-amber/50'
                    : 'bg-emerald/15 border-emerald/50 shadow-emerald-glow ring-1 ring-emerald/50'
                  : opt.isHazard
                  ? 'liquid-glass-subtle border-amber/20 hover:border-amber/40'
                  : 'liquid-glass-subtle border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {/* TOP HEADER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? opt.isHazard
                          ? 'bg-amber/25 text-amber'
                          : 'bg-emerald/20 text-emerald'
                        : 'bg-white/5 text-text-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${opt.badgeColor}`}
                  >
                    {opt.isHazard ? 'HAZMAT WARNING' : opt.id.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-emerald transition-colors">
                    {opt.title}
                  </h4>
                  <p className="text-[11px] font-mono text-cyan mt-0.5">
                    {opt.subtitle}
                  </p>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {opt.description}
                </p>
              </div>

              {/* SELECTION INDICATOR */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                <span className="text-text-muted">
                  {opt.isHazard ? 'Restricts Kiosk Routing' : 'Standard Drop-off'}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? opt.isHazard
                        ? 'border-amber bg-amber text-black'
                        : 'border-emerald bg-emerald text-black'
                      : 'border-white/20'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* SWOLLEN BATTERY CRITICAL SAFETY WARNING BANNER */}
      {condition === 'swollen_battery' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-amber/15 border border-amber/40 shadow-amber-glow space-y-3 text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber/25 flex items-center justify-center text-amber shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber tracking-tight flex items-center gap-1.5">
                <span>Critical Battery Safety Protocol Engaged</span>
              </h4>
              <p className="text-text-primary mt-1 leading-relaxed">
                A swollen or punctured lithium-ion cell contains volatile pressurized gases and electrolyte vapor that can undergo rapid thermal runaway if punctured, crushed, or charged.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-amber/20 space-y-1.5 text-text-secondary text-[11px]">
            <p className="font-bold text-amber">Mandatory Safety Guidelines for This Drop-Off:</p>
            <p>• <strong>DO NOT</strong> attempt to charge, compress, bend, or puncture the device.</p>
            <p>• <strong>DO NOT</strong> place the device in an ordinary non-certified campus bin.</p>
            <p>• <strong>ISOLATION:</strong> If available, place inside a fire-resistant LiPo safety bag or metal container away from combustibles.</p>
            <p>• <strong>ROUTING LOCK:</strong> You will only be permitted to select Hazmat-Certified campus kiosks equipped with sand fire-suppression chambers.</p>
          </div>
        </motion.div>
      )}

      {/* STAGE NAVIGATION */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all border border-white/10 cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Vault</span>
        </button>

        <button
          type="button"
          disabled={!condition}
          onClick={() => setCurrentStep(3)}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            condition
              ? condition === 'swollen_battery'
                ? 'bg-amber text-background shadow-amber-glow hover:brightness-105 active:scale-[0.98] cursor-pointer'
                : 'bg-emerald text-background shadow-emerald-glow hover:brightness-105 active:scale-[0.98] cursor-pointer'
              : 'bg-white/10 text-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <span>Continue to Environmental Impact</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
