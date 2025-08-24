import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations';

/**
 * Service item interface for the hierarchy
 */
interface ServiceItem {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  icon: React.ReactNode;
  prominence: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Services Hierarchy Component
 * 
 * Implements 60/25/15 visual hierarchy for services:
 * - Performance Services: 60% prominence (primary)
 * - Teaching Services: 25% prominence (secondary) 
 * - Collaboration Services: 15% prominence (tertiary)
 */
export function ServicesHierarchy() {
  const services: ServiceItem[] = [
    {
      title: "Live Performance",
      description: "Professional blues and improvisation performances for venues, events, and private functions across Melbourne. Bringing soulful music and engaging stage presence to create memorable experiences.",
      ctaText: "Book Performance",
      ctaLink: "/performance",
      prominence: 'primary',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      title: "Music Lessons",
      description: "Personalized guitar and blues improvisation lessons for all skill levels. Learn proper technique, music theory, and develop your unique style with structured learning paths.",
      ctaText: "Start Learning",
      ctaLink: "#lessons",
      prominence: 'secondary',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Musical Collaboration",
      description: "Partner with other musicians, bands, or projects. Available for studio sessions, songwriting collaborations, and creative musical partnerships.",
      ctaText: "Collaborate",
      ctaLink: "/collaboration",
      prominence: 'tertiary',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        className="container-custom"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-4">
            Musical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional music services tailored to your needs. From live performances to personalized lessons, 
            I bring expertise and passion to every musical experience.
          </p>
        </motion.div>

        {/* Services Grid with Hierarchy */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Primary Service - Performance (60% prominence) */}
          <motion.div 
            className="lg:col-span-7"
            variants={fadeInUp}
          >
            <ServiceCard 
              service={services[0]} 
              size="large"
            />
          </motion.div>

          {/* Secondary and Tertiary Services (40% combined) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Secondary Service - Teaching (25% prominence) */}
            <motion.div variants={fadeInUp}>
              <ServiceCard 
                service={services[1]} 
                size="medium"
              />
            </motion.div>

            {/* Tertiary Service - Collaboration (15% prominence) */}
            <motion.div variants={fadeInUp}>
              <ServiceCard 
                service={services[2]} 
                size="small"
              />
            </motion.div>
          </div>
        </div>

        {/* Analytics Tracking */}
        <div className="mt-16 text-center">
          <motion.p 
            className="text-sm text-gray-500"
            variants={fadeInUp}
          >
            Each service is designed to provide exceptional value and memorable musical experiences
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Service Card Component with size variations
 */
interface ServiceCardProps {
  service: ServiceItem;
  size: 'large' | 'medium' | 'small';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, size }) => {
  const sizeClasses = {
    large: {
      container: "h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 md:p-12 group",
      icon: "w-16 h-16 md:w-20 md:h-20 text-brand-blue-primary mb-6 group-hover:text-brand-yellow-accent transition-colors duration-300",
      title: "text-3xl md:text-4xl font-heading font-bold text-brand-blue-primary mb-4 group-hover:text-brand-blue-secondary transition-colors duration-300",
      description: "text-lg text-gray-600 mb-8 leading-relaxed",
      cta: "inline-flex items-center px-8 py-4 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
    },
    medium: {
      container: "h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group",
      icon: "w-12 h-12 text-brand-blue-primary mb-4 group-hover:text-brand-yellow-accent transition-colors duration-300",
      title: "text-2xl font-heading font-bold text-brand-blue-primary mb-3 group-hover:text-brand-blue-secondary transition-colors duration-300",
      description: "text-base text-gray-600 mb-6 leading-relaxed",
      cta: "inline-flex items-center px-6 py-3 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 shadow-md hover:shadow-lg"
    },
    small: {
      container: "h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 group",
      icon: "w-8 h-8 text-brand-blue-primary mb-3 group-hover:text-brand-yellow-accent transition-colors duration-300",
      title: "text-xl font-heading font-bold text-brand-blue-primary mb-2 group-hover:text-brand-blue-secondary transition-colors duration-300",
      description: "text-sm text-gray-600 mb-4 leading-relaxed",
      cta: "inline-flex items-center px-4 py-2 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 text-sm"
    }
  };

  const classes = sizeClasses[size];

  return (
    <motion.div 
      className={classes.container}
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        // Analytics tracking for service hierarchy engagement
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'service_card_click', {
            event_category: 'Services Hierarchy',
            event_label: service.title,
            service_prominence: service.prominence,
            card_size: size
          });
        }
      }}
    >
      {/* Service Icon */}
      <div className={classes.icon}>
        {service.icon}
      </div>

      {/* Service Title */}
      <h3 className={classes.title}>
        {service.title}
      </h3>

      {/* Service Description */}
      <p className={classes.description}>
        {service.description}
      </p>

      {/* Call to Action */}
      <a 
        href={service.ctaLink}
        className={classes.cta}
        onClick={(e) => {
          e.stopPropagation();
          // Analytics tracking for CTA clicks
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'service_cta_click', {
              event_category: 'Services Hierarchy',
              event_label: `${service.title} - ${service.ctaText}`,
              service_prominence: service.prominence,
              destination: service.ctaLink
            });
          }
        }}
      >
        {service.ctaText}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </motion.div>
  );
};

export default ServicesHierarchy;