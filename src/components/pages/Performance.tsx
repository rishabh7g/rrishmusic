import React from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
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
        className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
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
 * Basic Performance page component following the multi-service platform architecture
 * 
 * Features:
 * - Mobile-first responsive design
 * - SEO optimization with usePageSEO hook
 * - Error boundary integration
 * - Framer Motion animations
 * - TypeScript type safety
 * - Semantic HTML structure
 * - Accessibility compliance
 */
export const Performance: React.FC<PerformancePageProps> = ({ 
  className = '' 
}) => {
  // Configure SEO metadata for the Performance page
  usePageSEO({
    title: 'Performance Services - Live Music & Events | Rrish Music',
    description: 'Professional live music performances and event entertainment services by Rrish. Guitar performances, blues sessions, and live music for venues and special occasions in Melbourne.',
    keywords: 'live music performance, guitar performances, blues music, event entertainment, Melbourne live music, professional musician, venue performances',
    type: 'website',
    twitterCard: 'summary_large_image'
  });

  return (
    <>
      {/* SEO Head component for meta tags */}
      <SEOHead
        title="Performance Services - Live Music & Events | Rrish Music"
        description="Professional live music performances and event entertainment services by Rrish. Guitar performances, blues sessions, and live music for venues and special occasions in Melbourne."
        keywords="live music performance, guitar performances, blues music, event entertainment, Melbourne live music, professional musician, venue performances"
        type="website"
      />
      
      <ErrorBoundary fallback={<PerformanceErrorFallback />}>
        <React.Suspense fallback={<PerformanceLoadingFallback />}>
          <div className={`min-h-screen bg-white ${className}`}>
            {/* Main content area with semantic structure */}
            <main className="container-custom py-16 lg:py-24" role="main" aria-label="Performance Services">
              
              {/* Hero Section */}
              <motion.section
                className="text-center mb-16"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                aria-labelledby="performance-hero-title"
              >
                <motion.h1
                  id="performance-hero-title"
                  className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-charcoal mb-6"
                  variants={fadeInUp}
                >
                  Performance Services
                </motion.h1>
                
                <motion.p
                  className="text-xl sm:text-2xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed"
                  variants={fadeInUp}
                >
                  Bringing live music and authentic blues performances to venues and special events across Melbourne
                </motion.p>
              </motion.section>

              {/* Services Overview Section */}
              <motion.section
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                aria-labelledby="services-title"
              >
                <h2 id="services-title" className="sr-only">Performance Service Types</h2>
                
                {/* Venue Performances */}
                <motion.div
                  className="bg-gradient-to-br from-brand-blue-primary/5 to-brand-blue-primary/10 rounded-xl p-8 border border-brand-blue-primary/20"
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                    Venue Performances
                  </h3>
                  <p className="text-neutral-charcoal/80 leading-relaxed">
                    Regular performances at cafes, restaurants, and live music venues featuring guitar and blues repertoire.
                  </p>
                </motion.div>

                {/* Special Events */}
                <motion.div
                  className="bg-gradient-to-br from-brand-orange-warm/5 to-brand-orange-warm/10 rounded-xl p-8 border border-brand-orange-warm/20"
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                    Special Events
                  </h3>
                  <p className="text-neutral-charcoal/80 leading-relaxed">
                    Professional entertainment for weddings, corporate events, and private celebrations with customized setlists.
                  </p>
                </motion.div>

                {/* Session Work */}
                <motion.div
                  className="bg-gradient-to-br from-brand-green-fresh/5 to-brand-green-fresh/10 rounded-xl p-8 border border-brand-green-fresh/20 md:col-span-2 lg:col-span-1"
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-heading font-semibold text-neutral-charcoal mb-4">
                    Session Work
                  </h3>
                  <p className="text-neutral-charcoal/80 leading-relaxed">
                    Studio session guitar work and collaboration with other musicians for recordings and live performances.
                  </p>
                </motion.div>
              </motion.section>

              {/* Contact Call-to-Action */}
              <motion.section
                className="text-center bg-gradient-to-r from-brand-blue-primary to-brand-blue-dark rounded-2xl p-12 text-white"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                aria-labelledby="cta-title"
              >
                <h2 id="cta-title" className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                  Ready to Book a Performance?
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Get in touch to discuss your venue or event requirements and availability
                </p>
                <a
                  href="#contact"
                  className="inline-block bg-white text-brand-blue-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20"
                  aria-label="Navigate to contact section to book performance"
                >
                  Get In Touch
                </a>
              </motion.section>
            </main>
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