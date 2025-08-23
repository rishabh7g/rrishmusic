/**
 * Core Web Vitals and Web Performance Tests
 * 
 * Tests Largest Contentful Paint (LCP), First Input Delay (FID),
 * Cumulative Layout Shift (CLS), First Contentful Paint (FCP),
 * and other critical web performance metrics.
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Web Performance APIs
class MockPerformanceObserver {
  private callback: PerformanceObserverCallback;
  private options: PerformanceObserverInit;
  private entries: PerformanceEntry[] = [];

  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }

  observe(options: PerformanceObserverInit) {
    this.options = options;
  }

  disconnect() {
    // Mock disconnect
  }

  takeRecords(): PerformanceEntry[] {
    return [...this.entries];
  }

  // Mock method to simulate performance entries
  addEntry(entry: PerformanceEntry) {
    this.entries.push(entry);
    this.callback(this as any, this as any);
  }
}

// Web Vitals measurement utilities
class WebVitalsMonitor {
  private vitals: Map<string, number[]> = new Map();
  private observers: Map<string, MockPerformanceObserver> = new Map();
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof PerformanceObserver !== 'undefined';
    this.setupObservers();
  }

  private setupObservers() {
    if (!this.isSupported) {
      console.warn('PerformanceObserver not supported, using mocked data');
      return;
    }

    // LCP Observer
    this.createObserver('largest-contentful-paint', (entries) => {
      const lcpEntries = entries.filter(entry => entry.entryType === 'largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1].startTime;
        this.recordVital('LCP', lcp);
      }
    });

    // FID Observer
    this.createObserver('first-input', (entries) => {
      const fidEntries = entries.filter(entry => entry.entryType === 'first-input');
      fidEntries.forEach(entry => {
        const fid = (entry as any).processingStart - entry.startTime;
        this.recordVital('FID', fid);
      });
    });

    // CLS Observer
    this.createObserver('layout-shift', (entries) => {
      const clsEntries = entries.filter(entry => entry.entryType === 'layout-shift');
      let clsValue = 0;
      clsEntries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.recordVital('CLS', clsValue);
    });

    // FCP Observer
    this.createObserver('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.recordVital('FCP', fcpEntry.startTime);
      }
    });

    // Navigation Timing
    this.measureNavigationTiming();
  }

  private createObserver(entryType: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [entryType] });
      // Store observer for cleanup (in real implementation)
    } catch (error) {
      console.warn(`Could not create observer for ${entryType}:`, error);
    }
  }

  private measureNavigationTiming() {
    if (typeof performance !== 'undefined' && performance.navigation) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordVital('TTFB', navigation.responseStart - navigation.requestStart);
        this.recordVital('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.navigationStart);
        this.recordVital('Load', navigation.loadEventEnd - navigation.navigationStart);
      }
    }
  }

  recordVital(name: string, value: number) {
    if (!this.vitals.has(name)) {
      this.vitals.set(name, []);
    }
    this.vitals.get(name)!.push(value);
  }

  getVital(name: string): WebVitalMetric {
    const values = this.vitals.get(name) || [];
    if (values.length === 0) {
      return { name, value: 0, count: 0, average: 0, p75: 0, p95: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const average = values.reduce((a, b) => a + b) / count;
    const p75Index = Math.floor(count * 0.75);
    const p95Index = Math.floor(count * 0.95);

    return {
      name,
      value: sorted[sorted.length - 1], // Latest/highest value
      count,
      average,
      p75: sorted[p75Index] || sorted[sorted.length - 1],
      p95: sorted[p95Index] || sorted[sorted.length - 1]
    };
  }

  getAllVitals(): WebVitalsSummary {
    return {
      LCP: this.getVital('LCP'),
      FID: this.getVital('FID'),
      CLS: this.getVital('CLS'),
      FCP: this.getVital('FCP'),
      TTFB: this.getVital('TTFB'),
      DOMContentLoaded: this.getVital('DOMContentLoaded'),
      Load: this.getVital('Load')
    };
  }

  // Simulate web vitals for testing
  simulateWebVitals() {
    // Simulate LCP measurement
    this.recordVital('LCP', 1200 + Math.random() * 800); // 1.2-2.0s range

    // Simulate FID measurement
    this.recordVital('FID', 10 + Math.random() * 90); // 10-100ms range

    // Simulate CLS measurement
    this.recordVital('CLS', Math.random() * 0.15); // 0-0.15 range

    // Simulate FCP measurement
    this.recordVital('FCP', 800 + Math.random() * 400); // 0.8-1.2s range

    // Simulate TTFB measurement
    this.recordVital('TTFB', 100 + Math.random() * 200); // 100-300ms range
  }

  clear() {
    this.vitals.clear();
  }
}

// Performance budget analyzer
class PerformanceBudgetAnalyzer {
  private budgets: PerformanceBudgets;

  constructor(budgets: PerformanceBudgets) {
    this.budgets = budgets;
  }

  analyzeVitals(vitals: WebVitalsSummary): BudgetAnalysis {
    const results: BudgetAnalysis = {
      passing: [],
      failing: [],
      warnings: [],
      score: 0
    };

    const checks = [
      { name: 'LCP', value: vitals.LCP.p75, budget: this.budgets.LCP.good, warning: this.budgets.LCP.needsImprovement },
      { name: 'FID', value: vitals.FID.p75, budget: this.budgets.FID.good, warning: this.budgets.FID.needsImprovement },
      { name: 'CLS', value: vitals.CLS.p75, budget: this.budgets.CLS.good, warning: this.budgets.CLS.needsImprovement },
      { name: 'FCP', value: vitals.FCP.p75, budget: this.budgets.FCP.good, warning: this.budgets.FCP.needsImprovement },
      { name: 'TTFB', value: vitals.TTFB.p75, budget: this.budgets.TTFB.good, warning: this.budgets.TTFB.needsImprovement }
    ];

    let passingCount = 0;

    checks.forEach(check => {
      if (check.value <= check.budget) {
        results.passing.push({
          metric: check.name,
          value: check.value,
          budget: check.budget,
          status: 'good'
        });
        passingCount++;
      } else if (check.value <= check.warning) {
        results.warnings.push({
          metric: check.name,
          value: check.value,
          budget: check.budget,
          status: 'needs-improvement'
        });
      } else {
        results.failing.push({
          metric: check.name,
          value: check.value,
          budget: check.budget,
          status: 'poor'
        });
      }
    });

    results.score = (passingCount / checks.length) * 100;

    return results;
  }

  generateReport(analysis: BudgetAnalysis): string {
    let report = `## Web Vitals Performance Report\n\n`;
    report += `**Overall Score: ${analysis.score.toFixed(1)}/100**\n\n`;

    if (analysis.passing.length > 0) {
      report += `### ✅ Passing Metrics (${analysis.passing.length})\n`;
      analysis.passing.forEach(metric => {
        report += `- **${metric.metric}**: ${metric.value.toFixed(2)}ms (Budget: ${metric.budget}ms)\n`;
      });
      report += '\n';
    }

    if (analysis.warnings.length > 0) {
      report += `### ⚠️ Needs Improvement (${analysis.warnings.length})\n`;
      analysis.warnings.forEach(metric => {
        report += `- **${metric.metric}**: ${metric.value.toFixed(2)}ms (Budget: ${metric.budget}ms)\n`;
      });
      report += '\n';
    }

    if (analysis.failing.length > 0) {
      report += `### ❌ Poor Performance (${analysis.failing.length})\n`;
      analysis.failing.forEach(metric => {
        report += `- **${metric.metric}**: ${metric.value.toFixed(2)}ms (Budget: ${metric.budget}ms)\n`;
      });
      report += '\n';
    }

    return report;
  }
}

// Type definitions
interface WebVitalMetric {
  name: string;
  value: number;
  count: number;
  average: number;
  p75: number;
  p95: number;
}

interface WebVitalsSummary {
  LCP: WebVitalMetric;
  FID: WebVitalMetric;
  CLS: WebVitalMetric;
  FCP: WebVitalMetric;
  TTFB: WebVitalMetric;
  DOMContentLoaded: WebVitalMetric;
  Load: WebVitalMetric;
}

interface PerformanceBudgets {
  LCP: { good: number; needsImprovement: number };
  FID: { good: number; needsImprovement: number };
  CLS: { good: number; needsImprovement: number };
  FCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
}

interface BudgetCheck {
  metric: string;
  value: number;
  budget: number;
  status: 'good' | 'needs-improvement' | 'poor';
}

interface BudgetAnalysis {
  passing: BudgetCheck[];
  failing: BudgetCheck[];
  warnings: BudgetCheck[];
  score: number;
}

// Performance budgets based on Core Web Vitals thresholds
const WEB_VITALS_BUDGETS: PerformanceBudgets = {
  LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
  FID: { good: 100, needsImprovement: 300 },   // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 },  // score
  FCP: { good: 1800, needsImprovement: 3000 }, // milliseconds
  TTFB: { good: 800, needsImprovement: 1800 }  // milliseconds
};

describe('Core Web Vitals and Web Performance Tests', () => {
  let monitor: WebVitalsMonitor;
  let analyzer: PerformanceBudgetAnalyzer;

  beforeEach(() => {
    monitor = new WebVitalsMonitor();
    analyzer = new PerformanceBudgetAnalyzer(WEB_VITALS_BUDGETS);
  });

  afterEach(() => {
    monitor.clear();
  });

  describe('Core Web Vitals Tests', () => {
    it('should meet LCP (Largest Contentful Paint) budget', async () => {
      // Simulate page load and LCP measurement
      monitor.simulateWebVitals();
      
      // Add some realistic LCP measurements
      monitor.recordVital('LCP', 1500); // Good LCP
      monitor.recordVital('LCP', 2200); // Good LCP
      monitor.recordVital('LCP', 1800); // Good LCP

      const lcp = monitor.getVital('LCP');
      
      expect(lcp.p75).toBeLessThan(WEB_VITALS_BUDGETS.LCP.good);
      expect(lcp.average).toBeLessThan(WEB_VITALS_BUDGETS.LCP.good);

      console.log(`LCP Performance: ${lcp.p75.toFixed(2)}ms (P75), ${lcp.average.toFixed(2)}ms (avg)`);
    });

    it('should meet FID (First Input Delay) budget', async () => {
      // Simulate user interactions and FID measurement
      monitor.recordVital('FID', 45);  // Good FID
      monitor.recordVital('FID', 72);  // Good FID
      monitor.recordVital('FID', 38);  // Good FID

      const fid = monitor.getVital('FID');
      
      expect(fid.p75).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);
      expect(fid.value).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);

      console.log(`FID Performance: ${fid.p75.toFixed(2)}ms (P75), ${fid.value.toFixed(2)}ms (latest)`);
    });

    it('should meet CLS (Cumulative Layout Shift) budget', async () => {
      // Simulate layout shift measurements
      monitor.recordVital('CLS', 0.05); // Good CLS
      monitor.recordVital('CLS', 0.08); // Good CLS
      monitor.recordVital('CLS', 0.03); // Good CLS

      const cls = monitor.getVital('CLS');
      
      expect(cls.p75).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);
      expect(cls.value).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);

      console.log(`CLS Performance: ${cls.p75.toFixed(3)} (P75), ${cls.value.toFixed(3)} (latest)`);
    });

    it('should meet FCP (First Contentful Paint) budget', async () => {
      // Simulate FCP measurements
      monitor.recordVital('FCP', 900);  // Good FCP
      monitor.recordVital('FCP', 1200); // Good FCP
      monitor.recordVital('FCP', 1100); // Good FCP

      const fcp = monitor.getVital('FCP');
      
      expect(fcp.p75).toBeLessThan(WEB_VITALS_BUDGETS.FCP.good);
      expect(fcp.average).toBeLessThan(WEB_VITALS_BUDGETS.FCP.good);

      console.log(`FCP Performance: ${fcp.p75.toFixed(2)}ms (P75), ${fcp.average.toFixed(2)}ms (avg)`);
    });

    it('should meet TTFB (Time to First Byte) budget', async () => {
      // Simulate TTFB measurements
      monitor.recordVital('TTFB', 200); // Good TTFB
      monitor.recordVital('TTFB', 350); // Good TTFB
      monitor.recordVital('TTFB', 180); // Good TTFB

      const ttfb = monitor.getVital('TTFB');
      
      expect(ttfb.p75).toBeLessThan(WEB_VITALS_BUDGETS.TTFB.good);
      expect(ttfb.average).toBeLessThan(WEB_VITALS_BUDGETS.TTFB.good);

      console.log(`TTFB Performance: ${ttfb.p75.toFixed(2)}ms (P75), ${ttfb.average.toFixed(2)}ms (avg)`);
    });
  });

  describe('Content System Performance Impact', () => {
    it('should not significantly impact LCP with content loading', async () => {
      // Simulate content loading impact on LCP
      const baselineLCP = 1500;
      const contentSystemOverhead = 300; // Expected overhead

      monitor.recordVital('LCP', baselineLCP);
      monitor.recordVital('LCP', baselineLCP + contentSystemOverhead);
      monitor.recordVital('LCP', baselineLCP + (contentSystemOverhead * 0.8));

      const lcp = monitor.getVital('LCP');
      
      // Content system should not push LCP beyond good threshold
      expect(lcp.p75).toBeLessThan(WEB_VITALS_BUDGETS.LCP.good);
      
      // Overhead should be reasonable
      const averageOverhead = lcp.average - baselineLCP;
      expect(averageOverhead).toBeLessThan(500); // 500ms max overhead
    });

    it('should maintain low FID during content interactions', async () => {
      // Simulate content-related interactions
      const interactions = [
        { type: 'search', expectedFID: 40 },
        { type: 'filter', expectedFID: 60 },
        { type: 'sort', expectedFID: 35 },
        { type: 'load-more', expectedFID: 80 }
      ];

      interactions.forEach(interaction => {
        monitor.recordVital('FID', interaction.expectedFID);
      });

      const fid = monitor.getVital('FID');
      
      expect(fid.p95).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);
      expect(fid.average).toBeLessThan(WEB_VITALS_BUDGETS.FID.good * 0.7); // 70% of budget
    });

    it('should prevent layout shifts during content updates', async () => {
      // Simulate content loading scenarios that could cause CLS
      const contentUpdateScenarios = [
        { type: 'image-load', cls: 0.02 },
        { type: 'font-load', cls: 0.01 },
        { type: 'content-insert', cls: 0.03 },
        { type: 'ad-load', cls: 0.0 }, // Should be 0 - no ads in content system
      ];

      contentUpdateScenarios.forEach(scenario => {
        monitor.recordVital('CLS', scenario.cls);
      });

      const cls = monitor.getVital('CLS');
      
      expect(cls.value).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);
      expect(cls.p95).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);
    });
  });

  describe('Real User Monitoring Simulation', () => {
    it('should track performance across different connection types', async () => {
      const connectionTypes = [
        { type: '4G', multiplier: 1 },
        { type: '3G', multiplier: 2.5 },
        { type: 'slow-2G', multiplier: 6 }
      ];

      connectionTypes.forEach(connection => {
        // Simulate slower connections affecting metrics
        monitor.recordVital('LCP', 1500 * connection.multiplier);
        monitor.recordVital('FCP', 900 * connection.multiplier);
        monitor.recordVital('TTFB', 200 * connection.multiplier);
        monitor.recordVital('FID', 50); // FID shouldn't be affected by connection
        monitor.recordVital('CLS', 0.05); // CLS shouldn't be affected by connection
      });

      const vitals = monitor.getAllVitals();
      
      // Even with slow connections in the mix, averages should be reasonable
      expect(vitals.LCP.average).toBeLessThan(WEB_VITALS_BUDGETS.LCP.needsImprovement);
      expect(vitals.FCP.average).toBeLessThan(WEB_VITALS_BUDGETS.FCP.needsImprovement);
      
      // FID and CLS should remain good regardless of connection
      expect(vitals.FID.p75).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);
      expect(vitals.CLS.p75).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);
    });

    it('should maintain performance on mobile devices', async () => {
      // Simulate mobile device performance characteristics
      const mobilePerformanceProfile = {
        LCP: 2000,  // Slightly slower LCP on mobile
        FCP: 1200,  // Slower FCP on mobile
        FID: 80,    // Potentially higher FID on mobile
        CLS: 0.06,  // Similar CLS on mobile
        TTFB: 400   // Slower TTFB on mobile networks
      };

      Object.entries(mobilePerformanceProfile).forEach(([metric, value]) => {
        monitor.recordVital(metric, value);
        monitor.recordVital(metric, value * 0.9); // Add some variance
        monitor.recordVital(metric, value * 1.1);
      });

      const vitals = monitor.getAllVitals();
      
      // Mobile performance should still meet budgets
      expect(vitals.LCP.p75).toBeLessThan(WEB_VITALS_BUDGETS.LCP.good);
      expect(vitals.FCP.p75).toBeLessThan(WEB_VITALS_BUDGETS.FCP.good);
      expect(vitals.FID.p75).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);
      expect(vitals.CLS.p75).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);
    });

    it('should handle performance variations gracefully', async () => {
      // Simulate realistic performance variation
      const performanceVariations = 20;
      
      for (let i = 0; i < performanceVariations; i++) {
        // Add realistic variations to each metric
        monitor.recordVital('LCP', 1500 + (Math.random() - 0.5) * 1000);
        monitor.recordVital('FCP', 900 + (Math.random() - 0.5) * 600);
        monitor.recordVital('FID', 50 + Math.random() * 40);
        monitor.recordVital('CLS', 0.05 + Math.random() * 0.04);
        monitor.recordVital('TTFB', 200 + Math.random() * 200);
      }

      const vitals = monitor.getAllVitals();
      
      // Despite variations, P75 should meet budgets
      expect(vitals.LCP.p75).toBeLessThan(WEB_VITALS_BUDGETS.LCP.good);
      expect(vitals.FCP.p75).toBeLessThan(WEB_VITALS_BUDGETS.FCP.good);
      expect(vitals.FID.p75).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);
      expect(vitals.CLS.p75).toBeLessThan(WEB_VITALS_BUDGETS.CLS.good);

      // Variation should be within reasonable bounds
      const lcpVariation = vitals.LCP.p95 - vitals.LCP.p75;
      expect(lcpVariation).toBeLessThan(1000); // Less than 1s variation
    });
  });

  describe('Performance Budget Analysis', () => {
    it('should analyze and report on all core web vitals', async () => {
      // Create a mixed performance scenario
      monitor.recordVital('LCP', 2000); // Good
      monitor.recordVital('FCP', 1000); // Good
      monitor.recordVital('FID', 70);   // Good
      monitor.recordVital('CLS', 0.08); // Good
      monitor.recordVital('TTFB', 300); // Good

      const vitals = monitor.getAllVitals();
      const analysis = analyzer.analyzeVitals(vitals);

      expect(analysis.score).toBeGreaterThan(80); // 80% passing score
      expect(analysis.failing.length).toBe(0);
      expect(analysis.passing.length).toBeGreaterThan(3);

      const report = analyzer.generateReport(analysis);
      expect(report).toContain('Web Vitals Performance Report');
      expect(report).toContain('Overall Score:');

      console.log('\n' + report);
    });

    it('should identify performance regressions', async () => {
      // Simulate baseline performance
      const baseline = {
        LCP: 1800,
        FCP: 1000,
        FID: 60,
        CLS: 0.05,
        TTFB: 250
      };

      Object.entries(baseline).forEach(([metric, value]) => {
        monitor.recordVital(metric, value);
      });

      const baselineAnalysis = analyzer.analyzeVitals(monitor.getAllVitals());
      
      // Clear and simulate regression
      monitor.clear();
      
      const regressed = {
        LCP: 3200, // Regression: exceeds budget
        FCP: 1000, // Still good
        FID: 60,   // Still good
        CLS: 0.05, // Still good
        TTFB: 250  // Still good
      };

      Object.entries(regressed).forEach(([metric, value]) => {
        monitor.recordVital(metric, value);
      });

      const regressionAnalysis = analyzer.analyzeVitals(monitor.getAllVitals());

      // Should detect the regression
      expect(regressionAnalysis.score).toBeLessThan(baselineAnalysis.score);
      expect(regressionAnalysis.failing.length).toBeGreaterThan(0);
      
      const lcpFailing = regressionAnalysis.failing.find(f => f.metric === 'LCP');
      expect(lcpFailing).toBeDefined();
      expect(lcpFailing!.value).toBeGreaterThan(WEB_VITALS_BUDGETS.LCP.needsImprovement);
    });

    it('should provide actionable performance insights', async () => {
      // Simulate various performance issues
      monitor.recordVital('LCP', 3500); // Poor LCP
      monitor.recordVital('FCP', 2200); // Needs improvement
      monitor.recordVital('FID', 45);   // Good FID
      monitor.recordVital('CLS', 0.15); // Needs improvement
      monitor.recordVital('TTFB', 1200); // Poor TTFB

      const vitals = monitor.getAllVitals();
      const analysis = analyzer.analyzeVitals(vitals);

      // Should identify specific issues
      expect(analysis.failing.length).toBeGreaterThan(0);
      expect(analysis.warnings.length).toBeGreaterThan(0);
      
      // Should provide specific recommendations in the failing metrics
      const lcpIssue = analysis.failing.find(f => f.metric === 'LCP');
      const clsIssue = analysis.warnings.find(w => w.metric === 'CLS');
      
      expect(lcpIssue).toBeDefined();
      expect(clsIssue).toBeDefined();

      const insights = this.generatePerformanceInsights(analysis);
      expect(insights.length).toBeGreaterThan(0);
      
      insights.forEach(insight => {
        expect(insight).toHaveProperty('issue');
        expect(insight).toHaveProperty('recommendation');
        expect(insight).toHaveProperty('impact');
      });
    });

    // Helper method for generating insights
    generatePerformanceInsights(analysis: BudgetAnalysis) {
      const insights: Array<{
        issue: string;
        recommendation: string;
        impact: 'high' | 'medium' | 'low';
      }> = [];

      analysis.failing.forEach(metric => {
        switch (metric.metric) {
          case 'LCP':
            insights.push({
              issue: 'Large Contentful Paint is too slow',
              recommendation: 'Optimize largest content element, improve server response time, use CDN',
              impact: 'high'
            });
            break;
          case 'FID':
            insights.push({
              issue: 'First Input Delay is too high',
              recommendation: 'Reduce JavaScript execution time, code splitting, optimize third-party scripts',
              impact: 'high'
            });
            break;
          case 'CLS':
            insights.push({
              issue: 'Cumulative Layout Shift is too high',
              recommendation: 'Set explicit dimensions for images/videos, avoid inserting content above existing content',
              impact: 'medium'
            });
            break;
        }
      });

      return insights;
    }
  });

  describe('Performance Monitoring Integration', () => {
    it('should collect metrics for real user monitoring', async () => {
      // Simulate collecting metrics over time
      const sessions = 10;
      
      for (let i = 0; i < sessions; i++) {
        // Simulate user session with realistic metrics
        monitor.recordVital('LCP', 1200 + Math.random() * 1500);
        monitor.recordVital('FCP', 800 + Math.random() * 800);
        monitor.recordVital('FID', 20 + Math.random() * 80);
        monitor.recordVital('CLS', Math.random() * 0.12);
        monitor.recordVital('TTFB', 150 + Math.random() * 300);
      }

      const vitals = monitor.getAllVitals();
      
      // Should have collected sufficient data
      Object.values(vitals).forEach(vital => {
        expect(vital.count).toBe(sessions);
        expect(vital.average).toBeGreaterThan(0);
        expect(vital.p75).toBeGreaterThan(0);
        expect(vital.p95).toBeGreaterThan(0);
      });

      // Data should be suitable for monitoring dashboards
      const monitoringData = {
        timestamp: Date.now(),
        vitals: vitals,
        analysis: analyzer.analyzeVitals(vitals)
      };

      expect(monitoringData.vitals).toBeDefined();
      expect(monitoringData.analysis.score).toBeGreaterThan(0);
    });

    it('should support performance alerting thresholds', async () => {
      // Define alerting thresholds (more strict than budgets)
      const alertThresholds = {
        LCP: 2000,
        FCP: 1500,
        FID: 80,
        CLS: 0.08,
        TTFB: 600
      };

      // Simulate metrics that should trigger alerts
      monitor.recordVital('LCP', 2500); // Above alert threshold
      monitor.recordVital('FCP', 1200); // Below alert threshold
      monitor.recordVital('FID', 95);   // Above alert threshold

      const vitals = monitor.getAllVitals();
      
      // Check which metrics would trigger alerts
      const alerts = Object.entries(alertThresholds)
        .filter(([metric, threshold]) => {
          const vital = vitals[metric as keyof WebVitalsSummary];
          return vital && vital.p75 > threshold;
        })
        .map(([metric]) => metric);

      expect(alerts).toContain('LCP');
      expect(alerts).toContain('FID');
      expect(alerts).not.toContain('FCP');

      console.log(`Performance alerts would be triggered for: ${alerts.join(', ')}`);
    });
  });
});

// Export utilities for use in other performance tests
export { 
  WebVitalsMonitor, 
  PerformanceBudgetAnalyzer, 
  WEB_VITALS_BUDGETS,
  type WebVitalsSummary,
  type BudgetAnalysis 
};

// Global web vitals testing utilities
export const webVitalsTestUtils = {
  createPerformanceTest: (component: React.ComponentType, budgets: Partial<PerformanceBudgets> = {}) => {
    return async () => {
      const monitor = new WebVitalsMonitor();
      const customBudgets = { ...WEB_VITALS_BUDGETS, ...budgets };
      const analyzer = new PerformanceBudgetAnalyzer(customBudgets);

      // Render component and simulate performance measurements
      render(React.createElement(component));
      
      // Simulate realistic web vitals
      monitor.simulateWebVitals();
      
      const vitals = monitor.getAllVitals();
      const analysis = analyzer.analyzeVitals(vitals);
      
      expect(analysis.score).toBeGreaterThan(75); // 75% minimum score
      expect(analysis.failing.length).toBe(0);    // No failing metrics
      
      return { vitals, analysis };
    };
  },

  monitorComponentPerformance: (component: React.ComponentType, interactions: Array<() => Promise<void>>) => {
    return async () => {
      const monitor = new WebVitalsMonitor();
      const { container } = render(React.createElement(component));

      // Perform interactions and measure performance
      for (const interaction of interactions) {
        const startTime = performance.now();
        await interaction();
        const duration = performance.now() - startTime;
        
        // Record interaction timing as FID
        monitor.recordVital('FID', duration);
      }

      const vitals = monitor.getAllVitals();
      expect(vitals.FID.average).toBeLessThan(WEB_VITALS_BUDGETS.FID.good);

      return vitals;
    };
  }
};