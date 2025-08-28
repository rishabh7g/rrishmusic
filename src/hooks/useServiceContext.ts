import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ServiceType,
  ServiceContextState,
  ServiceContextActions,
  ServiceContextualData,
} from '@/types/serviceContext'

/**
 * Service context configuration data
 */
const SERVICE_CONTEXT_DATA: Record<ServiceType, ServiceContextualData> = {
  home: {
    service: 'home',
    name: 'Rrish Music',
    description: 'Professional Melbourne musician - Performances & Teaching',
    primaryColor: 'var(--brand-blue-primary)',
    secondaryColor: 'var(--brand-yellow-accent)',
    navigationItems: [
      {
        id: 'home',
        label: 'Home',
        href: '/',
        type: 'route',
        highlighted: true,
      },
      {
        id: 'performances',
        label: 'Performances',
        href: '/performance',
        type: 'route',
      },
      { id: 'teaching', label: 'Lessons', href: '/teaching', type: 'route' },
      {
        id: 'collaboration',
        label: 'Collaboration',
        href: '/collaboration',
        type: 'route',
      },
      { id: 'about', label: 'About', href: '#about', type: 'anchor' },
      { id: 'contact', label: 'Contact', href: '#contact', type: 'anchor' },
    ],
    primaryCTA: {
      text: 'Explore Services',
      href: '#services',
      type: 'anchor',
      variant: 'primary',
    },
    secondaryCTA: {
      text: 'Contact',
      href: '#contact',
      type: 'anchor',
      variant: 'outline',
    },
  },

  teaching: {
    service: 'teaching',
    name: 'Guitar Lessons',
    description: 'Professional guitar instruction for all skill levels',
    primaryColor: 'var(--brand-orange-warm)',
    secondaryColor: 'var(--brand-yellow-accent)',
    navigationItems: [
      { id: 'home', label: 'Home', href: '/', type: 'route' },
      {
        id: 'teaching',
        label: 'Lessons',
        href: '/teaching',
        type: 'route',
        highlighted: true,
      },
      { id: 'packages', label: 'Packages', href: '#lessons', type: 'anchor' },
      { id: 'approach', label: 'Approach', href: '#approach', type: 'anchor' },
      { id: 'about', label: 'About', href: '#about', type: 'anchor' },
      { id: 'contact', label: 'Book Lesson', href: '#contact', type: 'anchor' },
    ],
    primaryCTA: {
      text: 'Book Your First Lesson',
      href: '#contact',
      type: 'anchor',
      variant: 'primary',
      icon: 'calendar',
    },
    secondaryCTA: {
      text: 'View Packages',
      href: '#lessons',
      type: 'anchor',
      variant: 'outline',
    },
  },

  performance: {
    service: 'performance',
    name: 'Live Performances',
    description:
      'Professional live music for venues, events, and private functions',
    primaryColor: 'var(--brand-blue-primary)',
    secondaryColor: 'var(--brand-yellow-accent)',
    navigationItems: [
      { id: 'home', label: 'Home', href: '/', type: 'route' },
      {
        id: 'performance',
        label: 'Performances',
        href: '/performance',
        type: 'route',
        highlighted: true,
      },
      { id: 'gallery', label: 'Gallery', href: '#gallery', type: 'anchor' },
      { id: 'events', label: 'Events', href: '#events', type: 'anchor' },
      { id: 'about', label: 'About', href: '#about', type: 'anchor' },
      {
        id: 'contact',
        label: 'Book Performance',
        href: '#contact',
        type: 'anchor',
      },
    ],
    primaryCTA: {
      text: 'Book Performance',
      href: '#contact',
      type: 'anchor',
      variant: 'primary',
      icon: 'music',
    },
    secondaryCTA: {
      text: 'View Gallery',
      href: '#gallery',
      type: 'anchor',
      variant: 'outline',
    },
  },

  collaboration: {
    service: 'collaboration',
    name: 'Musical Collaboration',
    description:
      'Professional collaboration for artists, studios, and creative projects',
    primaryColor: 'var(--brand-green-success)',
    secondaryColor: 'var(--brand-yellow-accent)',
    navigationItems: [
      { id: 'home', label: 'Home', href: '/', type: 'route' },
      {
        id: 'collaboration',
        label: 'Collaboration',
        href: '/collaboration',
        type: 'route',
        highlighted: true,
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        href: '#portfolio',
        type: 'anchor',
      },
      { id: 'process', label: 'Process', href: '#process', type: 'anchor' },
      { id: 'about', label: 'About', href: '#about', type: 'anchor' },
      {
        id: 'contact',
        label: 'Start Project',
        href: '#contact',
        type: 'anchor',
      },
    ],
    primaryCTA: {
      text: 'Start Collaboration',
      href: '#contact',
      type: 'anchor',
      variant: 'primary',
      icon: 'users',
    },
    secondaryCTA: {
      text: 'View Portfolio',
      href: '#portfolio',
      type: 'anchor',
      variant: 'outline',
    },
  },
}

/**
 * Determines service type based on current route
 */
const getServiceFromPath = (pathname: string): ServiceType => {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/teaching')) return 'teaching'
  if (pathname.startsWith('/performance')) return 'performance'
  if (pathname.startsWith('/collaboration')) return 'collaboration'
  return 'home' // fallback
}

/**
 * Custom hook for managing service context
 */
export const useServiceContext = (): ServiceContextState &
  ServiceContextActions => {
  const location = useLocation()
  const [state, setState] = useState<ServiceContextState>(() => ({
    currentService: getServiceFromPath(location.pathname),
    services: SERVICE_CONTEXT_DATA,
    isTransitioning: false,
    previousService: undefined,
  }))

  /**
   * Update service context based on route changes
   */
  useEffect(() => {
    const newService = getServiceFromPath(location.pathname)

    if (newService !== state.currentService) {
      setState(prev => ({
        ...prev,
        previousService: prev.currentService,
        currentService: newService,
        isTransitioning: true,
      }))

      // End transition after animation duration
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isTransitioning: false,
          previousService: undefined,
        }))
      }, 300) // Match transition duration

      return () => clearTimeout(timer)
    }
  }, [location.pathname, state.currentService])

  /**
   * Manually set service context
   */
  const setService = useCallback((service: ServiceType) => {
    setState(prev => ({
      ...prev,
      previousService: prev.currentService,
      currentService: service,
      isTransitioning: true,
    }))

    // End transition after animation duration
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        previousService: undefined,
      }))
    }, 300)
  }, [])

  /**
   * Get contextual data for a specific service
   */
  const getServiceData = useCallback(
    (service: ServiceType): ServiceContextualData => {
      return SERVICE_CONTEXT_DATA[service]
    },
    []
  )

  /**
   * Check if a service is currently active
   */
  const isServiceActive = useCallback(
    (service: ServiceType): boolean => {
      return state.currentService === service
    },
    [state.currentService]
  )

  /**
   * Get navigation items for current service
   */
  const getCurrentNavigation = useCallback(() => {
    return state.services[state.currentService].navigationItems
  }, [state.currentService, state.services])

  /**
   * Get primary CTA for current service
   */
  const getCurrentPrimaryCTA = useCallback(() => {
    return state.services[state.currentService].primaryCTA
  }, [state.currentService, state.services])

  /**
   * Get secondary CTA for current service (if available)
   */
  const getCurrentSecondaryCTA = useCallback(() => {
    return state.services[state.currentService].secondaryCTA
  }, [state.currentService, state.services])

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...state,
      setService,
      getServiceData,
      isServiceActive,
      getCurrentNavigation,
      getCurrentPrimaryCTA,
      getCurrentSecondaryCTA,
    }),
    [
      state,
      setService,
      getServiceData,
      isServiceActive,
      getCurrentNavigation,
      getCurrentPrimaryCTA,
      getCurrentSecondaryCTA,
    ]
  )
}

export default useServiceContext
