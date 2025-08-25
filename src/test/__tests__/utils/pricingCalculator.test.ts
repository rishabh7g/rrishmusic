/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { 
  calculatePackagePricing,
  getPackageWithPricing,
  getAllPackagesWithPricing,
  comparePackages,
  formatPrice,
  getSavingsMessage,
  getRecommendedPackage,
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
      
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.finalPrice).toBeGreaterThan(0);
      expect(result.pricePerLesson).toBe(result.finalPrice);
      expect(result.savingsPercentage).toBe(0); // No discount for single lesson
    });

    it('should apply discounts for bulk packages', () => {
      const result = calculatePackagePricing(8);
      
      expect(result.basePrice).toBeGreaterThan(result.finalPrice);
      expect(result.savings).toBeGreaterThan(0);
      expect(result.savingsPercentage).toBeGreaterThan(0);
      expect(result.discountApplied).toBe(true);
    });

    it('should handle custom discount rates', () => {
      const result = calculatePackagePricing(4, {
        customDiscountRate: 0.15 // 15% custom discount
      });
      
      expect(result.savingsPercentage).toBe(15);
      expect(result.discountApplied).toBe(true);
    });

    it('should calculate price per lesson correctly', () => {
      const sessions = 8;
      const result = calculatePackagePricing(sessions);
      
      expect(result.pricePerLesson).toBeCloseTo(result.finalPrice / sessions, 2);
    });

    it('should handle loyalty discounts', () => {
      const baseResult = calculatePackagePricing(4);
      const loyaltyResult = calculatePackagePricing(4, { loyaltyDiscount: 0.05 });
      
      expect(loyaltyResult.finalPrice).toBeLessThan(baseResult.finalPrice);
    });
  });

  describe('getPackageWithPricing', () => {
    it('should return package with pricing for valid package ID', () => {
      const packageWithPricing = getPackageWithPricing('transformation');
      
      expect(packageWithPricing).toBeDefined();
      expect(packageWithPricing?.pricing).toBeDefined();
      expect(packageWithPricing?.sessions).toBeGreaterThan(0);
    });

    it('should return null for invalid package ID', () => {
      const packageWithPricing = getPackageWithPricing('invalid-id');
      expect(packageWithPricing).toBeNull();
    });

    it('should include pricing calculations in package', () => {
      const packageWithPricing = getPackageWithPricing('foundation');
      
      if (packageWithPricing) {
        expect(packageWithPricing.pricing.basePrice).toBeGreaterThan(0);
        expect(packageWithPricing.pricing.finalPrice).toBeGreaterThan(0);
        expect(packageWithPricing.pricing.pricePerLesson).toBeGreaterThan(0);
      }
    });
  });

  describe('getAllPackagesWithPricing', () => {
    it('should return all packages with pricing', () => {
      const packages = getAllPackagesWithPricing();
      
      expect(packages).toBeInstanceOf(Array);
      expect(packages.length).toBe(TEACHING_PRICING_CONFIG.packages.length);
      
      packages.forEach(pkg => {
        expect(pkg.pricing).toBeDefined();
        expect(pkg.pricing.basePrice).toBeGreaterThan(0);
      });
    });

    it('should include pricing options for all packages', () => {
      const packages = getAllPackagesWithPricing();
      
      packages.forEach(pkg => {
        expect(pkg.pricing.finalPrice).toBeGreaterThan(0);
        expect(pkg.pricing.pricePerLesson).toBeGreaterThan(0);
        expect(pkg.pricing.savingsPercentage).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('comparePackages', () => {
    it('should compare two valid packages', () => {
      const comparison = comparePackages('foundation', 'transformation');
      
      expect(comparison).toBeDefined();
      expect(comparison.package1).toBeDefined();
      expect(comparison.package2).toBeDefined();
      expect(comparison.savings).toBeDefined();
      expect(comparison.recommendation).toBeDefined();
    });

    it('should handle invalid package comparisons', () => {
      const comparison = comparePackages('invalid1', 'invalid2');
      expect(comparison).toBeNull();
    });

    it('should provide value comparison', () => {
      const comparison = comparePackages('single', 'transformation');
      
      if (comparison) {
        expect(comparison.savings.absoluteSavings).toBeGreaterThan(0);
        expect(comparison.savings.percentageSavings).toBeGreaterThan(0);
      }
    });
  });

  describe('formatPrice', () => {
    it('should format prices without cents by default', () => {
      expect(formatPrice(100)).toBe('$100');
      expect(formatPrice(100.50)).toBe('$101'); // Rounded
    });

    it('should format prices with cents when requested', () => {
      expect(formatPrice(100.50, true)).toBe('$100.50');
      expect(formatPrice(100, true)).toBe('$100.00');
    });

    it('should handle zero and negative values', () => {
      expect(formatPrice(0)).toBe('$0');
      expect(formatPrice(-100)).toBe('-$100');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1000)).toBe('$1000');
      expect(formatPrice(10000)).toBe('$10000');
    });
  });

  describe('getSavingsMessage', () => {
    it('should generate savings message for packages with savings', () => {
      const pricingWithSavings = {
        basePrice: 400,
        finalPrice: 360,
        savings: 40,
        savingsPercentage: 10,
        pricePerLesson: 45,
        totalValue: 400,
        discountApplied: true
      };

      const message = getSavingsMessage(pricingWithSavings);
      
      expect(message).toContain('$40');
      expect(message).toContain('10%');
    });

    it('should handle packages without savings', () => {
      const pricingWithoutSavings = {
        basePrice: 50,
        finalPrice: 50,
        savings: 0,
        savingsPercentage: 0,
        pricePerLesson: 50,
        totalValue: 50,
        discountApplied: false
      };

      const message = getSavingsMessage(pricingWithoutSavings);
      expect(message).toBe('');
    });
  });

  describe('getRecommendedPackage', () => {
    it('should recommend a package based on criteria', () => {
      const recommendation = getRecommendedPackage();
      
      expect(recommendation).toBeDefined();
      expect(recommendation.id).toBeDefined();
      expect(recommendation.reasonCode).toBeDefined();
      expect(recommendation.benefits).toBeInstanceOf(Array);
    });

    it('should provide meaningful recommendation reasons', () => {
      const recommendation = getRecommendedPackage();
      
      expect(recommendation.reasonCode).toMatch(/popular|value|beginner|advanced/);
      expect(recommendation.benefits.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero sessions gracefully', () => {
      expect(() => calculatePackagePricing(0)).not.toThrow();
      
      const result = calculatePackagePricing(0);
      expect(result.basePrice).toBe(0);
      expect(result.finalPrice).toBe(0);
    });

    it('should handle very large session counts', () => {
      expect(() => calculatePackagePricing(1000)).not.toThrow();
      
      const result = calculatePackagePricing(1000);
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.discountApplied).toBe(true);
    });

    it('should handle null and undefined options', () => {
      expect(() => calculatePackagePricing(4, null as any)).not.toThrow();
      expect(() => calculatePackagePricing(4, undefined)).not.toThrow();
    });

    it('should validate discount rates', () => {
      // Test with invalid discount rate
      const result = calculatePackagePricing(4, {
        customDiscountRate: 2.0 // 200% - should be capped
      });
      
      // Discount should be reasonable
      expect(result.savingsPercentage).toBeLessThan(100);
    });
  });

  describe('Performance', () => {
    it('should calculate pricing efficiently for large batch', () => {
      const startTime = Date.now();
      
      for (let i = 1; i <= 100; i++) {
        calculatePackagePricing(i);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle concurrent calculations', async () => {
      const promises = Array(50).fill(null).map((_, i) =>
        Promise.resolve(calculatePackagePricing(i + 1))
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(50);
      
      results.forEach((result) => {
        expect(result.basePrice).toBeGreaterThan(0);
      });
    });
  });
});