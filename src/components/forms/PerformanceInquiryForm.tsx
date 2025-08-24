/**
 * Performance Inquiry Form Component
 * 
 * Features:
 * - Comprehensive performance booking form with service-specific fields
 * - Native React form validation with TypeScript
 * - Event type selection (wedding, corporate, venue, private)
 * - Date, venue, budget, and special requirements capture
 * - Mobile-optimized responsive design
 * - Form submission handling with confirmation flow
 * - Analytics tracking for conversion measurement
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';

export interface PerformanceInquiryData {
  // Contact Information
  name: string;
  email: string;
  phone?: string;
  
  // Event Details
  eventType: 'wedding' | 'corporate' | 'venue' | 'private' | 'other';
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  
  // Performance Requirements
  performanceType: 'acoustic' | 'electric' | 'both' | 'unsure';
  duration: string;
  guestCount?: string;
  budgetRange: 'under-500' | '500-1000' | '1000-2000' | '2000-plus' | 'discuss';
  
  // Additional Information
  specialRequests?: string;
  musicPreferences?: string;
  hasVenueRestrictions: boolean;
  venueRestrictions?: string;
  
  // Marketing
  hearAboutUs?: 'google' | 'instagram' | 'referral' | 'venue' | 'other';
  hearAboutUsDetail?: string;
}

interface PerformanceInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PerformanceInquiryData) => void;
  initialEventType?: PerformanceInquiryData['eventType'];
}

const initialFormData: PerformanceInquiryData = {
  name: '',
  email: '',
  phone: '',
  eventType: 'other',
  eventDate: '',
  eventTime: '',
  venueName: '',
  venueAddress: '',
  performanceType: 'unsure',
  duration: '',
  guestCount: '',
  budgetRange: 'discuss',
  specialRequests: '',
  musicPreferences: '',
  hasVenueRestrictions: false,
  venueRestrictions: '',
  hearAboutUs: 'google',
  hearAboutUsDetail: ''
};

/**
 * Performance Inquiry Form Component
 */
export const PerformanceInquiryForm: React.FC<PerformanceInquiryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEventType
}) => {
  const [formData, setFormData] = useState<PerformanceInquiryData>({
    ...initialFormData,
    eventType: initialEventType || initialFormData.eventType
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PerformanceInquiryData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // Reserved for multi-step form in future

  // Handle form field changes
  const handleChange = (field: keyof PerformanceInquiryData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PerformanceInquiryData, string>> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.duration.trim()) newErrors.duration = 'Performance duration is required';
    
    if (formData.hasVenueRestrictions && !formData.venueRestrictions?.trim()) {
      newErrors.venueRestrictions = 'Please describe the venue restrictions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission - in production this would send to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Track analytics (placeholder)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'Performance Inquiry',
          event_label: formData.eventType,
          value: 1
        });
      }

      onSubmit?.(formData);
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ email: 'There was an error submitting your inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = React.useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitted(false);
      // setCurrentStep(1); // Reserved for multi-step form
      setFormData({ ...initialFormData, eventType: initialEventType || initialFormData.eventType });
      setErrors({});
      onClose();
    }
  }, [isSubmitting, initialEventType, onClose]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSubmitting, handleClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {isSubmitted ? (
              // Success State
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-heading font-bold text-neutral-charcoal mb-4">
                  Inquiry Submitted Successfully!
                </h2>
                
                <p className="text-neutral-charcoal/80 mb-6 leading-relaxed">
                  Thank you for your interest in live music for your {formData.eventType} event. I'll review your details and get back to you within 24 hours with availability and next steps.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-neutral-charcoal mb-2">What happens next:</h3>
                  <ul className="text-sm text-neutral-charcoal/80 space-y-1">
                    <li>• I'll review your event details and requirements</li>
                    <li>• You'll receive a personalized quote within 24 hours</li>
                    <li>• We can schedule a call to discuss your vision</li>
                    <li>• I'll send contract details if you'd like to proceed</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleClose}
                    className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-secondary transition-colors font-medium"
                  >
                    Close
                  </button>
                  <a
                    href="https://instagram.com/rrishmusic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-brand-blue-primary text-brand-blue-primary px-6 py-3 rounded-lg hover:bg-brand-blue-primary hover:text-white transition-colors font-medium"
                  >
                    View More Performances
                  </a>
                </div>
              </div>
            ) : (
              // Form State
              <>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-neutral-charcoal">
                      Performance Inquiry
                    </h2>
                    <p className="text-neutral-charcoal/70 mt-1">
                      Let's discuss your event and musical needs
                    </p>
                  </div>
                  
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                    aria-label="Close inquiry form"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {/* Contact Information */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-charcoal">Contact Information</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Your full name"
                            required
                          />
                          {errors.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="your@email.com"
                            required
                          />
                          {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-charcoal mb-2">
                          Phone Number <span className="text-gray-500">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                          placeholder="+61 4XX XXX XXX"
                        />
                      </div>
                    </motion.div>

                    {/* Event Details */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-charcoal">Event Details</h3>
                      
                      <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-neutral-charcoal mb-2">
                          Event Type *
                        </label>
                        <select
                          id="eventType"
                          value={formData.eventType}
                          onChange={(e) => handleChange('eventType', e.target.value as PerformanceInquiryData['eventType'])}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                          required
                        >
                          <option value="wedding">Wedding</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="venue">Venue Performance</option>
                          <option value="private">Private Party</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="eventDate" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Event Date <span className="text-gray-500">(optional)</span>
                          </label>
                          <input
                            type="date"
                            id="eventDate"
                            value={formData.eventDate}
                            onChange={(e) => handleChange('eventDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div>
                          <label htmlFor="eventTime" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Event Time <span className="text-gray-500">(optional)</span>
                          </label>
                          <input
                            type="time"
                            id="eventTime"
                            value={formData.eventTime}
                            onChange={(e) => handleChange('eventTime', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="venueName" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Venue Name <span className="text-gray-500">(optional)</span>
                          </label>
                          <input
                            type="text"
                            id="venueName"
                            value={formData.venueName}
                            onChange={(e) => handleChange('venueName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                            placeholder="Venue or location name"
                          />
                        </div>

                        <div>
                          <label htmlFor="guestCount" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Guest Count <span className="text-gray-500">(optional)</span>
                          </label>
                          <input
                            type="text"
                            id="guestCount"
                            value={formData.guestCount}
                            onChange={(e) => handleChange('guestCount', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                            placeholder="Approximate number"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Performance Requirements */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-charcoal">Performance Requirements</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="performanceType" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Performance Type
                          </label>
                          <select
                            id="performanceType"
                            value={formData.performanceType}
                            onChange={(e) => handleChange('performanceType', e.target.value as PerformanceInquiryData['performanceType'])}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                          >
                            <option value="acoustic">Acoustic Only</option>
                            <option value="electric">Electric Only</option>
                            <option value="both">Both Acoustic & Electric</option>
                            <option value="unsure">Not Sure Yet</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-neutral-charcoal mb-2">
                            Duration *
                          </label>
                          <input
                            type="text"
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors ${
                              errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 2 hours, 3-4 hours"
                            required
                          />
                          {errors.duration && (
                            <p className="text-red-600 text-sm mt-1">{errors.duration}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="budgetRange" className="block text-sm font-medium text-neutral-charcoal mb-2">
                          Budget Range
                        </label>
                        <select
                          id="budgetRange"
                          value={formData.budgetRange}
                          onChange={(e) => handleChange('budgetRange', e.target.value as PerformanceInquiryData['budgetRange'])}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors"
                        >
                          <option value="under-500">Under $500</option>
                          <option value="500-1000">$500 - $1000</option>
                          <option value="1000-2000">$1000 - $2000</option>
                          <option value="2000-plus">$2000+</option>
                          <option value="discuss">Prefer to Discuss</option>
                        </select>
                      </div>
                    </motion.div>

                    {/* Additional Information */}
                    <motion.div variants={fadeInUp} className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-charcoal">Additional Information</h3>
                      
                      <div>
                        <label htmlFor="musicPreferences" className="block text-sm font-medium text-neutral-charcoal mb-2">
                          Music Preferences <span className="text-gray-500">(optional)</span>
                        </label>
                        <textarea
                          id="musicPreferences"
                          value={formData.musicPreferences}
                          onChange={(e) => handleChange('musicPreferences', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors resize-vertical"
                          placeholder="Any specific songs, genres, or styles you'd like?"
                        />
                      </div>

                      <div>
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.hasVenueRestrictions}
                            onChange={(e) => handleChange('hasVenueRestrictions', e.target.checked)}
                            className="mt-1 rounded border-gray-300 text-brand-blue-primary focus:ring-brand-blue-primary/20"
                          />
                          <div>
                            <span className="text-sm font-medium text-neutral-charcoal">
                              My venue has specific restrictions or requirements
                            </span>
                            <p className="text-xs text-gray-500">
                              Sound limits, setup constraints, etc.
                            </p>
                          </div>
                        </label>
                      </div>

                      {formData.hasVenueRestrictions && (
                        <div>
                          <textarea
                            value={formData.venueRestrictions}
                            onChange={(e) => handleChange('venueRestrictions', e.target.value)}
                            rows={2}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors resize-vertical ${
                              errors.venueRestrictions ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Please describe any venue restrictions..."
                          />
                          {errors.venueRestrictions && (
                            <p className="text-red-600 text-sm mt-1">{errors.venueRestrictions}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-neutral-charcoal mb-2">
                          Special Requests <span className="text-gray-500">(optional)</span>
                        </label>
                        <textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) => handleChange('specialRequests', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue-primary/20 focus:border-brand-blue-primary transition-colors resize-vertical"
                          placeholder="Any other details or special requests..."
                        />
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={fadeInUp} className="pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-orange-warm text-white font-semibold py-4 px-6 rounded-lg hover:bg-brand-orange-warm/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Inquiry</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        I'll respond to your inquiry within 24 hours with availability and pricing.
                      </p>
                    </motion.div>
                  </motion.div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceInquiryForm;