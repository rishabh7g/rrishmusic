import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Collaboration Service
 * 
 * Tests complete user workflows for creative collaboration inquiries,
 * portfolio browsing, project process understanding, and partnership CTAs
 */

test.describe('Collaboration Service E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to collaboration page before each test
    await page.goto('/collaboration');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Initial Rendering', () => {
    
    test('should load collaboration page successfully', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Collaboration.*Creative.*Rrish Music/);
      
      // Check main heading is visible
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/Collaboration|Creative|Partnership/);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /creative.*collaboration.*project.*music/i);
    });

    test('should display all collaboration sections', async ({ page }) => {
      // Check hero section
      await expect(page.locator('section').first()).toBeVisible();
      
      // Check collaboration portfolio
      const portfolioSection = page.getByTestId('collaboration-portfolio').or(
        page.locator('section:has-text("Portfolio"), section:has-text("Project"), section:has-text("Work")')
      ).first();
      await expect(portfolioSection).toBeVisible();
      
      // Check collaboration process
      const processSection = page.getByTestId('collaboration-process').or(
        page.locator('section:has-text("Process"), section:has-text("How"), section:has-text("Steps")')
      ).first();
      await expect(processSection).toBeVisible();
      
      // Check CTA section
      const ctaSection = page.getByTestId('collaboration-cta').or(
        page.locator('section:has-text("Get Started"), section:has-text("Contact"), section:has-text("Work Together")')
      ).first();
      await expect(ctaSection).toBeVisible();
    });

    test('should showcase collaboration portfolio', async ({ page }) => {
      // Look for portfolio items
      const portfolioItems = page.locator('[class*="portfolio"], [data-portfolio]');
      if (await portfolioItems.count() > 0) {
        await expect(portfolioItems.first()).toBeVisible();
      }
      
      // Look for project examples
      const projects = page.locator('text=/project|collaboration|recording|creative/i');
      const visibleProjects = await projects.count();
      expect(visibleProjects).toBeGreaterThan(0);
    });
  });

  test.describe('Collaboration Process Understanding', () => {
    
    test('should explain collaboration process clearly', async ({ page }) => {
      // Look for process steps
      const processSteps = page.locator('text=/step.*1|step.*2|step.*3|first|second|third/i');
      if (await processSteps.count() > 0) {
        await expect(processSteps.first()).toBeVisible();
        
        // Should have multiple steps
        const stepCount = await processSteps.count();
        expect(stepCount).toBeGreaterThanOrEqual(3);
      }
      
      // Look for process description
      const processDescription = page.locator('text=/process|workflow|approach|method/i');
      if (await processDescription.count() > 0) {
        await expect(processDescription.first()).toBeVisible();
      }
    });

    test('should highlight collaboration benefits', async ({ page }) => {
      // Look for benefits or value propositions
      const benefits = page.locator('text=/benefit|advantage|value|unique|professional/i');
      if (await benefits.count() > 0) {
        await expect(benefits.first()).toBeVisible();
      }
      
      // Look for collaboration types
      const collaborationTypes = page.locator('text=/recording|songwriting|arrangement|production/i');
      if (await collaborationTypes.count() > 0) {
        await expect(collaborationTypes.first()).toBeVisible();
      }
    });

    test('should display collaboration timeline expectations', async ({ page }) => {
      // Look for timeline information
      const timelineInfo = page.locator('text=/timeline|duration|time|week|month|project.*length/i');
      if (await timelineInfo.count() > 0) {
        await expect(timelineInfo.first()).toBeVisible();
        
        // Should provide realistic timeframes
        const timelineText = await timelineInfo.first().textContent();
        expect(timelineText).toMatch(/week|month|day|timeline|duration/i);
      }
    });
  });

  test.describe('Collaboration Inquiry Workflow', () => {
    
    test('should handle collaboration project inquiry', async ({ page }) => {
      // Look for collaboration inquiry button
      const inquiryButton = page.getByRole('button', { name: /start.*collaboration|inquir|contact|project|work.*together/i }).or(
        page.getByRole('link', { name: /start.*collaboration|inquir|contact|project|work.*together/i })
      ).first();
      
      if (await inquiryButton.isVisible()) {
        await inquiryButton.click();
        await page.waitForTimeout(1000);
        
        // Fill out collaboration form
        const nameField = page.getByLabel(/name/i).or(page.locator('input[name*="name"]')).first();
        const emailField = page.getByLabel(/email/i).or(page.locator('input[name*="email"]')).first();
        
        if (await nameField.isVisible() && await emailField.isVisible()) {
          await nameField.fill('Creative Artist');
          await emailField.fill('artist@creative.com');
          
          // Project type selection
          const projectTypeSelect = page.locator('select:has(option:text-matches("recording|songwriting|arrangement", "i"))');
          if (await projectTypeSelect.isVisible()) {
            await projectTypeSelect.selectOption({ label: /recording|songwriting|arrangement/i });
          }
          
          // Project description
          const projectDescription = page.getByLabel(/project|description|detail|idea/i).or(page.locator('textarea')).first();
          if (await projectDescription.isVisible()) {
            await projectDescription.fill('I am working on a blues-rock album and would love to collaborate on guitar arrangements and recording. The project has 8 songs and I am looking for someone who understands authentic blues expression.');
          }
          
          // Timeline/deadline
          const timelineField = page.getByLabel(/timeline|deadline|when/i).or(page.locator('input[name*="timeline"]')).first();
          if (await timelineField.isVisible()) {
            await timelineField.fill('3-4 months');
          }
          
          // Budget range (if present)
          const budgetField = page.getByLabel(/budget|investment|cost/i);
          if (await budgetField.count() > 0) {
            if ((await budgetField.first().tagName()) === 'SELECT') {
              await budgetField.first().selectOption({ index: 1 });
            } else {
              await budgetField.first().fill('$2000-5000');
            }
          }
          
          // Submit form
          const submitButton = page.getByRole('button', { name: /submit|send|start|begin/i });
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(2000);
            
            // Check for success confirmation
            const successMessage = page.locator('text=/success|thank|received|contact.*soon/i');
            if (await successMessage.count() > 0) {
              await expect(successMessage.first()).toBeVisible();
            }
          }
        }
      }
    });

    test('should validate collaboration form fields', async ({ page }) => {
      const inquiryButton = page.getByRole('button', { name: /start.*collaboration|inquir|contact/i }).first();
      
      if (await inquiryButton.isVisible()) {
        await inquiryButton.click();
        await page.waitForTimeout(1000);
        
        // Try to submit empty form
        const submitButton = page.getByRole('button', { name: /submit|send|start/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Should show validation errors
          const errorMessages = page.locator('text=/required|invalid|error|field.*required/i, [aria-live="polite"]');
          if (await errorMessages.count() > 0) {
            await expect(errorMessages.first()).toBeVisible();
          }
        }
      }
    });

    test('should provide project consultation option', async ({ page }) => {
      // Look for consultation or initial meeting option
      const consultationOption = page.locator('text=/consultation|meeting|discuss|call|chat/i');
      if (await consultationOption.count() > 0) {
        await expect(consultationOption.first()).toBeVisible();
      }
      
      // Look for scheduling or contact methods
      const contactMethods = page.locator('text=/phone|email|video.*call|zoom|meeting/i');
      if (await contactMethods.count() > 0) {
        await expect(contactMethods.first()).toBeVisible();
      }
    });
  });

  test.describe('Portfolio and Past Work Showcase', () => {
    
    test('should display collaboration portfolio items', async ({ page }) => {
      // Look for portfolio items with media
      const portfolioItems = page.locator('[class*="portfolio"] img, [data-portfolio] img');
      if (await portfolioItems.count() > 0) {
        const firstItem = portfolioItems.first();
        await expect(firstItem).toBeVisible();
        
        // Should have proper alt text
        const altText = await firstItem.getAttribute('alt');
        expect(altText).not.toBeNull();
        expect(altText?.length).toBeGreaterThan(0);
      }
    });

    test('should handle portfolio item interactions', async ({ page }) => {
      // Look for clickable portfolio items
      const clickableItems = page.locator('[class*="portfolio"] [role="button"], [data-portfolio] [role="button"]');
      if (await clickableItems.count() > 0) {
        await clickableItems.first().click();
        await page.waitForTimeout(1000);
        
        // Should open modal or detail view
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
        if (await modal.count() > 0) {
          await expect(modal.first()).toBeVisible();
          
          // Should have project details
          const projectDetails = modal.locator('text=/project|collaboration|role|technique/i');
          if (await projectDetails.count() > 0) {
            await expect(projectDetails.first()).toBeVisible();
          }
          
          // Close modal
          const closeButton = page.getByRole('button', { name: /close|×/i });
          if (await closeButton.isVisible()) {
            await closeButton.click();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      }
    });

    test('should showcase different collaboration types', async ({ page }) => {
      // Look for different types of collaborations
      const collaborationTypes = page.locator('text=/recording|songwriting|arrangement|production|mixing|session/i');
      const typeCount = await collaborationTypes.count();
      expect(typeCount).toBeGreaterThan(0);
      
      // Should display variety
      const uniqueTypes = new Set();
      for (let i = 0; i < Math.min(typeCount, 5); i++) {
        const typeText = await collaborationTypes.nth(i).textContent();
        uniqueTypes.add(typeText?.toLowerCase());
      }
      expect(uniqueTypes.size).toBeGreaterThan(1);
    });
  });

  test.describe('Creative Process Communication', () => {
    
    test('should explain creative approach', async ({ page }) => {
      // Look for creative approach description
      const creativeApproach = page.locator('text=/approach|philosophy|style|creative.*process|method/i');
      if (await creativeApproach.count() > 0) {
        await expect(creativeApproach.first()).toBeVisible();
        
        // Should provide meaningful description
        const approachText = await creativeApproach.first().textContent();
        expect(approachText?.length).toBeGreaterThan(20);
      }
    });

    test('should highlight collaboration philosophy', async ({ page }) => {
      // Look for collaboration values or philosophy
      const philosophy = page.locator('text=/believe|philosophy|value|principle|collaborative/i');
      if (await philosophy.count() > 0) {
        await expect(philosophy.first()).toBeVisible();
      }
      
      // Should emphasize partnership approach
      const partnershipTerms = page.locator('text=/partner|together|mutual|shared|collective/i');
      if (await partnershipTerms.count() > 0) {
        await expect(partnershipTerms.first()).toBeVisible();
      }
    });

    test('should address common collaboration concerns', async ({ page }) => {
      // Look for FAQ or common concerns
      const faqSection = page.locator('section:has-text("FAQ"), section:has-text("Question"), text=/question|concern|worry/i');
      if (await faqSection.count() > 0) {
        await expect(faqSection.first()).toBeVisible();
      }
      
      // Look for trust/credibility indicators
      const credibility = page.locator('text=/experience|professional|qualified|testimonial/i');
      if (await credibility.count() > 0) {
        await expect(credibility.first()).toBeVisible();
      }
    });
  });

  test.describe('Cross-Service Integration', () => {
    
    test('should connect to teaching and performance services', async ({ page }) => {
      // Should mention other services as part of overall offering
      const teachingMention = page.locator('text=/also.*teach|lesson.*available|guitar.*instruction/i');
      if (await teachingMention.count() > 0) {
        await expect(teachingMention.first()).toBeVisible();
      }
      
      const performanceMention = page.locator('text=/also.*perform|live.*music|performance.*service/i');
      if (await performanceMention.count() > 0) {
        await expect(performanceMention.first()).toBeVisible();
      }
    });

    test('should navigate to other services from collaboration page', async ({ page }) => {
      // Navigate to teaching
      const teachingLink = page.getByRole('link', { name: /lesson|teaching|guitar.*lesson|learn/i });
      if (await teachingLink.count() > 0) {
        await teachingLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*teaching.*/);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
      
      // Navigate to performance
      const performanceLink = page.getByRole('link', { name: /performance|live.*music|entertainment|booking/i });
      if (await performanceLink.count() > 0) {
        await performanceLink.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveURL(/.*performance.*/);
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should suggest combined service packages', async ({ page }) => {
      // Look for combined offerings
      const combinedServices = page.locator('text=/package|combination|also.*offer|complete.*solution/i');
      if (await combinedServices.count() > 0) {
        await expect(combinedServices.first()).toBeVisible();
      }
    });
  });

  test.describe('Mobile Collaboration Experience', () => {
    
    test('should optimize collaboration portfolio for mobile', async ({ page, isMobile }) => {
      if (isMobile) {
        // Portfolio should be mobile-friendly
        const portfolioItems = page.locator('[class*="portfolio"], [data-portfolio]');
        if (await portfolioItems.count() > 0) {
          const firstItem = portfolioItems.first();
          await expect(firstItem).toBeVisible();
          
          // Check responsive layout
          const boundingBox = await firstItem.boundingBox();
          if (boundingBox) {
            const viewport = page.viewportSize();
            expect(boundingBox.width).toBeLessThanOrEqual((viewport?.width || 375) + 20);
          }
        }
      }
    });

    test('should handle touch interactions for portfolio browsing', async ({ page, isMobile }) => {
      if (isMobile) {
        const portfolioItems = page.locator('[class*="portfolio"] img, [data-portfolio] img');
        if (await portfolioItems.count() > 0) {
          // Test touch interaction
          await portfolioItems.first().tap();
          await page.waitForTimeout(1000);
          
          // Should respond to touch
          const modal = page.locator('[role="dialog"], .modal');
          if (await modal.count() > 0) {
            await expect(modal.first()).toBeVisible();
            
            // Close with touch
            await page.touchscreen.tap(50, 50); // Tap outside modal
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('should provide mobile-optimized contact methods', async ({ page, isMobile }) => {
      if (isMobile) {
        // Look for mobile-friendly contact options
        const phoneLink = page.getByRole('link', { name: /call|phone/i });
        if (await phoneLink.count() > 0) {
          const href = await phoneLink.first().getAttribute('href');
          expect(href).toMatch(/^tel:/);
        }
        
        const emailLink = page.getByRole('link', { name: /email/i });
        if (await emailLink.count() > 0) {
          const href = await emailLink.first().getAttribute('href');
          expect(href).toMatch(/^mailto:/);
        }
      }
    });
  });

  test.describe('Professional Presentation', () => {
    
    test('should maintain professional tone and presentation', async ({ page }) => {
      // Check for professional language
      const professionalTerms = page.locator('text=/professional|experience|expertise|qualified|skilled/i');
      const termCount = await professionalTerms.count();
      expect(termCount).toBeGreaterThan(0);
      
      // Should avoid overly casual language in professional sections
      const content = await page.locator('body').textContent();
      expect(content).not.toMatch(/\b(hey|yo|dude|awesome|cool)\b/i);
    });

    test('should showcase credentials and experience', async ({ page }) => {
      // Look for experience indicators
      const experienceIndicators = page.locator('text=/year|experience|project|client|professional/i');
      const experienceCount = await experienceIndicators.count();
      expect(experienceCount).toBeGreaterThan(0);
      
      // Should have specific achievements
      const achievements = page.locator('text=/album|recording|artist|musician|collaboration/i');
      if (await achievements.count() > 0) {
        await expect(achievements.first()).toBeVisible();
      }
    });

    test('should provide clear next steps for potential collaborators', async ({ page }) => {
      // Should have clear call-to-action
      const ctaButtons = page.getByRole('button', { name: /start|begin|contact|work.*together|get.*started/i });
      const ctaButtonCount = await ctaButtons.count();
      expect(ctaButtonCount).toBeGreaterThan(0);
      
      // Should explain what happens after contact
      const nextSteps = page.locator('text=/next.*step|what.*happen|process|timeline|expect/i');
      if (await nextSteps.count() > 0) {
        await expect(nextSteps.first()).toBeVisible();
      }
    });
  });

  test.describe('SEO and Discoverability', () => {
    
    test('should have collaboration-specific structured data', async ({ page }) => {
      const structuredData = page.locator('script[type="application/ld+json"]');
      if (await structuredData.count() > 0) {
        const jsonContent = await structuredData.first().textContent();
        const jsonData = JSON.parse(jsonContent || '{}');
        
        expect(jsonData['@context']).toBe('https://schema.org');
        expect(jsonData['@type']).toMatch(/Service|CreativeWork|ProfessionalService/);
        
        // Should include collaboration-specific keywords
        const dataString = JSON.stringify(jsonData).toLowerCase();
        expect(dataString).toMatch(/collaboration|creative|music|project/);
      }
    });

    test('should target collaboration-related keywords', async ({ page }) => {
      // Check meta keywords or content for collaboration terms
      const pageContent = await page.locator('body').textContent();
      const collaborationKeywords = [
        'collaboration',
        'creative project',
        'music collaboration',
        'recording partnership',
        'songwriting',
        'arrangement'
      ];
      
      const foundKeywords = collaborationKeywords.filter(keyword => 
        pageContent?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(foundKeywords.length).toBeGreaterThan(2);
    });
  });
});