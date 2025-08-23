import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Visual Regression Tests
 * 
 * Focus: Visual consistency, screenshot comparison, UI regression detection
 * Coverage: Visual testing across components and pages
 * Speed: Optimized for screenshot generation and comparison
 */
export default defineConfig({
  testDir: '../tests/visual',
  
  /* Run tests in files in parallel for faster screenshot generation */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI for screenshot consistency */
  retries: process.env.CI ? 3 : 1,
  
  /* Use fewer workers for visual tests to reduce resource contention */
  workers: process.env.CI ? 1 : 2,
  
  /* Reporter configuration for visual tests */
  reporter: [
    ['html', { 
      outputFolder: './test-results/visual-report',
      open: process.env.CI ? 'never' : 'on-failure' 
    }],
    ['json', { 
      outputFile: './test-results/json/visual-results.json' 
    }],
    ['junit', { 
      outputFile: './test-results/junit/visual-results.xml' 
    }],
    ['line'],
  ],
  
  /* Shared settings optimized for visual testing */
  use: {
    /* Base URL */
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    /* Collect trace for visual debugging */
    trace: 'retain-on-failure',
    
    /* Always take screenshots for visual tests */
    screenshot: 'only-on-failure',
    
    /* Record video for visual debugging */
    video: 'retain-on-failure',
    
    /* Timeouts optimized for page loading */
    actionTimeout: 15000,
    navigationTimeout: 45000,
    
    /* Disable animations for consistent screenshots */
    reducedMotion: 'reduce',
    
    /* Font settings for consistent text rendering */
    fontFamily: 'Arial, sans-serif',
    
    /* Color scheme for consistent theming */
    colorScheme: 'light',
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for visual testing across browsers */
  projects: [
    // Primary browser for visual regression
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // Consistent browser settings for screenshots
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--no-default-browser-check',
            '--no-first-run',
            '--disable-default-apps',
          ],
        },
      },
    },

    // Mobile visual testing
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
      },
    },

    // Tablet visual testing
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
      },
    },

    // Additional browsers for cross-browser visual testing (optional)
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],

  /* Timeout settings for visual tests */
  timeout: 60000, // Longer timeout for screenshot generation

  /* Screenshot comparison settings */
  expect: {
    timeout: 10000, // Longer timeout for screenshot comparisons
    toHaveScreenshot: {
      mode: 'local',
      threshold: 0.15, // Slightly stricter threshold for visual regression
      maxDiffPixels: 1000, // Allow minor pixel differences
      animations: 'disabled', // Disable animations for consistent screenshots
    },
    toMatchSnapshot: {
      threshold: 0.15,
      maxDiffPixels: 1000,
    },
  },

  /* Output directory for visual test artifacts */
  outputDir: './test-results/visual-artifacts',

  /* Run your local dev server before starting visual tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global setup for visual tests */
  globalSetup: require.resolve('../tests/visual/setup.ts'),

  /* Configure test metadata */
  metadata: {
    testType: 'visual',
    framework: 'playwright',
    environment: process.env.NODE_ENV || 'development',
  },
});