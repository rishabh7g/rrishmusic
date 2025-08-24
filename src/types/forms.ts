/**
 * Form Data Types
 * 
 * Shared type definitions for all inquiry forms to ensure type safety
 * across the contact routing system.
 */

// Re-export form data types from individual forms
export type { PerformanceInquiryData } from '@/components/forms/PerformanceInquiryForm';
export type { CollaborationInquiryData } from '@/components/forms/CollaborationInquiryForm';
export type { TeachingInquiryData } from '@/components/forms/TeachingInquiryForm';

/**
 * Union type for all form data types
 */
export type InquiryFormData = 
  | import('@/components/forms/PerformanceInquiryForm').PerformanceInquiryData
  | import('@/components/forms/CollaborationInquiryForm').CollaborationInquiryData
  | import('@/components/forms/TeachingInquiryForm').TeachingInquiryData;

/**
 * Form submission handler type
 */
export type FormSubmissionHandler<T = InquiryFormData> = (data: T) => Promise<void>;

/**
 * Generic form props interface
 */
export interface BaseFormProps<T = InquiryFormData> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: FormSubmissionHandler<T>;
}

/**
 * Service-specific form initial data types
 */
export interface PerformanceFormInitialData {
  performanceType?: string;
}

export interface CollaborationFormInitialData {
  projectType?: string;
}

export interface TeachingFormInitialData {
  packageType?: string;
}

/**
 * Union type for all initial data types
 */
export type FormInitialData = 
  | PerformanceFormInitialData 
  | CollaborationFormInitialData 
  | TeachingFormInitialData
  | Record<string, never>; // For empty objects