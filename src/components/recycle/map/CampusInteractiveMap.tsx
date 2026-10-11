import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import {
  Maximize2,
  Minimize2,
  Layers,
  MapPin,
  Shield,
  Navigation,
  Compass,
  Zap,
  Flame,
  CheckCircle2,
  RefreshCw,
  Eye,
  AlertTriangle,
  Info
} from 'lucide-react'
import type { CampusKiosk } from '../../../data/kiosks'
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
  const [tileMode, setTileMode] = useState<'carto_dark' | 'osm_standard'>('carto_dark')
  const [showZones, setShowZones] = useState<boolean>(true)
  const [showGates, setShowGates] = useState<boolean>(true)
  const [showVehicles, setShowVehicles] = useState<boolean>(true)
  const [showRoutes, setShowRoutes] = useState<boolean>(true)
  const [showLegend, setShowLegend] = useState<boolean>(false)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Avoid double initialization in React 18
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapContainerRef.current, {
      center: campusCenter,
      zoom: 16,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 19,
      minZoom: 12
    })

    // Setup base tile layer (CartoDB Dark Matter)
    const cartoDark = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
    )

    cartoDark.addTo(map)
    tileLayerRef.current = cartoDark

    // Create a LayerGroup to hold all interactive markers and polylines
    const markersGroup = L.layerGroup().addTo(map)
    markersLayerGroupRef.current = markersGroup

    mapInstanceRef.current = map
    setIsMapReady(true)

    // Invalidate size once rendered inside dialog
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [campusCenter[0], campusCenter[1]])

  // Handle Tile Provider Switch
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const newLayer =
      tileMode === 'carto_dark'
        ? L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19
            }
          )
        : L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19
            }
          )

    newLayer.addTo(map)
    tileLayerRef.current = newLayer
  }, [tileMode])

  // Center / FlyTo when selected item or campus center changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (selectedKioskId) {
      const selectedKiosk = kiosks.find((k) => k.id === selectedKioskId)
      if (selectedKiosk && selectedKiosk.coords) {
        map.flyTo(selectedKiosk.coords, 17, {
          animate: true,
          duration: 0.8
        })
      }
    }
  }, [selectedKioskId, kiosks])

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

  // Render Markers & Vectors whenever data or layers change
  useEffect(() => {
    const map = mapInstanceRef.current
    const group = markersLayerGroupRef.current
    if (!map || !group) return

    group.clearLayers()

    // -------------------------------------------------------------------------
    // 1. ROUTE POLYLINES
    // -------------------------------------------------------------------------
    if (showRoutes && routes.length > 0) {
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
    // 2. STUDENT DROP-OFF ZONES (Halos & Center Badges)
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
    // 3. SCHOOL GATES (Entrance / Exit)
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
              <span>Security:</span>
              <span class="text-cyan">${gate.securityCheck}</span>
            </div>
          </div>
        `)

        group.addLayer(marker)
      })
    }

    // -------------------------------------------------------------------------
    // 4. TRANSIT SHUTTLES & LOGISTICS VEHICLES
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
    // 5. CAMPUS COLLECTION KIOSKS & DROP-OFF PODS
    // -------------------------------------------------------------------------
    kiosks.forEach((kiosk) => {
      if (!kiosk.coords) return

      const isSelected = selectedKioskId === kiosk.id
      const isHazmat = kiosk.hazmatCertified
      const isRestrictedByHazard = isSwollenHazard && !isHazmat

      const kioskPinHtml = `
        <div class="relative cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2 ${
          isRestrictedByHazard ? 'opacity-40 grayscale' : ''
        }">
          ${
            isSelected
              ? '<div class="absolute -inset-2 rounded-full bg-emerald/30 animate-sonar-ring pointer-events-none"></div>'
              : ''
          }
          <div class="relative w-8 h-8 rounded-xl flex items-center justify-center border shadow-xl backdrop-blur-md transition-all group-hover:scale-125 ${
            isSelected
              ? 'bg-emerald text-black border-white shadow-emerald-glow scale-110'
              : isHazmat
              ? 'bg-amber/20 border-amber/60 text-amber shadow-amber-glow'
              : 'bg-emerald/15 border-emerald/50 text-emerald'
          }">
            ${
              isHazmat
                ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
                : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            }
          </div>
          <div class="mt-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold border whitespace-nowrap shadow-md ${
            isSelected
              ? 'bg-emerald text-black border-white'
              : 'bg-black/90 border-white/20 text-emerald'
          }">
            ${kiosk.name.split(' ')[0]} • ${kiosk.turfBonusMultiplier}x
          </div>
        </div>
      `

      const kioskIcon = L.divIcon({
        html: kioskPinHtml,
        className: 'custom-leaflet-marker',
        iconSize: [36, 48],
        iconAnchor: [18, 24]
      })

      const marker = L.marker(kiosk.coords, { icon: kioskIcon })

      marker.on('click', () => {
        if (!isRestrictedByHazard) {
          onSelectKiosk(kiosk.id)
        }
      })

      // Informative Popup
      marker.bindPopup(`
        <div class="p-3 text-xs space-y-2 min-w-[240px]">
          <div class="flex items-center justify-between text-[10px] font-mono">
            <span class="text-emerald font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
              ${kiosk.campusName}
            </span>
            <span class="px-1.5 py-0.2 rounded bg-amber/15 text-amber border border-amber/30 font-bold">
              ${kiosk.turfBonusMultiplier}x TURF
            </span>
          </div>

          <div>
            <div class="font-bold text-sm text-text-primary">${kiosk.name}</div>
            <div class="text-[11px] text-text-secondary mt-0.5">${kiosk.landmark}</div>
          </div>

          <div class="space-y-1 pt-1.5 border-t border-white/10">
            <div class="flex items-center justify-between text-[10px] font-mono text-text-muted">
              <span>Bin Capacity Fill:</span>
              <span class="text-text-primary font-bold">${kiosk.fillLevelPercent}%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full bg-emerald" style="width: ${kiosk.fillLevelPercent}%"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-text-muted">
            <div>
              <span>Lockers Available:</span>
              <span class="block text-emerald font-bold">${kiosk.availableLockerSlots} Slots</span>
            </div>
            <div>
              <span>Hazmat Rated:</span>
              <span class="block ${kiosk.hazmatCertified ? 'text-emerald' : 'text-text-muted'} font-bold">
                ${kiosk.hazmatCertified ? '✓ Certified Fire Safe' : 'Standard Pod'}
              </span>
            </div>
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
                  class="w-full mt-2 py-1.5 px-3 rounded-lg bg-emerald hover:bg-emerald-bright active:scale-95 text-black font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-emerald-glow"
                >
                  ${isSelected ? '✓ Currently Selected Pod' : 'Lock In 15-Min Reservation'}
                </button>`
          }
        </div>
      `)

      group.addLayer(marker)
    })
  }, [
    kiosks,
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
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        {/* Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-white/15 text-[11px] font-mono shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-text-primary font-bold">{campusName}</span>
          <span className="text-text-muted">•</span>
          <span className="text-cyan">
            {kiosks.length} Pods • {vehicles.length} Shuttles Active
          </span>
        </div>

        {/* Tile & Layer Controls Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full liquid-glass border border-white/15 shadow-xl backdrop-blur-md">
          {/* Layer toggles dropdown/buttons */}
          <button
            type="button"
            onClick={() => setShowGates(!showGates)}
            title="Toggle Campus Entrance/Exit Gates"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showGates
                ? 'bg-emerald/20 text-emerald border border-emerald/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Gates</span>
          </button>

          <button
            type="button"
            onClick={() => setShowZones(!showZones)}
            title="Toggle Student Drop-off Zones"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showZones
                ? 'bg-cyan/20 text-cyan border border-cyan/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span className="hidden sm:inline">Zones</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVehicles(!showVehicles)}
            title="Toggle Shuttles & Logistics Vehicles"
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
              showVehicles
                ? 'bg-lavender/20 text-lavender border border-lavender/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">Shuttles</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setTileMode(tileMode === 'carto_dark' ? 'osm_standard' : 'carto_dark')
            }
            title="Toggle Tile Style (Dark Telemetry / OSM Standard)"
            className="px-2.5 py-1 rounded-full text-[10px] font-mono text-text-secondary hover:text-text-primary border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95"
          >
            {tileMode === 'carto_dark' ? 'OSM Classic' : 'Dark Telemetry'}
          </button>

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
          title="Reset to Campus Overview"
          className="w-8 h-8 rounded-full liquid-glass border border-white/15 text-text-primary hover:text-emerald hover:border-emerald/40 transition-all flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
        >
          <Compass className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-xl liquid-glass border border-white/15 overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors text-sm font-bold font-mono cursor-pointer active:scale-95"
          >
            +
          </button>
          <div className="w-full h-[1px] bg-white/10" />
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-white/10 transition-colors text-sm font-bold font-mono cursor-pointer active:scale-95"
          >
            −
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAP LEGEND OVERLAY (WHEN TOGGLED)                                     */}
      {/* --------------------------------------------------------------------- */}
      {showLegend && (
        <div className="absolute bottom-4 left-3 z-10 p-3 rounded-2xl liquid-glass border border-white/15 shadow-2xl backdrop-blur-xl text-xs space-y-2 max-w-[260px]">
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
              <span className="text-text-secondary">Standard E-Waste Pod</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber/30 border border-amber" />
              <span className="text-text-secondary">Hazmat Certified Fire Safe</span>
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
        </div>
      )}
    </div>
  )
}
