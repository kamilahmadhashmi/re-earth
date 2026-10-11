import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { TopNav } from '../../src/components/ui/TopNav'
import { useWorldStore } from '../../src/store/useWorldStore'
import { useAuthStore } from '../../src/store/useAuthStore'

describe('TopNav Component', () => {
  beforeEach(() => {
    useWorldStore.setState({
      viewMode: 'globe',
      activeModal: null,
      currentRoute: 'world'
    })
    useAuthStore.setState({
      isAuthenticated: true,
      currentUser: {
        id: 'usr-student-aarav',
        email: 'aarav.sharma@dtu.ac.in',
        name: 'Aarav Sharma',
        role: 'student',
        campusId: 'dtu',
        studentId: '2023/CO/042',
        joinedAt: '2026-08-15T09:00:00Z',
        lastLoginAt: '2026-10-11T09:30:00Z'
      }
    })
  })

  it('renders brand identity and user profile badge', () => {
    render(<TopNav />)
    expect(screen.getByRole('button', { name: /RE.*EARTH/i })).toBeInTheDocument()
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
  })

  it('renders action buttons: Recycle, Vault, Sponsor', () => {
    render(<TopNav />)
    expect(screen.getByRole('button', { name: /^Recycle$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Vault$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sponsor$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Become a Sponsor/i })).not.toBeInTheDocument()
  })

  it('triggers Recycle modal on clicking Recycle button', () => {
    render(<TopNav />)
    const recycleBtn = screen.getByRole('button', { name: /^Recycle$/i })
    fireEvent.click(recycleBtn)
    expect(useWorldStore.getState().activeModal).toBe('recycle')
  })

  it('triggers navigation to Sponsor Portal on clicking Sponsor button', () => {
    render(<TopNav />)
    const sponsorBtn = screen.getByRole('button', { name: /^Sponsor$/i })
    fireEvent.click(sponsorBtn)
    expect(useWorldStore.getState().currentRoute).toBe('sponsor')
  })

  it('toggles 3D view mode between World and Forest', () => {
    render(<TopNav />)
    const forestBtn = screen.getByRole('button', { name: /Forest/i })
    fireEvent.click(forestBtn)
    expect(useWorldStore.getState().viewMode).toBe('skyline')

    const worldBtn = screen.getByRole('button', { name: /World/i })
    fireEvent.click(worldBtn)
    expect(useWorldStore.getState().viewMode).toBe('globe')
  })

  it('does not render any mute/volume button, but keeps rankings and profile badge aligned', () => {
    render(<TopNav />)
    // Verify audio / mute button is absent
    expect(screen.queryByTitle(/Toggle Spatial Synthetic Audio Drone/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Audio On/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Muted$/i)).not.toBeInTheDocument()

    // Verify Rankings button and student badge remain present and aligned
    expect(screen.getByRole('button', { name: /Rankings/i })).toBeInTheDocument()
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
  })

  it('renders Kiosk Operator Terminal and Sponsor for kiosk_operator role', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      currentUser: {
        id: 'usr-op-vikram',
        email: 'vikram.singh@dtu.ac.in',
        name: 'Vikram Singh',
        role: 'kiosk_operator',
        campusId: 'dtu',
        studentId: 'OP-DTU-01',
        joinedAt: '2026-08-15T09:00:00Z',
        lastLoginAt: '2026-10-11T09:30:00Z'
      }
    })

    render(<TopNav />)
    expect(screen.getByRole('button', { name: /Kiosk Operator Terminal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sponsor$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Recycle$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Vault$/i })).not.toBeInTheDocument()
    expect(screen.getByText('OPERATOR')).toBeInTheDocument()
  })

  it('renders Admin Tech Vault and Sponsor for college_admin role', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      currentUser: {
        id: 'usr-admin-priya',
        email: 'priya.nair@dtu.ac.in',
        name: 'Prof. Priya Nair',
        role: 'college_admin',
        campusId: 'dtu',
        studentId: 'ADM-DTU-01',
        joinedAt: '2026-08-15T09:00:00Z',
        lastLoginAt: '2026-10-11T09:30:00Z'
      }
    })

    render(<TopNav />)
    expect(screen.getByRole('button', { name: /Admin Tech Vault/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sponsor$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Recycle$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Vault$/i })).not.toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('triggers logout when clicking logout button', async () => {
    render(<TopNav />)
    const logoutBtn = screen.getByRole('button', { name: /Log Out/i })
    expect(logoutBtn).toBeInTheDocument()
    
    await act(async () => {
      fireEvent.click(logoutBtn)
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().currentUser).toBeNull()
  })

  it('renders user profile as a status badge without triggering logout', () => {
    render(<TopNav />)
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
    // Verify user profile badge is display-only and does not log out
    const profileBadge = screen.getByText('Aarav Sharma').closest('#btn-topnav-user-profile')
    expect(profileBadge).toBeInTheDocument()
    expect(profileBadge?.tagName.toLowerCase()).toBe('div')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
