/**
 * Performance Inquiry CTA Component
 *
 * Features:
 * - Reusable CTA button for performance inquiries
 * - Multiple style variants (primary, secondary, outline)
 * - Configurable event type pre-selection
 * - Mobile-optimized responsive design
 * - Accessibility compliance with proper ARIA labels
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PerformanceInquiryForm, {
  PerformanceInquiryData,
} from '@/components/forms/PerformanceInquiryForm'

export type CTAVariant = 'primary' | 'secondary' | 'outline' | 'minimal'
export type CTASize = 'small' | 'medium' | 'large'

interface PerformanceInquiryCTAProps {
  variant?: CTAVariant
  size?: CTASize
  fullWidth?: boolean
  eventType?: PerformanceInquiryData['eventType']
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

/**
 * Get button classes based on variant and size
 */
const getButtonClasses = (
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

  // Variant classes
  const variantClasses = {
    primary:
      'bg-brand-orange-warm text-white hover:bg-brand-orange-warm/90 shadow-lg hover:shadow-xl focus:ring-brand-orange-warm',
    secondary:
      'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary shadow-lg hover:shadow-xl focus:ring-brand-blue-primary',
    outline:
      'border-2 border-brand-blue-primary text-brand-blue-primary hover:bg-brand-blue-primary hover:text-white focus:ring-brand-blue-primary',
    minimal:
      'text-brand-blue-primary hover:text-brand-blue-secondary underline hover:no-underline focus:ring-brand-blue-primary',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass}`.trim()
}

/**
 * Performance Inquiry CTA Component
 */
export const PerformanceInquiryCTA: React.FC<PerformanceInquiryCTAProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  eventType,
  children,
  className = '',
  onClick,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleClick = () => {
    // Custom onClick handler
    onClick?.()

    // Open inquiry form
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: PerformanceInquiryData) => {
    console.log('Performance inquiry submitted:', data)
    // In production, this would send data to your backend/email service
  }

  const buttonClasses = getButtonClasses(variant, size, fullWidth)

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`${buttonClasses} ${className}`}
        whileTap={{ scale: 0.95 }}
        aria-label={`Open performance inquiry form${eventType ? ` for ${eventType} events` : ''}`}
      >
        {children || (
          <>
            <span>Book Performance</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </>
        )}
      </motion.button>

      <PerformanceInquiryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialEventType={eventType}
      />
    </>
  )
}

/**
 * Predefined CTA Variants for common use cases
 */

export const PrimaryPerformanceCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'variant'>
> = props => <PerformanceInquiryCTA variant="primary" {...props} />

export const SecondaryPerformanceCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'variant'>
> = props => <PerformanceInquiryCTA variant="secondary" {...props} />

export const OutlinePerformanceCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'variant'>
> = props => <PerformanceInquiryCTA variant="outline" {...props} />

export const MinimalPerformanceCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'variant'>
> = props => <PerformanceInquiryCTA variant="minimal" {...props} />

/**
 * Event-Specific CTA Components
 */

export const WeddingInquiryCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'eventType' | 'trackingLabel'>
> = props => (
  <PerformanceInquiryCTA
    eventType="wedding"
    trackingLabel="Wedding CTA"
    {...props}
  >
    {props.children || (
      <>
        <span>Inquire About Wedding Music</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </>
    )}
  </PerformanceInquiryCTA>
)

export const CorporateInquiryCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'eventType' | 'trackingLabel'>
> = props => (
  <PerformanceInquiryCTA
    eventType="corporate"
    trackingLabel="Corporate CTA"
    {...props}
  >
    {props.children || (
      <>
        <span>Book Corporate Entertainment</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H11a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </>
    )}
  </PerformanceInquiryCTA>
)

export const VenueInquiryCTA: React.FC<
  Omit<PerformanceInquiryCTAProps, 'eventType' | 'trackingLabel'>
> = props => (
  <PerformanceInquiryCTA eventType="venue" trackingLabel="Venue CTA" {...props}>
    {props.children || (
      <>
        <span>Book Venue Performance</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </>
    )}
  </PerformanceInquiryCTA>
)

export default PerformanceInquiryCTA
