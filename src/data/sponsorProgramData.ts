/**
 * RE—EARTH Corporate Sponsorship Program Data & Constants
 *
 * Grounded definitions for the Founding Corporate Partnerships Phase 2.
 * Honest pilot framing: No fabricated statistics or claims of existing scale.
 */

import type { SponsorshipPathwayId, ContributionType, BudgetRange, PreferredScope } from '../services/sponsorEnquiryService'

export interface SponsorshipPathway {
  id: SponsorshipPathwayId
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  targetAudience: string
  contributions: string[]
  benefits: string[]
  ctaText: string
  recommendedScope: string
}

export const SPONSORSHIP_PATHWAYS: SponsorshipPathway[] = [
  {
    id: 'local_business',
    title: 'Local Business Partner',
    subtitle: 'Champion one nearby university and build direct community goodwill.',
    badge: 'Single Campus Pilot',
    badgeColor: 'text-cyan bg-cyan/10 border-cyan/30',
    targetAudience:
      'Local businesses, small & medium enterprises, retailers, tech co-working hubs, and businesses located near participating colleges.',
    contributions: [
      'Fund or equip one campus recycling initiative or collection drive',
      'Provide sturdy collection bins, sorting containers, or calibrated weighing scales',
      'Underwrite student volunteer rewards or sustainability workshops',
      'Support neighborhood collection logistics with local informal collectors'
    ],
    benefits: [
      'Agreed brand recognition on the supported campus initiative page',
      'Meaningful local community and student-body engagement',
      'Detailed summary report of collected materials and collection dates',
      'Attribution as a founding community partner on digital campus leaderboards'
    ],
    ctaText: 'Support a Campus',
    recommendedScope: '1 Participating College'
  },
  {
    id: 'corporate_sustainability',
    title: 'Corporate Sustainability Partner',
    subtitle: 'Deploy dedicated infrastructure across regional colleges with verified metrics.',
    badge: 'Most Selected • Regional Pilot',
    badgeColor: 'text-emerald bg-emerald/10 border-emerald/30',
    targetAudience:
      'Indian enterprises, corporate sustainability teams, packaging & consumer goods brands, electronics manufacturers, and companies with EPR or ESG objectives.',
    contributions: [
      'Fund a multi-campus regional pilot program (3 to 5 colleges)',
      'Deploy smart drop-off collection lockers and verified weighing stations',
      'Support fair-wage honorariums and safety gear for local informal recycling workers (kabadiwalas)',
      'Sponsor inter-hostel recycling challenges and student innovation prizes'
    ],
    benefits: [
      'Agreed corporate brand presence across supported campus dashboards',
      'Defined 90-day pilot reporting period with transparent material summaries',
      'Direct visibility into verified collection drives and recovery routes',
      'Opportunities for student engagement in campus circularity initiatives'
    ],
    ctaText: 'Discuss a Corporate Partnership',
    recommendedScope: '2 to 5 Colleges'
  },
  {
    id: 'global_impact',
    title: 'Global Impact Partner',
    subtitle: 'Catalyze systemic collegiate recycling infrastructure across multi-city hubs.',
    badge: 'Strategic Founding Partner',
    badgeColor: 'text-amber bg-amber/10 border-amber/30',
    targetAudience:
      'Multinational corporations, international brands, technology conglomerates, and philanthropic climate funds pursuing multi-city impact.',
    contributions: [
      'Underwrite a comprehensive multi-college or multi-city founding pilot',
      'Fund permanent campus circularity infrastructure and safe e-waste storage pods',
      'Supply operational logistics, transportation support, and authorized recyclers',
      'Mobilize corporate employee volunteering alongside collegiate ambassadors'
    ],
    benefits: [
      'Co-created partnership proposal tailored to strategic ESG goals',
      'Consolidated multi-campus telemetry reports across institutions',
      'Prominent founding partner recognition across national campaign pages',
      'Priority expansion pathway to additional university chapters post-pilot'
    ],
    ctaText: 'Explore a Strategic Partnership',
    recommendedScope: 'Multi-College / Multi-City'
  }
]

export interface EcosystemParticipant {
  id: string
  role: string
  title: string
  description: string
  responsibilities: string[]
  icon: string
  color: string
}

export const ECOSYSTEM_PARTICIPANTS: EcosystemParticipant[] = [
  {
    id: 'sponsors',
    role: 'THE CATALYST',
    title: 'Corporate Sponsors',
    description:
      'Provide essential funding, collection bins, weighing equipment, logistics, or campaign resources to transform commitments into real-world action.',
    responsibilities: [
      'Fund collection bins, safety equipment, and logistics',
      'Support fair compensation for informal recycling operators',
      'Enable student-led awareness initiatives and recycling drives'
    ],
    icon: 'Building2',
    color: '#FFD60A'
  },
  {
    id: 'colleges',
    role: 'THE GROUND ACTIVATION',
    title: 'Participating Colleges',
    description:
      'Mobilize thousands of students, faculty, and campus staff around circularity through peer drives, student clubs, and friendly rivalry.',
    responsibilities: [
      'Designate safe, accessible campus drop-off zones',
      'Mobilize student ambassadors and run awareness drives',
      'Foster circular habits across hostels, labs, and faculty housing'
    ],
    icon: 'GraduationCap',
    color: '#30D158'
  },
  {
    id: 'kabadiwalas',
    role: 'THE RECOVERY ENGINE',
    title: 'Kabadiwalas & Recyclers',
    description:
      'Experienced local informal waste collectors and licensed recycling aggregators who sort, weigh, transport, and route waste to certified facilities.',
    responsibilities: [
      'Schedule regular pickups from campus collection points',
      'Accurately weigh and segregate materials at collection time',
      'Route accepted recyclables to certified recovery channels'
    ],
    icon: 'Truck',
    color: '#64D2FF'
  },
  {
    id: 'platform',
    role: 'THE VERIFICATION LAYER',
    title: 'RE—EARTH Platform',
    description:
      'Provides the digital infrastructure that connects all three parties, issues digital weight receipts, attributes results, and displays transparent progress.',
    responsibilities: [
      'Log collection receipts and weighing data',
      'Attribute verified kilograms directly to college and sponsor',
      'Prevent double-counting and present live visual telemetry'
    ],
    icon: 'Layers',
    color: '#BF5AF2'
  }
]

export interface EcosystemStep {
  stepNumber: string
  actor: string
  title: string
  description: string
  highlight: string
}

export const ECOSYSTEM_STEPS: EcosystemStep[] = [
  {
    stepNumber: '01',
    actor: 'COMPANY SPONSORS',
    title: 'Underwrite Infrastructure & Resources',
    description:
      'Corporate partners provide seed capital, collection bins, certified weighing scales, and operational logistics funding to establish the campus collection point.',
    highlight: 'No arbitrary donations — every rupee maps to physical hardware and verified labor.'
  },
  {
    stepNumber: '02',
    actor: 'COLLEGE ACTIVATES',
    title: 'Mobilize Campus Communities',
    description:
      'Student sustainability clubs, engineering societies, and campus admins organize structured collection days, drop-off campaigns, and peer workshops.',
    highlight: 'Students drop off old cables, PCBs, phones, chargers, and segregated recyclables.'
  },
  {
    stepNumber: '03',
    actor: 'RECYCLING PARTNER COLLECTS',
    title: 'Weigh, Sort & Route Responsibly',
    description:
      'Local kabadiwalas and authorized recyclers arrive on scheduled dates, weigh materials on calibrated scales, and route items to authorized recycling facilities.',
    highlight: 'Fair-wage honorariums and dignified working conditions for informal collectors.'
  },
  {
    stepNumber: '04',
    actor: 'PLATFORM REPORTS',
    title: 'Attribute & Display Verified Telemetry',
    description:
      'Both the student and recycling operator confirm the collection receipt digitally. The platform attributes the verified weight to the college and its sponsor.',
    highlight: 'Zero double-counting. Public audit trail accessible to all stakeholders.'
  }
]

export interface SponsorBenefitItem {
  id: string
  title: string
  description: string
  icon: string
  metricsTag: string
}

export const SPONSOR_BENEFITS: SponsorBenefitItem[] = [
  {
    id: 'measurable_recycling',
    title: 'Measurable Recycling Activity',
    description:
      'Track recorded quantities of accepted materials, collection dates, participating campus locations, and recycling operator details on a dedicated dashboard.',
    icon: 'Scale',
    metricsTag: 'Kilograms & Fractions'
  },
  {
    id: 'agreed_brand_recognition',
    title: 'Agreed Brand Recognition',
    description:
      'Feature your agreed company wordmark or logo on sponsored college pages, campaign materials, drop-off bins, and digital leaderboard summaries.',
    icon: 'Award',
    metricsTag: 'Verified Attribution'
  },
  {
    id: 'student_engagement',
    title: 'Student & Community Engagement',
    description:
      'Connect with dynamic university communities through sponsored campus circularity challenges, technical seminars, and student volunteer opportunities.',
    icon: 'Users',
    metricsTag: 'Campus Touchpoints'
  },
  {
    id: 'transparent_reporting',
    title: 'Transparent Verifiable Reporting',
    description:
      'Receive structured impact summaries outlining materials diverted, partner participation, baseline metrics, and digital weight slips at the end of each drive.',
    icon: 'FileCheck2',
    metricsTag: 'Full Audit Trail'
  },
  {
    id: 'leaderboard_recognition',
    title: 'Leaderboard Attribution',
    description:
      'Gain visible recognition on our planetary and collegiate leaderboards, showing how your corporate support directly lifts your partner university.',
    icon: 'Trophy',
    metricsTag: 'Friendly Rivalry'
  },
  {
    id: 'scalable_expansion',
    title: 'Scalable Post-Pilot Expansion',
    description:
      'Evaluate clear data from the 90-day pilot before deciding whether to scale up from a single college to a multi-campus or multi-city network.',
    icon: 'TrendingUp',
    metricsTag: 'Structured Growth'
  }
]

export interface PilotRoadmapPhase {
  phase: string
  title: string
  timeframe: string
  objective: string
  deliverables: string[]
}

export const PILOT_ROADMAP: PilotRoadmapPhase[] = [
  {
    phase: 'STAGE 1',
    title: 'Partnership Alignment & Scoping',
    timeframe: 'Weeks 1–2',
    objective:
      'Align on proposed corporate goals, geographic preferences, preferred material categories, and budget framework.',
    deliverables: [
      'Founding partner memorandum of understanding (MoU)',
      'Definition of preferred colleges or target cities',
      'Initial baseline expectations and scope review'
    ]
  },
  {
    phase: 'STAGE 2',
    title: 'Campus & Recycler Onboarding',
    timeframe: 'Weeks 3–4',
    objective:
      'Secure formal campus agreements, onboard student leadership groups, and contract local authorized recycling partners.',
    deliverables: [
      'Campus administrative approval and space allocation',
      'Local kabadiwala / aggregator service agreement',
      'Recycling protocol, safety triage, and collection schedule'
    ]
  },
  {
    phase: 'STAGE 3',
    title: 'Infrastructure & Campaign Launch',
    timeframe: 'Weeks 5–6',
    objective:
      'Install sponsored collection bins, calibrate scales, train student volunteers, and kick off the campus awareness campaign.',
    deliverables: [
      'Branded collection receptacles placed at designated hubs',
      'Student volunteer briefing & digital receipt setup',
      'Campus-wide awareness campaign rollout'
    ]
  },
  {
    phase: 'STAGE 4',
    title: 'Active Collection & Verification',
    timeframe: 'Weeks 7–10',
    objective:
      'Execute regular collection drives, weigh all segregated materials, issue digital receipts, and attribute progress to partner sponsor.',
    deliverables: [
      'Weekly or bi-weekly verified collection drives',
      'Digital weighing slips and material segregation logs',
      'Live updates to the collegiate leaderboard'
    ]
  },
  {
    phase: 'STAGE 5',
    title: 'Pilot Impact Review & Expansion',
    timeframe: 'Weeks 11–12',
    objective:
      'Synthesize collected data, deliver comprehensive pilot impact report, and evaluate long-term multi-campus expansion.',
    deliverables: [
      'Consolidated Founding Partner Impact Summary',
      'Recycling operator certification receipts',
      'Roadmap for multi-college or multi-city renewal'
    ]
  }
]

export interface BudgetAllocationCategory {
  category: string
  percentage: number
  description: string
  color: string
}

export const PROPOSED_BUDGET_ALLOCATION: BudgetAllocationCategory[] = [
  {
    category: 'Collection Infrastructure & Bins',
    percentage: 35,
    description:
      'Physical collection bins, tamper-evident sorting receptacles, weather-resistant outdoor locks, and calibrated digital scales.',
    color: '#30D158'
  },
  {
    category: 'Recycler Logistics & Operator Honorariums',
    percentage: 25,
    description:
      'Fair compensation for informal waste workers, transportation logistics, sorting labor, and personal protective equipment (PPE).',
    color: '#64D2FF'
  },
  {
    category: 'Student Mobilization & Campus Campaigns',
    percentage: 15,
    description:
      'Student club workshops, campus posters, recycling challenge incentives, and circularity educational materials.',
    color: '#FFD60A'
  },
  {
    category: 'Digital Telemetry & Weighing Records',
    percentage: 15,
    description:
      'Software platform verification, QR digital weight receipts, anti-fraud telemetry checks, and automated reporting generation.',
    color: '#BF5AF2'
  },
  {
    category: 'Program Governance & Safety Audits',
    percentage: 10,
    description:
      'Hazardous material screening oversight, authorized recycler compliance verification, and pilot administration.',
    color: '#F5F5F7'
  }
]

export interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'contributions' | 'operations' | 'csr'
}

export const SPONSOR_FAQS: FAQItem[] = [
  {
    question: 'Who can become a corporate sponsor?',
    answer:
      'Any business or organization interested in supporting real-world campus sustainability can participate. We welcome local businesses seeking community goodwill, mid-sized Indian companies with active environmental priorities, electronics manufacturers, and multinational corporations looking for measurable youth engagement.',
    category: 'general'
  },
  {
    question: 'What can a company contribute to the platform?',
    answer:
      'Contributions can be financial (funding a campus drive or pilot), in-kind (providing heavy-duty bins, digital weighing scales, or safety gear), or operational (providing logistics, recycling facilities, or employee volunteering). The exact mix is customized to your capabilities and organizational goals.',
    category: 'contributions'
  },
  {
    question: 'How are participating colleges selected?',
    answer:
      'During the founding pilot, colleges are prioritized based on geographic feasibility, student community engagement, administrative willingness to host collection points, and proximity to authorized recycling partners. We also welcome corporate partners who wish to sponsor their alumni institutions or colleges located near their offices and factories.',
    category: 'operations'
  },
  {
    question: 'How is collected waste weighed and verified?',
    answer:
      'Waste is collected under a dual-verification protocol: both the campus student representative (or kiosk operator) and the collecting recycler inspect and weigh materials using calibrated digital scales. An ephemeral digital receipt records the material category, weight, and timestamp, attributing the kilograms directly to the college and sponsor without double-counting.',
    category: 'operations'
  },
  {
    question: 'Can a company support multiple colleges or cities?',
    answer:
      'Yes. Our Corporate Sustainability Partner and Global Impact Partner pathways are specifically designed for multi-campus or multi-city footprints. During our pilot phase, we recommend starting with 2 to 5 campuses to establish reliable baseline operations before expanding across state lines.',
    category: 'operations'
  },
  {
    question: 'What reporting and telemetry will the sponsor receive?',
    answer:
      'Sponsors receive a consolidated Founding Pilot Impact Report detailing: total verified kilograms diverted by material category (e.g., cables, boards, batteries, plastics), collection dates, campus participation rates, and authorized downstream recycler receipts. Data is available for your internal sustainability reviews.',
    category: 'general'
  },
  {
    question: 'Can we provide equipment instead of direct cash funding?',
    answer:
      'Yes. In-kind donations of calibrated scales, industrial sorting hampers, e-waste drop-off bins, personal protective equipment (PPE) for collectors, and logistics vehicles are warmly welcomed and credited toward your sponsorship pathway.',
    category: 'contributions'
  },
  {
    question: 'How are sponsorship costs and budgets determined?',
    answer:
      'Budgets are collaborative rather than fixed retail fees. They depend on the number of participating campuses, the duration of the pilot (standard 90 days), whether permanent smart lockers or simpler bins are deployed, and whether collection logistics are covered in-house. We work with you to match your intended budget.',
    category: 'contributions'
  },
  {
    question: 'Can a sponsorship qualify as Corporate Social Responsibility (CSR) expenditure?',
    answer:
      'In India, environmental sustainability and waste management initiatives frequently qualify under Schedule VII of the Companies Act, 2013 (Item iv: ensuring environmental sustainability, ecological balance, and conservation). However, CSR eligibility depends on applicable law, project structuring, and the legal status of the implementing partner agency. We do not provide blanket tax guarantees; our partnership desk works with your legal and CSR compliance teams to structure qualifying agreements.',
    category: 'csr'
  },
  {
    question: 'How do we begin a founding pilot partnership?',
    answer:
      'Submit your interest using the enquiry form below. Our partnership desk will reach out within 2 business days to schedule an introductory 30-minute scoping call, review your preferred locations, share our pilot agreement template, and begin college matching.',
    category: 'general'
  }
]

export interface IllustrativeLeaderboardEntry {
  rank: number
  collegeName: string
  city: string
  sponsorName: string
  sponsorColor: string
  verifiedKg: number
  reportingPeriod: string
  completedDrives: number
}

export const ILLUSTRATIVE_LEADERBOARD_PREVIEW: IllustrativeLeaderboardEntry[] = [
  {
    rank: 1,
    collegeName: 'Delhi Technological University (DTU)',
    city: 'Delhi NCR',
    sponsorName: 'TATA Sustainability',
    sponsorColor: '#3B82F6',
    verifiedKg: 1420.5,
    reportingPeriod: 'Founding Pilot Simulation',
    completedDrives: 6
  },
  {
    rank: 2,
    collegeName: 'Netaji Subhas University of Technology (NSUT)',
    city: 'Delhi NCR',
    sponsorName: 'TCS Green Cloud',
    sponsorColor: '#10B981',
    verifiedKg: 1285.0,
    reportingPeriod: 'Founding Pilot Simulation',
    completedDrives: 5
  },
  {
    rank: 3,
    collegeName: 'IIT Bombay (Hostel Cluster)',
    city: 'Mumbai',
    sponsorName: 'Infosys ESG',
    sponsorColor: '#F59E0B',
    verifiedKg: 1140.2,
    reportingPeriod: 'Founding Pilot Simulation',
    completedDrives: 5
  },
  {
    rank: 4,
    collegeName: 'BITS Pilani (Goa Campus)',
    city: 'Goa',
    sponsorName: 'Google Cloud Sustainability',
    sponsorColor: '#06B6D4',
    verifiedKg: 940.8,
    reportingPeriod: 'Founding Pilot Simulation',
    completedDrives: 4
  },
  {
    rank: 5,
    collegeName: 'RV College of Engineering',
    city: 'Bengaluru',
    sponsorName: 'Dell Circular Tech',
    sponsorColor: '#0EA5E9',
    verifiedKg: 820.0,
    reportingPeriod: 'Founding Pilot Simulation',
    completedDrives: 3
  }
]
