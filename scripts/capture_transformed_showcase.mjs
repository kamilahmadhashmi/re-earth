import { chromium } from 'playwright'
import path from 'path'

const ARTIFACT_DIR = 'C:/Users/KIIT/.gemini/antigravity/brain/e612d9a0-8493-46ec-97ca-b3dca7f6032d'

async function capture() {
  console.log('Launching browser to capture transformed showcase...')
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  })
  const page = await context.newPage()

  // 1. Landing Page Chapter 0
  console.log('Capturing Chapter 0...')
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_ch0_hero.png'),
    fullPage: false
  })

  // 2. Chapter 1 (Toxicity Matrix)
  console.log('Capturing Chapter 1...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-crisis')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_ch1_crisis.png'),
    fullPage: false
  })

  // 3. Chapter 2 (Elemental Harvest)
  console.log('Capturing Chapter 2...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-solution')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_ch2_harvest.png'),
    fullPage: false
  })

  // 4. Chapter 3 (Collegiate Derby)
  console.log('Capturing Chapter 3...')
  await page.evaluate(() => {
    const el = document.getElementById('chapter-derby')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_ch3_derby.png'),
    fullPage: false
  })

  // 5. Open Campus Inspection Card
  console.log('Capturing Campus Inspection Card...')
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  const rankingsBtn = page.locator('button:has-text("Rankings")').first()
  if (await rankingsBtn.isVisible()) {
    await rankingsBtn.click()
    await page.waitForTimeout(800)
    const dtuItem = page.locator('button:has-text("Delhi Technological")').first()
    if (await dtuItem.isVisible()) {
      await dtuItem.click()
      await page.waitForTimeout(1000)
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'transformed_campus_inspection.png'),
        fullPage: false
      })
    }
  }

  // 6. Sponsorship Portal
  console.log('Capturing Sponsorship Portal...')
  await page.goto('http://localhost:5174/#/sponsor', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_sponsor_hero.png'),
    fullPage: false
  })

  // 7. Sponsorship Pathways
  console.log('Capturing Sponsorship Pathways...')
  await page.evaluate(() => {
    const el = document.getElementById('pathways')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_sponsor_pathways.png'),
    fullPage: false
  })

  // 8. Sponsorship Allocation
  console.log('Capturing Sponsorship Allocation...')
  await page.evaluate(() => {
    const el = document.getElementById('budget-allocation')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'transformed_sponsor_allocation.png'),
    fullPage: false
  })

  await browser.close()
  console.log('All transformed showcase screenshots captured successfully!')
}

capture().catch((err) => {
  console.error('Error during capture:', err)
  process.exit(1)
})
