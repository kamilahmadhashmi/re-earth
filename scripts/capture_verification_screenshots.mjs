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

  // 1. Chapter 0 Hero
  console.log('Capturing Chapter 0 Hero...')
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ultra_premium_hero_chapter0.png'),
    fullPage: false
  })

  // 2. Chapter 1 Crisis
  console.log('Scrolling to Chapter 1...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-crisis')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ultra_premium_chapter1_crisis.png'),
    fullPage: false
  })

  // 3. Chapter 3 Derby
  console.log('Scrolling to Chapter 3...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-derby')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ultra_premium_chapter3_derby.png'),
    fullPage: false
  })

  // 4. Switch to Sponsor Skyline (Cybernetic Trees)
  console.log('Switching to Sponsor Skyline mode...')
  const sponsorBtn = page.getByRole('button', { name: /Sponsors/i })
  if (await sponsorBtn.isVisible()) {
    await sponsorBtn.click()
    await page.waitForTimeout(2500)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ultra_premium_sponsor_skyline.png'),
      fullPage: false
    })
  }

  // 5. Open Top 10 Drawer
  console.log('Switching back to World and opening drawer...')
  const worldBtn = page.getByRole('button', { name: /World/i })
  if (await worldBtn.isVisible()) {
    await worldBtn.click()
    await page.waitForTimeout(1000)
  }
  const rankingsBtn = page.getByRole('button', { name: /Rankings/i })
  if (await rankingsBtn.isVisible()) {
    await rankingsBtn.click()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'ultra_premium_rankings_drawer.png'),
      fullPage: false
    })
  }

  await browser.close()
  console.log('All verification screenshots captured successfully!')
}

run().catch((err) => {
  console.error('Capture failed:', err)
  process.exit(1)
})
