/**
 * Simplified device detection hook
 * Provides essential device information for responsive components
 */
import { useState, useEffect } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface DeviceInfo {
  deviceType: DeviceType
  screenWidth: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const

/**
 * Get device type based on screen width
 */
function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile'
  if (width < BREAKPOINTS.tablet) return 'tablet'
  return 'desktop'
}

/**
 * Check if device has touch capability
 */
function getTouchCapability(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Main device detection hook
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        screenWidth: 1024,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
      }
    }

    const width = window.innerWidth
    const deviceType = getDeviceType(width)

    return {
      deviceType,
      screenWidth: width,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isTouchDevice: getTouchCapability(),
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const width = window.innerWidth
      const deviceType = getDeviceType(width)

      setDeviceInfo(prev => ({
        ...prev,
        deviceType,
        screenWidth: width,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceInfo
}

export default useDeviceDetection
