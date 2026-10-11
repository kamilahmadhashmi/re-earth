import { create } from 'zustand'
import type { AuthSession, UserProfile } from '../types/auth'
import { AuthService } from '../services/authService'

interface AuthStoreState {
  session: AuthSession | null
  currentUser: UserProfile | null
  isAuthenticated: boolean
  isLoginModalOpen: boolean
  authError: string | null
  isLoading: boolean
  expiredMessage: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  openLoginModal: (reason?: string) => void
  closeLoginModal: () => void
  clearError: () => void
  checkSession: () => void
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  session: null,
  currentUser: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  authError: null,
  isLoading: false,
  expiredMessage: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null, expiredMessage: null })
    try {
      const session = await AuthService.login(email, password)
      set({
        session,
        currentUser: session.user,
        isAuthenticated: true,
        isLoginModalOpen: false,
        isLoading: false,
        authError: null
      })
      return true
    } catch (err: any) {
      set({
        authError: err.message || 'Authentication failed. Please verify credentials.',
        isLoading: false
      })
      return false
    }
  },

  logout: async () => {
    await AuthService.logout()
    set({
      session: null,
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      isLoginModalOpen: false,
      expiredMessage: 'You have been successfully logged out.'
    })
  },

  openLoginModal: (reason?: string) => {
    set({
      isLoginModalOpen: true,
      authError: null,
      expiredMessage: reason || null
    })
  },

  closeLoginModal: () => {
    set({ isLoginModalOpen: false, authError: null })
  },

  clearError: () => {
    set({ authError: null })
  },

  checkSession: () => {
    const verified = AuthService.validateCurrentSession()
    if (verified) {
      set({
        session: verified,
        currentUser: verified.user,
        isAuthenticated: true
      })
    } else {
      set({
        session: null,
        currentUser: null,
        isAuthenticated: false
      })
    }
  }
}))
