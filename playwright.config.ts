/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
    },
    {
      name: 'ui',
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:5174',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
