/**
 * Unified Service CTA Component
 *
 * Consolidated CTA component that handles Performance, Collaboration, and Teaching
 * inquiries through a single, configurable interface. Replaces individual service CTAs
 * while preserving all functionality and styling options.
 *
 * Features:
 * - Service-specific form integration (Performance, Collaboration, Teaching)
 * - Multiple visual variants (primary, secondary, outline, minimal)
 * - Size options (small, medium, large)
 * - Service-specific styling and colors
 * - Pre-configured service variants for easy usage
 * - Full accessibility compliance
 * - Mobile-optimized responsive design
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PerformanceInquiryForm, 
  CollaborationInquiryForm, 
  TeachingInquiryForm,
  type PerformanceInquiryData,
  type CollaborationInquiryData,
  type TeachingInquiryData
} from '@/components/forms'

/**
 * Service Types
 */
export type ServiceType = 'performance' | 'collaboration' | 'teaching'

/**
 * CTA Visual Variants
 */
export type CTAVariant = 'primary' | 'secondary' | 'outline' | 'minimal'

/**
 * CTA Size Options
 */
export type CTASize = 'small' | 'medium' | 'large'

/**
 * Service CTA Props Interface
 */
export interface ServiceCTAProps {
  /**
   * Service type determines which form opens and styling theme
   */
  service: ServiceType
  
  /**
   * Visual style variant
   */
  variant?: CTAVariant
  
  /**
   * Button size
   */
  size?: CTASize
  
  /**
   * Full width button
   */
  fullWidth?: boolean
  
  /**
   * Custom button text (falls back to service defaults)
   */
  children?: React.ReactNode
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Custom click handler (called before opening form)
   */
  onClick?: () => void

  // Service-specific props
  /**
   * Performance: Pre-select event type
   */
  eventType?: PerformanceInquiryData['eventType']
  
  /**
   * Collaboration: Pre-select project type
   */
  projectType?: 'studio' | 'creative' | 'partnership' | 'other'
  
  /**
   * Teaching: Pre-select package type
   */
  initialPackageType?: TeachingInquiryData['packageType']
  
  /**
   * Teaching: Show pricing in CTA
   */
  showPricing?: boolean
  
  /**
   * Teaching: Display variant
   */
  teachingVariant?: 'default' | 'compact' | 'prominent'
  
  /**
   * Custom CTA text override
   */
  ctaText?: string
  
  /**
   * Analytics tracking label
   */
  trackingLabel?: string
}

/**
 * Service-specific color themes
 */
const getServiceColors = (service: ServiceType) => {
  switch (service) {
    case 'performance':
      return {
        primary: 'bg-brand-orange-warm text-white hover:bg-brand-orange-warm/90 shadow-lg hover:shadow-xl focus:ring-brand-orange-warm',
        secondary: 'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary shadow-lg hover:shadow-xl focus:ring-brand-blue-primary',
        outline: 'border-2 border-brand-orange-warm text-brand-orange-warm hover:bg-brand-orange-warm hover:text-white focus:ring-brand-orange-warm',
        minimal: 'text-brand-orange-warm hover:text-brand-orange-warm/80 underline hover:no-underline focus:ring-brand-orange-warm'
      }
    case 'collaboration':
      return {
        primary: 'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary shadow-lg hover:shadow-xl focus:ring-brand-blue-primary',
        secondary: 'bg-brand-blue-secondary text-white hover:bg-brand-blue-primary shadow-lg hover:shadow-xl focus:ring-brand-blue-secondary',
        outline: 'border-2 border-brand-blue-primary text-brand-blue-primary hover:bg-brand-blue-primary hover:text-white focus:ring-brand-blue-primary',
        minimal: 'text-brand-blue-primary hover:text-brand-blue-secondary underline hover:no-underline focus:ring-brand-blue-primary'
      }
    case 'teaching':
      return {
        primary: 'bg-brand-orange-warm text-white hover:bg-brand-orange-warm/90 shadow-lg hover:shadow-xl focus:ring-brand-orange-warm',
        secondary: 'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary shadow-lg hover:shadow-xl focus:ring-brand-blue-primary',
        outline: 'border-2 border-brand-orange-warm text-brand-orange-warm hover:bg-brand-orange-warm hover:text-white focus:ring-brand-orange-warm',
        minimal: 'text-brand-orange-warm hover:text-brand-orange-warm/80 underline hover:no-underline focus:ring-brand-orange-warm'
      }
  }
}

/**
 * Get button classes based on service, variant, and size
 */
const getButtonClasses = (
  service: ServiceType,
  variant: CTAVariant,
  size: CTASize,
  fullWidth: boolean
): string => {
  const baseClasses =
    'font-heading font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-20 inline-flex items-center justify-center'

  // Size classes
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  // Get service-specific colors
  const serviceColors = getServiceColors(service)
  const variantClasses = serviceColors[variant]

  const widthClass = fullWidth ? 'w-full' : ''

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses} ${widthClass}`.trim()
}

/**
 * Get default CTA text for each service
 */
const getDefaultCTAText = (service: ServiceType): string => {
  switch (service) {
    case 'performance':
      return 'Book Performance'
    case 'collaboration':
      return 'Start Collaboration'
    case 'teaching':
      return 'Book Lessons'
  }
}

/**
 * Unified Service CTA Component
 */
export const ServiceCTA: React.FC<ServiceCTAProps> = ({
  service,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  onClick,
  // Service-specific props
  eventType,
  projectType,
  initialPackageType,
  showPricing = false,
  teachingVariant = 'default',
  ctaText,
  trackingLabel,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleClick = () => {
    // Custom onClick handler
    onClick?.()

    // Open appropriate service form
    setIsFormOpen(true)

    // Analytics tracking
    if (trackingLabel) {
      // Add analytics tracking here
      console.log('CTA clicked:', { service, trackingLabel })
    }
  }

  const handleFormSubmit = (data: any) => {
    console.log(`${service} inquiry submitted:`, data)
    // In production, this would send data to your backend/email service
  }

  const buttonClasses = getButtonClasses(service, variant, size, fullWidth)
  const displayText = ctaText || (children as string) || getDefaultCTAText(service)

  // Special rendering for teaching with pricing
  if (service === 'teaching' && showPricing) {
    return (
      <>
        <div className={`text-center ${className}`}>
          <div className="mb-2 text-sm text-neutral-600">
            Starting at
          </div>
          <div className="mb-4 text-2xl font-bold text-brand-orange-warm">
            $50/lesson
          </div>
          <motion.button
            onClick={handleClick}
            className={buttonClasses}
            whileTap={{ scale: 0.95 }}
            aria-label={`Book ${service} inquiry - ${displayText}`}
          >
            {displayText}
          </motion.button>
        </div>

        {isFormOpen && (
          <TeachingInquiryForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </>
    )
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`${buttonClasses} ${className}`}
        whileTap={{ scale: 0.95 }}
        aria-label={`${service} inquiry - ${displayText}`}
      >
        {displayText}
      </motion.button>

      {/* Service-specific form rendering - Using New Unified System */}
      {isFormOpen && service === 'performance' && (
        <PerformanceInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {isFormOpen && service === 'collaboration' && (
        <CollaborationInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {isFormOpen && service === 'teaching' && (
        <TeachingInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  )
}

/**
 * Pre-configured Service CTA Variants
 * These replace the individual service CTA components
 */

// Performance CTA Variants
export const PerformanceCTA: React.FC<Omit<ServiceCTAProps, 'service'>> = (props) => (
  <ServiceCTA service="performance" {...props} />
)

export const PrimaryPerformanceCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="performance" variant="primary" {...props} />
)

export const SecondaryPerformanceCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="performance" variant="secondary" {...props} />
)

export const OutlinePerformanceCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="performance" variant="outline" {...props} />
)

export const MinimalPerformanceCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="performance" variant="minimal" {...props} />
)

// Event-specific Performance CTAs
export const WeddingInquiryCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'eventType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="performance" eventType="wedding" trackingLabel="wedding-inquiry" {...props} />
)

export const CorporateInquiryCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'eventType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="performance" eventType="corporate" trackingLabel="corporate-inquiry" {...props} />
)

export const VenueInquiryCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'eventType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="performance" eventType="venue" trackingLabel="venue-inquiry" {...props} />
)

// Collaboration CTA Variants
export const CollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service'>> = (props) => (
  <ServiceCTA service="collaboration" {...props} />
)

export const PrimaryCollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="collaboration" variant="primary" {...props} />
)

export const SecondaryCollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="collaboration" variant="secondary" {...props} />
)

export const OutlineCollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="collaboration" variant="outline" {...props} />
)

export const MinimalCollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="collaboration" variant="minimal" {...props} />
)

// Project-specific Collaboration CTAs
export const StudioCollaborationCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'projectType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="collaboration" projectType="studio" trackingLabel="studio-collaboration" {...props} />
)

export const CreativeProjectCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'projectType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="collaboration" projectType="creative" trackingLabel="creative-project" {...props} />
)

export const PartnershipInquiryCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'projectType' | 'trackingLabel'>> = (props) => (
  <ServiceCTA service="collaboration" projectType="partnership" trackingLabel="partnership-inquiry" {...props} />
)

// Teaching CTA Variants
export const TeachingCTA: React.FC<Omit<ServiceCTAProps, 'service'>> = (props) => (
  <ServiceCTA service="teaching" {...props} />
)

export const PrimaryTeachingCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="teaching" variant="primary" {...props} />
)

export const SecondaryTeachingCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="teaching" variant="secondary" {...props} />
)

export const OutlineTeachingCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="teaching" variant="outline" {...props} />
)

export const MinimalTeachingCTA: React.FC<Omit<ServiceCTAProps, 'service' | 'variant'>> = (props) => (
  <ServiceCTA service="teaching" variant="minimal" {...props} />
)

// Legacy component names for backward compatibility
export const PerformanceInquiryCTA = PerformanceCTA
export const CollaborationInquiryCTA = CollaborationCTA  
export const TeachingInquiryCTA = TeachingCTA

export default ServiceCTA