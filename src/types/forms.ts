/**
 * Form Data Types
 *
 * Shared type definitions for all inquiry forms to ensure type safety
 * across the contact routing system.
 */

// Re-export form data types from unified forms system
export type {
  PerformanceInquiryData,
  CollaborationInquiryData,
  TeachingInquiryData,
  UniversalInquiryData,
  InquiryData,
  ServiceType,
  FormErrors,
  FormState,
} from '@/components/forms/types'

/**
 * Legacy compatibility - Union type for all form data types
 * @deprecated Use InquiryData from forms/types instead
 */
export type InquiryFormData = InquiryData

/**
 * Form submission handler type
 */
export type FormSubmissionHandler<T = InquiryData> = (data: T) => Promise<void>

/**
 * Generic form props interface
 */
export interface BaseFormProps<T = InquiryData> {
  isOpen: boolean
  onClose: () => void
  onSubmit: FormSubmissionHandler<T>
}

/**
 * Service-specific form initial data types
 */
export interface PerformanceFormInitialData {
  performanceType?: string
}

export interface CollaborationFormInitialData {
  projectType?: string
}

export interface TeachingFormInitialData {
  packageType?: string
}

/**
 * Union type for all initial data types
 */
export type FormInitialData =
  | PerformanceFormInitialData
  | CollaborationFormInitialData
  | TeachingFormInitialData
  | Record<string, never> // For empty objects
