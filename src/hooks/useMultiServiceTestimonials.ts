import { useState, useEffect, useMemo } from 'react'
import {
  Testimonial,
  TestimonialFilters,
  TestimonialStats,
  ServiceType,
} from '@/types/content'
import { calculateTestimonialStats } from '@/utils/dataCalculator'

// Import testimonials and service configuration
import testimonialsData from '@/content/testimonials.json'
import serviceConfig from '@/content/serviceConfiguration.json'

interface TestimonialData {
  testimonials: Testimonial[]
  stats: TestimonialStats
}

interface UseMultiServiceTestimonialsResult {
  testimonials: Testimonial[]
  filteredTestimonials: Testimonial[]
  stats: TestimonialStats
  loading: boolean
  error: string | null
  filterTestimonials: (filters: TestimonialFilters) => Testimonial[]
  getTestimonialsByService: (service: ServiceType) => Testimonial[]
  getFeaturedTestimonials: (limit?: number) => Testimonial[]
  getServiceStats: (
    service?: ServiceType
  ) => TestimonialStats | TestimonialStats['byService'][ServiceType] | null
}

/**
 * Custom hook for managing multi-service testimonials
 *
 * Features:
 * - Loads testimonials from testimonials.json
 * - Provides filtering by service, sub-type, rating, etc.
 * - Calculates statistics dynamically in real-time
 * - Implements 60/25/15 service allocation
 * - Handles loading and error states
 * - Optimized performance with memoization
 */
export function useMultiServiceTestimonials(
  defaultFilters: TestimonialFilters = {}
): UseMultiServiceTestimonialsResult {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Process testimonials data with dynamic stats calculation
  const data = useMemo((): TestimonialData => {
    try {
      const testimonials = testimonialsData.testimonials as Testimonial[]

      // Calculate stats dynamically from testimonials array
      const stats = calculateTestimonialStats(testimonials)

      return {
        testimonials,
        stats,
      }
    } catch (err) {
      console.error('Error processing testimonials data:', err)
      throw err
    }
  }, [])

  // Initialize loading state
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Validate data structure
        if (!data.testimonials || !Array.isArray(data.testimonials)) {
          throw new Error('Invalid testimonials data structure')
        }

        // Validate service configuration
        if (!serviceConfig.serviceAllocation) {
          throw new Error('Invalid service configuration')
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to load testimonials:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setLoading(false)
      }
    }

    initializeData()
  }, [data])

  // Filter testimonials based on criteria
  const filterTestimonials = useMemo(() => {
    return (filters: TestimonialFilters): Testimonial[] => {
      if (!data?.testimonials) return []

      let filtered = [...data.testimonials]

      // Apply service filter
      if (filters.service) {
        filtered = filtered.filter(
          testimonial => testimonial.service === filters.service
        )
      }

      // Apply service sub-type filter
      if (filters.serviceSubType) {
        filtered = filtered.filter(
          testimonial => testimonial.serviceSubType === filters.serviceSubType
        )
      }

      // Apply featured filter
      if (typeof filters.featured === 'boolean') {
        filtered = filtered.filter(
          testimonial => testimonial.featured === filters.featured
        )
      }

      // Apply verified filter
      if (typeof filters.verified === 'boolean') {
        filtered = filtered.filter(
          testimonial => testimonial.verified === filters.verified
        )
      }

      // Apply minimum rating filter
      if (filters.minRating) {
        filtered = filtered.filter(
          testimonial => testimonial.rating >= filters.minRating!
        )
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'date'
      const sortOrder = filters.sortOrder || 'desc'

      filtered.sort((a, b) => {
        let aVal: string | number
        let bVal: string | number

        switch (sortBy) {
          case 'date':
            aVal = new Date(a.date || '1970-01-01').getTime()
            bVal = new Date(b.date || '1970-01-01').getTime()
            break
          case 'rating':
            aVal = a.rating
            bVal = b.rating
            break
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          default:
            aVal = 0
            bVal = 0
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      // Apply limit
      if (filters.limit && filters.limit > 0) {
        filtered = filtered.slice(0, filters.limit)
      }

      return filtered
    }
  }, [data])

  // Get testimonials by specific service
  const getTestimonialsByService = useMemo(() => {
    return (service: ServiceType): Testimonial[] => {
      return filterTestimonials({ service })
    }
  }, [filterTestimonials])

  // Get featured testimonials with service allocation
  const getFeaturedTestimonials = useMemo(() => {
    return (limit = 10): Testimonial[] => {
      // Implement 60/25/15 service allocation for featured testimonials
      const performanceLimit = Math.ceil(limit * 0.6)
      const teachingLimit = Math.ceil(limit * 0.25)
      const collaborationLimit = Math.ceil(limit * 0.15)

      const performanceTestimonials = filterTestimonials({
        service: 'performance',
        featured: true,
        limit: performanceLimit,
        sortBy: 'date',
        sortOrder: 'desc',
      })

      const teachingTestimonials = filterTestimonials({
        service: 'teaching',
        featured: true,
        limit: teachingLimit,
        sortBy: 'date',
        sortOrder: 'desc',
      })

      const collaborationTestimonials = filterTestimonials({
        service: 'collaboration',
        featured: true,
        limit: collaborationLimit,
        sortBy: 'date',
        sortOrder: 'desc',
      })

      return [
        ...performanceTestimonials,
        ...teachingTestimonials,
        ...collaborationTestimonials,
      ]
    }
  }, [filterTestimonials])

  // Get statistics for a specific service
  const getServiceStats = useMemo(() => {
    return (
      service?: ServiceType
    ): TestimonialStats | TestimonialStats['byService'][ServiceType] | null => {
      if (!data) return null

      if (service) {
        return data.stats.byService[service]
      }

      return data.stats
    }
  }, [data])

  // Apply default filters to get filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return filterTestimonials(defaultFilters)
  }, [filterTestimonials, defaultFilters])

  return {
    testimonials: data?.testimonials || [],
    filteredTestimonials,
    stats: data?.stats || {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 },
      },
      featured: 0,
      verified: 0,
    },
    loading,
    error,
    filterTestimonials,
    getTestimonialsByService,
    getFeaturedTestimonials,
    getServiceStats,
  }
}

export default useMultiServiceTestimonials
