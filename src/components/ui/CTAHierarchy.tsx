/**
 * CTA Hierarchy Component
 *
 * Implements Primary/Secondary CTA strategy to reduce decision paralysis
 * and improve conversion rates with clear visual hierarchy.
 *
 * Hierarchy Strategy:
 * - Primary CTA: "Book Performance" (60% visual weight, high contrast)
 * - Secondary CTAs: "Guitar Lessons" & "Collaborate" (25%/15% visual weight)
 * - Mobile-optimized with thumb-friendly spacing
 * - Analytics tracking for A/B testing and conversion optimization
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { PerformanceInquiryCTA } from './PerformanceInquiryCTA'
import { TeachingInquiryCTA } from './TeachingInquiryCTA'
import { CollaborationInquiryCTA } from './CollaborationInquiryCTA'

/**
 * CTA placement context for analytics and styling
 */
export type CTAContext = 'hero' | 'services' | 'footer' | 'inline' | 'sticky'

/**
 * CTA layout configuration
 */
export type CTALayout = 'horizontal' | 'vertical' | 'stacked'

/**
 * Props interface for CTA Hierarchy
 */
interface CTAHierarchyProps {
  /**
   * Layout orientation
   */
  layout?: CTALayout

  /**
   * Context for analytics and styling
   */
  context?: CTAContext

  /**
   * Show only primary CTA for focused conversion
   */
  primaryOnly?: boolean

  /**
   * Custom messaging for specific contexts
   */
  customMessages?: {
    primary?: string
    secondary?: string
    tertiary?: string
  }

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Pre-select event type for performance CTA
   */
  performanceEventType?: string

  /**
   * Pre-select package for teaching CTA
   */
  teachingPackageType?: 'individual' | 'package_4' | 'package_8'

  /**
   * Pre-select collaboration project type
   */
  collaborationProjectType?: 'studio' | 'creative' | 'partnership' | 'other'
}

/**
 * CTA Hierarchy Component
 */
export const CTAHierarchy: React.FC<CTAHierarchyProps> = ({
  layout = 'horizontal',
  context = 'services',
  primaryOnly = false,
  customMessages,
  className = '',
  performanceEventType,
  teachingPackageType,
  collaborationProjectType,
}) => {
  // Analytics tracking state
  const [interactions, setInteractions] = useState<{
    primaryViewed: boolean
    primaryClicked: boolean
    secondaryViewed: boolean
    secondaryClicked: boolean
    tertiaryViewed: boolean
    tertiaryClicked: boolean
  }>({
    primaryViewed: false,
    primaryClicked: false,
    secondaryViewed: false,
    secondaryClicked: false,
    tertiaryViewed: false,
    tertiaryClicked: false,
  })

  // Track CTA interactions for analytics
  const trackInteraction = (
    cta: 'primary' | 'secondary' | 'tertiary',
    action: 'view' | 'click'
  ) => {
    const key =
      `${cta}${action === 'view' ? 'Viewed' : 'Clicked'}` as keyof typeof interactions

    if (!interactions[key]) {
      setInteractions(prev => ({ ...prev, [key]: true }))

      // Send analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cta_interaction', {
          event_category: 'CTA Hierarchy',
          event_label: `${cta}_${action}`,
          cta_context: context,
          cta_layout: layout,
        })
      }
    }
  }

  // Layout configurations
  const layoutClasses = {
    horizontal:
      'flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6',
    vertical: 'flex flex-col items-center space-y-4',
    stacked: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  }

  // Context-specific styling
  const contextStyles = {
    hero: 'py-8',
    services: 'py-6',
    footer: 'py-4',
    inline: 'py-3',
    sticky: 'py-2',
  }

  return (
    <motion.div
      className={`${layoutClasses[layout]} ${contextStyles[context]} ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onViewportEnter={() => trackInteraction('primary', 'view')}
    >
      {/* Primary CTA - Book Performance (60% prominence) */}
      <motion.div
        variants={fadeInUp}
        className="order-1 sm:order-1"
        onViewportEnter={() => trackInteraction('primary', 'view')}
      >
        <PerformanceInquiryCTA
          variant="primary"
          size={context === 'hero' ? 'large' : 'medium'}
          fullWidth={layout === 'vertical'}
          eventType={performanceEventType as string}
          trackingLabel={`${context}_primary_cta`}
          className="shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 
                     bg-gradient-to-r from-brand-yellow-accent to-yellow-400 
                     hover:from-yellow-400 hover:to-brand-yellow-accent
                     text-brand-blue-primary font-bold text-lg sm:text-xl
                     px-8 py-4 rounded-full border-4 border-brand-blue-primary/20
                     hover:border-brand-blue-primary/30"
          onClick={() => trackInteraction('primary', 'click')}
        >
          {customMessages?.primary || 'Book Live Performance'}
        </PerformanceInquiryCTA>
      </motion.div>

      {!primaryOnly && (
        <>
          {/* Secondary CTA - Guitar Lessons (25% prominence) */}
          <motion.div
            variants={fadeInUp}
            className="order-2 sm:order-2"
            onViewportEnter={() => trackInteraction('secondary', 'view')}
          >
            <TeachingInquiryCTA
              variant="prominent"
              initialPackageType={teachingPackageType}
              ctaText={customMessages?.secondary || 'Guitar Lessons'}
              className="bg-brand-blue-primary text-white hover:bg-brand-blue-secondary
                         px-6 py-3 rounded-full font-semibold
                         shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300
                         border-2 border-transparent hover:border-brand-yellow-accent/30"
              onClick={() => trackInteraction('secondary', 'click')}
            />
          </motion.div>

          {/* Tertiary CTA - Collaborate (15% prominence) */}
          <motion.div
            variants={fadeInUp}
            className="order-3 sm:order-3"
            onViewportEnter={() => trackInteraction('tertiary', 'view')}
          >
            <CollaborationInquiryCTA
              variant="outline"
              size="small"
              fullWidth={layout === 'vertical'}
              projectType={collaborationProjectType}
              className="border-2 border-brand-blue-primary/50 text-brand-blue-primary
                         hover:border-brand-blue-primary hover:bg-brand-blue-primary/5
                         px-4 py-2 rounded-full font-medium text-sm
                         transition-all duration-300"
              onClick={() => trackInteraction('tertiary', 'click')}
            >
              {customMessages?.tertiary || 'Collaborate'}
            </CollaborationInquiryCTA>
          </motion.div>
        </>
      )}

      {/* A/B Testing Data Collection (Hidden) */}
      <div
        className="hidden"
        data-cta-analytics={JSON.stringify({
          context,
          layout,
          primaryOnly,
          timestamp: Date.now(),
          interactions,
        })}
      />
    </motion.div>
  )
}

export default CTAHierarchy
