import { NavigationItem } from '@/types';

// Navigation Configuration - organized for user journey: Performances → Teaching → About → Contact
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "performances", label: "Performances", href: "#performances" },
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "approach", label: "Approach", href: "#approach" },
  { id: "lessons", label: "Lessons", href: "#lessons" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// Contact Configuration (fallbacks - use content management system for actual data)
export const CONTACT_INFO = {
  email: "hello@rrishmusic.com",
  instagram: "https://instagram.com/rrishmusic", 
  location: "Melbourne, Victoria, Australia",
};

// Animation Configuration - keeping as constants since these are technical settings
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
};

export const FADE_IN_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const SLIDE_IN_CONFIG = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 600,
} as const;

// Cache configuration
export const CACHE_DURATION = {
  short: 5 * 60 * 1000, // 5 minutes
  medium: 30 * 60 * 1000, // 30 minutes  
  long: 60 * 60 * 1000, // 1 hour
} as const;

// Error retry configuration
export const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
} as const;