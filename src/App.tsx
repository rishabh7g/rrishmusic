import React, { Suspense, useMemo } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import {
  Hero,
  About,
  Approach,
  Lessons,
  Community,
  Contact,
} from '@/components/sections'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { SEOHead } from '@/components/common/SEOHead'
import { LazySection } from '@/components/common/LazySection'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { NAVIGATION_ITEMS } from '@/utils/constants'
import '@/index.css'

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

/**
 * Loading fallback component
 */
const SectionFallback: React.FC<{ sectionName: string }> = React.memo(
  ({ sectionName }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {sectionName}...</p>
      </div>
    </div>
  )
)

SectionFallback.displayName = 'SectionFallback'

/**
 * Global error fallback component
 */
const AppErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-6">
        We're sorry, but something went wrong. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
)

/**
 * Performance monitoring component for development
 */
const PerformanceMonitor: React.FC = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime)
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as LayoutShiftEntry
            if (!layoutShiftEntry.hadRecentInput) {
              console.log('CLS:', layoutShiftEntry.value)
            }
          }
        }
      })

      try {
        observer.observe({
          entryTypes: [
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
          ],
        })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }

      return () => observer.disconnect()
    }
  }, [])

  return null
}

function App(): React.JSX.Element {
  // Memoize section IDs to prevent unnecessary recalculations
  const sectionIds = useMemo(() => NAVIGATION_ITEMS.map(item => item.id), [])

  const activeSection = useScrollSpy(sectionIds, {
    offset: 100,
    throttle: 50, // Reduce throttle for smoother updates
    rootMargin: '-10% 0px -85% 0px',
  })

  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <SEOHead
        title="Guitar Lessons & Blues Improvisation"
        description="Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels. Start your musical journey today!"
        keywords="guitar lessons, blues improvisation, music teacher, Melbourne, guitar instructor, music education"
        type="website"
      />

      <PerformanceMonitor />

      <div className="app-container">
        <Navigation activeSection={activeSection} />

        <main id="main-content" className="main-content">
          {/* Hero Section - Load immediately */}
          <section id="hero" className="app-section">
            <ErrorBoundary fallback={<SectionFallback sectionName="Hero" />}>
              <Suspense fallback={<SectionFallback sectionName="Hero" />}>
                <Hero />
              </Suspense>
            </ErrorBoundary>
          </section>

          {/* About Section - Lazy loaded */}
          <section id="about" className="app-section">
            <ErrorBoundary fallback={<SectionFallback sectionName="About" />}>
              <LazySection
                fallback={<SectionFallback sectionName="About" />}
                rootMargin="200px"
              >
                <About />
              </LazySection>
            </ErrorBoundary>
          </section>

          {/* Approach Section - Lazy loaded */}
          <section id="approach" className="app-section">
            <ErrorBoundary
              fallback={<SectionFallback sectionName="Approach" />}
            >
              <LazySection
                fallback={<SectionFallback sectionName="Approach" />}
                rootMargin="200px"
              >
                <Approach />
              </LazySection>
            </ErrorBoundary>
          </section>

          {/* Lessons Section - Lazy loaded */}
          <section id="lessons" className="app-section">
            <ErrorBoundary fallback={<SectionFallback sectionName="Lessons" />}>
              <LazySection
                fallback={<SectionFallback sectionName="Lessons" />}
                rootMargin="200px"
              >
                <Lessons />
              </LazySection>
            </ErrorBoundary>
          </section>

          {/* Community Section - Lazy loaded */}
          <section id="community" className="app-section">
            <ErrorBoundary
              fallback={<SectionFallback sectionName="Community" />}
            >
              <LazySection
                fallback={<SectionFallback sectionName="Community" />}
                rootMargin="200px"
              >
                <Community />
              </LazySection>
            </ErrorBoundary>
          </section>

          {/* Contact Section - Lazy loaded */}
          <section id="contact" className="app-section">
            <ErrorBoundary fallback={<SectionFallback sectionName="Contact" />}>
              <LazySection
                fallback={<SectionFallback sectionName="Contact" />}
                rootMargin="200px"
              >
                <Contact />
              </LazySection>
            </ErrorBoundary>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
