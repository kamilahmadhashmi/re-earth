import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import L from 'leaflet'
import {
  Shield,
  MapPin,
  Navigation,
  Compass,
  RefreshCw,
  Info,
  Flame,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  X
} from 'lucide-react'
import type { CampusKiosk, KioskOperationalStatus } from '../../../data/kiosks'
import type {
  CampusGate,
  CampusDropOffZone,
  CampusTransitVehicle,
  CampusRoutePolyline
} from '../../../data/campusMapData'

interface CampusInteractiveMapProps {
  campusCenter: [number, number]
  campusName: string
  kiosks: CampusKiosk[]
  gates: CampusGate[]
  zones: CampusDropOffZone[]
  vehicles: CampusTransitVehicle[]
  routes: CampusRoutePolyline[]
  selectedKioskId?: string | null
  selectedVehicleId?: string | null
  selectedZoneId?: string | null
  onSelectKiosk: (kioskId: string) => void
  onSelectVehicle?: (vehicle: CampusTransitVehicle) => void
  onSelectZone?: (zone: CampusDropOffZone) => void
  isSwollenHazard?: boolean
}

export const CampusInteractiveMap: React.FC<CampusInteractiveMapProps> = ({
  campusCenter,
  campusName,
  kiosks,
  gates,
  zones,
  vehicles,
  routes,
  selectedKioskId,
  selectedVehicleId,
  selectedZoneId,
  onSelectKiosk,
  onSelectVehicle,
  onSelectZone,
  isSwollenHazard = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null)

  // Display toggles
  const [showZones, setShowZones] = useState<boolean>(true)
  const [showGates, setShowGates] = useState<boolean>(true)
  const [showVehicles, setShowVehicles] = useState<boolean>(true)
  const [showRoutes, setShowRoutes] = useState<boolean>(true)
  const [showLegend, setShowLegend] = useState<boolean>(false)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)

  // Selected preview kiosk for in-map detail card
  const [previewKioskId, setPreviewKioskId] = useState<string | null>(selectedKioskId || null)

  // Simulation state for DEMO DATA pulse updates
  const [simulatedKiosks, setSimulatedKiosks] = useState<CampusKiosk[]>(kiosks)
  const [isPulsing, setIsPulsing] = useState<boolean>(false)
  const [lastSyncLabel, setLastSyncLabel] = useState<string>('Live (Demo Telemetry)')

  // Sync internal simulated kiosks with incoming props
  useEffect(() => {
    setSimulatedKiosks(kiosks)
  }, [kiosks])

  // Sync preview kiosk with external selectedKioskId
  useEffect(() => {
    if (selectedKioskId) {
      setPreviewKioskId(selectedKioskId)
    }
  }, [selectedKioskId])

  // Active kiosk object for compact detail panel
  const activeKiosk = useMemo(() => {
    const targetId = previewKioskId || selectedKioskId
    if (!targetId) return null
    return simulatedKiosks.find((k) => k.id === targetId) || null
  }, [previewKioskId, selectedKioskId, simulatedKiosks])

  // Controlled Demo Pulse that updates simulated kiosk telemetry
  const handleSimulateTelemetryPulse = useCallback(() => {
    setIsPulsing(true)
    setTimeout(() => {
      setSimulatedKiosks((prev) =>
        prev.map((k) => {
          if (k.status === 'OFFLINE') return k

          // Deterministic minor fluctuation in occupancy
          const delta = Math.random() > 0.5 ? 1 : -1
          const nextOccupancy = Math.max(1, Math.min(k.capacity - 1, k.occupancy + delta))
          const nextFill = Math.round((nextOccupancy / k.capacity) * 100)
          const nextStatus: KioskOperationalStatus = nextFill >= 80 ? 'BUSY' : 'ACTIVE'

          return {
            ...k,
            occupancy: nextOccupancy,
            fillLevelPercent: nextFill,
            availableLockerSlots: k.capacity - nextOccupancy,
            status: nextStatus,
            lastUpdated: new Date().toISOString()
          }
        })
      )
      setLastSyncLabel(`Updated ${new Date().toLocaleTimeString()} (DEMO)`)
      setIsPulsing(false)
    }, 400)
  }, [])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Avoid double initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: campusCenter,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Prevents scroll-trapping so the user can easily scroll the modal
      maxZoom: 19,
      minZoom: 12
    })

    // Setup real street map tile layer (OpenStreetMap - 100% Free, NO API KEY REQUIRED)
    const streetMap = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        crossOrigin: true
      }
    )

    streetMap.addTo(map)
    tileLayerRef.current = streetMap

    // Create a LayerGroup to hold all interactive markers and polylines
    const markersGroup = L.layerGroup().addTo(map)
    markersLayerGroupRef.current = markersGroup

    mapInstanceRef.current = map
    setIsMapReady(true)

    // Invalidate size once rendered
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    // Ctrl/Cmd + Wheel Zoom: Allow zooming if user holds Ctrl, but let normal wheel scroll the modal
    const mapContainer = mapContainerRef.current
    const handleMapWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          map.zoomIn()
        } else if (e.deltaY > 0) {
          map.zoomOut()
        }
      }
    }
    mapContainer.addEventListener('wheel', handleMapWheel, { passive: false })

    // ResizeObserver for reliable rendering across all viewport layouts
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainer)

    return () => {
      clearTimeout(timer)
      mapContainer.removeEventListener('wheel', handleMapWheel)
      resizeObserver.disconnect()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Smoothly pan and center on the selected college when campusCenter changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    map.flyTo(campusCenter, 16, {
      animate: true,
      duration: 0.9
    })
    map.invalidateSize()
  }, [campusCenter[0], campusCenter[1]])

  // FlyTo selected kiosk
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (selectedKioskId) {
      const selectedKiosk = simulatedKiosks.find((k) => k.id === selectedKioskId)
      if (selectedKiosk && selectedKiosk.coords) {
        map.flyTo(selectedKiosk.coords, 17, {
          animate: true,
          duration: 0.8
        })
      }
    }
  }, [selectedKioskId, simulatedKiosks])

  // FlyTo selected vehicle
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedVehicleId) return

    const vehicle = vehicles.find((v) => v.id === selectedVehicleId)
    if (vehicle) {
      map.flyTo(vehicle.currentCoords, 17.5, {
        animate: true,
        duration: 0.8
      })
    }
  }, [selectedVehicleId, vehicles])

  // FlyTo selected drop-off zone
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedZoneId) return

    const zone = zones.find((z) => z.id === selectedZoneId)
    if (zone) {
      map.flyTo(zone.coords, 17, {
        animate: true,
        duration: 0.8
      })
    }
  }, [selectedZoneId, zones])

  // Render Markers & Vectors whenever data or layer toggles change
  useEffect(() => {
    const map = mapInstanceRef.current
    const group = markersLayerGroupRef.current
    if (!map || !group) return

    group.clearLayers()

    // -------------------------------------------------------------------------
    // 1. ROUTE POLYLINES (Shown when showRoutes and showVehicles are active)
    // -------------------------------------------------------------------------
    if (showRoutes && showVehicles && routes.length > 0) {
      routes.forEach((route) => {
        const poly = L.polyline(route.coordinates, {
          color: route.color,
          weight: 3.5,
          opacity: 0.75,
          dashArray: route.dashArray || undefined,
          lineJoin: 'round',
          lineCap: 'round'
        })

        poly.bindTooltip(
          `<div class="text-[10px] font-mono text-cyan font-bold">${route.name}</div>`,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        )
        group.addLayer(poly)
      })
    }

    // -------------------------------------------------------------------------
    // 2. STUDENT DROP-OFF ZONES (Halos & Center Badges) - Controlled by showZones
    // -------------------------------------------------------------------------
    if (showZones && zones.length > 0) {
      zones.forEach((zone) => {
        const isSelected = selectedZoneId === zone.id
        const isBusy = zone.occupiedBays >= zone.capacityBays * 0.75

        // Zone radius circle
        const circle = L.circle(zone.coords, {
          radius: zone.radiusMeters,
          color: isSelected ? '#64D2FF' : isBusy ? '#FFD60A' : '#30D158',
          fillColor: isSelected ? '#64D2FF' : isBusy ? '#FFD60A' : '#30D158',
          fillOpacity: isSelected ? 0.25 : 0.12,
          weight: isSelected ? 2.5 : 1.5,
          dashArray: '4, 4'
        })

        circle.on('click', () => {
          onSelectZone?.(zone)
        })

        group.addLayer(circle)

        // Zone Center Badge Icon
        const zoneBadgeHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group -translate-x-1/2 -translate-y-1/2">
            <div class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight border shadow-lg backdrop-blur-md transition-transform group-hover:scale-110 ${
              isSelected
                ? 'bg-cyan text-black border-white shadow-cyan-glow'
                : 'bg-black/85 text-text-primary border-white/20'
            }">
              <span class="text-emerald font-bold">${zone.code}</span> • ${zone.occupiedBays}/${zone.capacityBays} Bays
            </div>
          </div>
        `

        const zoneIcon = L.divIcon({
          html: zoneBadgeHtml,
          className: 'custom-leaflet-marker',
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        })

        const zoneMarker = L.marker(zone.coords, { icon: zoneIcon })
        zoneMarker.on('click', () => {
          onSelectZone?.(zone)
        })

        group.addLayer(zoneMarker)
      })
    }

    // -------------------------------------------------------------------------
    // 3. CAMPUS PERIMETER GATES - Controlled by showGates
    // -------------------------------------------------------------------------
    if (showGates && gates.length > 0) {
      gates.forEach((gate) => {
        const isEntrance = gate.type === 'entrance'
        const gateHtml = `
          <div class="relative cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110 ${
              isEntrance
                ? 'bg-emerald/25 border-emerald text-emerald shadow-emerald-glow'
                : 'bg-lavender/25 border-lavender text-lavender shadow-lavender-glow'
            }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="mt-1 px-1.5 py-0.2 rounded text-[8px] font-mono uppercase font-bold bg-black/90 border border-white/20 text-text-primary whitespace-nowrap">
              ${isEntrance ? 'GATE 1 IN' : 'GATE 2 OUT'}
            </div>
          </div>
        `

        const gateIcon = L.divIcon({
          html: gateHtml,
          className: 'custom-leaflet-marker',
          iconSize: [32, 44],
          iconAnchor: [16, 22]
        })

        const marker = L.marker(gate.coords, { icon: gateIcon })
        marker.bindPopup(`
          <div class="p-3 text-xs space-y-1.5 min-w-[200px]">
            <div class="flex items-center gap-1.5 text-emerald font-mono text-[10px] font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald"></span>
              CAMPUS PERIMETER GATE
            </div>
            <div class="font-bold text-text-primary">${gate.name}</div>
            <p class="text-[11px] text-text-secondary">${gate.description}</p>
            <div class="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-text-muted">
              <span>Security Check:</span>
              <span class="text-cyan">${gate.securityCheck}</span>
            </div>
          </div>
        `)

        group.addLayer(marker)
      })
    }

    // -------------------------------------------------------------------------
    // 4. TRANSIT SHUTTLES & LOGISTICS VEHICLES - Controlled by showVehicles
    // -------------------------------------------------------------------------
    if (showVehicles && vehicles.length > 0) {
      vehicles.forEach((veh) => {
        const isSelected = selectedVehicleId === veh.id
        const isDocked = veh.status === 'docked'

        const vehicleHtml = `
          <div class="relative cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            ${
              !isDocked
                ? '<div class="absolute -inset-1 rounded-full bg-cyan/30 animate-sonar-ring pointer-events-none"></div>'
                : ''
            }
            <div class="relative w-7 h-7 rounded-full flex items-center justify-center border shadow-lg backdrop-blur-md transition-transform group-hover:scale-125 ${
              isSelected
                ? 'bg-cyan text-black border-white shadow-cyan-glow'
                : isDocked
                ? 'bg-amber/25 border-amber text-amber'
                : 'bg-[#0E1524] border-cyan text-cyan'
            }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <div class="mt-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-black/90 border border-white/20 text-cyan whitespace-nowrap">
              ${veh.speedKmh > 0 ? `${veh.speedKmh} km/h` : 'DOCKED'}
            </div>
          </div>
        `

        const vehicleIcon = L.divIcon({
          html: vehicleHtml,
          className: 'custom-leaflet-marker',
          iconSize: [32, 44],
          iconAnchor: [16, 22]
        })

        const marker = L.marker(veh.currentCoords, { icon: vehicleIcon })
        marker.on('click', () => {
          onSelectVehicle?.(veh)
        })

        marker.bindPopup(`
          <div class="p-3 text-xs space-y-2 min-w-[220px]">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span class="text-cyan font-bold">${veh.callSign}</span>
              <span class="px-1.5 py-0.2 rounded bg-cyan/15 text-cyan border border-cyan/30">
                ${veh.status === 'en_route' ? `ETA ${veh.etaMinutes}m` : 'STANDBY'}
              </span>
            </div>
            <div class="font-bold text-sm text-text-primary">${veh.name}</div>
            <div class="text-[11px] text-text-secondary">${veh.passengersOrLoad}</div>
            <div class="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-text-muted">
              <div>
                <span class="block">Pilot / System:</span>
                <span class="text-text-primary font-bold">${veh.driverOrSystem}</span>
              </div>
              <div>
                <span class="block">Battery State:</span>
                <span class="text-emerald font-bold">${veh.batteryPercent}%</span>
              </div>
            </div>
          </div>
        `)

        group.addLayer(marker)
      })
    }

    // -------------------------------------------------------------------------
    // 5. DETERMINISTIC DELHI KIOSKS (CUSTOM MARKERS WITH RE—EARTH DESIGN)
    // -------------------------------------------------------------------------
    simulatedKiosks.forEach((kiosk) => {
      if (!kiosk.coords) return

      const isSelected = selectedKioskId === kiosk.id
      const isHazmat = kiosk.hazmatCertified
      const isRestrictedByHazard = isSwollenHazard && !isHazmat

      // Normalize status to ACTIVE, BUSY, OFFLINE
      const rawStatus = (kiosk.status || 'ACTIVE').toUpperCase()
      const normalizedStatus: KioskOperationalStatus =
        rawStatus === 'BUSY'
          ? 'BUSY'
          : rawStatus === 'OFFLINE' || rawStatus === 'MAINTENANCE'
          ? 'OFFLINE'
          : 'ACTIVE'

      const isOffline = normalizedStatus === 'OFFLINE'
      const isBusy = normalizedStatus === 'BUSY'

      // Styling based on status
      const statusBadgeClass = isOffline
        ? 'bg-red-500/20 text-red-400 border-red-500/40'
        : isBusy
        ? 'bg-amber/20 text-amber border-amber/40'
        : 'bg-emerald/20 text-emerald border-emerald/40'

      const pinThemeClass = isSelected
        ? 'bg-emerald text-black border-white shadow-emerald-glow scale-110'
        : isOffline
        ? 'bg-red-950/40 border-red-500/40 text-red-400 opacity-60'
        : isBusy
        ? 'bg-amber/20 border-amber/70 text-amber shadow-amber-glow'
        : isHazmat
        ? 'bg-amber/20 border-amber/60 text-amber shadow-amber-glow'
        : 'bg-emerald/15 border-emerald/50 text-emerald'

      const gateTag = kiosk.gateOrBayId ? kiosk.gateOrBayId.split(' ')[0] : 'POD'

      const kioskPinHtml = `
        <div class="relative cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2 ${
          isRestrictedByHazard ? 'opacity-30 grayscale' : ''
        }">
          ${
            isSelected
              ? '<div class="absolute -inset-2.5 rounded-full bg-emerald/30 animate-sonar-ring pointer-events-none"></div>'
              : ''
          }
          <div class="relative w-8 h-8 rounded-xl flex items-center justify-center border shadow-xl backdrop-blur-md transition-all group-hover:scale-125 ${pinThemeClass}">
            ${
              isOffline
                ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
                : isHazmat
                ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
                : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            }
          </div>
          <div class="mt-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold border whitespace-nowrap shadow-md ${
            isSelected
              ? 'bg-emerald text-black border-white'
              : `${statusBadgeClass} bg-black/90`
          }">
            ${gateTag} • ${normalizedStatus}
          </div>
        </div>
      `

      const kioskIcon = L.divIcon({
        html: kioskPinHtml,
        className: 'custom-leaflet-marker',
        iconSize: [40, 52],
        iconAnchor: [20, 26]
      })

      const marker = L.marker(kiosk.coords, {
        icon: kioskIcon,
        zIndexOffset: isSelected ? 1000 : 100
      })

      marker.on('click', () => {
        setPreviewKioskId(kiosk.id)
        if (!isRestrictedByHazard) {
          onSelectKiosk(kiosk.id)
        }
      })

      // Compact informative popup on marker
      marker.bindPopup(`
        <div class="p-3 text-xs space-y-2 min-w-[240px]">
          <div class="flex items-center justify-between text-[10px] font-mono">
            <span class="text-emerald font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-400' : 'bg-emerald animate-pulse'}"></span>
              ${kiosk.campusName}
            </span>
            <span class="px-1.5 py-0.2 rounded ${statusBadgeClass} font-bold text-[9px]">
              ${normalizedStatus}
            </span>
          </div>

          <div>
            <div class="font-bold text-sm text-text-primary">${kiosk.name}</div>
            <div class="text-[11px] text-text-secondary mt-0.5">${kiosk.landmark}</div>
            <div class="text-[10px] font-mono text-cyan mt-0.5">${kiosk.gateOrBayId || 'Express Drop'}</div>
          </div>

          <div class="space-y-1 pt-1.5 border-t border-white/10">
            <div class="flex items-center justify-between text-[10px] font-mono text-text-muted">
              <span>Locker Occupancy:</span>
              <span class="text-text-primary font-bold">${kiosk.occupancy || 0}/${kiosk.capacity || 20} (${kiosk.fillLevelPercent}%)</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full ${isOffline ? 'bg-red-500' : isBusy ? 'bg-amber' : 'bg-emerald'}" style="width: ${kiosk.fillLevelPercent}%"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-text-muted">
            <div>
              <span>Available Slots:</span>
              <span class="block ${isOffline ? 'text-text-muted' : 'text-emerald'} font-bold">${kiosk.availableLockerSlots || (kiosk.capacity - kiosk.occupancy)} Slots</span>
            </div>
            <div>
              <span>Hazmat Rating:</span>
              <span class="block ${kiosk.hazmatCertified ? 'text-amber' : 'text-text-muted'} font-bold">
                ${kiosk.hazmatCertified ? '✓ Certified Fire Safe' : 'Standard Pod'}
              </span>
            </div>
          </div>

          <div class="pt-1 text-[9px] font-mono text-amber/80 text-center border-t border-white/10">
            DEMO DATA • SIMULATED DELHI TELEMETRY
          </div>

          ${
            isRestrictedByHazard
              ? `<div class="p-1.5 rounded bg-amber/15 border border-amber/30 text-[10px] text-amber font-mono">
                  ⚠ Swollen battery hazard detected. Pod not certified for volatile lithium.
                 </div>`
              : `<button
                  type="button"
                  id="btn-kiosk-select-${kiosk.id}"
                  onclick="window.__selectCampusKiosk('${kiosk.id}')"
                  class="w-full mt-2 py-1.5 px-3 rounded-lg ${
                    isSelected
                      ? 'bg-emerald text-black font-bold'
                      : 'bg-emerald/20 hover:bg-emerald text-emerald hover:text-black border border-emerald/50'
                  } text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-emerald-glow active:scale-95"
                >
                  ${isSelected ? '✓ Currently Selected Pod' : 'Lock In 15-Min Reservation'}
                </button>`
          }
        </div>
      `)

      group.addLayer(marker)
    })
  }, [
    simulatedKiosks,
    gates,
    zones,
    vehicles,
    routes,
    selectedKioskId,
    selectedVehicleId,
    selectedZoneId,
    showRoutes,
    showZones,
    showGates,
    showVehicles,
    isSwollenHazard,
    onSelectKiosk,
    onSelectVehicle,
    onSelectZone
  ])

  // Expose global callback for popup button clicks
  useEffect(() => {
    ;(window as any).__selectCampusKiosk = (id: string) => {
      setPreviewKioskId(id)
      onSelectKiosk(id)
    }
    return () => {
      delete (window as any).__selectCampusKiosk
    }
  }, [onSelectKiosk])

  // Map Controls Helpers
  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(campusCenter, 16, {
        animate: true,
        duration: 0.8
      })
    }
  }, [campusCenter])

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#050608] select-none flex flex-col">
      {/* --------------------------------------------------------------------- */}
      {/* MAP CANVAS CONTAINER                                                  */}
      {/* --------------------------------------------------------------------- */}
      <div
        ref={mapContainerRef}
        className="w-full flex-1 min-h-[460px] z-0 focus:outline-none"
        style={{ background: '#050608' }}
      />

      {/* --------------------------------------------------------------------- */}
      {/* TOP FLOATING TELEMETRY HUD BAR                                        */}
      {/* --------------------------------------------------------------------- */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Campus Status & University Panel */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-white/15 text-[11px] font-mono shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-text-primary font-bold">{campusName}</span>
          <span className="text-text-muted">•</span>
          <span className="text-cyan">
            {simulatedKiosks.length} Pods • {vehicles.length} Shuttles
          </span>
          <span className="px-1.5 py-0.2 rounded bg-amber/15 text-amber border border-amber/30 text-[9px] font-bold">
            DEMO DATA
          </span>
        </div>

        {/* Tile & Layer Controls Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full liquid-glass border border-white/15 shadow-xl backdrop-blur-md">
          {/* Gates Layer Filter */}
          <button
            type="button"
            onClick={() => setShowGates(!showGates)}
            title="Toggle Campus Entrance/Exit Gates Visibility"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showGates
                ? 'bg-emerald/20 text-emerald border border-emerald/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Gates</span>
          </button>

          {/* Zones Layer Filter */}
          <button
            type="button"
            onClick={() => setShowZones(!showZones)}
            title="Toggle Student Drop-off Zones Visibility"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showZones
                ? 'bg-cyan/20 text-cyan border border-cyan/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Zones</span>
          </button>

          {/* Shuttles Layer Filter */}
          <button
            type="button"
            onClick={() => setShowVehicles(!showVehicles)}
            title="Toggle Shuttles & Logistics Vehicles Visibility"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showVehicles
                ? 'bg-lavender/20 text-lavender border border-lavender/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">Shuttles</span>
          </button>

          {/* Controlled Demo Telemetry Sync Pulse */}
          <button
            type="button"
            onClick={handleSimulateTelemetryPulse}
            title="Simulate Kiosk Telemetry Status Updates (Demo Mode)"
            className="px-2.5 py-1 rounded-full text-[10px] font-mono text-amber hover:text-amber-bright bg-amber/10 border border-amber/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isPulsing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Demo Pulse</span>
          </button>

          {/* Legend Toggle */}
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            title="Toggle Map Legend"
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer active:scale-95 ${
              showLegend
                ? 'bg-white/20 text-text-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* FLOATING ZOOM & ORIENTATION CONTROLS (BOTTOM RIGHT)                   */}
      {/* --------------------------------------------------------------------- */}
      <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={handleResetView}
          title="Reset to Delhi Demonstration Overview"
          className="w-8 h-8 rounded-full liquid-glass border border-white/15 text-text-primary hover:text-emerald hover:border-emerald/40 transition-all flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
        >
          <Compass className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-xl liquid-glass border border-white/15 overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+ or Ctrl+Scroll)"
            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors text-sm font-bold font-mono cursor-pointer active:scale-95"
          >
            +
          </button>
          <div className="w-full h-[1px] bg-white/10" />
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (− or Ctrl+Scroll)"
            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors text-sm font-bold font-mono cursor-pointer active:scale-95"
          >
            −
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* COMPACT KIOSK DETAIL PANEL (SHOWN ON MARKER CLICK / SELECTION)       */}
      {/* --------------------------------------------------------------------- */}
      {activeKiosk && (
        <div className="absolute bottom-4 left-3 z-20 max-w-[320px] w-full p-3.5 rounded-2xl liquid-glass specular-rim border border-white/15 shadow-2xl backdrop-blur-xl text-xs space-y-2.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan/15 text-cyan border border-cyan/30">
                  {activeKiosk.id}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    activeKiosk.status === 'OFFLINE'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : activeKiosk.status === 'BUSY'
                      ? 'bg-amber/20 text-amber border-amber/40'
                      : 'bg-emerald/20 text-emerald border-emerald/40'
                  }`}
                >
                  {activeKiosk.status}
                </span>
                {activeKiosk.hazmatCertified && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber/20 text-amber border border-amber/40 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" />
                    HAZMAT
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-text-primary mt-1">
                {activeKiosk.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setPreviewKioskId(null)}
              title="Close panel"
              className="text-text-muted hover:text-text-primary cursor-pointer p-1 active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Location & Bay */}
          <div className="space-y-0.5 text-[10px] font-mono text-text-secondary">
            <div>
              <span className="text-text-muted">Bay/Gate: </span>
              <span className="text-text-primary font-bold">{activeKiosk.gateOrBayId || 'BAY-A'}</span>
            </div>
            <div>
              <span className="text-text-muted">Coordinates: </span>
              <span className="text-cyan">
                {activeKiosk.coords[0].toFixed(4)}° N, {activeKiosk.coords[1].toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Occupancy and Capacity Progress */}
          <div className="space-y-1 pt-1.5 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-text-muted">Occupancy / Capacity:</span>
              <span className="text-text-primary font-bold">
                {activeKiosk.occupancy}/{activeKiosk.capacity} Slots ({activeKiosk.fillLevelPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full ${
                  activeKiosk.status === 'OFFLINE'
                    ? 'bg-red-500'
                    : activeKiosk.status === 'BUSY'
                    ? 'bg-amber'
                    : 'bg-emerald'
                }`}
                style={{ width: `${activeKiosk.fillLevelPercent}%` }}
              />
            </div>
          </div>

          {/* Last Updated Timestamp & Telemetry Indicator */}
          <div className="flex items-center justify-between text-[9px] font-mono text-text-muted pt-1 border-t border-white/[0.06]">
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>Sync: {activeKiosk.lastUpdated.split('T')[1]?.slice(0, 5) || '16:45'} UTC</span>
            </span>
            <span className="text-emerald font-bold">
              {activeKiosk.turfBonusMultiplier}x Turf Multiplier
            </span>
          </div>

          {/* Demo Data Disclaimer Badge */}
          <div className="text-[9px] font-mono text-amber bg-amber/10 border border-amber/30 rounded-lg p-1 text-center font-bold">
            DEMO DATA • SIMULATED DELHI TELEMETRY
          </div>

          {/* Action Button */}
          {(!isSwollenHazard || activeKiosk.hazmatCertified) && (
            <button
              type="button"
              onClick={() => onSelectKiosk(activeKiosk.id)}
              className={`w-full py-1.5 px-3 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-emerald-glow active:scale-95 ${
                selectedKioskId === activeKiosk.id
                  ? 'bg-emerald text-black font-extrabold'
                  : 'bg-emerald/20 hover:bg-emerald text-emerald hover:text-black border border-emerald/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {selectedKioskId === activeKiosk.id
                  ? '✓ Pod Locked for Drop-Off'
                  : 'Select Drop-Off Pod'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MAP LEGEND OVERLAY (WHEN TOGGLED)                                     */}
      {/* --------------------------------------------------------------------- */}
      {showLegend && (
        <div className="absolute bottom-4 left-3 z-30 p-3.5 rounded-2xl liquid-glass border border-white/15 shadow-2xl backdrop-blur-xl text-xs space-y-2.5 max-w-[270px]">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-text-muted">
            <span>OPERATIONAL MAP LEGEND</span>
            <button
              type="button"
              onClick={() => setShowLegend(false)}
              className="text-text-muted hover:text-text-primary cursor-pointer active:scale-95 p-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald/30 border border-emerald" />
              <span className="text-text-secondary">ACTIVE Kiosk Pod</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber/30 border border-amber" />
              <span className="text-text-secondary">BUSY / High Fill Pod</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-red-500/30 border border-red-500" />
              <span className="text-text-secondary">OFFLINE / Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan/30 border border-cyan" />
              <span className="text-text-secondary">Autonomous / EV Shuttle</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-lavender/30 border border-lavender" />
              <span className="text-text-secondary">Perimeter Gate (Gate 1/2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-0.5 bg-cyan/80" />
              <span className="text-text-secondary">Transit Arterial Route</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 text-[9px] font-mono text-amber">
            Note: All displayed kiosk positions and telemetry are simulated demonstration data.
          </div>
        </div>
      )}
    </div>
  )
}

export default CampusInteractiveMap
