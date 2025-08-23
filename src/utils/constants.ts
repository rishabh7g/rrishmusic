import { NavigationItem, LessonPackage } from "../types";
import { rawContent } from "@/hooks/useContent";

// Navigation Configuration - migrated to use content system
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "approach", label: "Approach", href: "#approach" },
  { id: "lessons", label: "Lessons", href: "#lessons" },
  { id: "community", label: "Community", href: "#community" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// Business Configuration - now sourced from content files
export const LESSON_PACKAGES: LessonPackage[] = rawContent.lessons.packages;

// Contact Configuration - now sourced from content files  
export const CONTACT_INFO = {
  email: rawContent.site.contact.methods.find(m => m.type === 'email')?.value || 'hello@rrishmusic.com',
  instagram: rawContent.site.contact.methods.find(m => m.type === 'instagram')?.href || 'https://instagram.com/rrishmusic',
  location: rawContent.site.contact.location,
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

// New: Content-related constants
export const CONTENT_CONFIG = {
  // Image paths
  IMAGES: {
    HERO_BACKGROUND: '/images/hero-bg.jpg',
    ABOUT_IMAGE: '/images/about-rrish.jpg',
    OG_IMAGE: rawContent.site.seo.ogImage,
  },
  
  // Social media
  SOCIAL: {
    INSTAGRAM: rawContent.site.hero.instagramUrl,
    INSTAGRAM_HANDLE: rawContent.site.hero.instagramHandle,
  },

  // SEO defaults
  SEO: {
    SITE_NAME: 'RrishMusic',
    TITLE_TEMPLATE: '%s | RrishMusic - Blues & Music Lessons',
    DEFAULT_TITLE: rawContent.site.seo.defaultTitle,
    DEFAULT_DESCRIPTION: rawContent.site.seo.defaultDescription,
    KEYWORDS: rawContent.site.seo.defaultKeywords.split(', '),
  },

  // Business settings
  BUSINESS: {
    CURRENCY: 'AUD',
    TIMEZONE: 'Australia/Melbourne',
    LESSON_DURATION: 60, // minutes
    BOOKING_ADVANCE_DAYS: 14,
  }
};