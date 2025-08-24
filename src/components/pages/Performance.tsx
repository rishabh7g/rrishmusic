import React from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useSectionContent } from '@/hooks/useContent';
import PerformanceHero from '@/components/sections/PerformanceHero';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface PerformancePageProps {
  className?: string;
}

/**
 * Performance page fallback component for error states
 */
const PerformanceErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Performance Page Error
      </h1>
      <p className="text-gray-600 mb-6">
        We're sorry, but there was an error loading the Performance page. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-primary/90 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

/**
 * Loading fallback component for the Performance page
 */
const PerformanceLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-primary mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Performance Services...</p>
    </div>
  </div>
);

/**
 * Enhanced Performance Services Component
 */
const PerformanceServices: React.FC = () => {
  const { data: performanceData, loading } = useSectionContent('performance');

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-8 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const services = performanceData?.services || {
    venues: {
      title: "Venue Performances",
      description: "Regular performances at cafes, restaurants, and live music venues featuring guitar and blues repertoire.",
      highlights: [
        "Weekly residencies available",
        "Acoustic and electric setups",
        "Crowd-engaging performances",
        "Professional reliability"
      ]
    },
    events: {
      title: "Special Events",
      description: "Professional entertainment for weddings, corporate events, and private celebrations with customized setlists.",
      highlights: [
        "Wedding ceremony & reception music",
        "Corporate event entertainment",
        "Private party performances",
        "Customized song selections"
      ]
    },
    sessions: {
      title: "Session Work",
      description: "Studio session guitar work and collaboration with other musicians for recordings and live performances.",
      highlights: [
        "Studio recording sessions",
        "Live performance backing",
        "Musical collaboration",
        "Genre versatility"
      ]
    }
  };

  return (
    <section 
      id="services"
      className="py-16 lg:py-24 bg-white"
      aria-labelledby="services-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 
              id="services-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
            >
              Performance Services
            </h2>
            <p className="text-lg sm:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              Professional music services tailored to create the perfect atmosphere for your venue or event
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Venue Performances */}
            <motion.div
              className="bg-gradient-to-br from-brand-blue-primary/5 to-brand-blue-primary/10 rounded-xl p-8 border border-brand-blue-primary/20 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-brand-blue-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl" role="img" aria-label="Guitar">🎸</span>
                </div>
                <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                  {services.venues.title}
                </h3>
                <p className="text-neutral-charcoal/80 leading-relaxed mb-6">
                  {services.venues.description}
                </p>
              </div>
              <ul className="space-y-2">
                {services.venues.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-charcoal/80">
                    <span className="text-brand-blue-primary mt-1 flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Special Events */}
            <motion.div
              className="bg-gradient-to-br from-brand-orange-warm/5 to-brand-orange-warm/10 rounded-xl p-8 border border-brand-orange-warm/20 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-brand-orange-warm/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl" role="img" aria-label="Celebration">🎉</span>
                </div>
                <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                  {services.events.title}
                </h3>
                <p className="text-neutral-charcoal/80 leading-relaxed mb-6">
                  {services.events.description}
                </p>
              </div>
              <ul className="space-y-2">
                {services.events.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-charcoal/80">
                    <span className="text-brand-orange-warm mt-1 flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Session Work */}
            <motion.div
              className="bg-gradient-to-br from-brand-yellow-accent/5 to-brand-yellow-accent/10 rounded-xl p-8 border border-brand-yellow-accent/20 hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1"
              variants={fadeInUp}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-brand-yellow-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl" role="img" aria-label="Recording">🎵</span>
                </div>
                <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                  {services.sessions.title}
                </h3>
                <p className="text-neutral-charcoal/80 leading-relaxed mb-6">
                  {services.sessions.description}
                </p>
              </div>
              <ul className="space-y-2">
                {services.sessions.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-charcoal/80">
                    <span className="text-brand-yellow-accent mt-1 flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Performance Credentials Section
 */
const PerformanceCredentials: React.FC = () => {
  const { data: performanceData } = useSectionContent('performance');
  
  const credentials = performanceData?.credentials || [
    "10+ years of live performance experience",
    "Regular performances across Melbourne venues",
    "Specialized in blues and acoustic genres",
    "Professional audio equipment and setup"
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-neutral-gray-light to-white">
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-heading font-bold text-neutral-charcoal mb-12"
            variants={fadeInUp}
          >
            Professional Experience
          </motion.h2>
          
          <motion.div 
            className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {credentials.map((credential, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
                variants={fadeInUp}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-blue-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-brand-blue-primary font-bold text-sm">✓</span>
                  </div>
                  <p className="text-neutral-charcoal font-medium leading-relaxed">
                    {credential}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Enhanced Performance page component following the multi-service platform architecture
 * 
 * Features:
 * - Mobile-first responsive design
 * - SEO optimization with usePageSEO hook
 * - Error boundary integration
 * - Framer Motion animations
 * - TypeScript type safety
 * - Semantic HTML structure
 * - Accessibility compliance
 * - Professional performance hero section
 * - Comprehensive service sections
 * - Strong call-to-action elements
 */
export const Performance: React.FC<PerformancePageProps> = ({ 
  className = '' 
}) => {
  // Configure SEO metadata for the Performance page
  usePageSEO({
    title: 'Performance Services - Live Music & Events | Rrish Music',
    description: 'Professional live music performances and event entertainment services by Rrish. Guitar performances, blues sessions, and live music for venues and special occasions in Melbourne.',
    keywords: 'live music performance, guitar performances, blues music, event entertainment, Melbourne live music, professional musician, venue performances, wedding music, corporate events',
    type: 'website',
    twitterCard: 'summary_large_image'
  });

  return (
    <>
      {/* SEO Head component for meta tags */}
      <SEOHead
        title="Performance Services - Live Music & Events | Rrish Music"
        description="Professional live music performances and event entertainment services by Rrish. Guitar performances, blues sessions, and live music for venues and special occasions in Melbourne."
        keywords="live music performance, guitar performances, blues music, event entertainment, Melbourne live music, professional musician, venue performances, wedding music, corporate events"
        type="website"
      />
      
      <ErrorBoundary fallback={<PerformanceErrorFallback />}>
        <React.Suspense fallback={<PerformanceLoadingFallback />}>
          <div className={`min-h-screen bg-white ${className}`}>
            {/* Enhanced Hero Section */}
            <PerformanceHero />

            {/* Performance Services Section */}
            <PerformanceServices />

            {/* Performance Credentials Section */}
            <PerformanceCredentials />

            {/* Contact Call-to-Action */}
            <motion.section
              id="contact"
              className="py-16 lg:py-24 bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="container-custom text-center">
                <motion.h2 
                  className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6"
                  variants={fadeInUp}
                >
                  Ready to Book a Performance?
                </motion.h2>
                <motion.p 
                  className="text-lg sm:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
                  variants={fadeInUp}
                >
                  Get in touch to discuss your venue or event requirements, check availability, and create a memorable musical experience for your audience
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  variants={fadeInUp}
                >
                  <a
                    href="mailto:hello@rrishmusic.com"
                    className="inline-flex items-center justify-center bg-brand-orange-warm text-white font-heading font-semibold px-8 py-4 rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20 shadow-xl text-lg min-w-48"
                    aria-label="Send email to book performance"
                  >
                    Email for Booking
                  </a>
                  <a
                    href="https://instagram.com/rrishmusic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-heading font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-brand-blue-primary transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg min-w-48"
                    aria-label="View Instagram profile for more performance content"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    View Instagram
                  </a>
                </motion.div>
              </div>
            </motion.section>
          </div>
        </React.Suspense>
      </ErrorBoundary>
    </>
  );
};

// Set display name for debugging
Performance.displayName = 'Performance';

// Default export for route configuration
export default Performance;