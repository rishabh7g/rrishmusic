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
 * Home Page Component - UPDATED for 80/15/5 Content Allocation Rule
 * 
 * Implements strict content allocation:
 * - Performance Services: 80% content focus (hero emphasis, services hierarchy, cross-service suggestions)
 * - Teaching Services: 15% content focus (reduced lessons section, integrated but secondary)
 * - Collaboration Services: 5% content focus (minimal presence, cross-service suggestions only)
 * 
 * Section ordering prioritizes performance content while maintaining user flow.
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
  return (
    <>
      <SEOHead
        title="Melbourne Live Music Performer | Blues Guitar & Professional Performances | Rrish Music"
        description="Professional Melbourne blues guitarist specializing in live performances for venues, events, and private functions. Authentic blues expression with engaging stage presence. Guitar lessons also available."
        keywords="Melbourne live music, blues guitarist, professional performer, venue entertainment, private events, wedding music, corporate entertainment, blues guitar lessons"
        canonical="https://www.rrishmusic.com/"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          "name": "Rrish Music",
          "description": "Professional Melbourne blues guitarist specializing in live performances",
          "url": "https://www.rrishmusic.com/",
          "genre": ["Blues", "Improvisation"],
          "member": {
            "@type": "Person",
            "name": "Rrish",
            "jobTitle": "Professional Musician",
            "performerIn": {
              "@type": "MusicEvent",
              "name": "Melbourne Live Music Performances"
            }
          },
          "offers": {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Live Music Performance Services",
              "category": "Entertainment",
              "areaServed": "Melbourne, Australia"
            }
          }
        }}
      />
      
      <main id="main-content" className={`min-h-screen ${className}`}>
        {/* Hero Section - Performance-Focused (80% allocation) */}
        <section id="hero" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Hero" />}>
            <Suspense fallback={<SectionFallback sectionName="Hero" />}>
              <Hero />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Services Hierarchy Section - Performance Dominant (80% allocation) */}
        <section id="services-hierarchy" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Services" />}>
            <Suspense fallback={<SectionFallback sectionName="Services" />}>
              <ServicesHierarchy />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* About Section - Performance Background Focus (80% allocation) */}
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

        {/* Performance-Focused Cross-Service Suggestion (80% allocation) */}
        <section className="py-12 bg-gradient-to-r from-brand-blue-primary/5 to-brand-yellow-accent/5">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-bold text-brand-blue-primary mb-4">
                Looking for Live Entertainment?
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From intimate venue sessions to major event entertainment, I bring professional blues guitar performances 
                that create memorable experiences for audiences of all sizes.
              </p>
            </div>
            
            <CrossServiceSuggestion
              fromService="teaching"
              pageSection="about-instructor"
              placement="banner"
              timing="after-engagement"
              minTimeOnPage={30}
              minScrollPercentage={50}
              className="max-w-4xl mx-auto"
            />
          </div>
        </section>

        {/* Approach Section - Performance-Focused (Adapted for live performance approach) */}
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

        {/* Teaching Section - Reduced Content (15% allocation) */}
        <section id="lessons" className="app-section bg-gray-50">
          <ErrorBoundary fallback={<SectionFallback sectionName="Lessons" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Lessons" />}
              rootMargin="200px"
            >
              <div className="container-custom">
                {/* Compact teaching section header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-blue-primary mb-4">
                    Guitar Lessons Available
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Learn blues guitar techniques and improvisation skills from a professional performer.
                  </p>
                </div>
                
                {/* Compact lessons component */}
                <div className="max-w-4xl mx-auto">
                  <Lessons />
                </div>
              </div>
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Performance Testimonials Cross-Service (80% allocation) */}
        <section className="py-12">
          <div className="container-custom">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <svg className="w-12 h-12 text-brand-yellow-accent mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-xl font-medium text-gray-800 mb-4">
                "Rrish brings incredible energy and authentic blues expression to every performance. 
                His ability to connect with the audience makes every show memorable."
              </blockquote>
              <cite className="text-gray-600 font-medium">Melbourne Venue Owner</cite>
            </div>
          </div>
        </section>

        {/* Community Section - Lazy loaded with performance focus */}
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

        {/* Final Performance CTA - Before Contact (80% allocation) */}
        <section className="py-16 bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
          <div className="container-custom text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Book Your Live Performance?
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Professional blues guitar entertainment for your venue, event, or celebration. 
              Let's create an unforgettable musical experience together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/performance"
                className="inline-flex items-center px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary 
                  font-bold rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1"
              >
                View Performance Services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-white text-white 
                  font-semibold rounded-full hover:bg-white hover:text-brand-blue-primary transition-all duration-300"
              >
                Get Quote
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section - Performance-Focused Messaging */}
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