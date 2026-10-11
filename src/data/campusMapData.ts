export interface CampusGate {
  id: string
  campusId: string
  name: string
  type: 'entrance' | 'exit' | 'dual'
  coords: [number, number]
  status: 'open' | 'restricted' | 'closed'
  description: string
  operatingHours: string
  securityCheck: string
}

export interface CampusDropOffZone {
  id: string
  campusId: string
  name: string
  code: string
  coords: [number, number]
  radiusMeters: number
  capacityBays: number
  occupiedBays: number
  status: 'available' | 'busy' | 'full' | 'restricted'
  zoneType: 'express_student' | 'hazmat_triage' | 'transit_hub' | 'locker_walkup'
  rules: string
  acceptedVehicles: string
}

export interface CampusTransitVehicle {
  id: string
  campusId: string
  name: string
  callSign: string
  vehicleType: 'electric_shuttle' | 'logistics_van' | 'autonomous_pod'
  status: 'en_route' | 'docked' | 'delayed'
  currentCoords: [number, number]
  headingDeg: number
  speedKmh: number
  etaMinutes: number
  destinationZoneId: string
  driverOrSystem: string
  passengersOrLoad: string
  batteryPercent: number
}

export interface CampusRoutePolyline {
  id: string
  campusId: string
  name: string
  color: string
  dashArray?: string
  coordinates: [number, number][]
}

export interface CampusTransitEvent {
  id: string
  campusId: string
  timestamp: string
  type: 'drop_off_verified' | 'shuttle_arrival' | 'hazmat_lock' | 'locker_reserved'
  title: string
  description: string
  actor: string
}

export interface CampusMapData {
  gates: CampusGate[]
  zones: CampusDropOffZone[]
  vehicles: CampusTransitVehicle[]
  routes: CampusRoutePolyline[]
  events: CampusTransitEvent[]
}

export const CAMPUS_MAP_DATA: Record<string, CampusMapData> = {
  dtu: {
    gates: [
      {
        id: 'gate-dtu-1',
        campusId: 'dtu',
        name: 'Gate 1 (North Main Entrance)',
        type: 'entrance',
        coords: [28.7482, 77.1198],
        status: 'open',
        description: 'Primary vehicular & shuttle access point from Bawana Road',
        operatingHours: '24/7 RFID & Smart Pass',
        securityCheck: 'Automated ANPR & Student ID'
      },
      {
        id: 'gate-dtu-2',
        campusId: 'dtu',
        name: 'Gate 2 (South Hostel Exit)',
        type: 'exit',
        coords: [28.7530, 77.1152],
        status: 'open',
        description: 'Dedicated transit exit for hostel perimeter & delivery loop',
        operatingHours: '06:00 – 23:00',
        securityCheck: 'Biometric Barrier'
      }
    ],
    zones: [
      {
        id: 'zone-dtu-alpha',
        campusId: 'dtu',
        name: 'Bay Alpha (Express Student Drop-Off)',
        code: 'BAY-A',
        coords: [28.7505, 77.1172],
        radiusMeters: 45,
        capacityBays: 6,
        occupiedBays: 2,
        status: 'available',
        zoneType: 'express_student',
        rules: 'Max 3-minute curb dwell time. Immediate locker allocation.',
        acceptedVehicles: 'Private Cars, E-Rickshaws, Cycles'
      },
      {
        id: 'zone-dtu-bravo',
        campusId: 'dtu',
        name: 'Bay Bravo (Robotics & Hazmat Triage)',
        code: 'BAY-B',
        coords: [28.7518, 77.1162],
        radiusMeters: 35,
        capacityBays: 4,
        occupiedBays: 1,
        status: 'available',
        zoneType: 'hazmat_triage',
        rules: 'Fire-suppression isolation bay for swollen lithium battery handovers.',
        acceptedVehicles: 'Logistics Vans, Hazmat Carts'
      },
      {
        id: 'zone-dtu-charlie',
        campusId: 'dtu',
        name: 'Bay Charlie (Central Library Student Walk-Up)',
        code: 'BAY-C',
        coords: [28.7495, 77.1184],
        radiusMeters: 30,
        capacityBays: 5,
        occupiedBays: 4,
        status: 'busy',
        zoneType: 'locker_walkup',
        rules: 'Pedestrian plaza only. Dedicated smart collection lockers.',
        acceptedVehicles: 'Pedestrians, E-Scooters'
      },
      {
        id: 'zone-dtu-delta',
        campusId: 'dtu',
        name: 'Bay Delta (Campus Transit Hub)',
        code: 'BAY-D',
        coords: [28.7490, 77.1192],
        radiusMeters: 50,
        capacityBays: 8,
        occupiedBays: 3,
        status: 'available',
        zoneType: 'transit_hub',
        rules: 'Scheduled campus EV shuttle arrivals and drop-off staging.',
        acceptedVehicles: 'Campus Shuttles, Maintenance EVs'
      }
    ],
    vehicles: [
      {
        id: 'veh-dtu-shuttle-01',
        campusId: 'dtu',
        name: 'Campus Eco-Shuttle #01',
        callSign: 'SHUTTLE-ALPHA',
        vehicleType: 'electric_shuttle',
        status: 'en_route',
        currentCoords: [28.7486, 77.1195],
        headingDeg: 315,
        speedKmh: 18,
        etaMinutes: 2,
        destinationZoneId: 'zone-dtu-alpha',
        driverOrSystem: 'Autonomous Pilot v3.2',
        passengersOrLoad: '5 Students Onboard',
        batteryPercent: 84
      },
      {
        id: 'veh-dtu-shuttle-02',
        campusId: 'dtu',
        name: 'Campus Eco-Shuttle #02',
        callSign: 'SHUTTLE-BETA',
        vehicleType: 'electric_shuttle',
        status: 'en_route',
        currentCoords: [28.7522, 77.1158],
        headingDeg: 135,
        speedKmh: 14,
        etaMinutes: 5,
        destinationZoneId: 'zone-dtu-charlie',
        driverOrSystem: 'Operator S. Rawat',
        passengersOrLoad: '3 Students Onboard',
        batteryPercent: 62
      },
      {
        id: 'veh-dtu-van-03',
        campusId: 'dtu',
        name: 'SMRT Hazmat Logistics Van',
        callSign: 'CARRIER-03',
        vehicleType: 'logistics_van',
        status: 'docked',
        currentCoords: [28.7516, 77.1164],
        headingDeg: 0,
        speedKmh: 0,
        etaMinutes: 0,
        destinationZoneId: 'zone-dtu-bravo',
        driverOrSystem: 'Hazmat Tech Kavita S.',
        passengersOrLoad: 'Battery Extraction Unit Active',
        batteryPercent: 91
      }
    ],
    routes: [
      {
        id: 'route-dtu-transit-loop',
        campusId: 'dtu',
        name: 'Main Campus Transit & Drop-Off Arterial Loop',
        color: '#64D2FF',
        coordinates: [
          [28.7482, 77.1198],
          [28.7489, 77.1192],
          [28.7495, 77.1184],
          [28.7505, 77.1172],
          [28.7514, 77.1166],
          [28.7518, 77.1162],
          [28.7525, 77.1156],
          [28.7530, 77.1152]
        ]
      },
      {
        id: 'route-dtu-express-shuttle',
        campusId: 'dtu',
        name: 'Inbound Eco-Shuttle Path',
        color: '#30D158',
        dashArray: '6, 6',
        coordinates: [
          [28.7478, 77.1205],
          [28.7482, 77.1198],
          [28.7486, 77.1195],
          [28.7492, 77.1188],
          [28.7505, 77.1172]
        ]
      }
    ],
    events: [
      {
        id: 'evt-1',
        campusId: 'dtu',
        timestamp: '1 min ago',
        type: 'locker_reserved',
        title: '15-Min Locker Slot Reserved',
        description: 'Bay Alpha Pod #3 locked for incoming iPhone 13 triage.',
        actor: 'Student Kiosk User'
      },
      {
        id: 'evt-2',
        campusId: 'dtu',
        timestamp: '4 mins ago',
        type: 'shuttle_arrival',
        title: 'Eco-Shuttle #01 Approaching',
        description: 'Arriving at Bay Alpha Express Drop-Off in 2 mins.',
        actor: 'Autonomous Fleet Telemetry'
      },
      {
        id: 'evt-3',
        campusId: 'dtu',
        timestamp: '12 mins ago',
        type: 'drop_off_verified',
        title: 'Hazmat Batch Certified',
        description: '1.4 kg lithium battery safely loaded into Mech Bay fire safe.',
        actor: 'Lead Tech Kavita'
      }
    ]
  },
  nsut: {
    gates: [
      {
        id: 'gate-nsut-1',
        campusId: 'nsut',
        name: 'NSUT Main Gate (Azad Hind Fauj Marg)',
        type: 'entrance',
        coords: [28.6095, 77.0345],
        status: 'open',
        description: 'Primary portal for student drop-offs and faculty transit',
        operatingHours: '24/7 Access',
        securityCheck: 'RFID Smart Boom Barrier'
      }
    ],
    zones: [
      {
        id: 'zone-nsut-sec3',
        campusId: 'nsut',
        name: 'Sector-3 Tech Drop Zone',
        code: 'NSUT-Z1',
        coords: [28.6085, 77.0355],
        radiusMeters: 40,
        capacityBays: 8,
        occupiedBays: 3,
        status: 'available',
        zoneType: 'express_student',
        rules: 'Curbside drop-off for electronics recycling lockers.',
        acceptedVehicles: 'All vehicles'
      }
    ],
    vehicles: [
      {
        id: 'veh-nsut-01',
        campusId: 'nsut',
        name: 'NSUT Green Carrier Pod',
        callSign: 'NSUT-POD-1',
        vehicleType: 'autonomous_pod',
        status: 'docked',
        currentCoords: [28.6087, 77.0352],
        headingDeg: 90,
        speedKmh: 0,
        etaMinutes: 0,
        destinationZoneId: 'zone-nsut-sec3',
        driverOrSystem: 'Auto-Dock v2',
        passengersOrLoad: 'Hardware Vault Staging',
        batteryPercent: 95
      }
    ],
    routes: [
      {
        id: 'route-nsut-main',
        campusId: 'nsut',
        name: 'NSUT Campus Inbound Arterial',
        color: '#64D2FF',
        coordinates: [
          [28.6095, 77.0345],
          [28.6090, 77.0350],
          [28.6085, 77.0355]
        ]
      }
    ],
    events: [
      {
        id: 'evt-nsut-1',
        campusId: 'nsut',
        timestamp: '5 mins ago',
        type: 'drop_off_verified',
        title: 'Verified Pod Handover',
        description: 'MacBook Air M1 verified at Sector-3 Pod.',
        actor: 'Curator Deepak J.'
      }
    ]
  },
  'iit-delhi': {
    gates: [
      {
        id: 'gate-iitd-main',
        campusId: 'iit-delhi',
        name: 'IIT Delhi Main Gate (Hauz Khas)',
        type: 'entrance',
        coords: [28.5442, 77.1915],
        status: 'open',
        description: 'Gate 1 access to Academic Quad & Bharti School',
        operatingHours: '24/7 Security Controlled',
        securityCheck: 'Campus RFID Pass'
      }
    ],
    zones: [
      {
        id: 'zone-iitd-bharti',
        campusId: 'iit-delhi',
        name: 'Bharti School Hardware Zone',
        code: 'IITD-BHARTI',
        coords: [28.5450, 77.1926],
        radiusMeters: 35,
        capacityBays: 6,
        occupiedBays: 2,
        status: 'available',
        zoneType: 'express_student',
        rules: 'Express student handover zone for IT peripherals.',
        acceptedVehicles: 'Campus Shuttles, Pedestrians'
      }
    ],
    vehicles: [
      {
        id: 'veh-iitd-01',
        campusId: 'iit-delhi',
        name: 'IITD Campus EV Shuttle #4',
        callSign: 'IITD-EV-4',
        vehicleType: 'electric_shuttle',
        status: 'en_route',
        currentCoords: [28.5446, 77.1920],
        headingDeg: 45,
        speedKmh: 12,
        etaMinutes: 1,
        destinationZoneId: 'zone-iitd-bharti',
        driverOrSystem: 'Driver M. Kumar',
        passengersOrLoad: '6 Students Onboard',
        batteryPercent: 78
      }
    ],
    routes: [
      {
        id: 'route-iitd-bharti',
        campusId: 'iit-delhi',
        name: 'Hauz Khas Gate to Bharti School Arterial',
        color: '#64D2FF',
        coordinates: [
          [28.5442, 77.1915],
          [28.5446, 77.1920],
          [28.5450, 77.1926]
        ]
      }
    ],
    events: [
      {
        id: 'evt-iitd-1',
        campusId: 'iit-delhi',
        timestamp: '8 mins ago',
        type: 'locker_reserved',
        title: 'Locker #04 Reserved',
        description: 'Student reserve lock active for 15 mins.',
        actor: 'Rohan Sen (Custodian)'
      }
    ]
  }
}
