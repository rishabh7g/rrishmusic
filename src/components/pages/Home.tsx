import React, { Suspense } from 'react';
import { 
  Hero, 
  About,
  Approach,
  Lessons,
  Community,
  Contact,
  ServicesHierarchy,
  MultiServiceTestimonialsSection
} from '@/components/sections';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { LazySection } from '@/components/common/LazySection';
import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion';
import EnhancedServiceColumn from '@/components/ui/EnhancedServiceColumn';
import ServiceNavigationControls from '@/components/ServiceNavigationControls';
import useMultiServiceTestimonials from '@/hooks/useMultiServiceTestimonials';

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
 * Home Page Component - THREE-COLUMN LAYOUT WITH INTERACTIVE NAVIGATION
 * 
 * Implements the new 3-column layout structure with:
 * - Responsive CSS Grid (3 columns on desktop, stacked on mobile)
 * - Interactive navigation between services with smooth scrolling
 * - Background image system with overlays and optimization
 * - Dynamic service-specific content integration
 * - Real-time statistics and testimonials
 * - Service hierarchy: Performance (primary), Teaching, Collaboration
 * - Mobile-first responsive design principles
 * - Lazy loading for performance optimization
 * - Accessibility support with proper contrast and keyboard navigation
 * - Error handling and loading states
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
  // Load testimonials for homepage display
  const { getFeaturedTestimonials, loading: testimonialsLoading } = useMultiServiceTestimonials();
  
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
        {/* Hero Section - Full Width Introduction */}
        <section id="hero" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Hero" />}>
            <Suspense fallback={<SectionFallback sectionName="Hero" />}>
              <Hero />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* THREE-COLUMN LAYOUT WITH INTERACTIVE NAVIGATION - Main Service Navigation */}
        <section id="three-column-services" className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="container-custom">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-6">
                Professional Music Services
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                From intimate venue performances to personalized guitar instruction and creative collaborations, 
                discover the complete range of musical services tailored to your needs.
              </p>
            </div>

            {/* Interactive Navigation Instructions */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">Navigate:</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Click</span>
                  <span className="text-gray-300">|</span>
                  <span>↑↓ Keys</span>
                  <span className="text-gray-300">|</span>
                  <span>1-3 Numbers</span>
                </div>
              </div>
            </div>

            {/* Three-Column Grid Layout with Enhanced Interactive Service Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              
              {/* Column 1: Performance Services - PRIMARY with Dynamic Content */}
              <EnhancedServiceColumn
                service="performance"
                primary={true}
                lazy={true}
                showDetailedContent={true}
              />

              {/* Column 2: Teaching Services with Dynamic Content */}
              <EnhancedServiceColumn
                service="teaching"
                primary={false}
                lazy={true}
                showDetailedContent={true}
              />

              {/* Column 3: Collaboration Services with Dynamic Content */}
              <EnhancedServiceColumn
                service="collaboration"
                primary={false}
                lazy={true}
                showDetailedContent={true}
              />
            </div>

            {/* Interactive Service Navigation Controls - Fixed Position */}
            <ServiceNavigationControls
              position="fixed"
              showLabels={true}
              compact={false}
              className="hidden md:block"
            />

            {/* Mobile Navigation Controls - Relative Position */}
            <div className="block md:hidden mt-8">
              <ServiceNavigationControls
                position="relative"
                showLabels={true}
                compact={true}
                className="justify-center"
              />
            </div>

            {/* Call-to-Action Section with Enhanced Interactivity */}
            <div className="text-center mt-16">
              <p className="text-lg text-gray-600 mb-8">
                Ready to enhance your musical experience?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center px-8 py-4 bg-brand-blue-primary text-white font-bold rounded-full 
                    hover:bg-brand-blue-secondary transition-all duration-300 shadow-lg hover:shadow-xl 
                    transform hover:-translate-y-1 group"
                >
                  Get Started Today
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/performance"
                  className="inline-flex items-center px-8 py-4 bg-transparent border border-brand-blue-primary 
                    text-brand-blue-primary font-semibold rounded-full hover:bg-brand-blue-primary hover:text-white 
                    transition-all duration-300 group"
                >
                  View All Services
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Hierarchy Section - Performance Dominant */}
        <section id="services-hierarchy" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Services" />}>
            <Suspense fallback={<SectionFallback sectionName="Services" />}>
              <ServicesHierarchy />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Multi-Service Social Proof - Strategic Placement After Services */}
        <section id="homepage-testimonials" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Testimonials" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Testimonials" />}
              rootMargin="200px"
            >
              {!testimonialsLoading && (
                <MultiServiceTestimonialsSection
                  testimonials={getFeaturedTestimonials(6)}
                  title="Trusted Across All Services"
                  subtitle="See what clients say about our performance, teaching, and collaboration services"
                  showFilters={true}
                  showServiceBreakdown={true}
                  maxTestimonials={6}
                  layoutVariant="grid"
                  className="bg-white"
                />
              )}
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* About Section - Performance Background Focus */}
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

        {/* Performance-Focused Cross-Service Suggestion */}
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

        {/* Approach Section - Performance-Focused */}
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

        {/* Final Performance CTA - Before Contact with Interactive Elements */}
        <section className="py-16 bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white relative overflow-hidden">
          {/* Background Interactive Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-brand-yellow-accent rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-ping"></div>
          </div>
          
          <div className="container-custom text-center relative z-10">
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
                  transform hover:-translate-y-1 group"
              >
                View Performance Services
                <svg 
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-white text-white 
                  font-semibold rounded-full hover:bg-white hover:text-brand-blue-primary transition-all duration-300 group"
              >
                Get Quote
                <svg 
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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