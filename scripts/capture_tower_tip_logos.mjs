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

  // 1. Capture Chapter 0 - Macro Earth with dominant cluster logos & solo towers
  console.log('1. Capturing Chapter 0 Hero with tower crests...')
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'tower_logos_chapter0_overview.png'),
    fullPage: false
  })

  // 2. Scroll to Chapter 2 (Beacons) - Where 3D towers swoop into close regional view
  console.log('2. Scrolling to Chapter 2 (Beacons & Campus Towers)...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-beacons')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(3500)

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'tower_logos_chapter2_regional_towers.png'),
    fullPage: false
  })

  // 3. Enter Direct 3D Orbit mode for immersive inspection of towers
  console.log('3. Entering Direct 3D Orbit mode...')
  const orbitBtn = page.getByRole('button', { name: /Direct 3D Orbit/i })
  if (await orbitBtn.isVisible()) {
    await orbitBtn.click({ force: true })
    await page.waitForTimeout(2000)

    // Select preset to focus on Asia / India (IIT Bombay / Delhi)
    const asiaPresetBtn = page.getByRole('button', { name: /Asia Corridor/i }).or(page.getByText('Asia Corridor'))
    if (await asiaPresetBtn.isVisible()) {
      await asiaPresetBtn.click({ force: true })
      await page.waitForTimeout(2000)
    }

    await page.screenshot({
      path: page.path ? page.path : path.join(ARTIFACT_DIR, 'tower_logos_direct_orbit_towers.png'),
      fullPage: false
    })

    // Exit orbit
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)
  }

  // 4. Switch to Sponsor Skyline (3D Trees / Skyline)
  console.log('4. Switching to Sponsor Skyline view...')
  const skylineBtn = page.locator('header').getByRole('button', { name: /Sponsors/i }).first()
  if (await skylineBtn.isVisible()) {
    await skylineBtn.click({ force: true })
    await page.waitForTimeout(3000)

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'tower_logos_sponsor_skyline.png'),
      fullPage: false
    })
  }

  await browser.close()
  console.log('All tower tip logo screenshots captured successfully!')
}

run().catch((err) => {
  console.error('Capture failed:', err)
  process.exit(1)
})
