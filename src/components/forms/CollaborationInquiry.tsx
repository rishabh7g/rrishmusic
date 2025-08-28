/**
 * Enhanced Collaboration Inquiry Component with Project Scope Assessment
 * Advanced inquiry-based pricing system for collaboration projects with consultation booking
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useInquiryPricing,
  CollaborationPricingData,
} from '@/hooks/useInquiryPricing'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export interface CollaborationInquiryData {
  // Contact Information
  name: string
  email: string
  phone?: string

  // Project Details
  projectType: 'studio' | 'creative' | 'partnership' | 'other'
  projectTitle?: string
  creativeVision: string

  // Timeline and Scope
  timeline: 'urgent' | 'flexible' | 'specific-date' | 'ongoing'
  timelineDetails?: string
  projectScope: 'single-session' | 'short-term' | 'long-term' | 'ongoing'

  // Budget and Pricing
  budgetRange:
    | 'under-500'
    | '500-1000'
    | '1000-2500'
    | '2500-5000'
    | '5000-plus'
    | 'discuss'
  budgetNotes?: string

  // Additional Information
  experience: 'first-time' | 'some-experience' | 'experienced' | 'professional'
  additionalInfo?: string
  portfolioFiles?: FileList

  // Communication Preferences
  preferredContact: 'email' | 'phone' | 'either'
  bestTimeToContact?: string
}

interface CollaborationInquiryProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: CollaborationInquiryData) => void
  showPricing?: boolean
  enableConsultationBooking?: boolean
}

/**
 * Enhanced Collaboration Inquiry Component
 */
export const CollaborationInquiry: React.FC<CollaborationInquiryProps> = ({
  isOpen,
  onClose,
  onSubmit,
  showPricing = true,
  enableConsultationBooking = true,
}) => {
  // Form state
  const [formData, setFormData] = useState<CollaborationInquiryData>({
    name: '',
    email: '',
    phone: '',
    projectType: 'creative',
    projectTitle: '',
    creativeVision: '',
    timeline: 'flexible',
    timelineDetails: '',
    projectScope: 'short-term',
    budgetRange: 'discuss',
    budgetNotes: '',
    experience: 'some-experience',
    additionalInfo: '',
    preferredContact: 'email',
    bestTimeToContact: '',
  })

  // Pricing state
  const {
    state: pricingState,
    actions: pricingActions,
    computed,
  } = useInquiryPricing({
    serviceType: 'collaboration',
    enableConsultationBooking,
  })

  // Form validation and UI state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visionWordCount, setVisionWordCount] = useState(0)

  /**
   * Handle form field changes
   */
  const handleFieldChange = useCallback(
    (field: keyof CollaborationInquiryData, value: string | boolean) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))

      // Update word count for creative vision
      if (field === 'creativeVision' && typeof value === 'string') {
        const wordCount = value
          .trim()
          .split(/\s+/)
          .filter(word => word.length > 0).length
        setVisionWordCount(wordCount)
      }

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
    (): CollaborationPricingData => ({
      projectType: formData.projectType,
      projectScope: formData.projectScope,
      timeline: formData.timeline,
      experience: formData.experience,
      creativeVision: formData.creativeVision,
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
      formData.projectType &&
      formData.projectScope &&
      formData.creativeVision.length > 20
    if (hasRequiredData && currentStep >= 2) {
      const pricingData = getPricingData()
      pricingActions.estimateCollaborationPrice(pricingData)
    }
  }, [
    formData.projectType,
    formData.projectScope,
    formData.timeline,
    formData.experience,
    formData.creativeVision,
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
        if (!formData.projectType)
          newErrors.projectType = 'Project type is required'
        if (!formData.creativeVision.trim())
          newErrors.creativeVision = 'Creative vision is required'
        else if (formData.creativeVision.trim().length < 20) {
          newErrors.creativeVision =
            'Please provide more detail about your vision (minimum 20 characters)'
        }
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
        await new Promise(resolve => setTimeout(resolve, 1200))

        if (onSubmit) {
          onSubmit(formData)
        }

        // Schedule follow-up based on project urgency and complexity
        const isComplex =
          computed.isConsultationRecommended ||
          formData.timeline === 'urgent' ||
          formData.projectScope === 'long-term'

        pricingActions.scheduleFollowUp(isComplex ? 1 : 3) // 1-3 days based on complexity

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
    const duration =
      formData.projectScope === 'ongoing' ||
      formData.creativeVision.length > 200
        ? 60
        : 45

    pricingActions.scheduleConsultation({
      serviceType: 'collaboration',
      preferredDates: [new Date().toISOString().split('T')[0]],
      preferredTime: 'flexible',
      duration,
      consultationType:
        formData.preferredContact === 'phone' ? 'phone' : 'video',
      notes: `${formData.projectType} collaboration: ${formData.projectTitle || 'Creative project'}`,
    })
  }, [formData, pricingActions])

  /**
   * Get project complexity indicator
   */
  const getComplexityIndicator = useCallback(() => {
    const vision = formData.creativeVision.toLowerCase()
    const complexKeywords = [
      'complex',
      'advanced',
      'professional',
      'sophisticated',
      'intricate',
    ]
    const expertKeywords = [
      'experimental',
      'innovative',
      'cutting-edge',
      'masterclass',
      'expert',
    ]

    if (expertKeywords.some(keyword => vision.includes(keyword)))
      return 'expert'
    if (complexKeywords.some(keyword => vision.includes(keyword)))
      return 'complex'
    if (vision.length > 200) return 'moderate'
    return 'simple'
  }, [formData.creativeVision])

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
          <div className="bg-gradient-to-r from-purple-600 to-brand-blue-primary text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl lg:text-3xl font-heading font-bold">
                  Collaboration Inquiry
                </h2>
                <p className="text-purple-200 mt-1">
                  Let's bring your creative vision to life
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
              <div className="w-full bg-purple-400 rounded-full h-2">
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors ${
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors ${
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

                    <div className="grid md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Contact Method
                        </label>
                        <select
                          value={formData.preferredContact}
                          onChange={e =>
                            handleFieldChange(
                              'preferredContact',
                              e.target
                                .value as CollaborationInquiryData['preferredContact']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="either">Either</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Vision */}
                {currentStep === 2 && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Project Vision
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Type *
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={e =>
                            handleFieldChange(
                              'projectType',
                              e.target
                                .value as CollaborationInquiryData['projectType']
                            )
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors ${
                            errors.projectType
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="studio">Studio Session</option>
                          <option value="creative">
                            Creative Consultation
                          </option>
                          <option value="partnership">
                            Long-term Partnership
                          </option>
                          <option value="other">Other Collaboration</option>
                        </select>
                        {errors.projectType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.projectType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Title (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.projectTitle}
                          onChange={e =>
                            handleFieldChange('projectTitle', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                          placeholder="Give your project a name"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Creative Vision *
                        </label>
                        <span className="text-xs text-gray-500">
                          {visionWordCount} words • Complexity:{' '}
                          {getComplexityIndicator()}
                        </span>
                      </div>
                      <textarea
                        value={formData.creativeVision}
                        onChange={e =>
                          handleFieldChange('creativeVision', e.target.value)
                        }
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors resize-none ${
                          errors.creativeVision
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Describe your creative vision, project goals, and what you hope to achieve through this collaboration. The more detail you provide, the better we can understand and estimate your project needs..."
                      />
                      {errors.creativeVision && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.creativeVision}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Tip: Include details about style, scope, timeline, and
                        any specific requirements
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Experience Level
                        </label>
                        <select
                          value={formData.experience}
                          onChange={e =>
                            handleFieldChange(
                              'experience',
                              e.target
                                .value as CollaborationInquiryData['experience']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        >
                          <option value="first-time">
                            First-time collaborator
                          </option>
                          <option value="some-experience">
                            Some experience
                          </option>
                          <option value="experienced">Experienced</option>
                          <option value="professional">Professional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Scope
                        </label>
                        <select
                          value={formData.projectScope}
                          onChange={e =>
                            handleFieldChange(
                              'projectScope',
                              e.target
                                .value as CollaborationInquiryData['projectScope']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        >
                          <option value="single-session">Single Session</option>
                          <option value="short-term">Short-term Project</option>
                          <option value="long-term">Long-term Project</option>
                          <option value="ongoing">Ongoing Collaboration</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Project Assessment & Pricing */}
                {currentStep === 3 && showPricing && (
                  <motion.div variants={fadeInUp} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Project Assessment
                    </h3>

                    {pricingState.isEstimating ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Analyzing project scope and complexity...
                        </p>
                      </div>
                    ) : computed.hasEstimate && computed.formattedEstimate ? (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              Project Investment Estimate
                            </h4>
                            <p className="text-purple-700 text-sm">
                              {computed.formattedEstimate.confidence} •{' '}
                              {computed.formattedEstimate.summary}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">
                              {computed.formattedEstimate.range}
                            </div>
                            <p className="text-sm text-gray-600">
                              Project estimate
                            </p>
                          </div>
                        </div>

                        {pricingState.currentEstimate?.factors && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                              Assessment based on:
                            </h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {pricingState.currentEstimate.factors.map(
                                (factor, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="text-purple-500 mr-2">
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
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  Creative Consultation Recommended
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Your project has unique requirements. Let's
                                  discuss your vision in detail.
                                </p>
                              </div>
                              {computed.canBook && (
                                <button
                                  type="button"
                                  onClick={handleBookConsultation}
                                  className="bg-gradient-to-r from-purple-600 to-brand-blue-primary text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                                >
                                  Book Consultation
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600">
                          Complete project details to see scope assessment
                        </p>
                      </div>
                    )}

                    {/* Timeline and Budget */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline Preference
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={e =>
                            handleFieldChange(
                              'timeline',
                              e.target
                                .value as CollaborationInquiryData['timeline']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        >
                          <option value="urgent">
                            Rush Project (1-2 weeks)
                          </option>
                          <option value="specific-date">
                            Specific Deadline
                          </option>
                          <option value="flexible">Flexible Timeline</option>
                          <option value="ongoing">Ongoing Project</option>
                        </select>
                      </div>

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
                                .value as CollaborationInquiryData['budgetRange']
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        >
                          <option value="under-500">Under $500</option>
                          <option value="500-1000">$500 - $1,000</option>
                          <option value="1000-2500">$1,000 - $2,500</option>
                          <option value="2500-5000">$2,500 - $5,000</option>
                          <option value="5000-plus">$5,000+</option>
                          <option value="discuss">Let's discuss</option>
                        </select>
                      </div>
                    </div>

                    {formData.timeline === 'specific-date' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline Details
                        </label>
                        <input
                          type="text"
                          value={formData.timelineDetails}
                          onChange={e =>
                            handleFieldChange('timelineDetails', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                          placeholder="When do you need this completed?"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Additional Information */}
                {currentStep === 4 && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Final Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Notes (optional)
                      </label>
                      <textarea
                        value={formData.budgetNotes}
                        onChange={e =>
                          handleFieldChange('budgetNotes', e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        placeholder="Any specific budget considerations or constraints?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Information
                      </label>
                      <textarea
                        value={formData.additionalInfo}
                        onChange={e =>
                          handleFieldChange('additionalInfo', e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        placeholder="Anything else you'd like to share about your project, inspirations, or collaboration preferences?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Best Time to Contact
                      </label>
                      <input
                        type="text"
                        value={formData.bestTimeToContact}
                        onChange={e =>
                          handleFieldChange('bestTimeToContact', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                        placeholder="e.g., Weekday mornings, Evening after 6pm, etc."
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
                  className="bg-gradient-to-r from-purple-600 to-brand-blue-primary text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-brand-orange-warm to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Submit Collaboration Request'}
                </button>
              )}
            </div>
          </div>

          {/* Consultation Booking Confirmation */}
          {pricingState.consultationBooking && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Consultation Scheduled!
                </h3>
                <p className="text-gray-600 mb-4">
                  We've scheduled your creative consultation. You'll receive a
                  confirmation with next steps shortly.
                </p>
                <button
                  onClick={() => pricingActions.clearEstimate()}
                  className="bg-gradient-to-r from-purple-600 to-brand-blue-primary text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors w-full"
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

export default CollaborationInquiry
