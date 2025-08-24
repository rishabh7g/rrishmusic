import React from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SEOHead } from '@/components/common/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useSectionContent } from '@/hooks/useContent';
import PerformanceHero from '@/components/sections/PerformanceHero';
import PerformanceGallery from '@/components/sections/PerformanceGallery';
import { TestimonialsSection, PricingSection, InstagramFeed } from '@/components/sections';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion';
import { SmartContactCTA } from '@/components/ui/SmartContactCTA';
import type { ServiceCardData } from '@/components/ui/ServiceCard';
import { fadeInUp, staggerContainer } from '@/utils/animations';

/**
 * Performance Services Section
 * Showcases available performance services using reusable ServiceCard components
 */
const PerformanceServices: React.FC = () => {
  const sectionContent = useSectionContent('performance-services', {
    fallback: {
      title: 'Performance Services',
      subtitle: 'Professional guitar performances tailored to your venue and event',
      cards: []
    }
  });

  // Default service cards if content fails to load
  const defaultServiceCards: ServiceCardData[] = [
    {
      id: 'band-performances',
      title: 'Band Performances',
      description: 'Full band setup with rhythm section, perfect for venues and large events',
      features: [
        'Full band with rhythm section',
        'Professional sound setup',
        'Custom setlists',
        '2-4 hour performances'
      ],
      price: 'From $800',
      popular: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      ctaText: 'Book Band Performance',
      analyticsId: 'band_performance_cta'
    },
    {
      id: 'solo-acoustic',
      title: 'Solo Acoustic Sets',
      description: 'Intimate acoustic performances ideal for smaller venues and private events',
      features: [
        'Solo acoustic guitar',
        'Intimate atmosphere',
        'Flexible song selection',
        '1-3 hour sets'
      ],
      price: 'From $400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      ctaText: 'Book Solo Performance',
      analyticsId: 'solo_performance_cta'
    },
    {
      id: 'event-entertainment',
      title: 'Event Entertainment',
      description: 'Specialized entertainment for weddings, corporate events, and celebrations',
      features: [
        'Event-specific repertoire',
        'Professional presentation',
        'Flexible timing',
        'Custom arrangements'
      ],
      price: 'Custom Quote',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      ctaText: 'Plan Event Entertainment',
      analyticsId: 'event_entertainment_cta'
    },
    {
      id: 'technical-setup',
      title: 'Technical Setup',
      description: 'Professional audio equipment and technical support for all performances',
      features: [
        'High-quality sound system',
        'Professional mixing',
        'Backup equipment',
        'Technical support'
      ],
      price: 'Included',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      ctaText: 'Learn About Setup',
      analyticsId: 'technical_setup_cta'
    }
  ];

  const serviceCards = sectionContent.cards || defaultServiceCards;

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
          className="text-center mb-12"
        >
          <motion.h2 
            id="services-title"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
          >
            {sectionContent.title}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {sectionContent.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12"
        >
          {serviceCards.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeInUp}
              className="h-full"
            >
              <ServiceCard 
                {...service}
                className="h-full hover:transform hover:-translate-y-2 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Cross-Service Suggestion - Teaching Services */}
        <CrossServiceSuggestion
          fromService="performance"
          pageSection="services"
          placement="inline"
          timing="after-engagement"
          minTimeOnPage={20}
          minScrollPercentage={40}
          className="mb-8"
        />
      </div>
    </section>
  );
};

/**
 * Performance Credentials Section
 */
const PerformanceCredentials: React.FC = () => {
  const sectionContent = useSectionContent('performance-credentials', {
    fallback: {
      title: 'Professional Performance Background',
      subtitle: 'Years of experience delivering memorable musical experiences',
      highlights: []
    }
  });

  // Default credentials if content fails to load
  const defaultHighlights = [
    {
      title: 'Venue Experience',
      description: 'Regular performances at established Melbourne venues',
      details: ['Corner Hotel', 'The Tote', 'Local music venues', 'Private events']
    },
    {
      title: 'Professional Equipment',
      description: 'High-quality instruments and sound systems',
      details: ['Professional guitars', 'Sound system', 'Backup equipment', 'Technical support']
    },
    {
      title: 'Repertoire Depth',
      description: 'Extensive song library across multiple genres',
      details: ['Blues standards', 'Classic rock', 'Contemporary hits', 'Original compositions']
    },
    {
      title: 'Event Adaptability',
      description: 'Flexible performances tailored to your needs',
      details: ['Venue-appropriate volume', 'Custom setlists', 'Professional presentation', 'Reliable service']
    }
  ];

  const highlights = sectionContent.highlights || defaultHighlights;

  return (
    <section 
      id="credentials"
      className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/30 to-neutral-light/10"
      aria-labelledby="credentials-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.h2 
            id="credentials-title"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
          >
            {sectionContent.title}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {sectionContent.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-neutral-charcoal mb-4">
                {highlight.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {highlight.description}
              </p>
              <ul className="space-y-2">
                {highlight.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-brand-blue-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Cross-Service Suggestion - Collaboration Services */}
        <CrossServiceSuggestion
          fromService="performance"
          pageSection="credentials"
          placement="inline"
          timing="after-engagement"
          minTimeOnPage={30}
          minScrollPercentage={60}
          className="mb-8"
        />
      </div>
    </section>
  );
};

/**
 * Performance Page Component
 */
export const Performance: React.FC = () => {
  const seo = usePageSEO('performance');

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          "name": "Rrish Music",
          "description": seo.description,
          "url": seo.canonical,
          "genre": ["Blues", "Rock", "Contemporary"],
          "member": {
            "@type": "Person",
            "name": "Rrish",
            "role": "Guitarist"
          }
        }}
      />
      
      <div className="min-h-screen">
        <ErrorBoundary>
          {/* Performance Hero Section */}
          <PerformanceHero />
          
          {/* Performance Gallery Section */}
          <PerformanceGallery />

          {/* Performance Services Section - Now using reusable ServiceCard components */}
          <PerformanceServices />

          {/* Cross-Service Suggestion Banner - Teaching Focus */}
          <section className="py-8">
            <div className="container-custom">
              <CrossServiceSuggestion
                fromService="performance"
                pageSection="portfolio-gallery"
                placement="banner"
                timing="after-engagement"
                minTimeOnPage={45}
                minScrollPercentage={70}
                className="max-w-4xl mx-auto"
              />
            </div>
          </section>

          {/* Performance Credentials Section */}
          <PerformanceCredentials />

          {/* Client Testimonials Section - NEW: Issue #61 Implementation */}
          <TestimonialsSection />

          {/* Performance Pricing Section - NEW: Issue #61 Implementation */}
          <PricingSection />

          {/* Contact Section with Smart CTA */}
          <motion.section
            id="contact"
            className="py-16 lg:py-24 bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="container-custom text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
                  Ready to Book Your Performance?
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 mb-8">
                  Let's discuss your event and create an unforgettable musical experience
                </p>
                
                {/* Smart Contact CTA for Performance Service */}
                <SmartContactCTA
                  forceServiceType="performance"
                  variant="prominent"
                  showServiceInfo={false}
                  ctaText="Book Performance"
                  analyticsSource="performance_page_cta"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Instagram Feed Section */}
          <InstagramFeed />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default Performance;