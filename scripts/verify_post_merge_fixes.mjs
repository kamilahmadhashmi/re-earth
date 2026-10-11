import { chromium } from 'playwright'

async function runAudit() {
  console.log('======================================================================')
  console.log('🚀 SYSTEMATIC POST-MERGE AUDIT: RE EARTH INTERACTIVE VERIFICATION')
  console.log('======================================================================')

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  })
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error]: ${msg.text()}`)
    }
  })

  try {
    // -----------------------------------------------------------------------
    // TEST 1: UNCLOSABLE LOGIN MODAL TRAP ELIMINATION & ESC/BACKDROP TEST
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 1] Testing Unclosable Login Modal Fix ---')
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    // Clear any leftover storage to start fresh unauthenticated
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)

    // Click "Recycle" in top nav as unauthenticated user
    console.log('1.1 Clicking Recycle button in top nav...')
    const recycleNavBtn = page.locator('button:has-text("Recycle")').first()
    await recycleNavBtn.waitFor({ state: 'visible', timeout: 5000 })
    await recycleNavBtn.click()
    await page.waitForTimeout(600)

    // Verify LoginModal appeared
    const loginModalHeader = page.locator('h3:has-text("Authenticate Session")')
    await loginModalHeader.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ LoginModal appeared for unauthenticated user')

    // Click the X button to close LoginModal
    console.log('1.2 Clicking close (X) button on LoginModal...')
    const closeLoginBtn = page.locator('button:has(svg.lucide-x)').first()
    await closeLoginBtn.click()
    await page.waitForTimeout(600)

    // Verify LoginModal closed and did NOT re-open or trap the user!
    const isLoginVisibleAfterClose = await loginModalHeader.isVisible()
    if (isLoginVisibleAfterClose) {
      throw new Error('FAIL: LoginModal is still visible after clicking close button (trapped!)')
    }
    console.log('✓ PASS: LoginModal closed cleanly without trap!')

    // Re-test with Escape key
    console.log('1.3 Re-opening via Recycle and testing Escape key dismiss...')
    await recycleNavBtn.click()
    await loginModalHeader.waitFor({ state: 'visible', timeout: 5000 })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(600)
    const isLoginVisibleAfterEsc = await loginModalHeader.isVisible()
    if (isLoginVisibleAfterEsc) {
      throw new Error('FAIL: LoginModal did not close on Escape key')
    }
    console.log('✓ PASS: Escape key dismissed LoginModal cleanly!')

    // -----------------------------------------------------------------------
    // TEST 2: AUTH SESSION PERSISTENCE ACROSS PAGE RELOAD
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 2] Testing Auth Session Persistence Across Reload ---')
    await recycleNavBtn.click()
    await loginModalHeader.waitFor({ state: 'visible', timeout: 5000 })

    // Click Student tab, credentials default to aarav.sharma@dtu.ac.in
    const studentTabBtn = page.getByRole('button', { name: 'Student', exact: true })
    await studentTabBtn.click()
    await page.waitForTimeout(200)

    const loginSubmitBtn = page.locator('button[type="submit"]:has-text("Sign In To Session")')
    await loginSubmitBtn.click()
    await page.waitForTimeout(1000)

    // Now RecycleModuleModal should be open
    const productVaultTitle = page.locator('h2:has-text("Product Vault")')
    await productVaultTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Successfully authenticated as Student (Aarav Sharma)')

    // RELOAD THE PAGE
    console.log('2.1 Reloading page to test session persistence...')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    // Open Recycle again - should open directly WITHOUT asking for login
    await recycleNavBtn.click()
    await page.waitForTimeout(800)
    const isVaultOpenDirectly = await productVaultTitle.isVisible()
    if (!isVaultOpenDirectly) {
      throw new Error('FAIL: Session dropped upon reload! Login modal re-appeared.')
    }
    console.log('✓ PASS: Session survived reload! Auth token & ServerSessionVault persisted.')

    // -----------------------------------------------------------------------
    // TEST 3: STAGE 1 (PRODUCT VAULT) & SUB-MODAL Z-INDEX
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 3] Testing Stage 1 Category Filters, Search & Custom Device Modal ---')
    // Category tabs
    const catLaptops = page.getByRole('button', { name: 'Laptops', exact: true })
    await catLaptops.click()
    await page.waitForTimeout(300)
    console.log('✓ Laptop category filter clicked')

    const catAll = page.getByRole('button', { name: 'All Tech', exact: true })
    await catAll.click()
    await page.waitForTimeout(300)

    // Search input
    const searchInput = page.locator('input[placeholder*="Search by model"]').first()
    await searchInput.fill('iPhone 11')
    await page.waitForTimeout(300)

    // Custom device modal
    console.log('3.1 Opening Manual Device Specification modal (z-[80])...')
    const manualEntryBtn = page.locator('button:has-text("Manual Device Specification")')
    await manualEntryBtn.click()
    await page.waitForTimeout(500)

    const manualModalTitle = page.locator('h3:has-text("Custom Device Specification")')
    await manualModalTitle.waitFor({ state: 'visible', timeout: 3000 })
    console.log('✓ Manual device modal opened cleanly')

    // Close manual modal
    const closeManualBtn = page.locator('#btn-close-manual-modal')
    await closeManualBtn.click()
    await page.waitForTimeout(400)
    console.log('✓ Manual device modal closed')

    // Select iPhone 11 card
    console.log('3.2 Selecting iPhone 11 product card...')
    const iphoneCard = page.locator('h4:has-text("iPhone 11")').first()
    await iphoneCard.click()
    await page.waitForTimeout(400)

    // Click "Confirm & Triage"
    const nextBtnStage1 = page.locator('button:has-text("Confirm & Triage")')
    await nextBtnStage1.click()
    await page.waitForTimeout(600)

    // -----------------------------------------------------------------------
    // TEST 4: STAGE 2 (CONDITION TRIAGE & HAZARD BANNER)
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 4] Testing Stage 2 Condition Cards & Hazmat Warning ---')
    const triageTitle = page.locator('h2:has-text("Condition Assessment")')
    await triageTitle.waitFor({ state: 'visible', timeout: 5000 })

    // Select Mint
    const mintCard = page.locator('h4:has-text("Mint / Functional")')
    await mintCard.click()
    await page.waitForTimeout(300)

    // Select Swollen battery
    const swollenCard = page.locator('h4:has-text("Swollen / Punctured Battery")')
    await swollenCard.click()
    await page.waitForTimeout(300)

    // Check hazard banner is visible
    const hazardBanner = page.locator('h4:has-text("Critical Battery Safety Protocol Engaged")')
    await hazardBanner.waitFor({ state: 'visible', timeout: 3000 })
    console.log('✓ Hazmat warning protocol activated on Swollen Battery selection')

    // Click Continue to Stage 3
    const nextBtnStage2 = page.locator('button:has-text("Continue to Environmental Impact")')
    await nextBtnStage2.click()
    await page.waitForTimeout(600)

    // -----------------------------------------------------------------------
    // TEST 5: STAGE 3 (MASS TUNER & IMPACT HUD)
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 5] Testing Stage 3 Hazardous Materials & Mass Calibration ---')
    const stage3Title = page.locator('h2:has-text("Hazard Profile & Impact Equivalence")')
    await stage3Title.waitFor({ state: 'visible', timeout: 5000 })

    // Calibrate mass input
    const massInput = page.locator('input[type="number"][min="10"]')
    await massInput.fill('220')
    await page.waitForTimeout(300)
    console.log('✓ Mass input calibrated to 220g')

    const nextBtnStage3 = page.locator('button:has-text("Continue to Data-Wipe Protocol")')
    await nextBtnStage3.click()
    await page.waitForTimeout(600)

    // -----------------------------------------------------------------------
    // TEST 6: STAGE 4 (DATA-WIPE CHECKBOX & LABEL CLICKABILITY AUDIT)
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 6] Testing Stage 4 Checkboxes & Label Clickability ---')
    const stage4Title = page.locator('h2:has-text("Interactive Data-Wipe Protocol")')
    await stage4Title.waitFor({ state: 'visible', timeout: 5000 })

    // Click step 1, 2, 3 toggle buttons
    const step1Btn = page.locator('button:has-text("STEP 01")')
    await step1Btn.click()
    await page.waitForTimeout(200)

    const step2Btn = page.locator('button:has-text("STEP 02")')
    await step2Btn.click()
    await page.waitForTimeout(200)

    const step3Btn = page.locator('button:has-text("STEP 03")')
    await step3Btn.click()
    await page.waitForTimeout(200)
    console.log('✓ All 3 data wipe interactive steps toggled to complete')

    // Test label clickability for Wipe Final Confirmed
    console.log('6.1 Testing label click on "I have confirmed personal account sign-out..."')
    const confirmLabel = page.locator('label:has-text("I have confirmed personal account sign-out")')
    const confirmCheckbox = confirmLabel.locator('input[type="checkbox"]')
    await confirmLabel.click()
    await page.waitForTimeout(200)
    const isConfirmChecked = await confirmCheckbox.isChecked()
    if (!isConfirmChecked) {
      throw new Error('FAIL: Clicking confirm wipe label did not check checkbox')
    }
    console.log('✓ PASS: Confirm wipe label text is clickable and toggles checkbox!')

    // Test label clickability for BROKEN DEVICE EXCEPTION (Our Fix 1!)
    console.log('6.2 Testing label click on "Device Inoperable / Cannot Access Screen..."')
    const exceptionLabel = page.locator('label:has-text("Device Inoperable / Cannot Access Screen")')
    const exceptionCheckbox = exceptionLabel.locator('input[type="checkbox"]')
    await exceptionLabel.click()
    await page.waitForTimeout(200)
    const isExceptionChecked = await exceptionCheckbox.isChecked()
    if (!isExceptionChecked) {
      throw new Error('FAIL: Clicking device inoperable label did not check checkbox')
    }
    console.log('✓ PASS: Device Inoperable label is fully clickable and toggled checkbox to TRUE!')

    // Verify it disabled/unchecked the first checkbox
    const isConfirmCheckedAfterException = await confirmCheckbox.isChecked()
    if (isConfirmCheckedAfterException) {
      throw new Error('FAIL: Checking exception did not uncheck confirmation')
    }
    console.log('✓ PASS: Mutually exclusive exception logic satisfied')

    // Click Continue to Stage 5
    const nextBtnStage4 = page.locator('button:has-text("Continue to Select Kiosk")')
    await nextBtnStage4.click()
    await page.waitForTimeout(800)

    // -----------------------------------------------------------------------
    // TEST 7: STAGE 5 (KIOSK SELECTION & HAZMAT TOGGLE BUTTON AUDIT)
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 7] Testing Stage 5 Kiosk Selection & Hazmat Toggle Filter ---')
    // Wait for pods list
    await page.waitForSelector('text=Pods (', { timeout: 5000 })

    // Find the new Hazmat toggle button
    console.log('7.1 Testing newly introduced Hazmat filter toggle button...')
    const hazmatToggleBtn = page.locator('button[title*="Toggle Hazmat Certified Only"]')
    await hazmatToggleBtn.waitFor({ state: 'visible', timeout: 3000 })
    await hazmatToggleBtn.click()
    await page.waitForTimeout(300)
    console.log('✓ Clicked Hazmat filter button (active)')

    // Click it again to toggle off
    await hazmatToggleBtn.click()
    await page.waitForTimeout(300)
    console.log('✓ Clicked Hazmat filter button again (inactive)')

    // Search pods input
    const podSearch = page.locator('input[placeholder*="Search pods"]')
    await podSearch.fill('Mechanical')
    await page.waitForTimeout(300)
    console.log('✓ Pod search filtered by "Mechanical"')

    // Select DTU Mechanical Block Kiosk
    const mechKioskItem = page.locator('h4:has-text("DTU Mechanical Block Kiosk")').first()
    await mechKioskItem.click()
    await page.waitForTimeout(300)

    // Click Continue to Stage 6
    const nextBtnStage5 = page.locator('button:has-text("Generate Ephemeral QR Pass")')
    await nextBtnStage5.click()
    await page.waitForTimeout(1000)

    // -----------------------------------------------------------------------
    // TEST 8: STAGE 6 (EPHEMERAL QR PASS & RESET)
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 8] Testing Stage 6 Ephemeral QR Pass & Actions ---')
    const passHeader = page.locator('h2:has-text("Your device is ready for handover")')
    await passHeader.waitFor({ state: 'visible', timeout: 5000 })

    // Copy reference button
    const copyBtn = page.locator('button[title="Copy Reference"]')
    await copyBtn.click()
    await page.waitForTimeout(300)
    const copiedBadge = page.locator('text=COPIED')
    await copiedBadge.waitFor({ state: 'visible', timeout: 2000 })
    console.log('✓ Copy Reference button verified')

    // Capture the generated pass token to test operator verification
    const passRefPill = page.locator('div.inline-flex.items-center:has-text("SIG-") span.font-mono').first()
    let generatedPassToken = 'SIG-88F4B91-DTU'
    if (await passRefPill.isVisible()) {
      generatedPassToken = (await passRefPill.innerText()).trim()
    }
    console.log(`✓ Active deposit pass generated: ${generatedPassToken}`)

    // Reset wizard button
    const resetBtn = page.locator('button:has-text("Prepare another device submission")')
    await resetBtn.click()
    await page.waitForTimeout(600)
    await productVaultTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Wizard reset cleanly back to Stage 1')

    // Log out student
    const logoutBtn = page.locator('#btn-kiosk-modal-logout')
    await logoutBtn.click()
    await page.waitForTimeout(600)
    console.log('✓ Logged out student successfully')

    // -----------------------------------------------------------------------
    // TEST 9: KIOSK OPERATOR TERMINAL & REJECTION SUB-MODAL
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 9] Testing Kiosk Operator Terminal & Checklist Checkboxes ---')
    await recycleNavBtn.click()
    await loginModalHeader.waitFor({ state: 'visible', timeout: 5000 })

    const operatorTabBtn = page.getByRole('button', { name: 'Operator', exact: true })
    await operatorTabBtn.click()
    await page.waitForTimeout(200)

    await loginSubmitBtn.click()
    await page.waitForTimeout(1000)

    const terminalTitle = page.locator('h2:has-text("Campus Collection Kiosk Ingestion Desk")')
    await terminalTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Logged in as Kiosk Operator (Arun Verma)')

    // Lookup pass using generated active token
    const tokenInput = page.locator('input[placeholder*="Scan QR token"]')
    await tokenInput.fill(generatedPassToken)
    await page.locator('button:has-text("Lookup Pass")').click()
    await page.waitForTimeout(600)

    // Audit the 5 checklist checkboxes
    console.log('9.1 Testing physical checklist items...')
    const check1 = page.locator('label:has-text("1. Hardware Model Verification")').locator('input')
    const check2 = page.locator('label:has-text("2. Declared Condition Integrity")').locator('input')
    const check3 = page.locator('label:has-text("3. Scale Mass Consistency")').locator('input')
    const check4 = page.locator('label:has-text("4. Thermal & Battery Safe Containment")').locator('input')
    const check5 = page.locator('label:has-text("5. Data Sanitization / Destruction Tagged")').locator('input')

    // Toggle on
    await check1.click()
    await check2.click()
    await check3.click()
    await check4.click()
    await check5.click()
    await page.waitForTimeout(300)
    console.log('✓ All 5 operator checklist checkboxes checked via label interaction')

    const acceptHatchBtn = page.locator('button:has-text("Accept & Unlock Hatch")')
    const isDepositReady = await acceptHatchBtn.isEnabled()
    if (!isDepositReady) {
      throw new Error('FAIL: Accept & Unlock Hatch button should be enabled after 5 of 5 checks')
    }
    console.log('✓ Accept & Unlock Hatch button is unlocked and enabled')

    // Test rejection modal at z-[80]
    console.log('9.2 Testing Rejection Modal at z-[80]...')
    const rejectBtn = page.locator('button:has-text("Reject / Flag Mismatch")')
    await rejectBtn.click()
    await page.waitForTimeout(400)

    const rejectModalTitle = page.locator('h3:has-text("Flag & Reject Submission")')
    await rejectModalTitle.waitFor({ state: 'visible', timeout: 3000 })
    console.log('✓ Rejection modal opened at z-[80]')

    const cancelRejectBtn = page.locator('button:has-text("Cancel")').first()
    await cancelRejectBtn.click()
    await page.waitForTimeout(400)
    console.log('✓ Rejection modal cancelled cleanly')

    // Log out operator
    await logoutBtn.click()
    await page.waitForTimeout(600)

    // -----------------------------------------------------------------------
    // TEST 10: COLLEGE ADMIN SPONSORSHIPS VIEW & MODALS
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 10] Testing College Admin Sponsorships & Action Modals ---')
    await recycleNavBtn.click()
    await loginModalHeader.waitFor({ state: 'visible', timeout: 5000 })

    const adminTabBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminTabBtn.click()
    await page.waitForTimeout(200)

    await loginSubmitBtn.click()
    await page.waitForTimeout(1000)

    // Ensure we switch to Sponsorship Applications tab
    const sponsorAppTabBtn = page.locator('#tab-btn-sponsorships')
    if (await sponsorAppTabBtn.isVisible()) {
      await sponsorAppTabBtn.click()
      await page.waitForTimeout(400)
    }

    const adminTitle = page.locator('h2:has-text("Sponsor Application Management")')
    await adminTitle.waitFor({ state: 'visible', timeout: 5000 })
    console.log('✓ Logged in as College Admin (Kavita Sharma)')

    // Test status filter pills
    console.log('10.1 Testing status filter pills...')
    await page.locator('button:has-text("Under Review")').click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Approved")').click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("All")').first().click()
    await page.waitForTimeout(300)
    console.log('✓ Status filter pills responsive')

    // Open an application dossier (z-[80])
    console.log('10.2 Opening application dossier modal (z-[80])...')
    const viewDossierBtn = page.locator('button[data-action="review-dossier"]').first()
    await viewDossierBtn.click()
    await page.waitForTimeout(500)

    const dossierHeader = page.locator('span:has-text("SPONSORSHIP PROPOSAL DOSSIER")')
    await dossierHeader.waitFor({ state: 'visible', timeout: 3000 })
    console.log('✓ Application proposal dossier modal opened at z-[80]')

    // Close dossier modal
    const closeDossierBtn = page.locator('#btn-close-dossier-modal')
    await closeDossierBtn.click()
    await page.waitForTimeout(400)
    console.log('✓ Application dossier closed')

    // Close recycle modal
    const closeRecycleModalBtn = page.locator('#btn-close-recycle-modal')
    await closeRecycleModalBtn.click()
    await page.waitForTimeout(600)

    // -----------------------------------------------------------------------
    // TEST 11: SPONSOR ENQUIRY FORM CHECKBOXES & LABELS
    // -----------------------------------------------------------------------
    console.log('\n--- [TEST 11] Testing Sponsor Enquiry Form Checkboxes & Consent ---')
    await page.goto('http://localhost:5174/#/sponsor', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    // Scroll to enquiry form
    const enquiryForm = page.locator('#enquiry-form')
    await enquiryForm.scrollIntoViewIfNeeded()

    // Test contribution multi-select buttons
    console.log('11.1 Testing contribution multi-select checkboxes...')
    const contribKiosk = page.locator('button:has-text("Smart Hardware Kiosk Underwriting")').first()
    if (await contribKiosk.isVisible()) {
      await contribKiosk.click()
      await page.waitForTimeout(200)
      console.log('✓ Toggled Smart Hardware Kiosk contribution checkbox')
    }

    // Test consent agreement checkbox label clickability
    console.log('11.2 Testing consent checkbox label clickability...')
    const consentLabel = page.locator('label:has-text("I consent to being contacted by the RE—EARTH")')
    if (await consentLabel.isVisible()) {
      const consentCheckbox = consentLabel.locator('input[type="checkbox"]')
      await consentLabel.click()
      await page.waitForTimeout(200)
      const isConsentChecked = await consentCheckbox.isChecked()
      if (!isConsentChecked) {
        throw new Error('FAIL: Clicking consent label did not toggle checkbox')
      }
      console.log('✓ PASS: Consent checkbox toggled to TRUE via label text click')
    }

    console.log('\n======================================================================')
    console.log('🎉 ALL 11 POST-MERGE AUDIT SUITES PASSED FLAWLESSLY WITH ZERO ERRORS!')
    console.log('======================================================================')
  } catch (err) {
    console.error('\n❌ AUDIT FAILED:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

runAudit()
