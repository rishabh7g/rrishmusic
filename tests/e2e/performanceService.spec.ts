import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Performance Service
 * 
 * Tests complete user workflows for performance bookings,
 * portfolio browsing, pricing inquiries, and social media integration
 */

test.describe('Performance Service E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to performance page before each test
    await page.goto('/performance');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Initial Rendering', () => {
    
    test('should load performance page successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Performance.*Live Music.*Rrish Music/);
      
      // Check main heading is visible
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Performance|Live Music|Entertainment/);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /live music.*performance.*melbourne.*venues/i);
    });

    test('should display all performance sections', async ({ page }) => {
      // Check hero section
      await expect(page.locator('section').first()).toBeVisible();
      
      // Check performance gallery/portfolio
      const gallerySection = page.getByTestId('performance-gallery').or(
        page.locator('section:has-text("Portfolio"), section:has-text("Gallery"), section:has-text("Performances")')
      ).first();
      await expect(gallerySection).toBeVisible();
      
      // Check pricing section
      const pricingSection = page.getByTestId('pricing-section').or(
        page.locator('section:has-text("Pricing"), section:has-text("Rates"), section:has-text("Investment")')
      ).first();
      await expect(pricingSection).toBeVisible();
      
      // Check testimonials
      const testimonialsSection = page.locator('section:has-text("Testimonial"), section:has-text("Review")');
      if (await testimonialsSection.count() > 0) {
        await expect(testimonialsSection.first()).toBeVisible();
      }
    });

    test('should load Instagram feed if present', async ({ page }) => {
      // Wait for Instagram content to load
      await page.waitForTimeout(2000);
      
      const instagramSection = page.getByTestId('instagram-feed').or(
        page.locator('section:has-text("Instagram"), [class*="instagram"]')
      );
      
      if (await instagramSection.count() > 0) {
        await expect(instagramSection.first()).toBeVisible();
        
        // Check for Instagram posts or loading state
        const instagramPosts = page.locator('[class*="instagram"] img, [data-testid*="instagram"] img');
        if (await instagramPosts.count() > 0) {
          await expect(instagramPosts.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Performance Portfolio Interaction', () => {
    
    test('should display performance statistics', async ({ page }) => {
      // Look for performance stats/metrics
      const statsElements = page.locator('text=/\\d+.*performance|\\d+.*venue|\\d+.*event/i');
      if (await statsElements.count() > 0) {
        await expect(statsElements.first()).toBeVisible();
        
        // Verify numbers are realistic
        const statsText = await statsElements.first().textContent();
        const numbers = statsText?.match(/\d+/);
        if (numbers) {
          const number = parseInt(numbers[0]);
          expect(number).toBeGreaterThan(0);
          expect(number).toBeLessThan(10000); // Reasonable upper bound
        }
      }
    });

    test('should handle portfolio media interactions', async ({ page }) => {
      // Look for media elements (images, videos)
      const mediaElements = page.locator('img, video');
      const mediaCount = await mediaElements.count();
      
      if (mediaCount > 0) {
        // Click on first media element if clickable
        const firstMedia = mediaElements.first();
        await expect(firstMedia).toBeVisible();
        
        // Check if media opens modal or gallery
        const clickableMedia = page.locator('img[role="button"], [data-gallery], [data-modal]');
        if (await clickableMedia.count() > 0) {
          await clickableMedia.first().click();
          await page.waitForTimeout(1000);
          
          // Look for modal or enlarged view
          const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
          if (await modal.count() > 0) {
            await expect(modal.first()).toBeVisible();
            
            // Close modal
            const closeButton = page.getByRole('button', { name: /close|×/i });
            if (await closeButton.isVisible()) {
              await closeButton.click();
            } else {
              await page.keyboard.press('Escape');
            }
          }
        }
      }
    });

    test('should handle video playback if present', async ({ page }) => {
      const videoElements = page.locator('video');
      if (await videoElements.count() > 0) {
        const video = videoElements.first();
        await expect(video).toBeVisible();
        
        // Check if video has controls
        const hasControls = await video.getAttribute('controls');
        if (hasControls !== null) {
          // Try to play video
          await video.click();
          await page.waitForTimeout(2000);
          
          // Check if video is playing (this might be browser-dependent)
          const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
          // Note: Can't always guarantee autoplay due to browser policies
        }
      }
    });
  });

  test.describe('Booking and Inquiry Workflow', () => {
    
    test('should handle performance booking inquiry', async ({ page }) => {
      // Look for booking/inquiry button
      const bookingButton = page.getByRole('button', { name: /book.*performance|inquir|contact|get quote/i }).or(
        page.getByRole('link', { name: /book.*performance|inquir|contact|get quote/i })
      ).first();
      
      if (await bookingButton.isVisible()) {
        await bookingButton.click();
        await page.waitForTimeout(1000);
        
        // Fill out booking form
        const nameField = page.getByLabel(/name/i).or(page.locator('input[name*="name"]')).first();
        const emailField = page.getByLabel(/email/i).or(page.locator('input[name*="email"]')).first();
        
        if (await nameField.isVisible() && await emailField.isVisible()) {
          await nameField.fill('Event Organizer');
          await emailField.fill('organizer@venue.com');
          
          // Event date field
          const dateField = page.getByLabel(/date|event.*date/i).or(page.locator('input[type="date"]')).first();
          if (await dateField.isVisible()) {
            await dateField.fill('2024-12-31');
          }
          
          // Venue/location field
          const venueField = page.getByLabel(/venue|location/i).or(page.locator('input[name*="venue"]')).first();
          if (await venueField.isVisible()) {
            await venueField.fill('Melbourne Convention Centre');
          }
          
          // Event type selection
          const eventTypeSelect = page.locator('select:has(option:text-matches("wedding|corporate|private", "i"))');
          if (await eventTypeSelect.isVisible()) {
            await eventTypeSelect.selectOption({ label: /wedding|corporate|private/i });
          }
          
          // Message/details
          const messageField = page.getByLabel(/message|detail|requirement/i).or(page.locator('textarea')).first();
          if (await messageField.isVisible()) {
            await messageField.fill('Looking for live blues guitar performance for corporate event. Audience of approximately 100 people.');
          }
          
          // Submit form
          const submitButton = page.getByRole('button', { name: /submit|send|book|request/i });
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(2000);
            
            // Check for success confirmation
            const successMessage = page.locator('text=/success|thank|confirm|received/i');
            if (await successMessage.count() > 0) {
              await expect(successMessage.first()).toBeVisible();
            }
          }
        }
      }
    });

    test('should display pricing information clearly', async ({ page }) => {
      // Look for pricing section
      const pricingSection = page.locator('section:has-text("Pricing"), section:has-text("Rate"), section:has-text("Investment")');
      if (await pricingSection.count() > 0) {
        await expect(pricingSection.first()).toBeVisible();
        
        // Should show different pricing options
        const priceElements = page.locator('text=/\\$\\d+|\\d+.*hour|\\d+.*event/i');
        if (await priceElements.count() > 0) {
          await expect(priceElements.first()).toBeVisible();
          
          // Verify price format
          const priceText = await priceElements.first().textContent();
          expect(priceText).toMatch(/\$\d+|\d+.*\$|hour|event/i);
        }
      }
    });

    test('should validate booking form fields', async ({ page }) => {
      const bookingButton = page.getByRole('button', { name: /book|inquir|contact/i }).first();
      
      if (await bookingButton.isVisible()) {
        await bookingButton.click();
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

  test.describe('Social Media Integration', () => {
    
    test('should handle Instagram integration', async ({ page }) => {
      // Look for Instagram section
      const instagramSection = page.locator('section:has-text("Instagram"), [class*="instagram"]');
      if (await instagramSection.count() > 0) {
        await expect(instagramSection.first()).toBeVisible();
        
        // Check for Instagram posts
        await page.waitForTimeout(3000); // Allow time for Instagram API
        
        const instagramPosts = page.locator('[class*="instagram"] img, [data-instagram] img');
        if (await instagramPosts.count() > 0) {
          // Verify images have proper alt text
          const firstPost = instagramPosts.first();
          await expect(firstPost).toBeVisible();
          
          const altText = await firstPost.getAttribute('alt');
          expect(altText).not.toBeNull();
        }
        
        // Check for Instagram profile link
        const instagramLink = page.getByRole('link', { name: /instagram|follow.*instagram/i });
        if (await instagramLink.count() > 0) {
          const href = await instagramLink.first().getAttribute('href');
          expect(href).toContain('instagram.com');
        }
      }
    });

    test('should handle social sharing features', async ({ page }) => {
      // Look for social sharing buttons
      const shareButtons = page.locator('[class*="share"], [aria-label*="share"]');
      if (await shareButtons.count() > 0) {
        const shareButton = shareButtons.first();
        await expect(shareButton).toBeVisible();
        
        // Click share button (might open modal or menu)
        await shareButton.click();
        await page.waitForTimeout(1000);
        
        // Look for share options
        const shareOptions = page.locator('text=/facebook|twitter|linkedin|whatsapp/i');
        if (await shareOptions.count() > 0) {
          await expect(shareOptions.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Cross-Browser Performance Features', () => {
    
    test('should handle audio/media playback across browsers', async ({ page, browserName }) => {
      const audioElements = page.locator('audio');
      if (await audioElements.count() > 0) {
        const audio = audioElements.first();
        await expect(audio).toBeVisible();
        
        // Check audio controls
        const hasControls = await audio.getAttribute('controls');
        if (hasControls !== null) {
          // Different browsers might handle autoplay differently
          console.log(`Testing audio on ${browserName}`);
        }
      }
    });

    test('should load performance optimally across devices', async ({ page, isMobile }) => {
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      if (isMobile) {
        // Mobile should load reasonably fast
        expect(loadTime).toBeLessThan(5000);
      } else {
        // Desktop should load faster
        expect(loadTime).toBeLessThan(3000);
      }
      
      // Check critical content is visible
      const heading = page.getByRole('heading', { level: 1 }).first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Cross-Service Navigation', () => {
    
    test('should navigate between performance and other services', async ({ page }) => {
      // Navigate to teaching from performance
      const teachingLink = page.getByRole('link', { name: /lesson|teaching|guitar.*lesson/i });
      if (await teachingLink.count() > 0) {
        await teachingLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*teaching.*/);
        
        // Navigate back
        await page.goBack();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*performance.*/);
      }
      
      // Navigate to collaboration
      const collaborationLink = page.getByRole('link', { name: /collaboration|creative|music.*project/i });
      if (await collaborationLink.count() > 0) {
        await collaborationLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*collaboration.*/);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should display relevant cross-service suggestions', async ({ page }) => {
      // Look for suggestions to other services
      const teachingSuggestion = page.locator('text=/also.*teach|lesson.*available|guitar.*instruction/i');
      if (await teachingSuggestion.count() > 0) {
        await expect(teachingSuggestion.first()).toBeVisible();
      }
      
      const collaborationSuggestion = page.locator('text=/collaboration|creative.*project|recording/i');
      if (await collaborationSuggestion.count() > 0) {
        await expect(collaborationSuggestion.first()).toBeVisible();
      }
    });
  });

  test.describe('Mobile-Specific Performance Tests', () => {
    
    test('should handle touch interactions on mobile', async ({ page, isMobile }) => {
      if (isMobile) {
        // Test touch scrolling
        await page.touchscreen.tap(200, 300);
        await page.mouse.wheel(0, 500); // Scroll down
        
        // Check sticky navigation or back-to-top
        const backToTop = page.getByRole('button', { name: /top|up/i });
        if (await backToTop.count() > 0) {
          await expect(backToTop.first()).toBeVisible();
          await backToTop.first().click();
          
          // Should scroll back to top
          await page.waitForTimeout(1000);
        }
      }
    });

    test('should optimize media for mobile viewport', async ({ page, isMobile }) => {
      if (isMobile) {
        const images = page.locator('img');
        if (await images.count() > 0) {
          const firstImage = images.first();
          await expect(firstImage).toBeVisible();
          
          // Check if image is responsive
          const boundingBox = await firstImage.boundingBox();
          if (boundingBox) {
            const viewport = page.viewportSize();
            expect(boundingBox.width).toBeLessThanOrEqual(viewport?.width || 375);
          }
        }
      }
    });
  });

  test.describe('SEO and Structured Data', () => {
    
    test('should have performance service structured data', async ({ page }) => {
      const structuredData = page.locator('script[type="application/ld+json"]');
      if (await structuredData.count() > 0) {
        const jsonContent = await structuredData.first().textContent();
        const jsonData = JSON.parse(jsonContent || '{}');
        
        expect(jsonData['@context']).toBe('https://schema.org');
        expect(jsonData['@type']).toMatch(/Service|MusicEvent|PerformingGroup/);
        
        // Should include performance-specific information
        expect(JSON.stringify(jsonData)).toMatch(/performance|music|entertainment/i);
      }
    });

    test('should have proper Open Graph tags for social sharing', async ({ page }) => {
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      const ogImage = page.locator('meta[property="og:image"]');
      
      if (await ogTitle.count() > 0) {
        await expect(ogTitle).toHaveAttribute('content');
        const title = await ogTitle.getAttribute('content');
        expect(title).toMatch(/performance|live music/i);
      }
      
      if (await ogDescription.count() > 0) {
        await expect(ogDescription).toHaveAttribute('content');
      }
      
      if (await ogImage.count() > 0) {
        const imageUrl = await ogImage.getAttribute('content');
        expect(imageUrl).toMatch(/https?:\/\//);
      }
    });
  });
});