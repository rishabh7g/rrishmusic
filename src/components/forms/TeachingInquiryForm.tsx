/**
 * Teaching Inquiry Form Component
 * 
 * Specialized form component for handling guitar lesson inquiries and bookings.
 * Designed to maintain all existing functionality while integrating with the new
 * context-aware contact system.
 * 
 * Features:
 * - Lesson package selection with $50/lesson pricing prominently displayed
 * - Experience level assessment and goal setting
 * - Schedule preference and availability discussion
 * - Lesson format selection (in-person/online)
 * - Form validation and error handling
 * - Mobile-responsive design
 * - Integration with context-aware contact routing
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Teaching Inquiry Form Data Structure
 */
export interface TeachingInquiryData {
  // Contact Information
  name: string;
  email: string;
  phone?: string;
  
  // Lesson Details
  packageType: 'single' | 'foundation' | 'transformation' | 'trial';
  experienceLevel: 'complete-beginner' | 'some-basics' | 'intermediate' | 'advanced';
  musicalGoals: string;
  
  // Schedule and Format
  lessonFormat: 'in-person' | 'online' | 'flexible';
  preferredSchedule: 'weekday-mornings' | 'weekday-afternoons' | 'weekday-evenings' | 'weekends' | 'flexible';
  scheduleDetails?: string;
  
  // Additional Information
  previousExperience?: string;
  specificInterests?: string;
  additionalInfo?: string;
  
  // Communication Preferences
  preferredContact: 'email' | 'phone' | 'either';
  bestTimeToContact?: string;
}

/**
 * Form Props Interface
 */
export interface TeachingInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeachingInquiryData) => Promise<void>;
  initialPackageType?: TeachingInquiryData['packageType'];
}

/**
 * Initial Form Data
 */
const initialFormData: TeachingInquiryData = {
  name: '',
  email: '',
  phone: '',
  packageType: 'single',
  experienceLevel: 'some-basics',
  musicalGoals: '',
  lessonFormat: 'flexible',
  preferredSchedule: 'flexible',
  scheduleDetails: '',
  previousExperience: '',
  specificInterests: '',
  additionalInfo: '',
  preferredContact: 'email',
  bestTimeToContact: ''
};

/**
 * Package pricing information (prominently featuring $50/lesson)
 */
const packageInfo = {
  single: {
    name: 'Single Lesson',
    price: '$50',
    description: 'Perfect for trying out my teaching style or addressing specific challenges',
    sessions: 1
  },
  foundation: {
    name: 'Foundation Package',
    price: '$190',
    originalPrice: '$200',
    description: 'Build solid foundations with 4 weekly lessons',
    sessions: 4,
    savings: '$10'
  },
  transformation: {
    name: 'Transformation Intensive',
    price: '$360',
    originalPrice: '$400',
    description: 'Comprehensive 8-lesson package for serious improvement',
    sessions: 8,
    savings: '$40'
  },
  trial: {
    name: 'Trial Lesson',
    price: '$45',
    description: 'Shorter 30-minute introduction to my teaching style',
    sessions: 1
  }
};

/**
 * Teaching Inquiry Form Component
 */
export const TeachingInquiryForm: React.FC<TeachingInquiryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPackageType
}) => {
  const [formData, setFormData] = useState<TeachingInquiryData>({
    ...initialFormData,
    packageType: initialPackageType || initialFormData.packageType
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TeachingInquiryData, string>>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Update form field and clear related errors
   */
  const updateField = <K extends keyof TeachingInquiryData>(
    field: K,
    value: TeachingInquiryData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Validate current step
   */
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof TeachingInquiryData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.musicalGoals.trim()) {
          newErrors.musicalGoals = 'Please describe your musical goals';
        }
        break;
      case 3:
        // Schedule preferences are optional but helpful
        break;
      case 4:
        // All fields in step 4 are optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle next step
   */
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  /**
   * Handle previous step
   */
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on successful submission
      setFormData({ ...initialFormData, packageType: initialPackageType || initialFormData.packageType });
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting teaching inquiry:', error);
      setErrors({ email: 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form close
   */
  const handleClose = () => {
    setFormData({ ...initialFormData, packageType: initialPackageType || initialFormData.packageType });
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const selectedPackage = packageInfo[formData.packageType];

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
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-charcoal">
                  Guitar Lesson Inquiry
                </h2>
                <p className="text-gray-600 mt-1">
                  Let's start your musical journey together
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                        ? 'bg-brand-orange-warm text-white' 
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
              {/* Step 1: Contact Information & Package Selection */}
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
                      Contact Information & Package Selection
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Let's start with your contact details and lesson preferences.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Package Selection with Prominent Pricing */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-3">
                      Lesson Package <span className="text-brand-orange-warm font-bold">($50/lesson)</span>
                    </label>
                    <div className="grid gap-4">
                      {(Object.keys(packageInfo) as Array<keyof typeof packageInfo>).map((key) => {
                        const pkg = packageInfo[key];
                        return (
                          <label key={key} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="packageType"
                              value={key}
                              checked={formData.packageType === key}
                              onChange={(e) => updateField('packageType', e.target.value as TeachingInquiryData['packageType'])}
                              className="sr-only"
                            />
                            <div className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                              formData.packageType === key
                                ? 'border-brand-orange-warm bg-brand-orange-warm/10'
                                : 'border-gray-300 hover:border-brand-orange-warm/50'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-neutral-charcoal">
                                    {pkg.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {pkg.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-brand-orange-warm">
                                    {pkg.price}
                                  </div>
                                  {pkg.originalPrice && (
                                    <div className="text-sm text-gray-500 line-through">
                                      {pkg.originalPrice}
                                    </div>
                                  )}
                                  {pkg.savings && (
                                    <div className="text-xs text-green-600 font-medium">
                                      Save {pkg.savings}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    
                    {/* Selected Package Summary */}
                    <div className="mt-4 p-4 bg-brand-orange-warm/10 rounded-lg border border-brand-orange-warm/20">
                      <h4 className="font-semibold text-brand-orange-warm mb-2">
                        Selected: {selectedPackage.name}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {selectedPackage.sessions} session{selectedPackage.sessions > 1 ? 's' : ''} • {selectedPackage.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Musical Background & Goals */}
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
                      Musical Background & Goals
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Help me understand your musical journey and what you'd like to achieve.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => updateField('experienceLevel', e.target.value as TeachingInquiryData['experienceLevel'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200"
                    >
                      <option value="complete-beginner">Complete beginner - never played guitar</option>
                      <option value="some-basics">Some basics - know a few chords</option>
                      <option value="intermediate">Intermediate - can play songs and basic techniques</option>
                      <option value="advanced">Advanced - looking to refine skills</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Musical Goals <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.musicalGoals}
                      onChange={(e) => updateField('musicalGoals', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 resize-none ${
                        errors.musicalGoals ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="What would you like to achieve? (e.g., learn to play your favorite songs, improve improvisation, prepare for performances, etc.)"
                    />
                    {errors.musicalGoals && (
                      <p className="text-red-500 text-sm mt-1">{errors.musicalGoals}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Previous Experience (Optional)
                    </label>
                    <textarea
                      value={formData.previousExperience}
                      onChange={(e) => updateField('previousExperience', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 resize-none"
                      placeholder="Tell me about any previous lessons, instruments you've played, or musical experiences..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Specific Interests (Optional)
                    </label>
                    <textarea
                      value={formData.specificInterests}
                      onChange={(e) => updateField('specificInterests', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 resize-none"
                      placeholder="Any specific styles, songs, techniques, or areas you're particularly interested in?"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule & Format */}
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
                      Schedule & Format Preferences
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Let's find the best time and format for your lessons.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Lesson Format
                    </label>
                    <div className="grid gap-3">
                      {[
                        { value: 'in-person', label: 'In-Person Lessons', description: 'Face-to-face instruction in Melbourne' },
                        { value: 'online', label: 'Online Lessons', description: 'Virtual lessons via video call' },
                        { value: 'flexible', label: 'Flexible', description: 'Willing to try both formats' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="lessonFormat"
                            value={option.value}
                            checked={formData.lessonFormat === option.value}
                            onChange={(e) => updateField('lessonFormat', e.target.value as TeachingInquiryData['lessonFormat'])}
                            className="mr-3"
                          />
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Preferred Schedule
                    </label>
                    <select
                      value={formData.preferredSchedule}
                      onChange={(e) => updateField('preferredSchedule', e.target.value as TeachingInquiryData['preferredSchedule'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200"
                    >
                      <option value="weekday-mornings">Weekday mornings (9 AM - 12 PM)</option>
                      <option value="weekday-afternoons">Weekday afternoons (12 PM - 5 PM)</option>
                      <option value="weekday-evenings">Weekday evenings (5 PM - 8 PM)</option>
                      <option value="weekends">Weekends</option>
                      <option value="flexible">Flexible - discuss options</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Schedule Details (Optional)
                    </label>
                    <textarea
                      value={formData.scheduleDetails}
                      onChange={(e) => updateField('scheduleDetails', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 resize-none"
                      placeholder="Any specific days, times, or scheduling preferences? (e.g., Tuesday evenings, every other week, etc.)"
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
                      Final Details
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Last few details to ensure we're perfectly matched for your learning journey.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => updateField('additionalInfo', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200 resize-none"
                      placeholder="Anything else you'd like me to know? Questions about my teaching style, equipment needed, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-charcoal mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'either', label: 'Either' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={option.value}
                            checked={formData.preferredContact === option.value}
                            onChange={(e) => updateField('preferredContact', e.target.value as TeachingInquiryData['preferredContact'])}
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
                      onChange={(e) => updateField('bestTimeToContact', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange-warm/20 focus:border-brand-orange-warm transition-colors duration-200"
                      placeholder="e.g., weekday afternoons, weekends, anytime"
                    />
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-brand-orange-warm/10 rounded-lg p-6 border border-brand-orange-warm/20">
                    <h4 className="font-semibold text-brand-orange-warm mb-3">
                      Your Selection Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-charcoal font-medium">{selectedPackage.name}</span>
                        <span className="text-brand-orange-warm font-bold">{selectedPackage.price}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedPackage.sessions} session{selectedPackage.sessions > 1 ? 's' : ''} • 
                        {selectedPackage.sessions > 1 ? ' $50 per lesson' : ' 60 minutes'}
                      </div>
                      {selectedPackage.savings && (
                        <div className="text-sm text-green-600 font-medium">
                          You save {selectedPackage.savings} compared to individual lessons!
                        </div>
                      )}
                    </div>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                    className="flex items-center gap-2 px-6 py-2 bg-brand-orange-warm text-white rounded-lg hover:bg-brand-orange-warm/90 transition-colors duration-200"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-orange-warm text-white rounded-lg hover:bg-brand-orange-warm/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
  );
};

export default TeachingInquiryForm;