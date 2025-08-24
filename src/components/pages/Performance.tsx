import React, { Suspense } from 'react';
import { PerformanceHero, PerformanceGallery, MultiServiceTestimonialsSection, PricingSection, InstagramFeed } from '@/components/sections';
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

  return (
    <>
      <SEOHead
        title="Live Music Performance Services | Professional Blues Guitarist Melbourne | Rrish Music"
        description="Professional live music performances for venues, weddings, corporate events, and private functions in Melbourne. Authentic blues guitar entertainment with engaging stage presence and customized setlists."
        keywords="Melbourne live music, blues guitarist, wedding music, corporate entertainment, venue performances, private events, professional musician, live entertainment"
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

        {/* Cross-Service Social Proof Section */}
        <section className="py-16 bg-gradient-to-br from-brand-blue-primary/5 to-brand-orange-warm/5">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-bold text-neutral-charcoal mb-4">
                More Than Just Performance
              </h3>
              <p className="text-lg text-neutral-charcoal/80 max-w-3xl mx-auto">
                Many of our performance clients also discover the value of our guitar teaching and collaboration services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Teaching Cross-Reference */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-orange-warm/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-neutral-charcoal">Guitar Lessons</h4>
                    <p className="text-sm text-neutral-charcoal/60">Learn from a performing professional</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-charcoal/80 mb-4">
                  "Taking lessons with Rrish after hearing him perform was the best decision. His real-world experience makes all the difference." - Alex M.
                </p>
                <a
                  href="/lessons"
                  className="inline-flex items-center text-brand-orange-warm hover:text-brand-orange-warm/80 font-medium text-sm"
                >
                  Explore Teaching Services
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Collaboration Cross-Reference */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-yellow-accent/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-neutral-charcoal">Collaboration</h4>
                    <p className="text-sm text-neutral-charcoal/60">Studio work and creative projects</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-charcoal/80 mb-4">
                  "Working with Rrish on our EP was incredible. His guitar work added exactly the soul we were looking for." - The Midnight Owls
                </p>
                <a
                  href="/collaboration"
                  className="inline-flex items-center text-brand-yellow-accent hover:text-brand-yellow-accent/80 font-medium text-sm"
                >
                  Explore Collaboration
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
          <div className="container-custom text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Book Your Performance?
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Let's discuss your event needs and create a customized live music experience that will make your occasion unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary 
                  font-bold rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1"
              >
                Get Performance Quote
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="tel:+61XXX-XXX-XXX"
                className="inline-flex items-center px-8 py-4 bg-transparent border border-white text-white 
                  font-semibold rounded-full hover:bg-white hover:text-brand-blue-primary transition-all duration-300"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Performance;