import { motion } from 'framer-motion';
import { useSectionContent, useStats } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';
import { pluralize } from '@/utils/string';
import { SmartContactCTA } from '@/components/ui/SmartContactCTA';
import { SmartRoutingDebug } from '@/components/debug/SmartRoutingDebug';
import type { ContactContext, ServiceType } from '@/utils/contactRouting';
import type { InquiryFormData } from '@/types/forms';

export function Contact() {
  const { data: contact, loading, error } = useSectionContent('contact');
  const { socialProof } = useStats();

  /**
   * Enhanced form open handler with journey analysis
   */
  const handleFormOpen = (serviceType: ServiceType, context: ContactContext) => {
    console.log('Enhanced Contact form opened:', {
      service: serviceType,
      confidence: context.sessionData.confidenceScore,
      referralSource: context.referralSourceType,
      journeyLength: context.userJourney.length,
      campaignData: context.campaignData
    });
  };

  /**
   * Enhanced form submit handler with context tracking
   */
  const handleFormSubmit = (serviceType: ServiceType, data: InquiryFormData, context: ContactContext) => {
    console.log('Enhanced Contact form submitted:', {
      service: serviceType,
      data,
      context: {
        confidence: context.sessionData.confidenceScore,
        referralSource: context.referralSourceType,
        sessionDuration: Math.round(context.sessionData.totalTimeSpent / 1000),
        campaignSource: context.campaignData?.utm_source
      }
    });
  };

  /**
   * Journey analysis handler for debugging and optimization
   */
  const handleJourneyAnalyzed = (context: ContactContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('User journey analyzed in Contact section:', {
        primaryInterest: context.sessionData.primaryServiceInterest,
        confidence: context.sessionData.confidenceScore,
        pagesVisited: context.sessionData.pagesVisited,
        referralType: context.referralSourceType
      });
    }
  };

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
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-heading font-bold mb-4"
            variants={fadeInUp}
          >
            {contact.title}
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {contact.subtitle}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Contact Methods */}
          <motion.div 
            className="space-y-8"
            variants={slideInLeft}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-heading font-bold mb-6 text-brand-yellow-accent">
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-yellow-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-yellow-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Phone</h4>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-yellow-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Follow</h4>
                    <div className="flex space-x-4">
                      {contact.social.instagram && (
                        <a 
                          href={contact.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                          aria-label="Instagram"
                        >
                          Instagram
                        </a>
                      )}
                      {contact.social.youtube && (
                        <a 
                          href={contact.social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                          aria-label="YouTube"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-yellow-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Location</h4>
                    <p className="text-white/70">
                      {contact.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Smart Contact CTA and Additional Info */}
          <motion.div 
            className="space-y-8"
            variants={slideInRight}
          >
            {/* Enhanced Smart Contact CTA with personalization and confidence indicators */}
            <motion.div variants={fadeInUp}>
              <SmartContactCTA
                variant="personalized"
                showServiceInfo={true}
                showConfidenceIndicator={true}
                enablePersonalization={true}
                analyticsSource="contact_section_enhanced"
                className="mb-8"
                onFormOpen={handleFormOpen}
                onFormSubmit={handleFormSubmit}
                onJourneyAnalyzed={handleJourneyAnalyzed}
              />
            </motion.div>

            {/* Enhanced Information with Smart Routing Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-heading font-bold mb-6 text-brand-yellow-accent">
                  Smart Contact Experience
                </h3>
                
                <div className="space-y-6 text-white/90">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Intelligent Service Detection</p>
                      <p className="text-sm text-white/70">Automatically detects your service interest based on your journey</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Personalized Form Pre-filling</p>
                      <p className="text-sm text-white/70">Forms are pre-configured based on your specific needs and source</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-yellow-accent rounded-full flex items-center justify-center 
                      flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-brand-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Context-Aware Responses</p>
                      <p className="text-sm text-white/70">Tailored information based on your referral source and journey</p>
                    </div>
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
                  <div className="text-2xl font-bold text-brand-yellow-accent">{socialProof.studentsCount}</div>
                  <div className="text-xs text-white/70">Happy {pluralize(socialProof.studentsCount, 'Student')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">{socialProof.yearsTeaching}</div>
                  <div className="text-xs text-white/70">{pluralize(socialProof.yearsTeaching, 'Year')} Teaching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-yellow-accent">{'⭐'.repeat(socialProof.averageRating)}</div>
                  <div className="text-xs text-white/70">Student Reviews</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Smart Routing Debug Panel (Development Only) */}
      <SmartRoutingDebug 
        isVisible={process.env.NODE_ENV === 'development'}
        position="bottom-right"
        showAnalytics={true}
      />
    </div>
  );
}