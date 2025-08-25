import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Cross-Service Navigation
 * 
 * Tests navigation between services, consistent user experience,
 * and seamless transitions across the multi-service platform
 */

test.describe('Cross-Service Navigation E2E Tests', () => {

  test.describe('Inter-Service Navigation Flow', () => {
    
    test('should navigate seamlessly between all services', async ({ page }) => {
      // Start from homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to Teaching
      const teachingLink = page.getByRole('link', { name: /teaching|lesson|guitar.*lesson|learn/i }).first();
      if (await teachingLink.isVisible()) {
        await teachingLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*teaching.*/);
        
        // Verify teaching page loaded correctly
        const teachingHeading = page.getByRole('heading', { level: 1 });
        await expect(teachingHeading).toBeVisible();
        await expect(teachingHeading).toContainText(/lesson|teaching|guitar/i);
      }
      
      // Navigate to Performance from Teaching
      const performanceLink = page.getByRole('link', { name: /performance|live.*music|entertainment/i }).first();
      if (await performanceLink.isVisible()) {
        await performanceLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*performance.*/);
        
        // Verify performance page loaded correctly
        const performanceHeading = page.getByRole('heading', { level: 1 });
        await expect(performanceHeading).toBeVisible();
        await expect(performanceHeading).toContainText(/performance|live.*music|entertainment/i);
      }
      
      // Navigate to Collaboration from Performance
      const collaborationLink = page.getByRole('link', { name: /collaboration|creative|project/i }).first();
      if (await collaborationLink.isVisible()) {
        await collaborationLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*collaboration.*/);
        
        // Verify collaboration page loaded correctly
        const collaborationHeading = page.getByRole('heading', { level: 1 });
        await expect(collaborationHeading).toBeVisible();
        await expect(collaborationHeading).toContainText(/collaboration|creative|project/i);
      }
      
      // Navigate back to Homepage
      const homeLink = page.getByRole('link', { name: /home|rrish.*music/i }).first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/^\/$|.*\/$/);
      }
    });

    test('should maintain consistent navigation across all pages', async ({ page }) => {
      const pages = ['/', '/teaching', '/performance', '/collaboration'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Check for consistent navigation elements
        const navigation = page.locator('nav, [role="navigation"]').first();
        await expect(navigation).toBeVisible();
        
        // Should have links to all main services
        const navLinks = navigation.locator('a');
        const navTexts = [];
        const linkCount = await navLinks.count();
        
        for (let i = 0; i < linkCount; i++) {
          const linkText = await navLinks.nth(i).textContent();
          navTexts.push(linkText?.toLowerCase() || '');
        }
        
        const navString = navTexts.join(' ');
        
        // Should include main service links
        if (!pagePath.includes('teaching')) {
          expect(navString).toMatch(/lesson|teaching|learn/);
        }
        if (!pagePath.includes('performance')) {
          expect(navString).toMatch(/performance|live.*music/);
        }
        if (!pagePath.includes('collaboration')) {
          expect(navString).toMatch(/collaboration|creative|project/);
        }
      }
    });

    test('should handle browser back/forward navigation correctly', async ({ page }) => {
      // Navigate through services
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/teaching');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/performance');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/collaboration');
      await page.waitForLoadState('networkidle');
      
      // Test browser back navigation
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*performance.*/);
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*teaching.*/);
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/^\/$|.*\/$/);
      
      // Test browser forward navigation
      await page.goForward();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*teaching.*/);
    });
  });

  test.describe('Mobile Navigation Experience', () => {
    
    test('should handle mobile navigation menu across services', async ({ page, isMobile }) => {
      if (isMobile) {
        const services = ['/teaching', '/performance', '/collaboration'];
        
        for (const service of services) {
          await page.goto(service);
          await page.waitForLoadState('networkidle');
          
          // Look for mobile menu button
          const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="navigation"], .hamburger, .menu-toggle').first();
          
          if (await menuButton.isVisible()) {
            // Open mobile menu
            await menuButton.click();
            await page.waitForTimeout(500);
            
            // Menu should be visible
            const mobileMenu = page.locator('[role="menu"], .mobile-menu, .nav-menu').first();
            if (await mobileMenu.isVisible()) {
              await expect(mobileMenu).toBeVisible();
              
              // Should contain navigation links
              const menuLinks = mobileMenu.locator('a');
              const linkCount = await menuLinks.count();
              expect(linkCount).toBeGreaterThan(1);
              
              // Close menu by clicking elsewhere or close button
              const closeButton = page.locator('button[aria-label*="close"], .close-menu').first();
              if (await closeButton.isVisible()) {
                await closeButton.click();
              } else {
                await page.click('body', { position: { x: 50, y: 50 } });
              }
              await page.waitForTimeout(500);
            }
          }
        }
      }
    });

    test('should optimize navigation for touch devices', async ({ page, isMobile }) => {
      if (isMobile) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Navigation links should be touch-friendly (minimum 44px)
        const navLinks = page.locator('nav a, [role="navigation"] a');
        const linkCount = await navLinks.count();
        
        for (let i = 0; i < Math.min(linkCount, 5); i++) {
          const link = navLinks.nth(i);
          if (await link.isVisible()) {
            const boundingBox = await link.boundingBox();
            if (boundingBox) {
              // Touch targets should be at least 44px
              expect(Math.max(boundingBox.width, boundingBox.height)).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    });
  });

  test.describe('Cross-Service Context and Suggestions', () => {
    
    test('should provide relevant cross-service suggestions', async ({ page }) => {
      // From Teaching page
      await page.goto('/teaching');
      await page.waitForLoadState('networkidle');
      
      // Should suggest performance services
      const performanceSuggestion = page.locator('text=/also.*perform|performance.*service|live.*music|book.*performance/i');
      if (await performanceSuggestion.count() > 0) {
        await expect(performanceSuggestion.first()).toBeVisible();
      }
      
      // Should suggest collaboration
      const collaborationSuggestion = page.locator('text=/collaboration|creative.*project|recording|work.*together/i');
      if (await collaborationSuggestion.count() > 0) {
        await expect(collaborationSuggestion.first()).toBeVisible();
      }
      
      // From Performance page
      await page.goto('/performance');
      await page.waitForLoadState('networkidle');
      
      // Should suggest teaching services
      const teachingSuggestion = page.locator('text=/also.*teach|lesson.*available|guitar.*instruction|learn.*guitar/i');
      if (await teachingSuggestion.count() > 0) {
        await expect(teachingSuggestion.first()).toBeVisible();
      }
    });

    test('should maintain brand consistency across services', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      const brandElements = [];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        // Check for consistent branding
        const pageTitle = await page.title();
        expect(pageTitle).toContain('Rrish Music');
        
        // Check for consistent color scheme or logo
        const logo = page.locator('[alt*="Rrish"], [alt*="logo"], .logo').first();
        if (await logo.isVisible()) {
          brandElements.push('logo');
        }
        
        // Check for consistent messaging
        const content = await page.locator('body').textContent();
        expect(content).toContain('Rrish');
        
        // Check for Melbourne location consistency
        if (content?.toLowerCase().includes('melbourne')) {
          brandElements.push('melbourne');
        }
      }
      
      // Should have consistent brand elements across services
      expect(brandElements.length).toBeGreaterThan(0);
    });

    test('should show appropriate service hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Homepage should show service hierarchy (Performance > Teaching > Collaboration)
      const serviceLinks = page.locator('a[href*="/teaching"], a[href*="/performance"], a[href*="/collaboration"]');
      const linkCount = await serviceLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(3);
      
      // Performance should be prominently featured
      const performanceElements = page.locator('text=/performance|live.*music|entertainment/i');
      if (await performanceElements.count() > 0) {
        await expect(performanceElements.first()).toBeVisible();
      }
    });
  });

  test.describe('URL Structure and SEO Consistency', () => {
    
    test('should have consistent URL structure across services', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        // URLs should be clean and descriptive
        const currentUrl = page.url();
        expect(currentUrl).toMatch(new RegExp(`${service}$`));
        
        // Should not have query parameters or fragments by default
        expect(currentUrl).not.toContain('?');
        expect(currentUrl).not.toContain('#');
      }
    });

    test('should have proper canonical URLs for each service', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        const canonicalLink = page.locator('link[rel="canonical"]');
        await expect(canonicalLink).toHaveAttribute('href');
        
        const canonicalUrl = await canonicalLink.getAttribute('href');
        expect(canonicalUrl).toContain(service);
      }
    });

    test('should handle 404 errors gracefully with cross-service suggestions', async ({ page }) => {
      // Try to navigate to non-existent page
      const response = await page.goto('/non-existent-page');
      
      if (response?.status() === 404) {
        // Should show 404 page with navigation back to services
        const serviceLinks = page.locator('a[href*="/teaching"], a[href*="/performance"], a[href*="/collaboration"]');
        const linkCount = await serviceLinks.count();
        expect(linkCount).toBeGreaterThan(0);
        
        // Should have helpful messaging
        const helpfulText = page.locator('text=/not.*found|404|go.*back|try.*again|home/i');
        if (await helpfulText.count() > 0) {
          await expect(helpfulText.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Load Performance Across Services', () => {
    
    test('should load all services within acceptable time', async ({ page }) => {
      const services = ['/', '/teaching', '/performance', '/collaboration'];
      const loadTimes = [];
      
      for (const service of services) {
        const startTime = Date.now();
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        
        loadTimes.push({ service, loadTime });
        
        // Each service should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
        
        // Critical content should be visible
        const heading = page.getByRole('heading', { level: 1 }).first();
        await expect(heading).toBeVisible();
      }
      
      // Average load time should be reasonable
      const averageLoadTime = loadTimes.reduce((sum, item) => sum + item.loadTime, 0) / loadTimes.length;
      expect(averageLoadTime).toBeLessThan(2500);
    });

    test('should maintain performance when navigating between services', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate between services multiple times
      const navigationSequence = ['/teaching', '/performance', '/collaboration', '/teaching', '/performance'];
      
      for (const service of navigationSequence) {
        const startTime = Date.now();
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        const navigationTime = Date.now() - startTime;
        
        // Subsequent navigations should be faster due to caching
        expect(navigationTime).toBeLessThan(2000);
      }
    });
  });

  test.describe('Accessibility Consistency', () => {
    
    test('should maintain consistent accessibility across services', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        // Should have proper heading hierarchy
        const h1Elements = page.getByRole('heading', { level: 1 });
        const h1Count = await h1Elements.count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
        
        // Should have skip links or proper focus management
        const firstInteractive = page.locator('button, a, input, select, textarea').first();
        if (await firstInteractive.isVisible()) {
          await firstInteractive.focus();
          const focusedElement = page.locator(':focus');
          await expect(focusedElement).toBeVisible();
        }
        
        // Should have alt text on images
        const images = page.locator('img');
        const imageCount = await images.count();
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const img = images.nth(i);
          if (await img.isVisible()) {
            const alt = await img.getAttribute('alt');
            expect(alt).not.toBeNull();
          }
        }
      }
    });

    test('should support keyboard navigation across services', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Should be able to navigate through interactive elements
        let tabStops = 0;
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);
          
          const currentFocus = page.locator(':focus');
          if (await currentFocus.isVisible()) {
            tabStops++;
          }
        }
        
        // Should have multiple focusable elements
        expect(tabStops).toBeGreaterThan(3);
      }
    });
  });

  test.describe('Search Engine Optimization', () => {
    
    test('should have unique and descriptive titles for each service', async ({ page }) => {
      const services = [
        { path: '/teaching', keywords: ['lesson', 'teaching', 'guitar'] },
        { path: '/performance', keywords: ['performance', 'live', 'music'] },
        { path: '/collaboration', keywords: ['collaboration', 'creative', 'project'] }
      ];
      
      const titles = [];
      
      for (const service of services) {
        await page.goto(service.path);
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        titles.push(title);
        
        // Should contain Rrish Music brand
        expect(title).toContain('Rrish Music');
        
        // Should contain service-specific keywords
        const titleLower = title.toLowerCase();
        const hasKeyword = service.keywords.some(keyword => titleLower.includes(keyword));
        expect(hasKeyword).toBeTruthy();
      }
      
      // All titles should be unique
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    test('should have proper meta descriptions for each service', async ({ page }) => {
      const services = ['/teaching', '/performance', '/collaboration'];
      const descriptions = [];
      
      for (const service of services) {
        await page.goto(service);
        await page.waitForLoadState('networkidle');
        
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content');
        
        const description = await metaDescription.getAttribute('content');
        descriptions.push(description);
        
        // Should be reasonable length
        expect(description?.length).toBeGreaterThan(50);
        expect(description?.length).toBeLessThan(160);
        
        // Should contain Melbourne for local SEO
        expect(description?.toLowerCase()).toContain('melbourne');
      }
      
      // All descriptions should be unique
      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });
  });
});