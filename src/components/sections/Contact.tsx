import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';

export function Contact() {
  const { data: contact, loading, error } = useSectionContent('contact');

  if (loading) {
    return (
      <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-12 bg-white/20 rounded mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-white/20 rounded mx-auto max-w-md"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-6">
                    <div className="h-6 bg-white/20 rounded mb-3"></div>
                    <div className="h-4 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-2xl p-8">
                <div className="h-32 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold">Contact</h2>
          <p className="text-lg mt-4">
            Get in touch at{' '}
            <a 
              href="mailto:hello@rrishmusic.com" 
              className="text-brand-yellow-accent hover:text-white underline"
            >
              hello@rrishmusic.com
            </a>
            {' '}or find me on{' '}
            <a 
              href="https://instagram.com/rrishmusic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-yellow-accent hover:text-white underline"
            >
              Instagram @rrishmusic
            </a>
          </p>
        </div>
      </div>
    );
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  const primaryMethod = contact.methods.find(method => method.primary);
  const secondaryMethods = contact.methods.filter(method => !method.primary);

  return (
    <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/contact-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-yellow-accent/10 rounded-full -translate-x-40"></div>
      
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
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {contact.title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {contact.subtitle}
          </p>
          <div className="w-24 h-1 bg-brand-yellow-accent mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Methods */}
          <motion.div 
            className="space-y-8"
            variants={slideInLeft}
          >
            {/* Primary contact method - featured */}
            {primaryMethod && (
              <motion.a
                href={primaryMethod.href}
                className="block bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 
                  transition-all duration-300 group border border-white/20 hover:border-brand-yellow-accent/50"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                {...(primaryMethod.type === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-brand-yellow-accent text-brand-blue-primary rounded-2xl 
                    flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getContactIcon(primaryMethod.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-brand-yellow-accent 
                      transition-colors duration-300">
                      {primaryMethod.label}
                    </h3>
                    <p className="text-white/80 text-lg">
                      {primaryMethod.value}
                    </p>
                    <p className="text-brand-yellow-accent text-sm mt-1 font-medium">
                      Primary Contact Method
                    </p>
                  </div>
                </div>
              </motion.a>
            )}

            {/* Secondary contact methods */}
            <div className="grid gap-4">
              {secondaryMethods.map((method, index) => (
                <motion.a
                  key={method.type}
                  href={method.href}
                  className="block bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 
                    transition-all duration-300 group border border-white/10"
                  variants={fadeInUp}
                  custom={index + 1}
                  whileHover={{ scale: 1.01, x: 10 }}
                  {...(method.type === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center 
                      group-hover:bg-brand-yellow-accent group-hover:text-brand-blue-primary 
                      transition-all duration-300">
                      {getContactIcon(method.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-brand-yellow-accent 
                        transition-colors duration-300">
                        {method.label}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {method.value}
                      </p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-brand-yellow-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Location */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              variants={fadeInUp}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Location</h4>
                  <p className="text-white/70">
                    {contact.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Info / Call to Action */}
          <motion.div 
            className="space-y-8"
            variants={slideInRight}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-heading font-bold mb-6 text-brand-yellow-accent">
                  Ready to Start Your Musical Journey?
                </h3>
                
                <div className="space-y-6 text-white/90">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Get a personalized lesson plan tailored to your goals</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Ask questions about my teaching approach</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Schedule your first lesson at a convenient time</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Get started on your musical journey today</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick response promise */}
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-brand-yellow-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-brand-yellow-accent">Quick Response</span>
              </div>
              <p className="text-white/80 text-sm">
                I typically respond within 24 hours. Looking forward to hearing from you!
              </p>
            </motion.div>

            {/* Social proof */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-center space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">100+</div>
                  <div className="text-xs text-white/70">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">5+</div>
                  <div className="text-xs text-white/70">Years Teaching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">⭐⭐⭐⭐⭐</div>
                  <div className="text-xs text-white/70">Student Reviews</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}