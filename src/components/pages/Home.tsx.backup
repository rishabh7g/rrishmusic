import React, { Suspense } from 'react';
import {
  Hero,
  About,
  Approach,
  Lessons,
  Community,
  Contact,
} from '@/components/sections';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { LazySection } from '@/components/common/LazySection';
import { usePageSEO } from '@/hooks/usePageSEO';

interface HomePageProps {
  className?: string;
}

/**
 * Loading fallback component for sections
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
);

SectionFallback.displayName = 'SectionFallback';

/**
 * Home page component containing all the main sections
 * 
 * Features:
 * - Complete teaching platform sections
 * - SEO optimization
 * - Lazy loading for performance
 * - Error boundaries for resilience
 * - Section-based navigation support
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
  // Configure SEO metadata for the Home page
  usePageSEO({
    title: 'Guitar Lessons & Blues Improvisation | Rrish Music',
    description: 'Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels. Start your musical journey today!',
    keywords: 'guitar lessons, blues improvisation, music teacher, Melbourne, guitar instructor, music education',
    type: 'website',
    twitterCard: 'summary_large_image'
  });

  return (
    <>
      {/* SEO Head component for meta tags */}
      <SEOHead
        title="Guitar Lessons & Blues Improvisation | Rrish Music"
        description="Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels. Start your musical journey today!"
        keywords="guitar lessons, blues improvisation, music teacher, Melbourne, guitar instructor, music education"
        type="website"
      />

      <div className={`app-container ${className}`}>
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
    </>
  );
};

// Set display name for debugging
Home.displayName = 'Home';

// Default export for route configuration
export default Home;