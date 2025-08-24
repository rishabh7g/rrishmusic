import React, { Suspense } from 'react';
import { 
  Hero, 
  About,
  Approach,
  Lessons,
  Community,
  Contact,
  ServicesHierarchy,
} from '@/components/sections';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { LazySection } from '@/components/common/LazySection';
import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion';

/**
 * Section fallback component
 */
const SectionFallback: React.FC<{ sectionName: string }> = ({ sectionName }) => (
  <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-brand-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading {sectionName} section...</p>
    </div>
  </div>
);

/**
 * Props interface for Home page
 */
interface HomePageProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Home Page Component
 * 
 * Multi-service platform homepage implementing 60/25/15 service hierarchy:
 * - Performance services: 60% prominence
 * - Teaching services: 25% prominence  
 * - Collaboration services: 15% prominence
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
  return (
    <>
      <SEOHead
        title="Melbourne Musician | Performance, Teaching & Collaboration | Rrish Music"
        description="Professional Melbourne musician specializing in blues and improvisation. Live performances, personalized music lessons, and collaborative partnerships. Book today!"
        keywords="Melbourne musician, guitar lessons, blues improvisation, live performance, music teacher, collaboration, guitar instructor, music education"
        canonical="https://www.rrishmusic.com/"
        ogType="website"
      />
      
      <main id="main-content" className={`min-h-screen ${className}`}>
        {/* Hero Section */}
        <section id="hero" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Hero" />}>
            <Suspense fallback={<SectionFallback sectionName="Hero" />}>
              <Hero />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Services Hierarchy Section - 60/25/15 Implementation */}
        <section id="services-hierarchy" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Services" />}>
            <Suspense fallback={<SectionFallback sectionName="Services" />}>
              <ServicesHierarchy />
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

        {/* Lessons Section - Lazy loaded with 25% prominence in hierarchy */}
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

        {/* Cross-Service Suggestions Section - Performance Focus */}
        <section className="py-8">
          <div className="container-custom">
            {/* Performance Services Suggestion - Inline with hierarchy emphasis */}
            <CrossServiceSuggestion
              fromService="teaching"
              pageSection="about-instructor"
              placement="inline"
              timing="after-engagement"
              minTimeOnPage={30}
              minScrollPercentage={50}
              className="mb-8"
            />
          </div>
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

        {/* Cross-Service Suggestions Banner - Before Contact with Performance Priority */}
        <section className="py-8">
          <div className="container-custom">
            <CrossServiceSuggestion
              fromService="teaching"
              pageSection="advanced-packages"
              placement="banner"
              timing="before-exit"
              minTimeOnPage={45}
              minScrollPercentage={70}
              className="max-w-4xl mx-auto"
            />
          </div>
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
    </>
  );
};

export default Home;