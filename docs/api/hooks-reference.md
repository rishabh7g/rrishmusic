# Hooks API Reference

## Overview

The RrishMusic application uses a comprehensive set of custom React hooks to manage content, SEO, device detection, and other application concerns. All hooks are TypeScript-typed for maximum type safety.

## Content Management Hooks

### useContent()

Primary hook for accessing all JSON content files.

**Usage:**
```typescript
import { useContent } from '@/hooks/useContent'

const MyComponent = () => {
  const content = useContent()
  
  return (
    <div>
      <h1>{content.teaching.hero.title}</h1>
      <p>{content.teaching.hero.description}</p>
    </div>
  )
}
```

**Return Type:**
```typescript
interface ContentHookReturn {
  teaching: TeachingContent
  collaboration: CollaborationContent
  navigation: NavigationData
  contact: ContactContent
}
```

**Features:**
- Static imports for optimal performance
- Memoized content processing
- TypeScript type safety
- Build-time bundling

### useMultiServiceTestimonials()

Specialized hook for managing cross-service testimonials.

**Usage:**
```typescript
import { useMultiServiceTestimonials } from '@/hooks/useMultiServiceTestimonials'

const TestimonialsSection = () => {
  const {
    testimonials,
    serviceConfig,
    getTestimonialsByService,
    getFeaturedTestimonials
  } = useMultiServiceTestimonials()

  const featured = getFeaturedTestimonials(3)
  const teachingTestimonials = getTestimonialsByService('teaching')

  return (
    <div>
      {featured.map(testimonial => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  )
}
```

**Return Type:**
```typescript
interface MultiServiceTestimonialsReturn {
  testimonials: Testimonial[]
  serviceConfig: ServiceConfiguration
  getTestimonialsByService: (service: string) => Testimonial[]
  getFeaturedTestimonials: (limit?: number) => Testimonial[]
  getTestimonialsByRating: (minRating: number) => Testimonial[]
}
```

**Methods:**
- `getTestimonialsByService(service)`: Filter testimonials by service type
- `getFeaturedTestimonials(limit)`: Get featured testimonials with optional limit
- `getTestimonialsByRating(minRating)`: Filter by minimum star rating

### useInstagramContent()

Manages Instagram feed integration with local fallback.

**Usage:**
```typescript
import { useInstagramContent } from '@/hooks/useInstagramContent'

const InstagramFeed = () => {
  const { posts, loading, error, hasLocalFallback, refreshContent } = useInstagramContent()

  if (loading) return <div>Loading Instagram content...</div>
  if (error) return <div>Using local gallery content</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {posts.map(post => (
        <img
          key={post.id}
          src={post.mediaUrl}
          alt={post.caption}
          className="aspect-square object-cover rounded"
        />
      ))}
    </div>
  )
}
```

**Return Type:**
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

## SEO & Meta Management Hooks

### usePageSEO()

Dynamic SEO management for individual pages.

**Usage:**
```typescript
import { usePageSEO } from '@/hooks/usePageSEO'
import { SEOHead } from '@/components/common/SEOHead'

const TeachingPage = () => {
  const seo = usePageSEO({
    title: "Music Lessons - RrishMusic",
    description: "Professional guitar and music theory lessons in Melbourne",
    keywords: "music lessons, guitar teacher, Melbourne music instruction",
    canonicalUrl: "https://rrishmusic.com/lessons"
  })

  return (
    <>
      <SEOHead />
      {/* Page content */}
    </>
  )
}
```

**Parameters:**
```typescript
interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  noindex?: boolean
}
```

**Features:**
- Dynamic title and meta tag updates
- Open Graph optimization
- Canonical URL management
- Twitter Card integration
- Schema.org structured data

## UI & Interaction Hooks

### useTheme()

Theme management with dark mode support.

**Usage:**
```typescript
import { useTheme } from '@/hooks/useTheme'

const ThemeToggle = () => {
  const { theme, setTheme, toggleTheme, systemTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

**Return Type:**
```typescript
interface ThemeHookReturn {
  theme: 'light' | 'dark' | 'system'
  actualTheme: 'light' | 'dark'  // Resolved theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  systemTheme: 'light' | 'dark'
}
```

**Features:**
- System preference detection
- Local storage persistence
- Smooth theme transitions
- CSS class management

### useDeviceDetection()

Responsive design helper for device-specific behavior.

**Usage:**
```typescript
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

const ResponsiveComponent = () => {
  const { isMobile, isTablet, isDesktop, screenSize } = useDeviceDetection()

  return (
    <div className={`
      ${isMobile ? 'flex-col space-y-4' : 'flex-row space-x-6'}
      ${isTablet ? 'grid-cols-2' : ''}
      ${isDesktop ? 'grid-cols-4' : ''}
    `}>
      <p>Viewing on: {screenSize}</p>
      {/* Responsive content */}
    </div>
  )
}
```

**Return Type:**
```typescript
interface DeviceDetectionReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenSize: 'mobile' | 'tablet' | 'desktop'
  width: number
  height: number
}
```

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### useScrollSpy()

Navigation highlighting based on scroll position.

**Usage:**
```typescript
import { useScrollSpy } from '@/hooks/useScrollSpy'

const Navigation = () => {
  const activeSection = useScrollSpy([
    'hero',
    'about',
    'services',
    'contact'
  ])

  return (
    <nav>
      {sections.map(section => (
        <a
          key={section}
          href={`#${section}`}
          className={`nav-link ${
            activeSection === section ? 'active' : ''
          }`}
        >
          {section}
        </a>
      ))}
    </nav>
  )
}
```

**Parameters:**
```typescript
useScrollSpy(
  sections: string[],          // Array of section IDs
  options?: {
    offset?: number            // Offset from top (default: 100)
    threshold?: number         // Visibility threshold (default: 0.1)
  }
)
```

**Return:** `string | null` - Currently active section ID

## Performance & Optimization Hooks

### useLazyLoad()

Generic lazy loading hook for components and images.

**Usage:**
```typescript
import { useLazyLoad } from '@/hooks/useLazyLoad'

const LazyImage = ({ src, alt, ...props }) => {
  const [ref, isInView] = useLazyLoad()

  return (
    <div ref={ref}>
      {isInView ? (
        <img src={src} alt={alt} {...props} />
      ) : (
        <div className="placeholder">Loading...</div>
      )}
    </div>
  )
}
```

**Return Type:**
```typescript
[
  React.RefObject<HTMLElement>,  // Ref to attach to element
  boolean                        // Whether element is in view
]
```

**Options:**
```typescript
interface LazyLoadOptions {
  threshold?: number        // Intersection threshold (default: 0.1)
  rootMargin?: string      // Root margin (default: '50px')
  once?: boolean           // Trigger only once (default: true)
}
```

## Custom Hook Patterns

### Creating New Content Hooks

When adding new content types, follow this pattern:

```typescript
// hooks/useNewContentType.ts
import { useMemo } from 'react'
import { useContent } from './useContent'

interface ProcessedNewContent {
  // Define your processed content type
}

export const useNewContentType = () => {
  const content = useContent()
  
  return useMemo(() => {
    if (!content.newContentType) return null
    
    // Process and transform content
    return processNewContent(content.newContentType)
  }, [content.newContentType])
}

const processNewContent = (raw: any): ProcessedNewContent => {
  // Content processing logic
  return {
    // Processed content
  }
}
```

### Hook Testing Patterns

```typescript
// __tests__/hooks/useContent.test.ts
import { renderHook } from '@testing-library/react'
import { useContent } from '../useContent'

describe('useContent', () => {
  it('returns all content types', () => {
    const { result } = renderHook(() => useContent())
    
    expect(result.current).toHaveProperty('teaching')
    expect(result.current).toHaveProperty('collaboration')
    expect(result.current).toHaveProperty('navigation')
  })

  it('memoizes content processing', () => {
    const { result, rerender } = renderHook(() => useContent())
    const firstResult = result.current
    
    rerender()
    
    expect(result.current).toBe(firstResult)
  })
})
```

## Performance Considerations

### Memoization Strategy

All content hooks use React's `useMemo` for optimal performance:

```typescript
export const useContent = () => {
  const teachingContent = useMemo(() => 
    processTeachingContent(teachingContentRaw), 
    [] // Empty deps - process only once
  )
  
  return useMemo(() => ({
    teaching: teachingContent,
    // ... other content
  }), [teachingContent, ...])
}
```

### Static vs Dynamic Data

- **Static Content**: JSON files imported at build time
- **Dynamic Content**: API calls with caching and error handling
- **Hybrid Approach**: Static fallback with dynamic updates

### Hook Dependencies

Minimize hook dependencies to prevent unnecessary re-renders:

```typescript
// Good: Stable dependencies
const processedData = useMemo(() => 
  processData(rawData), 
  [rawData.id, rawData.version]
)

// Avoid: Entire object dependency
const processedData = useMemo(() => 
  processData(rawData), 
  [rawData] // May cause unnecessary re-renders
)
```

## Error Handling in Hooks

### Graceful Degradation

```typescript
export const useInstagramContent = () => {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchInstagramPosts()
      .then(posts => setState({ posts, loading: false, error: null }))
      .catch(error => {
        console.warn('Instagram API failed, using fallback')
        setState({ 
          posts: fallbackPosts, 
          loading: false, 
          error: error.message 
        })
      })
  }, [])

  return state
}
```

### Error Boundaries Integration

Hooks work seamlessly with Error Boundaries:

```typescript
const MyComponent = () => {
  const content = useContent()
  
  if (!content) {
    throw new Error('Failed to load content')
  }
  
  return <div>{/* Component content */}</div>
}
```

---
**Last Updated**: August 2025  
**Related**: [Content Schemas](./content-schemas.md) | [Component Hierarchy](../architecture/component-hierarchy.md)