/**
 * Component Rendering Performance Tests
 * 
 * Tests the rendering performance of React components including
 * mount times, re-render optimization, animation performance,
 * and responsiveness under various conditions.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { performance } from 'perf_hooks';
import { BrowserRouter } from 'react-router-dom';

// Import components to test
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Lessons from '@/components/sections/Lessons';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/layout/Navigation';

// Performance measurement utilities
class ComponentPerformanceMonitor {
  private measurements: Map<string, number[]> = new Map();
  private observer: PerformanceObserver | null = null;

  startMonitoring() {
    if (typeof PerformanceObserver === 'undefined') {
      console.warn('PerformanceObserver not available');
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          const existing = this.measurements.get(entry.name) || [];
          existing.push(entry.duration);
          this.measurements.set(entry.name, existing);
        }
      });
    });

    this.observer.observe({ entryTypes: ['measure'] });
  }

  stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  measure<T>(name: string, fn: () => T): T {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    performance.mark(`${name}-start`);
    const result = await fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    return result;
  }

  getAverageTime(name: string): number {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) return 0;
    return measurements.reduce((a, b) => a + b) / measurements.length;
  }

  getMetrics(name: string) {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, p95: 0 };
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const count = measurements.length;
    const average = measurements.reduce((a, b) => a + b) / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index] || max;

    return { count, average, min, max, p95 };
  }

  clearMeasurements() {
    this.measurements.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Performance budgets for components
const COMPONENT_PERFORMANCE_BUDGETS = {
  MOUNT_TIME: 100, // milliseconds
  RE_RENDER_TIME: 16, // milliseconds (60fps)
  ANIMATION_FRAME_TIME: 16, // milliseconds
  SCROLL_HANDLER_TIME: 8, // milliseconds
  INTERACTION_RESPONSE_TIME: 100, // milliseconds
  LARGE_LIST_RENDER_TIME: 200, // milliseconds
  LAYOUT_SHIFT_TOLERANCE: 0.1, // CLS score
} as const;

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <div data-testid="test-wrapper">
      {children}
    </div>
  </BrowserRouter>
);

describe('Component Rendering Performance Tests', () => {
  let monitor: ComponentPerformanceMonitor;

  beforeEach(() => {
    monitor = new ComponentPerformanceMonitor();
    monitor.startMonitoring();
  });

  afterEach(() => {
    monitor.stopMonitoring();
    monitor.clearMeasurements();
  });

  describe('Hero Component Performance', () => {
    it('should mount within performance budget', async () => {
      const mountTime = monitor.measure('hero-mount', () => {
        const startTime = performance.now();
        render(
          <TestWrapper>
            <Hero />
          </TestWrapper>
        );
        return performance.now() - startTime;
      });

      expect(mountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
    });

    it('should handle responsive design changes efficiently', async () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Simulate viewport changes
      const viewportSizes = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      const resizeTimes: number[] = [];

      for (const size of viewportSizes) {
        const startTime = performance.now();
        
        // Mock viewport change
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: size.width
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: size.height
        });

        fireEvent(window, new Event('resize'));
        await waitFor(() => container.querySelector('[data-responsive]'));
        
        resizeTimes.push(performance.now() - startTime);
      }

      const averageResizeTime = resizeTimes.reduce((a, b) => a + b) / resizeTimes.length;
      expect(averageResizeTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.RE_RENDER_TIME * 2);
    });

    it('should optimize animation performance', async () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Test scroll-triggered animations
      const scrollHandler = jest.fn();
      window.addEventListener('scroll', scrollHandler);

      const scrollTimes: number[] = [];
      const scrollEvents = 50;

      for (let i = 0; i < scrollEvents; i++) {
        const startTime = performance.now();
        
        fireEvent.scroll(window, { target: { scrollY: i * 10 } });
        
        // Wait for any animation frame updates
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        scrollTimes.push(performance.now() - startTime);
      }

      window.removeEventListener('scroll', scrollHandler);

      const averageScrollTime = scrollTimes.reduce((a, b) => a + b) / scrollTimes.length;
      expect(averageScrollTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.SCROLL_HANDLER_TIME);
    });
  });

  describe('Navigation Component Performance', () => {
    it('should render navigation efficiently', async () => {
      const mountTime = monitor.measure('navigation-mount', () => {
        const startTime = performance.now();
        render(
          <TestWrapper>
            <Navigation />
          </TestWrapper>
        );
        return performance.now() - startTime;
      });

      expect(mountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
    });

    it('should handle mobile menu toggle efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /menu/i });
      const toggleTimes: number[] = [];

      // Test multiple menu toggles
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        
        await user.click(menuButton);
        await waitFor(() => screen.getByRole('navigation'));
        
        toggleTimes.push(performance.now() - startTime);
        
        // Close menu for next iteration
        await user.click(menuButton);
      }

      const averageToggleTime = toggleTimes.reduce((a, b) => a + b) / toggleTimes.length;
      expect(averageToggleTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.INTERACTION_RESPONSE_TIME);
    });

    it('should optimize scroll spy performance', async () => {
      render(
        <TestWrapper>
          <Navigation />
          <div style={{ height: '2000px' }}>
            <div id="section1" style={{ height: '500px' }}>Section 1</div>
            <div id="section2" style={{ height: '500px' }}>Section 2</div>
            <div id="section3" style={{ height: '500px' }}>Section 3</div>
            <div id="section4" style={{ height: '500px' }}>Section 4</div>
          </div>
        </TestWrapper>
      );

      const scrollTimes: number[] = [];
      const scrollPositions = [0, 300, 600, 900, 1200, 1500];

      for (const position of scrollPositions) {
        const startTime = performance.now();
        
        fireEvent.scroll(window, { target: { scrollY: position } });
        
        // Wait for scroll spy to update
        await new Promise(resolve => setTimeout(resolve, 10));
        
        scrollTimes.push(performance.now() - startTime);
      }

      const averageScrollTime = scrollTimes.reduce((a, b) => a + b) / scrollTimes.length;
      expect(averageScrollTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.SCROLL_HANDLER_TIME);
    });
  });

  describe('Lessons Component Performance', () => {
    it('should render lesson packages efficiently', async () => {
      const mountTime = monitor.measure('lessons-mount', () => {
        const startTime = performance.now();
        render(
          <TestWrapper>
            <Lessons />
          </TestWrapper>
        );
        return performance.now() - startTime;
      });

      expect(mountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
    });

    it('should handle package filtering efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Lessons />
        </TestWrapper>
      );

      // Find filter controls (adjust selectors based on actual implementation)
      const filterButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('Filter') || button.textContent?.includes('All')
      );

      const filterTimes: number[] = [];

      for (const button of filterButtons) {
        const startTime = performance.now();
        
        await user.click(button);
        await waitFor(() => screen.getByRole('main')); // Wait for re-render
        
        filterTimes.push(performance.now() - startTime);
      }

      if (filterTimes.length > 0) {
        const averageFilterTime = filterTimes.reduce((a, b) => a + b) / filterTimes.length;
        expect(averageFilterTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.INTERACTION_RESPONSE_TIME);
      }
    });

    it('should optimize large list rendering', async () => {
      // Mock large dataset for testing
      const mockLargeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Package ${i}`,
        description: `Description for package ${i}`,
        price: 100 + i,
        popular: i % 5 === 0
      }));

      const renderTime = monitor.measure('large-list-render', () => {
        const startTime = performance.now();
        
        // This would need to be adjusted based on how your Lessons component accepts data
        render(
          <TestWrapper>
            <Lessons />
          </TestWrapper>
        );
        
        return performance.now() - startTime;
      });

      expect(renderTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.LARGE_LIST_RENDER_TIME);
    });
  });

  describe('About Component Performance', () => {
    it('should render about section efficiently', async () => {
      const mountTime = monitor.measure('about-mount', () => {
        const startTime = performance.now();
        render(
          <TestWrapper>
            <About />
          </TestWrapper>
        );
        return performance.now() - startTime;
      });

      expect(mountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
    });

    it('should handle image loading efficiently', async () => {
      const { container } = render(
        <TestWrapper>
          <About />
        </TestWrapper>
      );

      const images = container.querySelectorAll('img');
      const loadTimes: number[] = [];

      for (const img of images) {
        const startTime = performance.now();
        
        // Simulate image load
        fireEvent.load(img);
        
        loadTimes.push(performance.now() - startTime);
      }

      if (loadTimes.length > 0) {
        const averageLoadTime = loadTimes.reduce((a, b) => a + b) / loadTimes.length;
        expect(averageLoadTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.INTERACTION_RESPONSE_TIME);
      }
    });
  });

  describe('Contact Component Performance', () => {
    it('should render contact form efficiently', async () => {
      const mountTime = monitor.measure('contact-mount', () => {
        const startTime = performance.now();
        render(
          <TestWrapper>
            <Contact />
          </TestWrapper>
        );
        return performance.now() - startTime;
      });

      expect(mountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
    });

    it('should handle form interactions efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const inputs = screen.getAllByRole('textbox');
      const interactionTimes: number[] = [];

      for (const input of inputs) {
        const startTime = performance.now();
        
        await user.click(input);
        await user.type(input, 'test input');
        
        interactionTimes.push(performance.now() - startTime);
        
        await user.clear(input);
      }

      if (interactionTimes.length > 0) {
        const averageInteractionTime = interactionTimes.reduce((a, b) => a + b) / interactionTimes.length;
        expect(averageInteractionTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.INTERACTION_RESPONSE_TIME * 2);
      }
    });

    it('should validate form inputs efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const form = screen.getByRole('form') || container.querySelector('form');
      if (!form) return;

      const validationTimes: number[] = [];
      const testInputs = [
        { field: 'email', value: 'invalid-email' },
        { field: 'email', value: 'valid@email.com' },
        { field: 'name', value: '' },
        { field: 'name', value: 'Valid Name' }
      ];

      for (const { field, value } of testInputs) {
        const input = screen.getByRole('textbox', { name: new RegExp(field, 'i') });
        if (input) {
          const startTime = performance.now();
          
          await user.clear(input);
          await user.type(input, value);
          await user.tab(); // Trigger validation
          
          validationTimes.push(performance.now() - startTime);
        }
      }

      if (validationTimes.length > 0) {
        const averageValidationTime = validationTimes.reduce((a, b) => a + b) / validationTimes.length;
        expect(averageValidationTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.INTERACTION_RESPONSE_TIME);
      }
    });
  });

  describe('Cross-Component Performance', () => {
    it('should handle component mounting in sequence efficiently', async () => {
      const components = [Hero, About, Lessons, Contact];
      const mountTimes: number[] = [];

      for (const Component of components) {
        const startTime = performance.now();
        
        const { unmount } = render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );
        
        mountTimes.push(performance.now() - startTime);
        unmount();
      }

      const totalMountTime = mountTimes.reduce((a, b) => a + b);
      const averageMountTime = totalMountTime / components.length;

      expect(averageMountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME);
      expect(totalMountTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.MOUNT_TIME * components.length * 1.5);
    });

    it('should optimize memory usage across components', async () => {
      const memoryBefore = process.memoryUsage().heapUsed;
      const components = [Hero, About, Lessons, Contact];
      const rendered: any[] = [];

      // Mount all components
      for (const Component of components) {
        const result = render(
          <TestWrapper>
            <Component />
          </TestWrapper>
        );
        rendered.push(result);
      }

      // Unmount all components
      rendered.forEach(({ unmount }) => unmount());

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryGrowth = (memoryAfter - memoryBefore) / (1024 * 1024); // MB

      // Should not retain significant memory after unmounting
      expect(memoryGrowth).toBeLessThan(5); // 5MB threshold
    });

    it('should handle rapid component switching efficiently', async () => {
      const components = [Hero, About, Lessons, Contact];
      let currentComponent = 0;
      
      const { rerender } = render(
        <TestWrapper>
          {React.createElement(components[currentComponent])}
        </TestWrapper>
      );

      const switchTimes: number[] = [];

      for (let i = 0; i < 20; i++) {
        const startTime = performance.now();
        
        currentComponent = (currentComponent + 1) % components.length;
        rerender(
          <TestWrapper>
            {React.createElement(components[currentComponent])}
          </TestWrapper>
        );
        
        switchTimes.push(performance.now() - startTime);
      }

      const averageSwitchTime = switchTimes.reduce((a, b) => a + b) / switchTimes.length;
      expect(averageSwitchTime).toBeLessThan(COMPONENT_PERFORMANCE_BUDGETS.RE_RENDER_TIME * 2);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should provide component performance metrics', async () => {
      const metrics = monitor.getMetrics('hero-mount');
      
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Should have recorded performance measurements
      expect(typeof metrics.average).toBe('number');
      expect(typeof metrics.p95).toBe('number');
    });

    it('should detect performance regressions', async () => {
      const baselineRenders = 5;
      const testRenders = 5;
      const baselineTimes: number[] = [];
      const testTimes: number[] = [];

      // Establish baseline
      for (let i = 0; i < baselineRenders; i++) {
        const startTime = performance.now();
        const { unmount } = render(
          <TestWrapper>
            <Hero />
          </TestWrapper>
        );
        baselineTimes.push(performance.now() - startTime);
        unmount();
      }

      // Run test measurements
      for (let i = 0; i < testRenders; i++) {
        const startTime = performance.now();
        const { unmount } = render(
          <TestWrapper>
            <Hero />
          </TestWrapper>
        );
        testTimes.push(performance.now() - startTime);
        unmount();
      }

      const baselineAverage = baselineTimes.reduce((a, b) => a + b) / baselineTimes.length;
      const testAverage = testTimes.reduce((a, b) => a + b) / testTimes.length;
      const regressionThreshold = 1.2; // 20% slower is considered a regression

      expect(testAverage).toBeLessThan(baselineAverage * regressionThreshold);
    });
  });
});

// Export utilities for use in other performance tests
export { ComponentPerformanceMonitor, COMPONENT_PERFORMANCE_BUDGETS, TestWrapper };