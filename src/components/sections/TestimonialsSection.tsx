import React from 'react';
import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface PerformanceTestimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  service: 'wedding' | 'corporate' | 'venue';
  event: string;
  location: string;
  featured: boolean;
  verified: boolean;
}

/**
 * Performance Testimonials Section Component
 * 
 * Features:
 * - Displays client testimonials specifically for performance services
 * - Uses performance data from performance.json
 * - Responsive grid layout with cards
 * - Star ratings and service type badges
 * - Professional presentation matching Performance page design
 */
const TestimonialsSection: React.FC = () => {
  const { data: performanceData, loading } = useSectionContent('performance');
  
  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-neutral-light/10">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-5 h-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const testimonials = (performanceData?.testimonials as PerformanceTestimonial[]) || [];
  
  if (testimonials.length === 0) {
    return null;
  }

  // Service type color mapping
  const getServiceBadgeColor = (service: string) => {
    switch (service) {
      case 'wedding':
        return 'bg-brand-orange-warm/20 text-brand-orange-warm';
      case 'corporate':
        return 'bg-brand-blue-primary/20 text-brand-blue-primary';
      case 'venue':
        return 'bg-brand-yellow-accent/20 text-brand-yellow-accent';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section 
      id="testimonials"
      className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-neutral-light/10"
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
              Client Testimonials
            </h2>
            <p className="text-lg sm:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              Hear from clients who have experienced the magic of live music at their events
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                variants={fadeInUp}
                custom={index}
              >
                {/* Rating and Service Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceBadgeColor(testimonial.service)}`}>
                    {testimonial.service.charAt(0).toUpperCase() + testimonial.service.slice(1)}
                  </span>
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
                      <div className="text-xs text-neutral-charcoal/60">
                        {testimonial.event}
                      </div>
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
                  <div className="text-xs text-neutral-charcoal/50 mt-1">
                    {testimonial.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call-to-Action */}
          <motion.div
            className="mt-16 text-center bg-white rounded-2xl p-8 lg:p-12 shadow-sm"
            variants={fadeInUp}
          >
            <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-neutral-charcoal mb-4">
              Join Our Satisfied Clients
            </h3>
            <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto leading-relaxed mb-6">
              Ready to create memorable musical moments for your event? Let's discuss how we can make your occasion special.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-brand-blue-primary text-white font-heading font-semibold px-8 py-4 rounded-full hover:bg-brand-blue-secondary transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-blue-primary/20 shadow-lg text-lg"
              aria-label="Contact us to book your performance"
            >
              Book Your Performance
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;