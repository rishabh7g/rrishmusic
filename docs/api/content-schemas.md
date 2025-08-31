# Content API Documentation

## Overview

The RrishMusic application uses a JSON-based content management system with centralized configuration files. All content is statically imported and processed through custom hooks for optimal performance.

## Content File Structure

```
src/content/
├── site-config.json           # Global site configuration and branding
├── navigation.json            # Navigation menu structure  
├── teaching.json              # Teaching service content
├── collaboration.json         # Collaboration service content  
├── performance.json           # Performance service content
├── testimonials.json          # Cross-service testimonials
├── contact.json               # Contact form configurations
├── gallery.json               # Gallery media and layout (NEW)
├── instagram-posts.json       # Instagram integration data
├── lessons.json               # Lesson packages and pricing
├── serviceConfiguration.json  # Multi-service settings
└── ui-config.json            # UI component configurations
```

## Content Schemas

### site-config.json

Global site configuration and branding information.

```typescript
interface SiteConfig {
  branding: {
    name: string              // "RrishMusic"
    tagline: string           // "Live Performances • Music Lessons • Collaborations"
    description: string       // Site description
    email: string            // Contact email
    website: string          // Site URL
  }
  seo: {
    title: string            // Default page title
    description: string      // Default meta description
    keywords: string         // SEO keywords
  }
  navigation: {
    brand: {
      name: string           // Brand name in navigation
      ariaLabel: string      // Accessibility label
    }
  }
  hero: {
    title: string            // Homepage hero title
    subtitle: string         // Homepage hero subtitle
    cta: {
      primary: {
        text: string         // Primary CTA text
        href: string         // Primary CTA link
      }
      secondary: {
        text: string         // Secondary CTA text
        href: string         // Secondary CTA link
      }
    }
  }
}
```

### navigation.json

Navigation menu structure and hierarchy.

```typescript
interface Navigation {
  items: NavigationItem[]
}

interface NavigationItem {
  id: string
  label: string
  href: string
  priority: 'primary' | 'secondary' | 'tertiary'
  mobileOnly?: boolean
  desktopOnly?: boolean
  external?: boolean
}
```

### gallery.json (Recently Added)

Comprehensive gallery configuration with masonry layout support.

```typescript
interface GalleryConfig {
  seo: {
    title: string
    description: string
    keywords: string
    canonicalUrl: string
  }
  ui: {
    loadingMessage: string
    emptyStateTitle: string
    emptyStateDescription: string
    featuredBadge: string
    videoBadge: string
  }
  layout: {
    grid: {
      mobile: string          // "grid-cols-2"
      tablet: string          // "sm:grid-cols-3 md:grid-cols-4"
      desktop: string         // "lg:grid-cols-6 xl:grid-cols-8"
      rowHeight: string       // "auto-rows-[120px] sm:auto-rows-[140px]"
      gap: string            // "gap-3 md:gap-4"
    }
    animations: {
      container: FramerMotionVariant
      item: FramerMotionVariant
    }
  }
  media: MediaItem[]
}

interface MediaItem {
  filename: string
  category: 'portrait' | 'landscape' | 'video'
  path: string
  aspectRatio: number        // Width/height ratio for layout calculation
  priority: 'high' | 'medium' | 'low'
  featured?: boolean
  description?: string
}
```

### teaching.json

Teaching service content and configuration.

```typescript
interface TeachingContent {
  seo: SEOConfig
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
    cta: {
      primary: CTAButton
      secondary?: CTAButton
    }
  }
  sections: {
    approach: {
      title: string
      content: string[]
      highlights: string[]
    }
    packages: {
      title: string
      subtitle?: string
      items: LessonPackage[]
    }
  }
}

interface LessonPackage {
  id: string
  name: string
  duration: string           // "60 minutes"
  price: number
  features: string[]
  popular?: boolean
  description?: string
}
```

### collaboration.json

Collaboration service content and project showcase.

```typescript
interface CollaborationContent {
  seo: SEOConfig
  hero: {
    title: string
    subtitle: string
    description: string
    cta: CTAButton
  }
  sections: {
    process: {
      title: string
      steps: ProcessStep[]
    }
    portfolio: {
      title: string
      projects: Project[]
    }
    services: {
      title: string
      offerings: ServiceOffering[]
    }
  }
}

interface ProcessStep {
  id: string
  title: string
  description: string
  icon?: string
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  image?: string
  featured?: boolean
  testimonial?: {
    quote: string
    author: string
    role?: string
  }
}
```

### testimonials.json

Cross-service testimonials and social proof.

```typescript
interface TestimonialsConfig {
  testimonials: Testimonial[]
  serviceConfiguration: {
    [key: string]: {
      name: string
      color: string
      icon: string
    }
  }
}

interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  service: 'teaching' | 'performance' | 'collaboration'
  featured?: boolean
  rating?: number           // 1-5 star rating
  image?: string
  date?: string
  location?: string
}
```

### contact.json

Contact form configurations and service routing.

```typescript
interface ContactConfig {
  forms: {
    [formType: string]: FormConfiguration
  }
  routing: {
    default: string
    serviceSpecific: {
      [service: string]: string
    }
  }
  validation: {
    [fieldName: string]: ValidationRule[]
  }
}

interface FormConfiguration {
  title: string
  description?: string
  fields: FormField[]
  submitText: string
  successMessage: string
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  label: string
  placeholder?: string
  required: boolean
  options?: SelectOption[]    // For select fields
  validation?: ValidationRule[]
}
```

## Hook Integration

### useContent Hook

Primary content management hook that provides access to all JSON content files.

```typescript
interface ContentHookReturn {
  teaching: TeachingContent
  collaboration: CollaborationContent
  performance: PerformanceContent
  navigation: Navigation
  contact: ContactConfig
  site: SiteConfig
  testimonials: TestimonialsConfig
}

// Usage
const content = useContent()
const teachingHero = content.teaching.hero
const navigationItems = content.navigation.items
```

### useMultiServiceTestimonials Hook

Specialized hook for cross-service testimonial management.

```typescript
interface MultiServiceTestimonialsReturn {
  testimonials: Testimonial[]
  serviceConfig: ServiceConfiguration
  getTestimonialsByService: (service: string) => Testimonial[]
  getFeaturedTestimonials: (limit?: number) => Testimonial[]
  getTestimonialsByRating: (minRating: number) => Testimonial[]
}
```

### useInstagramContent Hook

Instagram content management with fallback support.

```typescript
interface InstagramContentReturn {
  posts: InstagramPost[]
  loading: boolean
  error: string | null
  hasLocalFallback: boolean
  refreshContent: () => void
}

interface InstagramPost {
  id: string
  caption?: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  timestamp: string
  permalink?: string
}
```

## Content Update Workflow

### Adding New Content

1. **Update JSON Files**: Modify relevant content files in `src/content/`
2. **Type Safety**: Ensure TypeScript interfaces match content structure
3. **Hook Integration**: Content automatically available through hooks
4. **Component Usage**: Use hooks in components to access content

### Gallery Management

The gallery system supports both automatic Instagram integration and manual content management:

```typescript
// Adding new gallery items
{
  "filename": "new-performance.jpg",
  "category": "landscape",
  "path": "/images/gallery/new-performance.jpg",
  "aspectRatio": 1.77,
  "priority": "high",
  "featured": true,
  "description": "Recent performance at venue X"
}
```

### Performance Considerations

1. **Static Imports**: All content is bundled at build time
2. **Memoization**: Content processing is memoized in hooks
3. **Type Safety**: Full TypeScript support for all content schemas
4. **Build Validation**: Content is validated during build process

## API Endpoints

The application currently uses static JSON files, but the hook architecture supports easy migration to API endpoints:

```typescript
// Future API integration example
const useContent = () => {
  const [content, setContent] = useState(null)
  
  useEffect(() => {
    // Static import for now
    import('../content/teaching.json').then(setContent)
    
    // Future: API call
    // fetch('/api/content/teaching').then(r => r.json()).then(setContent)
  }, [])
  
  return content
}
```

## Content Validation

### Build-Time Validation

Content files are validated during the build process to ensure:

- Required fields are present
- Data types match schema definitions
- References between files are valid
- Image paths exist

### Runtime Validation

```typescript
// Example validation function
const validateTeachingContent = (content: any): content is TeachingContent => {
  return (
    content &&
    typeof content.hero?.title === 'string' &&
    Array.isArray(content.sections?.packages?.items) &&
    content.sections.packages.items.every(validateLessonPackage)
  )
}
```

## SEO Integration

All content files include SEO configuration that integrates with the `usePageSEO` hook:

```typescript
interface SEOConfig {
  title: string
  description: string
  keywords: string
  canonicalUrl?: string
  ogImage?: string
  noindex?: boolean
}

// Usage in components
const seo = usePageSEO({
  title: content.teaching.seo.title,
  description: content.teaching.seo.description
})
```

---
**Last Updated**: August 2025  
**Related**: [Component Hierarchy](../architecture/component-hierarchy.md) | [Content System](../data-flow/content-system.md)