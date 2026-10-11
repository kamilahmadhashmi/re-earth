export type DeviceCategory =
  | 'smartphones'
  | 'laptops'
  | 'tablets'
  | 'monitors'
  | 'desktops'
  | 'accessories'
  | 'audio'
  | 'other'

export interface MaterialDisclosure {
  material: string
  amount: string
  recoverable: boolean
  description: string
}

export interface WipeStep {
  step: number
  title: string
  detail: string
  officialDocUrl?: string
}

export interface DeviceWipeGuidance {
  platform: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'wearable' | 'generic'
  summary: string
  steps: WipeStep[]
}

export interface ProductRecord {
  id: string
  manufacturer: string
  model: string
  variant: string
  category: DeviceCategory
  subcategory: string
  defaultMassGrams: number
  batteryType: 'Lithium-ion' | 'Lithium-polymer' | 'NiMH' | 'Lead-acid' | 'None (Mains Powered)'
  batteryCapacityWh?: number
  knownHazards: string[]
  materialDisclosures: MaterialDisclosure[]
  wipeGuidance: DeviceWipeGuidance
  repairabilityScore?: number // out of 10
  co2eAvoidedKg: number // estimated lifecycle emissions avoided
  baseEcoCredits: number
  baseXp: number
  lastVerifiedDate: string
  verificationStatus: 'Verified Official' | 'Manufacturer Disclosed' | 'Community Audited'
  sourceCitation: string
  imageUrl?: string
  accentColor?: string
}

export const PRODUCT_CATALOG: ProductRecord[] = [
  // --- SMARTPHONES ---
  {
    id: 'prod-iphone-11-64',
    manufacturer: 'Apple',
    model: 'iPhone 11',
    variant: '64GB (A2111 / A2223)',
    category: 'smartphones',
    subcategory: 'iOS Smartphone',
    defaultMassGrams: 194,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 11.91,
    knownHazards: [
      'Lithium-ion cell subject to thermal runaway if punctured or mechanically deformed',
      'Cobalt in cathode matrix (approx. 14g)',
      'Brominated flame retardants in legacy PCB laminate'
    ],
    materialDisclosures: [
      { material: 'Recycled Aluminum Frame', amount: '38g', recoverable: true, description: '100% recyclable structural chassis' },
      { material: 'Gold Contacts', amount: '34mg', recoverable: true, description: 'High-purity gold electroplating on logic board & connectors' },
      { material: 'Silver Soldering', amount: '310mg', recoverable: true, description: 'Interconnect solder paste' },
      { material: 'Copper Wiring & Coils', amount: '18.5g', recoverable: true, description: 'Qi wireless induction coil and traces' },
      { material: 'Cobalt', amount: '13.8g', recoverable: true, description: 'Battery cathode active material' },
      { material: 'Neodymium Rare Earths', amount: '4.2g', recoverable: true, description: 'Haptic Taptic Engine and speaker magnets' }
    ],
    wipeGuidance: {
      platform: 'ios',
      summary: 'Complete Apple Cryptographic Erasure and iCloud Unlink Protocol',
      steps: [
        {
          step: 1,
          title: 'Sign Out of iCloud & Turn Off Find My',
          detail: 'Go to Settings > [Your Profile] > Sign Out. Enter your Apple Account password to disable Activation Lock.',
          officialDocUrl: 'https://support.apple.com/HT201351'
        },
        {
          step: 2,
          title: 'Perform Factory Cryptographic Erasure',
          detail: 'Navigate to Settings > General > Transfer or Reset iPhone > Erase All Content and Settings. Wait for the Hello screen.',
          officialDocUrl: 'https://support.apple.com/HT201252'
        },
        {
          step: 3,
          title: 'Remove Physical SIM or Delete eSIM',
          detail: 'Use a SIM ejector tool to remove your physical carrier nano-SIM card, or confirm deletion of active eSIM profiles.',
          officialDocUrl: 'https://support.apple.com/HT201337'
        }
      ]
    },
    repairabilityScore: 6.0,
    co2eAvoidedKg: 72.0,
    baseEcoCredits: 120,
    baseXp: 150,
    lastVerifiedDate: '2026-03-01',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple iPhone 11 Environmental Report & GSMArena Model A2111 Specs',
    accentColor: '#F5F5F7'
  },
  {
    id: 'prod-iphone-14-128',
    manufacturer: 'Apple',
    model: 'iPhone 14',
    variant: '128GB (A2882)',
    category: 'smartphones',
    subcategory: 'iOS Smartphone',
    defaultMassGrams: 172,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 12.68,
    knownHazards: [
      'Lithium-ion pouch cell volatile under compression',
      'Cobalt in cathode',
      'Trace nickel-manganese formulation'
    ],
    materialDisclosures: [
      { material: '100% Recycled Aluminum Enclosure', amount: '34g', recoverable: true, description: 'Aerospace-grade recycled alloy' },
      { material: '100% Recycled Gold Wire', amount: '28mg', recoverable: true, description: 'Plating in all cameras and main logic board' },
      { material: '100% Recycled Rare Earth Elements', amount: '5.1g', recoverable: true, description: '100% of magnets in MagSafe and Taptic Engine' },
      { material: 'Copper', amount: '16.2g', recoverable: true, description: 'High-speed multilayer traces' }
    ],
    wipeGuidance: {
      platform: 'ios',
      summary: 'Apple Modern Secure Enclave Sanitization',
      steps: [
        {
          step: 1,
          title: 'Disable Find My & Activation Lock',
          detail: 'Open Settings > [Name] > Find My > Turn off Find My iPhone.',
          officialDocUrl: 'https://support.apple.com/HT201351'
        },
        {
          step: 2,
          title: 'Erase All Content and Settings',
          detail: 'Settings > General > Transfer or Reset iPhone > Erase All Content. Secure Enclave wipes cryptographic key instantly.',
          officialDocUrl: 'https://support.apple.com/HT201252'
        },
        {
          step: 3,
          title: 'Deactivate Carrier Cellular Plan',
          detail: 'Remove SIM card tray or clear cellular eSIM profile under Settings > Cellular.',
          officialDocUrl: 'https://support.apple.com/HT201337'
        }
      ]
    },
    repairabilityScore: 7.0,
    co2eAvoidedKg: 61.0,
    baseEcoCredits: 145,
    baseXp: 180,
    lastVerifiedDate: '2026-02-15',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple iPhone 14 Environmental Report (100% Recycled Gold/Rare Earths)',
    accentColor: '#98E2FF'
  },
  {
    id: 'prod-samsung-s23-ultra',
    manufacturer: 'Samsung',
    model: 'Galaxy S23 Ultra',
    variant: '256GB / 12GB RAM (SM-S918B)',
    category: 'smartphones',
    subcategory: 'Android Smartphone',
    defaultMassGrams: 234,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 19.25,
    knownHazards: [
      '5,000 mAh high-capacity Lithium-ion cell with electrolyte flammability hazard',
      'Heavy metals in quad optical camera stabilization modules'
    ],
    materialDisclosures: [
      { material: 'Armor Aluminum & Recycled Ocean Plastic', amount: '48g', recoverable: true, description: 'Internal S-Pen bracket from discarded fishing nets' },
      { material: 'Gold Contacts', amount: '42mg', recoverable: true, description: 'PCB substrate gold deposition' },
      { material: 'Recycled Glass (Gorilla Glass Victus 2)', amount: '36g', recoverable: true, description: '22% pre-consumer recycled glass content' },
      { material: 'Copper Vapor Chamber', amount: '12.4g', recoverable: true, description: 'Expanded thermal dissipation vapor heatsink' }
    ],
    wipeGuidance: {
      platform: 'android',
      summary: 'Google FRP & Samsung Knox Zero-Fill Factory Reset',
      steps: [
        {
          step: 1,
          title: 'Remove Google & Samsung Accounts',
          detail: 'Go to Settings > Accounts and backup > Manage accounts. Remove Google and Samsung accounts to bypass Factory Reset Protection (FRP).',
          officialDocUrl: 'https://support.google.com/android/answer/6088915'
        },
        {
          step: 2,
          title: 'Execute Knox Factory Data Reset',
          detail: 'Go to Settings > General management > Reset > Factory data reset. Confirm encryption key purge.',
          officialDocUrl: 'https://www.samsung.com/support/mobile-devices/how-to-reset-my-mobile-phone/'
        },
        {
          step: 3,
          title: 'Eject SIM and MicroSD Tray',
          detail: 'Ensure all physical SIM cards and external memory storage are removed from bottom tray.',
          officialDocUrl: 'https://www.samsung.com/support/'
        }
      ]
    },
    repairabilityScore: 4.0,
    co2eAvoidedKg: 78.5,
    baseEcoCredits: 160,
    baseXp: 210,
    lastVerifiedDate: '2026-01-20',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Samsung Electronics Sustainability Report & GSMArena SM-S918B',
    accentColor: '#30D158'
  },
  {
    id: 'prod-pixel-8-pro',
    manufacturer: 'Google',
    model: 'Pixel 8 Pro',
    variant: '128GB / 12GB RAM (GC3VE)',
    category: 'smartphones',
    subcategory: 'Android Smartphone',
    defaultMassGrams: 213,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 19.5,
    knownHazards: [
      '5050 mAh Lithium-ion cell with thermal protection layer',
      'Infrared temperature sensor semiconductor'
    ],
    materialDisclosures: [
      { material: '100% Recycled Aluminum Frame', amount: '41g', recoverable: true, description: 'Polished recycled alloy camera visor' },
      { material: 'Gold Traces', amount: '32mg', recoverable: true, description: 'Tensor G3 processing package' },
      { material: 'Copper Thermal Core', amount: '15.1g', recoverable: true, description: 'Direct contact thermal heatsink' }
    ],
    wipeGuidance: {
      platform: 'android',
      summary: 'Google Titan M2 Security Wipe',
      steps: [
        {
          step: 1,
          title: 'Remove Google Account',
          detail: 'Settings > Passwords & accounts > [Your Google Account] > Remove account.',
          officialDocUrl: 'https://support.google.com/pixelphone/answer/4596836'
        },
        {
          step: 2,
          title: 'Factory Reset All Data',
          detail: 'Settings > System > Reset options > Erase all data (factory reset).',
          officialDocUrl: 'https://support.google.com/pixelphone/answer/4596836'
        },
        {
          step: 3,
          title: 'Eject Physical SIM Tray',
          detail: 'Eject nano-SIM tray using provided SIM key.',
          officialDocUrl: 'https://support.google.com/pixelphone/answer/7021359'
        }
      ]
    },
    repairabilityScore: 7.0,
    co2eAvoidedKg: 75.0,
    baseEcoCredits: 155,
    baseXp: 195,
    lastVerifiedDate: '2026-02-10',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Google Pixel 8 Pro Product Environmental Report',
    accentColor: '#64D2FF'
  },

  // --- LAPTOPS ---
  {
    id: 'prod-macbook-pro-14-m3',
    manufacturer: 'Apple',
    model: 'MacBook Pro 14"',
    variant: 'Apple M3 Pro / 18GB / 512GB (A2992)',
    category: 'laptops',
    subcategory: 'macOS Laptop',
    defaultMassGrams: 1610,
    batteryType: 'Lithium-polymer',
    batteryCapacityWh: 72.4,
    knownHazards: [
      'High-capacity 72.4 Wh Lithium-polymer 6-cell battery system',
      'High voltage capacitors in power delivery circuitry'
    ],
    materialDisclosures: [
      { material: '100% Recycled Aluminum Unibody', amount: '820g', recoverable: true, description: 'Custom Apple aluminum alloy machined chassis' },
      { material: '100% Recycled Gold Plating', amount: '120mg', recoverable: true, description: 'All Apple-designed logic board layers' },
      { material: '100% Recycled Rare Earth Elements', amount: '42g', recoverable: true, description: 'Force Touch trackpad, six-speaker sound system magnets' },
      { material: '100% Recycled Tin in Solder', amount: '15g', recoverable: true, description: 'Multiple printed circuit boards' },
      { material: '100% Recycled Cobalt in Battery', amount: '68g', recoverable: true, description: 'Certified closed-loop recycled cobalt' }
    ],
    wipeGuidance: {
      platform: 'macos',
      summary: 'Apple Silicon Erase Assistant (Instant Secure Enclave Cryptographic Zeroing)',
      steps: [
        {
          step: 1,
          title: 'Sign Out of Apple Account & Disable Find My Mac',
          detail: 'System Settings > [Name] > Sign Out. Turn off Find My Mac to disengage Activation Lock.',
          officialDocUrl: 'https://support.apple.com/HT201065'
        },
        {
          step: 2,
          title: 'Launch Erase Assistant',
          detail: 'System Settings > General > Transfer or Reset > Erase All Content and Settings. Enter Admin credentials and follow on-screen prompts.',
          officialDocUrl: 'https://support.apple.com/HT212749'
        },
        {
          step: 3,
          title: 'Unpair Bluetooth Peripherals',
          detail: 'Disconnect wireless mouse, keyboard, or headphones before closing display lid.',
          officialDocUrl: 'https://support.apple.com/HT201065'
        }
      ]
    },
    repairabilityScore: 5.0,
    co2eAvoidedKg: 245.0,
    baseEcoCredits: 420,
    baseXp: 550,
    lastVerifiedDate: '2026-03-05',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple MacBook Pro 14-inch Environmental Report (Nov 2023)',
    accentColor: '#BF5AF2'
  },
  {
    id: 'prod-macbook-air-m1-13',
    manufacturer: 'Apple',
    model: 'MacBook Air 13"',
    variant: 'Apple M1 / 8GB / 256GB (A2337)',
    category: 'laptops',
    subcategory: 'macOS Laptop',
    defaultMassGrams: 1290,
    batteryType: 'Lithium-polymer',
    batteryCapacityWh: 49.9,
    knownHazards: [
      '49.9 Wh Lithium-polymer pouch cells adhered to lower chassis',
      'Neodymium permanent magnets around lid perimeter'
    ],
    materialDisclosures: [
      { material: '100% Recycled Aluminum Enclosure', amount: '690g', recoverable: true, description: 'Zero virgin bauxite mining' },
      { material: 'Gold in Logic Board', amount: '85mg', recoverable: true, description: 'Micro-contacts on M1 system on chip' },
      { material: 'Recycled Tin Solder', amount: '9.2g', recoverable: true, description: 'Lead-free RoHS compliant solder' }
    ],
    wipeGuidance: {
      platform: 'macos',
      summary: 'Apple M1 Silicon Erase Assistant or Recovery Utility',
      steps: [
        {
          step: 1,
          title: 'Sign Out of Apple Account & Deauthorize Mac',
          detail: 'System Preferences > Apple ID > Overview > Sign Out. Turn off Find My Mac.',
          officialDocUrl: 'https://support.apple.com/HT201065'
        },
        {
          step: 2,
          title: 'Erase Macintosh HD in macOS Recovery',
          detail: 'Shut down. Press and hold power button until "Loading startup options" appears. Select Options > Disk Utility > Erase Macintosh HD.',
          officialDocUrl: 'https://support.apple.com/HT208496'
        }
      ]
    },
    repairabilityScore: 6.5,
    co2eAvoidedKg: 198.0,
    baseEcoCredits: 360,
    baseXp: 480,
    lastVerifiedDate: '2026-02-28',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple MacBook Air Environmental Report 2020',
    accentColor: '#FFD60A'
  },
  {
    id: 'prod-dell-xps-15',
    manufacturer: 'Dell',
    model: 'XPS 15 9530',
    variant: 'Intel Core i7-13700H / 16GB / 512GB SSD / RTX 4050',
    category: 'laptops',
    subcategory: 'Windows Laptop',
    defaultMassGrams: 1920,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 86.0,
    knownHazards: [
      'High-capacity 86 Wh 6-cell Lithium-ion battery pack',
      'Copper dual heatpipes with sintered capillary wick',
      'Lead-free RoHS solder with silver alloy'
    ],
    materialDisclosures: [
      { material: 'CNC Machined Aluminum & Carbon Fiber', amount: '950g', recoverable: true, description: 'Composite palmrest and aluminum shell' },
      { material: 'High Purity Copper Heatsink', amount: '110g', recoverable: true, description: 'Dual fan thermal dissipation fin stack' },
      { material: 'Gold Contact Pins', amount: '95mg', recoverable: true, description: 'PCIe NVMe M.2 and DDR5 SODIMM sockets' },
      { material: 'Cobalt & Lithium in 86Wh Pack', amount: '82g', recoverable: true, description: 'Recoverable battery cathode mass' }
    ],
    wipeGuidance: {
      platform: 'windows',
      summary: 'Windows BitLocker Deactivation & Cryptographic Drive Wipe',
      steps: [
        {
          step: 1,
          title: 'Unlink Microsoft Account & Disable BitLocker',
          detail: 'Settings > Accounts > Your info > Sign in with a local account instead. Manage BitLocker > Turn off BitLocker.',
          officialDocUrl: 'https://support.microsoft.com/windows/reset-or-reinstall-windows-10-59073041-3444-2453-e579-24707833a6a9'
        },
        {
          step: 2,
          title: 'Execute "Reset This PC" with Full Drive Cleaning',
          detail: 'Settings > System > Recovery > Reset PC > Choose "Remove everything" > Select "Fully clean the drive" (NIST SP 800-88 single-pass zero overwrite).',
          officialDocUrl: 'https://www.dell.com/support/kbdoc/en-us/000176966/reset-or-reinstall-windows-10-on-your-dell-computer'
        },
        {
          step: 3,
          title: 'Eject SD Card & USB Dongles',
          detail: 'Remove full-size SD card from right flank slot and remove any wireless RF receiver dongles.',
          officialDocUrl: 'https://www.dell.com/support'
        }
      ]
    },
    repairabilityScore: 7.0,
    co2eAvoidedKg: 310.0,
    baseEcoCredits: 480,
    baseXp: 620,
    lastVerifiedDate: '2026-01-30',
    verificationStatus: 'Manufacturer Disclosed',
    sourceCitation: 'Dell Technologies Product Carbon Footprint Report (XPS 15 9530)',
    accentColor: '#0EA5E9'
  },
  {
    id: 'prod-thinkpad-x1-carbon',
    manufacturer: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 10',
    variant: 'Intel Core i5-1240P / 16GB / 256GB',
    category: 'laptops',
    subcategory: 'Windows Laptop',
    defaultMassGrams: 1120,
    batteryType: 'Lithium-polymer',
    batteryCapacityWh: 57.0,
    knownHazards: [
      '57 Wh Lithium-polymer battery cell pack',
      'Magnesium alloy base plate requiring separate metallurgical recovery'
    ],
    materialDisclosures: [
      { material: 'Carbon Fiber Hybrid Top Cover', amount: '220g', recoverable: true, description: 'Lightweight reinforced carbon weave' },
      { material: 'Magnesium-Aluminum Bottom Case', amount: '340g', recoverable: true, description: 'High-strength structural casting' },
      { material: 'Gold Pins on M.2 Slots', amount: '65mg', recoverable: true, description: 'Storage and WWAN connectors' }
    ],
    wipeGuidance: {
      platform: 'windows',
      summary: 'Lenovo Commercial Vantage / Windows 11 Cloud Reset Protocol',
      steps: [
        {
          step: 1,
          title: 'Sign Out of Domain / Work Account',
          detail: 'Settings > Accounts > Access work or school > Disconnect organizational accounts.',
          officialDocUrl: 'https://support.lenovo.com'
        },
        {
          step: 2,
          title: 'Secure Erase in BIOS / UEFI',
          detail: 'Boot into ThinkPad BIOS (F1) > Security > ThinkShield Secure Wipe > Erase Internal NVMe SSD with Cryptographic Key Purge.',
          officialDocUrl: 'https://support.lenovo.com/solutions/ht507851'
        }
      ]
    },
    repairabilityScore: 8.0,
    co2eAvoidedKg: 215.0,
    baseEcoCredits: 390,
    baseXp: 500,
    lastVerifiedDate: '2026-02-05',
    verificationStatus: 'Manufacturer Disclosed',
    sourceCitation: 'Lenovo ECO Declaration Sheet & ThinkPad Carbon Footprint Report',
    accentColor: '#EF4444'
  },

  // --- TABLETS ---
  {
    id: 'prod-ipad-pro-11-m2',
    manufacturer: 'Apple',
    model: 'iPad Pro 11"',
    variant: '4th Gen / 128GB Wi-Fi (A2759)',
    category: 'tablets',
    subcategory: 'iPadOS Tablet',
    defaultMassGrams: 466,
    batteryType: 'Lithium-polymer',
    batteryCapacityWh: 28.65,
    knownHazards: [
      '28.65 Wh high surface area Lithium-polymer pouch battery',
      'Strong MagSafe / Smart Connector rare earth neodymium magnets'
    ],
    materialDisclosures: [
      { material: '100% Recycled Aluminum Enclosure', amount: '215g', recoverable: true, description: 'Zero virgin carbon emissions' },
      { material: '100% Recycled Gold Wire', amount: '45mg', recoverable: true, description: 'Liquid Retina display connector and M2 package' },
      { material: '100% Recycled Rare Earths', amount: '18g', recoverable: true, description: 'Magnets across folio docking arrays and speakers' }
    ],
    wipeGuidance: {
      platform: 'ios',
      summary: 'iPadOS Erase All Content and Settings',
      steps: [
        {
          step: 1,
          title: 'Sign Out of Apple Account & Find My iPad',
          detail: 'Settings > [Name] > Sign Out. Ensure Find My iPad is disabled.',
          officialDocUrl: 'https://support.apple.com/HT201351'
        },
        {
          step: 2,
          title: 'Erase All Content and Settings',
          detail: 'Settings > General > Transfer or Reset iPad > Erase All Content and Settings.',
          officialDocUrl: 'https://support.apple.com/HT201252'
        }
      ]
    },
    repairabilityScore: 3.5,
    co2eAvoidedKg: 95.0,
    baseEcoCredits: 210,
    baseXp: 270,
    lastVerifiedDate: '2026-02-18',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple iPad Pro 11-inch Environmental Report (Oct 2022)',
    accentColor: '#30D158'
  },

  // --- MONITORS ---
  {
    id: 'prod-dell-ultrasharp-27-4k',
    manufacturer: 'Dell',
    model: 'UltraSharp 27" 4K',
    variant: 'U2723QE (IPS Black / USB-C Hub)',
    category: 'monitors',
    subcategory: 'Desktop Monitor',
    defaultMassGrams: 4480, // without stand
    batteryType: 'None (Mains Powered)',
    knownHazards: [
      'High-voltage switch mode power supply (SMPS) internal board',
      'LED edge backlight driver circuits with tantalum capacitors',
      'Mercury-free panel, but optical diffusers require separate shredding'
    ],
    materialDisclosures: [
      { material: '85% Post-Consumer Recycled Plastics', amount: '1420g', recoverable: true, description: 'Closed-loop recycled engineering plastics' },
      { material: 'Steel & Aluminum Structural Backing', amount: '1850g', recoverable: true, description: 'Panel reinforcement frame' },
      { material: 'Copper Transformer Cores', amount: '320g', recoverable: true, description: 'Power supply coil windings' },
      { material: 'Gold Contact Fingers', amount: '70mg', recoverable: true, description: 'HDMI 2.1 & DisplayPort 1.4 sockets' }
    ],
    wipeGuidance: {
      platform: 'generic',
      summary: 'Monitor Factory Reset & Peripheral Disconnect',
      steps: [
        {
          step: 1,
          title: 'Reset On-Screen Display (OSD) Settings',
          detail: 'Press joystick on rear of monitor > Menu > Others > Factory Reset. Clears saved user color profiles and EDID customizations.',
          officialDocUrl: 'https://www.dell.com/support'
        },
        {
          step: 2,
          title: 'Disconnect Internal USB Hub Peripherals',
          detail: 'Unplug any USB flash drives, webcam cables, or headphone dongles plugged into the monitor downstream ports.',
          officialDocUrl: 'https://www.dell.com/support'
        }
      ]
    },
    repairabilityScore: 6.0,
    co2eAvoidedKg: 420.0,
    baseEcoCredits: 520,
    baseXp: 700,
    lastVerifiedDate: '2026-01-15',
    verificationStatus: 'Manufacturer Disclosed',
    sourceCitation: 'Dell Technologies Product Environmental Profile U2723QE',
    accentColor: '#38BDF8'
  },

  // --- ACCESSORIES & AUDIO ---
  {
    id: 'prod-airpods-pro-2',
    manufacturer: 'Apple',
    model: 'AirPods Pro (2nd Gen)',
    variant: 'MagSafe Case USB-C (A2968 / A3047)',
    category: 'audio',
    subcategory: 'True Wireless Audio',
    defaultMassGrams: 61,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 1.98,
    knownHazards: [
      'Ultra-compact coin cell Lithium-ion batteries in earbuds and case',
      'Glued enclosure prevents traditional non-destructive battery disassembly'
    ],
    materialDisclosures: [
      { material: '100% Recycled Gold Plating', amount: '6mg', recoverable: true, description: 'Multiple circuit boards' },
      { material: '100% Recycled Rare Earth Elements', amount: '8.5g', recoverable: true, description: 'All acoustic drivers and MagSafe alignment magnets' },
      { material: 'Recycled Tin & Aluminum', amount: '12g', recoverable: true, description: 'Acoustic vents and hinge hardware' }
    ],
    wipeGuidance: {
      platform: 'wearable',
      summary: 'AirPods Hardware Unpair & iCloud De-registration',
      steps: [
        {
          step: 1,
          title: 'Remove from Apple Account in Find My App',
          detail: 'Open Find My app on iPhone/Mac > Devices > Select AirPods Pro > Scroll down and tap "Remove This Device".',
          officialDocUrl: 'https://support.apple.com/HT210982'
        },
        {
          step: 2,
          title: 'Perform Hardware Case Reset',
          detail: 'Place AirPods in case with lid open. Press and hold setup button on back of case for 15 seconds until status light flashes amber, then white.',
          officialDocUrl: 'https://support.apple.com/HT209463'
        }
      ]
    },
    repairabilityScore: 0.0,
    co2eAvoidedKg: 18.0,
    baseEcoCredits: 75,
    baseXp: 95,
    lastVerifiedDate: '2026-02-12',
    verificationStatus: 'Verified Official',
    sourceCitation: 'Apple AirPods Pro (2nd gen) Environmental Report & iFixit Teardown',
    accentColor: '#F5F5F7'
  },
  {
    id: 'prod-anker-powerbank-20k',
    manufacturer: 'Anker',
    model: 'PowerCore 20,000mAh',
    variant: 'A1287 (20W USB-C PD)',
    category: 'accessories',
    subcategory: 'Portable Power Bank',
    defaultMassGrams: 345,
    batteryType: 'Lithium-ion',
    batteryCapacityWh: 74.0,
    knownHazards: [
      'High-energy density 74 Wh 21700 or prismatic lithium-ion battery cells',
      'High fire risk if casing is cracked, dropped, or cells exhibit swelling'
    ],
    materialDisclosures: [
      { material: 'High-Capacity Lithium-Ion Cells', amount: '240g', recoverable: true, description: 'Cobalt, nickel, manganese active cathode' },
      { material: 'Copper Bus Bars & Conductors', amount: '22g', recoverable: true, description: 'Internal cell interconnects' },
      { material: 'ABS Flame-Retardant Polycarbonate Housing', amount: '75g', recoverable: true, description: 'UL94 V-0 flame-rated thermoplastic' }
    ],
    wipeGuidance: {
      platform: 'generic',
      summary: 'Power Bank Safe Discharge & Exterior Inspection',
      steps: [
        {
          step: 1,
          title: 'Verify Physical Casing Integrity',
          detail: 'Inspect for any pillowing, swelling, seam splits, or pungent sweet chemical odor. If swollen, mark condition as Swollen Battery immediately.',
          officialDocUrl: 'https://support.anker.com'
        },
        {
          step: 2,
          title: 'Disconnect All Cables',
          detail: 'Remove all USB-C, Lightning, or Micro-USB charging cables from output ports.',
          officialDocUrl: 'https://support.anker.com'
        }
      ]
    },
    repairabilityScore: 2.0,
    co2eAvoidedKg: 38.0,
    baseEcoCredits: 95,
    baseXp: 120,
    lastVerifiedDate: '2026-01-18',
    verificationStatus: 'Manufacturer Disclosed',
    sourceCitation: 'Anker Safety Data Sheet (SDS) & UL Certification for A1287',
    accentColor: '#30D158'
  }
]
