import { useState, useEffect, useMemo } from 'react';
import { Testimonial, TestimonialFilters, TestimonialStats, ServiceType } from '@/types/content';

// Import testimonials and service configuration
import testimonialsData from '@/content/testimonials.json';
import serviceConfig from '@/data/serviceConfiguration.json';

interface TestimonialData {
  testimonials: Testimonial[];
  stats: TestimonialStats;
}

interface UseMultiServiceTestimonialsResult {
  testimonials: Testimonial[];
  filteredTestimonials: Testimonial[];
  stats: TestimonialStats;
  loading: boolean;
  error: string | null;
  filterTestimonials: (filters: TestimonialFilters) => Testimonial[];
  getTestimonialsByService: (service: ServiceType) => Testimonial[];
  getFeaturedTestimonials: (limit?: number) => Testimonial[];
  getServiceStats: (service?: ServiceType) => TestimonialStats | TestimonialStats['byService'][ServiceType] | null;
}

/**
 * Custom hook for managing multi-service testimonials
 * 
 * Features:
 * - Loads testimonials from testimonials.json
 * - Provides filtering by service, sub-type, rating, etc.
 * - Calculates statistics across all services
 * - Implements 60/25/15 service allocation
 * - Handles loading and error states
 * - Optimized performance with memoization
 */
export function useMultiServiceTestimonials(
  defaultFilters: TestimonialFilters = {}
): UseMultiServiceTestimonialsResult {
  const [data, setData] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load testimonials data
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate data structure
        if (!testimonialsData.testimonials || !Array.isArray(testimonialsData.testimonials)) {
          throw new Error('Invalid testimonials data structure');
        }

        const testimonials: Testimonial[] = testimonialsData.testimonials;
        
        // Calculate statistics
        const stats = calculateTestimonialStats(testimonials);

        setData({
          testimonials,
          stats
        });
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Filter testimonials based on provided filters
  const filterTestimonials = useMemo(() => {
    return (filters: TestimonialFilters): Testimonial[] => {
      if (!data) return [];

      let filtered = data.testimonials.filter(testimonial => {
        // Service filter
        if (filters.service && testimonial.service !== filters.service) {
          return false;
        }

        // Sub-type filter
        if (filters.serviceSubType && testimonial.serviceSubType !== filters.serviceSubType) {
          return false;
        }

        // Featured filter
        if (filters.featured !== undefined && testimonial.featured !== filters.featured) {
          return false;
        }

        // Verified filter
        if (filters.verified !== undefined && testimonial.verified !== filters.verified) {
          return false;
        }

        // Rating filter
        if (filters.minRating && testimonial.rating < filters.minRating) {
          return false;
        }

        return true;
      });

      // Sort testimonials
      const sortBy = filters.sortBy || 'date';
      const sortOrder = filters.sortOrder || 'desc';

      filtered.sort((a, b) => {
        // First, prioritize featured testimonials
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        let comparison = 0;

        switch (sortBy) {
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
          default:
            if (a.date && b.date) {
              comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            break;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // Apply limit
      if (filters.limit) {
        filtered = filtered.slice(0, filters.limit);
      }

      return filtered;
    };
  }, [data]);

  // Get testimonials by service
  const getTestimonialsByService = useMemo(() => {
    return (service: ServiceType): Testimonial[] => {
      return filterTestimonials({ service });
    };
  }, [filterTestimonials]);

  // Get featured testimonials with service allocation
  const getFeaturedTestimonials = useMemo(() => {
    return (limit: number = 9): Testimonial[] => {
      if (!data) return [];

      // Apply service allocation from configuration
      const performanceSlots = Math.ceil(limit * (serviceConfig.serviceAllocation.performance.percentage / 100));
      const teachingSlots = Math.ceil(limit * (serviceConfig.serviceAllocation.teaching.percentage / 100));
      const collaborationSlots = Math.floor(limit * (serviceConfig.serviceAllocation.collaboration.percentage / 100));

      const performanceTestimonials = filterTestimonials({
        service: 'performance',
        featured: true,
        limit: performanceSlots,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      const teachingTestimonials = filterTestimonials({
        service: 'teaching',
        featured: true,
        limit: teachingSlots,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      const collaborationTestimonials = filterTestimonials({
        service: 'collaboration',
        featured: true,
        limit: collaborationSlots,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      return [...performanceTestimonials, ...teachingTestimonials, ...collaborationTestimonials];
    };
  }, [filterTestimonials, data]);

  // Get statistics for a specific service
  const getServiceStats = useMemo(() => {
    return (service?: ServiceType): TestimonialStats | TestimonialStats['byService'][ServiceType] | null => {
      if (!data) return null;

      if (service) {
        return data.stats.byService[service];
      }

      return data.stats;
    };
  }, [data]);

  // Apply default filters to get filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return filterTestimonials(defaultFilters);
  }, [filterTestimonials, defaultFilters]);

  return {
    testimonials: data?.testimonials || [],
    filteredTestimonials,
    stats: data?.stats || {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 }
      },
      featured: 0,
      verified: 0
    },
    loading,
    error,
    filterTestimonials,
    getTestimonialsByService,
    getFeaturedTestimonials,
    getServiceStats
  };
}

/**
 * Helper function to calculate testimonial statistics
 */
function calculateTestimonialStats(testimonials: Testimonial[]): TestimonialStats {
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

export default useMultiServiceTestimonials;