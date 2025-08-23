/**
 * Visual Regression Tests - Homepage
 * 
 * Tests for visual consistency and UI regression detection
 * Focus: Screenshot comparison across browsers and viewports
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and wait for content to load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
    
    // Ensure fonts are loaded (helps with consistent text rendering)
    await page.evaluate(() => {
      return document.fonts.ready;
    });
  });

  test('homepage desktop layout - full page', async ({ page }) => {
    // Set consistent desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Hide dynamic elements that might cause flakiness
    await page.addStyleTag({
      content: `
        [data-testid="current-time"],
        .timestamp,
        .loading-spinner,
        .skeleton-loader {
          visibility: hidden !important;
        }
      `
    });
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop-full.png', {
      fullPage: true,
      mask: [
        page.locator('[data-testid="dynamic-content"]'),
        page.locator('.live-data'),
      ]
    });
  });

  test('homepage mobile layout - full page', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Hide dynamic elements
    await page.addStyleTag({
      content: `
        [data-testid="current-time"],
        .timestamp,
        .loading-spinner {
          visibility: hidden !important;
        }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-mobile-full.png', {
      fullPage: true,
    });
  });

  test('homepage tablet layout - full page', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page).toHaveScreenshot('homepage-tablet-full.png', {
      fullPage: true,
    });
  });

  test('hero section visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    await expect(heroSection).toHaveScreenshot('hero-section.png');
  });

  test('navigation visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const navigation = page.locator('[data-testid="navigation"]');
    await expect(navigation).toBeVisible();
    
    await expect(navigation).toHaveScreenshot('navigation-desktop.png');
  });

  test('mobile navigation visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Test mobile menu closed state
    const navigation = page.locator('[data-testid="navigation"]');
    await expect(navigation).toHaveScreenshot('navigation-mobile-closed.png');
    
    // Test mobile menu open state (if applicable)
    const menuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300); // Wait for menu animation
      
      await expect(navigation).toHaveScreenshot('navigation-mobile-open.png');
    }
  });

  test('footer visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Scroll to footer
    await page.locator('[data-testid="footer"]').scrollIntoViewIfNeeded();
    
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toHaveScreenshot('footer.png');
  });

  test('responsive breakpoints visual consistency', async ({ page }) => {
    const breakpoints = [
      { name: 'mobile-small', width: 320, height: 568 },
      { name: 'mobile-medium', width: 375, height: 667 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop-small', width: 1280, height: 800 },
      { name: 'desktop-large', width: 1920, height: 1080 },
    ];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      // Wait for layout to settle
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot(`homepage-${breakpoint.name}.png`, {
        fullPage: false, // Just viewport for breakpoint testing
      });
    }
  });

  test('dark mode visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Enable dark mode (assuming there's a toggle or system preference)
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Or click dark mode toggle if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(300); // Wait for theme transition
    }
    
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
    });
  });

  test('high contrast mode visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Simulate high contrast mode
    await page.emulateMedia({ 
      colorScheme: 'dark',
      forcedColors: 'active'
    });
    
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
    });
  });

  test('print layout visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    await expect(page).toHaveScreenshot('homepage-print.png', {
      fullPage: true,
    });
  });

  test('component hover states', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test button hover states
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) { // Limit to first 3 buttons
      const button = buttons.nth(i);
      await button.hover();
      await page.waitForTimeout(100); // Wait for hover transition
      
      await expect(button).toHaveScreenshot(`button-hover-${i}.png`);
    }
    
    // Test link hover states
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 3); i++) { // Limit to first 3 links
      const link = links.nth(i);
      await link.hover();
      await page.waitForTimeout(100);
      
      await expect(link).toHaveScreenshot(`link-hover-${i}.png`);
    }
  });

  test('focus states visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test keyboard focus states
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const elementCount = await focusableElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 5); i++) { // Limit to first 5 elements
      const element = focusableElements.nth(i);
      
      if (await element.isVisible()) {
        await element.focus();
        await page.waitForTimeout(100); // Wait for focus styles
        
        await expect(element).toHaveScreenshot(`focus-state-${i}.png`);
      }
    }
  });

  test('loading states visual consistency', async ({ page }) => {
    // Slow down network to capture loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    
    // Capture loading state (if any loading indicators exist)
    const loadingIndicators = page.locator('[data-testid*="loading"], .loading, .spinner');
    if (await loadingIndicators.count() > 0) {
      await expect(page).toHaveScreenshot('homepage-loading.png');
    }
    
    // Wait for content to load and capture final state
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-loaded.png');
  });
});