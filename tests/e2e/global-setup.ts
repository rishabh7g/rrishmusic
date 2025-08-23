/**
 * Playwright Global Setup
 * 
 * Global setup for E2E tests including authentication, database seeding,
 * and environment preparation
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test global setup...');

  // Ensure test results directories exist
  const testResultsDirs = [
    'test-results/e2e-report',
    'test-results/e2e-artifacts',
    'test-results/json',
    'test-results/junit',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
  ];

  testResultsDirs.forEach(dir => {
    const fullPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Set up test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PLAYWRIGHT_TEST_MODE = 'true';

  // Launch a browser to pre-warm and validate the setup
  if (!process.env.CI) {
    console.log('🌐 Pre-warming browser for faster test execution...');
    
    const browser = await chromium.launch({
      headless: true,
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the base URL to ensure the app is ready
    const baseURL = process.env.BASE_URL || 'http://localhost:5173';
    try {
      await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
      console.log(`✅ Application is ready at ${baseURL}`);
    } catch (error) {
      console.error(`❌ Failed to reach application at ${baseURL}:`, error);
      throw error;
    }
    
    await browser.close();
  }

  // Set up authentication state if needed (for future authenticated tests)
  // await setupAuthentication();

  console.log('✅ E2E test global setup completed successfully');
}

// Helper function for setting up authentication (placeholder for future use)
async function setupAuthentication() {
  // This would set up authentication states for different user roles
  // and save them to files that tests can use
  console.log('🔐 Setting up authentication states...');
  
  // Example:
  // const browser = await chromium.launch();
  // const context = await browser.newContext();
  // const page = await context.newPage();
  // 
  // // Login as admin user
  // await page.goto('/login');
  // await page.fill('[data-testid=email]', 'admin@example.com');
  // await page.fill('[data-testid=password]', 'password');
  // await page.click('[data-testid=login]');
  // await page.waitForURL('**/dashboard');
  // 
  // // Save authenticated state
  // await context.storageState({ path: 'auth-states/admin.json' });
  // await browser.close();
}

export default globalSetup;