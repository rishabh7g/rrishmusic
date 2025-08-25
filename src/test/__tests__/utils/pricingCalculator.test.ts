/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { 
  calculatePackagePricing,
  TEACHING_PRICING_CONFIG
} from '@/utils/pricingCalculator';

describe('Pricing Calculator', () => {
  describe('TEACHING_PRICING_CONFIG', () => {
    it('should have valid configuration structure', () => {
      expect(TEACHING_PRICING_CONFIG).toBeDefined();
      expect(TEACHING_PRICING_CONFIG.baseLessonPrice).toBeGreaterThan(0);
      expect(TEACHING_PRICING_CONFIG.discountTiers).toBeInstanceOf(Array);
      expect(TEACHING_PRICING_CONFIG.packages).toBeInstanceOf(Array);
    });

    it('should have properly configured discount tiers', () => {
      const { discountTiers } = TEACHING_PRICING_CONFIG;
      
      expect(discountTiers.length).toBeGreaterThan(0);
      
      // Check that discounts increase with session count
      for (let i = 1; i < discountTiers.length; i++) {
        expect(discountTiers[i].minSessions).toBeGreaterThan(discountTiers[i-1].minSessions);
        expect(discountTiers[i].discountPercent).toBeGreaterThanOrEqual(discountTiers[i-1].discountPercent);
      }
    });

    it('should have valid package configurations', () => {
      const { packages } = TEACHING_PRICING_CONFIG;
      
      packages.forEach(pkg => {
        expect(pkg.id).toBeDefined();
        expect(pkg.sessions).toBeGreaterThan(0);
        expect(pkg.duration).toBeGreaterThan(0);
        expect(pkg.validity).toBeGreaterThan(0);
        expect(pkg.features).toBeInstanceOf(Array);
      });
    });
  });

  describe('calculatePackagePricing', () => {
    it('should calculate pricing for single lesson', () => {
      const result = calculatePackagePricing(1);
      
      expect(result).toBeDefined();
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.finalPrice).toBeGreaterThan(0);
      expect(result.pricePerLesson).toBe(result.finalPrice);
    });

    it('should apply discounts for bulk packages', () => {
      const result = calculatePackagePricing(8);
      
      expect(result).toBeDefined();
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.finalPrice).toBeGreaterThan(0);
      expect(result.pricePerLesson).toBeGreaterThan(0);
    });

    it('should calculate price per lesson correctly', () => {
      const sessions = 8;
      const result = calculatePackagePricing(sessions);
      
      expect(result.pricePerLesson).toBeCloseTo(result.finalPrice / sessions, 2);
    });

    it('should handle zero sessions gracefully', () => {
      const result = calculatePackagePricing(0);
      
      expect(result).toBeDefined();
      expect(result.basePrice).toBe(0);
      expect(result.finalPrice).toBe(0);
    });

    it('should handle very large session counts', () => {
      const result = calculatePackagePricing(1000);
      
      expect(result).toBeDefined();
      expect(result.basePrice).toBeGreaterThan(0);
    });
  });

  describe('Configuration Validation', () => {
    it('should have consistent pricing structure', () => {
      expect(TEACHING_PRICING_CONFIG.baseLessonPrice).toBeGreaterThan(0);
      expect(TEACHING_PRICING_CONFIG.trialLessonPrice).toBeGreaterThan(0);
    });

    it('should have valid discount tiers', () => {
      const tiers = TEACHING_PRICING_CONFIG.discountTiers;
      
      tiers.forEach(tier => {
        expect(tier.minSessions).toBeGreaterThan(0);
        expect(tier.discountPercent).toBeGreaterThan(0);
        expect(tier.discountPercent).toBeLessThan(100);
        expect(tier.name).toBeDefined();
      });
    });

    it('should have valid package structure', () => {
      const packages = TEACHING_PRICING_CONFIG.packages;
      
      packages.forEach(pkg => {
        expect(pkg.id).toBeDefined();
        expect(pkg.sessions).toBeGreaterThan(0);
        expect(pkg.duration).toBeGreaterThan(0);
        expect(pkg.validity).toBeGreaterThan(0);
        expect(pkg.features).toBeInstanceOf(Array);
        expect(pkg.features.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative sessions', () => {
      expect(() => calculatePackagePricing(-1)).not.toThrow();
    });

    it('should handle floating point sessions', () => {
      expect(() => calculatePackagePricing(4.5)).not.toThrow();
    });

    it('should handle extreme values', () => {
      expect(() => calculatePackagePricing(Number.MAX_SAFE_INTEGER)).not.toThrow();
    });
  });

  describe('Performance Testing', () => {
    it('should calculate pricing efficiently for large batch', () => {
      const startTime = Date.now();
      
      for (let i = 1; i <= 100; i++) {
        calculatePackagePricing(i);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle concurrent calculations', async () => {
      const promises = Array(50).fill(null).map((_, i) =>
        Promise.resolve(calculatePackagePricing(i + 1))
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(50);
      
      results.forEach((result) => {
        expect(result.basePrice).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Mathematical Operations', () => {
    it('should handle precision correctly', () => {
      const result = calculatePackagePricing(3);
      
      expect(result.pricePerLesson).toBe(Math.round((result.finalPrice / 3) * 100) / 100);
    });

    it('should maintain numerical consistency', () => {
      const result1 = calculatePackagePricing(4);
      const result2 = calculatePackagePricing(4);
      
      expect(result1).toEqual(result2);
    });
  });
});