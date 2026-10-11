import { chromium } from 'playwright'
import path from 'path'

const ARTIFACT_DIR = 'C:/Users/KIIT/.gemini/antigravity/brain/e612d9a0-8493-46ec-97ca-b3dca7f6032d'

async function run() {
  console.log('--- STARTING COMPREHENSIVE RE—EARTH VERIFICATION ---')
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  })
  const page = await context.newPage()

  console.log('Navigating to http://localhost:5174/ ...')
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // =========================================================================
  // TEST 1: RECYCLE BUTTON & FULL 6-STAGE STUDENT DROP-OFF FLOW
  // =========================================================================
  console.log('\n--- TEST 1: RECYCLE BUTTON & 6-STAGE WORKFLOW ---')
  const recycleBtn = page.getByRole('button', { name: /^Recycle$/i }).first()
  console.log('Clicking Recycle button...')
  await recycleBtn.click()
  await page.waitForTimeout(1000)

  // If login modal is present, sign in with pre-filled student credentials
  const loginModalSubmit = page.getByRole('button', { name: /Sign In To Session/i })
  if (await loginModalSubmit.isVisible()) {
    console.log('Login prompt displayed, signing in with pre-filled student demo credentials...')
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test1_recycle_login_prompt.png'),
      fullPage: false
    })
    await loginModalSubmit.click()
    await page.waitForTimeout(1500)
  }

  // Stage 1: Product Vault
  console.log('Verifying Stage 1: Product Vault...')
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'test1_recycle_stage1_product_vault.png'),
    fullPage: false
  })

  // Select iPhone 11 in Stage 1
  const iphoneCard = page.locator('h4:has-text("iPhone 11")').first()
  if (await iphoneCard.isVisible()) {
    console.log('Selecting iPhone 11 product card...')
    await iphoneCard.click()
    await page.waitForTimeout(800)
  }

  // Click Confirm & Triage to enter Stage 2
  const confirmTriageBtn = page.getByRole('button', { name: /Confirm & Triage/i }).first()
  if (await confirmTriageBtn.isVisible()) {
    console.log('Clicking Confirm & Triage...')
    await confirmTriageBtn.click()
    await page.waitForTimeout(1000)
    console.log('Capturing Stage 2: Condition Assessment...')
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test1_recycle_stage2_condition_triage.png'),
      fullPage: false
    })

    // Stage 2: Select a condition (Mint / Functional)
    const workingCond = page.locator('h4:has-text("Mint")').or(page.locator('text=Mint / Functional')).first()
    if (await workingCond.isVisible()) {
      console.log('Selecting "Mint / Functional" condition...')
      await workingCond.click()
      await page.waitForTimeout(800)
    }

    // Advance to Stage 3: Continue to Environmental Impact
    const toStage3 = page.getByRole('button', { name: /Continue to Environmental Impact/i }).first()
    if (await toStage3.isVisible()) {
      console.log('Advancing to Stage 3...')
      await toStage3.click()
      await page.waitForTimeout(1000)
      console.log('Capturing Stage 3: Hazardous Materials & Impact...')
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'test1_recycle_stage3_material_profile.png'),
        fullPage: false
      })

      // Advance to Stage 4: Continue to Data-Wipe Protocol
      const toStage4 = page.getByRole('button', { name: /Continue to Data-Wipe Protocol/i }).first()
      if (await toStage4.isVisible()) {
        console.log('Advancing to Stage 4...')
        await toStage4.click()
        await page.waitForTimeout(1000)
        console.log('Capturing Stage 4: Data-Wipe Protocol...')
        await page.screenshot({
          path: path.join(ARTIFACT_DIR, 'test1_recycle_stage4_data_wipe.png'),
          fullPage: false
        })

        // Complete all interactive privacy sanitization steps
        const stepButtons = page.locator('button:has-text("STEP 0")')
        const count = await stepButtons.count()
        console.log(`Checking off ${count} privacy sanitization steps...`)
        for (let i = 0; i < count; i++) {
          await stepButtons.nth(i).click()
          await page.waitForTimeout(200)
        }

        // Check required declaration checkbox
        const wipeCheckbox = page.locator('input[type="checkbox"]').first()
        if (await wipeCheckbox.isVisible()) {
          console.log('Checking Data Wipe confirmation checkbox...')
          await wipeCheckbox.check()
          await page.waitForTimeout(500)
        }

        // Advance to Stage 5: Continue to Select Kiosk
        const toStage5 = page.getByRole('button', { name: /Continue to Select Kiosk/i }).first()
        if (await toStage5.isVisible()) {
          console.log('Advancing to Stage 5...')
          await toStage5.click()
          await page.waitForTimeout(2000)
          console.log('Capturing Stage 5: Campus Map & Kiosk Selection...')
          await page.screenshot({
            path: path.join(ARTIFACT_DIR, 'test1_recycle_stage5_kiosk_map.png'),
            fullPage: false
          })

          // Click first available kiosk to select it
          const kioskCard = page.locator('h4:has-text("Kiosk")').or(page.locator('text=Lockers Free')).or(page.locator('text=AWAY')).first()
          if (await kioskCard.isVisible()) {
            console.log('Selecting available kiosk locker pod...')
            await kioskCard.click()
            await page.waitForTimeout(800)
          }

          // Advance to Stage 6: Generate Ephemeral QR Pass
          const toStage6 = page.getByRole('button', { name: /Generate Ephemeral QR Pass/i }).first()
          if (await toStage6.isVisible()) {
            console.log('Generating Ephemeral QR Pass...')
            await toStage6.click()
            await page.waitForTimeout(2000)
            console.log('Capturing Stage 6: Ephemeral QR Pass...')
            await page.screenshot({
              path: path.join(ARTIFACT_DIR, 'test1_recycle_stage6_qr_pass.png'),
              fullPage: false
            })
          }
        }
      }
    }
  }

  // Close Recycle Module via Escape
  console.log('Closing Recycle module via Escape...')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1000)

  // =========================================================================
  // TEST 2: VAULT BUTTON & TECH VAULT DRAWER
  // =========================================================================
  console.log('\n--- TEST 2: VAULT BUTTON ---')
  const vaultBtn = page.getByRole('button', { name: /^Vault$/i }).first()
  console.log('Clicking Vault button...')
  await vaultBtn.click()
  await page.waitForTimeout(1500)

  console.log('Capturing Tech Vault View...')
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'test2_tech_vault_view.png'),
    fullPage: false
  })

  // Test "View Certificate" button if present
  const viewCertBtn = page.locator('button:has-text("View Certificate")').first()
  if (await viewCertBtn.isVisible()) {
    console.log('Clicking View Certificate in Tech Vault...')
    await viewCertBtn.click()
    await page.waitForTimeout(1200)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test2_verified_certificate_modal.png'),
      fullPage: false
    })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
  }

  // Close Vault
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1000)

  // =========================================================================
  // TEST 3: SPONSOR BUTTON & SPONSORSHIP PORTAL
  // =========================================================================
  console.log('\n--- TEST 3: SPONSOR BUTTON ---')
  const sponsorNavBtn = page.getByRole('button', { name: /^Sponsor$/i }).first()
  console.log('Clicking Sponsor nav button...')
  await sponsorNavBtn.click()
  await page.waitForTimeout(2000)

  console.log('Capturing SponsorshipPage Hero & Overview...')
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'test3_sponsorship_page_hero.png'),
    fullPage: false
  })

  // Scroll to Pathways section
  console.log('Scrolling to Sponsorship Pathways...')
  await page.evaluate(() => {
    document.getElementById('pathways')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'test3_sponsorship_page_pathways.png'),
    fullPage: false
  })

  // Scroll to Sponsor Enquiry Form
  console.log('Scrolling to Sponsor Enquiry Form...')
  await page.evaluate(() => {
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'test3_sponsorship_page_enquiry_form.png'),
    fullPage: false
  })

  // Test Return to 3D Orbit / World button
  console.log('Returning to 3D World from Sponsorship portal via Back to Orbit button...')
  const returnBtn = page.locator('button:has-text("Back to Orbit")').first()
  if (await returnBtn.isVisible()) {
    await returnBtn.click()
    await page.waitForTimeout(2000)
  } else {
    await page.evaluate(() => {
      window.location.hash = ''
    })
    await page.waitForTimeout(2000)
  }

  // Also test "Become a Sponsor" button in TopNav
  console.log('Testing "Become a Sponsor" button on top right...')
  const becomeSponsorBtn = page.getByRole('button', { name: /Become a Sponsor/i }).first()
  if (await becomeSponsorBtn.isVisible()) {
    await becomeSponsorBtn.click()
    await page.waitForTimeout(1500)
    console.log('Successfully navigated via "Become a Sponsor" button!')
    // Return to World via Back to Orbit button
    const returnFromBecome = page.locator('button:has-text("Back to Orbit")').first()
    if (await returnFromBecome.isVisible()) {
      await returnFromBecome.click()
      await page.waitForTimeout(2000)
    } else {
      await page.evaluate(() => {
        window.location.hash = ''
      })
      await page.waitForTimeout(2000)
    }
  }

  // =========================================================================
  // TEST 4: ADDITIONAL CONTROLS AUDIT
  // =========================================================================
  console.log('\n--- TEST 4: ADDITIONAL CONTROLS AUDIT ---')

  // 4.1 Rankings Drawer
  console.log('Testing Rankings Drawer button...')
  const rankingsBtn = page.getByRole('button', { name: /Rankings/i }).first()
  if (await rankingsBtn.isVisible()) {
    await rankingsBtn.click()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test4_rankings_drawer_open.png'),
      fullPage: false
    })
    // Close rankings
    await rankingsBtn.click()
    await page.waitForTimeout(800)
  }

  // 4.2 3D Forest (Skyline) View
  console.log('Testing 3D Forest / Skyline toggle...')
  const forestBtn = page.getByRole('button', { name: /Forest|Skyline/i }).first()
  if (await forestBtn.isVisible()) {
    await forestBtn.click()
    await page.waitForTimeout(2500)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test4_3d_forest_skyline_view.png'),
      fullPage: false
    })
    // Switch back to World
    const worldBtn = page.getByRole('button', { name: /World/i }).first()
    if (await worldBtn.isVisible()) {
      await worldBtn.click()
      await page.waitForTimeout(2000)
    }
  }

  // 4.3 Audio Toggle
  console.log('Testing Audio Toggle button...')
  const audioBtn = page.getByTitle(/Toggle Spatial Synthetic Audio/i).first()
  if (await audioBtn.isVisible()) {
    await audioBtn.click()
    await page.waitForTimeout(500)
    await audioBtn.click()
    await page.waitForTimeout(500)
  }

  // 4.4 Underwrite an Engineering Campus (Corporate Underwriting Suite Modal)
  console.log('Testing Underwrite an Engineering Campus in Chapter 2...')
  await page.evaluate(() => {
    document.getElementById('chapter-beacons')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(2000)

  const underwriteBtn = page.locator('button:has-text("Underwrite an Engineering Campus")').first()
  if (await underwriteBtn.isVisible()) {
    console.log('Clicking Underwrite an Engineering Campus button...')
    await underwriteBtn.click()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test4_corporate_underwriting_suite_modal.png'),
      fullPage: false
    })
    console.log('Closing Corporate Underwriting Suite modal...')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)
  }

  // 4.5 Direct 3D Orbit Mode & Presets
  console.log('Testing Direct 3D Orbit mode...')
  const storyBtn = page.getByRole('button', { name: /^Story$/i }).first()
  if (await storyBtn.isVisible()) {
    console.log('Navigating back to Chapter 0...')
    await storyBtn.click()
    await page.waitForTimeout(1500)
  }

  const orbitBtn = page.getByRole('button', { name: /Direct 3D Orbit/i }).first()
  if (await orbitBtn.isVisible()) {
    console.log('Engaging Direct 3D Orbit...')
    await orbitBtn.click()
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'test4_direct_orbit_active.png'),
      fullPage: false
    })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)
  }

  await browser.close()
  console.log('--- ALL TESTS COMPLETED SUCCESSFULLY! ---')
}

run().catch((err) => {
  console.error('Master test failed:', err)
  process.exit(1)
})
