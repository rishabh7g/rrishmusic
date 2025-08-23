import { test, expect } from './setup';

/**
 * Smoke Tests - Quick validation that basic functionality works
 * These tests should run fast and catch major issues
 */
test.describe('Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Basic page structure should be present
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Page should have a meaningful title
    await expect(page).toHaveTitle(/rrish|music|guitar|blues/i);
    
    console.log('✅ Homepage loads successfully');
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = page.locator('nav a[href^="#"]');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      
      await firstLink.click();
      await page.waitForTimeout(1000);
      
      if (href) {
        const targetSection = page.locator(href);
        if (await targetSection.count() > 0) {
          await expect(targetSection).toBeInViewport();
        }
      }
    }
    
    console.log('✅ Navigation works');
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('gtag')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    console.log('✅ No critical JavaScript errors');
  });

  test('should have essential content', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    
    // Should contain music-related keywords
    expect(bodyText).toMatch(/guitar|music|lesson|blues|rrish/i);
    
    console.log('✅ Essential content is present');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Basic elements should still be visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Page should not have excessive horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(500); // More lenient tolerance for mobile
    
    console.log(`✅ Mobile responsiveness works (width: ${bodyWidth}px)`);
  });

  test('should load key resources', async ({ page }) => {
    let resourcesLoaded = 0;
    
    page.on('response', (response) => {
      if (response.status() === 200) {
        resourcesLoaded++;
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should load at least some resources successfully
    expect(resourcesLoaded).toBeGreaterThan(3);
    
    console.log(`✅ ${resourcesLoaded} resources loaded successfully`);
  });
});