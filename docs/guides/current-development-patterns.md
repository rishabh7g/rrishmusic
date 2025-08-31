# Current Development Patterns

## Overview

This guide documents the current development patterns and conventions used in the RrishMusic codebase as of August 2025. It reflects the actual implementation rather than aspirational architecture.

## Project Structure

```
src/
├── components/
│   ├── pages/                 # Page-level components
│   │   ├── Home.tsx
│   │   ├── Teaching.tsx       # Main teaching page (/lessons)
│   │   ├── Gallery.tsx
│   │   ├── Performance.tsx
│   │   └── Collaboration.tsx
│   ├── sections/              # Reusable section components
│   │   ├── Hero.tsx
│   │   ├── TripleImageHero.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Lessons.tsx
│   │   ├── Approach.tsx
│   │   └── Community.tsx
│   ├── layout/                # Layout components
│   │   ├── Navigation.tsx
│   │   └── MobileNavigation.tsx
│   ├── ui/                    # Reusable UI components
│   │   ├── ServiceCard.tsx
│   │   ├── LazyImage.tsx
│   │   ├── MediaPreview.tsx
│   │   └── ThemeToggle.tsx
│   ├── forms/                 # Form components
│   │   └── ContactForm.tsx
│   ├── social/                # Social media integration
│   │   ├── InstagramEmbed.tsx
│   │   └── SocialProof.tsx
│   └── common/                # Common utilities
│       ├── SEOHead.tsx
│       ├── LazySection.tsx
│       └── ErrorBoundary.tsx
├── content/                   # JSON content files
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
└── styles/                    # Global styles
```

## Component Development Patterns

### 1. Page Component Pattern

Page components follow a consistent structure:

```typescript
// src/components/pages/Teaching.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { usePageSEO } from '@/hooks/usePageSEO'
import { SEOHead } from '@/components/common/SEOHead'
import { Lessons } from '@/components/sections/Lessons'
import { Approach } from '@/components/sections/Approach'
import { Community } from '@/components/sections/Community'

export const Teaching: React.FC = () => {
  usePageSEO({
    title: "Music Lessons - RrishMusic",
    description: "Professional guitar and music theory lessons in Melbourne"
  })

  return (
    <>
      <SEOHead />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen"
      >
        <Lessons />
        <Approach />
        <Community />
      </motion.div>
    </>
  )
}
```

### 2. Section Component Pattern

Section components are self-contained and reusable:

```typescript
// src/components/sections/Approach.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'

export const Approach: React.FC = () => {
  const content = useContent()
  const approachContent = content.teaching?.sections?.approach

  if (!approachContent) return null

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {approachContent.title}
          </h2>
          {/* Section content */}
        </motion.div>
      </div>
    </section>
  )
}
```

### 3. Hook-Based Data Management

Content is managed through centralized hooks:

```typescript
// Usage pattern in components
import { useContent } from '@/hooks/useContent'
import { useMultiServiceTestimonials } from '@/hooks/useMultiServiceTestimonials'
import { useInstagramContent } from '@/hooks/useInstagramContent'

const Component = () => {
  const content = useContent()
  const { testimonials, getFeaturedTestimonials } = useMultiServiceTestimonials()
  const { posts, loading } = useInstagramContent()

  // Component logic
}
```

## Styling Conventions

### 1. Tailwind CSS Patterns

**Responsive Design (Mobile-First):**
```typescript
className="
  flex flex-col space-y-4          // Mobile: stack vertically
  sm:flex-row sm:space-y-0 sm:space-x-6  // Tablet: side by side
  lg:grid lg:grid-cols-3 lg:gap-8  // Desktop: grid layout
"
```

**Common Layout Patterns:**
```typescript
// Section container
className="py-16 px-4 md:px-8"

// Content wrapper
className="max-w-6xl mx-auto"

// Card styling
className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"

// Button patterns
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
```

### 2. Dark Mode Support

All components support dark mode through Tailwind's dark: prefix:

```typescript
className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-700
"
```

### 3. Animation Patterns

Consistent Framer Motion patterns:

```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Section animations
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Stagger animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

## Content Management Workflow

### 1. Adding New Content

**Step 1: Update JSON Files**
```bash
# Edit content files in src/content/
vim src/content/teaching.json
```

**Step 2: TypeScript Integration**
Content is automatically typed through the useContent hook.

**Step 3: Component Usage**
```typescript
const content = useContent()
const newSection = content.teaching.sections.newSection
```

### 2. Gallery Management

**Adding New Gallery Items:**
```json
// src/content/gallery.json
{
  "media": [
    {
      "filename": "new-performance.jpg",
      "category": "landscape",
      "path": "/images/gallery/new-performance.jpg",
      "aspectRatio": 1.77,
      "priority": "high",
      "featured": true
    }
  ]
}
```

**Gallery Component Integration:**
```typescript
// Gallery automatically picks up new items
const galleryContent = useContent().gallery
```

## Performance Optimization Patterns

### 1. Lazy Loading

**Page-Level Lazy Loading:**
```typescript
// src/App.tsx
const LazyHome = lazy(() => import('./components/pages/Home'))
const LazyGallery = lazy(() => import('./components/pages/Gallery'))
```

**Component-Level Optimization:**
```typescript
// Image lazy loading
const LazyImage = ({ src, alt, ...props }) => {
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    })

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef}>
      {isInView && <img src={src} alt={alt} {...props} />}
    </div>
  )
}
```

### 2. Memoization

**Content Memoization:**
```typescript
// useContent hook pattern
export const useContent = () => {
  const teachingContent = useMemo(() => 
    processTeachingContent(teachingContentRaw), []
  )
  
  return useMemo(() => ({
    teaching: teachingContent,
    performance: performanceContent,
    collaboration: collaborationContent
  }), [teachingContent, performanceContent, collaborationContent])
}
```

**Component Memoization:**
```typescript
// Expensive components
const OptimizedComponent = React.memo(({ data }) => {
  return <ExpensiveRender data={data} />
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})
```

## Error Handling Patterns

### 1. Error Boundaries

```typescript
// src/components/common/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. Graceful Degradation

```typescript
// Component with fallback
const InstagramFeed = () => {
  const { posts, loading, error } = useInstagramContent()

  if (error) {
    return <div>Unable to load Instagram content</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {posts.map(post => (
        <img key={post.id} src={post.mediaUrl} alt={post.caption} />
      ))}
    </div>
  )
}
```

## Testing Patterns

### 1. Component Testing

```typescript
// __tests__/components/ServiceCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ServiceCard } from '../ServiceCard'

describe('ServiceCard', () => {
  const defaultProps = {
    title: 'Test Service',
    description: 'Test description',
    features: ['Feature 1', 'Feature 2'],
    priority: 'primary' as const,
    ctaText: 'Learn More',
    ctaLink: '/test'
  }

  it('renders with correct priority styling', () => {
    render(<ServiceCard {...defaultProps} />)
    expect(screen.getByRole('article')).toHaveClass('primary-styles')
  })

  it('displays all features', () => {
    render(<ServiceCard {...defaultProps} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })
})
```

### 2. Hook Testing

```typescript
// __tests__/hooks/useContent.test.ts
import { renderHook } from '@testing-library/react'
import { useContent } from '../../hooks/useContent'

describe('useContent', () => {
  it('returns processed content', () => {
    const { result } = renderHook(() => useContent())
    
    expect(result.current).toHaveProperty('teaching')
    expect(result.current).toHaveProperty('performance')
    expect(result.current).toHaveProperty('collaboration')
  })

  it('memoizes content processing', () => {
    const { result, rerender } = renderHook(() => useContent())
    const firstResult = result.current
    
    rerender()
    
    expect(result.current).toBe(firstResult)
  })
})
```

## Build and Deployment

### 1. Quality Gates

Before every commit, run:

```bash
npm run lint          # ESLint + Prettier
npx tsc --noEmit      # TypeScript check
npm run test          # Test suite
npm run build         # Production build
```

### 2. Build Optimizations

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          routing: ['react-router-dom']
        }
      }
    }
  }
})
```

### 3. Deployment Process

1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Preview**: `npm run preview`
4. **Deploy**: Automatic deployment via GitHub Pages

## Recent Changes and Migrations

### Gallery System Migration (August 2025)

**Before:**
- Gallery content embedded in performance.json
- Basic image grid layout
- Limited mobile optimization

**After:**
- Dedicated gallery.json with comprehensive schema
- Advanced masonry layout with smart positioning
- Enhanced mobile responsiveness
- Video preview support
- Category filtering

**Migration Pattern:**
```typescript
// Old: content.performance.gallery
// New: content.gallery with dedicated schema
```

### Multi-Service Architecture Enhancement

**Service Hierarchy Implementation:**
- 60% Performance / 25% Teaching / 15% Collaboration allocation
- Cross-service testimonial system
- Unified contact form routing
- Service-aware navigation

---
**Last Updated**: August 2025  
**Related**: [Component Hierarchy](../architecture/component-hierarchy.md) | [Content API](../api/content-schemas.md)