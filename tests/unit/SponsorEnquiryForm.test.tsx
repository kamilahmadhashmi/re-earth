import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { SponsorEnquiryForm } from '../../src/components/sponsor/SponsorEnquiryForm'

describe('SponsorEnquiryForm Component', () => {
  it('renders required organization inputs and pathway selections', () => {
    render(
      <SponsorEnquiryForm
        initialPathway="corporate_sustainability"
        onPathwayChange={vi.fn()}
      />
    )

    expect(screen.getByPlaceholderText(/Acme Tech Solutions/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Priya Sharma/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/p.sharma@acme.com/i)).toBeInTheDocument()
    expect(screen.getByText('Corporate Sustainability')).toBeInTheDocument()
    expect(screen.getByText('Local Business Partner')).toBeInTheDocument()
    expect(screen.getByText('Global Impact Partner')).toBeInTheDocument()
  })

  it('allows switching selected pathway', () => {
    const handlePathwayChange = vi.fn()
    render(
      <SponsorEnquiryForm
        initialPathway="corporate_sustainability"
        onPathwayChange={handlePathwayChange}
      />
    )

    const globalBtn = screen.getByText('Global Impact Partner')
    fireEvent.click(globalBtn)

    expect(handlePathwayChange).toHaveBeenCalledWith('global_impact')
  })

  it('validates required fields before allowing submission', async () => {
    render(
      <SponsorEnquiryForm
        initialPathway="corporate_sustainability"
        onPathwayChange={vi.fn()}
      />
    )

    const submitBtn = screen.getByRole('button', { name: /Submit Founding Partner Enquiry/i })
    fireEvent.click(submitBtn)

    // Errors should appear for empty required fields
    await waitFor(() => {
      expect(screen.getByText(/Organization name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Contact name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Valid work email is required/i)).toBeInTheDocument()
    })
  })
})
