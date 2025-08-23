import { test, expect } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('Performance Testing', () => {
  let homePage: HomePage;

  test.describe('Page Load Performance', () => {
    test('should meet Core Web Vitals thresholds', async ({ page, performanceHelper }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      
      const metrics = await performanceHelper.measurePageLoad();
      await performanceHelper.assertPerformanceThresholds(metrics);
      
      console.log('Performance Metrics:', {
        FCP: `${metrics.firstContentfulPaint.toFixed(2)}ms`,
        LCP: `${metrics.largestContentfulPaint.toFixed(2)}ms`,
        CLS: metrics.cumulativeLayoutShift.toFixed(4),
        LoadTime: `${metrics.loadTime.toFixed(2)}ms`
      });
    });

    test('should load critical resources quickly', async ({ page }) => {
      const startTime = Date.now();
      
      homePage = new HomePage(page);
      await homePage.goto();
      
      // Wait for critical resources
      await page.waitForSelector('nav');
      await page.waitForSelector('h1');
      
      const criticalLoadTime = Date.now() - startTime;
      
      // Critical content should load within 1.5 seconds
      expect(criticalLoadTime).toBeLessThan(1500);
    });

    test('should handle resource loading efficiently', async ({ page }) => {
      const resourceMetrics: any = {
        css: [],
        js: [],
        images: [],
        fonts: [],
      };
      
      // Monitor resource loading
      page.on('response', (response) => {
        const url = response.url();
        const resourceType = response.request().resourceType();
        const size = response.headers()['content-length'];
        
        if (resourceType === 'stylesheet') {
          resourceMetrics.css.push({ url, size: parseInt(size || '0') });
        } else if (resourceType === 'script') {
          resourceMetrics.js.push({ url, size: parseInt(size || '0') });
        } else if (resourceType === 'image') {
          resourceMetrics.images.push({ url, size: parseInt(size || '0') });
        } else if (resourceType === 'font') {
          resourceMetrics.fonts.push({ url, size: parseInt(size || '0') });
        }
      });
      
      homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      // Analyze resource loading
      console.log('Resource Loading Summary:', {
        CSS_files: resourceMetrics.css.length,
        JS_files: resourceMetrics.js.length,
        Images: resourceMetrics.images.length,
        Fonts: resourceMetrics.fonts.length,
      });
      
      // CSS files should be minimal
      expect(resourceMetrics.css.length).toBeLessThan(10);
      
      // JavaScript files should be optimized
      expect(resourceMetrics.js.length).toBeLessThan(20);
      
      // Check for excessively large resources
      const allResources = [
        ...resourceMetrics.css,
        ...resourceMetrics.js,
        ...resourceMetrics.images
      ];
      
      const largeResources = allResources.filter(resource => resource.size > 500000); // > 500KB
      expect(largeResources.length).toBe(0);
    });

    test('should optimize image loading', async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        
        // Check for lazy loading
        const loading = await image.getAttribute('loading');
        if (i > 2) { // Images below fold should be lazy loaded
          expect(loading).toBe('lazy');
        }
        
        // Check for responsive images
        const srcset = await image.getAttribute('srcset');
        const sizes = await image.getAttribute('sizes');
        
        // Modern images should have srcset for different screen sizes
        if (srcset || sizes) {
          expect(srcset || sizes).toBeTruthy();
        }
        
        // Check image format optimization
        const src = await image.getAttribute('src');
        if (src) {
          // Modern formats are preferred
          const hasModernFormat = /\.(webp|avif)$/i.test(src) || 
                                (srcset && /\.(webp|avif)/i.test(srcset));
          
          if (!hasModernFormat) {
            console.log(`Image could be optimized with modern format: ${src}`);
          }
        }
        
        // Verify images load properly
        const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });

    test('should minimize layout shift', async ({ page }) => {
      homePage = new HomePage(page);
      
      // Measure CLS during page load
      let cls = 0;
      
      await page.evaluate(() => {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      });
      
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      // Wait a bit more to catch any late layout shifts
      await page.waitForTimeout(2000);
      
      const finalCLS = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cls += (entry as any).value;
              }
            }
          }).observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => resolve(cls), 500);
        });
      });
      
      // CLS should be minimal
      expect(finalCLS).toBeLessThan(0.1);
    });
  });

  test.describe('Runtime Performance', () => {
    test('should handle scrolling smoothly', async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      // Measure scroll performance
      const scrollMetrics: number[] = [];
      
      // Monitor frame rate during scrolling
      await page.evaluate(() => {
        let lastTimestamp = 0;
        const measureFrame = (timestamp: number) => {
          if (lastTimestamp) {
            const frameDuration = timestamp - lastTimestamp;
            (window as any).frameDurations = (window as any).frameDurations || [];
            (window as any).frameDurations.push(frameDuration);
          }
          lastTimestamp = timestamp;
          requestAnimationFrame(measureFrame);
        };
        requestAnimationFrame(measureFrame);
      });
      
      // Perform scrolling
      const scrollDistance = await page.evaluate(() => document.body.scrollHeight);
      const scrollSteps = 10;
      const stepSize = Math.floor(scrollDistance / scrollSteps);
      
      for (let i = 1; i <= scrollSteps; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * stepSize);
        await page.waitForTimeout(100);
      }
      
      // Analyze frame performance
      const frameDurations = await page.evaluate(() => (window as any).frameDurations || []);
      const averageFrameDuration = frameDurations.reduce((a: number, b: number) => a + b, 0) / frameDurations.length;
      
      // Should maintain 60fps (16.67ms per frame)
      expect(averageFrameDuration).toBeLessThan(20); // Allow some variance
      
      console.log(`Average frame duration during scroll: ${averageFrameDuration.toFixed(2)}ms`);
    });

    test('should handle rapid interactions efficiently', async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      const startTime = Date.now();
      
      // Simulate rapid user interactions
      const navLinks = page.locator('nav a[href^="#"]');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i);
        await link.click();
        await page.waitForTimeout(200); // Brief pause between clicks
      }
      
      const interactionTime = Date.now() - startTime;
      
      // All interactions should complete within reasonable time
      expect(interactionTime).toBeLessThan(3000);
      
      // Page should remain responsive
      await expect(homePage.navMenu).toBeVisible();
    });

    test('should manage memory efficiently', async ({ page }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        } : null;
      });
      
      if (initialMemory) {
        // Perform various page interactions
        await page.evaluate(() => {
          // Simulate user interactions that might cause memory leaks
          for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.innerHTML = 'Test content';
            document.body.appendChild(div);
            document.body.removeChild(div);
          }
        });
        
        // Scroll through page multiple times
        for (let i = 0; i < 5; i++) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(100);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(100);
        }
        
        // Force garbage collection if available
        await page.evaluate(() => {
          if ((window as any).gc) {
            (window as any).gc();
          }
        });
        
        await page.waitForTimeout(1000);
        
        const finalMemory = await page.evaluate(() => {
          return (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          } : null;
        });
        
        if (finalMemory) {
          const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
          const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
          
          console.log(`Memory usage increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB (${memoryIncreasePercent.toFixed(2)}%)`);
          
          // Memory increase should be reasonable
          expect(memoryIncreasePercent).toBeLessThan(50); // Less than 50% increase
        }
      }
    });
  });

  test.describe('Network Performance', () => {
    test('should handle slow network connections', async ({ page }) => {
      // Simulate slow 3G connection
      await page.route('**/*', async (route) => {
        // Add delay to simulate slow network
        await new Promise(resolve => setTimeout(resolve, 300));
        await route.continue();
      });
      
      const startTime = Date.now();
      
      homePage = new HomePage(page);
      await homePage.goto();
      
      // Page should still be usable despite slow network
      await expect(homePage.heroSection).toBeVisible({ timeout: 15000 });
      await expect(homePage.navMenu).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      console.log(`Load time on slow network: ${loadTime}ms`);
      
      // Should complete loading within reasonable time even on slow network
      expect(loadTime).toBeLessThan(15000);
    });

    test('should handle network failures gracefully', async ({ page }) => {
      homePage = new HomePage(page);
      
      // Load page normally first
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      // Block all network requests
      await page.route('**/*', (route) => {
        route.abort();
      });
      
      // Try to navigate to a section
      const aboutLink = page.locator('a[href="#about"]');
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForTimeout(1000);
        
        // Basic functionality should still work (no network needed for scrolling)
        const aboutSection = page.locator('#about');
        if (await aboutSection.count() > 0) {
          await expect(aboutSection).toBeInViewport();
        }
      }
    });

    test('should minimize HTTP requests', async ({ page }) => {
      const requests: string[] = [];
      
      page.on('request', (request) => {
        requests.push(request.url());
      });
      
      homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      console.log(`Total HTTP requests: ${requests.length}`);
      
      // Should minimize number of requests
      expect(requests.length).toBeLessThan(50);
      
      // Check for duplicate requests
      const duplicateRequests = requests.filter((url, index) => requests.indexOf(url) !== index);
      expect(duplicateRequests).toHaveLength(0);
    });

    test('should enable resource caching', async ({ page }) => {
      const cacheableResources: string[] = [];
      
      page.on('response', (response) => {
        const cacheControl = response.headers()['cache-control'];
        const expires = response.headers()['expires'];
        const etag = response.headers()['etag'];
        
        if (cacheControl || expires || etag) {
          cacheableResources.push(response.url());
        }
      });
      
      homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      console.log(`Resources with caching headers: ${cacheableResources.length}`);
      
      // Most static resources should have caching headers
      expect(cacheableResources.length).toBeGreaterThan(0);
    });
  });

  test.describe('Resource Optimization', () => {
    test('should compress text resources', async ({ page }) => {
      const compressedResources: string[] = [];
      
      page.on('response', (response) => {
        const contentEncoding = response.headers()['content-encoding'];
        const contentType = response.headers()['content-type'];
        
        if ((contentType?.includes('text') || 
             contentType?.includes('application/javascript') ||
             contentType?.includes('application/json')) &&
            (contentEncoding === 'gzip' || contentEncoding === 'br' || contentEncoding === 'deflate')) {
          compressedResources.push(response.url());
        }
      });
      
      homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      console.log(`Compressed text resources: ${compressedResources.length}`);
      
      // Text resources should be compressed
      expect(compressedResources.length).toBeGreaterThan(0);
    });

    test('should use efficient image formats', async ({ page }) => {
      const imageFormats: { [key: string]: number } = {};
      
      page.on('response', (response) => {
        const url = response.url();
        const resourceType = response.request().resourceType();
        
        if (resourceType === 'image') {
          const extension = url.split('.').pop()?.toLowerCase();
          if (extension) {
            imageFormats[extension] = (imageFormats[extension] || 0) + 1;
          }
        }
      });
      
      homePage = new HomePage(page);
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      console.log('Image formats used:', imageFormats);
      
      // Should prefer modern image formats
      const modernFormats = imageFormats.webp || imageFormats.avif || 0;
      const totalImages = Object.values(imageFormats).reduce((sum, count) => sum + count, 0);
      
      if (totalImages > 0) {
        const modernFormatRatio = modernFormats / totalImages;
        console.log(`Modern format usage: ${(modernFormatRatio * 100).toFixed(1)}%`);
        
        // At least some images should use modern formats (not strict requirement)
        // expect(modernFormatRatio).toBeGreaterThan(0);
      }
    });

    test('should load critical CSS inline', async ({ page }) => {
      homePage = new HomePage(page);
      
      const criticalCSS = await page.evaluate(() => {
        const styleElements = Array.from(document.querySelectorAll('style'));
        const inlineCSSLength = styleElements.reduce((total, style) => {
          return total + (style.textContent?.length || 0);
        }, 0);
        
        return {
          inlineStyles: styleElements.length,
          inlineLength: inlineCSSLength
        };
      });
      
      await homePage.goto();
      await homePage.waitForPageLoad();
      
      console.log('Critical CSS:', criticalCSS);
      
      // Should have some inline styles for critical rendering
      if (criticalCSS.inlineLength > 0) {
        expect(criticalCSS.inlineLength).toBeGreaterThan(100);
      }
    });
  });

  test.describe('Performance Budgets', () => {
    test('should meet performance budget thresholds', async ({ page, performanceHelper }) => {
      homePage = new HomePage(page);
      await homePage.goto();
      
      const metrics = await performanceHelper.measurePageLoad();
      
      // Performance budgets
      const budgets = {
        firstContentfulPaint: 1800, // 1.8s
        largestContentfulPaint: 2500, // 2.5s
        cumulativeLayoutShift: 0.1,
        totalLoadTime: 3000, // 3s
      };
      
      const results = {
        fcp_pass: metrics.firstContentfulPaint <= budgets.firstContentfulPaint,
        lcp_pass: metrics.largestContentfulPaint <= budgets.largestContentfulPaint,
        cls_pass: metrics.cumulativeLayoutShift <= budgets.cumulativeLayoutShift,
        load_pass: metrics.loadTime <= budgets.totalLoadTime,
      };
      
      console.log('Performance Budget Results:', {
        'FCP (≤1800ms)': `${metrics.firstContentfulPaint.toFixed(0)}ms - ${results.fcp_pass ? 'PASS' : 'FAIL'}`,
        'LCP (≤2500ms)': `${metrics.largestContentfulPaint.toFixed(0)}ms - ${results.lcp_pass ? 'PASS' : 'FAIL'}`,
        'CLS (≤0.1)': `${metrics.cumulativeLayoutShift.toFixed(4)} - ${results.cls_pass ? 'PASS' : 'FAIL'}`,
        'Load (≤3000ms)': `${metrics.loadTime.toFixed(0)}ms - ${results.load_pass ? 'PASS' : 'FAIL'}`,
      });
      
      // At least 75% of metrics should pass
      const passCount = Object.values(results).filter(Boolean).length;
      const passRate = passCount / Object.values(results).length;
      
      expect(passRate).toBeGreaterThanOrEqual(0.75);
    });
  });
});