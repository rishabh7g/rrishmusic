/**
 * Advanced device detection and responsive utilities hook
 *
 * Provides comprehensive device information, screen size detection,
 * and responsive utilities for React components.
 */
import { useState, useEffect, useCallback } from 'react'

/**
 * Device type classification based on screen width
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * Responsive breakpoint names matching Tailwind CSS
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Complete device information interface
 */
export interface DeviceInfo {
  deviceType: DeviceType
  screenWidth: number
  screenHeight: number
  breakpoint: Breakpoint
  isTouchDevice: boolean
  canHover: boolean
  isRetina: boolean
  pixelRatio: number
  orientation: 'portrait' | 'landscape'
  userAgent: string
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/**
 * Responsive breakpoints (matches Tailwind CSS)
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * Device type thresholds
 */
const DEVICE_THRESHOLDS = {
  tablet: 768,
  desktop: 1024,
} as const

/**
 * Determine device type from screen width
 */
const getDeviceType = (width: number): DeviceType => {
  if (width >= DEVICE_THRESHOLDS.desktop) return 'desktop'
  if (width >= DEVICE_THRESHOLDS.tablet) return 'tablet'
  return 'mobile'
}

/**
 * Get current breakpoint from screen width
 */
const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS['2xl']) return '2xl'
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * Detect if device supports touch interactions
 */
const getTouchCapability = (): boolean => {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error: Legacy property
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Extract user agent information
 */
const getUserAgentInfo = () => {
  if (typeof window === 'undefined' || !navigator.userAgent) {
    return {
      userAgent: '',
      isIOS: false,
      isAndroid: false,
    }
  }

  const userAgent = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isAndroid = /Android/.test(userAgent)

  return {
    userAgent,
    isIOS,
    isAndroid,
  }
}

/**
 * Check if device has hover capability
 */
const getHoverCapability = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check if matchMedia is available (may not be in test environments)
  if (!window.matchMedia) return false

  try {
    // Use CSS media query to detect hover capability
    return window.matchMedia('(hover: hover)').matches
  } catch {
    // Fallback if matchMedia fails
    return false
  }
}

/**
 * Get initial device information
 */
const getInitialDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      deviceType: 'desktop',
      screenWidth: 1024,
      screenHeight: 768,
      breakpoint: 'lg',
      isTouchDevice: false,
      canHover: true,
      isRetina: false,
      pixelRatio: 1,
      orientation: 'landscape',
      userAgent: '',
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    }
  }

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const deviceType = getDeviceType(screenWidth)
  const breakpoint = getBreakpoint(screenWidth)
  const isTouchDevice = getTouchCapability()
  const { userAgent, isIOS, isAndroid } = getUserAgentInfo()
  const canHover = getHoverCapability()
  const pixelRatio = window.devicePixelRatio || 1

  return {
    deviceType,
    screenWidth,
    screenHeight,
    breakpoint,
    isTouchDevice,
    canHover,
    isRetina: pixelRatio >= 2,
    pixelRatio,
    orientation: screenWidth > screenHeight ? 'landscape' : 'portrait',
    userAgent,
    isIOS,
    isAndroid,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  }
}

/**
 * Main device detection hook
 *
 * @returns Complete device information and responsive utilities
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const device = useDeviceDetection();
 *
 *   return (
 *     <div className={`
 *       ${device.isMobile ? 'p-4' : 'p-8'}
 *       ${device.canHover ? 'hover:bg-blue-50' : ''}
 *     `}>
 *       {device.isTablet ? 'Tablet View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getInitialDeviceInfo)

  const updateDeviceInfo = useCallback(() => {
    setDeviceInfo(getInitialDeviceInfo())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial setup
    updateDeviceInfo()

    // Add resize listener
    window.addEventListener('resize', updateDeviceInfo)

    // Add orientation change listener for mobile devices
    if ('orientationchange' in window) {
      window.addEventListener('orientationchange', updateDeviceInfo)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      if ('orientationchange' in window) {
        window.removeEventListener('orientationchange', updateDeviceInfo)
      }
    }
  }, [updateDeviceInfo])

  return deviceInfo
}

/**
 * Hook for responsive breakpoint detection
 *
 * @param breakpoint - Target breakpoint to check
 * @returns True if current screen is at or above the breakpoint
 *
 * @example
 * ```tsx
 * function ResponsiveText() {
 *   const isLargeScreen = useBreakpoint('lg');
 *
 *   return (
 *     <h1 className={isLargeScreen ? 'text-6xl' : 'text-4xl'}>
 *       Responsive Title
 *     </h1>
 *   );
 * }
 * ```
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const { screenWidth } = useDeviceDetection()
  return screenWidth >= BREAKPOINTS[breakpoint]
}

/**
 * Hook for device type detection
 *
 * @returns Object with boolean flags for each device type
 *
 * @example
 * ```tsx
 * function DeviceSpecificContent() {
 *   const { isMobile, isTablet, isDesktop } = useDeviceType();
 *
 *   if (isMobile) return <MobileComponent />;
 *   if (isTablet) return <TabletComponent />;
 *   return <DesktopComponent />;
 * }
 * ```
 */
export const useDeviceType = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection()
  return { isMobile, isTablet, isDesktop }
}

/**
 * Hook for CSS media query matching
 *
 * @param query - CSS media query string
 * @returns True if media query matches
 *
 * @example
 * ```tsx
 * function DarkModeComponent() {
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 *   return (
 *     <div className={prefersDark ? 'bg-gray-900' : 'bg-white'}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    try {
      return window.matchMedia(query).matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    try {
      const mediaQuery = window.matchMedia(query)
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      setMatches(mediaQuery.matches)
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    } catch {
      // Handle any errors with matchMedia
      return
    }
  }, [query])

  return matches
}

/**
 * Utility functions for device detection
 * Can be used outside of React components
 */
export const deviceUtils = {
  getDeviceType,
  getBreakpoint,
  getTouchCapability,
  getUserAgentInfo,
  getHoverCapability,
  BREAKPOINTS,
} as const

// Keep default export for backward compatibility
export default useDeviceDetection
