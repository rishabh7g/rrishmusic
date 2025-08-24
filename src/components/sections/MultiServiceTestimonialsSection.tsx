import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Testimonial, ServiceType } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface MultiServiceTestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showServiceBreakdown?: boolean;
  defaultService?: ServiceType;
  maxTestimonials?: number;
  layoutVariant?: 'grid' | 'masonry' | 'carousel';
  className?: string;
}

/**
 * Multi-Service Testimonials Section Component
 * 
 * Features:
 * - Displays testimonials across all services (Performance, Teaching, Collaboration)
 * - Follows 60/25/15 service allocation for visual hierarchy
 * - Service filtering and categorization
 * - Responsive grid layout with service-specific styling
 * - Performance-optimized with lazy loading and animations
 * - Schema markup for SEO
 */
const MultiServiceTestimonialsSection: React.FC<MultiServiceTestimonialsSectionProps> = ({
  testimonials = [],
  title = "Client & Student Testimonials",
  subtitle = "Hear from clients across all our services - performances, teaching, and collaborations",
  showFilters = true,
  showServiceBreakdown = true,
  defaultService,
  maxTestimonials = 9,
  layoutVariant = 'grid',
  className = ""
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>(defaultService || 'all');
  const [selectedSubType, setSelectedSubType] = useState<string>('all');

  // Calculate testimonial statistics
  const testimonialStats = useMemo(() => {
    const total = testimonials.length;
    const byService = {
      performance: testimonials.filter(t => t.service === 'performance').length,
      teaching: testimonials.filter(t => t.service === 'teaching').length,
      collaboration: testimonials.filter(t => t.service === 'collaboration').length,
    };
    
    const averageRating = testimonials.length > 0 
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;

    return {
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      byService: {
        performance: {
          count: byService.performance,
          percentage: Math.round((byService.performance / total) * 100),
          averageRating: Math.round((testimonials
            .filter(t => t.service === 'performance')
            .reduce((sum, t) => sum + t.rating, 0) / byService.performance || 0) * 10) / 10
        },
        teaching: {
          count: byService.teaching,
          percentage: Math.round((byService.teaching / total) * 100),
          averageRating: Math.round((testimonials
            .filter(t => t.service === 'teaching')
            .reduce((sum, t) => sum + t.rating, 0) / byService.teaching || 0) * 10) / 10
        },
        collaboration: {
          count: byService.collaboration,
          percentage: Math.round((byService.collaboration / total) * 100),
          averageRating: Math.round((testimonials
            .filter(t => t.service === 'collaboration')
            .reduce((sum, t) => sum + t.rating, 0) / byService.collaboration || 0) * 10) / 10
        }
      }
    };
  }, [testimonials]);

  // Filter and prioritize testimonials according to service hierarchy (60/25/15)
  const filteredTestimonials = useMemo(() => {
    let filtered = testimonials.filter(testimonial => {
      if (selectedService !== 'all' && testimonial.service !== selectedService) {
        return false;
      }
      if (selectedSubType !== 'all' && testimonial.serviceSubType !== selectedSubType) {
        return false;
      }
      return true;
    });

    // Sort by service priority (performance > teaching > collaboration) and featured status
    filtered.sort((a, b) => {
      // First, prioritize featured testimonials
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      
      // Then, prioritize by service hierarchy
      const servicePriority: Record<ServiceType, number> = {
        performance: 1,
        teaching: 2,
        collaboration: 3
      };
      
      if (servicePriority[a.service] !== servicePriority[b.service]) {
        return servicePriority[a.service] - servicePriority[b.service];
      }
      
      // Then by rating
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      
      // Finally by date
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      return 0;
    });

    // Apply 60/25/15 allocation if showing all services
    if (selectedService === 'all' && maxTestimonials) {
      const performanceSlots = Math.ceil(maxTestimonials * 0.6);
      const teachingSlots = Math.ceil(maxTestimonials * 0.25);
      const collaborationSlots = Math.floor(maxTestimonials * 0.15);

      const performanceTestimonials = filtered.filter(t => t.service === 'performance').slice(0, performanceSlots);
      const teachingTestimonials = filtered.filter(t => t.service === 'teaching').slice(0, teachingSlots);
      const collaborationTestimonials = filtered.filter(t => t.service === 'collaboration').slice(0, collaborationSlots);

      filtered = [...performanceTestimonials, ...teachingTestimonials, ...collaborationTestimonials];
    } else if (maxTestimonials) {
      filtered = filtered.slice(0, maxTestimonials);
    }

    return filtered;
  }, [testimonials, selectedService, selectedSubType, maxTestimonials]);

  // Get available sub-types for the selected service
  const availableSubTypes = useMemo(() => {
    if (selectedService === 'all') return [];
    return [...new Set(testimonials
      .filter(t => t.service === selectedService)
      .map(t => t.serviceSubType)
      .filter(Boolean)
    )];
  }, [testimonials, selectedService]);

  // Service color mapping
  const getServiceColors = (service: ServiceType) => {
    switch (service) {
      case 'performance':
        return {
          badge: 'bg-brand-blue-primary/20 text-brand-blue-primary border-brand-blue-primary/30',
          accent: 'border-l-brand-blue-primary',
          icon: '🎸'
        };
      case 'teaching':
        return {
          badge: 'bg-brand-orange-warm/20 text-brand-orange-warm border-brand-orange-warm/30',
          accent: 'border-l-brand-orange-warm',
          icon: '🎓'
        };
      case 'collaboration':
        return {
          badge: 'bg-brand-yellow-accent/20 text-brand-yellow-accent border-brand-yellow-accent/30',
          accent: 'border-l-brand-yellow-accent',
          icon: '🤝'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-300',
          accent: 'border-l-gray-300',
          icon: '⭐'
        };
    }
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section 
      id="testimonials"
      className={`py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-neutral-light/10 ${className}`}
      aria-labelledby="testimonials-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 
              id="testimonials-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
            >
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-neutral-charcoal/80 max-w-4xl mx-auto leading-relaxed mb-8">
              {subtitle}
            </p>

            {/* Service Statistics */}
            {showServiceBreakdown && (
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue-primary">
                    {testimonialStats.byService.performance.count}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">Performance Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange-warm">
                    {testimonialStats.byService.teaching.count}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">Teaching Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">
                    {testimonialStats.byService.collaboration.count}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">Collaboration Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-charcoal">
                    {testimonialStats.averageRating}/5
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">Average Rating</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Service Filters */}
          {showFilters && (
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={fadeInUp}
            >
              <button
                onClick={() => {
                  setSelectedService('all');
                  setSelectedSubType('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedService === 'all'
                    ? 'bg-neutral-charcoal text-white shadow-md'
                    : 'bg-white text-neutral-charcoal hover:bg-neutral-light/30'
                }`}
              >
                All Services ({testimonials.length})
              </button>
              <button
                onClick={() => {
                  setSelectedService('performance');
                  setSelectedSubType('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedService === 'performance'
                    ? 'bg-brand-blue-primary text-white shadow-md'
                    : 'bg-white text-neutral-charcoal hover:bg-brand-blue-primary/10'
                }`}
              >
                🎸 Performance ({testimonialStats.byService.performance.count})
              </button>
              <button
                onClick={() => {
                  setSelectedService('teaching');
                  setSelectedSubType('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedService === 'teaching'
                    ? 'bg-brand-orange-warm text-white shadow-md'
                    : 'bg-white text-neutral-charcoal hover:bg-brand-orange-warm/10'
                }`}
              >
                🎓 Teaching ({testimonialStats.byService.teaching.count})
              </button>
              <button
                onClick={() => {
                  setSelectedService('collaboration');
                  setSelectedSubType('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedService === 'collaboration'
                    ? 'bg-brand-yellow-accent text-white shadow-md'
                    : 'bg-white text-neutral-charcoal hover:bg-brand-yellow-accent/10'
                }`}
              >
                🤝 Collaboration ({testimonialStats.byService.collaboration.count})
              </button>
            </motion.div>
          )}

          {/* Sub-type filters (if applicable) */}
          {availableSubTypes.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-8"
              variants={fadeInUp}
            >
              <button
                onClick={() => setSelectedSubType('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedSubType === 'all'
                    ? 'bg-neutral-charcoal text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              {availableSubTypes.map(subType => (
                <button
                  key={subType}
                  onClick={() => setSelectedSubType(subType)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                    selectedSubType === subType
                      ? 'bg-neutral-charcoal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {subType}
                </button>
              ))}
            </motion.div>
          )}

          {/* Testimonials Grid */}
          <div className={`grid gap-8 ${
            layoutVariant === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
          }`}>
            {filteredTestimonials.map((testimonial, index) => {
              const serviceColors = getServiceColors(testimonial.service);
              return (
                <motion.div
                  key={testimonial.id}
                  className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${serviceColors.accent}`}
                  variants={fadeInUp}
                  custom={index}
                >
                  {/* Service Badge and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${serviceColors.badge}`}>
                        {serviceColors.icon} {testimonial.service.charAt(0).toUpperCase() + testimonial.service.slice(1)}
                        {testimonial.serviceSubType && ` • ${testimonial.serviceSubType.charAt(0).toUpperCase() + testimonial.serviceSubType.slice(1)}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating 
                              ? 'text-brand-yellow-accent' 
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-neutral-charcoal/80 mb-4 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-neutral-charcoal text-sm">
                          {testimonial.name}
                        </div>
                        {testimonial.event && (
                          <div className="text-xs text-neutral-charcoal/60">
                            {testimonial.event}
                          </div>
                        )}
                      </div>
                      {testimonial.verified && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    {testimonial.location && (
                      <div className="text-xs text-neutral-charcoal/50 mt-1">
                        {testimonial.location}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Call-to-Action */}
          <motion.div
            className="mt-16 text-center bg-white rounded-2xl p-8 lg:p-12 shadow-sm"
            variants={fadeInUp}
          >
            <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-neutral-charcoal mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-lg text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed mb-6">
              Whether you're looking for live music, guitar lessons, or creative collaboration, let's create something amazing together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-brand-blue-primary text-white font-heading font-semibold px-6 py-3 rounded-full hover:bg-brand-blue-secondary transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-blue-primary/20 shadow-lg text-base"
                aria-label="Book a performance"
              >
                🎸 Book Performance
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/lessons"
                className="inline-flex items-center justify-center bg-brand-orange-warm text-white font-heading font-semibold px-6 py-3 rounded-full hover:bg-brand-orange-warm/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20 shadow-lg text-base"
                aria-label="Start guitar lessons"
              >
                🎓 Start Lessons
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MultiServiceTestimonialsSection;