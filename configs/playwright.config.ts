import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for End-to-End Tests
 * 
 * Focus: User workflows, cross-browser compatibility, real user scenarios
 * Coverage: Complete user journey testing
 * Speed: Realistic execution times with proper wait strategies
 */
export default defineConfig({
  testDir: '../tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI for stability */
  workers: process.env.CI ? 2 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html', { 
      outputFolder: './test-results/e2e-report',
      open: process.env.CI ? 'never' : 'on-failure' 
    }],
    ['json', { 
      outputFile: './test-results/json/e2e-results.json' 
    }],
    ['junit', { 
      outputFile: './test-results/junit/e2e-results.xml' 
    }],
    ['line'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video only on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for all actions */
    actionTimeout: 10000,
    
    /* Global timeout for navigation actions */
    navigationTimeout: 30000,
    
    /* Ignore HTTPS errors for local development */
    ignoreHTTPSErrors: true,
    
    /* Default viewport size */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // Mobile Devices
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        isMobile: true,
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
      },
    },

    // High DPI
    {
      name: 'high-dpi',
      use: {
        ...devices['Desktop Chrome HiDPI'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  /* Global timeout for each test */
  timeout: 30000,

  /* Global timeout for expect assertions */
  expect: {
    timeout: 5000,
    // Screenshot comparison settings
    toHaveScreenshot: {
      mode: 'local',
      threshold: 0.2,
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },

  /* Output directory for test artifacts */
  outputDir: './test-results/e2e-artifacts',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('../tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('../tests/e2e/global-teardown.ts'),

  /* Configure test metadata */
  metadata: {
    testType: 'e2e',
    framework: 'playwright',
    environment: process.env.NODE_ENV || 'development',
  },
});