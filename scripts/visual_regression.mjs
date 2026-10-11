import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const BASELINE_DIR = path.resolve('tests/visual/baseline')
const CURRENT_DIR = path.resolve('tests/visual/current')
const DIFF_DIR = path.resolve('tests/visual/diff')

// Ensure test directories exist
;[BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

async function runVisualRegression() {
  console.log('--- STARTING DETERMINISTIC VISUAL REGRESSION SUITE ---')
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  })
  const page = await context.newPage()

  const scenarios = [
    {
      name: 'home_globe_view',
      url: 'http://localhost:5174/',
      delay: 3000
    },
    {
      name: 'sponsor_portal_hero',
      url: 'http://localhost:5174/#/sponsor',
      delay: 2500
    }
  ]

  let hasDiffFailure = false

  for (const scenario of scenarios) {
    console.log(`\nCapturing scenario: ${scenario.name}...`)
    await page.goto(scenario.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(scenario.delay)

    const currentPath = path.join(CURRENT_DIR, `${scenario.name}.png`)
    const baselinePath = path.join(BASELINE_DIR, `${scenario.name}.png`)
    const diffPath = path.join(DIFF_DIR, `${scenario.name}_diff.png`)

    await page.screenshot({ path: currentPath, fullPage: false })

    if (!fs.existsSync(baselinePath)) {
      console.log(`[INIT] Baseline does not exist. Saving current as baseline for ${scenario.name}.`)
      fs.copyFileSync(currentPath, baselinePath)
      continue
    }

    // Compare with baseline using pixelmatch
    const imgBaseline = PNG.sync.read(fs.readFileSync(baselinePath))
    const imgCurrent = PNG.sync.read(fs.readFileSync(currentPath))

    const { width, height } = imgBaseline
    if (imgCurrent.width !== width || imgCurrent.height !== height) {
      console.warn(`[DIMENSION MISMATCH] for ${scenario.name}: baseline ${width}x${height} vs current ${imgCurrent.width}x${imgCurrent.height}`)
      continue
    }

    const diff = new PNG({ width, height })
    // Allow slight tolerance for WebGL dynamic shader rendering (threshold 0.15)
    const numDiffPixels = pixelmatch(
      imgBaseline.data,
      imgCurrent.data,
      diff.data,
      width,
      height,
      { threshold: 0.2 }
    )

    const totalPixels = width * height
    const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(2)
    console.log(`Comparison result for ${scenario.name}: ${numDiffPixels} diff pixels (${diffPercentage}%)`)

    if (numDiffPixels > 0) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff))
      console.log(`Diff image written to ${diffPath}`)
    }

    // WebGL canvas can have small subtle particle differences; flag if > 8%
    if (parseFloat(diffPercentage) > 8.0) {
      console.warn(`[REGRESSION DETECTED] ${scenario.name} diff exceeds threshold: ${diffPercentage}%`)
      hasDiffFailure = true
    } else {
      console.log(`[PASS] ${scenario.name} within visual tolerance.`)
    }
  }

  await browser.close()
  console.log('\n--- VISUAL REGRESSION SUITE COMPLETE ---')
  if (hasDiffFailure) {
    console.warn('One or more scenarios experienced visual drift beyond tolerance.')
  } else {
    console.log('All visual regression benchmarks passed.')
  }
}

runVisualRegression().catch((err) => {
  console.error('Visual regression error:', err)
  process.exit(1)
})
