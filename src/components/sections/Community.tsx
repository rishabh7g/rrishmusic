import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';
import { useState, useEffect } from 'react';

// Import testimonials directly for now - can be moved to a hook later
import testimonials from '@/content/testimonials.json';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  instrument?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

export function Community() {
  const { data: community, loading, error } = useSectionContent('community');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Filter featured testimonials
  const featuredTestimonials = (testimonials as Testimonial[]).filter(t => t.featured);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredTestimonials.length]);

  if (loading) {
    return (
      <section id="community" className="section bg-neutral-gray-light">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-300 rounded mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-gray-300 rounded mx-auto max-w-md"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8">
                <div className="h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !community) {
    return (
      <section id="community" className="section bg-neutral-gray-light">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
            Community
          </h2>
          <p className="text-lg text-neutral-charcoal mt-4">
            Content temporarily unavailable. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-brand-yellow-accent' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="community" className="section bg-neutral-gray-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand-blue-primary/5 rounded-full translate-x-48"></div>
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-brand-yellow-accent/5 rounded-full -translate-x-40"></div>
      
      <motion.div 
        className="container-custom relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-neutral-charcoal mb-4">
            {community.title}
          </h2>
          <p className="text-xl text-neutral-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            {community.description}
          </p>
          <div className="w-24 h-1 bg-brand-orange-warm mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Testimonial Carousel */}
          <motion.div 
            className="relative"
            variants={slideInLeft}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              {/* Decorative quote mark */}
              <div className="absolute top-4 right-4 text-6xl text-brand-blue-primary/10 font-serif leading-none">
                "
              </div>
              
              {featuredTestimonials.length > 0 && (
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  {/* Stars */}
                  <div className="flex mb-6">
                    {renderStars(featuredTestimonials[activeTestimonial].rating)}
                  </div>
                  
                  {/* Testimonial text */}
                  <blockquote className="text-lg text-neutral-charcoal leading-relaxed mb-6 italic">
                    "{featuredTestimonials[activeTestimonial].text}"
                  </blockquote>
                  
                  {/* Author info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <cite className="font-semibold text-neutral-charcoal not-italic">
                        {featuredTestimonials[activeTestimonial].name}
                      </cite>
                      {featuredTestimonials[activeTestimonial].instrument && (
                        <p className="text-sm text-neutral-charcoal/70 mt-1">
                          {featuredTestimonials[activeTestimonial].instrument} • {' '}
                          {featuredTestimonials[activeTestimonial].level?.charAt(0).toUpperCase() + 
                           featuredTestimonials[activeTestimonial].level?.slice(1)} Level
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Navigation dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {featuredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'bg-brand-blue-primary scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setActiveTestimonial(
                activeTestimonial === 0 ? featuredTestimonials.length - 1 : activeTestimonial - 1
              )}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 
                w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center
                hover:bg-brand-blue-primary hover:text-white transition-all duration-300
                text-neutral-charcoal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTestimonial((activeTestimonial + 1) % featuredTestimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 
                w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center
                hover:bg-brand-blue-primary hover:text-white transition-all duration-300
                text-neutral-charcoal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Community Features */}
          <motion.div 
            className="space-y-8"
            variants={slideInRight}
          >
            <div>
              <h3 className="text-2xl font-heading font-bold text-neutral-charcoal mb-6">
                Join Our Musical Community
              </h3>
              
              <div className="space-y-6">
                {community.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                    custom={index}
                  >
                    <div className="w-8 h-8 bg-brand-blue-primary rounded-full flex items-center 
                      justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-lg text-neutral-charcoal leading-relaxed">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instagram section */}
            <motion.div 
              className="bg-gradient-to-br from-brand-blue-primary/10 to-brand-orange-warm/10 
                rounded-2xl p-6"
              variants={fadeInUp}
            >
              <h4 className="text-xl font-heading font-bold text-neutral-charcoal mb-3">
                {community.instagramFeed.title}
              </h4>
              <p className="text-neutral-charcoal/80 mb-6">
                {community.instagramFeed.description}
              </p>
              
              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 
                  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow @rrishmusic
              </a>
            </motion.div>

            {/* CTA */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-brand-orange-warm text-white 
                  font-semibold rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 
                  shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join the Community
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}