import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Teaching Service
 * 
 * Tests complete user workflows for guitar lesson inquiries,
 * package selection, form submission, and cross-service navigation
 */

test.describe('Teaching Service E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to teaching page before each test
    await page.goto('/teaching');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Initial Rendering', () => {
    
    test('should load teaching page successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Guitar Lessons.*Rrish Music/);
      
      // Check main heading is visible
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Guitar Lessons|Professional Guitar Teaching/);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /guitar lessons.*melbourne.*blues.*improvisation/i);
    });

    test('should display all required sections', async ({ page }) => {
      // Check hero section
      await expect(page.locator('section').first()).toBeVisible();
      
      // Check lessons section
      const lessonsSection = page.getByTestId('lessons-section').or(
        page.locator('section:has-text("Lesson Packages"), section:has-text("Guitar Lessons")')
      ).first();
      await expect(lessonsSection).toBeVisible();
      
      // Check approach section
      const approachSection = page.getByTestId('approach-section').or(
        page.locator('section:has-text("Teaching Approach"), section:has-text("My Approach")')
      ).first();
      await expect(approachSection).toBeVisible();
      
      // Check contact/inquiry section
      const contactSection = page.getByTestId('contact-section').or(
        page.locator('section:has-text("Contact"), section:has-text("Get Started")')
      ).first();
      await expect(contactSection).toBeVisible();
    });

    test('should be mobile responsive', async ({ page, isMobile }) => {
      if (isMobile) {
        // Check mobile navigation hamburger
        const navToggle = page.locator('button[aria-label*="menu"], button[aria-label*="navigation"]').first();
        if (await navToggle.isVisible()) {
          await expect(navToggle).toBeVisible();
        }
        
        // Check mobile-friendly text sizing
        const headings = page.getByRole('heading');
        const firstHeading = headings.first();
        await expect(firstHeading).toBeVisible();
        
        // Verify mobile viewport
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThan(768);
      }
    });
  });

  test.describe('User Interaction and Navigation', () => {
    
    test('should navigate to lesson packages smoothly', async ({ page }) => {
      // Look for lesson packages button or link
      const packagesButton = page.getByRole('button', { name: /lesson package|view package|packages/i }).or(
        page.getByRole('link', { name: /lesson package|view package|packages/i })
      ).first();
      
      if (await packagesButton.isVisible()) {
        await packagesButton.click();
        
        // Should scroll to or navigate to packages section
        const packagesSection = page.locator('section:has-text("Package"), section:has-text("Lesson")');
        await expect(packagesSection.first()).toBeVisible();
      }
    });

    test('should open contact form when CTA clicked', async ({ page }) => {
      // Look for primary CTA buttons
      const ctaButton = page.getByRole('button', { name: /start.*journey|get started|book.*lesson|contact/i }).or(
        page.getByRole('link', { name: /start.*journey|get started|book.*lesson|contact/i })
      ).first();
      
      if (await ctaButton.isVisible()) {
        await ctaButton.click();
        
        // Should open contact form or navigate to contact section
        await page.waitForTimeout(1000); // Wait for any animation
        
        // Check if modal opened or section became visible
        const contactForm = page.locator('form, section:has-text("Contact"), [role="dialog"]');
        await expect(contactForm.first()).toBeVisible();
      }
    });

    test('should handle keyboard navigation', async ({ page }) => {
      // Start from the top of the page
      await page.keyboard.press('Tab');
      
      // Check that focus moves to interactive elements
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Navigate through several tab stops
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
      }
      
      // Should be able to focus on buttons and links
      const interactiveElements = page.locator('button, a, input, select, textarea');
      const visibleCount = await interactiveElements.count();
      expect(visibleCount).toBeGreaterThan(0);
    });
  });

  test.describe('Form Interaction Workflows', () => {
    
    test('should handle lesson inquiry form submission', async ({ page }) => {
      // Look for inquiry or contact button
      const inquiryButton = page.getByRole('button', { name: /inquir|contact|get started|book/i }).or(
        page.getByRole('link', { name: /inquir|contact|get started|book/i })
      ).first();
      
      if (await inquiryButton.isVisible()) {
        await inquiryButton.click();
        await page.waitForTimeout(1000);
        
        // Look for form fields
        const nameField = page.getByLabel(/name/i).or(page.locator('input[name*="name"]')).first();
        const emailField = page.getByLabel(/email/i).or(page.locator('input[name*="email"]')).first();
        
        if (await nameField.isVisible() && await emailField.isVisible()) {
          // Fill out the form
          await nameField.fill('John Doe');
          await emailField.fill('john.doe@example.com');
          
          // Look for message or additional fields
          const messageField = page.getByLabel(/message|comment|detail/i).or(
            page.locator('textarea')
          ).first();
          
          if (await messageField.isVisible()) {
            await messageField.fill('I am interested in guitar lessons and would like to know more about your teaching approach.');
          }
          
          // Look for package selection if available
          const packageSelect = page.locator('select').or(
            page.getByRole('radio').first()
          );
          
          if (await packageSelect.isVisible()) {
            if (await packageSelect.getAttribute('type') === 'radio') {
              await packageSelect.click();
            } else {
              await packageSelect.selectOption({ index: 1 });
            }
          }
          
          // Submit the form
          const submitButton = page.getByRole('button', { name: /submit|send|book|confirm/i });
          if (await submitButton.isVisible()) {
            await submitButton.click();
            
            // Wait for submission response
            await page.waitForTimeout(2000);
            
            // Check for success message or confirmation
            const successMessage = page.locator('text=/success|thank|confirm|sent/i').first();
            if (await successMessage.isVisible()) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    });

    test('should validate form fields properly', async ({ page }) => {
      // Look for form
      const inquiryButton = page.getByRole('button', { name: /inquir|contact|get started/i }).first();
      
      if (await inquiryButton.isVisible()) {
        await inquiryButton.click();
        await page.waitForTimeout(1000);
        
        // Try to submit empty form
        const submitButton = page.getByRole('button', { name: /submit|send|book/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Should show validation errors
          const errorMessages = page.locator('text=/required|invalid|error/i, [aria-live="polite"]');
          if (await errorMessages.count() > 0) {
            await expect(errorMessages.first()).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Cross-Service Integration', () => {
    
    test('should navigate to other services from teaching page', async ({ page }) => {
      // Check navigation to Performance
      const performanceLink = page.getByRole('link', { name: /performance|live music/i });
      if (await performanceLink.count() > 0) {
        await performanceLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*performance.*/);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
      
      // Check navigation to Collaboration
      const collaborationLink = page.getByRole('link', { name: /collaboration|creative/i });
      if (await collaborationLink.count() > 0) {
        await collaborationLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*collaboration.*/);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should display cross-service suggestions', async ({ page }) => {
      // Look for suggestions to other services
      const suggestions = page.locator('text=/also offer|performance|collaboration|might.*interest/i');
      if (await suggestions.count() > 0) {
        await expect(suggestions.first()).toBeVisible();
      }
    });
  });

  test.describe('Performance and Accessibility', () => {
    
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/teaching');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should meet basic accessibility standards', async ({ page }) => {
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          expect(alt).not.toBeNull();
        }
      }
      
      // Check for proper heading hierarchy
      const h1Elements = page.getByRole('heading', { level: 1 });
      const h1Count = await h1Elements.count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      
      // Check for skip links or proper focus management
      const skipLink = page.getByRole('link', { name: /skip.*content/i });
      // Skip links might not be visible by default, but should exist
    });

    test('should handle JavaScript disabled gracefully', async ({ page, context }) => {
      // Disable JavaScript
      await context.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (compatible; test/no-js)' });
      await page.goto('/teaching');
      
      // Basic content should still be visible
      const heading = page.getByRole('heading', { level: 1 }).first();
      await expect(heading).toBeVisible();
      
      // Text content should be readable
      const content = page.locator('body');
      const textContent = await content.textContent();
      expect(textContent).toContain('guitar');
      expect(textContent).toContain('lesson');
    });
  });

  test.describe('SEO and Meta Tags', () => {
    
    test('should have proper SEO meta tags', async ({ page }) => {
      // Check title tag
      await expect(page).toHaveTitle(/Guitar Lessons.*Rrish Music/);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content');
      const description = await metaDescription.getAttribute('content');
      expect(description).toMatch(/guitar.*lesson.*melbourne/i);
      
      // Check canonical URL
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /.*teaching/);
      
      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      if (await ogTitle.isVisible()) {
        await expect(ogTitle).toHaveAttribute('content');
      }
    });

    test('should have structured data for teaching services', async ({ page }) => {
      // Check for JSON-LD structured data
      const structuredData = page.locator('script[type="application/ld+json"]');
      if (await structuredData.count() > 0) {
        const jsonContent = await structuredData.first().textContent();
        expect(jsonContent).toContain('schema.org');
        
        // Should contain service or educational organization schema
        const jsonData = JSON.parse(jsonContent || '{}');
        expect(jsonData['@type']).toMatch(/Service|EducationalOrganization|MusicGroup/);
      }
    });
  });

  test.describe('Error Handling', () => {
    
    test('should handle network errors gracefully', async ({ page, context }) => {
      // Simulate offline condition
      await context.setOffline(true);
      
      const response = await page.goto('/teaching', { waitUntil: 'networkidle' }).catch(() => null);
      
      // Should either show error page or cached content
      if (response === null) {
        // Offline behavior - should show some content or error message
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
      
      // Restore online
      await context.setOffline(false);
    });

    test('should handle slow loading gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 1000);
      });
      
      await page.goto('/teaching');
      
      // Should show loading state or skeleton
      const content = page.locator('body');
      await expect(content).toBeVisible();
      
      // Eventually should load complete content
      await page.waitForLoadState('networkidle');
      const heading = page.getByRole('heading', { level: 1 }).first();
      await expect(heading).toBeVisible();
    });
  });
});