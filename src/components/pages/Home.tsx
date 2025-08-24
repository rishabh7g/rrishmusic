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
 * Three-Column Service Card Component
 */
const ServiceColumn: React.FC<{
  title: string;
  description: string;
  icon: string;
  href: string;
  primary?: boolean;
  children?: React.ReactNode;
}> = ({ title, description, icon, href, primary = false, children }) => (
  <div 
    className={`
      relative overflow-hidden rounded-xl transition-all duration-300 transform
      ${primary 
        ? 'bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary text-white shadow-xl hover:shadow-2xl hover:-translate-y-2' 
        : 'bg-white border border-gray-200 hover:border-brand-blue-primary hover:shadow-lg hover:-translate-y-1'
      }
      group cursor-pointer
    `}
    onClick={() => window.location.href = href}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = href;
      }
    }}
    aria-label={`Navigate to ${title} services`}
  >
    {/* Background Pattern for Primary Column */}
    {primary && (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
      </div>
    )}
    
    <div className="relative p-8 h-full flex flex-col">
      {/* Icon */}
      <div className={`text-6xl mb-4 transition-transform duration-300 group-hover:scale-110 ${primary ? 'text-brand-yellow-accent' : 'text-brand-blue-primary'}`}>
        {icon}
      </div>
      
      {/* Title */}
      <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-4 ${primary ? 'text-white' : 'text-brand-blue-primary'}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-lg mb-6 flex-grow ${primary ? 'text-white/90' : 'text-gray-600'}`}>
        {description}
      </p>
      
      {/* Call to Action */}
      <div className={`inline-flex items-center font-semibold transition-all duration-300 ${
        primary 
          ? 'text-brand-yellow-accent group-hover:text-white' 
          : 'text-brand-blue-primary group-hover:text-brand-blue-secondary'
      }`}>
        Explore {title}
        <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      
      {/* Additional Content */}
      {children && (
        <div className="mt-6 pt-6 border-t border-current/20">
          {children}
        </div>
      )}
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
 * Home Page Component - THREE-COLUMN LAYOUT TRANSFORMATION
 * 
 * Implements the new 3-column layout structure with:
 * - Responsive CSS Grid (3 columns on desktop, stacked on mobile)
 * - Equal-width columns with proper spacing
 * - Hover states and smooth transitions
 * - Service hierarchy: Performance (primary), Teaching, Collaboration
 * - Mobile-first responsive design principles
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

        {/* THREE-COLUMN LAYOUT - Main Service Navigation */}
        <section id="three-column-services" className="py-16 bg-gradient-to-b from-gray-50 to-white">
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

            {/* Three-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Column 1: Performance Services - PRIMARY */}
              <ServiceColumn
                title="Performances"
                description="Professional live music for venues, events, and celebrations. Authentic blues guitar with engaging stage presence that creates memorable experiences for any audience."
                icon="🎸"
                href="/performance"
                primary={true}
              >
                {/* Performance highlights */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Venues & Events
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Private Functions
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Corporate Entertainment
                  </div>
                </div>
              </ServiceColumn>

              {/* Column 2: Teaching Services */}
              <ServiceColumn
                title="Teaching"
                description="Personalized guitar instruction focused on blues techniques, improvisation, and musical expression. Learn from a professional performer with proven teaching methods."
                icon="🎓"
                href="/teaching"
              >
                {/* Teaching highlights */}
                <div className="space-y-2 text-sm opacity-75">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One-on-One Lessons
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Blues Techniques
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Improvisation Skills
                  </div>
                </div>
              </ServiceColumn>

              {/* Column 3: Collaboration Services */}
              <ServiceColumn
                title="Collaboration"
                description="Creative musical partnerships for recordings, compositions, and artistic projects. Bringing blues guitar expertise to enhance your musical vision."
                icon="🤝"
                href="/collaboration"
              >
                {/* Collaboration highlights */}
                <div className="space-y-2 text-sm opacity-75">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Studio Sessions
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Composition Support
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Creative Projects
                  </div>
                </div>
              </ServiceColumn>
            </div>

            {/* Call-to-Action Section */}
            <div className="text-center mt-12">
              <p className="text-lg text-gray-600 mb-6">
                Ready to enhance your musical experience?
              </p>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-brand-blue-primary text-white font-bold rounded-full 
                  hover:bg-brand-blue-secondary transition-all duration-300 shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1"
              >
                Get Started Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
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

        {/* Final Performance CTA - Before Contact */}
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