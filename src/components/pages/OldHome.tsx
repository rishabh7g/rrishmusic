import React, { Suspense, lazy, useEffect } from 'react'

// Lazy load sections - handle named exports properly
const Hero = lazy(() =>
  import('@/components/sections/Hero').then(module => ({
    default: module.Hero,
  }))
)
const ServicesHierarchy = lazy(() =>
  import('@/components/sections/ServicesHierarchy').then(module => ({
    default: module.ServicesHierarchy,
  }))
)
const About = lazy(() =>
  import('@/components/sections/About').then(module => ({
    default: module.About,
  }))
)

import SEOHead from '@/components/common/SEOHead'
import { useContent } from '@/hooks/useContent'
import { performanceMonitor } from '@/utils/performanceMonitor'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

export function Home() {
  const content = useContent()
  const homeContent = content.home
  const device = useDeviceDetection()

  useEffect(() => {
    // Mark homepage rendering performance - fix naming issue
    performanceMonitor.mark('homepage-render')

    return () => {
      // Measure total homepage render time
      performanceMonitor.measure('homepage-render')
    }
  }, [])

  return (
    <>
      <SEOHead
        title={homeContent.heroSection.title}
        description={homeContent.heroSection.description}
        keywords="piano, music, performance, teaching, collaboration, live music"
      />

      <main
        id="main-content"
        className={`min-h-screen bg-gray-50 relative overflow-x-hidden ${device.isMobile ? 'pt-16' : 'pt-20'}`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Hero />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <ServicesHierarchy />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <About />
        </Suspense>
      </main>
    </>
  )
}

export default Home
