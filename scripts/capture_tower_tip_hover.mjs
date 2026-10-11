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

  // 1. Enter Direct 3D Orbit mode
  console.log('1. Entering Direct 3D Orbit...')
  const orbitBtn = page.getByRole('button', { name: /Direct 3D Orbit/i })
  if (await orbitBtn.isVisible()) {
    await orbitBtn.click()
    await page.waitForTimeout(2000)
  }

  // 2. Select Delhi preset to focus close on Asian towers
  const delhiBtn = page.getByRole('button', { name: /DELHI/i }).or(page.getByText('DELHI'))
  if (await delhiBtn.first().isVisible()) {
    await delhiBtn.first().click()
    await page.waitForTimeout(2500)
  }

  // 3. Hover over the Tata tower tip (IIT Bombay)
  console.log('3. Hovering over Tata tower tip...')
  const tataLogos = page.locator('svg[aria-label="Tata Logo"]')
  const tataCount = await tataLogos.count()
  console.log(`Found ${tataCount} Tata logos`)
  if (tataCount > 0) {
    // Hover the primary visible one
    for (let i = 0; i < tataCount; i++) {
      const loc = tataLogos.nth(i)
      if (await loc.isVisible()) {
        const box = await loc.boundingBox()
        if (box && box.y > 100 && box.y < 850) {
          console.log(`Hovering Tata logo ${i} at (${box.x}, ${box.y})`)
          await loc.hover({ force: true })
          await page.waitForTimeout(1000)
          break
        }
      }
    }
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'tower_tip_iit_bombay_hovered.png'),
    fullPage: false
  })

  // 4. Click the Delhi Cluster to expand the 3 individual colleges (DTU, NSUT, IIT Delhi)
  console.log('4. Expanding Delhi cluster...')
  const clusterNode = page.locator('text=Delhi Cluster').or(page.locator('.w-7.h-7').nth(2))
  if (await clusterNode.first().isVisible()) {
    await clusterNode.first().click({ force: true })
    await page.waitForTimeout(2500)
  }

  // Hover on an expanded individual campus tower
  const crests = page.locator('.w-7.h-7')
  const count = await crests.count()
  console.log(`After expansion, found ${count} crests`)
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      const c = crests.nth(i)
      if (await c.isVisible()) {
        const box = await c.boundingBox()
        if (box && box.x > 300 && box.x < 1100 && box.y > 200 && box.y < 700) {
          console.log(`Hovering expanded individual tower ${i} at (${box.x}, ${box.y})`)
          await c.hover({ force: true })
          await page.waitForTimeout(1000)
          break
        }
      }
    }
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'tower_tip_individual_college_hovered.png'),
    fullPage: false
  })

  await browser.close()
  console.log('Finished capturing individual tower tip hover states!')
}

run().catch((err) => {
  console.error('Run failed:', err)
  process.exit(1)
})
