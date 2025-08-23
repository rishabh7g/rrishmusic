import type { NavigationItem } from "../types";

// Navigation Configuration  
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "approach", label: "Approach", href: "#approach" },
  { id: "lessons", label: "Lessons", href: "#lessons" },
  { id: "community", label: "Community", href: "#community" },
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

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Content-related constants (for fallbacks - use content management system for actual data)
export const CONTENT_CONFIG = {
  // Image paths
  IMAGES: {
    HERO_BACKGROUND: '/images/hero-bg.jpg',
    ABOUT_IMAGE: '/images/about-rrish.jpg',
    OG_IMAGE: '/images/og-image.jpg',
  },
  
  // Social media
  SOCIAL: {
    INSTAGRAM: 'https://instagram.com/rrishmusic',
    INSTAGRAM_HANDLE: '@rrishmusic',
  },

  // SEO defaults
  SEO: {
    SITE_NAME: 'RrishMusic',
    TITLE_TEMPLATE: '%s | RrishMusic - Blues & Music Lessons',
    DEFAULT_TITLE: 'RrishMusic - Guitar Lessons & Blues Improvisation',
    DEFAULT_DESCRIPTION: 'Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels.',
    KEYWORDS: ['guitar lessons', 'blues improvisation', 'music teacher', 'Melbourne'],
  },

  // Business settings
  BUSINESS: {
    CURRENCY: 'AUD',
    TIMEZONE: 'Australia/Melbourne',
    LESSON_DURATION: 60, // minutes
    BOOKING_ADVANCE_DAYS: 14,
  }
};