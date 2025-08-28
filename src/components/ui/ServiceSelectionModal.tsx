/**
 * Service Selection Modal Component
 *
 * Modal component that helps users choose the appropriate service inquiry form
 * when they access contact from a general context (e.g., direct contact page access).
 *
 * Features:
 * - Clear service differentiation with descriptions
 * - Visual service icons and branding
 * - Quick selection with immediate form opening
 * - Mobile-responsive design
 * - Accessibility support
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ServiceType } from '@/utils/contactRouting'
import { PerformanceInquiryForm } from '@/components/forms/PerformanceInquiryForm'
import { CollaborationInquiryForm } from '@/components/forms/CollaborationInquiryForm'
import { TeachingInquiryForm } from '@/components/forms/TeachingInquiryForm'
import type { InquiryFormData, FormSubmissionHandler } from '@/types/forms'

/**
 * Service option configuration
 */
interface ServiceOption {
  type: ServiceType
  title: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
}

/**
 * Props for the Service Selection Modal
 */
interface ServiceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceSelect?: (serviceType: ServiceType) => void
}

/**
 * Service Selection Modal Component
 */
export const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  isOpen,
  onClose,
  onServiceSelect,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  )
  const [showServiceForm, setShowServiceForm] = useState(false)

  /**
   * Service options configuration
   */
  const serviceOptions: ServiceOption[] = [
    {
      type: 'performance',
      title: 'Performance Booking',
      description:
        'Book live guitar performances for venues, events, and special occasions',
      color: 'brand-orange-warm',
      features: [
        'Band & Solo performances',
        'Event entertainment',
        'Custom setlists',
        'Professional setup',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      type: 'collaboration',
      title: 'Creative Collaboration',
      description:
        'Partner on creative projects, recordings, and artistic endeavors',
      color: 'brand-blue-primary',
      features: [
        'Studio recordings',
        'Creative projects',
        'Long-term partnerships',
        'Portfolio sharing',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      type: 'teaching',
      title: 'Guitar Lessons',
      description:
        'Learn guitar with personalized instruction and flexible packages',
      color: 'brand-orange-warm',
      features: [
        '$50/lesson pricing',
        'Package discounts',
        'In-person & online',
        'All skill levels',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ]

  /**
   * Handle service selection
   */
  const handleServiceSelect = (serviceType: ServiceType) => {
    setSelectedService(serviceType)
    setShowServiceForm(true)
    onServiceSelect?.(serviceType)
  }

  /**
   * Handle form closure
   */
  const handleFormClose = () => {
    setShowServiceForm(false)
    setSelectedService(null)
    onClose()
  }

  /**
   * Mock form submission handler
   */
  const handleFormSubmit: FormSubmissionHandler = async (
    data: InquiryFormData
  ) => {
    console.log('Service form submitted:', { service: selectedService, data })
    // In a real implementation, this would handle the form submission
    alert("Thank you for your inquiry! I'll get back to you within 24 hours.")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Service Selection Modal */}
      <AnimatePresence>
        {!showServiceForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-charcoal">
                      How can I help you?
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Choose the service you're interested in to get started
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    aria-label="Close service selection"
                  >
                    <svg
                      className="w-6 h-6 text-gray-500"
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
                </div>

                {/* Service Options */}
                <div className="grid md:grid-cols-3 gap-6">
                  {serviceOptions.map((service, index) => (
                    <motion.button
                      key={service.type}
                      onClick={() => handleServiceSelect(service.type)}
                      className={`text-left p-6 rounded-2xl border-2 border-gray-200 hover:border-${service.color} 
                        transition-all duration-300 group hover:shadow-lg hover:shadow-${service.color}/10`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Service Icon */}
                      <div
                        className={`w-16 h-16 bg-${service.color} text-white rounded-2xl flex items-center 
                        justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {service.icon}
                      </div>

                      {/* Service Title */}
                      <h3
                        className="text-xl font-bold text-neutral-charcoal mb-2 group-hover:text-${service.color} 
                        transition-colors duration-300"
                      >
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Service Features */}
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-gray-700"
                          >
                            <svg
                              className={`w-4 h-4 text-${service.color} mr-2 flex-shrink-0`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Call to Action */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div
                          className="flex items-center text-sm font-medium text-gray-800 group-hover:text-${service.color} 
                          transition-colors duration-300"
                        >
                          Get Started
                          <svg
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Not sure which option fits your needs? Feel free to{' '}
                    <button
                      onClick={() => handleServiceSelect('performance')} // Default to performance for general inquiries
                      className="text-brand-blue-primary hover:text-brand-blue-secondary font-medium underline"
                    >
                      send a general inquiry
                    </button>{' '}
                    and I'll help you find the right service.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service-Specific Forms */}
      {selectedService === 'performance' && (
        <PerformanceInquiryForm
          isOpen={showServiceForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialPerformanceType="band"
        />
      )}

      {selectedService === 'collaboration' && (
        <CollaborationInquiryForm
          isOpen={showServiceForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialProjectType="creative"
        />
      )}

      {selectedService === 'teaching' && (
        <TeachingInquiryForm
          isOpen={showServiceForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialPackageType="single"
        />
      )}
    </>
  )
}

export default ServiceSelectionModal
