/**
 * Cross-Service Suggestion Component
 *
 * Non-intrusive component for suggesting complementary services across the platform.
 * Intelligently shows relevant service suggestions based on user context and behavior.
 *
 * Features:
 * - Context-aware suggestion display
 * - Multiple placement variants (inline, sidebar, banner)
 * - User dismissal and interest tracking
 * - Analytics integration
 * - Responsive design with animations
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getBestSuggestionForContext,
  getDismissedSuggestions,
  trackSuggestionInteraction,
  generateSessionId,
  getContextualMessage,
  type CrossServiceSuggestion,
} from '@/utils/crossServiceSuggestions'
import { ServiceType } from '@/types/content'
import { SmartContactCTA } from '@/components/ui/cta'

/**
 * Props for the Cross-Service Suggestion component
 */
interface CrossServiceSuggestionProps {
  /**
   * Current service context
   */
  fromService: ServiceType

  /**
   * Page section for contextual suggestions
   */
  pageSection?: string

  /**
   * Timing for when to show suggestion
   */
  timing?: 'immediate' | 'after-engagement' | 'before-exit'

  /**
   * Visual placement variant
   */
  placement?: 'inline' | 'sidebar' | 'banner'

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Minimum time on page before showing (seconds)
   */
  minTimeOnPage?: number

  /**
   * Minimum scroll percentage before showing
   */
  minScrollPercentage?: number

  /**
   * Whether to show suggestion immediately regardless of timing
   */
  forceShow?: boolean

  /**
   * Callback when user shows interest
   */
  onInterest?: (suggestion: CrossServiceSuggestion) => void

  /**
   * Callback when user dismisses
   */
  onDismiss?: (suggestion: CrossServiceSuggestion) => void
}

/**
 * Cross-Service Suggestion Component
 */
export const CrossServiceSuggestion: React.FC<CrossServiceSuggestionProps> = ({
  fromService,
  pageSection,
  timing = 'after-engagement',
  placement = 'inline',
  className = '',
  minTimeOnPage = 15,
  minScrollPercentage = 30,
  forceShow = false,
  onInterest,
  onDismiss,
}) => {
  const [suggestion, setSuggestion] = useState<CrossServiceSuggestion | null>(
    null
  )
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [userContext, setUserContext] = useState({
    timeOnPage: 0,
    scrollPercentage: 0,
    hasEngaged: false,
  })

  // Advanced upselling analytics
  // const {
  // trackSuggestionView,
  // trackSuggestionClick,
  // trackSuggestionDismiss
  // } = useUpsellingAnalytics();

  /**
   * Track user engagement and determine when to show suggestion
   */
  useEffect(() => {
    const startTime = Date.now()
    let hasEngaged = false

    // Track time on page
    const timeInterval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
      setUserContext(prev => ({ ...prev, timeOnPage }))
    }, 1000)

    // Track scroll percentage
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.floor((scrollTop / docHeight) * 100)

      if (scrollPercentage > 25 && !hasEngaged) {
        hasEngaged = true
        setUserContext(prev => ({ ...prev, hasEngaged: true }))
      }

      setUserContext(prev => ({ ...prev, scrollPercentage }))
    }

    // Track user interactions
    const handleInteraction = () => {
      if (!hasEngaged) {
        hasEngaged = true
        setUserContext(prev => ({ ...prev, hasEngaged: true }))
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)

    return () => {
      clearInterval(timeInterval)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  /**
   * Load appropriate suggestion based on context
   */
  useEffect(() => {
    const dismissedSuggestions = getDismissedSuggestions()
    const bestSuggestion = getBestSuggestionForContext(
      fromService,
      pageSection,
      timing,
      dismissedSuggestions
    )

    if (bestSuggestion) {
      setSuggestion(bestSuggestion)

      // Track suggestion view
      trackSuggestionInteraction({
        suggestionId: bestSuggestion.id,
        action: 'viewed',
        context: {
          fromService,
          pageSection,
          timing,
          placement,
        },
        timestamp: Date.now(),
        sessionId,
      })
    }
  }, [fromService, pageSection, timing, placement, sessionId])

  /**
   * Determine when to show the suggestion
   */
  useEffect(() => {
    if (!suggestion || isDismissed || forceShow) {
      setIsVisible(forceShow && !isDismissed)
      return
    }

    const shouldShow =
      timing === 'immediate' ||
      (timing === 'after-engagement' &&
        userContext.timeOnPage >= minTimeOnPage &&
        userContext.scrollPercentage >= minScrollPercentage) ||
      (timing === 'before-exit' && userContext.timeOnPage >= minTimeOnPage * 2)

    setIsVisible(shouldShow)
  }, [
    suggestion,
    timing,
    userContext,
    minTimeOnPage,
    minScrollPercentage,
    isDismissed,
    forceShow,
  ])

  /**
   * Handle user interest in suggestion
   */
  const handleInterest = () => {
    if (!suggestion) return

    trackSuggestionInteraction({
      suggestionId: suggestion.id,
      action: 'interested',
      context: {
        fromService,
        pageSection,
        timing,
        placement,
      },
      timestamp: Date.now(),
      sessionId,
    })

    onInterest?.(suggestion)
  }

  /**
   * Handle suggestion dismissal
   */
  const handleDismiss = () => {
    if (!suggestion) return

    setIsDismissed(true)
    setIsVisible(false)

    trackSuggestionInteraction({
      suggestionId: suggestion.id,
      action: 'dismissed',
      context: {
        fromService,
        pageSection,
        timing,
        placement,
      },
      timestamp: Date.now(),
      sessionId,
    })

    onDismiss?.(suggestion)
  }

  /**
   * Handle CTA click
   */
  const handleCTAClick = () => {
    if (!suggestion) return

    trackSuggestionInteraction({
      suggestionId: suggestion.id,
      action: 'clicked',
      context: {
        fromService,
        pageSection,
        timing,
        placement,
      },
      timestamp: Date.now(),
      sessionId,
    })
  }

  if (!suggestion || !isVisible) {
    return null
  }

  const contextualMessage = getContextualMessage(suggestion, {
    fromService,
    timeOnPage: userContext.timeOnPage,
    hasEngaged: userContext.hasEngaged,
  })

  /**
   * Render suggestion based on placement variant
   */
  const renderSuggestion = () => {
    const baseClasses =
      'bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300'

    switch (placement) {
      case 'banner':
        return (
          <div className={`${baseClasses} p-4 ${className}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {contextualMessage}
                </p>
                <h3 className="text-lg font-bold text-neutral-charcoal mb-2">
                  {suggestion.title}
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  {suggestion.description}
                </p>
                <div className="flex items-center space-x-4">
                  <SmartContactCTA
                    forceServiceType={suggestion.targetService}
                    ctaText={suggestion.ctaText}
                    variant="compact"
                    showServiceInfo={false}
                    onFormOpen={handleCTAClick}
                    className="flex-shrink-0"
                  />
                  <button
                    onClick={handleInterest}
                    className="text-sm text-brand-blue-primary hover:text-brand-blue-secondary font-medium"
                  >
                    Tell me more
                  </button>
                </div>
              </div>
              {suggestion.dismissable && (
                <button
                  onClick={handleDismiss}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Dismiss suggestion"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )

      case 'sidebar':
        return (
          <div className={`${baseClasses} p-6 ${className}`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-charcoal">
                {suggestion.title}
              </h3>
              {suggestion.dismissable && (
                <button
                  onClick={handleDismiss}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Dismiss suggestion"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-gray-700 text-sm mb-4">
              {suggestion.description}
            </p>

            <ul className="space-y-2 mb-6">
              {suggestion.benefits.slice(0, 3).map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                >
                  <svg
                    className="w-4 h-4 text-brand-blue-primary mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <SmartContactCTA
                forceServiceType={suggestion.targetService}
                ctaText={suggestion.ctaText}
                variant="compact"
                showServiceInfo={false}
                onFormOpen={handleCTAClick}
                className="w-full"
              />
              <button
                onClick={handleInterest}
                className="w-full text-sm text-gray-600 hover:text-brand-blue-primary font-medium py-2"
              >
                Learn more about this service
              </button>
            </div>
          </div>
        )

      default: // inline
        return (
          <div className={`${baseClasses} p-6 ${className}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {contextualMessage}
                </p>
                <h3 className="text-xl font-bold text-neutral-charcoal">
                  {suggestion.title}
                </h3>
              </div>
              {suggestion.dismissable && (
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Dismiss suggestion"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-gray-700 mb-4">{suggestion.description}</p>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <ul className="space-y-2">
                {suggestion.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-brand-blue-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <SmartContactCTA
                  forceServiceType={suggestion.targetService}
                  ctaText={suggestion.ctaText}
                  variant="compact"
                  showServiceInfo={false}
                  onFormOpen={handleCTAClick}
                  className="flex-1"
                />
                <button
                  onClick={handleInterest}
                  className="text-sm text-brand-blue-primary hover:text-brand-blue-secondary font-medium py-3 px-4 border border-brand-blue-primary/20 hover:border-brand-blue-primary/40 rounded-lg transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: placement === 'banner' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: placement === 'banner' ? -20 : 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="cross-service-suggestion"
        >
          {renderSuggestion()}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CrossServiceSuggestion
