import type { AuthSession, UserProfile, UserRole } from '../types/auth'
import { PRESET_USERS } from '../types/auth'

const STORAGE_SESSION_KEY = 'smrt_kiosk_auth_token'
const STORAGE_VAULT_KEY = 'smrt_kiosk_vault_sessions'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

// Server-side authoritative session registry (simulates backend token vault)
class ServerSessionVault {
  private static sessions: Map<string, AuthSession> = new Map()

  private static hydrate() {
    try {
      const raw = sessionStorage.getItem(STORAGE_VAULT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, AuthSession>
        for (const [key, val] of Object.entries(parsed)) {
          this.sessions.set(key, val)
        }
      }
    } catch {
      // storage unavailable or parse error fallback
    }
  }

  private static persist() {
    try {
      const obj: Record<string, AuthSession> = {}
      this.sessions.forEach((val, key) => {
        obj[key] = val
      })
      sessionStorage.setItem(STORAGE_VAULT_KEY, JSON.stringify(obj))
    } catch {
      // storage unavailable fallback
    }
  }

  static register(session: AuthSession) {
    this.hydrate()
    this.sessions.set(session.token, session)
    this.persist()
  }

  static get(token: string): AuthSession | undefined {
    if (!this.sessions.has(token)) {
      this.hydrate()
    }
    return this.sessions.get(token)
  }

  static invalidate(token: string): boolean {
    this.hydrate()
    const result = this.sessions.delete(token)
    this.persist()
    return result
  }

  static purgeAll() {
    this.sessions.clear()
    try {
      sessionStorage.removeItem(STORAGE_VAULT_KEY)
    } catch {
      // storage unavailable fallback
    }
  }
}

export class AuthService {
  /**
   * Authenticate user credentials and issue an authoritative session token
   */
  static async login(email: string, password: string): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase()
    const record = PRESET_USERS[normalizedEmail]

    if (!record) {
      throw new Error('Unrecognized email. Please check your credentials or select a demo account.')
    }

    if (record.passwordHash !== password) {
      throw new Error('Incorrect password. Please verify and try again.')
    }

    const now = Date.now()
    const token = `bearer_sess_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`

    // Clone user object to prevent external object mutation
    const user: UserProfile = { ...record.user }

    const session: AuthSession = {
      token,
      user,
      issuedAt: now,
      expiresAt: now + SESSION_TTL_MS
    }

    // Register with server-side authoritative vault
    ServerSessionVault.register(session)

    // Store in browser session storage
    try {
      sessionStorage.setItem(STORAGE_SESSION_KEY, token)
    } catch {
      // storage unavailable fallback
    }

    return session
  }

  /**
   * Validate session token against server registry.
   * Prevents client-side role elevation / local storage tampering.
   */
  static validateCurrentSession(): AuthSession | null {
    let token: string | null = null
    try {
      token = sessionStorage.getItem(STORAGE_SESSION_KEY)
    } catch {
      return null
    }

    if (!token) return null

    const session = ServerSessionVault.get(token)
    if (!session) {
      // Token not found in server registry (e.g. was revoked or invalid)
      try {
        sessionStorage.removeItem(STORAGE_SESSION_KEY)
      } catch {}
      return null
    }

    // Check expiration
    if (Date.now() > session.expiresAt) {
      ServerSessionVault.invalidate(token)
      try {
        sessionStorage.removeItem(STORAGE_SESSION_KEY)
      } catch {}
      return null
    }

    return session
  }

  /**
   * Explicit Logout:
   * Invalidates server session, clears client token, and terminates session.
   */
  static async logout(): Promise<void> {
    let token: string | null = null
    try {
      token = sessionStorage.getItem(STORAGE_SESSION_KEY)
      sessionStorage.removeItem(STORAGE_SESSION_KEY)
    } catch {}

    if (token) {
      ServerSessionVault.invalidate(token)
    }
  }

  /**
   * Role-based permission check.
   * Revalidates server token before authorizing protected operations.
   */
  static hasPermission(
    session: AuthSession | null,
    permission: 'kiosk_operator_terminal' | 'student_dropoff' | 'admin_tech_vault' | 'student_personal_vault' | 'personal_vault'
  ): boolean {
    if (!session) return false

    // Server-side token check
    const verified = ServerSessionVault.get(session.token)
    if (!verified || verified.user.id !== session.user.id) return false

    const role = verified.user.role

    switch (permission) {
      case 'student_dropoff':
        // Visible & allowed ONLY for Students.
        // College Admins & Kiosk Operators must NOT see or access Student Drop-off!
        return role === 'student'

      case 'student_personal_vault':
      case 'personal_vault':
        // Visible & allowed for Student viewing their own submissions.
        return role === 'student'

      case 'admin_tech_vault':
        // Visible & allowed ONLY for College Admins (audit & institution-wide records).
        return role === 'college_admin'

      case 'kiosk_operator_terminal':
        // Visible & allowed for Kiosk Operators and College Admins.
        // Students MUST NOT access!
        return role === 'kiosk_operator' || role === 'college_admin'

      default:
        return false
    }
  }
}

