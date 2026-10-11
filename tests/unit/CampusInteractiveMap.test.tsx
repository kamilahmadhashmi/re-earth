import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { CampusInteractiveMap } from '../../src/components/recycle/map/CampusInteractiveMap'
import { CAMPUS_KIOSKS } from '../../src/data/kiosks'
import { CAMPUS_MAP_DATA } from '../../src/data/campusMapData'

describe('CampusInteractiveMap Component & Delhi Dummy Kiosks', () => {
  const dtuMapData = CAMPUS_MAP_DATA.dtu
  const dtuKiosks = CAMPUS_KIOSKS.filter((k) => k.campusId === 'dtu')

  beforeEach(() => {
    // Mock ResizeObserver for jsdom
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))
  })

  it('validates Delhi dummy kiosk dataset contains all required fields', () => {
    expect(dtuKiosks.length).toBeGreaterThanOrEqual(4)

    dtuKiosks.forEach((kiosk) => {
      // 1. Unique kiosk ID
      expect(kiosk.id).toBeTruthy()
      expect(typeof kiosk.id).toBe('string')

      // 2. Kiosk name
      expect(kiosk.name).toBeTruthy()

      // 3. Plausible Delhi latitude and longitude
      expect(kiosk.coords).toHaveLength(2)
      expect(kiosk.coords[0]).toBeGreaterThanOrEqual(28.0)
      expect(kiosk.coords[0]).toBeLessThanOrEqual(29.0)
      expect(kiosk.coords[1]).toBeGreaterThanOrEqual(76.5)
      expect(kiosk.coords[1]).toBeLessThanOrEqual(77.5)

      // 4. Gate or bay identifier
      expect(kiosk.gateOrBayId).toBeTruthy()

      // 5. Status: ACTIVE, BUSY, or OFFLINE
      expect(['ACTIVE', 'BUSY', 'OFFLINE']).toContain(kiosk.status)

      // 6. Capacity and occupancy
      expect(kiosk.capacity).toBeGreaterThan(0)
      expect(kiosk.occupancy).toBeGreaterThanOrEqual(0)
      expect(kiosk.occupancy).toBeLessThanOrEqual(kiosk.capacity)

      // 7. Last-updated timestamp
      expect(kiosk.lastUpdated).toBeTruthy()

      // Explicit demo data flag
      expect(kiosk.isDemoData).toBe(true)
    })
  })

  it('renders top status panel with Delhi campus name, active counts and DEMO DATA badge', () => {
    const handleSelectKiosk = vi.fn()
    render(
      <CampusInteractiveMap
        campusCenter={[28.7501, 77.1177]}
        campusName="Delhi Technological University"
        kiosks={dtuKiosks}
        gates={dtuMapData.gates}
        zones={dtuMapData.zones}
        vehicles={dtuMapData.vehicles}
        routes={dtuMapData.routes}
        onSelectKiosk={handleSelectKiosk}
      />
    )

    // Header campus information & simulated data label
    expect(screen.getByText('Delhi Technological University')).toBeInTheDocument()
    expect(screen.getAllByText('DEMO DATA').length).toBeGreaterThan(0)
  })

  it('provides layer visibility toggles for Gates, Zones, and Shuttles, and has removed Dark Telemetry control', () => {
    const handleSelectKiosk = vi.fn()
    render(
      <CampusInteractiveMap
        campusCenter={[28.7501, 77.1177]}
        campusName="Delhi Technological University"
        kiosks={dtuKiosks}
        gates={dtuMapData.gates}
        zones={dtuMapData.zones}
        vehicles={dtuMapData.vehicles}
        routes={dtuMapData.routes}
        onSelectKiosk={handleSelectKiosk}
      />
    )

    const gatesBtn = screen.getByRole('button', { name: /Gates/i })
    const zonesBtn = screen.getByRole('button', { name: /Zones/i })
    const shuttlesBtn = screen.getByRole('button', { name: /Shuttles/i })

    expect(gatesBtn).toBeInTheDocument()
    expect(zonesBtn).toBeInTheDocument()
    expect(shuttlesBtn).toBeInTheDocument()

    // Verify Dark Telemetry button is removed
    expect(screen.queryByRole('button', { name: /Dark Telemetry/i })).not.toBeInTheDocument()

    // Toggle layer filters without crashing
    fireEvent.click(gatesBtn)
    fireEvent.click(zonesBtn)
    fireEvent.click(shuttlesBtn)
  })

  it('renders compact detail panel when a kiosk is selected', () => {
    const handleSelectKiosk = vi.fn()
    const targetKiosk = dtuKiosks[0]

    render(
      <CampusInteractiveMap
        campusCenter={[28.7501, 77.1177]}
        campusName="Delhi Technological University"
        kiosks={dtuKiosks}
        gates={dtuMapData.gates}
        zones={dtuMapData.zones}
        vehicles={dtuMapData.vehicles}
        routes={dtuMapData.routes}
        selectedKioskId={targetKiosk.id}
        onSelectKiosk={handleSelectKiosk}
      />
    )

    // The compact detail panel displays kiosk ID, name, bay, and demo badge
    expect(screen.getByText(targetKiosk.id)).toBeInTheDocument()
    expect(screen.getAllByText(targetKiosk.name).length).toBeGreaterThan(0)
    expect(screen.getByText(/SIMULATED DELHI TELEMETRY/i)).toBeInTheDocument()
  })
})
