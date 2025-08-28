import { NavigationItem } from '@/types'
import navigationData from '@/data/navigation.json'
import contactData from '@/data/contact.json'

// Navigation Configuration - Optimized order for better UX flow and service hierarchy
export const NAVIGATION_ITEMS: NavigationItem[] = navigationData.navigationItems

// Contact Configuration (fallbacks - use content management system for actual data)
export const CONTACT_INFO = contactData.contactInfo

// Animation Configuration - keeping as constants since these are technical settings
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
}

export const FADE_IN_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const SLIDE_IN_CONFIG = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 600,
} as const

// Cache configuration
export const CACHE_DURATION = {
  short: 5 * 60 * 1000, // 5 minutes
  medium: 30 * 60 * 1000, // 30 minutes
  long: 60 * 60 * 1000, // 1 hour
} as const

// Error retry configuration
export const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
} as const
