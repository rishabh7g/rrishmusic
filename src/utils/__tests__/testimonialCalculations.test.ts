import { calculateTestimonialStats, calculateFilteredTestimonialStats } from '../testimonialCalculations';
import { Testimonial } from '../../types/content';

describe('testimonialCalculations', () => {
  const mockTestimonials: Testimonial[] = [
    {
      id: 'test-1',
      name: 'John Doe',
      text: 'Great performance!',
      rating: 5,
      service: 'performance',
      featured: true,
      verified: true,
      date: '2024-01-01'
    },
    {
      id: 'test-2',
      name: 'Jane Smith',
      text: 'Excellent teaching!',
      rating: 5,
      service: 'teaching',
      featured: true,
      verified: true,
      date: '2024-01-02'
    },
    {
      id: 'test-3',
      name: 'Bob Johnson',
      text: 'Good collaboration!',
      rating: 4,
      service: 'collaboration',
      featured: false,
      verified: true,
      date: '2024-01-03'
    },
    {
      id: 'test-4',
      name: 'Alice Brown',
      text: 'Another great performance!',
      rating: 5,
      service: 'performance',
      featured: true,
      verified: true,
      date: '2024-01-04'
    }
  ];

  describe('calculateTestimonialStats', () => {
    test('should calculate correct stats for non-empty testimonials array', () => {
      const result = calculateTestimonialStats(mockTestimonials);

      expect(result).toEqual({
        total: 4,
        averageRating: 4.8, // (5+5+4+5)/4 = 4.75, rounded to 4.8
        byService: {
          performance: {
            count: 2,
            percentage: 50,
            averageRating: 5.0
          },
          teaching: {
            count: 1,
            percentage: 25,
            averageRating: 5.0
          },
          collaboration: {
            count: 1,
            percentage: 25,
            averageRating: 4.0
          }
        },
        featured: 3,
        verified: 4
      });
    });

    test('should return zero stats for empty testimonials array', () => {
      const result = calculateTestimonialStats([]);

      expect(result).toEqual({
        total: 0,
        averageRating: 0,
        byService: {
          performance: { count: 0, percentage: 0, averageRating: 0 },
          teaching: { count: 0, percentage: 0, averageRating: 0 },
          collaboration: { count: 0, percentage: 0, averageRating: 0 }
        },
        featured: 0,
        verified: 0
      });
    });

    test('should handle testimonials with only one service', () => {
      const performanceOnlyTestimonials: Testimonial[] = [
        {
          id: 'perf-1',
          name: 'Test User',
          text: 'Great!',
          rating: 4,
          service: 'performance',
          featured: true,
          verified: true,
          date: '2024-01-01'
        },
        {
          id: 'perf-2',
          name: 'Test User 2',
          text: 'Excellent!',
          rating: 5,
          service: 'performance',
          featured: false,
          verified: false,
          date: '2024-01-02'
        }
      ];

      const result = calculateTestimonialStats(performanceOnlyTestimonials);

      expect(result).toEqual({
        total: 2,
        averageRating: 4.5,
        byService: {
          performance: {
            count: 2,
            percentage: 100,
            averageRating: 4.5
          },
          teaching: {
            count: 0,
            percentage: 0,
            averageRating: 0
          },
          collaboration: {
            count: 0,
            percentage: 0,
            averageRating: 0
          }
        },
        featured: 1,
        verified: 1
      });
    });

    test('should calculate correct percentages for uneven distributions', () => {
      const unevenTestimonials: Testimonial[] = [
        ...Array(7).fill(null).map((_, i) => ({
          id: `perf-${i}`,
          name: `Performance User ${i}`,
          text: 'Great performance!',
          rating: 5,
          service: 'performance' as const,
          featured: true,
          verified: true,
          date: '2024-01-01'
        })),
        ...Array(2).fill(null).map((_, i) => ({
          id: `teach-${i}`,
          name: `Teaching User ${i}`,
          text: 'Great lesson!',
          rating: 5,
          service: 'teaching' as const,
          featured: false,
          verified: true,
          date: '2024-01-02'
        })),
        {
          id: 'collab-1',
          name: 'Collaboration User',
          text: 'Great collab!',
          rating: 4,
          service: 'collaboration' as const,
          featured: false,
          verified: true,
          date: '2024-01-03'
        }
      ];

      const result = calculateTestimonialStats(unevenTestimonials);

      expect(result.total).toBe(10);
      expect(result.byService.performance.count).toBe(7);
      expect(result.byService.performance.percentage).toBe(70);
      expect(result.byService.teaching.count).toBe(2);
      expect(result.byService.teaching.percentage).toBe(20);
      expect(result.byService.collaboration.count).toBe(1);
      expect(result.byService.collaboration.percentage).toBe(10);
    });
  });

  describe('calculateFilteredTestimonialStats', () => {
    test('should calculate stats for filtered testimonials', () => {
      const result = calculateFilteredTestimonialStats(
        mockTestimonials,
        (testimonial) => testimonial.featured === true
      );

      expect(result.total).toBe(3);
      expect(result.featured).toBe(3);
      expect(result.averageRating).toBe(5.0);
    });

    test('should calculate stats for service-specific filter', () => {
      const result = calculateFilteredTestimonialStats(
        mockTestimonials,
        (testimonial) => testimonial.service === 'performance'
      );

      expect(result.total).toBe(2);
      expect(result.byService.performance.count).toBe(2);
      expect(result.byService.performance.percentage).toBe(100);
      expect(result.byService.teaching.count).toBe(0);
      expect(result.byService.collaboration.count).toBe(0);
    });

    test('should return empty stats when filter matches nothing', () => {
      const result = calculateFilteredTestimonialStats(
        mockTestimonials,
        (testimonial) => testimonial.rating === 1 // No testimonials with rating 1
      );

      expect(result.total).toBe(0);
      expect(result.averageRating).toBe(0);
    });
  });

  describe('performance requirements', () => {
    test('should calculate stats within 100ms for large datasets', () => {
      // Generate a large dataset
      const largeTestimonials: Testimonial[] = Array(1000).fill(null).map((_, i) => ({
        id: `test-${i}`,
        name: `User ${i}`,
        text: `Review ${i}`,
        rating: (i % 5 + 1) as 1 | 2 | 3 | 4 | 5,
        service: ['performance', 'teaching', 'collaboration'][i % 3] as 'performance' | 'teaching' | 'collaboration',
        featured: i % 3 === 0,
        verified: i % 2 === 0,
        date: `2024-01-${String(i % 28 + 1).padStart(2, '0')}`
      }));

      const startTime = performance.now();
      const result = calculateTestimonialStats(largeTestimonials);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
      expect(result.total).toBe(1000);
      expect(result.averageRating).toBeGreaterThan(0);
    });

    test('should handle edge cases gracefully', () => {
      // Test with testimonials having missing optional fields
      const edgeCaseTestimonials: Testimonial[] = [
        {
          id: 'edge-1',
          name: 'User',
          text: 'Review',
          rating: 3,
          service: 'performance'
          // Missing featured, verified, date fields
        } as Testimonial,
        {
          id: 'edge-2',
          name: 'User 2',
          text: 'Review 2',
          rating: 4,
          service: 'teaching',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          featured: undefined as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          verified: undefined as any
        } as Testimonial
      ];

      const result = calculateTestimonialStats(edgeCaseTestimonials);

      expect(result.total).toBe(2);
      expect(result.averageRating).toBe(3.5);
      expect(result.featured).toBe(0); // Should handle undefined as falsy
      expect(result.verified).toBe(0); // Should handle undefined as falsy
    });
  });
});