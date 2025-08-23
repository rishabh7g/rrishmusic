// Content Type Definitions

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  instagramHandle: string;
  instagramUrl: string;
}

export interface AboutContent {
  title: string;
  content: string[];
  skills: string[];
}

export interface TeachingPrinciple {
  title: string;
  description: string;
  icon: string;
}

export interface ApproachContent {
  title: string;
  subtitle: string;
  principles: TeachingPrinciple[];
}

export interface CommunityContent {
  title: string;
  description: string;
  features: string[];
  instagramFeed: {
    title: string;
    description: string;
  };
}

export interface ContactMethod {
  type: 'email' | 'instagram' | 'phone';
  label: string;
  value: string;
  href: string;
  primary: boolean;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  methods: ContactMethod[];
  location: string;
}

export interface SEOContent {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  ogImage: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  approach: ApproachContent;
  community: CommunityContent;
  contact: ContactContent;
  seo: SEOContent;
}

// Lesson Package Types (keeping existing from your constants)
export interface LessonPackage {
  id: string;
  name: string;
  sessions: number;
  price: number;
  discount?: number;
  features: string[];
  popular?: boolean;
  description?: string;
}

export interface LessonContent {
  title: string;
  subtitle: string;
  packages: LessonPackage[];
  additionalInfo?: {
    sessionLength: string;
    cancellationPolicy: string;
    reschedulePolicy: string;
    location: string;
    instruments: string[];
  };
}

// Navigation Types (keeping existing)
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
  instrument?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

// Blog/Content Types (for future use)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  featuredImage?: string;
  author: string;
  published: boolean;
}

// Media Types
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

// Complete Content Structure
export interface SiteData {
  content: SiteContent;
  lessons: LessonContent;
  navigation: NavigationItem[];
  testimonials: Testimonial[];
  media: MediaItem[];
  blog?: BlogPost[];
}