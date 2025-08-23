import { test, expect } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('RrishMusic Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test.describe('Page Loading and Basic Structure', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/rrish|music|guitar/i);
      await expect(homePage.navMenu).toBeVisible();
      await expect(homePage.heroSection).toBeVisible();
    });

    test('should have proper page structure', async () => {
      // Verify main sections are present
      await expect(homePage.heroSection).toBeVisible();
      
      // Check if about section exists (may vary by implementation)
      if (await homePage.aboutSection.count() > 0) {
        await expect(homePage.aboutSection).toBeVisible();
      }
      
      // Check if contact section exists
      if (await homePage.contactSection.count() > 0) {
        await expect(homePage.contactSection).toBeVisible();
      }
    });

    test('should have valid HTML structure', async ({ page }) => {
      // Check for semantic HTML
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Should have exactly one H1
      
      // Check for navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Check for main content
      const mainContent = page.locator('main, [role="main"]');
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
      }
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero content correctly', async () => {
      await homePage.verifyHeroContent();
    });

    test('should have working hero CTA if present', async () => {
      if (await homePage.heroCTA.count() > 0) {
        await expect(homePage.heroCTA).toBeVisible();
        await expect(homePage.heroCTA).toBeEnabled();
        
        // Test CTA interaction
        await homePage.heroCTA.click();
        // Allow time for any scroll or navigation
        await homePage.page.waitForTimeout(1000);
      }
    });

    test('should load hero image if present', async () => {
      if (await homePage.heroImage.count() > 0) {
        await expect(homePage.heroImage).toBeVisible();
        
        // Check if image loads successfully
        const src = await homePage.heroImage.getAttribute('src');
        expect(src).toBeTruthy();
        
        const naturalWidth = await homePage.heroImage.evaluate(
          (img: HTMLImageElement) => img.naturalWidth
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Content Sections', () => {
    test('should display about section correctly', async () => {
      if (await homePage.aboutSection.count() > 0) {
        await homePage.verifyAboutSection();
      }
    });

    test('should display teaching section correctly', async () => {
      if (await homePage.teachingSection.count() > 0) {
        await homePage.verifyTeachingSection();
      }
    });

    test('should display lesson packages correctly', async () => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.verifyPackagesSection();
      }
    });

    test('should display testimonials if present', async () => {
      if (await homePage.testimonialsSection.count() > 0) {
        await expect(homePage.testimonialsSection).toBeVisible();
        
        const testimonialCount = await homePage.testimonialCards.count();
        if (testimonialCount > 0) {
          await expect(homePage.testimonialCards.first()).toBeVisible();
          
          // Verify testimonial content
          const testimonialText = await homePage.testimonialCards.first().textContent();
          expect(testimonialText).toBeTruthy();
          expect(testimonialText!.length).toBeGreaterThan(10);
        }
      }
    });
  });

  test.describe('Contact Section', () => {
    test('should display contact section correctly', async () => {
      if (await homePage.contactSection.count() > 0) {
        await homePage.verifyContactSection();
      }
    });

    test('should have working social links', async ({ testData }) => {
      const socialLinkCount = await homePage.socialLinks.count();
      
      if (socialLinkCount > 0) {
        for (let i = 0; i < socialLinkCount; i++) {
          const link = homePage.socialLinks.nth(i);
          await expect(link).toBeVisible();
          
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).toMatch(/^https?:\/\//); // Should be external link
          
          // Test link attributes
          const target = await link.getAttribute('target');
          expect(target).toBe('_blank'); // External links should open in new tab
          
          const rel = await link.getAttribute('rel');
          expect(rel).toContain('noopener'); // Security best practice
        }
      }
    });

    test('should handle contact form if present', async ({ testData }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.fillContactForm(testData.user);
        
        // Verify form fields are filled
        const nameInput = homePage.contactForm.locator('input[name="name"], input[placeholder*="name" i]');
        if (await nameInput.count() > 0) {
          await expect(nameInput).toHaveValue(testData.user.name);
        }
        
        const emailInput = homePage.contactForm.locator('input[type="email"]');
        if (await emailInput.count() > 0) {
          await expect(emailInput).toHaveValue(testData.user.email);
        }
        
        // Note: We don't submit the form in tests to avoid spam
      }
    });
  });

  test.describe('Images and Media', () => {
    test('should load all images successfully', async () => {
      await homePage.checkImagesLoaded();
    });

    test('should have alt text for images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        const ariaLabel = await image.getAttribute('aria-label');
        
        // Either alt text or aria-label should be present
        expect(alt || ariaLabel).toBeTruthy();
      }
    });

    test('should handle missing images gracefully', async ({ page }) => {
      // Check for any broken images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        
        // Check if image loaded successfully
        const complete = await image.evaluate((img: HTMLImageElement) => img.complete);
        const naturalHeight = await image.evaluate((img: HTMLImageElement) => img.naturalHeight);
        
        if (complete && naturalHeight === 0) {
          console.warn(`Potentially broken image found: ${await image.getAttribute('src')}`);
        }
      }
    });
  });

  test.describe('Footer', () => {
    test('should display footer correctly', async () => {
      if (await homePage.footer.count() > 0) {
        await expect(homePage.footer).toBeVisible();
        
        // Check footer content
        const footerText = await homePage.footer.textContent();
        expect(footerText).toBeTruthy();
        
        // Should contain copyright or contact info
        expect(footerText).toMatch(/©|copyright|rrish|contact/i);
      }
    });

    test('should have working footer links', async () => {
      const footerLinkCount = await homePage.footerLinks.count();
      
      for (let i = 0; i < footerLinkCount; i++) {
        const link = homePage.footerLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href) {
          expect(href).toBeTruthy();
          
          // Internal links should start with # or /
          // External links should be full URLs
          expect(href).toMatch(/^(#|\/|https?:\/\/)/);
        }
      }
    });
  });

  test.describe('Content Quality', () => {
    test('should have meaningful content', async ({ page }) => {
      // Check for substantial text content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(500);
      
      // Should contain music-related keywords
      expect(bodyText).toMatch(/guitar|music|lesson|teaching|blues|improvisation/i);
    });

    test('should have proper heading hierarchy', async ({ page, accessibilityHelper }) => {
      await accessibilityHelper.checkHeadingHierarchy();
    });

    test('should not have lorem ipsum text', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toMatch(/lorem ipsum|dolor sit amet/i);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle JavaScript errors gracefully', async ({ page }) => {
      const jsErrors: string[] = [];
      
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });
      
      // Navigate and interact with page
      await homePage.goto();
      
      // Scroll through sections
      if (await homePage.aboutSection.count() > 0) {
        await homePage.scrollToSection('about');
      }
      if (await homePage.contactSection.count() > 0) {
        await homePage.scrollToSection('contact');
      }
      
      // Check for critical JavaScript errors
      const criticalErrors = jsErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('google') && 
        !error.includes('analytics')
      );
      
      expect(criticalErrors).toHaveLength(0);
    });

    test('should handle network failures gracefully', async ({ page }) => {
      // Test with slow network
      await page.route('**/*', (route) => {
        // Delay all requests by 100ms to simulate slow network
        setTimeout(() => route.continue(), 100);
      });
      
      await homePage.goto();
      
      // Page should still load and be functional
      await expect(homePage.heroSection).toBeVisible();
      await expect(homePage.navMenu).toBeVisible();
    });
  });
});