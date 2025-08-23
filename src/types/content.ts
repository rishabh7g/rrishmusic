/**
 * Content Type Definitions for RrishMusic
 * Unified and consolidated content management types
 */

// Base content interfaces
export interface BaseContent {
  id: string;
  lastUpdated: string;
  version: string;
}

// Hero Section Types
export interface HeroContent {
  title: string;
  subtitle: string;
  description?: string;
  ctaText: string;
  ctaLink?: string;
  backgroundImage?: string;
  instagramHandle: string;
  instagramUrl: string;
  socialProof?: {
    studentsCount?: number;
    yearsExperience?: number;
    successStories?: number;
  };
}

// About Section Types
export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'education' | 'performance' | 'teaching' | 'recognition';
  link?: string;
}

export interface AboutContent {
  title: string;
  subtitle?: string;
  content: string[];
  skills: Skill[];
  achievements?: Achievement[];
  personalQuote?: string;
  profileImage?: string;
  resumeUrl?: string;
}

// Teaching Approach Types
export interface TeachingPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
  detailedDescription?: string;
  examples?: string[];
  benefits?: string[];
}

export interface MethodologyStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  techniques?: string[];
}

export interface ApproachContent {
  title: string;
  subtitle: string;
  introduction?: string;
  principles: TeachingPrinciple[];
  methodology?: MethodologyStep[];
  philosophy?: string;
  specializations?: string[];
}

// Lesson Package Types
export interface LessonPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sessions: number; // 0 for unlimited
  duration?: number; // minutes per session
  validity?: number; // days
  features: string[];
  benefits?: string[];
  popular: boolean;
  recommended?: boolean;
  targetAudience?: ('beginner' | 'intermediate' | 'advanced')[];
  instruments?: string[];
  included?: string[];
  notIncluded?: string[];
  prerequisites?: string[];
  discount?: number;
}

export interface LessonSchedule {
  timeSlots?: string[];
  daysAvailable?: string[];
  timezone?: string;
  bookingLeadTime?: number; // hours
  cancellationPolicy?: string;
}

export interface LessonContent {
  title: string;
  subtitle: string;
  description?: string;
  packages: LessonPackage[];
  schedule?: LessonSchedule;
  additionalInfo: {
    sessionLength?: string;
    cancellationPolicy?: string;
    reschedulePolicy?: string;
    location?: string;
    instruments?: string[];
    trialLesson?: {
      available: boolean;
      duration?: number;
      price?: number;
      description?: string;
    };
    groupLessons?: {
      available: boolean;
      minStudents?: number;
      maxStudents?: number;
      discountPercentage?: number;
    };
    onlineLessons?: {
      available: boolean;
      platforms: string[];
      requirements?: string[];
    };
    materials?: string[];
    policies?: {
      payment: string[];
      attendance: string[];
      refund: string[];
    };
  };
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date?: string;
  instrument?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  age?: number;
  location?: string;
  featured: boolean;
  verified?: boolean;
  avatar?: string;
  videoUrl?: string;
  achievements?: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface TestimonialCollection {
  featured: Testimonial[];
  all: Testimonial[];
  averageRating: number;
  totalCount: number;
  categories?: {
    [key: string]: Testimonial[];
  };
}

// Community Section Types
export interface CommunityFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits?: string[];
}

export interface InstagramFeedConfig {
  title: string;
  description: string;
  handle?: string;
  maxPosts?: number;
  hashtags?: string[];
  showCaptions?: boolean;
  refreshInterval?: number; // minutes
}

export interface CommunityContent {
  title: string;
  description: string;
  features: CommunityFeature[];
  testimonials?: TestimonialCollection;
  instagramFeed: InstagramFeedConfig;
  communityStats?: {
    totalStudents: number;
    activeMembers: number;
    successStories: number;
    countriesRepresented?: number;
  };
}

// Contact Information Types
export interface ContactMethod {
  type: 'email' | 'phone' | 'instagram' | 'whatsapp' | 'facebook' | 'linkedin' | 'website';
  label: string;
  value: string;
  href: string;
  primary: boolean;
  icon?: string;
  description?: string;
  availability?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
  note?: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  description?: string;
  methods: ContactMethod[];
  location?: string;
  businessHours?: BusinessHours[];
  responseTime?: string;
  preferredContact?: string;
  bookingInstructions?: string[];
  emergencyContact?: ContactMethod;
}

// SEO and Metadata Types
export interface SEOContent {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  ogImage: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  robots?: string;
  structuredData?: {
    type: string;
    data: Record<string, unknown>;
  }[];
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  description?: string;
  children?: NavigationItem[];
  order?: number;
}

export interface NavigationConfig {
  primary: NavigationItem[];
  footer?: NavigationItem[];
  social?: NavigationItem[];
  legal?: NavigationItem[];
}

// Blog and Media Types (for future use)
export interface BlogPost extends BaseContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  readTime?: number;
  published: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export interface MediaItem extends BaseContent {
  title: string;
  description?: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  mimeType: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for video/audio in seconds
  alt?: string;
  caption?: string;
  credit?: string;
  tags?: string[];
}

// Main Site Content Structure
export interface SiteContent extends BaseContent {
  hero: HeroContent;
  about: AboutContent;
  approach: ApproachContent;
  lessons: LessonContent;
  community: CommunityContent;
  contact: ContactContent;
  seo: SEOContent;
  navigation?: NavigationConfig;
  blog?: BlogPost[];
  media?: MediaItem[];
}

// Content Management Types
export interface ContentValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ContentValidationResult {
  valid: boolean;
  errors: ContentValidationError[];
  warnings?: ContentValidationError[];
  performance?: {
    loadTime: number;
    memoryUsage: number;
  };
}

export interface ContentLoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
  lastFetch?: string;
  retryCount?: number;
}

export interface ContentCache {
  data: SiteContent;
  timestamp: string;
  ttl: number; // time to live in milliseconds
  version: string;
}

// Content Filters and Search
export interface ContentFilter {
  section?: keyof SiteContent;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  sortBy?: 'date' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface ContentSearchResult {
  items: Array<{
    section: keyof SiteContent;
    path: string;
    content: unknown;
    relevance: number;
    highlights?: string[];
  }>;
  totalCount: number;
  query: string;
  filters: ContentFilter;
}

// Export types for external use
export type ContentSection = keyof SiteContent;
export type ValidationSeverity = ContentValidationError['severity'];
export type MediaType = MediaItem['type'];
export type ContactType = ContactMethod['type'];
export type SkillLevel = Skill['level'];
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced';

// Utility types for content operations
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ContentPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}` | `${string & K}.${ContentPath<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : never;

export type ContentValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ContentValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Complete Data Structure for import
export interface SiteData {
  content: SiteContent;
  testimonials: Testimonial[];
  navigation?: NavigationItem[];
  media?: MediaItem[];
  blog?: BlogPost[];
}