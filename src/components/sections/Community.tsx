import React from "react";
import { motion } from "framer-motion";
import { useSectionContent, useTestimonials } from "@/hooks/useContent";

export const Community: React.FC = () => {
  const { data: community, loading } = useSectionContent("community");
  const { featured, stats } = useTestimonials({ 
    featured: true, 
    verified: true, 
    limit: 3 
  });

  if (loading) {
    return (
      <div className="section bg-neutral-gray-light">
        <div className="container-custom">
          <div className="loading-container">
            <div className="loading-spinner" />
            <span className="ml-3 text-neutral-charcoal">Loading community content...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="section bg-neutral-gray-light">
        <div className="container-custom">
          <div className="error-container">
            <p className="error-message">Unable to load community content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="section bg-neutral-gray-light">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-neutral-charcoal mb-6">
              {community.title}
            </h2>
            <p className="text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              {community.description}
            </p>
            
            {/* Community Stats */}
            {community.communityStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <motion.div 
                  className="bg-white rounded-lg p-4 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-brand-blue-primary">
                    {community.communityStats.totalStudents}+
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">
                    Total Students
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white rounded-lg p-4 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-brand-blue-primary">
                    {community.communityStats.activeMembers}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">
                    Active Members
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white rounded-lg p-4 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-brand-blue-primary">
                    {community.communityStats.successStories}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">
                    Success Stories
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white rounded-lg p-4 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-brand-blue-primary">
                    {stats?.averageRating || '5.0'}
                  </div>
                  <div className="text-sm text-neutral-charcoal/70">
                    Average Rating
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Featured Testimonials */}
          {featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-center text-neutral-charcoal mb-12">
                What Students Are Saying
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {featured.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Rating Stars */}
                    <div className="flex items-center mb-4">
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
                      {testimonial.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-neutral-charcoal/80 mb-4 text-sm leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="font-medium text-neutral-charcoal text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-neutral-charcoal/60 flex items-center space-x-2">
                        {testimonial.level && (
                          <span className="capitalize">{testimonial.level}</span>
                        )}
                        {testimonial.location && (
                          <>
                            <span>•</span>
                            <span>{testimonial.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Community Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {community.features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-blue-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-brand-blue-primary text-xl">
                      {feature.icon === 'instagram' ? '📸' : '🤝'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-semibold text-neutral-charcoal mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-charcoal/80 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.benefits && (
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-neutral-charcoal/70 flex items-center">
                            <span className="text-brand-orange-warm mr-2">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Instagram CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-white rounded-xl p-8 shadow-sm"
          >
            <h3 className="font-heading text-2xl font-semibold text-neutral-charcoal mb-4">
              {community.instagramFeed.title}
            </h3>
            <p className="text-neutral-charcoal/80 mb-6 max-w-2xl mx-auto">
              {community.instagramFeed.description}
            </p>
            <motion.a
              href="https://instagram.com/rrishmusic"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-brand-blue-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-blue-secondary transition-colors duration-300"
              aria-label="Follow RrishMusic on Instagram (opens in new tab)"
            >
              <span>📸</span>
              <span>Follow @rrishmusic</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};