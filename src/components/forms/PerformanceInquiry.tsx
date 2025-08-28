/**
 * Enhanced Performance Inquiry Component with Inquiry-Based Pricing
 * Builds on existing PerformanceInquiryForm with dynamic pricing estimation and consultation booking
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useInquiryPricing,
  PerformancePricingData,
} from '@/hooks/useInquiryPricing'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export interface PerformanceInquiryData {
  // Contact Information
  name: string
  email: string
  phone?: string

  // Event Details
  eventType: 'wedding' | 'corporate' | 'venue' | 'private' | 'other'
  eventDate?: string
  eventTime?: string
  venueName?: string
  venueAddress?: string

  // Performance Requirements
  performanceFormat: 'solo' | 'band' | 'flexible' | 'unsure'
  performanceStyle: 'acoustic' | 'electric' | 'both' | 'unsure'
  duration: string
  guestCount?: string
  budgetRange: 'under-500' | '500-1000' | '1000-2000' | '2000-plus' | 'discuss'

  // Additional Information
  specialRequests?: string
  musicPreferences?: string
  hasVenueRestrictions: boolean
  venueRestrictions?: string

  // Marketing
  hearAboutUs?: 'google' | 'instagram' | 'referral' | 'venue' | 'other'
  hearAboutUsDetail?: string
}

interface PerformanceInquiryProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: PerformanceInquiryData) => void
  showPricing?: boolean
  enableConsultationBooking?: boolean
}

/**
 * Enhanced Performance Inquiry Component
 */
export const PerformanceInquiry: React.FC<PerformanceInquiryProps> = ({
  isOpen,
  onClose,
  onSubmit,
  showPricing = true,
  enableConsultationBooking = true,
}) => {
  // Form state
  const [formData, setFormData] = useState<PerformanceInquiryData>({
    name: '',
    email: '',
    phone: '',
    eventType: 'private',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueAddress: '',
    performanceFormat: 'solo',
    performanceStyle: 'acoustic',
    duration: '1-2 hours',
    guestCount: '',
    budgetRange: 'discuss',
    specialRequests: '',
    musicPreferences: '',
    hasVenueRestrictions: false,
    venueRestrictions: '',
    hearAboutUs: 'google',
  })

  // Pricing state
  const {
    state: pricingState,
    actions: pricingActions,
    computed,
  } = useInquiryPricing({
    serviceType: 'performance',
    enableConsultationBooking,
  })

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Handle form field changes
   */
  const handleFieldChange = useCallback(
    (field: keyof PerformanceInquiryData, value: string | boolean) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))

      // Clear field error
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: '',
        }))
      }
    },
    [errors]
  )

  /**
   * Get pricing data from form
   */
  const getPricingData = useCallback(
    (): PerformancePricingData => ({
      performanceFormat: formData.performanceFormat,
      performanceStyle: formData.performanceStyle,
      eventType: formData.eventType,
      duration: formData.duration,
      guestCount: formData.guestCount,
      eventDate: formData.eventDate,
      venueAddress: formData.venueAddress,
      budgetRange: formData.budgetRange,
    }),
    [formData]
  )

  /**
   * Update pricing estimate when relevant fields change
   */
  useEffect(() => {
    if (!showPricing) return

    const hasRequiredData =
      formData.eventType && formData.duration && formData.performanceFormat
    if (hasRequiredData && currentStep >= 2) {
      const pricingData = getPricingData()
      pricingActions.estimatePerformancePrice(pricingData)
    }
  }, [
    formData.eventType,
    formData.duration,
    formData.performanceFormat,
    formData.performanceStyle,
    formData.guestCount,
    formData.eventDate,
    formData.budgetRange,
    currentStep,
    showPricing,
    getPricingData,
    pricingActions,
  ])

  /**
   * Validate current step
   */
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {}

      if (step === 1) {
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email'
        }
      }

      if (step === 2) {
        if (!formData.eventType) newErrors.eventType = 'Event type is required'
        if (!formData.duration) newErrors.duration = 'Duration is required'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [formData]
  )

  /**
   * Handle step navigation
   */
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }, [currentStep, validateStep])

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateStep(4)) return

      setIsSubmitting(true)

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (onSubmit) {
          onSubmit(formData)
        }

        // Schedule follow-up based on urgency
        if (computed.isConsultationRecommended) {
          pricingActions.scheduleFollowUp(2) // 2 days for high-priority
        } else {
          pricingActions.scheduleFollowUp(5) // 5 days for standard
        }

        onClose()
      } catch (error) {
        console.error('Form submission failed:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      formData,
      validateStep,
      onSubmit,
      computed.isConsultationRecommended,
      pricingActions,
      onClose,
    ]
  )

  /**
   * Handle consultation booking
   */
  const handleBookConsultation = useCallback(() => {
    pricingActions.scheduleConsultation({
      serviceType: 'performance',
      preferredDates: [
        formData.eventDate || new Date().toISOString().split('T')[0],
      ],
      preferredTime: 'flexible',
      duration: 30,
      consultationType: 'phone',
      notes: `Performance inquiry for ${formData.eventType} event`,
    })
  }, [formData, pricingActions])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-brand-blue-primary text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl lg:text-3xl font-heading font-bold">
                  Performance Inquiry
                </h2>
                <p className="text-brand-blue-secondary mt-1">
                  Let's discuss your perfect musical experience
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step {currentStep} of 4</span>
                <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-brand-blue-secondary rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Step 1: Contact Information */}
                {currentStep === 1 && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Contact Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e =>
                            handleFieldChange('name', e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e =>
                            handleFieldChange('email', e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e =>
                          handleFieldChange('phone', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Event Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Type *
                        </label>
                        <select
                          value={formData.eventType}
                          onChange={e =>
                            handleFieldChange(
                              'eventType',
                              e.target
                                .value as PerformanceInquiryData['eventType']
                            )
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                            errors.eventType
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="wedding">Wedding</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="venue">Venue Performance</option>
                          <option value="private">Private Party</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.eventType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.eventType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={e =>
                            handleFieldChange('eventDate', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Performance Format
                        </label>
                        <select
                          value={formData.performanceFormat}
                          onChange={e =>
                            handleFieldChange(
                              'performanceFormat',
                              e.target
                                .value as PerformanceInquiryData['performanceFormat']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        >
                          <option value="solo">Solo Performance</option>
                          <option value="band">Full Band</option>
                          <option value="flexible">Flexible</option>
                          <option value="unsure">Not Sure</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Performance Style
                        </label>
                        <select
                          value={formData.performanceStyle}
                          onChange={e =>
                            handleFieldChange(
                              'performanceStyle',
                              e.target
                                .value as PerformanceInquiryData['performanceStyle']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        >
                          <option value="acoustic">Acoustic</option>
                          <option value="electric">Electric</option>
                          <option value="both">Both Available</option>
                          <option value="unsure">Not Sure</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <select
                          value={formData.duration}
                          onChange={e =>
                            handleFieldChange('duration', e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                            errors.duration
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="1-2 hours">1-2 hours</option>
                          <option value="3-4 hours">3-4 hours</option>
                          <option value="5-6 hours">5-6 hours</option>
                          <option value="full day">Full day</option>
                          <option value="multi-day">Multi-day event</option>
                        </select>
                        {errors.duration && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.duration}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Guest Count (approximate)
                        </label>
                        <input
                          type="text"
                          value={formData.guestCount}
                          onChange={e =>
                            handleFieldChange('guestCount', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                          placeholder="e.g., 50-100 guests"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Pricing Estimate */}
                {currentStep === 3 && showPricing && (
                  <motion.div variants={fadeInUp} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Pricing Estimate
                    </h3>

                    {pricingState.isEstimating ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-primary mx-auto mb-4" />
                        <p className="text-gray-600">
                          Calculating personalized estimate...
                        </p>
                      </div>
                    ) : computed.hasEstimate && computed.formattedEstimate ? (
                      <div className="bg-blue-50 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              Estimated Investment
                            </h4>
                            <p className="text-blue-700 text-sm">
                              {computed.formattedEstimate.confidence} •{' '}
                              {computed.formattedEstimate.summary}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-brand-blue-primary">
                              {computed.formattedEstimate.range}
                            </div>
                          </div>
                        </div>

                        {pricingState.currentEstimate?.factors && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                              Pricing based on:
                            </h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {pricingState.currentEstimate.factors.map(
                                (factor, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="text-blue-500 mr-2">
                                      •
                                    </span>
                                    {factor}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {computed.isConsultationRecommended && (
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  Free Consultation Recommended
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Let's discuss your specific needs for accurate
                                  pricing
                                </p>
                              </div>
                              {computed.canBook && (
                                <button
                                  type="button"
                                  onClick={handleBookConsultation}
                                  className="bg-brand-blue-primary text-white px-4 py-2 rounded-lg hover:bg-brand-blue-secondary transition-colors"
                                >
                                  Book Call
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600">
                          Complete event details to see pricing estimate
                        </p>
                      </div>
                    )}

                    {/* Budget Range Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={e =>
                          handleFieldChange(
                            'budgetRange',
                            e.target
                              .value as PerformanceInquiryData['budgetRange']
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                      >
                        <option value="under-500">Under $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2000">$1,000 - $2,000</option>
                        <option value="2000-plus">$2,000+</option>
                        <option value="discuss">Let's discuss</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Additional Details */}
                {currentStep === 4 && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Additional Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        value={formData.venueName}
                        onChange={e =>
                          handleFieldChange('venueName', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        placeholder="Event venue name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Music Preferences
                      </label>
                      <textarea
                        value={formData.musicPreferences}
                        onChange={e =>
                          handleFieldChange('musicPreferences', e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        placeholder="Any specific songs, genres, or musical styles you'd like?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={e =>
                          handleFieldChange('specialRequests', e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        placeholder="Any special requests or additional information?"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-brand-blue-primary text-white px-6 py-2 rounded-lg hover:bg-brand-blue-secondary transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="bg-brand-orange-warm text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              )}
            </div>
          </div>

          {/* Consultation Booking Confirmation */}
          {pricingState.consultationBooking && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Consultation Booked!
                </h3>
                <p className="text-gray-600 mb-4">
                  We've scheduled your consultation call. You'll receive a
                  confirmation email shortly.
                </p>
                <button
                  onClick={() => pricingActions.clearEstimate()}
                  className="bg-brand-blue-primary text-white px-4 py-2 rounded-lg hover:bg-brand-blue-secondary transition-colors w-full"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerformanceInquiry
