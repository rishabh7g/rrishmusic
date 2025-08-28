/**
 * Collaboration Inquiry Form Component
 *
 * Specialized form component for handling collaboration project inquiries
 * with fields relevant to creative partnerships and artistic collaboration.
 *
 * Features:
 * - Project type and creative vision fields
 * - Timeline and scope discussion options
 * - Budget/pricing inquiry handling
 * - Portfolio upload capability (optional)
 * - Form validation and error handling
 * - Mobile-responsive design
 * - Integration with collaboration services
 */

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Collaboration Inquiry Form Data Structure
 */
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

/**
 * Form Props Interface
 */
export interface CollaborationInquiryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CollaborationInquiryData) => Promise<void>
  initialProjectType?: CollaborationInquiryData['projectType']
}

/**
 * Initial Form Data
 */
const initialFormData: CollaborationInquiryData = {
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
}

/**
 * Collaboration Inquiry Form Component
 */
export const CollaborationInquiryForm: React.FC<
  CollaborationInquiryFormProps
> = ({ isOpen, onClose, onSubmit, initialProjectType }) => {
  const [formData, setFormData] = useState<CollaborationInquiryData>({
    ...initialFormData,
    projectType: initialProjectType || initialFormData.projectType,
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof CollaborationInquiryData, string>>
  >({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  /**
   * Update form field and clear related errors
   */
  const updateField = <K extends keyof CollaborationInquiryData>(
    field: K,
    value: CollaborationInquiryData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  /**
   * Handle file upload
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)

      // Validate file types (images, audio, video, PDFs)
      const allowedTypes = [
        'image/',
        'audio/',
        'video/',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]

      const validFiles = fileArray.filter(file =>
        allowedTypes.some(type => file.type.startsWith(type))
      )

      // Validate file sizes (max 10MB per file)
      const maxSize = 10 * 1024 * 1024 // 10MB
      const sizeValidFiles = validFiles.filter(file => file.size <= maxSize)

      if (sizeValidFiles.length !== fileArray.length) {
        setErrors(prev => ({
          ...prev,
          portfolioFiles:
            'Some files were rejected. Please upload only images, audio, video, or document files under 10MB each.',
        }))
      } else if (errors.portfolioFiles) {
        setErrors(prev => ({ ...prev, portfolioFiles: undefined }))
      }

      setSelectedFiles(sizeValidFiles)
      updateField('portfolioFiles', event.target.files)
    }
  }

  /**
   * Remove selected file
   */
  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)

    // Create new FileList-like object
    const dt = new DataTransfer()
    newFiles.forEach(file => dt.items.add(file))

    updateField('portfolioFiles', dt.files)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Validate current step
   */
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CollaborationInquiryData, string>> =
      {}

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }
        break
      case 2:
        if (!formData.creativeVision.trim()) {
          newErrors.creativeVision = 'Please describe your creative vision'
        }
        break
      case 3:
        // Timeline and scope are optional but if specific date is chosen, details might be helpful
        break
      case 4:
        // All fields in step 4 are optional
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle next step
   */
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  /**
   * Handle previous step
   */
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form on successful submission
      setFormData({
        ...initialFormData,
        projectType: initialProjectType || initialFormData.projectType,
      })
      setSelectedFiles([])
      setCurrentStep(1)
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting collaboration inquiry:', error)
      setErrors({ email: 'Failed to submit inquiry. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle form close
   */
  const handleClose = () => {
    setFormData({
      ...initialFormData,
      projectType: initialProjectType || initialFormData.projectType,
    })
    setSelectedFiles([])
    setCurrentStep(1)
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-charcoal">
                  Collaboration Inquiry
                </h2>
                <p className="text-gray-600 mt-1">
                  Let's explore working together on your creative project
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                      index + 1 <= currentStep
                        ? 'bg-brand-blue-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">
                      Contact Information
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Let's start with your basic contact information.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => updateField('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200 ${
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

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">
                      Project Details
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tell us about your creative project and what you envision.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={e =>
                        updateField(
                          'projectType',
                          e.target
                            .value as CollaborationInquiryData['projectType']
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                    >
                      <option value="studio">Studio Recording</option>
                      <option value="creative">Creative Project</option>
                      <option value="partnership">Long-term Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Project Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={e =>
                        updateField('projectTitle', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                      placeholder="What's your project called?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Creative Vision <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.creativeVision}
                      onChange={e =>
                        updateField('creativeVision', e.target.value)
                      }
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200 resize-none ${
                        errors.creativeVision
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Describe your creative vision, the style you're going for, your goals for this collaboration..."
                    />
                    {errors.creativeVision && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.creativeVision}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Timeline and Scope */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">
                      Timeline & Scope
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Help us understand your timeline and the scope of the
                      collaboration.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-3">
                      Project Timeline
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'urgent', label: 'Urgent (within 2 weeks)' },
                        { value: 'flexible', label: 'Flexible timeline' },
                        { value: 'specific-date', label: 'Specific deadline' },
                        { value: 'ongoing', label: 'Ongoing collaboration' },
                      ].map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="timeline"
                            value={option.value}
                            checked={formData.timeline === option.value}
                            onChange={e =>
                              updateField(
                                'timeline',
                                e.target
                                  .value as CollaborationInquiryData['timeline']
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Timeline Details (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.timelineDetails}
                      onChange={e =>
                        updateField('timelineDetails', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                      placeholder="Specific dates, deadlines, or additional timeline information"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Project Scope
                    </label>
                    <select
                      value={formData.projectScope}
                      onChange={e =>
                        updateField(
                          'projectScope',
                          e.target
                            .value as CollaborationInquiryData['projectScope']
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                    >
                      <option value="single-session">
                        Single session/recording
                      </option>
                      <option value="short-term">
                        Short-term project (1-4 weeks)
                      </option>
                      <option value="long-term">
                        Long-term project (1-6 months)
                      </option>
                      <option value="ongoing">Ongoing collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={e =>
                        updateField(
                          'budgetRange',
                          e.target
                            .value as CollaborationInquiryData['budgetRange']
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                    >
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000-plus">$5,000+</option>
                      <option value="discuss">Prefer to discuss</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Budget Notes (Optional)
                    </label>
                    <textarea
                      value={formData.budgetNotes}
                      onChange={e => updateField('budgetNotes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200 resize-none"
                      placeholder="Any specific budget considerations or notes..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">
                      Additional Information
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Help us better understand your experience and
                      communication preferences.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Your Experience Level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={e =>
                        updateField(
                          'experience',
                          e.target
                            .value as CollaborationInquiryData['experience']
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                    >
                      <option value="first-time">
                        First-time collaborator
                      </option>
                      <option value="some-experience">
                        Some collaboration experience
                      </option>
                      <option value="experienced">
                        Experienced in collaborations
                      </option>
                      <option value="professional">
                        Professional musician/artist
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={e =>
                        updateField('additionalInfo', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200 resize-none"
                      placeholder="Any additional information, questions, or specific requirements..."
                    />
                  </div>

                  {/* Portfolio Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Portfolio/Reference Files (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload audio samples, images, videos, or documents that
                      help illustrate your project vision. Max 10MB per file.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-blue-primary/50 transition-colors duration-200">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <label
                        htmlFor="portfolio-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload files or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          Images, audio, video, PDFs, or documents
                        </p>
                      </label>
                    </div>

                    {errors.portfolioFiles && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.portfolioFiles}
                      </p>
                    )}

                    {/* Selected Files Display */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-neutral-charcoal mb-2">
                          Selected Files:
                        </p>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center">
                                <svg
                                  className="w-5 h-5 text-gray-400 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-neutral-charcoal">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-500"
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
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'either', label: 'Either' },
                      ].map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={option.value}
                            checked={formData.preferredContact === option.value}
                            onChange={e =>
                              updateField(
                                'preferredContact',
                                e.target
                                  .value as CollaborationInquiryData['preferredContact']
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Best Time to Contact (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.bestTimeToContact}
                      onChange={e =>
                        updateField('bestTimeToContact', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors duration-200"
                      placeholder="e.g., weekday afternoons, weekends, anytime"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-blue-primary text-white rounded-lg hover:bg-brand-blue-primary/90 transition-colors duration-200"
                  >
                    Next
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-blue-primary text-white rounded-lg hover:bg-brand-blue-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
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
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CollaborationInquiryForm
