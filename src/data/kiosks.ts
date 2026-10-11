export interface CampusKiosk {
  id: string
  campusId: string
  campusName: string
  name: string
  distanceKm: number
  landmark: string
  address: string
  operatingHours: string
  status: 'online' | 'maintenance' | 'offline'
  fillLevelPercent: number
  acceptedCategories: string[]
  hazmatCertified: boolean
  turfBonusMultiplier: number
  availableLockerSlots: number
  operatorOnDuty: string
  contactExtension: string
  coords: [number, number]
}

export const CAMPUS_KIOSKS: CampusKiosk[] = [
  {
    id: 'kiosk-dtu-mech',
    campusId: 'dtu',
    campusName: 'Delhi Technological University',
    name: 'DTU Mechanical Block Kiosk',
    distanceKm: 0.35,
    landmark: 'Ground Floor, Near Robotics & Rapid Prototyping Lab',
    address: 'Bawana Road, Shahbad Daulatpur, Delhi 110042',
    operatingHours: '08:00 – 21:00 Daily',
    status: 'online',
    fillLevelPercent: 42,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'monitors', 'accessories', 'audio', 'other'],
    hazmatCertified: true, // Hazmat Certified!
    turfBonusMultiplier: 1.5,
    availableLockerSlots: 6,
    operatorOnDuty: 'Kavita Sharma (Lead Lab Tech)',
    contactExtension: 'Ext. 4022',
    coords: [28.7514, 77.1166]
  },
  {
    id: 'kiosk-dtu-lib',
    campusId: 'dtu',
    campusName: 'Delhi Technological University',
    name: 'DTU Central Library Smart Bin',
    distanceKm: 0.62,
    landmark: 'Main Library Foyer, Level 1 Circulation Desk',
    address: 'Central Library Building, DTU Campus, Delhi 110042',
    operatingHours: '09:00 – 20:00 Mon-Sat',
    status: 'online',
    fillLevelPercent: 68,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'accessories', 'audio'],
    hazmatCertified: false, // Standard Drop Point Only
    turfBonusMultiplier: 1.2,
    availableLockerSlots: 4,
    operatorOnDuty: 'Arun Verma (Digital Archives)',
    contactExtension: 'Ext. 1105',
    coords: [28.7492, 77.1186]
  },
  {
    id: 'kiosk-nsut-sec3',
    campusId: 'nsut',
    campusName: 'Netaji Subhas University of Technology',
    name: 'NSUT Sector-3 Collection Pod',
    distanceKm: 18.4,
    landmark: 'Near Electronics & Communication Dept, Block VI',
    address: 'Azad Hind Fauj Marg, Sector 3, Dwarka, Delhi 110078',
    operatingHours: '08:30 – 19:30 Mon-Fri',
    status: 'online',
    fillLevelPercent: 55,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'monitors', 'accessories', 'audio', 'other'],
    hazmatCertified: true, // Hazmat Certified!
    turfBonusMultiplier: 1.8,
    availableLockerSlots: 8,
    operatorOnDuty: 'Deepak Joshi (Circular Hub Manager)',
    contactExtension: 'Ext. 2380',
    coords: [28.6085, 77.0355]
  },
  {
    id: 'kiosk-iitd-bharti',
    campusId: 'iit-delhi',
    campusName: 'IIT Delhi',
    name: 'IIT Delhi Bharti School Pod',
    distanceKm: 24.1,
    landmark: 'Bharti School of Telecommunication, Foyer Atrium',
    address: 'Hauz Khas, New Delhi 110016',
    operatingHours: '24/7 Smart Locker Access',
    status: 'online',
    fillLevelPercent: 31,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'accessories', 'audio'],
    hazmatCertified: true,
    turfBonusMultiplier: 1.6,
    availableLockerSlots: 10,
    operatorOnDuty: 'Rohan Sen (IoT Lab Custodian)',
    contactExtension: 'Ext. 7701',
    coords: [28.5450, 77.1926]
  },
  {
    id: 'kiosk-iitb-cse',
    campusId: 'iit-bombay',
    campusName: 'IIT Bombay',
    name: 'IIT Bombay Kanwal Rekhi Hub',
    distanceKm: 1140.0,
    landmark: 'Department of Computer Science & Engg, Ground Floor',
    address: 'Powai, Mumbai, Maharashtra 400076',
    operatingHours: '08:00 – 22:00 Daily',
    status: 'online',
    fillLevelPercent: 60,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'monitors', 'desktops', 'accessories', 'audio', 'other'],
    hazmatCertified: true,
    turfBonusMultiplier: 2.0,
    availableLockerSlots: 12,
    operatorOnDuty: 'Sneha Patil (Sustainable Systems Lab)',
    contactExtension: 'Ext. 8412',
    coords: [19.1334, 72.9133]
  },
  {
    id: 'kiosk-mit-stata',
    campusId: 'mit',
    campusName: 'Massachusetts Institute of Technology',
    name: 'MIT Stata Center Hardware Vault',
    distanceKm: 11500.0,
    landmark: 'Ray and Maria Stata Center, Building 32, Ground Atrium',
    address: '32 Vassar St, Cambridge, MA 02139, USA',
    operatingHours: '24/7 RFID Student Pass Access',
    status: 'online',
    fillLevelPercent: 22,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'monitors', 'desktops', 'accessories', 'audio', 'other'],
    hazmatCertified: true,
    turfBonusMultiplier: 2.2,
    availableLockerSlots: 16,
    operatorOnDuty: 'Marcus Vance (MIT Facilities & Green Lab)',
    contactExtension: 'Ext. 3910',
    coords: [42.3616, -71.0906]
  },
  {
    id: 'kiosk-stanford-gates',
    campusId: 'stanford',
    campusName: 'Stanford University',
    name: 'Stanford Gates Computer Science Pod',
    distanceKm: 12300.0,
    landmark: 'Gates Computer Science Building, Wing B Lobby',
    address: '353 Jane Stanford Way, Stanford, CA 94305, USA',
    operatingHours: '07:00 – 23:00 Daily',
    status: 'online',
    fillLevelPercent: 48,
    acceptedCategories: ['smartphones', 'laptops', 'tablets', 'accessories', 'audio'],
    hazmatCertified: true,
    turfBonusMultiplier: 1.7,
    availableLockerSlots: 7,
    operatorOnDuty: 'Elena Gomez (Campus Sustainability)',
    contactExtension: 'Ext. 6140',
    coords: [37.4300, -122.1733]
  }
]
