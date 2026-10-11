export type UserRole = 'student' | 'college_admin' | 'kiosk_operator' | 'central_admin'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  campusId: string
  campusName: string
  studentRollNo?: string
  adminDesignation?: string
  operatorKioskId?: string
  operatorStation?: string
  department?: string
}

export interface AuthSession {
  token: string
  user: UserProfile
  issuedAt: number
  expiresAt: number
}

export const PRESET_USERS: Record<string, { user: UserProfile; passwordHash: string }> = {
  // 1. STUDENTS
  'aarav.sharma@dtu.ac.in': {
    user: {
      id: 'usr_student_dtu_01',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@dtu.ac.in',
      role: 'student',
      campusId: 'dtu',
      campusName: 'Delhi Technological University',
      studentRollNo: '2023/EE/042',
      department: 'Electrical Engineering'
    },
    passwordHash: 'pass123'
  },
  'priya.verma@nsut.ac.in': {
    user: {
      id: 'usr_student_nsut_02',
      name: 'Priya Verma',
      email: 'priya.verma@nsut.ac.in',
      role: 'student',
      campusId: 'nsut',
      campusName: 'Netaji Subhas University of Technology',
      studentRollNo: '2023/CS/118',
      department: 'Computer Science'
    },
    passwordHash: 'pass123'
  },

  // 2. COLLEGE ADMINS (Institutional leadership & audit oversight)
  'kavita.sharma@dtu.ac.in': {
    user: {
      id: 'usr_admin_dtu_lead',
      name: 'Kavita Sharma',
      email: 'kavita.sharma@dtu.ac.in',
      role: 'college_admin',
      campusId: 'dtu',
      campusName: 'Delhi Technological University',
      adminDesignation: 'Campus Facility Director & Academic Dean',
      department: 'Institutional Environmental Compliance'
    },
    passwordHash: 'admin123'
  },
  'dean.sustainability@nsut.ac.in': {
    user: {
      id: 'usr_admin_nsut_dean',
      name: 'Dr. R. K. Mukherjee',
      email: 'dean.sustainability@nsut.ac.in',
      role: 'college_admin',
      campusId: 'nsut',
      campusName: 'Netaji Subhas University of Technology',
      adminDesignation: 'Dean of Sustainability & Campus Infrastructure',
      department: 'Office of Campus Administration'
    },
    passwordHash: 'admin123'
  },

  // 3. KIOSK OPERATORS (Dedicated terminal operators & hardware inspectors)
  'arun.verma@dtu.ac.in': {
    user: {
      id: 'usr_operator_dtu_mech',
      name: 'Arun Verma',
      email: 'arun.verma@dtu.ac.in',
      role: 'kiosk_operator',
      campusId: 'dtu',
      campusName: 'Delhi Technological University',
      operatorKioskId: 'kiosk-dtu-mech',
      operatorStation: 'DTU Mechanical Block Pod Station',
      department: 'Rapid Prototyping & Kiosk Operations'
    },
    passwordHash: 'operator123'
  },
  'deepak.joshi@nsut.ac.in': {
    user: {
      id: 'usr_operator_nsut_sec3',
      name: 'Deepak Joshi',
      email: 'deepak.joshi@nsut.ac.in',
      role: 'kiosk_operator',
      campusId: 'nsut',
      campusName: 'Netaji Subhas University of Technology',
      operatorKioskId: 'kiosk-nsut-sec3',
      operatorStation: 'NSUT Sector-3 Collection Pod Station',
      department: 'Circular Hub Operations'
    },
    passwordHash: 'operator123'
  },

  // 4. CENTRAL PLATFORM ADMINISTRATOR (Cross-campus governance & unassigned applications)
  'central.admin@re-earth.eco': {
    user: {
      id: 'usr_central_platform_admin',
      name: 'Dr. Alistair Vance',
      email: 'central.admin@re-earth.eco',
      role: 'central_admin',
      campusId: 'central_hq',
      campusName: 'RE—EARTH Global Environmental Secretariat',
      adminDesignation: 'Chief Sustainability Officer & Consortium Director',
      department: 'Platform Oversight & Cross-Campus Governance'
    },
    passwordHash: 'admin123'
  }
}
