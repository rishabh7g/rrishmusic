/**
 * Teaching Inquiry CTA Component
 *
 * Call-to-action component that triggers the Teaching Inquiry Form modal.
 * Designed to integrate seamlessly with existing lesson booking flows while
 * maintaining the $50/lesson pricing prominence.
 *
 * Features:
 * - Configurable initial package selection
 * - Prominent pricing display
 * - Seamless form integration
 * - Context-aware messaging
 * - Consistent design with other CTAs
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TeachingInquiryForm,
  TeachingInquiryData,
} from '@/components/forms/TeachingInquiryForm'

/**
 * Props for the Teaching Inquiry CTA
 */
interface TeachingInquiryCTAProps {
  /**
   * Initial package type to pre-select in the form
   */
  initialPackageType?: TeachingInquiryData['packageType']

  /**
   * CTA button text override
   */
  ctaText?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Display variant
   */
  variant?: 'default' | 'compact' | 'prominent'

  /**
   * Whether to show pricing information in the CTA
   */
  showPricing?: boolean
}

/**
 * Teaching Inquiry CTA Component
 */
export const TeachingInquiryCTA: React.FC<TeachingInquiryCTAProps> = ({
  initialPackageType,
  ctaText = 'Book Your First Lesson',
  className = '',
  variant = 'default',
  showPricing = true,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: TeachingInquiryData) => {
    try {
      // In a real implementation, this would send the data to your backend
      console.log('Teaching inquiry submitted:', data)

      // For now, we'll just log the data and close the form
      // You can integrate with your preferred form handling service here
      // (e.g., Formspree, Netlify Forms, your own API, etc.)

      alert(
        "Thank you for your inquiry! I'll get back to you within 24 hours to discuss your lessons."
      )
    } catch (error) {
      console.error('Error submitting teaching inquiry:', error)
      throw error // Re-throw to let the form handle the error display
    }
  }

  /**
   * Render the CTA based on variant
   */
  const renderCTA = () => {
    const baseClasses =
      'group transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20'

    switch (variant) {
      case 'compact':
        return (
          <button
            onClick={() => setIsFormOpen(true)}
            className={`${baseClasses} inline-flex items-center px-6 py-3 bg-brand-orange-warm text-white font-semibold rounded-lg hover:bg-brand-orange-warm/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${className}`}
            aria-label="Open teaching inquiry form"
          >
            {ctaText}
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
        )

      case 'prominent':
        return (
          <div
            className={`bg-brand-orange-warm/10 rounded-2xl p-8 border border-brand-orange-warm/20 ${className}`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-neutral-charcoal mb-2">
                Ready to Start Learning?
              </h3>
              {showPricing && (
                <div className="text-brand-orange-warm">
                  <span className="text-3xl font-bold">$50</span>
                  <span className="text-lg font-medium">/lesson</span>
                </div>
              )}
              <p className="text-gray-600 mt-2">
                Personalized guitar instruction tailored to your goals
              </p>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className={`${baseClasses} w-full bg-brand-orange-warm text-white font-heading font-bold text-lg py-4 rounded-xl hover:bg-brand-orange-warm/90 shadow-xl hover:shadow-2xl transform hover:-translate-y-1`}
              aria-label="Open teaching inquiry form"
            >
              {ctaText}
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
            {showPricing && (
              <div className="mb-4">
                <div className="text-brand-orange-warm text-center">
                  <span className="text-2xl font-bold">$50</span>
                  <span className="text-lg font-medium">/lesson</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Professional guitar instruction
                </p>
              </div>
            )}

            <button
              onClick={() => setIsFormOpen(true)}
              className={`${baseClasses} inline-flex items-center px-10 py-4 bg-brand-orange-warm text-white font-bold text-lg rounded-full hover:bg-brand-orange-warm/90 shadow-xl hover:shadow-2xl transform hover:-translate-y-1`}
              aria-label="Open teaching inquiry form"
            >
              {ctaText}
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
    }
  }

  return (
    <>
      {renderCTA()}

      <TeachingInquiryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialPackageType={initialPackageType}
      />
    </>
  )
}

export default TeachingInquiryCTA
