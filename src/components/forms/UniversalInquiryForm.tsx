/**
 * Universal Inquiry Form
 *
 * Single unified form for all inquiries - lessons, performances, collaboration, studio work, etc.
 * Simple and flexible with just basic contact info and open text area for any inquiry.
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface UniversalInquiryData {
  name: string
  email: string
  mobile: string
  inquiry: string
}

interface UniversalInquiryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UniversalInquiryData) => void
  className?: string
}

export const UniversalInquiryForm: React.FC<UniversalInquiryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<UniversalInquiryData>({
    name: '',
    email: '',
    mobile: '',
    inquiry: '',
  })

  const [errors, setErrors] = useState<Partial<UniversalInquiryData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<UniversalInquiryData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    }

    if (!formData.inquiry.trim()) {
      newErrors.inquiry = 'Please tell us about your inquiry'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)

      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        inquiry: '',
      })
      setErrors({})

      // Close form after successful submission
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    field: keyof UniversalInquiryData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-theme-bg rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-theme-colors ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-theme-border transition-theme-colors">
              <h2 className="text-2xl font-bold text-theme-text transition-theme-colors">
                Get In Touch
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-theme-bg-secondary rounded-lg transition-theme-colors"
                aria-label="Close form"
              >
                <svg
                  className="w-6 h-6 text-theme-text-muted"
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-theme-text mb-2 transition-theme-colors"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-theme-bg text-theme-text placeholder-theme-text-muted transition-theme-colors focus:ring-2 focus:ring-theme-primary focus:border-transparent ${
                    errors.name ? 'border-theme-error' : 'border-theme-border'
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-theme-error transition-theme-colors">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-theme-text mb-2 transition-theme-colors"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-theme-bg text-theme-text placeholder-theme-text-muted transition-theme-colors focus:ring-2 focus:ring-theme-primary focus:border-transparent ${
                    errors.email ? 'border-theme-error' : 'border-theme-border'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-theme-error transition-theme-colors">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-theme-text mb-2 transition-theme-colors"
                >
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={e => handleInputChange('mobile', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-theme-bg text-theme-text placeholder-theme-text-muted transition-theme-colors focus:ring-2 focus:ring-theme-primary focus:border-transparent ${
                    errors.mobile ? 'border-theme-error' : 'border-theme-border'
                  }`}
                  placeholder="Your mobile number"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-theme-error transition-theme-colors">
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Inquiry */}
              <div>
                <label
                  htmlFor="inquiry"
                  className="block text-sm font-medium text-theme-text mb-2 transition-theme-colors"
                >
                  Inquiry *
                </label>
                <textarea
                  id="inquiry"
                  value={formData.inquiry}
                  onChange={e => handleInputChange('inquiry', e.target.value)}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-md bg-theme-bg text-theme-text placeholder-theme-text-muted transition-theme-colors focus:ring-2 focus:ring-theme-primary focus:border-transparent resize-vertical ${
                    errors.inquiry
                      ? 'border-theme-error'
                      : 'border-theme-border'
                  }`}
                  placeholder="Tell us about your inquiry - whether it's music lessons, live performance bookings, studio collaboration, recording sessions, or any other musical project..."
                />
                {errors.inquiry && (
                  <p className="mt-1 text-sm text-theme-error transition-theme-colors">
                    {errors.inquiry}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-theme-border text-theme-text rounded-md hover:bg-theme-bg-secondary transition-theme-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-theme-primary text-white rounded-md hover:bg-theme-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>

              {/* Success message */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2"
                >
                  <p className="text-theme-success font-medium transition-theme-colors">
                    Sending your inquiry...
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default UniversalInquiryForm
