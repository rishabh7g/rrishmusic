/**
 * Smart Contact CTA Component
 * 
 * Intelligent contact call-to-action that automatically routes users to the
 * appropriate inquiry form based on their current context and service type.
 * 
 * Features:
 * - Context-aware service detection
 * - Automatic form routing
 * - URL parameter handling
 * - Fallback to service selection modal
 * - Analytics tracking
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ServiceType, 
  detectServiceContext, 
  getFormTypeFromContext,
  trackContactRouting 
} from '@/utils/contactRouting';
import { PerformanceInquiryForm } from '@/components/forms/PerformanceInquiryForm';
import { CollaborationInquiryForm } from '@/components/forms/CollaborationInquiryForm';
import { TeachingInquiryForm } from '@/components/forms/TeachingInquiryForm';
import { ServiceSelectionModal } from '@/components/ui/ServiceSelectionModal';
import type { 
  InquiryFormData, 
  FormSubmissionHandler,
  FormInitialData 
} from '@/types/forms';

/**
 * Props for the Smart Contact CTA
 */
interface SmartContactCTAProps {
  /**
   * Override the auto-detected service type
   */
  forceServiceType?: ServiceType;
  
  /**
   * CTA button text override
   */
  ctaText?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Display variant
   */
  variant?: 'default' | 'compact' | 'prominent';
  
  /**
   * Whether to show service-specific messaging
   */
  showServiceInfo?: boolean;
  
  /**
   * Analytics source tracking
   */
  analyticsSource?: string;
  
  /**
   * Callback when form is opened
   */
  onFormOpen?: (serviceType: ServiceType) => void;
  
  /**
   * Callback when form is submitted
   */
  onFormSubmit?: (serviceType: ServiceType, data: InquiryFormData) => void;
}

/**
 * Smart Contact CTA Component
 */
export const SmartContactCTA: React.FC<SmartContactCTAProps> = ({
  forceServiceType,
  ctaText,
  className = "",
  variant = "default",
  showServiceInfo = true,
  analyticsSource = "smart_cta",
  onFormOpen,
  onFormSubmit
}) => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>('general');
  const [formComponent, setFormComponent] = useState<'PerformanceInquiryForm' | 'CollaborationInquiryForm' | 'TeachingInquiryForm' | 'ServiceSelectionModal'>('ServiceSelectionModal');
  const [initialFormData, setInitialFormData] = useState<FormInitialData>({});

  /**
   * Detect service context on mount and location change
   */
  useEffect(() => {
    const context = detectServiceContext(location, document.referrer);
    const detectedService = forceServiceType || context.serviceType;
    const formType = getFormTypeFromContext({ ...context, serviceType: detectedService });
    
    setActiveService(detectedService);
    setFormComponent(formType.formComponent);
    setInitialFormData(formType.initialData || {});
    
    // Track the detection
    trackContactRouting({ ...context, serviceType: detectedService }, 'detected');
  }, [location, forceServiceType]);

  /**
   * Handle CTA click
   */
  const handleCTAClick = () => {
    setIsFormOpen(true);
    trackContactRouting({ 
      serviceType: activeService, 
      source: analyticsSource,
      initialFormType: 
        'performanceType' in initialFormData ? initialFormData.performanceType :
        'projectType' in initialFormData ? initialFormData.projectType :
        'packageType' in initialFormData ? initialFormData.packageType :
        undefined
    }, 'form_opened');
    onFormOpen?.(activeService);
  };

  /**
   * Handle form closure
   */
  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit: FormSubmissionHandler = async (data: InquiryFormData) => {
    console.log('Smart CTA form submitted:', { service: activeService, data });
    
    trackContactRouting({ 
      serviceType: activeService, 
      source: analyticsSource
    }, 'form_submitted');
    
    onFormSubmit?.(activeService, data);
    
    // In a real implementation, this would handle the form submission
    alert('Thank you for your inquiry! I\'ll get back to you within 24 hours.');
  };

  /**
   * Handle service selection from modal
   */
  const handleServiceSelect = (serviceType: ServiceType) => {
    setActiveService(serviceType);
    const context = { serviceType, source: 'service_selection' };
    const formType = getFormTypeFromContext(context);
    setFormComponent(formType.formComponent);
    setInitialFormData(formType.initialData || {});
  };

  /**
   * Get service-specific messaging
   */
  const getServiceMessage = (service: ServiceType): { title: string; subtitle: string; price?: string } => {
    switch (service) {
      case 'performance':
        return {
          title: 'Book a Performance',
          subtitle: 'Live guitar entertainment for your venue or event'
        };
      case 'collaboration':
        return {
          title: 'Start a Collaboration',
          subtitle: 'Creative partnerships and artistic projects'
        };
      case 'teaching':
        return {
          title: 'Book Guitar Lessons',
          subtitle: 'Personalized instruction for all skill levels',
          price: '$50/lesson'
        };
      default:
        return {
          title: 'Get in Touch',
          subtitle: 'Let\'s discuss how I can help with your musical needs'
        };
    }
  };

  /**
   * Get service-specific styling
   */
  const getServiceStyling = (service: ServiceType) => {
    switch (service) {
      case 'performance':
        return {
          color: 'brand-orange-warm',
          bgGradient: 'from-brand-orange-warm to-brand-orange-warm/90'
        };
      case 'collaboration':
        return {
          color: 'brand-blue-primary',
          bgGradient: 'from-brand-blue-primary to-brand-blue-secondary'
        };
      case 'teaching':
        return {
          color: 'brand-orange-warm',
          bgGradient: 'from-brand-orange-warm to-brand-orange-warm/90'
        };
      default:
        return {
          color: 'brand-blue-primary',
          bgGradient: 'from-brand-blue-primary to-brand-blue-secondary'
        };
    }
  };

  const serviceMessage = getServiceMessage(activeService);
  const serviceStyling = getServiceStyling(activeService);
  const defaultCTAText = ctaText || serviceMessage.title;

  /**
   * Render the CTA based on variant
   */
  const renderCTA = () => {
    const baseClasses = "group transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20";
    
    switch (variant) {
      case 'compact':
        return (
          <button
            onClick={handleCTAClick}
            className={`${baseClasses} inline-flex items-center px-6 py-3 bg-gradient-to-r ${serviceStyling.bgGradient} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-${serviceStyling.color}/20 ${className}`}
            aria-label={`Open ${activeService} inquiry form`}
          >
            {defaultCTAText}
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        );
        
      case 'prominent':
        return (
          <div className={`bg-gradient-to-br ${serviceStyling.bgGradient} rounded-2xl p-8 text-white ${className}`}>
            {showServiceInfo && (
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {serviceMessage.title}
                </h3>
                <p className="text-white/90 mb-2">
                  {serviceMessage.subtitle}
                </p>
                {serviceMessage.price && (
                  <div className="text-white">
                    <span className="text-3xl font-bold">{serviceMessage.price}</span>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={handleCTAClick}
              className={`${baseClasses} w-full bg-white text-${serviceStyling.color} font-heading font-bold text-lg py-4 rounded-xl hover:bg-white/95 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-white/20`}
              aria-label={`Open ${activeService} inquiry form`}
            >
              {defaultCTAText}
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        );
        
      default:
        return (
          <motion.div 
            className={`text-center ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showServiceInfo && serviceMessage.price && (
              <div className="mb-4">
                <div className={`text-${serviceStyling.color} text-center`}>
                  <span className="text-2xl font-bold">{serviceMessage.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {serviceMessage.subtitle}
                </p>
              </div>
            )}
            
            <button
              onClick={handleCTAClick}
              className={`${baseClasses} inline-flex items-center px-10 py-4 bg-gradient-to-r ${serviceStyling.bgGradient} text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:ring-${serviceStyling.color}/20`}
              aria-label={`Open ${activeService} inquiry form`}
            >
              {defaultCTAText}
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        );
    }
  };

  return (
    <>
      {renderCTA()}
      
      {/* Service-Specific Forms */}
      {formComponent === 'PerformanceInquiryForm' && (
        <PerformanceInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialPerformanceType={'performanceType' in initialFormData ? initialFormData.performanceType : undefined}
        />
      )}

      {formComponent === 'CollaborationInquiryForm' && (
        <CollaborationInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialProjectType={'projectType' in initialFormData ? initialFormData.projectType : undefined}
        />
      )}

      {formComponent === 'TeachingInquiryForm' && (
        <TeachingInquiryForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialPackageType={'packageType' in initialFormData ? initialFormData.packageType : undefined}
        />
      )}

      {formComponent === 'ServiceSelectionModal' && (
        <ServiceSelectionModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onServiceSelect={handleServiceSelect}
        />
      )}
    </>
  );
};

export default SmartContactCTA;