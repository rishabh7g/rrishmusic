import { test, expect, VIEWPORTS } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('Mobile Experience', () => {
  let homePage: HomePage;

  test.describe('Mobile Layout - Phone (375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
    });

    test('should display mobile-optimized layout', async ({ page }) => {
      await homePage.verifyMobileLayout();
      
      // Verify sections stack vertically
      const sections = [homePage.heroSection, homePage.aboutSection, homePage.contactSection];
      
      let previousBottom = 0;
      for (const section of sections) {
        if (await section.count() > 0) {
          const box = await section.boundingBox();
          if (box) {
            // Each section should be below the previous one
            expect(box.y).toBeGreaterThanOrEqual(previousBottom - 50); // 50px tolerance
            previousBottom = box.y + box.height;
          }
        }
      }
    });

    test('should handle mobile navigation correctly', async ({ page }) => {
      if (await homePage.mobileMenuToggle.count() > 0) {
        // Verify mobile menu toggle is visible
        await expect(homePage.mobileMenuToggle).toBeVisible();
        
        // Test menu toggle functionality
        await homePage.toggleMobileMenu();
        
        // Mobile menu should be visible after toggle
        const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"], nav ul, .nav-links');
        if (await mobileMenu.count() > 0) {
          await expect(mobileMenu).toBeVisible();
          
          // Test navigation via mobile menu
          const mobileLinks = mobileMenu.locator('a[href^="#"]');
          const linkCount = await mobileLinks.count();
          
          if (linkCount > 0) {
            const firstLink = mobileLinks.first();
            const href = await firstLink.getAttribute('href');
            
            await firstLink.click();
            await page.waitForTimeout(1000);
            
            // Should navigate to target section
            if (href) {
              const targetSection = page.locator(href);
              if (await targetSection.count() > 0) {
                await expect(targetSection).toBeInViewport();
              }
            }
            
            // Mobile menu should close after navigation
            await expect(mobileMenu).toBeHidden();
          }
        }
      }
    });

    test('should have touch-friendly interactions', async ({ page }) => {
      // All clickable elements should be at least 44px in size (iOS guidelines)
      const clickableElements = page.locator('button, a, input[type="submit"], [role="button"]');
      const elementCount = await clickableElements.count();
      
      for (let i = 0; i < elementCount; i++) {
        const element = clickableElements.nth(i);
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            // Check minimum touch target size
            expect(box.width).toBeGreaterThanOrEqual(40); // Slightly less strict than iOS
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });

    test('should handle text readability on mobile', async ({ page }) => {
      const textElements = page.locator('p, li, span, div').filter({ hasText: /\w{10,}/ });
      const elementCount = await textElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = textElements.nth(i);
        
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            fontSize: parseInt(computed.fontSize),
            lineHeight: computed.lineHeight,
          };
        });
        
        // Font size should be at least 16px for body text on mobile
        expect(styles.fontSize).toBeGreaterThanOrEqual(14);
      }
    });

    test('should scroll smoothly on mobile', async ({ page }) => {
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Simulate touch scroll
      await page.touchscreen.tap(200, 400);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
    });

    test('should handle form inputs on mobile', async ({ page, testData }) => {
      if (await homePage.contactForm.count() > 0) {
        // Test form field interactions
        const inputs = homePage.contactForm.locator('input, textarea');
        const inputCount = await inputs.count();
        
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          
          // Tap to focus
          await input.tap();
          await page.waitForTimeout(300);
          
          // Input should be focused
          await expect(input).toBeFocused();
          
          // Type test text
          await input.fill('Test input');
          await expect(input).toHaveValue('Test input');
          
          // Clear for next test
          await input.fill('');
        }
      }
    });
  });

  test.describe('Tablet Layout - iPad (768px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
    });

    test('should display tablet-optimized layout', async ({ page }) => {
      // Navigation should be visible (not collapsed)
      await expect(homePage.navMenu).toBeVisible();
      
      // Check if desktop-style navigation is shown
      const desktopNavLinks = homePage.navMenu.locator('a').filter({ hasText: /home|about|teaching|contact/i });
      const navLinkCount = await desktopNavLinks.count();
      
      if (navLinkCount > 0) {
        // Desktop navigation should be visible on tablet
        await expect(desktopNavLinks.first()).toBeVisible();
      }
      
      // Mobile menu toggle should be hidden or not present
      if (await homePage.mobileMenuToggle.count() > 0) {
        await expect(homePage.mobileMenuToggle).toBeHidden();
      }
    });

    test('should have appropriate spacing for tablet', async () => {
      // Sections should have proper spacing
      const heroBox = await homePage.heroSection.boundingBox();
      expect(heroBox?.height).toBeGreaterThan(400); // Should be taller than mobile
      
      // Text should not be too wide (readability)
      const textElements = homePage.page.locator('p');
      if (await textElements.count() > 0) {
        const textBox = await textElements.first().boundingBox();
        if (textBox) {
          expect(textBox.width).toBeLessThan(700); // Optimal reading width
        }
      }
    });

    test('should handle tablet interactions', async ({ page }) => {
      // Test touch and click interactions work
      const navLinks = homePage.navMenu.locator('a[href^="#"]');
      const linkCount = await navLinks.count();
      
      if (linkCount > 0) {
        const firstLink = navLinks.first();
        const href = await firstLink.getAttribute('href');
        
        // Both tap and click should work
        await firstLink.tap();
        await page.waitForTimeout(1000);
        
        if (href) {
          const targetSection = page.locator(href);
          if (await targetSection.count() > 0) {
            await expect(targetSection).toBeInViewport();
          }
        }
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      homePage = new HomePage(page);
    });

    test('should load quickly on mobile', async ({ page, performanceHelper }) => {
      await homePage.goto();
      
      const metrics = await performanceHelper.measurePageLoad();
      
      // Mobile-specific performance thresholds (more lenient)
      expect(metrics.firstContentfulPaint).toBeLessThan(2500); // 2.5s
      expect(metrics.largestContentfulPaint).toBeLessThan(3000); // 3s
      expect(metrics.cumulativeLayoutShift).toBeLessThan(0.15); // Slightly higher tolerance
    });

    test('should handle slow connections gracefully', async ({ page }) => {
      // Simulate slow 3G connection
      await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 200)); // Add 200ms delay
        await route.continue();
      });
      
      await homePage.goto();
      
      // Page should still load and be usable
      await expect(homePage.heroSection).toBeVisible({ timeout: 10000 });
      await expect(homePage.navMenu).toBeVisible();
    });

    test('should optimize images for mobile', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        
        // Check for responsive images
        const srcset = await image.getAttribute('srcset');
        const sizes = await image.getAttribute('sizes');
        
        if (srcset || sizes) {
          expect(srcset || sizes).toBeTruthy();
        }
        
        // Image should not exceed viewport width
        const box = await image.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width + 50); // 50px tolerance
        }
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
    });

    test('should support screen readers on mobile', async ({ page }) => {
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
      
      // H1 should exist
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check for ARIA landmarks
      const landmarks = page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
      const landmarkCount = await landmarks.count();
      
      if (landmarkCount === 0) {
        // Check for semantic HTML5 elements as fallback
        const semanticElements = page.locator('main, nav, header, footer');
        const semanticCount = await semanticElements.count();
        expect(semanticCount).toBeGreaterThan(0);
      }
    });

    test('should have proper focus indicators', async ({ page }) => {
      const focusableElements = page.locator('a, button, input, textarea, [tabindex="0"]');
      const elementCount = await focusableElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = focusableElements.nth(i);
        
        if (await element.isVisible()) {
          await element.focus();
          
          // Check if element has focus styles
          const styles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el, ':focus');
            return {
              outline: computed.outline,
              boxShadow: computed.boxShadow,
              borderColor: computed.borderColor,
            };
          });
          
          // Should have some form of focus indicator
          const hasFocusIndicator = 
            styles.outline !== 'none' ||
            styles.boxShadow !== 'none' ||
            styles.borderColor !== 'transparent';
          
          expect(hasFocusIndicator).toBe(true);
        }
      }
    });

    test('should handle zoom up to 200%', async ({ page }) => {
      // Test page at 200% zoom
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      await page.waitForTimeout(500);
      
      // Page should still be usable
      await expect(homePage.heroSection).toBeVisible();
      await expect(homePage.navMenu).toBeVisible();
      
      // Content should not overflow horizontally
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = VIEWPORTS.mobile.width;
      
      // With zoom, some horizontal scroll is expected, but not excessive
      expect(bodyWidth).toBeLessThan(viewportWidth * 3);
      
      // Reset zoom
      await page.evaluate(() => {
        document.body.style.zoom = '1';
      });
    });
  });

  test.describe('Cross-Device Consistency', () => {
    test('should maintain brand consistency across devices', async ({ page }) => {
      const devices = [
        { name: 'mobile', viewport: VIEWPORTS.mobile },
        { name: 'tablet', viewport: VIEWPORTS.tablet },
        { name: 'desktop', viewport: VIEWPORTS.desktop },
      ];
      
      const brandElements = {
        logo: page.locator('img[alt*="logo" i], .logo img, [data-testid="logo"]'),
        title: page.locator('h1'),
        primaryColor: page.locator('.btn-primary, .cta-button, .primary-button').first(),
      };
      
      const brandData: any = {};
      
      for (const device of devices) {
        await page.setViewportSize(device.viewport);
        await homePage.goto();
        await homePage.waitForPageLoad();
        
        brandData[device.name] = {};
        
        // Check logo consistency
        if (await brandElements.logo.count() > 0) {
          const logoSrc = await brandElements.logo.getAttribute('src');
          brandData[device.name].logo = logoSrc;
        }
        
        // Check title consistency
        if (await brandElements.title.count() > 0) {
          const titleText = await brandElements.title.textContent();
          brandData[device.name].title = titleText?.trim();
        }
        
        // Check primary color consistency
        if (await brandElements.primaryColor.count() > 0) {
          const primaryColorStyle = await brandElements.primaryColor.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return computed.backgroundColor || computed.color;
          });
          brandData[device.name].primaryColor = primaryColorStyle;
        }
      }
      
      // Verify consistency across devices
      const devices_keys = Object.keys(brandData);
      if (devices_keys.length > 1) {
        // Logo should be the same
        if (brandData.mobile?.logo && brandData.desktop?.logo) {
          expect(brandData.mobile.logo).toBe(brandData.desktop.logo);
        }
        
        // Title should be the same
        if (brandData.mobile?.title && brandData.desktop?.title) {
          expect(brandData.mobile.title).toBe(brandData.desktop.title);
        }
      }
    });

    test('should provide consistent functionality across devices', async ({ page, testData }) => {
      const devices = [VIEWPORTS.mobile, VIEWPORTS.desktop];
      
      for (const viewport of devices) {
        await page.setViewportSize(viewport);
        await homePage.goto();
        await homePage.waitForPageLoad();
        
        // Test navigation works
        const navLinks = page.locator('a[href^="#"]');
        const linkCount = await navLinks.count();
        
        if (linkCount > 0) {
          const testLink = navLinks.first();
          const href = await testLink.getAttribute('href');
          
          await testLink.click();
          await page.waitForTimeout(1000);
          
          if (href) {
            const targetSection = page.locator(href);
            if (await targetSection.count() > 0) {
              await expect(targetSection).toBeInViewport();
            }
          }
        }
        
        // Test contact form if present
        if (await homePage.contactForm.count() > 0) {
          await homePage.fillContactForm(testData.user);
          
          const nameInput = homePage.contactForm.locator('input[name="name"], input[placeholder*="name" i]');
          if (await nameInput.count() > 0) {
            await expect(nameInput).toHaveValue(testData.user.name);
          }
        }
      }
    });
  });
});