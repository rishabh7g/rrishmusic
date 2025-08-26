import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for RrishMusic multi-service platform
 * 
 * Features:
 * - Cross-browser testing (Chromium, Firefox, WebKit)
 * - Mobile device testing (iPhone, Android)
 * - Local development server integration
 * - Test artifacts collection
 * - Parallel test execution
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: process.env.CI ? 'blob' : 'html',
  
  // Test timeout
  timeout: 30000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },
  
  // Global test setup
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:4173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Accessibility testing
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
    
    // Tablet testing  
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  // Test output directory
  outputDir: 'test-results',
  
  // Global setup and teardown
  globalSetup: undefined,
  globalTeardown: undefined,
});