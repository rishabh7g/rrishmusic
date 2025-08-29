# Performance Optimization Guide

This guide covers comprehensive performance optimization strategies for the RrishMusic platform, focusing on Core Web Vitals, bundle optimization, and user experience improvements.

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP) - Target: < 2.5s

**Current Implementation:**
The project uses a unified performance monitoring system in `src/utils/performance.ts`.

**Optimization Strategies:**

1. **Image Optimization with WebP and Lazy Loading:**
```typescript
// src/utils/imageUtils.ts enhancement
export const optimizeImage = (src: string, options: ImageOptions = {}): string => {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    loading = 'lazy'
  } = options

  // For portfolio images, prioritize WebP format
  if (supportsWebP()) {
    return `${src}?format=${format}&quality=${quality}&w=${width}&h=${height}`
  }
  
  return src
}

// Component usage
const PortfolioImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={optimizeImage(src, { width: 600, height: 400, format: 'webp' })}
    alt={alt}
    loading="lazy"
    decoding="async"
    onLoad={handleImageLoad}
  />
)
```

2. **Critical CSS Inlining:**
```html
<!-- In index.html -->
<style>
  /* Critical above-the-fold styles */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Prevent layout shift during font loading */
  .font-primary {
    font-display: swap;
  }
</style>
```

3. **Resource Prioritization:**
```typescript
// In main component
useEffect(() => {
  // Preload critical resources
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = '/hero-image.webp'
  link.as = 'image'
  document.head.appendChild(link)
}, [])
```

### First Input Delay (FID) - Target: < 100ms

1. **Code Splitting with React.lazy:**
```typescript
// Lazy load non-critical components
const PerformancePortfolio = lazy(() => import('@/components/sections/performance/PerformancePortfolio'))
const CollaborationServices = lazy(() => import('@/components/pages/Collaboration'))

// In routes
<Route
  path="/performance"
  element={
    <Suspense fallback={<PageSkeleton />}>
      <PerformancePortfolio />
    </Suspense>
  }
/>
```

2. **Event Handler Optimization:**
```typescript
// Debounce expensive operations
import { debounce } from '@/utils/performance'

const SearchComponent = () => {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query)
    }, 300),
    []
  )

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

3. **Long Task Breaking:**
```typescript
// Break up long tasks into smaller chunks
export const processLargeDataset = async (data: unknown[]) => {
  const CHUNK_SIZE = 100
  const results = []

  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE)
    const processed = await processChunk(chunk)
    results.push(...processed)
    
    // Yield control to browser
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  return results
}
```

### Cumulative Layout Shift (CLS) - Target: < 0.1

1. **Skeleton Loading Screens:**
```typescript
// src/components/ui/Skeleton.tsx
export const ContentSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
)

// Usage in components
const PerformanceSection = () => {
  const { data, loading } = usePerformanceData()
  
  if (loading) {
    return <ContentSkeleton />
  }
  
  return <div>{/* Actual content */}</div>
}
```

2. **Image Dimension Specification:**
```typescript
// Always specify image dimensions
const HeroImage = () => (
  <img
    src="/hero-image.webp"
    alt="Performance"
    width={1200}
    height={800}
    style={{ aspectRatio: '3/2' }}
    className="w-full h-auto"
  />
)
```

3. **Font Loading Optimization:**
```css
/* In index.css */
@font-face {
  font-family: 'Primary';
  src: url('/fonts/primary.woff2') format('woff2');
  font-display: swap; /* Prevent layout shift */
  font-weight: 400;
}

/* Fallback font matching */
body {
  font-family: 'Primary', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## Bundle Size Optimization

### Current Bundle Analysis

1. **Analyze bundle size:**
```bash
# Add to package.json
"analyze": "npx vite-bundle-analyzer"

# Run analysis
npm run analyze
```

2. **Vite Configuration Optimization:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          
          // Feature-based splitting
          'feature-performance': [
            './src/components/pages/Performance.tsx',
            './src/components/sections/performance'
          ],
          'feature-collaboration': [
            './src/components/pages/Collaboration.tsx'
          ]
        }
      }
    },
    // Enable compression
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    // CSS code splitting
    cssCodeSplit: true
  },
  // Enable tree shaking
  esbuild: {
    treeShaking: true
  }
})
```

### Library Optimization

1. **Import Optimization:**
```typescript
// ❌ Avoid default imports from large libraries
import * as motion from 'framer-motion'

// ✅ Use specific imports
import { motion, AnimatePresence } from 'framer-motion'

// ❌ Importing entire utility libraries
import _ from 'lodash'

// ✅ Import specific functions
import { debounce } from 'lodash-es/debounce'
// Or implement lightweight alternatives
```

2. **Dynamic Imports for Features:**
```typescript
// Load heavy features only when needed
const loadPerformanceAnalytics = () => 
  import('@/utils/performanceAnalytics').then(module => module.default)

const PerformanceSection = () => {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    // Load analytics only when component mounts
    loadPerformanceAnalytics().then(setAnalytics)
  }, [])

  return <div>{/* Component content */}</div>
}
```

## FOUC Prevention

### Theme System Optimization

1. **Inline Critical Theme Styles:**
```html
<!-- In index.html -->
<script>
  (function() {
    // Immediate theme application before React loads
    const theme = localStorage.getItem('rrishmusic-theme') || 'system'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const activeTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
    
    document.documentElement.setAttribute('data-theme', activeTheme)
    document.documentElement.style.colorScheme = activeTheme
    
    // Disable transitions during initial load
    document.documentElement.classList.add('theme-no-transition')
  })()
</script>

<style>
  /* Critical theme variables */
  :root {
    --bg-primary: #ffffff;
    --text-primary: #000000;
  }
  
  [data-theme="dark"] {
    --bg-primary: #000000;
    --text-primary: #ffffff;
  }
  
  .theme-no-transition * {
    transition: none !important;
  }
  
  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin: 0;
  }
</style>
```

2. **React Theme Context Optimization:**
```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('system')

  useEffect(() => {
    // Re-enable transitions after hydration
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-no-transition')
    }, 100)

    setMounted(true)
    return () => clearTimeout(timer)
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-black" />
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## Advanced Performance Strategies

### Service Worker Implementation

```typescript
// public/sw.js
const CACHE_NAME = 'rrishmusic-v1'
const urlsToCache = [
  '/',
  '/performance',
  '/static/css/main.css',
  '/static/js/main.js',
  '/hero-image.webp'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})
```

### Memory Management

1. **Component Cleanup:**
```typescript
const PerformanceComponent = () => {
  useEffect(() => {
    const subscription = performanceMonitor.subscribe(handleMetrics)
    const interval = setInterval(collectMetrics, 5000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
      // Clean up any remaining references
    }
  }, [])

  return <div>{/* Component content */}</div>
}
```

2. **Event Listener Management:**
```typescript
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }, 100)

    window.addEventListener('resize', handleResize)
    handleResize() // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel() // Cancel any pending debounced calls
    }
  }, [])

  return size
}
```

## Performance Monitoring Implementation

### Web Vitals Tracking

```typescript
// src/utils/performanceMonitor.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}

  constructor() {
    this.initializeWebVitals()
  }

  private initializeWebVitals() {
    getCLS((metric) => {
      this.metrics.CLS = metric.value
      this.reportMetric('CLS', metric.value)
    })

    getFID((metric) => {
      this.metrics.FID = metric.value
      this.reportMetric('FID', metric.value)
    })

    getFCP((metric) => {
      this.metrics.FCP = metric.value
      this.reportMetric('FCP', metric.value)
    })

    getLCP((metric) => {
      this.metrics.LCP = metric.value
      this.reportMetric('LCP', metric.value)
    })

    getTTFB((metric) => {
      this.metrics.TTFB = metric.value
      this.reportMetric('TTFB', metric.value)
    })
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics service
    console.log(`[Performance] ${name}: ${value}`)
    
    // Optional: Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('web_vital', { metric: name, value })
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}

// Usage in app
export const performanceMonitor = new PerformanceMonitor()
```

### Custom Performance Hooks

```typescript
// src/hooks/usePerformance.ts
export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics())
    }

    const interval = setInterval(updateMetrics, 1000)
    updateMetrics() // Initial call

    return () => clearInterval(interval)
  }, [])

  return metrics
}

// Usage in components
const PerformanceDebugger = () => {
  const metrics = usePerformance()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black text-white text-sm">
      <div>LCP: {metrics.LCP?.toFixed(2)}ms</div>
      <div>FID: {metrics.FID?.toFixed(2)}ms</div>
      <div>CLS: {metrics.CLS?.toFixed(3)}</div>
    </div>
  )
}
```

## Performance Testing Checklist

### Automated Testing

1. **Lighthouse CI Integration:**
```json
// .github/workflows/performance.yml
name: Performance Testing
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

2. **Performance Budget Configuration:**
```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

### Manual Testing Guidelines

1. **Core Web Vitals Testing:**
   - Test on 3G network conditions
   - Test on mobile devices (especially mid-range Android)
   - Use Chrome DevTools Performance tab
   - Monitor for layout shifts during content loading

2. **Bundle Size Monitoring:**
   - Keep main bundle under 200KB gzipped
   - Monitor chunk sizes in development
   - Regular bundle analysis runs

3. **Memory Leak Detection:**
   - Use Chrome DevTools Memory tab
   - Monitor heap size during navigation
   - Check for retained objects after component unmount

Remember: Performance is not just about technical metrics—it directly impacts user experience and conversion rates. Prioritize optimizations based on real user impact.