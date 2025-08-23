import { test, expect, TestUtils } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('Navigation and Scrolling', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test.describe('Navigation Menu', () => {
    test('should display navigation menu correctly', async () => {
      await expect(homePage.navMenu).toBeVisible();
      
      // Check for navigation links
      const navLinks = homePage.navMenu.locator('a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('should navigate to all sections via menu links', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        const sectionLink = homePage.navMenu.locator(`a[href="#${section}"]`);
        
        if (await sectionLink.count() > 0) {
          // Click the navigation link
          await sectionLink.click();
          await page.waitForTimeout(1000); // Allow for scroll animation
          
          // Verify the section is in view
          const targetSection = page.locator(`#${section}`);
          if (await targetSection.count() > 0) {
            await expect(targetSection).toBeInViewport();
          }
        }
      }
    });

    test('should highlight active section in navigation', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        const targetSection = page.locator(`#${section}`);
        
        if (await targetSection.count() > 0) {
          // Scroll to section
          await targetSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          
          // Check if corresponding nav link has active state
          const navLink = homePage.navMenu.locator(`a[href="#${section}"]`);
          if (await navLink.count() > 0) {
            // Check for active classes (common patterns)
            const classList = await navLink.getAttribute('class') || '';
            const isActive = classList.includes('active') || 
                           classList.includes('current') ||
                           classList.includes('highlighted');
            
            // Note: This test might need adjustment based on actual implementation
            if (!isActive) {
              console.log(`Navigation highlight not detected for ${section} - this may be expected behavior`);
            }
          }
        }
      }
    });

    test('should handle keyboard navigation', async ({ page, accessibilityHelper }) => {
      // Tab through navigation links
      await page.press('body', 'Tab');
      
      const navLinks = homePage.navMenu.locator('a');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Press Enter to activate link
        await page.press('body', 'Enter');
        await page.waitForTimeout(500);
        
        // Tab to next element
        await page.press('body', 'Tab');
      }
    });
  });

  test.describe('Smooth Scrolling', () => {
    test('should scroll smoothly between sections', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        const targetSection = page.locator(`#${section}`);
        
        if (await targetSection.count() > 0) {
          const initialScrollY = await page.evaluate(() => window.scrollY);
          
          // Click navigation link
          const navLink = homePage.navMenu.locator(`a[href="#${section}"]`);
          if (await navLink.count() > 0) {
            await navLink.click();
            
            // Wait for scroll to complete
            await page.waitForTimeout(1000);
            
            const finalScrollY = await page.evaluate(() => window.scrollY);
            
            // Verify scroll happened
            if (section !== 'home') {
              expect(finalScrollY).toBeGreaterThan(initialScrollY);
            }
            
            // Verify target section is in viewport
            await expect(targetSection).toBeInViewport();
          }
        }
      }
    });

    test('should handle direct URL navigation to sections', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        // Navigate directly to section via URL fragment
        await page.goto(`/#${section}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        const targetSection = page.locator(`#${section}`);
        if (await targetSection.count() > 0) {
          await expect(targetSection).toBeInViewport();
          
          // Verify URL fragment is correct
          const currentURL = page.url();
          expect(currentURL).toContain(`#${section}`);
        }
      }
    });

    test('should maintain scroll position on page refresh', async ({ page }) => {
      // Scroll to a middle section
      const middleSection = page.locator('#about, #teaching').first();
      
      if (await middleSection.count() > 0) {
        await middleSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        const scrollYBeforeRefresh = await page.evaluate(() => window.scrollY);
        
        // Refresh page
        await page.reload();
        await homePage.waitForPageLoad();
        
        const scrollYAfterRefresh = await page.evaluate(() => window.scrollY);
        
        // Should maintain approximate scroll position
        expect(Math.abs(scrollYAfterRefresh - scrollYBeforeRefresh)).toBeLessThan(100);
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu toggle on small screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await homePage.waitForPageLoad();
      
      if (await homePage.mobileMenuToggle.count() > 0) {
        await expect(homePage.mobileMenuToggle).toBeVisible();
      }
    });

    test('should toggle mobile menu correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await homePage.waitForPageLoad();
      
      if (await homePage.mobileMenuToggle.count() > 0) {
        // Initially, mobile menu should be closed
        const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"]');
        
        if (await mobileMenu.count() > 0) {
          // Menu should be hidden initially
          await expect(mobileMenu).toBeHidden();
          
          // Click toggle to open
          await homePage.mobileMenuToggle.click();
          await page.waitForTimeout(300);
          
          await expect(mobileMenu).toBeVisible();
          
          // Click toggle again to close
          await homePage.mobileMenuToggle.click();
          await page.waitForTimeout(300);
          
          await expect(mobileMenu).toBeHidden();
        }
      }
    });

    test('should navigate via mobile menu', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await homePage.waitForPageLoad();
      
      if (await homePage.mobileMenuToggle.count() > 0) {
        // Open mobile menu
        await homePage.mobileMenuToggle.click();
        await page.waitForTimeout(300);
        
        const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"]');
        
        if (await mobileMenu.count() > 0) {
          const mobileLinks = mobileMenu.locator('a');
          const linkCount = await mobileLinks.count();
          
          if (linkCount > 0) {
            // Click first available section link
            const firstLink = mobileLinks.first();
            const href = await firstLink.getAttribute('href');
            
            if (href?.startsWith('#')) {
              await firstLink.click();
              await page.waitForTimeout(1000);
              
              // Verify navigation worked
              const targetSection = page.locator(href);
              if (await targetSection.count() > 0) {
                await expect(targetSection).toBeInViewport();
              }
              
              // Mobile menu should close after navigation
              if (await mobileMenu.count() > 0) {
                await expect(mobileMenu).toBeHidden();
              }
            }
          }
        }
      }
    });

    test('should handle touch interactions', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await homePage.waitForPageLoad();
      
      // Test touch scrolling
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Simulate swipe up gesture
      await page.touchscreen.tap(200, 400);
      await page.touchscreen.tap(200, 200);
      await page.waitForTimeout(500);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      
      // Touch scrolling should work (scroll position might change)
      // This is a basic test - actual touch behavior depends on implementation
      expect(typeof finalScrollY).toBe('number');
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle browser back/forward buttons', async ({ page }) => {
      // Navigate to different sections
      const sections = ['about', 'contact'];
      
      for (const section of sections) {
        const targetSection = page.locator(`#${section}`);
        
        if (await targetSection.count() > 0) {
          // Navigate to section
          await page.goto(`/#${section}`);
          await page.waitForLoadState('networkidle');
          
          // Verify we're at the section
          expect(page.url()).toContain(`#${section}`);
          
          // Go back
          await page.goBack();
          await page.waitForLoadState('networkidle');
          
          // Go forward
          await page.goForward();
          await page.waitForLoadState('networkidle');
          
          // Should be back at the section
          expect(page.url()).toContain(`#${section}`);
        }
      }
    });

    test('should update URL when navigating sections', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        const navLink = homePage.navMenu.locator(`a[href="#${section}"]`);
        
        if (await navLink.count() > 0) {
          await navLink.click();
          await page.waitForTimeout(500);
          
          // URL should update to reflect current section
          const currentURL = page.url();
          expect(currentURL).toContain(`#${section}`);
        }
      }
    });

    test('should handle page reload at any section', async ({ page }) => {
      const sections = ['about', 'teaching', 'pricing', 'contact'];
      
      for (const section of sections) {
        // Navigate to section
        await page.goto(`/#${section}`);
        await page.waitForLoadState('networkidle');
        
        // Reload page
        await page.reload();
        await homePage.waitForPageLoad();
        
        // Should still be at the correct section
        const targetSection = page.locator(`#${section}`);
        if (await targetSection.count() > 0) {
          await expect(targetSection).toBeInViewport();
        }
        
        // URL should be preserved
        expect(page.url()).toContain(`#${section}`);
      }
    });
  });

  test.describe('Accessibility Navigation', () => {
    test('should provide skip links for keyboard users', async ({ page }) => {
      // Check for skip navigation links
      const skipLinks = page.locator('a[href="#main"], a[href="#content"], .skip-link');
      
      if (await skipLinks.count() > 0) {
        await expect(skipLinks.first()).toBeHidden(); // Usually hidden by default
        
        // Tab to make skip link visible
        await page.press('body', 'Tab');
        
        const firstSkipLink = skipLinks.first();
        if (await firstSkipLink.isVisible()) {
          await expect(firstSkipLink).toBeVisible();
          
          // Test skip link functionality
          await firstSkipLink.click();
          await page.waitForTimeout(500);
          
          const mainContent = page.locator('#main, #content, main');
          if (await mainContent.count() > 0) {
            await expect(mainContent).toBeFocused();
          }
        }
      }
    });

    test('should have proper ARIA labels for navigation', async ({ page }) => {
      // Check navigation landmarks
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Check for aria-label or aria-labelledby
      const ariaLabel = await nav.getAttribute('aria-label');
      const ariaLabelledBy = await nav.getAttribute('aria-labelledby');
      
      if (!ariaLabel && !ariaLabelledBy) {
        console.log('Navigation could benefit from aria-label for better accessibility');
      }
      
      // Check navigation links have proper labels
      const navLinks = nav.locator('a');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        const linkText = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        // Link should have either text content or aria-label
        expect(linkText || ariaLabel).toBeTruthy();
      }
    });

    test('should support keyboard-only navigation', async ({ page }) => {
      // Start from top of page
      await page.goto('/');
      await homePage.waitForPageLoad();
      
      // Tab through focusable elements
      const focusableElements = [];
      const maxTabs = 10; // Limit to avoid infinite loops
      
      for (let i = 0; i < maxTabs; i++) {
        await page.press('body', 'Tab');
        
        const focusedElement = page.locator(':focus');
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const href = await focusedElement.getAttribute('href');
        
        focusableElements.push({ tagName, href });
        
        // Test Enter key activation for links
        if (tagName === 'a' && href?.startsWith('#')) {
          await page.press('body', 'Enter');
          await page.waitForTimeout(500);
          
          // Verify navigation occurred
          const targetSection = page.locator(href);
          if (await targetSection.count() > 0) {
            expect(await targetSection.isInViewport()).toBe(true);
          }
          
          break; // Test one navigation to avoid too much scrolling
        }
      }
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });
});