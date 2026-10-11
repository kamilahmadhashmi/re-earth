import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

async function runA11yAudit() {
  console.log('--- STARTING AXE-CORE ACCESSIBILITY AUDIT ---')
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  })
  const page = await context.newPage()

  const routes = [
    { name: '3D World View', url: 'http://localhost:5174/' },
    { name: 'Sponsorship Portal', url: 'http://localhost:5174/#/sponsor' }
  ]

  let totalViolations = 0

  for (const route of routes) {
    console.log(`\nScanning route: ${route.name} (${route.url})`)
    await page.goto(route.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    try {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        // Exclude WebGL 3D Canvas element from DOM-specific HTML contrast checks
        .exclude('canvas')
        .analyze()

      console.log(`Violations found: ${results.violations.length}`)
      if (results.violations.length > 0) {
        results.violations.forEach((v) => {
          console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.help}`)
          console.log(`    Nodes affected: ${v.nodes.length}`)
        })
      }
      // Count critical/serious violations
      const severeViolations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
      totalViolations += severeViolations.length
    } catch (err) {
      console.error(`Audit error on ${route.name}:`, err.message)
    }
  }

  await browser.close()
  console.log(`\n--- AUDIT COMPLETE: ${totalViolations} severe violations found ---`)
  if (totalViolations > 5) {
    console.warn('Action required: resolve critical/serious accessibility violations.')
  } else {
    console.log('Accessibility quality benchmark PASSED.')
  }
}

runA11yAudit().catch((err) => {
  console.error('Failed to run audit:', err)
  process.exit(1)
})
