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
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { ServiceCTA } from './ServiceCTA'
import type { ServiceCTAProps } from './ServiceCTA'

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

  // Layout configurations
  const layoutClasses = {
    horizontal:
      'flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6',
    vertical: 'flex flex-col items-center justify-center gap-4',
    stacked: 'flex flex-col items-stretch gap-3 max-w-sm mx-auto',
  }

  // Context-specific styling
  const contextStyles = {
    hero: 'py-8',
    services: 'py-6',
    footer: 'py-4',
    inline: 'py-2',
    sticky: 'py-3',
  }

  // Analytics handlers
  const trackPrimaryClick = () => {
    setInteractions(prev => ({ ...prev, primaryClicked: true }))
    // Analytics event would be sent here
    console.log('Primary CTA clicked', { context })
  }

  const trackSecondaryClick = () => {
    setInteractions(prev => ({ ...prev, secondaryClicked: true }))
    // Analytics event would be sent here
    console.log('Secondary CTA clicked', { context })
  }

  const trackTertiaryClick = () => {
    setInteractions(prev => ({ ...prev, tertiaryClicked: true }))
    // Analytics event would be sent here
    console.log('Tertiary CTA clicked', { context })
  }

  // Determine CTA sizes based on hierarchy
  const primarySize: ServiceCTAProps['size'] =
    layout === 'stacked' ? 'medium' : 'large'
  const secondarySize: ServiceCTAProps['size'] = 'medium'
  const tertiarySize: ServiceCTAProps['size'] =
    layout === 'stacked' ? 'small' : 'medium'

  return (
    <motion.section
      className={`${contextStyles[context]} ${className}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      aria-label="Service inquiry options"
    >
      <div className={layoutClasses[layout]}>
        {/* Primary CTA - Performance Services (60% hierarchy) */}
        <motion.div variants={fadeInUp} className="order-1">
          <ServiceCTA
            service="performance"
            variant="primary"
            size={primarySize}
            fullWidth={layout === 'stacked'}
            eventType={performanceEventType as any}
            onClick={trackPrimaryClick}
            trackingLabel={`primary-performance-${context}`}
            className="shadow-lg"
          >
            {customMessages?.primary || 'Book Performance'}
          </ServiceCTA>
        </motion.div>

        {!primaryOnly && (
          <>
            {/* Secondary CTA - Teaching Services (25% hierarchy) */}
            <motion.div variants={fadeInUp} className="order-2">
              <ServiceCTA
                service="teaching"
                variant="secondary"
                size={secondarySize}
                fullWidth={layout === 'stacked'}
                initialPackageType={teachingPackageType}
                onClick={trackSecondaryClick}
                trackingLabel={`secondary-teaching-${context}`}
                showPricing={context === 'hero'}
              >
                {customMessages?.secondary || 'Guitar Lessons'}
              </ServiceCTA>
            </motion.div>

            {/* Tertiary CTA - Collaboration Services (15% hierarchy) */}
            <motion.div variants={fadeInUp} className="order-3">
              <ServiceCTA
                service="collaboration"
                variant="outline"
                size={tertiarySize}
                fullWidth={layout === 'stacked'}
                projectType={collaborationProjectType}
                onClick={trackTertiaryClick}
                trackingLabel={`tertiary-collaboration-${context}`}
              >
                {customMessages?.tertiary || 'Collaborate'}
              </ServiceCTA>
            </motion.div>
          </>
        )}
      </div>

      {/* Context-specific additional content */}
      {context === 'hero' && !primaryOnly && (
        <motion.div
          variants={fadeInUp}
          className="mt-4 text-center text-sm text-neutral-600"
        >
          <p>Professional musician with 15+ years experience</p>
        </motion.div>
      )}
    </motion.section>
  )
}

export default CTAHierarchy
