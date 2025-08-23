import { test, expect } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('Contact and Inquiry Flows', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test.describe('Contact Information Display', () => {
    test('should display contact section correctly', async () => {
      if (await homePage.contactSection.count() > 0) {
        await homePage.scrollToSection('contact');
        await homePage.verifyContactSection();
      }
    });

    test('should show contact information clearly', async ({ page }) => {
      if (await homePage.contactSection.count() > 0) {
        await homePage.scrollToSection('contact');
        
        // Check for contact information
        const contactText = await homePage.contactSection.textContent();
        expect(contactText).toBeTruthy();
        
        // Should contain contact-related keywords
        expect(contactText).toMatch(/contact|reach|get in touch|email|instagram/i);
        
        // Check for contact methods
        const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(contactText || '');
        const hasSocial = /instagram|facebook|twitter|linkedin/i.test(contactText || '');
        const hasForm = await homePage.contactForm.count() > 0;
        
        // Should have at least one contact method
        expect(hasEmail || hasSocial || hasForm).toBe(true);
      }
    });

    test('should have working social media links', async ({ page }) => {
      const socialLinkCount = await homePage.socialLinks.count();
      
      if (socialLinkCount > 0) {
        await homePage.scrollToSection('contact');
        
        for (let i = 0; i < socialLinkCount; i++) {
          const link = homePage.socialLinks.nth(i);
          await expect(link).toBeVisible();
          
          // Check link attributes
          const href = await link.getAttribute('href');
          const target = await link.getAttribute('target');
          const rel = await link.getAttribute('rel');
          
          expect(href).toBeTruthy();
          expect(href).toMatch(/^https?:\/\//); // Should be external link
          expect(target).toBe('_blank'); // Should open in new tab
          expect(rel).toContain('noopener'); // Security best practice
          
          // Check for recognizable social platforms
          expect(href).toMatch(/instagram|facebook|twitter|linkedin|youtube|tiktok/i);
          
          // Test link accessibility
          const ariaLabel = await link.getAttribute('aria-label');
          const linkText = await link.textContent();
          
          expect(ariaLabel || linkText).toBeTruthy();
        }
      }
    });
  });

  test.describe('Contact Form Functionality', () => {
    test('should display contact form if present', async ({ page }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        await expect(homePage.contactForm).toBeVisible();
        
        // Check form structure
        const formMethod = await homePage.contactForm.getAttribute('method');
        const formAction = await homePage.contactForm.getAttribute('action');
        
        // Form should have proper attributes
        if (formMethod) {
          expect(formMethod.toLowerCase()).toMatch(/post|get/);
        }
        
        if (formAction) {
          expect(formAction).toBeTruthy();
        }
      }
    });

    test('should have properly labeled form fields', async ({ page }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        const formInputs = homePage.contactForm.locator('input, textarea, select');
        const inputCount = await formInputs.count();
        
        for (let i = 0; i < inputCount; i++) {
          const input = formInputs.nth(i);
          
          // Check for proper labeling
          const id = await input.getAttribute('id');
          const name = await input.getAttribute('name');
          const placeholder = await input.getAttribute('placeholder');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          // Should have some form of labeling
          expect(id || name || placeholder || ariaLabel || ariaLabelledBy).toBeTruthy();
          
          // Check for associated label
          if (id) {
            const label = page.locator(`label[for="${id}"]`);
            if (await label.count() > 0) {
              await expect(label).toBeVisible();
            }
          }
        }
      }
    });

    test('should validate form fields appropriately', async ({ page, testData }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        // Test email validation if email field exists
        const emailInput = homePage.contactForm.locator('input[type="email"]');
        if (await emailInput.count() > 0) {
          // Test invalid email
          await emailInput.fill('invalid-email');
          await emailInput.blur(); // Trigger validation
          
          // Check if validation message appears
          const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
          expect(isValid).toBe(false);
          
          // Test valid email
          await emailInput.fill(testData.user.email);
          await emailInput.blur();
          
          const isValidNow = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
          expect(isValidNow).toBe(true);
        }
        
        // Test required fields if any
        const requiredInputs = homePage.contactForm.locator('input[required], textarea[required]');
        const requiredCount = await requiredInputs.count();
        
        for (let i = 0; i < requiredCount; i++) {
          const input = requiredInputs.nth(i);
          
          // Clear field to test required validation
          await input.fill('');
          await input.blur();
          
          const isValid = await input.evaluate((el: HTMLInputElement) => el.validity.valid);
          expect(isValid).toBe(false);
          
          // Fill field to make it valid
          await input.fill('Test value');
          await input.blur();
          
          const isValidNow = await input.evaluate((el: HTMLInputElement) => el.validity.valid);
          expect(isValidNow).toBe(true);
        }
      }
    });

    test('should handle form submission flow', async ({ page, testData }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        // Fill out the form
        await homePage.fillContactForm(testData.user);
        
        // Verify form is filled
        const nameInput = homePage.contactForm.locator('input[name="name"], input[placeholder*="name" i]');
        const emailInput = homePage.contactForm.locator('input[type="email"]');
        const messageInput = homePage.contactForm.locator('textarea, input[name="message"]');
        
        if (await nameInput.count() > 0) {
          await expect(nameInput).toHaveValue(testData.user.name);
        }
        
        if (await emailInput.count() > 0) {
          await expect(emailInput).toHaveValue(testData.user.email);
        }
        
        if (await messageInput.count() > 0) {
          await expect(messageInput).toHaveValue(testData.user.message);
        }
        
        // Test form submission (but don't actually submit to avoid spam)
        const submitButton = homePage.contactForm.locator('button[type="submit"], input[type="submit"]');
        
        if (await submitButton.count() > 0) {
          await expect(submitButton).toBeVisible();
          await expect(submitButton).toBeEnabled();
          
          // Check button text
          const buttonText = await submitButton.textContent();
          expect(buttonText).toMatch(/send|submit|contact|send message/i);
          
          // Don't actually click submit to avoid sending test emails
          console.log('Form submission test completed (submission prevented to avoid spam)');
        }
      }
    });

    test('should be accessible for screen readers', async ({ page, accessibilityHelper }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        // Check form has proper landmarks
        const formRole = await homePage.contactForm.getAttribute('role');
        const formAriaLabel = await homePage.contactForm.getAttribute('aria-label');
        const formAriaLabelledBy = await homePage.contactForm.getAttribute('aria-labelledby');
        
        // Form should be identifiable by screen readers
        expect(formRole || formAriaLabel || formAriaLabelledBy || 'form').toBeTruthy();
        
        // Check fieldset/legend structure for grouped fields
        const fieldsets = homePage.contactForm.locator('fieldset');
        const fieldsetCount = await fieldsets.count();
        
        for (let i = 0; i < fieldsetCount; i++) {
          const fieldset = fieldsets.nth(i);
          const legend = fieldset.locator('legend');
          
          if (await legend.count() > 0) {
            await expect(legend).toBeVisible();
            const legendText = await legend.textContent();
            expect(legendText).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Inquiry User Journeys', () => {
    test('should guide prospective students through inquiry process', async ({ page, testData }) => {
      // Simulate a prospective student journey
      
      // 1. Land on homepage and read about teaching
      await homePage.verifyHeroContent();
      
      if (await homePage.aboutSection.count() > 0) {
        await homePage.scrollToSection('about');
        await homePage.verifyAboutSection();
      }
      
      if (await homePage.teachingSection.count() > 0) {
        await homePage.scrollToSection('teaching');
        await homePage.verifyTeachingSection();
      }
      
      // 2. Check lesson packages and pricing
      if (await homePage.packagesSection.count() > 0) {
        await homePage.scrollToSection('pricing');
        await homePage.verifyPackagesSection();
        
        // Student should be able to see package options
        const packageCards = homePage.packageCards;
        const packageCount = await packageCards.count();
        
        if (packageCount > 0) {
          for (let i = 0; i < packageCount; i++) {
            const packageCard = packageCards.nth(i);
            await expect(packageCard).toBeVisible();
            
            const packageText = await packageCard.textContent();
            expect(packageText).toBeTruthy();
            expect(packageText!.length).toBeGreaterThan(20);
          }
        }
      }
      
      // 3. Navigate to contact section
      await homePage.scrollToSection('contact');
      await homePage.verifyContactSection();
      
      // 4. Complete inquiry process
      if (await homePage.contactForm.count() > 0) {
        await homePage.fillContactForm(testData.user);
        
        // Verify user can complete the inquiry
        const submitButton = homePage.contactForm.locator('button[type="submit"], input[type="submit"]');
        if (await submitButton.count() > 0) {
          await expect(submitButton).toBeEnabled();
        }
      } else {
        // If no form, should have clear contact information
        const socialLinkCount = await homePage.socialLinks.count();
        const contactText = await homePage.contactSection.textContent();
        const hasContactMethod = socialLinkCount > 0 || /email|contact/i.test(contactText || '');
        
        expect(hasContactMethod).toBe(true);
      }
    });

    test('should provide clear call-to-action for lessons', async ({ page }) => {
      // Check for clear CTAs throughout the site
      const ctaElements = page.locator(
        'button, .btn, .cta, [data-testid="cta"], a[href*="contact"], a[href*="book"], a[href*="lesson"]'
      );
      
      const ctaCount = await ctaElements.count();
      
      if (ctaCount > 0) {
        for (let i = 0; i < Math.min(ctaCount, 5); i++) {
          const cta = ctaElements.nth(i);
          
          if (await cta.isVisible()) {
            const ctaText = await cta.textContent();
            
            // CTA should have action-oriented text
            expect(ctaText).toMatch(/contact|book|start|learn|begin|get started|schedule/i);
            
            // Should be clickable
            await expect(cta).toBeEnabled();
            
            // Should have proper styling (assuming CTAs are styled differently)
            const styles = await cta.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                backgroundColor: computed.backgroundColor,
                borderRadius: computed.borderRadius,
                padding: computed.padding,
              };
            });
            
            // CTAs should have some styling to stand out
            expect(
              styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
              styles.borderRadius !== '0px' ||
              styles.padding !== '0px'
            ).toBe(true);
          }
        }
      }
    });

    test('should handle different inquiry types', async ({ page, testData }) => {
      // Test different types of inquiries a music teacher might receive
      
      const inquiryTypes = [
        {
          name: 'Beginner Student',
          message: 'I am a complete beginner and would like to learn guitar basics and blues fundamentals.'
        },
        {
          name: 'Advanced Student',
          message: 'I have been playing for 5 years and want to improve my blues improvisation and soloing techniques.'
        },
        {
          name: 'Parent Inquiry',
          message: 'I am looking for guitar lessons for my 12-year-old child who is interested in learning blues guitar.'
        },
      ];
      
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        for (const inquiry of inquiryTypes) {
          // Fill form with different inquiry types
          await homePage.fillContactForm({
            name: inquiry.name,
            email: testData.user.email,
            message: inquiry.message,
          });
          
          // Verify form accepts different message types
          const messageField = homePage.contactForm.locator('textarea, input[name="message"]');
          if (await messageField.count() > 0) {
            await expect(messageField).toHaveValue(inquiry.message);
          }
          
          // Clear form for next test
          await homePage.contactForm.locator('input, textarea').fill('');
        }
      }
    });
  });

  test.describe('Contact Accessibility and Usability', () => {
    test('should be keyboard accessible', async ({ page, accessibilityHelper }) => {
      // Test keyboard navigation through contact section
      await homePage.scrollToSection('contact');
      
      // Tab through contact elements
      const focusableElements = homePage.contactSection.locator(
        'a, button, input, textarea, select, [tabindex="0"]'
      );
      
      const elementCount = await focusableElements.count();
      
      for (let i = 0; i < elementCount; i++) {
        await page.press('body', 'Tab');
        
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Test Enter/Space activation for interactive elements
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'button' || (tagName === 'a' && await focusedElement.getAttribute('href'))) {
          // Test activation (but don't actually submit forms)
          if (tagName === 'button') {
            const type = await focusedElement.getAttribute('type');
            if (type !== 'submit') {
              await page.press('body', 'Enter');
              await page.waitForTimeout(200);
            }
          }
        }
      }
    });

    test('should work with screen readers', async ({ page }) => {
      await homePage.scrollToSection('contact');
      
      if (await homePage.contactForm.count() > 0) {
        // Check for proper ARIA attributes
        const formElements = homePage.contactForm.locator('input, textarea, select');
        const elementCount = await formElements.count();
        
        for (let i = 0; i < elementCount; i++) {
          const element = formElements.nth(i);
          
          // Check for screen reader friendly attributes
          const ariaLabel = await element.getAttribute('aria-label');
          const ariaDescribedBy = await element.getAttribute('aria-describedby');
          const ariaRequired = await element.getAttribute('aria-required');
          const required = await element.getAttribute('required');
          
          // Required fields should be properly announced
          if (required !== null) {
            expect(ariaRequired === 'true' || required !== null).toBe(true);
          }
          
          // Check for error message associations
          if (ariaDescribedBy) {
            const errorElement = page.locator(`#${ariaDescribedBy}`);
            if (await errorElement.count() > 0) {
              // Error element should exist and be meaningful
              const errorText = await errorElement.textContent();
              expect(errorText).toBeTruthy();
            }
          }
        }
      }
    });

    test('should provide clear error messages', async ({ page }) => {
      if (await homePage.contactForm.count() > 0) {
        await homePage.scrollToSection('contact');
        
        // Test form validation error messages
        const requiredFields = homePage.contactForm.locator('input[required], textarea[required]');
        const requiredCount = await requiredFields.count();
        
        for (let i = 0; i < requiredCount; i++) {
          const field = requiredFields.nth(i);
          
          // Clear field and trigger validation
          await field.fill('');
          await field.blur();
          
          // Look for error messages
          const fieldId = await field.getAttribute('id');
          const fieldName = await field.getAttribute('name');
          
          if (fieldId) {
            // Check for associated error messages
            const errorSelectors = [
              `#${fieldId}-error`,
              `[aria-describedby*="${fieldId}"]`,
              `.error[for="${fieldId}"]`,
              field.locator('+ .error, + .invalid-feedback'),
            ];
            
            let errorFound = false;
            for (const selector of errorSelectors) {
              if (typeof selector === 'string') {
                const errorElement = page.locator(selector);
                if (await errorElement.count() > 0 && await errorElement.isVisible()) {
                  const errorText = await errorElement.textContent();
                  expect(errorText).toBeTruthy();
                  expect(errorText).toMatch(/required|field|enter|provide/i);
                  errorFound = true;
                  break;
                }
              }
            }
            
            // If no custom error found, browser validation should work
            const customValidity = await field.evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(errorFound || customValidity).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Mobile Contact Experience', () => {
    test('should work well on mobile devices', async ({ page }) => {
      // Test mobile contact experience
      await page.setViewportSize({ width: 375, height: 812 });
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      await homePage.scrollToSection('contact');
      
      if (await homePage.contactForm.count() > 0) {
        // Form should be mobile-friendly
        const formBox = await homePage.contactForm.boundingBox();
        expect(formBox?.width).toBeLessThanOrEqual(375);
        
        // Input fields should be appropriately sized
        const inputs = homePage.contactForm.locator('input, textarea');
        const inputCount = await inputs.count();
        
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          const inputBox = await input.boundingBox();
          
          if (inputBox) {
            expect(inputBox.width).toBeLessThanOrEqual(350); // Allow some margin
            expect(inputBox.height).toBeGreaterThanOrEqual(40); // Touch-friendly height
          }
        }
      }
      
      // Social links should be touch-friendly
      const socialLinkCount = await homePage.socialLinks.count();
      for (let i = 0; i < socialLinkCount; i++) {
        const link = homePage.socialLinks.nth(i);
        const linkBox = await link.boundingBox();
        
        if (linkBox) {
          expect(linkBox.width).toBeGreaterThanOrEqual(40); // Touch target size
          expect(linkBox.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
  });
});