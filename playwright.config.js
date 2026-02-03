// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: /e2e\/.*\.spec\.(js|ts)$/,

  timeout: 90_000,
  expect: { timeout: 20_000 },

  retries: 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        actionTimeout: 20_000,
        navigationTimeout: 45_000,
        trace: 'on',
        video: 'on',
        screenshot: 'on',
      },
    },
  ],
});
