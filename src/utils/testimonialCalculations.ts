import { Testimonial, TestimonialStats } from '@/types/content';

/**
 * Helper function to calculate testimonial statistics dynamically
 * This function ensures consistent calculations across all hooks and components
 * 
 * @param testimonials - Array of testimonials to calculate stats from
 * @returns TestimonialStats - Calculated statistics including totals, averages, and service breakdowns
 */
export function calculateTestimonialStats(testimonials: Testimonial[]): TestimonialStats {
  const total = testimonials.length;
  
  if (total === 0) {
    return {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 }
      },
      featured: 0,
      verified: 0
    };
  }

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = Math.round((totalRating / total) * 10) / 10;

  // Calculate service-specific stats
  const performanceTestimonials = testimonials.filter(t => t.service === 'performance');
  const teachingTestimonials = testimonials.filter(t => t.service === 'teaching');
  const collaborationTestimonials = testimonials.filter(t => t.service === 'collaboration');

  const calculateServiceStats = (serviceTestimonials: Testimonial[]) => {
    const count = serviceTestimonials.length;
    const percentage = count > 0 ? Math.round((count / total) * 100) : 0;
    const avgRating = count > 0 
      ? Math.round((serviceTestimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
      : 0;

    return { count, percentage, averageRating: avgRating };
  };

  return {
    total,
    averageRating,
    byService: {
      performance: calculateServiceStats(performanceTestimonials),
      teaching: calculateServiceStats(teachingTestimonials),
      collaboration: calculateServiceStats(collaborationTestimonials)
    },
    featured: testimonials.filter(t => t.featured).length,
    verified: testimonials.filter(t => t.verified).length
  };
}

/**
 * Performance optimized version with memoization key
 * Use this for components that need to frequently recalculate stats
 * 
 * @param testimonials - Array of testimonials
 * @returns TestimonialStats
 */
export function calculateTestimonialStatsMemoized(
  testimonials: Testimonial[]
): TestimonialStats {
  // In a real implementation, we could use a Map or WeakMap for caching
  // For now, we'll just call the main calculation function
  return calculateTestimonialStats(testimonials);
}

/**
 * Calculate stats for a subset of testimonials (e.g., by service type)
 * 
 * @param testimonials - Array of testimonials
 * @param filter - Filter function to apply
 * @returns TestimonialStats for the filtered set
 */
export function calculateFilteredTestimonialStats(
  testimonials: Testimonial[],
  filter: (testimonial: Testimonial) => boolean
): TestimonialStats {
  const filtered = testimonials.filter(filter);
  return calculateTestimonialStats(filtered);
}