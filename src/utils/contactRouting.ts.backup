/**
 * Contact Routing Utility
 * 
 * Intelligent contact routing system that directs users to appropriate 
 * inquiry forms based on their service context and navigation path.
 * 
 * Features:
 * - Service-specific routing logic
 * - URL parameter handling for form context
 * - Fallback handling for edge cases
 * - TypeScript support for type safety
 */

import { Location } from 'react-router-dom';
import type { FormInitialData } from '@/types/forms';

/**
 * Supported service types for contact routing
 */
export type ServiceType = 'performance' | 'collaboration' | 'teaching' | 'general';

/**
 * Contact routing context information
 */
export interface ContactContext {
  serviceType: ServiceType;
  initialFormType?: string;
  source?: string;
  referrer?: string;
}

/**
 * URL parameters that can influence contact routing
 */
export interface ContactRouteParams {
  service?: string;
  form?: string;
  package?: string;
  type?: string;
  source?: string;
}

/**
 * Service detection patterns for different pages/sections
 */
const SERVICE_PATTERNS = {
  performance: ['/performance', '#performances', 'performance'],
  collaboration: ['/collaboration', '#collaboration', 'collaboration'],
  teaching: ['/', '#lessons', '#approach', 'lessons', 'approach', 'teaching'],
  general: ['#contact', '#about', 'contact', 'about']
} as const;

/**
 * Detects the current service context based on location and referrer
 */
export function detectServiceContext(
  location: Location,
  referrer?: string,
  urlParams?: URLSearchParams
): ContactContext {
  const { pathname, hash, search } = location;
  const params = urlParams || new URLSearchParams(search);
  
  // Check URL parameters first for explicit service routing
  const serviceParam = params.get('service');
  if (serviceParam && isValidServiceType(serviceParam)) {
    return {
      serviceType: serviceParam as ServiceType,
      initialFormType: params.get('form') || undefined,
      source: params.get('source') || 'url_parameter',
      referrer
    };
  }
  
  // Detect service based on current path and hash
  const currentLocation = `${pathname}${hash}`;
  
  // Check performance context
  if (SERVICE_PATTERNS.performance.some(pattern => 
    currentLocation.includes(pattern) || referrer?.includes(pattern)
  )) {
    return {
      serviceType: 'performance',
      initialFormType: params.get('type') || 'band', // Default to band performance
      source: 'page_context',
      referrer
    };
  }
  
  // Check collaboration context
  if (SERVICE_PATTERNS.collaboration.some(pattern => 
    currentLocation.includes(pattern) || referrer?.includes(pattern)
  )) {
    return {
      serviceType: 'collaboration',
      initialFormType: params.get('type') || 'creative', // Default to creative project
      source: 'page_context',
      referrer
    };
  }
  
  // Check teaching context
  if (SERVICE_PATTERNS.teaching.some(pattern => 
    currentLocation.includes(pattern) || referrer?.includes(pattern)
  )) {
    const packageType = params.get('package') || 'single';
    return {
      serviceType: 'teaching',
      initialFormType: packageType,
      source: 'page_context',
      referrer
    };
  }
  
  // Default to general contact
  return {
    serviceType: 'general',
    source: 'fallback',
    referrer
  };
}

/**
 * Type guard to check if a string is a valid service type
 */
function isValidServiceType(value: string): value is ServiceType {
  return ['performance', 'collaboration', 'teaching', 'general'].includes(value);
}

/**
 * Generates the appropriate contact URL with parameters for a given service context
 */
export function generateContactUrl(
  serviceType: ServiceType,
  options?: {
    formType?: string;
    packageType?: string;
    source?: string;
    returnUrl?: string;
  }
): string {
  const params = new URLSearchParams();
  
  params.set('service', serviceType);
  
  if (options?.formType) {
    params.set('form', options.formType);
  }
  
  if (options?.packageType && serviceType === 'teaching') {
    params.set('package', options.packageType);
  }
  
  if (options?.source) {
    params.set('source', options.source);
  }
  
  if (options?.returnUrl) {
    params.set('return', encodeURIComponent(options.returnUrl));
  }
  
  // Route to appropriate page based on service type
  switch (serviceType) {
    case 'performance':
      return `/performance?${params.toString()}#contact`;
    case 'collaboration':
      return `/collaboration?${params.toString()}#contact`;
    case 'teaching':
      return `/?${params.toString()}#contact`;
    default:
      return `/?${params.toString()}#contact`;
  }
}

/**
 * Contact link options
 */
interface ContactLinkOptions {
  formType?: string;
  packageType?: string;
  source?: string;
  text?: string;
  className?: string;
}

/**
 * Generates a contact link with proper routing for CTAs
 */
export function createContactLink(
  serviceType: ServiceType,
  options?: ContactLinkOptions
): {
  href: string;
  'data-service': ServiceType;
  'data-form-type'?: string;
  'aria-label': string;
} {
  const href = generateContactUrl(serviceType, options);
  
  const linkProps: {
    href: string;
    'data-service': ServiceType;
    'data-form-type'?: string;
    'aria-label': string;
  } = {
    href,
    'data-service': serviceType,
    'aria-label': `Contact for ${serviceType} services`
  };
  
  if (options?.formType) {
    linkProps['data-form-type'] = options.formType;
  }
  
  return linkProps;
}

/**
 * Form type mapping result
 */
interface FormTypeResult {
  formComponent: 'PerformanceInquiryForm' | 'CollaborationInquiryForm' | 'TeachingInquiryForm' | 'ServiceSelectionModal';
  initialData?: FormInitialData;
}

/**
 * Determines which inquiry form should be opened based on service context
 */
export function getFormTypeFromContext(context: ContactContext): FormTypeResult {
  switch (context.serviceType) {
    case 'performance':
      return {
        formComponent: 'PerformanceInquiryForm',
        initialData: {
          performanceType: context.initialFormType || 'band'
        }
      };
      
    case 'collaboration':
      return {
        formComponent: 'CollaborationInquiryForm',
        initialData: {
          projectType: context.initialFormType || 'creative'
        }
      };
      
    case 'teaching':
      return {
        formComponent: 'TeachingInquiryForm',
        initialData: {
          packageType: context.initialFormType || 'single'
        }
      };
      
    default:
      return {
        formComponent: 'ServiceSelectionModal'
      };
  }
}

/**
 * Hook-like function to get routing context (for use in components)
 */
export function useContactRouting(location: Location, referrer?: string) {
  const context = detectServiceContext(location, referrer);
  const formType = getFormTypeFromContext(context);
  
  return {
    context,
    formType,
    generateUrl: (serviceType: ServiceType, options?: ContactLinkOptions) => 
      generateContactUrl(serviceType, options),
    createLink: (serviceType: ServiceType, options?: ContactLinkOptions) => 
      createContactLink(serviceType, options)
  };
}

/**
 * Analytics tracking data
 */
interface AnalyticsData {
  event_category: string;
  event_label: string;
  service_type: ServiceType;
  source?: string;
  custom_map?: {
    form_type?: string;
  };
}

/**
 * Global gtag interface
 */
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters: AnalyticsData
    ) => void;
  }
}

/**
 * Analytics tracking for contact routing
 */
export function trackContactRouting(context: ContactContext, action: 'detected' | 'form_opened' | 'form_submitted') {
  // This can be integrated with your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_routing', {
      event_category: 'Contact',
      event_label: `${context.serviceType}_${action}`,
      service_type: context.serviceType,
      source: context.source,
      custom_map: {
        form_type: context.initialFormType
      }
    });
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Contact Routing:', { context, action });
  }
}