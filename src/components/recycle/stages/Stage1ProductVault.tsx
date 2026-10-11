import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Cpu,
  Headphones,
  Watch,
  PlusCircle,
  CheckCircle2,
  Scale,
  Battery,
  Shield,
  ArrowRight,
  Info,
  X
} from 'lucide-react'
import {
  PRODUCT_CATALOG,
  type ProductRecord,
  type DeviceCategory
} from '../../../data/productVaultCatalog'
import { useRecycleStore } from '../../../store/useRecycleStore'

const CATEGORIES: { id: DeviceCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Tech', icon: Cpu },
  { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
  { id: 'laptops', label: 'Laptops', icon: Laptop },
  { id: 'tablets', label: 'Tablets', icon: Tablet },
  { id: 'monitors', label: 'Monitors', icon: Monitor },
  { id: 'audio', label: 'Audio', icon: Headphones },
  { id: 'accessories', label: 'Accessories', icon: Watch }
]

export const Stage1ProductVault: React.FC = () => {
  const {
    selectedProduct,
    customProduct,
    selectProduct,
    setCustomProduct,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    setCurrentStep,
    isManualEntryOpen,
    setManualEntryOpen
  } = useRecycleStore()

  // Custom device form state
  const [manualMfg, setManualMfg] = useState('')
  const [manualModel, setManualModel] = useState('')
  const [manualVariant, setManualVariant] = useState('')
  const [manualCategory, setManualCategory] = useState<DeviceCategory>('smartphones')
  const [manualMass, setManualMass] = useState(200)
  const [manualBattery, setManualBattery] = useState<'Lithium-ion' | 'Lithium-polymer' | 'NiMH' | 'None (Mains Powered)'>('Lithium-ion')
  const [manualNotes, setManualNotes] = useState('')

  // Filtered catalog list
  const filteredProducts = useMemo(() => {
    return PRODUCT_CATALOG.filter((p) => {
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter

      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesCategory

      const matchesSearch =
        p.model.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, categoryFilter])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualMfg.trim() || !manualModel.trim()) return

    setCustomProduct({
      manufacturer: manualMfg.trim(),
      model: manualModel.trim(),
      variant: manualVariant.trim() || 'Custom Specification',
      category: manualCategory,
      estimatedMassGrams: Number(manualMass) || 200,
      batteryType: manualBattery,
      notes: manualNotes.trim()
    })
    setManualEntryOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            STAGE 1 OF 6 • PRODUCT DISCOVERY
          </span>
          <span className="text-xs text-text-muted font-mono">
            Catalog: {PRODUCT_CATALOG.length} Verified Models
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Product Vault
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Search and identify your hardware. Specifications, mass, and hazardous material profiles are retrieved automatically.
        </p>
      </div>

      {/* SEARCH INPUT & FILTER BAR */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, maker (e.g. iPhone 11, MacBook, Dell XPS, S23)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl liquid-glass-subtle border border-white/10 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/40 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs cursor-pointer p-1 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* CATEGORY SCROLLER */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = categoryFilter === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-emerald/15 border-emerald/40 text-emerald shadow-emerald-glow'
                    : 'bg-white/[0.03] border-white/[0.06] text-text-secondary hover:text-text-primary hover:border-white/15 hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ACTIVE SELECTION BANNER IF SELECTED */}
      {(selectedProduct || customProduct) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald/10 border border-emerald/30 liquid-glass-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-emerald-glow"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald/20 border border-emerald/40 flex items-center justify-center text-emerald shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded-full bg-emerald/20 text-emerald font-bold">
                  {selectedProduct ? 'Catalog Verified' : 'Custom Specified'}
                </span>
                <span className="text-xs text-text-muted truncate">
                  {selectedProduct?.manufacturer || customProduct?.manufacturer}
                </span>
              </div>
              <h3 className="text-base font-bold text-text-primary truncate">
                {selectedProduct?.model || customProduct?.model}
              </h3>
              <p className="text-xs text-text-secondary truncate font-mono">
                {selectedProduct?.variant || customProduct?.variant} •{' '}
                <span className="text-emerald font-semibold">
                  {selectedProduct?.defaultMassGrams || customProduct?.estimatedMassGrams}g
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                selectProduct(null)
                setCustomProduct(null)
              }}
              className="px-3 py-1.5 rounded-full text-xs text-text-muted hover:text-text-primary border border-white/10 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Confirm & Triage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* CATALOG GRID */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto overscroll-contain pr-1 no-scrollbar"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        {filteredProducts.map((product) => {
          const isSelected = selectedProduct?.id === product.id
          return (
            <motion.div
              key={product.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${product.manufacturer} ${product.model}`}
              whileHover={{ y: -2 }}
              onClick={() => selectProduct(product)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  selectProduct(product)
                }
              }}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                isSelected
                  ? 'bg-emerald/15 border-emerald/50 shadow-emerald-glow ring-1 ring-emerald/40'
                  : 'liquid-glass-subtle border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-text-muted uppercase">
                    {product.manufacturer}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/10">
                    {product.subcategory}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-text-primary group-hover:text-emerald transition-colors leading-snug">
                  {product.model}
                </h4>

                <p className="text-[11px] text-text-secondary truncate">
                  {product.variant}
                </p>
              </div>

              {/* SPECIFICATION PILLS */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1 text-text-muted">
                  <Scale className="w-3 h-3 text-cyan" />
                  <span className="text-text-primary font-bold">{product.defaultMassGrams}g</span>
                </div>

                <div className="flex items-center gap-1 text-text-muted">
                  <Battery className="w-3 h-3 text-emerald" />
                  <span className="truncate max-w-[110px]">{product.batteryType}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald font-bold">
                    +{product.baseEcoCredits} EC
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* NO RESULTS FALLBACK */}
        {filteredProducts.length === 0 && (
          <div className="col-span-full p-8 rounded-2xl liquid-glass-subtle border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-text-muted">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">No Matching Devices Found</h4>
              <p className="text-xs text-text-secondary mt-1">
                Can't find "{searchQuery}"? Submit your device details manually through the custom hardware form below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setManualEntryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-text-primary text-xs font-semibold border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald" />
              <span>Enter Custom Device Details</span>
            </button>
          </div>
        )}
      </div>

      {/* MANUAL ENTRY MODAL / DRAWER */}
      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <span className="text-text-muted">Device not listed in official catalog?</span>
        <button
          type="button"
          onClick={() => setManualEntryOpen(true)}
          className="inline-flex items-center gap-1.5 text-emerald hover:underline font-semibold cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Manual Device Specification</span>
        </button>
      </div>

      {/* MODAL DIALOG FOR CUSTOM DEVICE ENTRY */}
      <AnimatePresence>
        {isManualEntryOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setManualEntryOpen(false)
            }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg liquid-glass specular-rim p-6 rounded-2xl border border-white/15 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald/15 flex items-center justify-center text-emerald">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary">
                    Custom Device Specification
                  </h3>
                </div>
                <button
                  type="button"
                  id="btn-close-manual-modal"
                  onClick={() => setManualEntryOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">
                      MANUFACTURER *
                    </label>
                    <input
                      required
                      type="text"
                      value={manualMfg}
                      onChange={(e) => setManualMfg(e.target.value)}
                      placeholder="e.g. Sony, HP, Asus, LG"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">
                      MODEL NAME / NUMBER *
                    </label>
                    <input
                      required
                      type="text"
                      value={manualModel}
                      onChange={(e) => setManualModel(e.target.value)}
                      placeholder="e.g. WH-1000XM4, Pavilion 15"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as DeviceCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0D10] border border-white/10 text-text-primary focus:outline-none focus:border-emerald"
                    >
                      <option value="smartphones">Smartphone</option>
                      <option value="laptops">Laptop</option>
                      <option value="tablets">Tablet</option>
                      <option value="monitors">Monitor</option>
                      <option value="audio">Audio Device</option>
                      <option value="accessories">Accessory / Wearable</option>
                      <option value="other">Other Electronics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-text-muted mb-1">
                      ESTIMATED MASS (GRAMS) *
                    </label>
                    <input
                      required
                      type="number"
                      min={10}
                      max={25000}
                      value={manualMass}
                      onChange={(e) => setManualMass(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-text-primary focus:outline-none focus:border-emerald font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    BATTERY CHEMISTRY / TYPE
                  </label>
                  <select
                    value={manualBattery}
                    onChange={(e) => setManualBattery(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D10] border border-white/10 text-text-primary focus:outline-none focus:border-emerald"
                  >
                    <option value="Lithium-ion">Lithium-ion (Pouch or Cylindrical)</option>
                    <option value="Lithium-polymer">Lithium-polymer</option>
                    <option value="NiMH">Nickel-Metal Hydride (NiMH)</option>
                    <option value="None (Mains Powered)">No Battery (Mains Powered)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    VARIANT / STORAGE / NOTES
                  </label>
                  <input
                    type="text"
                    value={manualVariant}
                    onChange={(e) => setManualVariant(e.target.value)}
                    placeholder="e.g. 256GB / Black Edition"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setManualEntryOpen(false)}
                    className="px-4 py-2 rounded-full text-xs text-text-muted hover:text-text-primary hover:bg-white/5 cursor-pointer active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-emerald text-background font-bold text-xs uppercase tracking-wider shadow-emerald-glow hover:brightness-105 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    Save & Select Device
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
