import { test, expect } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('Lesson Packages and Pricing', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test.describe('Teaching Approach Presentation', () => {
    test('should clearly present teaching methodology', async ({ page }) => {
      if (await homePage.teachingSection.count() > 0) {
        await homePage.scrollToSection('teaching');
        await homePage.verifyTeachingSection();
        
        const teachingContent = await homePage.teachingSection.textContent();
        expect(teachingContent).toBeTruthy();
        
        // Should contain music education keywords
        expect(teachingContent).toMatch(/blues|guitar|improvisation|teaching|learn|technique|music/i);
        
        // Should be substantial content
        expect(teachingContent!.length).toBeGreaterThan(100);
      }
    });

    test('should highlight unique teaching features', async ({ page }) => {
      if (await homePage.teachingSection.count() > 0) {
        await homePage.scrollToSection('teaching');
        
        // Look for feature highlights
        const featureElements = homePage.teachingSection.locator(
          '.feature, .highlight, .benefit, ul li, ol li, .card, .item'
        );
        
        const featureCount = await featureElements.count();
        
        if (featureCount > 0) {
          for (let i = 0; i < Math.min(featureCount, 5); i++) {
            const feature = featureElements.nth(i);
            
            if (await feature.isVisible()) {
              const featureText = await feature.textContent();
              expect(featureText).toBeTruthy();
              expect(featureText!.trim().length).toBeGreaterThan(10);
              
              // Features should be music/teaching related
              expect(featureText).toMatch(/guitar|blues|improvisation|technique|lesson|learn|music|practice|chord|scale/i);
            }
          }
        }
      }
    });

    test('should demonstrate expertise and credibility', async ({ page }) => {
      // Check for credentials, experience, or testimonials
      const credibilityIndicators = page.locator(
        '.credential, .experience, .testimonial, .quote, .review, .endorsement'
      );
      
      const indicatorCount = await credibilityIndicators.count();
      
      if (indicatorCount > 0) {
        for (let i = 0; i < indicatorCount; i++) {
          const indicator = credibilityIndicators.nth(i);
          
          if (await indicator.isVisible()) {
            const indicatorText = await indicator.textContent();
            expect(indicatorText).toBeTruthy();
            expect(indicatorText!.length).toBeGreaterThan(20);
          }
        }
      }
      
      // Check about section for experience/background
      if (await homePage.aboutSection.count() > 0) {
        const aboutContent = await homePage.aboutSection.textContent();
        
        // Should mention experience, background, or qualifications
        expect(aboutContent).toMatch(/experience|teach|instructor|musician|year|guitar|blues/i);
      }
    });
  });

  test.describe('Lesson Package Display', () => {
    test('should display lesson packages clearly', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        await homePage.verifyPackagesSection();
        
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        if (packageCount > 0) {
          console.log(`Found ${packageCount} lesson packages`);
          
          for (let i = 0; i < packageCount; i++) {
            const packageCard = packageCards.nth(i);
            await expect(packageCard).toBeVisible();
            
            const packageText = await packageCard.textContent();
            expect(packageText).toBeTruthy();
            
            // Each package should have meaningful content
            expect(packageText!.length).toBeGreaterThan(30);
            
            // Should contain lesson-related content
            expect(packageText).toMatch(/lesson|hour|session|minute|class|instruction/i);
          }
        }
      }
    });

    test('should show pricing information if available', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        // Look for pricing information
        const priceElements = homePage.packagesSection.locator(
          '.price, .cost, [data-testid="price"], .pricing, .rate'
        );
        
        const priceCount = await priceElements.count();
        
        if (priceCount > 0) {
          console.log(`Found ${priceCount} pricing elements`);
          
          for (let i = 0; i < priceCount; i++) {
            const priceElement = priceElements.nth(i);
            
            if (await priceElement.isVisible()) {
              const priceText = await priceElement.textContent();
              expect(priceText).toBeTruthy();
              
              // Should contain currency or pricing indicators
              expect(priceText).toMatch(/\$|\£|\€|dollar|pound|euro|price|rate|cost|fee|per|hour|lesson|session/i);
            }
          }
        } else {
          // If no explicit pricing, should have contact information for pricing
          const packageText = await homePage.packagesSection.textContent();
          expect(packageText).toMatch(/contact|inquire|ask|discuss|custom|quote/i);
        }
      }
    });

    test('should organize packages logically', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        if (packageCount > 1) {
          // Check if packages are organized in a logical order
          const packageTitles: string[] = [];
          
          for (let i = 0; i < packageCount; i++) {
            const packageCard = packageCards.nth(i);
            const titleElement = packageCard.locator('h3, h4, .title, .name').first();
            
            if (await titleElement.count() > 0) {
              const title = await titleElement.textContent();
              if (title) {
                packageTitles.push(title.trim());
              }
            }
          }
          
          console.log('Package titles:', packageTitles);
          
          // Should have distinct package names
          const uniqueTitles = new Set(packageTitles);
          expect(uniqueTitles.size).toBe(packageTitles.length);
          
          // Packages should have descriptive names
          packageTitles.forEach(title => {
            expect(title.length).toBeGreaterThan(3);
            expect(title).toMatch(/lesson|package|individual|group|beginner|advanced|online|person|hour|session/i);
          });
        }
      }
    });

    test('should highlight package benefits', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        for (let i = 0; i < packageCount; i++) {
          const packageCard = packageCards.nth(i);
          
          // Look for benefit lists or features
          const benefits = packageCard.locator('ul li, ol li, .benefit, .feature, .include');
          const benefitCount = await benefits.count();
          
          if (benefitCount > 0) {
            for (let j = 0; j < Math.min(benefitCount, 5); j++) {
              const benefit = benefits.nth(j);
              
              if (await benefit.isVisible()) {
                const benefitText = await benefit.textContent();
                expect(benefitText).toBeTruthy();
                expect(benefitText!.trim().length).toBeGreaterThan(10);
                
                // Benefits should be lesson-related
                expect(benefitText).toMatch(/lesson|learn|practice|technique|feedback|support|material|progress/i);
              }
            }
          }
        }
      }
    });
  });

  test.describe('Package Comparison and Selection', () => {
    test('should help students compare packages', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        if (packageCount > 1) {
          // Packages should be visually comparable
          const packagePositions: { x: number; y: number; width: number; height: number }[] = [];
          
          for (let i = 0; i < packageCount; i++) {
            const packageCard = packageCards.nth(i);
            const box = await packageCard.boundingBox();
            
            if (box) {
              packagePositions.push(box);
            }
          }
          
          if (packagePositions.length > 1) {
            // Check if packages are arranged in a grid or row
            const firstPackage = packagePositions[0];
            const secondPackage = packagePositions[1];
            
            // Should be either side-by-side (horizontal) or stacked (vertical)
            const isHorizontal = Math.abs(firstPackage.y - secondPackage.y) < 50;
            const isVertical = Math.abs(firstPackage.x - secondPackage.x) < 50;
            
            expect(isHorizontal || isVertical).toBe(true);
            
            // Packages should be similar in size for easy comparison
            const sizeDifference = Math.abs(firstPackage.height - secondPackage.height);
            expect(sizeDifference).toBeLessThan(200);
          }
        }
      }
    });

    test('should have clear call-to-action for each package', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        for (let i = 0; i < packageCount; i++) {
          const packageCard = packageCards.nth(i);
          
          // Look for CTA buttons or links within package
          const ctaElements = packageCard.locator(
            'button, .btn, .cta, a[href*="contact"], a[href*="book"], [data-testid="cta"]'
          );
          
          const ctaCount = await ctaElements.count();
          
          if (ctaCount > 0) {
            const cta = ctaElements.first();
            await expect(cta).toBeVisible();
            
            const ctaText = await cta.textContent();
            expect(ctaText).toMatch(/contact|book|choose|select|start|get started|inquire|learn more/i);
            
            // CTA should be clickable
            await expect(cta).toBeEnabled();
          } else {
            // If no specific CTA, package should guide user to contact section
            const packageText = await packageCard.textContent();
            expect(packageText).toMatch(/contact|book|inquire|call|email|message/i);
          }
        }
      }
    });

    test('should provide package recommendation guidance', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        // Look for guidance on choosing packages
        const guidanceElements = homePage.packagesSection.locator(
          '.recommendation, .guide, .choose, .which, .best, .popular, .recommended'
        );
        
        const guidanceCount = await guidanceElements.count();
        
        if (guidanceCount > 0) {
          for (let i = 0; i < guidanceCount; i++) {
            const guidance = guidanceElements.nth(i);
            
            if (await guidance.isVisible()) {
              const guidanceText = await guidance.textContent();
              expect(guidanceText).toBeTruthy();
              expect(guidanceText!.length).toBeGreaterThan(20);
              
              // Should help with decision making
              expect(guidanceText).toMatch(/beginner|advanced|best|recommend|choose|perfect|ideal|suitable/i);
            }
          }
        }
        
        // Check for FAQ or help section
        const helpElements = page.locator('.faq, .help, .question, .answer');
        const helpCount = await helpElements.count();
        
        if (helpCount > 0) {
          console.log(`Found ${helpCount} help/FAQ elements`);
        }
      }
    });
  });

  test.describe('Lesson Information and Expectations', () => {
    test('should set clear expectations for lessons', async ({ page }) => {
      // Look for lesson format, duration, and structure information
      const expectationElements = page.locator(
        '.format, .duration, .structure, .expect, .include, .cover, .learn'
      );
      
      const expectationCount = await expectationElements.count();
      
      if (expectationCount > 0) {
        for (let i = 0; i < Math.min(expectationCount, 5); i++) {
          const element = expectationElements.nth(i);
          
          if (await element.isVisible()) {
            const elementText = await element.textContent();
            expect(elementText).toBeTruthy();
            
            // Should provide specific information about lessons
            expect(elementText).toMatch(/minute|hour|session|week|month|learn|cover|practice|technique|chord|scale|song/i);
          }
        }
      }
      
      // Check teaching or about section for lesson expectations
      if (await homePage.teachingSection.count() > 0) {
        const teachingText = await homePage.teachingSection.textContent();
        
        // Should mention what students will learn
        expect(teachingText).toMatch(/learn|technique|skill|chord|scale|improvisation|blues|guitar|progress/i);
      }
    });

    test('should explain lesson delivery methods', async ({ page }) => {
      // Look for information about online vs in-person lessons
      const deliveryInfo = page.locator(
        '.online, .person, .remote, .zoom, .skype, .video, .studio, .location'
      );
      
      const deliveryCount = await deliveryInfo.count();
      
      if (deliveryCount > 0) {
        for (let i = 0; i < deliveryCount; i++) {
          const element = deliveryInfo.nth(i);
          
          if (await element.isVisible()) {
            const elementText = await element.textContent();
            expect(elementText).toBeTruthy();
            
            // Should clarify lesson format
            expect(elementText).toMatch(/online|person|remote|video|zoom|skype|studio|home|location|visit/i);
          }
        }
      }
      
      // Check for scheduling information
      const scheduleInfo = page.locator(
        '.schedule, .time, .availability, .booking, .appointment, .flexible'
      );
      
      const scheduleCount = await scheduleInfo.count();
      
      if (scheduleCount > 0) {
        console.log(`Found ${scheduleCount} scheduling-related elements`);
      }
    });

    test('should address different skill levels', async ({ page }) => {
      // Check if content addresses different student levels
      const pageContent = await page.locator('body').textContent();
      
      // Should mention different skill levels
      const mentionsBeginner = /beginner|start|new|first|basic|fundamental|introduction/i.test(pageContent || '');
      const mentionsAdvanced = /advanced|experienced|intermediate|improve|develop|master|technique/i.test(pageContent || '');
      
      expect(mentionsBeginner || mentionsAdvanced).toBe(true);
      
      // Look for specific level-based content
      const levelElements = page.locator(
        '.beginner, .advanced, .intermediate, .level, .skill'
      );
      
      const levelCount = await levelElements.count();
      
      if (levelCount > 0) {
        for (let i = 0; i < levelCount; i++) {
          const element = levelElements.nth(i);
          
          if (await element.isVisible()) {
            const elementText = await element.textContent();
            expect(elementText).toMatch(/beginner|advanced|intermediate|level|skill|experience/i);
          }
        }
      }
    });

    test('should showcase teaching materials and resources', async ({ page }) => {
      // Look for mentions of teaching materials, resources, or curriculum
      const resourceElements = page.locator(
        '.material, .resource, .curriculum, .book, .sheet, .tab, .exercise, .practice'
      );
      
      const resourceCount = await resourceElements.count();
      
      if (resourceCount > 0) {
        for (let i = 0; i < resourceCount; i++) {
          const element = resourceElements.nth(i);
          
          if (await element.isVisible()) {
            const elementText = await element.textContent();
            expect(elementText).toBeTruthy();
            
            // Should mention learning materials
            expect(elementText).toMatch(/material|resource|book|sheet|tab|exercise|practice|curriculum|method/i);
          }
        }
      }
      
      // Check for any downloadable resources or samples
      const downloadLinks = page.locator('a[href$=".pdf"], a[href*="download"], .download');
      const downloadCount = await downloadLinks.count();
      
      if (downloadCount > 0) {
        console.log(`Found ${downloadCount} downloadable resources`);
        
        for (let i = 0; i < downloadCount; i++) {
          const link = downloadLinks.nth(i);
          const href = await link.getAttribute('href');
          
          expect(href).toBeTruthy();
          expect(href).toMatch(/\.(pdf|mp3|zip)|download/i);
        }
      }
    });
  });

  test.describe('Lesson Package Accessibility', () => {
    test('should be accessible to all users', async ({ page, accessibilityHelper }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        // Check heading hierarchy
        const headings = homePage.packagesSection.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        
        expect(headingCount).toBeGreaterThan(0);
        
        // Check for proper contrast
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        for (let i = 0; i < Math.min(packageCount, 3); i++) {
          const packageCard = packageCards.nth(i);
          
          const styles = await packageCard.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              borderColor: computed.borderColor,
            };
          });
          
          // Should have sufficient contrast between text and background
          expect(styles.color).not.toBe(styles.backgroundColor);
        }
        
        // Check for ARIA labels on interactive elements
        const interactiveElements = homePage.packagesSection.locator('button, a, [role="button"]');
        const interactiveCount = await interactiveElements.count();
        
        for (let i = 0; i < interactiveCount; i++) {
          const element = interactiveElements.nth(i);
          
          const ariaLabel = await element.getAttribute('aria-label');
          const title = await element.getAttribute('title');
          const textContent = await element.textContent();
          
          // Should have accessible name
          expect(ariaLabel || title || textContent?.trim()).toBeTruthy();
        }
      }
    });

    test('should work with keyboard navigation', async ({ page }) => {
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        // Tab through package section
        const focusableElements = homePage.packagesSection.locator(
          'a, button, input, [tabindex="0"], [role="button"]'
        );
        
        const elementCount = await focusableElements.count();
        
        for (let i = 0; i < elementCount; i++) {
          await page.press('body', 'Tab');
          
          const focusedElement = page.locator(':focus');
          
          if (await focusedElement.count() > 0) {
            await expect(focusedElement).toBeVisible();
            
            // Test Enter key activation
            const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
            
            if (tagName === 'button' || (tagName === 'a' && await focusedElement.getAttribute('href'))) {
              // Test that Enter key works (but don't actually navigate away)
              console.log(`Keyboard accessible element found: ${tagName}`);
            }
          }
        }
      }
    });
  });

  test.describe('Mobile Lesson Package Experience', () => {
    test('should display packages well on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        
        // Packages should stack vertically on mobile
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        if (packageCount > 1) {
          const positions: { y: number; height: number }[] = [];
          
          for (let i = 0; i < packageCount; i++) {
            const packageCard = packageCards.nth(i);
            const box = await packageCard.boundingBox();
            
            if (box) {
              positions.push({ y: box.y, height: box.height });
            }
          }
          
          // Packages should be stacked vertically with minimal overlap
          for (let i = 1; i < positions.length; i++) {
            const previousBottom = positions[i - 1].y + positions[i - 1].height;
            const currentTop = positions[i].y;
            
            expect(currentTop).toBeGreaterThanOrEqual(previousBottom - 50); // Allow 50px overlap
          }
        }
        
        // Each package should fit within mobile viewport width
        for (let i = 0; i < packageCount; i++) {
          const packageCard = packageCards.nth(i);
          const box = await packageCard.boundingBox();
          
          if (box) {
            expect(box.width).toBeLessThanOrEqual(375);
          }
        }
      }
    });
  });
});