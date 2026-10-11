import { test, expect } from '@playwright/test'

test.describe('RE Earth End-to-End User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
  })

  test('User Journey 1: Complete 6-Stage E-Waste Drop-Off Workflow', async ({ page }) => {
    // 1. Open Recycle Modal
    const recycleBtn = page.getByRole('button', { name: /^Recycle$/i }).first()
    await expect(recycleBtn).toBeVisible()
    await recycleBtn.click()

    // Sign in if auth prompt is displayed
    const loginModalSubmit = page.getByRole('button', { name: /Sign In To Session/i })
    if (await loginModalSubmit.isVisible()) {
      await loginModalSubmit.click()
      await page.waitForTimeout(1000)
    }

    // Stage 1: Product Vault Selection
    const iphoneCard = page.locator('h4:has-text("iPhone 11")').first()
    await expect(iphoneCard).toBeVisible()
    await iphoneCard.click()
    await page.waitForTimeout(500)

    const confirmTriageBtn = page.getByRole('button', { name: /Confirm & Triage/i }).first()
    await expect(confirmTriageBtn).toBeVisible()
    await confirmTriageBtn.click()
    await page.waitForTimeout(1000)

    // Stage 2: Condition & Hazmat Triage
    const conditionCard = page.locator('h4:has-text("Mint")').or(page.locator('text=Mint / Functional')).first()
    if (await conditionCard.isVisible()) {
      await conditionCard.click()
      await page.waitForTimeout(500)
    }
    const toStage3Btn = page.getByRole('button', { name: /Continue to Environmental Impact/i }).first()
    await expect(toStage3Btn).toBeVisible()
    await toStage3Btn.click()
    await page.waitForTimeout(1000)

    // Stage 3: Material Profile & Impact
    const toStage4Btn = page.getByRole('button', { name: /Continue to Data-Wipe Protocol/i }).first()
    await expect(toStage4Btn).toBeVisible()
    await toStage4Btn.click()
    await page.waitForTimeout(1000)

    // Stage 4: NIST Data Wipe Protocol
    const stepButtons = page.locator('button:has-text("STEP 0")')
    const count = await stepButtons.count()
    for (let i = 0; i < count; i++) {
      await stepButtons.nth(i).click()
      await page.waitForTimeout(150)
    }

    const wipeCheckbox = page.locator('input[type="checkbox"]').first()
    if (await wipeCheckbox.isVisible()) {
      await wipeCheckbox.check()
      await page.waitForTimeout(300)
    }
    const toStage5Btn = page.getByRole('button', { name: /Continue to Select Kiosk/i }).first()
    await expect(toStage5Btn).toBeVisible()
    await toStage5Btn.click()
    await page.waitForTimeout(1500)

    // Stage 5: Campus Kiosk Map & Selection
    const kioskCard = page.locator('h4:has-text("Kiosk")').or(page.locator('text=Lockers Free')).first()
    if (await kioskCard.isVisible()) {
      await kioskCard.click()
      await page.waitForTimeout(500)
    }
    const generatePassBtn = page.getByRole('button', { name: /Generate Ephemeral QR Pass/i }).first()
    await expect(generatePassBtn).toBeVisible()
    await generatePassBtn.click()
    await page.waitForTimeout(1500)

    // Stage 6: Ephemeral QR Pass Generated (Pass ID format SIG-XXXXXX-CAMPUS)
    const passCode = page.locator('text=/SIG-[0-9A-Z]+|Drop-Off Pass/i').first()
    await expect(passCode).toBeVisible()

    // Close via Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  })

  test('User Journey 2: Tech Vault Ledger & Cryptographic Certificate', async ({ page }) => {
    const vaultBtn = page.getByRole('button', { name: /^Vault$/i }).first()
    await expect(vaultBtn).toBeVisible()
    await vaultBtn.click()
    await page.waitForTimeout(1200)

    // Sign in if needed
    const loginModalSubmit = page.getByRole('button', { name: /Sign In To Session/i })
    if (await loginModalSubmit.isVisible()) {
      await loginModalSubmit.click()
      await page.waitForTimeout(1000)
    }

    // Verify Ledger or Certificate view
    const ledgerTitle = page.locator('text=/Tech Vault|Hardware Ledger|Decentralized Asset Ledger/i').first()
    await expect(ledgerTitle).toBeVisible()

    // Verify Certificate action if item present
    const certBtn = page.locator('button:has-text("View Certificate")').first()
    if (await certBtn.isVisible()) {
      await certBtn.click()
      await page.waitForTimeout(800)
      const certTitle = page.locator('text=/Official E-Waste Diversion Certificate|Cryptographic Proof/i').first()
      await expect(certTitle).toBeVisible()
      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)
    }

    await page.keyboard.press('Escape')
  })

  test('User Journey 3: Corporate Sponsorship Portal & Enquiry Flow', async ({ page }) => {
    // Navigate via TopNav Sponsor button
    const sponsorNavBtn = page.getByRole('button', { name: /^Sponsor$/i }).first()
    await expect(sponsorNavBtn).toBeVisible()
    await sponsorNavBtn.click()
    await page.waitForTimeout(1500)

    // Check Sponsorship hero is visible
    const sponsorHeading = page.locator('text=/Founding Corporate Partnerships|Campus Circularity/i').first()
    await expect(sponsorHeading).toBeVisible()

    // Scroll to Enquiry Form
    await page.evaluate(() => {
      document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'instant' })
    })
    await page.waitForTimeout(1000)

    // Check Enquiry Form validation
    const submitBtn = page.getByRole('button', { name: /Submit Founding Partner Enquiry/i }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(500)
      const errorMsg = page.locator('text=/Organization name is required|Contact name is required/i').first()
      await expect(errorMsg).toBeVisible()
    }

    // Return to World via Back to Orbit button
    const returnBtn = page.locator('button:has-text("Back to Orbit")').first()
    if (await returnBtn.isVisible()) {
      await returnBtn.click()
      await page.waitForTimeout(1000)
    }
  })

  test('User Journey 4: 3D Environment & Interactive Controls', async ({ page }) => {
    // Toggle 3D Skyline / Forest mode
    const forestBtn = page.getByRole('button', { name: /Forest/i }).first()
    await expect(forestBtn).toBeVisible()
    await forestBtn.click()
    await page.waitForTimeout(1000)

    // In Skyline mode, return via Back to World HUD button or Escape
    const backToWorldBtn = page.locator('button:has-text("Back to World")').first()
    if (await backToWorldBtn.isVisible()) {
      await backToWorldBtn.click()
    } else {
      await page.keyboard.press('Escape')
    }
    await page.waitForTimeout(1000)

    // Open Leaderboard / Rankings drawer
    const rankingsBtn = page.getByRole('button', { name: /Leaderboard|Rankings/i }).first()
    if (await rankingsBtn.isVisible()) {
      await rankingsBtn.click()
      await page.waitForTimeout(600)
      const leaderboardTitle = page.locator('text=/Campus Impact Leaderboard|Rankings/i').first()
      await expect(leaderboardTitle).toBeVisible()
      const closeDrawerBtn = page.getByRole('button', { name: /Close Drawer|Close/i }).first()
      if (await closeDrawerBtn.isVisible()) {
        await closeDrawerBtn.click()
      }
    }
  })
})
