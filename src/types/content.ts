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

// Multi-Service Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date?: string;
  service: 'performance' | 'teaching' | 'collaboration';
  serviceSubType?: string; // e.g., 'wedding', 'corporate', 'venue', 'guitar', 'theory', 'recording', 'session'
  event?: string;
  instrument?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  age?: number;
  location?: string;
  featured: boolean;
  verified?: boolean;
  avatar?: string;
  image?: string;
  videoUrl?: string;
  achievements?: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export interface TestimonialStats {
  total: number;
  averageRating: number;
  byService: {
    performance: {
      count: number;
      percentage: number;
      averageRating: number;
    };
    teaching: {
      count: number;
      percentage: number;
      averageRating: number;
    };
    collaboration: {
      count: number;
      percentage: number;
      averageRating: number;
    };
  };
  featured: number;
  verified: number;
}

// Dynamic Statistics Types
export interface CalculatedStats {
  experience: {
    playingYears: number;
    teachingYears: number;
    performanceYears: number;
    studioYears: number;
  };
  students: {
    total: number;
    active: number;
    completed: number;
    averageProgress: number;
  };
  performance: {
    venuePerformances: string;
    weddingPerformances: string;
    corporateEvents: string;
    privateEvents: string;
    averagePerformanceRating: number;
    repeatBookings: number;
  };
  quality: {
    averageRating: number;
    successStories: number;
    testimonials: number;
    completionRate: number;
    satisfactionScore: number;
  };
  collaboration: {
    projectsCompleted: number;
    artistsWorkedWith: number;
    tracksRecorded: string;
    averageProjectRating: number;
  };
  reach: {
    countries: number;
    cities: number;
    primaryCity: string;
    venues: number;
    onlineStudents: number;
    localStudents: number;
  };
  achievements: {
    certifications: number;
    yearsFormalTraining: number;
    performanceHours: number;
    teachingHours: number;
    studioHours: number;
  };
  social: {
    instagramFollowers: number;
    youtubeSubscribers: number;
    spotifyMonthlyListeners: number;
    socialEngagementRate: number;
  };
  business: {
    clientRetentionRate: number;
    referralRate: number;
    bookingResponseTime: number;
    punctualityScore: number;
    professionalismScore: number;
  };
}

export interface StatsCacheStatus {
  cached: boolean;
  age: number;
  expires: number;
}

export interface StatsMetadata {
  isCalculated: boolean;
  isDynamic: boolean;
  cacheStatus: StatsCacheStatus;
  lastCalculated: string | null;
  refreshKey?: number;
}

export interface EnhancedStats extends CalculatedStats {
  original?: Record<string, unknown>; // Original static stats for comparison
  meta: StatsMetadata;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  clearCache: () => void;
}

// Performance Data Calculator Types
export interface PerformanceVenueStats {
  total: number;
  byType: {
    venue: number;
    wedding: number;
    corporate: number;
    private: number;
    festival?: number;
  };
  locations: string[];
  uniqueLocations: number;
}

export interface PerformanceEventStats {
  totalEvents: number;
  bySubType: Record<string, number>;
  recentEvents: Array<{
    event: string;
    location: string;
    date: string;
    type: string;
  }>;
  averageRating: number;
}

export interface PerformancePortfolioStats {
  totalItems: number;
  byType: {
    images: number;
    videos: number;
    audio: number;
  };
  byPerformanceType: {
    acoustic: number;
    band: number;
    solo: number;
  };
  featuredItems: number;
}

export interface CalculatedPerformanceData {
  venues: PerformanceVenueStats;
  events: PerformanceEventStats;
  portfolio: PerformancePortfolioStats;
  experience: {
    yearsActive: number;
    totalPerformances: string;
    regularVenues: number;
    geographicReach: {
      cities: number;
      regions: string[];
      primaryLocation: string;
    };
  };
  services: {
    eventTypes: string[];
    specializations: string[];
    availability: {
      weekdays: boolean;
      weekends: boolean;
      evenings: boolean;
    };
  };
}

export interface PerformanceCacheStatus {
  cached: boolean;
  age: number;
  expires: number;
}

export interface EnhancedPerformanceData extends CalculatedPerformanceData {
  original?: Record<string, unknown>; // Original static performance data
  meta: {
    isCalculated: boolean;
    isDynamic: boolean;
    cacheStatus: PerformanceCacheStatus;
    lastCalculated: string | null;
    refreshKey?: number;
  };
  loading: boolean;
  error: string | null;
  refresh: () => void;
  clearCache: () => void;
}

export interface TestimonialCollection {
  featured: Testimonial[];
  all: Testimonial[];
  byService: {
    performance: Testimonial[];
    teaching: Testimonial[];
    collaboration: Testimonial[];
  };
  stats: TestimonialStats;
}

export interface TestimonialFilters {
  service?: 'performance' | 'teaching' | 'collaboration';
  serviceSubType?: string;
  featured?: boolean;
  verified?: boolean;
  minRating?: number;
  limit?: number;
  sortBy?: 'date' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
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
export type ServiceType = Testimonial['service'];
export type TestimonialRating = Testimonial['rating'];

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
// General Statistics Types for Data Calculator
export interface GeneralStats {
  studentsCount: number;
  yearsExperience: number;
  successStories: number;
  performancesCount: number;
  collaborationsCount: number;
  lastUpdated: string;
}
