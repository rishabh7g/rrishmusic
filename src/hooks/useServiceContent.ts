import { useState, useEffect, useMemo } from 'react'
import { useSectionContent } from './useContent'
import useMultiServiceTestimonials from './useMultiServiceTestimonials'
import { ServiceType, Testimonial } from '@/types/content'

export interface ServiceContentStats {
  totalTestimonials: number
  averageRating: number
  totalLessons?: number
  yearsExperience?: number
  successfulProjects?: number
}

export interface ServiceContentData {
  id: ServiceType
  title: string
  description: string
  features: string[]
  stats: ServiceContentStats
  testimonials: Testimonial[]
  pricing?: {
    from: number
    packages?: number
    currency: string
  }
  callToAction: {
    text: string
    href: string
  }
}

export interface UseServiceContentResult {
  data: ServiceContentData | null
  loading: boolean
  error: string | null
}

interface LessonPackage {
  price?: number
  [key: string]: unknown
}

interface LessonsContent {
  packages?: LessonPackage[]
  [key: string]: unknown
}

/**
 * Custom hook for loading service-specific content
 * Integrates data from multiple sources: testimonials, lessons, performance, etc.
 *
 * Features:
 * - Loads content for specific service types
 * - Combines testimonials, stats, and service data
 * - Provides loading and error states
 * - Optimized with memoization
 * - Service-specific pricing and CTA information
 */
export function useServiceContent(
  service: ServiceType
): UseServiceContentResult {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load content based on service type
  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useSectionContent('lessons')
  const {
    data: performanceData,
    loading: performanceLoading,
    error: performanceError,
  } = useSectionContent('performance')

  // Load testimonials
  const {
    getTestimonialsByService,
    getServiceStats,
    loading: testimonialsLoading,
    error: testimonialsError,
  } = useMultiServiceTestimonials()

  // Memoized service content data
  const serviceContent = useMemo((): ServiceContentData | null => {
    try {
      if (service === 'teaching') {
        if (!lessonsData) return null

        const teachingTestimonials = getTestimonialsByService('teaching')
        const teachingStats = getServiceStats('teaching')
        const typedLessonsData = lessonsData as LessonsContent

        return {
          id: 'teaching',
          title: 'Guitar Lessons',
          description:
            'Personalized guitar instruction focused on blues techniques, improvisation, and musical expression. Learn from a professional performer with proven teaching methods.',
          features: [
            'One-on-One Lessons',
            'Blues Techniques',
            'Improvisation Skills',
            'Theory & Practice',
            'Flexible Scheduling',
          ],
          stats: {
            totalTestimonials: teachingTestimonials.length,
            averageRating: teachingStats?.averageRating || 4.9,
            totalLessons: typedLessonsData.packages?.length || 4,
            yearsExperience: 10,
          },
          testimonials: teachingTestimonials.slice(0, 3),
          pricing: {
            from:
              typedLessonsData.packages?.reduce(
                (min: number, pkg: LessonPackage) =>
                  Math.min(min, pkg.price || Infinity),
                Infinity
              ) || 50,
            packages: typedLessonsData.packages?.length || 4,
            currency: 'AUD',
          },
          callToAction: {
            text: 'Book a Lesson',
            href: '/teaching',
          },
        }
      }

      if (service === 'performance') {
        if (!performanceData) return null

        const performanceTestimonials = getTestimonialsByService('performance')
        const performanceStats = getServiceStats('performance')

        return {
          id: 'performance',
          title: 'Live Performances',
          description:
            'Professional live music for venues, events, and celebrations. Authentic blues guitar with engaging stage presence that creates memorable experiences for any audience.',
          features: [
            'Venues & Events',
            'Private Functions',
            'Corporate Entertainment',
            'Wedding Performances',
            'Custom Setlists',
          ],
          stats: {
            totalTestimonials: performanceTestimonials.length,
            averageRating: performanceStats?.averageRating || 4.9,
            successfulProjects: 150,
            yearsExperience: 10,
          },
          testimonials: performanceTestimonials.slice(0, 3),
          pricing: {
            from: 200,
            currency: 'AUD',
          },
          callToAction: {
            text: 'Book Performance',
            href: '/performance',
          },
        }
      }

      if (service === 'collaboration') {
        const collaborationTestimonials =
          getTestimonialsByService('collaboration')
        const collaborationStats = getServiceStats('collaboration')

        return {
          id: 'collaboration',
          title: 'Musical Collaboration',
          description:
            'Creative musical partnerships for recordings, compositions, and artistic projects. Bringing blues guitar expertise to enhance your musical vision.',
          features: [
            'Studio Sessions',
            'Composition Support',
            'Creative Projects',
            'Recording Assistance',
            'Artistic Partnership',
          ],
          stats: {
            totalTestimonials: collaborationTestimonials.length,
            averageRating: collaborationStats?.averageRating || 4.8,
            successfulProjects: 75,
            yearsExperience: 8,
          },
          testimonials: collaborationTestimonials.slice(0, 3),
          pricing: {
            from: 150,
            currency: 'AUD',
          },
          callToAction: {
            text: 'Start Collaboration',
            href: '/collaboration',
          },
        }
      }

      return null
    } catch (err) {
      console.error(`Error processing content for ${service}:`, err)
      return null
    }
  }, [
    service,
    lessonsData,
    performanceData,
    getTestimonialsByService,
    getServiceStats,
  ])

  // Update loading and error states
  useEffect(() => {
    const isLoading =
      lessonsLoading || performanceLoading || testimonialsLoading
    const hasError = lessonsError || performanceError || testimonialsError

    setLoading(isLoading)
    setError(hasError || null)
  }, [
    lessonsLoading,
    performanceLoading,
    testimonialsLoading,
    lessonsError,
    performanceError,
    testimonialsError,
  ])

  return {
    data: serviceContent,
    loading,
    error,
  }
}

export default useServiceContent
