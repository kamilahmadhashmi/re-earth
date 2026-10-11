import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  Lock,
  Layers,
  Search,
  RefreshCw,
  Navigation,
  Shield,
  Activity,
  SlidersHorizontal,
  ChevronDown,
  Building,
  Zap,
  Info
} from 'lucide-react'
import { CAMPUS_KIOSKS, type CampusKiosk } from '../../../data/kiosks'
import { INITIAL_CAMPUSES, type Campus } from '../../../data/campuses'
import {
  CAMPUS_MAP_DATA,
  type CampusGate,
  type CampusDropOffZone,
  type CampusTransitVehicle,
  type CampusTransitEvent
} from '../../../data/campusMapData'
import { useRecycleStore } from '../../../store/useRecycleStore'
import { CampusInteractiveMap } from '../map/CampusInteractiveMap'

export const Stage5KioskSelection: React.FC = () => {
  const {
    selectedKioskId,
    selectKiosk,
    condition,
    selectedProduct,
    customProduct,
    setCurrentStep
  } = useRecycleStore()

  const isSwollenHazard = condition === 'swollen_battery'
  const deviceCategory = selectedProduct?.category || customProduct?.category || 'smartphones'

  // Campus selector state (defaults to DTU where default kiosks reside)
  const [selectedCampusId, setSelectedCampusId] = useState<string>('dtu')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'kiosks' | 'vehicles' | 'zones' | 'events'>('kiosks')
  const [filterHazmatOnly, setFilterHazmatOnly] = useState<boolean>(false)
  const [selectedVehicle, setSelectedVehicle] = useState<CampusTransitVehicle | null>(null)
  const [selectedZone, setSelectedZone] = useState<CampusDropOffZone | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Current campus object & coordinates
  const currentCampus = useMemo(() => {
    return (
      INITIAL_CAMPUSES.find((c) => c.id === selectedCampusId) ||
      INITIAL_CAMPUSES.find((c) => c.id === 'dtu')!
    )
  }, [selectedCampusId])

  const campusCenter: [number, number] = useMemo(() => {
    return [currentCampus.lat, currentCampus.lng]
  }, [currentCampus])

  // Telemetry map data for selected campus
  const mapData = useMemo(() => {
    return (
      CAMPUS_MAP_DATA[selectedCampusId] || {
        gates: [],
        zones: [],
        vehicles: [],
        routes: [],
        events: []
      }
    )
  }, [selectedCampusId])

  // Filtered kiosks with eligibility
  const kiosksWithEligibility = useMemo(() => {
    return CAMPUS_KIOSKS.map((kiosk) => {
      const hazmatPass = !isSwollenHazard || kiosk.hazmatCertified
      const categoryPass = kiosk.acceptedCategories.includes(deviceCategory)
      const isEligible = hazmatPass && categoryPass

      let ineligibilityReason = ''
      if (!hazmatPass) {
        ineligibilityReason = 'Not Hazmat Certified: Cannot accept swollen lithium batteries.'
      } else if (!categoryPass) {
        ineligibilityReason = `Kiosk capacity limited: Does not accept ${deviceCategory}.`
      }

      return {
        ...kiosk,
        isEligible,
        ineligibilityReason
      }
    })
      .filter((kiosk) => {
        // Match selected campus if kiosks exist for it, or show all near campus
        if (selectedCampusId && kiosk.campusId !== selectedCampusId) {
          // If searching globally or campus has no kiosks, show all
          return false
        }
        return true
      })
      .filter((kiosk) => {
        if (filterHazmatOnly && !kiosk.hazmatCertified) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          return (
            kiosk.name.toLowerCase().includes(q) ||
            kiosk.landmark.toLowerCase().includes(q) ||
            kiosk.campusName.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (a.isEligible && !b.isEligible) return -1
        if (!a.isEligible && b.isEligible) return 1
        return a.distanceKm - b.distanceKm
      })
  }, [isSwollenHazard, deviceCategory, selectedCampusId, filterHazmatOnly, searchQuery])

  // Fallback if campus has 0 kiosks in filtered view
  const displayKiosks = useMemo(() => {
    if (kiosksWithEligibility.length > 0) return kiosksWithEligibility
    // Show all available kiosks matching search
    return CAMPUS_KIOSKS.map((kiosk) => ({
      ...kiosk,
      isEligible: !isSwollenHazard || kiosk.hazmatCertified,
      ineligibilityReason:
        isSwollenHazard && !kiosk.hazmatCertified
          ? 'Not Hazmat Certified: Cannot accept swollen lithium batteries.'
          : ''
    })).filter((k) => {
      if (filterHazmatOnly && !k.hazmatCertified) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          k.name.toLowerCase().includes(q) ||
          k.landmark.toLowerCase().includes(q) ||
          k.campusName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [kiosksWithEligibility, isSwollenHazard, filterHazmatOnly, searchQuery])

  const selectedKiosk = displayKiosks.find((k) => k.id === selectedKioskId)
  const canProceed = !!selectedKiosk && selectedKiosk.isEligible

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  return (
    <div className="space-y-4">
      {/* ===================================================================== */}
      {/* HEADER: OPERATIONAL TITLE, CAMPUS PICKER & TELEMETRY INDICATOR        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl liquid-glass specular-rim space-y-3 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                STAGE 5 OF 6 • DROP-POINT ALLOCATION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 text-[9px] font-mono font-bold">
                KIOSK RADAR v2.4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Campus Transit & Drop-Off Operations Map
            </h2>
          </div>

          {/* CAMPUS SELECTOR & TELEMETRY CONTROLS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Campus Dropdown */}
            <div className="relative">
              <select
                value={selectedCampusId}
                onChange={(e) => setSelectedCampusId(e.target.value)}
                className="appearance-none bg-black/60 text-text-primary text-xs font-mono font-bold pl-3 pr-8 py-2 rounded-xl border border-white/15 hover:border-white/30 focus:outline-none focus:border-cyan transition-colors cursor-pointer"
              >
                {INITIAL_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0A0D12] text-text-primary">
                    {c.shortName} • {c.city} ({c.activeKiosks} Pods)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Freshness Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
              <span className="text-emerald font-bold">Live Telemetry</span>
              <span className="text-text-muted hidden sm:inline">• Localhost &lt; 10ms</span>
            </div>

            {/* Refresh Action */}
            <button
              onClick={handleRefresh}
              title="Refresh Telemetry Stream"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan' : ''}`} />
            </button>
          </div>
        </div>

        {/* HAZMAT ROUTING WARNING BANNER */}
        {isSwollenHazard && (
          <div className="p-3 rounded-xl bg-amber/15 border border-amber/40 shadow-amber-glow flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded-lg bg-amber/25 flex items-center justify-center text-amber shrink-0 mt-0.5">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber font-bold block">
                HAZMAT FILTERING ENFORCED
              </span>
              <p className="text-text-primary mt-0.5 leading-relaxed">
                Volatile lithium battery triage active. Only drop points with sand isolation cells and certified fire suppression are routed on the map.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* PRIMARY WORKSPACE: REAL INTERACTIVE MAP + OPERATIONS SIDEBAR         */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* MAP CANVAS (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col h-[480px] lg:h-[530px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
          <CampusInteractiveMap
            campusCenter={campusCenter}
            campusName={currentCampus.name}
            kiosks={displayKiosks}
            gates={mapData.gates}
            zones={mapData.zones}
            vehicles={mapData.vehicles}
            routes={mapData.routes}
            selectedKioskId={selectedKioskId}
            selectedVehicleId={selectedVehicle?.id}
            selectedZoneId={selectedZone?.id}
            onSelectKiosk={(id) => {
              selectKiosk(id)
              setSelectedVehicle(null)
              setSelectedZone(null)
            }}
            onSelectVehicle={(veh) => {
              setSelectedVehicle(veh)
              setSelectedZone(null)
            }}
            onSelectZone={(zone) => {
              setSelectedZone(zone)
              setSelectedVehicle(null)
            }}
            isSwollenHazard={isSwollenHazard}
          />
        </div>

        {/* OPERATIONS SIDEBAR & DISPATCH CONSOLE (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col h-[480px] lg:h-[530px] rounded-2xl liquid-glass specular-rim border border-white/10 p-3.5 space-y-3 overflow-hidden">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pods, gates, bays or shuttles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 text-text-primary text-xs pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan placeholder:text-text-muted transition-colors font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFilterHazmatOnly(!filterHazmatOnly)}
                title="Toggle Hazmat Certified Only filter"
                className={`px-2.5 py-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all shrink-0 cursor-pointer ${
                  filterHazmatOnly
                    ? 'bg-amber/20 text-amber border-amber/50 shadow-amber-glow'
                    : 'bg-white/[0.04] text-text-muted border-white/10 hover:text-text-primary hover:border-white/20'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Hazmat</span>
              </button>
            </div>

            {/* TAB SELECTOR: PODS / SHUTTLES / ZONES / EVENTS */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setActiveTab('kiosks')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'kiosks'
                    ? 'bg-emerald text-black shadow-emerald-glow'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Pods ({displayKiosks.length})
              </button>

              <button
                onClick={() => setActiveTab('vehicles')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'vehicles'
                    ? 'bg-cyan text-black shadow-cyan-glow'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Shuttles ({mapData.vehicles.length})
              </button>

              <button
                onClick={() => setActiveTab('zones')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'zones'
                    ? 'bg-lavender text-black shadow-lavender-glow'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Bays ({mapData.zones.length})
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'events'
                    ? 'bg-white/20 text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* TAB CONTENT LIST (SCROLLABLE) */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain space-y-2 pr-1 no-scrollbar min-h-0"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
          >
            {/* --------------------------------------------------------------- */}
            {/* TAB 1: DROP-OFF KIOSK PODS                                      */}
            {/* --------------------------------------------------------------- */}
            {activeTab === 'kiosks' && (
              <>
                {displayKiosks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted space-y-2">
                    <MapPin className="w-6 h-6 mx-auto opacity-40" />
                    <p>No drop-off pods found matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterHazmatOnly(false)
                      }}
                      className="text-cyan underline text-[11px]"
                    >
                      Clear search filters
                    </button>
                  </div>
                ) : (
                  displayKiosks.map((kiosk) => {
                    const isSelected = selectedKioskId === kiosk.id
                    const isEligible = kiosk.isEligible

                    return (
                      <div
                        key={kiosk.id}
                        onClick={() => isEligible && selectKiosk(kiosk.id)}
                        className={`p-3 rounded-xl border transition-all duration-200 text-left relative ${
                          !isEligible
                            ? 'opacity-40 bg-white/[0.01] border-white/[0.04] cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald/15 border-emerald/50 shadow-emerald-glow cursor-pointer'
                            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan/15 text-cyan border border-cyan/30">
                                {kiosk.distanceKm < 1
                                  ? `${Math.round(kiosk.distanceKm * 1000)}m AWAY`
                                  : `${kiosk.distanceKm} km`}
                              </span>

                              {kiosk.hazmatCertified && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber/15 text-amber border border-amber/30 flex items-center gap-1">
                                  <Flame className="w-2.5 h-2.5" />
                                  HAZMAT
                                </span>
                              )}

                              <span className="text-[9px] font-mono text-emerald font-bold">
                                {kiosk.turfBonusMultiplier}x TURF
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-text-primary truncate">
                              {kiosk.name}
                            </h4>

                            <p className="text-[10px] text-text-secondary line-clamp-1">
                              {kiosk.landmark}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-emerald bg-emerald text-black'
                                  : 'border-white/20'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* CAPACITY FILL BAR */}
                        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-text-muted">
                          <div className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{kiosk.operatingHours}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span>{kiosk.availableLockerSlots} Lockers Free</span>
                            <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-emerald"
                                style={{ width: `${kiosk.fillLevelPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {!isEligible && (
                          <div className="mt-1.5 text-[9px] font-mono text-amber flex items-center gap-1">
                            <AlertOctagon className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{kiosk.ineligibilityReason}</span>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 2: APPROACHING CAMPUS SHUTTLES                              */}
            {/* --------------------------------------------------------------- */}
            {activeTab === 'vehicles' && (
              <>
                {mapData.vehicles.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted space-y-2">
                    <Navigation className="w-6 h-6 mx-auto opacity-40" />
                    <p>No active transit shuttles deployed at {currentCampus.name}</p>
                  </div>
                ) : (
                  mapData.vehicles.map((veh) => {
                    const isSelected = selectedVehicle?.id === veh.id

                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedVehicle(veh)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan/15 border-cyan/50 shadow-cyan-glow'
                            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan/20 text-cyan border border-cyan/30">
                                {veh.callSign}
                              </span>
                              <span className="text-[9px] font-mono text-emerald">
                                Bat: {veh.batteryPercent}%
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-text-primary">{veh.name}</h4>
                            <p className="text-[10px] text-text-secondary">{veh.passengersOrLoad}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold text-cyan block">
                              {veh.status === 'en_route' ? `ETA ${veh.etaMinutes}m` : 'DOCKED'}
                            </span>
                            <span className="text-[9px] font-mono text-text-muted">
                              {veh.speedKmh > 0 ? `${veh.speedKmh} km/h` : 'Stationary'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-text-muted">
                          <span>Operator: {veh.driverOrSystem}</span>
                          <span className="text-cyan">Click to Focus Map ↗</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 3: STUDENT DROP-OFF ZONES & BAYS                            */}
            {/* --------------------------------------------------------------- */}
            {activeTab === 'zones' && (
              <>
                {mapData.zones.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted space-y-2">
                    <MapPin className="w-6 h-6 mx-auto opacity-40" />
                    <p>No operational bays registered at {currentCampus.name}</p>
                  </div>
                ) : (
                  mapData.zones.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id
                    const occupancyPct = Math.round(
                      (zone.occupiedBays / zone.capacityBays) * 100
                    )

                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-lavender/15 border-lavender/50 shadow-lavender-glow'
                            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-lavender/20 text-lavender border border-lavender/30">
                                {zone.code}
                              </span>
                              <span className="text-[9px] font-mono text-emerald">
                                {zone.capacityBays - zone.occupiedBays} Bays Free
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-text-primary">{zone.name}</h4>
                            <p className="text-[10px] text-text-secondary">{zone.rules}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold text-text-primary block">
                              {occupancyPct}% Load
                            </span>
                            <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                              <div
                                className={`h-full ${
                                  occupancyPct > 80 ? 'bg-amber' : 'bg-emerald'
                                }`}
                                style={{ width: `${occupancyPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-text-muted">
                          <span>Vehicles: {zone.acceptedVehicles}</span>
                          <span className="text-lavender">Focus Zone ↗</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </>
            )}

            {/* --------------------------------------------------------------- */}
            {/* TAB 4: RECENT OPERATIONAL TRANSIT EVENTS                        */}
            {/* --------------------------------------------------------------- */}
            {activeTab === 'events' && (
              <div className="space-y-2">
                {mapData.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan font-bold flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5" />
                        {evt.title}
                      </span>
                      <span className="text-text-muted">{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">{evt.description}</p>
                    <div className="text-[9px] font-mono text-text-muted">Actor: {evt.actor}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED KIOSK SUMMARY CARD & LOCK CONFIRMATION */}
          {selectedKiosk && (
            <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/30 text-xs space-y-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  15-MINUTE RESERVATION LOCK
                </span>
                <span className="text-amber font-bold">
                  {selectedKiosk.turfBonusMultiplier}x Multiplier
                </span>
              </div>
              <div className="text-[11px] text-text-primary">
                Assigned Drop-Point: <span className="font-bold">{selectedKiosk.name}</span>
              </div>
              <div className="text-[10px] font-mono text-text-secondary">
                Locker slot held for 15 minutes once Ephemeral QR pass is generated.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* NAVIGATION FOOTER                                                     */}
      {/* ===================================================================== */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Data-Wipe Protocol</span>
        </button>

        <button
          disabled={!canProceed}
          onClick={() => {
            const store = useRecycleStore.getState()
            store.generateQrPass()
          }}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            canProceed
              ? 'bg-emerald text-background shadow-emerald-glow hover:brightness-105 active:scale-[0.98]'
              : 'bg-white/10 text-text-muted cursor-not-allowed opacity-50'
          }`}
        >
          <span>Generate Ephemeral QR Pass</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
