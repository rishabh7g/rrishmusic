import React, { Suspense } from 'react';
import { PerformanceHero, PerformanceGallery, MultiServiceTestimonialsSection, PricingSection, InstagramFeed } from '@/components/sections';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { LazySection } from '@/components/common/LazySection';
import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion';
import useMultiServiceTestimonials from '@/hooks/useMultiServiceTestimonials';

// Import collaboration components to integrate them
import { CollaborationPortfolio } from '@/components/sections/CollaborationPortfolio';
import { CollaborationProcess } from '@/components/sections/CollaborationProcess';

// Import universal inquiry form
import UniversalInquiryForm, { UniversalInquiryData } from '@/components/forms/UniversalInquiryForm';

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
 * Props interface for Performance page
 */
interface PerformancePageProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Performance Services Page Component
 * 
 * Features:
 * - Performance-focused hero section
 * - Service showcase with portfolio gallery
 * - Multi-service testimonials with performance emphasis
 * - Cross-service upselling suggestions
 * - Transparent pricing information
 * - Social proof through Instagram feed
 * - Optimized for conversions and user engagement
 */
export const Performance: React.FC<PerformancePageProps> = ({ className = '' }) => {
  // Load testimonials with performance focus
  const { getTestimonialsByService, getFeaturedTestimonials, loading: testimonialsLoading } = useMultiServiceTestimonials();
  
  // Form state management
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleFormSubmit = async (data: UniversalInquiryData) => {
    console.log('Form submission:', data);
    // TODO: Implement actual form submission logic
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <>
      <SEOHead
        title="Live Music Performances & Studio Collaborations | Professional Guitarist Melbourne | Rrish Music"
        description="Professional live music performances, studio work, and musical collaborations in Melbourne. Live performances for venues, events, plus recording sessions and creative project partnerships."
        keywords="Melbourne live music, blues guitarist, wedding music, corporate entertainment, venue performances, studio collaboration, recording sessions, musical partnerships, professional musician"
        canonical="https://www.rrishmusic.com/performance"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Live Music Performance Services",
          "description": "Professional blues guitar performances for venues, events, and private functions",
          "provider": {
            "@type": "Person",
            "name": "Rrish",
            "jobTitle": "Professional Musician"
          },
          "areaServed": "Melbourne, Australia",
          "serviceType": "Entertainment",
          "offers": [
            {
              "@type": "Offer",
              "name": "Wedding Performance Package",
              "description": "Live music for wedding ceremonies and receptions"
            },
            {
              "@type": "Offer", 
              "name": "Corporate Event Entertainment",
              "description": "Professional music for corporate functions and networking events"
            },
            {
              "@type": "Offer",
              "name": "Venue Performance Services",
              "description": "Regular live music performances for restaurants, bars, and venues"
            }
          ]
        }}
      />
      
      <main id="main-content" className={`min-h-screen ${className}`}>
        {/* Performance Hero Section */}
        <section id="performance-hero" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Performance Hero" />}>
            <Suspense fallback={<SectionFallback sectionName="Performance Hero" />}>
              <PerformanceHero />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Performance Portfolio Gallery */}
        <section id="performance-gallery" className="app-section bg-white">
          <ErrorBoundary fallback={<SectionFallback sectionName="Performance Gallery" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Performance Gallery" />}
              rootMargin="200px"
            >
              <PerformanceGallery />
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Cross-Service Suggestion - Teaching Skills */}
        <section className="py-8">
          <div className="container-custom">
            <CrossServiceSuggestion
              fromService="performance"
              pageSection="portfolio"
              placement="inline"
              timing="after-engagement"
              minTimeOnPage={30}
              minScrollPercentage={45}
              className="mb-8"
            />
          </div>
        </section>

        {/* Multi-Service Testimonials - Performance Focused */}
        <section id="performance-testimonials" className="app-section">
          <ErrorBoundary fallback={<SectionFallback sectionName="Testimonials" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Testimonials" />}
              rootMargin="200px"
            >
              {!testimonialsLoading && (
                <MultiServiceTestimonialsSection
                  testimonials={[
                    ...getTestimonialsByService('performance'),
                    ...getFeaturedTestimonials(3).filter(t => t.service !== 'performance')
                  ]}
                  title="Client Testimonials"
                  subtitle="Hear from clients who have experienced the magic of live music at their events"
                  defaultService="performance"
                  showFilters={true}
                  showServiceBreakdown={true}
                  maxTestimonials={9}
                  layoutVariant="grid"
                  className="bg-gradient-to-br from-neutral-light/20 to-neutral-light/10"
                />
              )}
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="app-section bg-white">
          <ErrorBoundary fallback={<SectionFallback sectionName="Pricing" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Pricing" />}
              rootMargin="200px"
            >
              <PricingSection />
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Cross-Service Suggestion - Collaboration Opportunities */}
        <section className="py-8">
          <div className="container-custom">
            <CrossServiceSuggestion
              fromService="performance"
              pageSection="pricing"
              placement="banner"
              timing="after-engagement"
              minTimeOnPage={50}
              minScrollPercentage={65}
              className="max-w-4xl mx-auto"
            />
          </div>
        </section>

        {/* Collaboration Section - Integrated from Collaboration Page */}
        <section id="collaboration" className="py-16 bg-theme-bg-secondary transition-theme-colors">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-theme-text mb-4 transition-theme-colors">
                Studio Work & Creative Collaborations
              </h3>
              <p className="text-lg text-theme-text-secondary max-w-3xl mx-auto transition-theme-colors">
                Beyond live performances, I work with artists, bands, and producers on recording projects, creative collaborations, and studio sessions.
              </p>
            </div>

            {/* Collaboration Portfolio */}
            <ErrorBoundary fallback={<SectionFallback sectionName="Collaboration Portfolio" />}>
              <LazySection
                fallback={<SectionFallback sectionName="Collaboration Portfolio" />}
                rootMargin="200px"
              >
                <CollaborationPortfolio />
              </LazySection>
            </ErrorBoundary>
          </div>
        </section>

        {/* Collaboration Process */}
        <section id="collaboration-process" className="py-16 bg-theme-bg transition-theme-colors">
          <ErrorBoundary fallback={<SectionFallback sectionName="Collaboration Process" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Collaboration Process" />}
              rootMargin="200px"
            >
              <CollaborationProcess />
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Cross-Service Teaching Reference */}
        <section className="py-16 bg-theme-bg-tertiary transition-theme-colors">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-bold text-theme-text mb-4 transition-theme-colors">
                Learn From A Performing Professional
              </h3>
              <p className="text-lg text-theme-text-secondary max-w-3xl mx-auto transition-theme-colors">
                Many performance and collaboration clients also discover the value of learning directly from a working musician.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-theme-bg rounded-xl p-8 shadow-sm border border-theme-border transition-theme-colors">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-theme-secondary/20 rounded-full flex items-center justify-center mr-6">
                    <svg className="w-8 h-8 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-semibold text-theme-text mb-2 transition-theme-colors">Music Lessons</h4>
                    <p className="text-theme-text-secondary transition-theme-colors">Learn piano, guitar, improvisation, and music theory</p>
                  </div>
                </div>
                <p className="text-theme-text-secondary mb-6 transition-theme-colors">
                  "Taking lessons with Rrish after hearing him perform was the best decision. His real-world experience and performance insights make all the difference in my playing." - Alex M.
                </p>
                <a
                  href="/lessons"
                  className="inline-flex items-center bg-theme-secondary text-white px-6 py-3 rounded-full hover:bg-theme-secondary-hover transition-colors duration-300 font-semibold"
                >
                  Explore Music Lessons
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section id="instagram" className="app-section bg-gray-50">
          <ErrorBoundary fallback={<SectionFallback sectionName="Instagram" />}>
            <LazySection
              fallback={<SectionFallback sectionName="Instagram" />}
              rootMargin="200px"
            >
              <InstagramFeed />
            </LazySection>
          </ErrorBoundary>
        </section>

        {/* Final CTA Section - Updated for Performance + Collaboration */}
        <section className="py-16 bg-gradient-to-r from-theme-primary to-theme-secondary text-white">
          <div className="container-custom text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Work Together?
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Whether you need live performance for your event or want to collaborate on a creative project, let's discuss how we can create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-theme-primary
                  font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="tel:+61XXX-XXX-XXX"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-white text-white 
                  font-semibold rounded-full hover:bg-white hover:text-theme-primary transition-all duration-300"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* Universal Inquiry Form */}
        <UniversalInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </main>
    </>
  );
};

export default Performance;