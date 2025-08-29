import { motion } from 'framer-motion'
import { useSectionContent, useStats } from '@/hooks/useContent'
import {
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
} from '@/utils/animations'
import { pluralize } from '@/utils/string'
import { SmartContactCTA } from '@/components/ui/cta'
import { useEmailAutomation } from '@/hooks/useEmailAutomation'
import type { ContactContext } from '@/utils/contactRouting'
import type { ServiceType } from '@/types/content'
import type { InquiryFormData } from '@/types/forms'
import type { ContactFormData } from '@/hooks/useEmailAutomation'

export function Contact() {
  const { data: contact, loading, error } = useSectionContent('contact')
  const { socialProof } = useStats()
  const {
    initializeSequence,
    isSuccess,
    error: automationError,
  } = useEmailAutomation()

  /**
   * Enhanced form open handler with journey analysis
   */
  const handleFormOpen = (
    serviceType: ServiceType,
    context: ContactContext
  ) => {
    console.log('Enhanced Contact form opened:', {
      service: serviceType,
      confidence: context.sessionData.confidenceScore,
      referralSource: context.referralSourceType,
      journeyLength: context.userJourney.length,
      campaignData: context.campaignData,
    })
  }

  /**
   * Enhanced form submit handler with context tracking and email automation
   */
  const handleFormSubmit = async (
    serviceType: ServiceType,
    data: InquiryFormData,
    context: ContactContext
  ) => {
    console.log('Enhanced Contact form submitted:', {
      service: serviceType,
      data,
      context: {
        confidence: context.sessionData.confidenceScore,
        referralSource: context.referralSourceType,
        sessionDuration: Math.round(context.sessionData.totalTimeSpent / 1000),
        campaignSource: context.campaignData?.utm_source,
      },
    })

    // Initialize email automation sequence
    if (data.name && data.email) {
      const automationData: ContactFormData = {
        name: data.name,
        email: data.email,
        serviceType,
        message: data.message,
        phone: data.phone,
        preferredContact: data.preferredContact as
          | 'email'
          | 'phone'
          | 'text'
          | undefined,
        eventDate: data.eventDate,
        budget: data.budget,
        experience: data.experience,
        goals: data.goals,
      }

      try {
        const result = await initializeSequence(automationData)

        if (result.success) {
          console.log(
            `Email automation initiated for ${serviceType} inquiry:`,
            {
              customer: data.name,
              sequenceId: result.sequenceId,
              scheduledEmails: result.scheduledEmails,
              context: {
                referralSource: context.referralSourceType,
                confidence: context.sessionData.confidenceScore,
                campaignSource: context.campaignData?.utm_source,
              },
            }
          )
        } else {
          console.warn('Email automation failed to initialize:', result.error)
        }
      } catch (error) {
        console.error('Email automation error:', error)
      }
    }
  }

  /**
   * Journey analysis handler for debugging and optimization
   */
  const handleJourneyAnalyzed = (context: ContactContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('User journey analyzed in Contact section:', {
        primaryInterest: context.sessionData.primaryServiceInterest,
        confidence: context.sessionData.confidenceScore,
        pagesVisited: context.sessionData.pagesVisited,
        referralType: context.referralSourceType,
      })
    }
  }

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
    )
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
    )
  }

  return (
    <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
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
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Contact Methods */}
          <motion.div className="space-y-8" variants={slideInLeft}>
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
                    <svg
                      className="w-6 h-6 text-brand-blue-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                    <svg
                      className="w-6 h-6 text-brand-blue-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                    <svg
                      className="w-6 h-6 text-brand-blue-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Follow</h4>
                    <div className="flex space-x-4">
                      {contact.social?.instagram && (
                        <a
                          href={contact.social?.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                        >
                          Instagram
                        </a>
                      )}
                      {contact.social?.youtube && (
                        <a
                          href={contact.social?.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                        >
                          YouTube
                        </a>
                      )}
                      {contact.social?.linkedin && (
                        <a
                          href={contact.social?.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-yellow-accent hover:text-white transition-colors duration-300"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Response Time & Automation Info */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-heading font-bold mb-4 text-brand-yellow-accent">
                What to Expect
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold">Immediate Confirmation</p>
                    <p className="text-white/70">
                      You'll receive a personalized response within minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold">24-Hour Follow-up</p>
                    <p className="text-white/70">
                      Detailed response with next steps and availability
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-yellow-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold">Service-Specific Info</p>
                    <p className="text-white/70">
                      Tailored information based on your specific needs
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Automation Status Indicator */}
              {isSuccess && (
                <div className="mt-6 p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm font-semibold text-green-200">
                      Follow-up sequence activated
                    </p>
                  </div>
                  <p className="text-xs text-green-200/70 mt-1">
                    You'll receive personalized updates about your inquiry
                  </p>
                </div>
              )}

              {automationError && (
                <div className="mt-6 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <p className="text-sm font-semibold text-yellow-200">
                      Manual follow-up mode
                    </p>
                  </div>
                  <p className="text-xs text-yellow-200/70 mt-1">
                    I'll personally reach out within 24 hours
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Enhanced Smart Contact CTA and Additional Info */}
          <motion.div className="space-y-8" variants={slideInRight}>
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

            {/* Social Proof & Statistics */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-heading font-bold mb-6 text-brand-yellow-accent">
                Join the Community
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow-accent">
                    {socialProof.students}+
                  </div>
                  <div className="text-sm text-white/70">
                    {pluralize('Student', socialProof.students)} Taught
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow-accent">
                    {socialProof.performances}+
                  </div>
                  <div className="text-sm text-white/70">
                    Live {pluralize('Performance', socialProof.performances)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow-accent">
                    {socialProof.experience}+
                  </div>
                  <div className="text-sm text-white/70">
                    {pluralize('Year', socialProof.experience)} Experience
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-yellow-accent">
                    {socialProof.satisfaction}%
                  </div>
                  <div className="text-sm text-white/70">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Response Guarantee */}
            <motion.div
              className="bg-gradient-to-r from-brand-yellow-accent/20 to-brand-yellow-accent/10 
                         backdrop-blur-sm rounded-3xl p-8 border border-brand-yellow-accent/30"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-yellow-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-blue-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-heading font-bold text-brand-yellow-accent mb-2">
                  24-Hour Response Guarantee
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  I personally respond to every inquiry within 24 hours. Your
                  message matters, and you deserve a thoughtful, detailed
                  response.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Debug Panels - Development Only */}
        {process.env.NODE_ENV === 'development' && <></>}
      </div>
    </div>
  )
}