/**
 * Integrated Booking and Payment System Component
 * Comprehensive booking interface for all services with payment processing
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, CreditCard, User, Mail, MessageSquare, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useBookingSystem } from '@/hooks/useBookingSystem';
import { useInquiryPricing } from '@/hooks/useInquiryPricing';
import { useContextualValidation } from '@/hooks/useContextualValidation';
import { ServiceType } from '@/types';
import { ValidationMessage } from '@/components/forms/ValidationMessage';

export interface BookingSystemProps {
  serviceType: ServiceType;
  prefilledData?: {
    serviceDetails?: Record<string, unknown>;
    customerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  onBookingComplete?: (bookingId: string) => void;
  onBookingCancelled?: () => void;
  className?: string;
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  serviceType,
  prefilledData = {},
  onBookingComplete,
  onBookingCancelled,
  className = ''
}) => {
  // Hooks
  const {
    bookingState,
    updateCustomerInfo,
    updateServiceDetails,
    updateSchedulingPreferences,
    updatePaymentInfo,
    processPayment,
    scheduleAppointment,
    isLoading,
    error
  } = useBookingSystem({
    serviceType,
    initialData: prefilledData,
    onSuccess: (bookingId) => onBookingComplete?.(bookingId),
    onCancel: () => onBookingCancelled?.()
  });

  const {
    estimatePrice,
    priceEstimate,
    isEstimating
  } = useInquiryPricing({
    serviceType,
    enableBookingIntegration: true
  });

  const {
    validateField,
    errors: formErrors
  } = useContextualValidation(
    {
      ...bookingState.customerInfo,
      ...bookingState.serviceDetails,
      ...bookingState.schedulingPreferences
    },
    serviceType
  );

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Steps configuration
  const steps: BookingStep[] = [
    {
      id: 'service-details',
      title: 'Service Details',
      description: 'Configure your service requirements',
      isComplete: Object.keys(bookingState.serviceDetails).length > 0,
      isActive: currentStep === 0
    },
    {
      id: 'customer-info',
      title: 'Your Information',
      description: 'Provide your contact details',
      isComplete: Boolean(bookingState.customerInfo.name && bookingState.customerInfo.email),
      isActive: currentStep === 1
    },
    {
      id: 'scheduling',
      title: 'Schedule Session',
      description: 'Choose your preferred time',
      isComplete: Boolean(bookingState.schedulingPreferences.preferredDate),
      isActive: currentStep === 2
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Complete your booking',
      isComplete: bookingState.status === 'confirmed',
      isActive: currentStep === 3
    }
  ];

  // Update price estimate when service details change
  useEffect(() => {
    if (Object.keys(bookingState.serviceDetails).length > 0) {
      estimatePrice(bookingState.serviceDetails);
    }
  }, [bookingState.serviceDetails, estimatePrice]);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submissions
  const handleServiceDetailsSubmit = (details: Record<string, unknown>) => {
    updateServiceDetails(details);
    goToNextStep();
  };

  const handleCustomerInfoSubmit = (info: Record<string, unknown>) => {
    updateCustomerInfo(info);
    goToNextStep();
  };

  const handleSchedulingSubmit = (preferences: Record<string, unknown>) => {
    updateSchedulingPreferences(preferences);
    goToNextStep();
  };

  const handlePaymentSubmit = async () => {
    try {
      const paymentResult = await processPayment();
      if (paymentResult.success) {
        const appointmentResult = await scheduleAppointment();
        if (appointmentResult.success) {
          onBookingComplete?.(bookingState.bookingId);
        }
      }
    } catch (err) {
      console.error('Booking completion failed:', err);
    }
  };

  // Render service-specific details form
  const renderServiceDetailsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          {serviceType === 'teaching' ? 'Lesson Requirements' :
           serviceType === 'performance' ? 'Performance Details' :
           'Collaboration Project'}
        </h3>
      </div>

      {serviceType === 'teaching' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrument/Voice Type
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => updateServiceDetails({ instrument: e.target.value })}
              value={bookingState.serviceDetails.instrument as string || ''}
            >
              <option value="">Select instrument</option>
              <option value="vocals">Vocals</option>
              <option value="piano">Piano</option>
              <option value="guitar">Guitar</option>
              <option value="violin">Violin</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => updateServiceDetails({ level: e.target.value })}
              value={bookingState.serviceDetails.level as string || ''}
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Goals
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What would you like to achieve in your lessons?"
              onChange={(e) => updateServiceDetails({ goals: e.target.value })}
              value={bookingState.serviceDetails.goals as string || ''}
            />
          </div>
        </div>
      )}

      {serviceType === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateServiceDetails({ eventType: e.target.value })}
                value={bookingState.serviceDetails.eventType as string || ''}
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="private-party">Private Party</option>
                <option value="concert">Concert</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Guests
              </label>
              <input 
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of guests"
                onChange={(e) => updateServiceDetails({ guestCount: parseInt(e.target.value) })}
                value={bookingState.serviceDetails.guestCount as number || ''}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Performance Duration
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => updateServiceDetails({ duration: e.target.value })}
              value={bookingState.serviceDetails.duration as string || ''}
            >
              <option value="">Select duration</option>
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="2hours">2 hours</option>
              <option value="3hours">3 hours</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any specific songs, equipment needs, or special requests?"
              onChange={(e) => updateServiceDetails({ requirements: e.target.value })}
              value={bookingState.serviceDetails.requirements as string || ''}
            />
          </div>
        </div>
      )}

      {serviceType === 'collaboration' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => updateServiceDetails({ projectType: e.target.value })}
              value={bookingState.serviceDetails.projectType as string || ''}
            >
              <option value="">Select project type</option>
              <option value="recording">Recording Session</option>
              <option value="songwriting">Songwriting</option>
              <option value="arrangement">Arrangement</option>
              <option value="production">Music Production</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateServiceDetails({ timeline: e.target.value })}
                value={bookingState.serviceDetails.timeline as string || ''}
              >
                <option value="">Select timeline</option>
                <option value="1week">Within 1 week</option>
                <option value="2weeks">Within 2 weeks</option>
                <option value="1month">Within 1 month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateServiceDetails({ budgetRange: e.target.value })}
                value={bookingState.serviceDetails.budgetRange as string || ''}
              >
                <option value="">Select budget range</option>
                <option value="under-500">Under $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-plus">$2,500+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your project, vision, and what you're looking to achieve..."
              onChange={(e) => updateServiceDetails({ description: e.target.value })}
              value={bookingState.serviceDetails.description as string || ''}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => onBookingCancelled?.()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleServiceDetailsSubmit(bookingState.serviceDetails)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={Object.keys(bookingState.serviceDetails).length === 0}
        >
          Continue
          <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  // Render customer information form
  const renderCustomerInfoForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Contact Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input 
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            onChange={(e) => updateCustomerInfo({ name: e.target.value })}
            onBlur={(e) => validateField('name', e.target.value)}
            value={bookingState.customerInfo.name || ''}
            required
          />
          <ValidationMessage 
            error={formErrors.name}
            serviceType={serviceType}
            fieldName="name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input 
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            onChange={(e) => updateCustomerInfo({ email: e.target.value })}
            onBlur={(e) => validateField('email', e.target.value)}
            value={bookingState.customerInfo.email || ''}
            required
          />
          <ValidationMessage 
            error={formErrors.email}
            serviceType={serviceType}
            fieldName="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input 
            type="tel"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
            onChange={(e) => updateCustomerInfo({ phone: e.target.value })}
            onBlur={(e) => validateField('phone', e.target.value)}
            value={bookingState.customerInfo.phone || ''}
          />
          <ValidationMessage 
            error={formErrors.phone}
            serviceType={serviceType}
            fieldName="phone"
          />
        </div>

        {serviceType === 'performance' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Location
            </label>
            <input 
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event location"
              onChange={(e) => updateCustomerInfo({ location: e.target.value })}
              value={bookingState.customerInfo.location || ''}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleCustomerInfoSubmit(bookingState.customerInfo)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={!bookingState.customerInfo.name || !bookingState.customerInfo.email}
        >
          Continue
          <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  // Render scheduling form
  const renderSchedulingForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Schedule Your Session
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date *
          </label>
          <input 
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateSchedulingPreferences({ preferredDate: e.target.value })}
            value={bookingState.schedulingPreferences.preferredDate as string || ''}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time *
          </label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateSchedulingPreferences({ preferredTime: e.target.value })}
            value={bookingState.schedulingPreferences.preferredTime as string || ''}
            required
          >
            <option value="">Select time</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Type
          </label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateSchedulingPreferences({ sessionType: e.target.value })}
            value={bookingState.schedulingPreferences.sessionType as string || ''}
          >
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            {serviceType === 'teaching' && <option value="hybrid">Hybrid</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateSchedulingPreferences({ timezone: e.target.value })}
            value={bookingState.schedulingPreferences.timezone as string || 'America/New_York'}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Any special requests or additional information..."
          onChange={(e) => updateSchedulingPreferences({ notes: e.target.value })}
          value={bookingState.schedulingPreferences.notes as string || ''}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleSchedulingSubmit(bookingState.schedulingPreferences)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={!bookingState.schedulingPreferences.preferredDate || !bookingState.schedulingPreferences.preferredTime}
        >
          Review & Pay
          <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
          Payment & Confirmation
        </h3>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-3">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="capitalize font-medium">{serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium">{bookingState.schedulingPreferences.preferredDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="font-medium">{bookingState.schedulingPreferences.preferredTime}</span>
          </div>
          {priceEstimate && (
            <>
              <div className="flex justify-between">
                <span>Estimated Cost:</span>
                <span className="font-medium">${priceEstimate.estimatedPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Fee:</span>
                <span className="font-medium">${priceEstimate.bookingFee || 25}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${(priceEstimate.estimatedPrice + (priceEstimate.bookingFee || 25)).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="space-y-2">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="stripe"
              className="mr-3"
              onChange={(e) => updatePaymentInfo({ method: e.target.value })}
              checked={bookingState.paymentInfo.method === 'stripe'}
            />
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            <span>Credit/Debit Card (Stripe)</span>
          </label>
          <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="paypal"
              className="mr-3"
              onChange={(e) => updatePaymentInfo({ method: e.target.value })}
              checked={bookingState.paymentInfo.method === 'paypal'}
            />
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <input 
          type="checkbox"
          id="acceptTerms"
          className="mt-1 mr-3"
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          checked={acceptedTerms}
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-700">
          I agree to the{' '}
          <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePaymentSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          disabled={!acceptedTerms || !bookingState.paymentInfo.method || isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Complete Booking
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Circles */}
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white transition-colors z-10
              ${step.isComplete ? 'border-green-600 text-green-600' :
                step.isActive ? 'border-blue-600 text-blue-600' :
                'border-gray-300 text-gray-400'}
            `}>
              {step.isComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${step.isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-400 hidden sm:block">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book Your {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Session
        </h2>
        <p className="text-gray-600">
          Complete the steps below to secure your booking and payment.
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Price Estimate Display */}
      {(priceEstimate && currentStep > 0) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Estimated Total</span>
              {isEstimating && <Loader className="w-4 h-4 ml-2 animate-spin text-blue-600" />}
            </div>
            <span className="text-xl font-bold text-blue-900">
              ${priceEstimate.estimatedPrice}
            </span>
          </div>
          {priceEstimate.priceRange && (
            <p className="text-sm text-blue-700 mt-1">
              Range: ${priceEstimate.priceRange.min} - ${priceEstimate.priceRange.max}
            </p>
          )}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-96">
        {currentStep === 0 && renderServiceDetailsForm()}
        {currentStep === 1 && renderCustomerInfoForm()}
        {currentStep === 2 && renderSchedulingForm()}
        {currentStep === 3 && renderPaymentForm()}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
            Secure Payment
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-600" />
            Instant Confirmation
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-1 text-purple-600" />
            Email Updates
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;