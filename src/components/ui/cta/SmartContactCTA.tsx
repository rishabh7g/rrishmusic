/**
 * Enhanced Smart Contact CTA Component v2.0
 *
 * Intelligent contact call-to-action with advanced user journey tracking,
 * referral source detection, and personalized form pre-filling for optimal conversions.
 *
 * Enhanced Features in v2.0:
 * - Advanced user journey analysis and tracking
 * - Intelligent form pre-filling with context awareness
 * - Referral source detection and campaign tracking
 * - Confidence-based routing with fallback handling
 * - Enhanced analytics and conversion optimization
 * - Real-time personalization based on user behavior
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ServiceType,
  ContactContext,
  detectServiceContext,
  getFormTypeFromContext,
  trackContactRouting,
  getUserJourneySummary,
} from '@/utils/contactRouting'
import { 
  PerformanceInquiryForm, 
  CollaborationInquiryForm, 
  TeachingInquiryForm 
} from '@/components/forms'
import { ServiceSelectionModal } from '@/components/ui/ServiceSelectionModal'
import type {
  InquiryFormData,
  FormSubmissionHandler,
  FormInitialData,
} from '@/types/forms'

/**
 * Enhanced props for the Smart Contact CTA v2.0
 */
interface SmartContactCTAProps {
  /**
   * Override the auto-detected service type
   */
  forceServiceType?: ServiceType

  /**
   * CTA button text override
   */
  ctaText?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Display variant with enhanced options
   */
  variant?: 'default' | 'compact' | 'prominent' | 'personalized'

  /**
   * Whether to show service-specific messaging
   */
  showServiceInfo?: boolean

  /**
   * Whether to show confidence indicator for detected service
   */
  showConfidenceIndicator?: boolean

  /**
   * Analytics source tracking
   */
  analyticsSource?: string

  /**
   * Whether to enable intelligent personalization
   */
  enablePersonalization?: boolean

  /**
   * A/B testing variant (for conversion optimization)
   */
  testVariant?: 'A' | 'B' | 'C'

  /**
   * Callback when form is opened
   */
  onFormOpen?: (serviceType: ServiceType, context: ContactContext) => void

  /**
   * Callback when form is submitted
   */
  onFormSubmit?: (
    serviceType: ServiceType,
    data: InquiryFormData,
    context: ContactContext
  ) => void

  /**
   * Callback when user journey is analyzed
   */
  onJourneyAnalyzed?: (context: ContactContext) => void
}

/**
 * Enhanced Smart Contact CTA Component v2.0
 */
export const SmartContactCTA: React.FC<SmartContactCTAProps> = ({
  forceServiceType,
  ctaText,
  className = '',
  variant = 'default',
  showServiceInfo = true,
  showConfidenceIndicator = false,
  enablePersonalization = true,
  onFormOpen,
  onFormSubmit,
  onJourneyAnalyzed,
}) => {
  const location = useLocation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [contactContext, setContactContext] = useState<ContactContext | null>(
    null
  )
  const [formComponent, setFormComponent] = useState<
    | 'PerformanceInquiryForm'
    | 'CollaborationInquiryForm'
    | 'TeachingInquiryForm'
    | 'ServiceSelectionModal'
  >('ServiceSelectionModal')
  const [initialFormData, setInitialFormData] = useState<FormInitialData>({})
  const [preFillData, setPreFillData] = useState<{
    referralSource?: string
    campaignInfo?: string
    userJourneyContext?: string
  }>({})

  /**
   * Enhanced context detection with journey analysis
   */
  const analyzeUserContext = useCallback(() => {
    const context = detectServiceContext(location, document.referrer)
    const detectedService = forceServiceType || context.serviceType
    const enhancedContext = { ...context, serviceType: detectedService }
    const formType = getFormTypeFromContext(enhancedContext)

    setContactContext(enhancedContext)
    setFormComponent(formType.formComponent)
    setInitialFormData(formType.initialData || {})
    setPreFillData(formType.preFillData || {})

    // Track the enhanced detection
    trackContactRouting(enhancedContext, 'detected')

    // Notify parent component of journey analysis
    onJourneyAnalyzed?.(enhancedContext)

    // Development logging for enhanced features
    if (process.env.NODE_ENV === 'development') {
      const journeySummary = getUserJourneySummary()
      console.log('Smart CTA v2.0 Analysis:', {
        detectedService,
        confidence: enhancedContext.sessionData.confidenceScore,
        referralSource: enhancedContext.referralSourceType,
        journeyLength: enhancedContext.userJourney.length,
        campaignData: enhancedContext.campaignData,
        summary: journeySummary,
      })
    }
  }, [location, forceServiceType, onJourneyAnalyzed])

  /**
   * Run context analysis on mount and location changes
   */
  useEffect(() => {
    analyzeUserContext()
  }, [analyzeUserContext])

  /**
   * Handle enhanced CTA click with personalization
   */
  const handleCTAClick = () => {
    if (!contactContext) return

    setIsFormOpen(true)

    // Enhanced tracking with journey context
    trackContactRouting(contactContext, 'form_opened')

    // Notify parent with full context
    onFormOpen?.(contactContext.serviceType, contactContext)
  }

  /**
   * Handle form closure
   */
  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  /**
   * Enhanced form submission with context tracking
   */
  const handleFormSubmit: FormSubmissionHandler = async (
    data: InquiryFormData
  ) => {
    if (!contactContext) return

    console.log('Enhanced Smart CTA form submitted:', {
      service: contactContext.serviceType,
      data,
      context: contactContext,
      preFillData,
    })

    // Enhanced tracking with full context
    trackContactRouting(contactContext, 'form_submitted')

    // Notify parent with full context
    onFormSubmit?.(contactContext.serviceType, data, contactContext)

    // Enhanced success message based on confidence and context
    const confidenceLevel = contactContext.sessionData.confidenceScore
    const personalizedMessage =
      confidenceLevel > 80
        ? `Thank you! Based on your interest in ${contactContext.serviceType} services, I'll get back to you within 24 hours with tailored information.`
        : "Thank you for your inquiry! I'll get back to you within 24 hours."

    alert(personalizedMessage)
  }

  /**
   * Handle service selection from modal with context preservation
   */
  const handleServiceSelect = (serviceType: ServiceType) => {
    if (!contactContext) return

    const updatedContext = { ...contactContext, serviceType }
    const formType = getFormTypeFromContext(updatedContext)

    setContactContext(updatedContext)
    setFormComponent(formType.formComponent)
    setInitialFormData(formType.initialData || {})
    setPreFillData(formType.preFillData || {})
  }

  /**
   * Get enhanced service-specific messaging with personalization
   */
  const getEnhancedServiceMessage = (
    context: ContactContext
  ): {
    title: string
    subtitle: string
    price?: string
    personalizedNote?: string
  } => {
    const baseMessage = getServiceMessage(context.serviceType)

    if (!enablePersonalization) return baseMessage

    let personalizedNote = ''

    // Personalize based on referral source
    switch (context.referralSourceType) {
      case 'social_media':
        personalizedNote = 'Thanks for finding me on social media!'
        break
      case 'search_engine':
        personalizedNote =
          'Great to see you found exactly what you were looking for!'
        break
      case 'email_campaign':
        personalizedNote = 'Thanks for clicking through from my email!'
        break
      case 'internal_navigation':
        personalizedNote = `I see you've been exploring my ${context.sessionData.primaryServiceInterest || 'services'}!`
        break
    }

    // Add confidence-based messaging
    if (context.sessionData.confidenceScore > 80) {
      personalizedNote += ' This looks like a perfect fit.'
    }

    return {
      ...baseMessage,
      personalizedNote,
    }
  }

  /**
   * Base service messaging (unchanged for compatibility)
   */
  const getServiceMessage = (
    service: ServiceType
  ): { title: string; subtitle: string; price?: string } => {
    switch (service) {
      case 'performance':
        return {
          title: 'Book a Performance',
          subtitle: 'Live guitar entertainment for your venue or event',
        }
      case 'collaboration':
        return {
          title: 'Start a Collaboration',
          subtitle: 'Creative partnerships and artistic projects',
        }
      case 'teaching':
        return {
          title: 'Book Guitar Lessons',
          subtitle: 'Personalized instruction for all skill levels',
          price: '$50/lesson',
        }
      default:
        return {
          title: 'Get in Touch',
          subtitle: "Let's discuss how I can help with your musical needs",
        }
    }
  }

  /**
   * Enhanced service-specific styling with confidence indicators
   */
  const getEnhancedServiceStyling = (context: ContactContext) => {
    const base = getServiceStyling(context.serviceType)
    const confidence = context.sessionData.confidenceScore

    // Enhance styling based on confidence level
    const confidenceModifier =
      confidence > 80 ? 'high' : confidence > 50 ? 'medium' : 'low'

    return {
      ...base,
      confidence: confidenceModifier,
      opacity: confidence > 30 ? '100' : '90',
    }
  }

  /**
   * Base service styling (unchanged for compatibility)
   */
  const getServiceStyling = (service: ServiceType) => {
    switch (service) {
      case 'performance':
        return {
          color: 'brand-orange-warm',
          bgGradient: 'from-brand-orange-warm to-brand-orange-warm/90',
        }
      case 'collaboration':
        return {
          color: 'brand-blue-primary',
          bgGradient: 'from-brand-blue-primary to-brand-blue-secondary',
        }
      case 'teaching':
        return {
          color: 'brand-orange-warm',
          bgGradient: 'from-brand-orange-warm to-brand-orange-warm/90',
        }
      default:
        return {
          color: 'brand-blue-primary',
          bgGradient: 'from-brand-blue-primary to-brand-blue-secondary',
        }
    }
  }

  /**
   * Get confidence indicator component
   */
  const renderConfidenceIndicator = (confidence: number) => {
    if (!showConfidenceIndicator || confidence < 30) return null

    const level = confidence > 80 ? 'high' : confidence > 50 ? 'medium' : 'low'
    const colors = {
      high: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-gray-600 bg-gray-100',
    }

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[level]}`}
      >
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {confidence}% match
      </div>
    )
  }

  // Early return if context is not yet loaded
  if (!contactContext) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  const enhancedServiceMessage = getEnhancedServiceMessage(contactContext)
  const enhancedServiceStyling = getEnhancedServiceStyling(contactContext)
  const defaultCTAText = ctaText || enhancedServiceMessage.title
  const confidence = contactContext.sessionData.confidenceScore

  /**
   * Enhanced CTA rendering with personalization variants
   */
  const renderEnhancedCTA = () => {
    const baseClasses =
      'group transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20'

    switch (variant) {
      case 'personalized':
        return (
          <motion.div
            className={`bg-gradient-to-br ${enhancedServiceStyling.bgGradient} rounded-2xl p-8 text-white ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {showServiceInfo && (
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <h3 className="text-2xl font-bold">
                    {enhancedServiceMessage.title}
                  </h3>
                  {renderConfidenceIndicator(confidence)}
                </div>

                <p className="text-white/90 mb-2">
                  {enhancedServiceMessage.subtitle}
                </p>

                {enhancedServiceMessage.personalizedNote && (
                  <motion.p
                    className="text-brand-yellow-accent text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {enhancedServiceMessage.personalizedNote}
                  </motion.p>
                )}

                {enhancedServiceMessage.price && (
                  <div className="text-white mt-3">
                    <span className="text-3xl font-bold">
                      {enhancedServiceMessage.price}
                    </span>
                  </div>
                )}

                {/* Journey context display */}
                {preFillData.userJourneyContext &&
                  process.env.NODE_ENV === 'development' && (
                    <div className="mt-3 text-xs text-white/70 bg-white/10 rounded-lg p-2">
                      {preFillData.userJourneyContext}
                    </div>
                  )}
              </div>
            )}

            <button
              onClick={handleCTAClick}
              className={`${baseClasses} w-full bg-white text-${enhancedServiceStyling.color} font-heading font-bold text-lg py-4 rounded-xl hover:bg-white/95 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-white/20`}
              aria-label={`Open ${contactContext.serviceType} inquiry form`}
            >
              {defaultCTAText}
              <svg
                className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </motion.div>
        )

      case 'compact':
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCTAClick}
              className={`${baseClasses} inline-flex items-center px-6 py-3 bg-gradient-to-r ${enhancedServiceStyling.bgGradient} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-${enhancedServiceStyling.color}/20 ${className}`}
              aria-label={`Open ${contactContext.serviceType} inquiry form`}
            >
              {defaultCTAText}
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            {renderConfidenceIndicator(confidence)}
          </div>
        )

      case 'prominent':
        return (
          <div
            className={`bg-gradient-to-br ${enhancedServiceStyling.bgGradient} rounded-2xl p-8 text-white ${className}`}
          >
            {showServiceInfo && (
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold">
                    {enhancedServiceMessage.title}
                  </h3>
                  {renderConfidenceIndicator(confidence)}
                </div>
                <p className="text-white/90 mb-2">
                  {enhancedServiceMessage.subtitle}
                </p>
                {enhancedServiceMessage.price && (
                  <div className="text-white">
                    <span className="text-3xl font-bold">
                      {enhancedServiceMessage.price}
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleCTAClick}
              className={`${baseClasses} w-full bg-white text-${enhancedServiceStyling.color} font-heading font-bold text-lg py-4 rounded-xl hover:bg-white/95 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-white/20`}
              aria-label={`Open ${contactContext.serviceType} inquiry form`}
            >
              {defaultCTAText}
              <svg
                className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        )

      default:
        return (
          <motion.div
            className={`text-center ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showServiceInfo && enhancedServiceMessage.price && (
              <div className="mb-4">
                <div
                  className={`text-${enhancedServiceStyling.color} text-center`}
                >
                  <span className="text-2xl font-bold">
                    {enhancedServiceMessage.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {enhancedServiceMessage.subtitle}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleCTAClick}
                className={`${baseClasses} inline-flex items-center px-10 py-4 bg-gradient-to-r ${enhancedServiceStyling.bgGradient} text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-${enhancedServiceStyling.color}/20`}
                aria-label={`Open ${contactContext.serviceType} inquiry form`}
              >
                {defaultCTAText}
                <svg
                  className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              {renderConfidenceIndicator(confidence)}
            </div>
          </motion.div>
        )
    }
  }

  return (
    <>
      {renderEnhancedCTA()}

      {/* Enhanced Service-Specific Forms - Using New Unified System */}
      {formComponent === 'PerformanceInquiryForm' && (
        <PerformanceInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {formComponent === 'CollaborationInquiryForm' && (
        <CollaborationInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {formComponent === 'TeachingInquiryForm' && (
        <TeachingInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {formComponent === 'ServiceSelectionModal' && (
        <ServiceSelectionModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onServiceSelect={handleServiceSelect}
        />
      )}
    </>
  )
}

export default SmartContactCTA