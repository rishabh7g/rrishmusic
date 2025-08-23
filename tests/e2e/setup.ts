import { test as base, expect, type Page, type Locator } from '@playwright/test';

// Performance tracking utilities
export interface PerformanceMetrics {
  loadTime: number;
  largestContentfulPaint: number;
  firstContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay?: number;
}

// Test data interface
export interface TestData {
  user: {
    name: string;
    email: string;
    message: string;
  };
  lessonPackages: string[];
  socialLinks: string[];
}

// Custom fixtures interface
interface TestFixtures {
  testData: TestData;
  performanceHelper: PerformanceHelper;
  accessibilityHelper: AccessibilityHelper;
}

// Performance helper class
class PerformanceHelper {
  constructor(private page: Page) {}

  async measurePageLoad(): Promise<PerformanceMetrics> {
    await this.page.waitForLoadState('networkidle');
    
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        largestContentfulPaint: 0, // Will be updated with observer
        firstContentfulPaint: fcp,
        cumulativeLayoutShift: 0, // Will be updated with observer
      };
    });

    // Measure LCP and CLS
    const webVitals = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;

        // LCP Observer
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS Observer
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.hadRecentInput) continue;
            cls += (entry as any).value;
          }
        }).observe({ entryTypes: ['layout-shift'] });

        // Wait for stable metrics
        setTimeout(() => {
          resolve({ lcp, cls });
        }, 2000);
      });
    });

    return {
      ...performanceMetrics,
      largestContentfulPaint: (webVitals as any).lcp,
      cumulativeLayoutShift: (webVitals as any).cls,
    };
  }

  async assertPerformanceThresholds(metrics: PerformanceMetrics) {
    expect(metrics.firstContentfulPaint).toBeLessThan(1800); // < 1.8s
    expect(metrics.largestContentfulPaint).toBeLessThan(2500); // < 2.5s
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1); // < 0.1
  }
}

// Accessibility helper class
class AccessibilityHelper {
  constructor(private page: Page) {}

  async checkKeyboardNavigation(selectors: string[]) {
    for (const selector of selectors) {
      await this.page.press('body', 'Tab');
      const focusedElement = await this.page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  }

  async checkAriaLabels(elements: { selector: string; expectedLabel?: string }[]) {
    for (const element of elements) {
      const locator = this.page.locator(element.selector);
      const ariaLabel = await locator.getAttribute('aria-label');
      const ariaLabelledBy = await locator.getAttribute('aria-labelledby');
      
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      
      if (element.expectedLabel) {
        expect(ariaLabel).toContain(element.expectedLabel);
      }
    }
  }

  async checkColorContrast(selector: string) {
    const element = this.page.locator(selector);
    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });
    
    // Basic contrast check (simplified)
    expect(styles.color).not.toBe(styles.backgroundColor);
  }

  async checkHeadingHierarchy() {
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for H1 presence
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1);
  }
}

// Extended test with custom fixtures
export const test = base.extend<TestFixtures>({
  testData: async ({}, use) => {
    const testData: TestData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'I am interested in learning blues guitar and improvisation techniques.',
      },
      lessonPackages: ['Individual Lessons', 'Package Deals', 'Online Sessions'],
      socialLinks: ['Instagram'],
    };
    
    await use(testData);
  },

  performanceHelper: async ({ page }, use) => {
    const helper = new PerformanceHelper(page);
    await use(helper);
  },

  accessibilityHelper: async ({ page }, use) => {
    const helper = new AccessibilityHelper(page);
    await use(helper);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

// Viewport configurations for responsive testing
export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
} as const;

// Common test utilities
export class TestUtils {
  static async waitForSmoothScroll(page: Page, targetY: number) {
    await page.waitForFunction(
      (expectedY) => Math.abs(window.scrollY - expectedY) < 10,
      targetY,
      { timeout: 3000 }
    );
  }

  static async getElementPosition(locator: Locator) {
    return await locator.boundingBox();
  }

  static async isElementInViewport(page: Page, selector: string) {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    }, selector);
  }

  static async scrollToElement(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Allow for scroll animation
  }
}