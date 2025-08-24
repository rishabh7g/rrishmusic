/**
 * Inquiry Pricing Hook
 * State management for inquiry-based pricing system for Performance and Collaboration services
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PriceEstimate, 
  estimatePerformancePricing, 
  estimateCollaborationPricing,
  formatPriceEstimate
} from '@/utils/pricingEstimation';

export type ServiceType = 'performance' | 'collaboration';

export interface ConsultationBooking {
  id: string;
  serviceType: ServiceType;
  preferredDates: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  duration: 30 | 45 | 60; // minutes
  consultationType: 'phone' | 'video' | 'in-person';
  notes?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface InquiryPricingState {
  serviceType: ServiceType | null;
  currentEstimate: PriceEstimate | null;
  isEstimating: boolean;
  estimateHistory: PriceEstimate[];
  consultationBooking: ConsultationBooking | null;
  followUpScheduled: boolean;
  error: string | null;
}

export interface UseInquiryPricingOptions {
  serviceType?: ServiceType;
  trackHistory?: boolean;
  enableConsultationBooking?: boolean;
}

export interface UseInquiryPricingReturn {
  state: InquiryPricingState;
  actions: {
    estimatePerformancePrice: (data: PerformancePricingData) => void;
    estimateCollaborationPrice: (data: CollaborationPricingData) => void;
    clearEstimate: () => void;
    scheduleConsultation: (booking: Omit<ConsultationBooking, 'id' | 'status'>) => void;
    scheduleFollowUp: (days: number) => void;
    clearError: () => void;
  };
  computed: {
    hasEstimate: boolean;
    isConsultationRecommended: boolean;
    formattedEstimate: ReturnType<typeof formatPriceEstimate> | null;
    estimateExpired: boolean;
    canBook: boolean;
  };
}

export interface PerformancePricingData {
  performanceFormat: 'solo' | 'band' | 'flexible' | 'unsure';
  performanceStyle: 'acoustic' | 'electric' | 'both' | 'unsure';
  eventType: 'wedding' | 'corporate' | 'venue' | 'private' | 'other';
  duration: string;
  guestCount?: string;
  eventDate?: string;
  venueAddress?: string;
  budgetRange: string;
}

export interface CollaborationPricingData {
  projectType: 'studio' | 'creative' | 'partnership' | 'other';
  projectScope: 'single-session' | 'short-term' | 'long-term' | 'ongoing';
  timeline: 'urgent' | 'flexible' | 'specific-date' | 'ongoing';
  experience: 'first-time' | 'some-experience' | 'experienced' | 'professional';
  creativeVision: string;
  budgetRange: string;
}

/**
 * Hook for managing inquiry-based pricing system
 */
export function useInquiryPricing(
  options: UseInquiryPricingOptions = {}
): UseInquiryPricingReturn {
  const {
    serviceType,
    trackHistory = true,
    enableConsultationBooking = true
  } = options;

  // Core state
  const [state, setState] = useState<InquiryPricingState>({
    serviceType: serviceType || null,
    currentEstimate: null,
    isEstimating: false,
    estimateHistory: [],
    consultationBooking: null,
    followUpScheduled: false,
    error: null
  });

  /**
   * Estimate performance pricing
   */
  const estimatePerformancePrice = useCallback(async (data: PerformancePricingData) => {
    setState(prev => ({ ...prev, isEstimating: true, error: null }));

    try {
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const estimate = estimatePerformancePricing(data);
      
      setState(prev => ({
        ...prev,
        serviceType: 'performance',
        currentEstimate: estimate,
        isEstimating: false,
        estimateHistory: trackHistory 
          ? [...prev.estimateHistory.slice(-4), estimate] // Keep last 5 estimates
          : prev.estimateHistory
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isEstimating: false,
        error: error instanceof Error ? error.message : 'Failed to estimate pricing'
      }));
    }
  }, [trackHistory]);

  /**
   * Estimate collaboration pricing
   */
  const estimateCollaborationPrice = useCallback(async (data: CollaborationPricingData) => {
    setState(prev => ({ ...prev, isEstimating: true, error: null }));

    try {
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const estimate = estimateCollaborationPricing(data);
      
      setState(prev => ({
        ...prev,
        serviceType: 'collaboration',
        currentEstimate: estimate,
        isEstimating: false,
        estimateHistory: trackHistory 
          ? [...prev.estimateHistory.slice(-4), estimate]
          : prev.estimateHistory
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isEstimating: false,
        error: error instanceof Error ? error.message : 'Failed to estimate pricing'
      }));
    }
  }, [trackHistory]);

  /**
   * Clear current estimate
   */
  const clearEstimate = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentEstimate: null,
      error: null
    }));
  }, []);

  /**
   * Schedule consultation
   */
  const scheduleConsultation = useCallback((booking: Omit<ConsultationBooking, 'id' | 'status'>) => {
    if (!enableConsultationBooking) {
      setState(prev => ({
        ...prev,
        error: 'Consultation booking is not enabled'
      }));
      return;
    }

    const consultationBooking: ConsultationBooking = {
      ...booking,
      id: generateBookingId(),
      status: 'pending'
    };

    setState(prev => ({
      ...prev,
      consultationBooking,
      error: null
    }));

    // Simulate booking confirmation
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        consultationBooking: prev.consultationBooking ? {
          ...prev.consultationBooking,
          status: 'scheduled',
          scheduledDate: prev.consultationBooking.preferredDates[0],
          scheduledTime: '2:00 PM' // Would be determined by availability system
        } : null
      }));
    }, 1000);

  }, [enableConsultationBooking]);

  /**
   * Schedule follow-up
   */
  const scheduleFollowUp = useCallback((days: number) => {
    setState(prev => ({
      ...prev,
      followUpScheduled: true
    }));

    // In real implementation, this would trigger follow-up automation
    console.log(`Follow-up scheduled for ${days} days from now`);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Computed values
  const computed = useMemo(() => {
    const hasEstimate = Boolean(state.currentEstimate);
    const isConsultationRecommended = Boolean(state.currentEstimate?.consultationRecommended);
    const formattedEstimate = state.currentEstimate ? formatPriceEstimate(state.currentEstimate) : null;
    
    // Check if estimate is expired
    const estimateExpired = Boolean(
      state.currentEstimate && 
      Date.now() > (Date.now() + (state.currentEstimate.estimateValidDays * 24 * 60 * 60 * 1000))
    );
    
    const canBook = enableConsultationBooking && hasEstimate && !state.consultationBooking;

    return {
      hasEstimate,
      isConsultationRecommended,
      formattedEstimate,
      estimateExpired,
      canBook
    };
  }, [state.currentEstimate, state.consultationBooking, enableConsultationBooking]);

  // Auto-clear expired estimates
  useEffect(() => {
    if (computed.estimateExpired) {
      const timer = setTimeout(() => {
        clearEstimate();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [computed.estimateExpired, clearEstimate]);

  return {
    state,
    actions: {
      estimatePerformancePrice,
      estimateCollaborationPrice,
      clearEstimate,
      scheduleConsultation,
      scheduleFollowUp,
      clearError
    },
    computed
  };
}

/**
 * Hook for simplified inquiry pricing without full state management
 */
export function useSimpleInquiryPricing(serviceType: ServiceType) {
  const [currentEstimate, setCurrentEstimate] = useState<PriceEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const estimatePrice = useCallback(async (data: PerformancePricingData | CollaborationPricingData) => {
    setIsEstimating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let estimate: PriceEstimate;
      if (serviceType === 'performance') {
        estimate = estimatePerformancePricing(data as PerformancePricingData);
      } else {
        estimate = estimateCollaborationPricing(data as CollaborationPricingData);
      }
      
      setCurrentEstimate(estimate);
    } catch (error) {
      console.error('Failed to estimate pricing:', error);
    } finally {
      setIsEstimating(false);
    }
  }, [serviceType]);

  const clearEstimate = useCallback(() => {
    setCurrentEstimate(null);
  }, []);

  return {
    currentEstimate,
    isEstimating,
    estimatePrice,
    clearEstimate,
    formattedEstimate: currentEstimate ? formatPriceEstimate(currentEstimate) : null
  };
}

/**
 * Generate unique booking ID
 */
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `consultation-${timestamp}-${random}`;
}

/**
 * Inquiry pricing utility functions
 */
export const InquiryPricingUtils = {
  /**
   * Get consultation duration recommendation based on service and complexity
   */
  getRecommendedConsultationDuration: (
    serviceType: ServiceType,
    complexity: 'low' | 'medium' | 'high'
  ): 30 | 45 | 60 => {
    if (serviceType === 'performance') {
      return complexity === 'high' ? 45 : 30;
    } else {
      return complexity === 'low' ? 30 : complexity === 'medium' ? 45 : 60;
    }
  },

  /**
   * Get follow-up timeline recommendation
   */
  getFollowUpTimeline: (serviceType: ServiceType, urgency: 'low' | 'medium' | 'high'): number => {
    const baseDays = serviceType === 'performance' ? 3 : 5;
    
    return urgency === 'high' ? baseDays / 2 :
           urgency === 'medium' ? baseDays :
           baseDays * 2;
  },

  /**
   * Validate inquiry data completeness
   */
  validateInquiryData: (data: PerformancePricingData | CollaborationPricingData): {
    isValid: boolean;
    missingFields: string[];
    completeness: number;
  } => {
    const requiredFields = [
      'eventType' in data ? 'eventType' : 'projectType',
      'duration' in data ? 'duration' : 'projectScope'
    ];
    
    const optionalFields = Object.keys(data);
    const missingRequired = requiredFields.filter(field => !data[field as keyof typeof data]);
    const providedOptional = optionalFields.filter(field => 
      data[field as keyof typeof data] && !requiredFields.includes(field)
    );
    
    const completeness = Math.round(
      ((requiredFields.length - missingRequired.length) / requiredFields.length + 
       providedOptional.length / optionalFields.length) / 2 * 100
    );

    return {
      isValid: missingRequired.length === 0,
      missingFields: missingRequired,
      completeness: Math.min(completeness, 100)
    };
  }
};

export default useInquiryPricing;