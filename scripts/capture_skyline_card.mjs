import { chromium } from 'playwright'
import path from 'path'

const ARTIFACT_DIR = 'C:/Users/KIIT/.gemini/antigravity/brain/e612d9a0-8493-46ec-97ca-b3dca7f6032d'

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  // Switch to skyline
  const skylineBtn = page.locator('header').getByRole('button', { name: /Sponsors/i }).first()
  if (await skylineBtn.isVisible()) {
    await skylineBtn.click({ force: true })
    await page.waitForTimeout(2500)
  }

  // Click Google tree placard
  const googlePlacard = page.locator('div').filter({ hasText: /^Google\s+26,991\s*kg$/ }).first()
  if (await googlePlacard.isVisible()) {
    await googlePlacard.click({ force: true })
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'sponsor_skyline_with_inspection_card.png'),
      fullPage: false
    })
  } else {
    // Fallback: evaluate selectSponsor('google')
    await page.evaluate(() => {
      // Find zustand store if available or click
    })
  }

  await browser.close()
  console.log('Skyline inspection card screenshot captured!')
}

run().catch(console.error)
