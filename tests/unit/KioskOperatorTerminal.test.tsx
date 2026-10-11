import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { KioskOperatorTerminal } from '../../src/components/recycle/operator/KioskOperatorTerminal'
import { useRecycleStore } from '../../src/store/useRecycleStore'
import { useAuthStore } from '../../src/store/useAuthStore'
import { PRODUCT_CATALOG } from '../../src/data/productVaultCatalog'

vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

describe('KioskOperatorTerminal Component', () => {
  beforeEach(() => {
    useRecycleStore.getState().resetWizard()
    useAuthStore.setState({
      isAuthenticated: true,
      currentUser: {
        id: 'usr_operator_dtu_01',
        email: 'operator@dtu.ac.in',
        name: 'Arun Verma (Lead Lab Tech)',
        role: 'kiosk_operator',
        campusId: 'dtu',
        joinedAt: '2026-08-15T09:00:00Z',
        lastLoginAt: '2026-10-11T09:30:00Z'
      }
    })
  })

  it('renders lookup input and scanner standby indicator', () => {
    render(<KioskOperatorTerminal />)
    expect(screen.getByPlaceholderText(/Scan QR token barcode/i)).toBeInTheDocument()
    expect(screen.getByText(/OPERATOR TERMINAL v2.6/i)).toBeInTheDocument()
  })

  it('looks up a pass and renders all five physical inspection criteria', async () => {
    // Generate a pending pass
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    const pass = await useRecycleStore.getState().generateQrPass()

    render(<KioskOperatorTerminal />)

    // Lookup pass
    const input = screen.getByPlaceholderText(/Scan QR token barcode/i)
    fireEvent.change(input, { target: { value: pass.passId } })
    fireEvent.submit(input.closest('form')!)

    // Check criteria are displayed
    expect(screen.getByText(/1\. Hardware Model Verification/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. Declared Condition Integrity/i)).toBeInTheDocument()
    expect(screen.getByText(/3\. Scale Mass Consistency/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. Thermal & Battery Safe Containment/i)).toBeInTheDocument()
    expect(screen.getByText(/5\. Data Sanitization \/ Destruction Tagged/i)).toBeInTheDocument()

    // Counter initially shows 0 of 5 Completed
    expect(screen.getByText(/0 of 5 Completed/i)).toBeInTheDocument()
  })

  it('allows selecting inspection criteria by clicking checkbox or label, updating counter immediately', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    const pass = await useRecycleStore.getState().generateQrPass()

    render(<KioskOperatorTerminal />)

    // Lookup pass
    const input = screen.getByPlaceholderText(/Scan QR token barcode/i)
    fireEvent.change(input, { target: { value: pass.passId } })
    fireEvent.submit(input.closest('form')!)

    // Click first criterion checkbox
    const chkModel = screen.getByRole('checkbox', { name: /1\. Hardware Model Verification/i })
    expect(chkModel).not.toBeChecked()

    fireEvent.click(chkModel)
    expect(chkModel).toBeChecked()
    expect(screen.getByText(/1 of 5 Completed/i)).toBeInTheDocument()

    // Click label for second criterion
    const labelCondition = screen.getByText(/2\. Declared Condition Integrity/i).closest('label')!
    fireEvent.click(labelCondition)
    expect(screen.getByText(/2 of 5 Completed/i)).toBeInTheDocument()

    // Toggle off
    fireEvent.click(chkModel)
    expect(chkModel).not.toBeChecked()
    expect(screen.getByText(/1 of 5 Completed/i)).toBeInTheDocument()
  })

  it('supports keyboard interaction (Space / Enter) on criterion cards', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    const pass = await useRecycleStore.getState().generateQrPass()

    render(<KioskOperatorTerminal />)

    const input = screen.getByPlaceholderText(/Scan QR token barcode/i)
    fireEvent.change(input, { target: { value: pass.passId } })
    fireEvent.submit(input.closest('form')!)

    const chkBattery = screen.getByRole('checkbox', { name: /4\. Thermal & Battery Safe Containment/i })
    fireEvent.keyDown(chkBattery, { key: 'Enter' })
    expect(screen.getByText(/1 of 5 Completed/i)).toBeInTheDocument()

    fireEvent.keyDown(chkBattery, { key: 'Enter' })
    expect(screen.getByText(/0 of 5 Completed/i)).toBeInTheDocument()
  })

  it('shows meaningful error when operator attempts acceptance before completing all criteria', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    const pass = await useRecycleStore.getState().generateQrPass()

    render(<KioskOperatorTerminal />)

    const input = screen.getByPlaceholderText(/Scan QR token barcode/i)
    fireEvent.change(input, { target: { value: pass.passId } })
    fireEvent.submit(input.closest('form')!)

    // Accept button without completing checks
    const acceptBtn = screen.getByRole('button', { name: /Accept & Unlock Hatch/i })
    fireEvent.click(acceptBtn)

    await waitFor(() => {
      expect(screen.getByText(/Physical inspection incomplete: All 5 criteria must be checked/i)).toBeInTheDocument()
    })
  })

  it('successfully accepts pass when all 5 criteria are verified', async () => {
    const iphone = PRODUCT_CATALOG[0]
    useRecycleStore.getState().selectProduct(iphone)
    useRecycleStore.getState().setCondition('mint')
    useRecycleStore.getState().selectKiosk('kiosk-dtu-mech')
    const pass = await useRecycleStore.getState().generateQrPass()

    render(<KioskOperatorTerminal />)

    const input = screen.getByPlaceholderText(/Scan QR token barcode/i)
    fireEvent.change(input, { target: { value: pass.passId } })
    fireEvent.submit(input.closest('form')!)

    // Check all 5
    fireEvent.click(screen.getByRole('checkbox', { name: /1\. Hardware Model Verification/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /2\. Declared Condition Integrity/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /3\. Scale Mass Consistency/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /4\. Thermal & Battery Safe Containment/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /5\. Data Sanitization \/ Destruction Tagged/i }))

    expect(screen.getByText(/5 of 5 Completed/i)).toBeInTheDocument()

    const acceptBtn = screen.getByRole('button', { name: /Accept & Unlock Hatch/i })
    fireEvent.click(acceptBtn)

    await waitFor(() => {
      expect(screen.getByText(/Pass Already Accepted & Redeemed/i)).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /Print Certificate/i })[0]).toBeInTheDocument()
    })
  })
})
