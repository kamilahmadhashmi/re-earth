import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    viewport: { width: 1440, height: 900 },
    channel: 'msedge'
  },
  projects: [
    {
      name: 'edge',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' }
    }
  ]
})
