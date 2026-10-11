import { chromium } from 'playwright'
import path from 'path'

const ARTIFACT_DIR = 'C:/Users/KIIT/.gemini/antigravity/brain/e612d9a0-8493-46ec-97ca-b3dca7f6032d'

async function run() {
  console.log('Launching browser...')
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

  // 1. Chapter 2 with Sponsor Partner Marquee
  console.log('1. Scrolling to Chapter 2 (Beacons & Partner Marquee)...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-beacons')
    if (el) el.scrollIntoView({ behavior: 'instant' })
    const marquee = document.querySelector('.animate-marquee')
    if (marquee) {
      marquee.style.animation = 'none'
      marquee.style.transform = 'translateX(0px)'
    }
  })
  await page.waitForTimeout(1000)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'sponsor_showcase_marquee_chapter2.png'),
    fullPage: false
  })

  // 2. Open Top 10 Drawer and switch to Sponsors Tab
  console.log('2. Opening Rankings Drawer and selecting Sponsors tab...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-genesis')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1000)

  const rankingsBtn = page.getByRole('button', { name: /Rankings/i })
  if (await rankingsBtn.isVisible()) {
    await rankingsBtn.click()
    await page.waitForTimeout(600)

    const sponsorsTab = page.getByRole('button', { name: /Sponsors \(8\)/i })
    if (await sponsorsTab.isVisible()) {
      await sponsorsTab.click()
      await page.waitForTimeout(800)
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'sponsor_showcase_drawer_sponsors_tab.png'),
      fullPage: false
    })
  }

  // 3. Click Google in the drawer to open SponsorInspectionCard
  console.log('3. Inspecting Google in SponsorInspectionCard...')
  const googleBtn = page.locator('aside').getByRole('button', { name: /Google/i }).first()
  if (await googleBtn.isVisible()) {
    await googleBtn.click({ force: true })
    await page.waitForTimeout(1200)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'sponsor_showcase_inspection_card_google.png'),
      fullPage: false
    })
  }

  // 4. Open Corporate Underwriting Suite (Sponsor Pitch Modal)
  console.log('4. Opening Corporate Underwriting Suite Modal...')
  const underwriteBtn = page.getByRole('button', { name: /Sponsor Additional Engineering Campuses/i })
  if (await underwriteBtn.isVisible()) {
    await underwriteBtn.click({ force: true })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'sponsor_showcase_underwriting_suite_modal.png'),
      fullPage: false
    })

    // Close modal
    const closeBtn = page.getByRole('button', { name: 'Close' }).first()
    if (await closeBtn.isVisible()) {
      await closeBtn.click({ force: true })
      await page.waitForTimeout(600)
    }
  }

  // Close rankings drawer if open so skyline has unobstructed view
  const collapseDrawerBtn = page.locator('button[title="Collapse Leaderboard"]')
  if (await collapseDrawerBtn.isVisible()) {
    await collapseDrawerBtn.click({ force: true })
    await page.waitForTimeout(500)
  }

  // 5. Switch to Sponsor Skyline (3D Cybernetic Forest Trees)
  console.log('5. Switching to Sponsor Skyline view...')
  const skylineBtn = page.locator('header').getByRole('button', { name: /Sponsors/i }).first()
  if (await skylineBtn.isVisible()) {
    await skylineBtn.click({ force: true })
    await page.waitForTimeout(3000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'sponsor_showcase_skyline_forest.png'),
      fullPage: false
    })
  }

  await browser.close()
  console.log('All sponsor showcase screenshots captured successfully!')
}

run().catch((err) => {
  console.error('Capture failed:', err)
  process.exit(1)
})
