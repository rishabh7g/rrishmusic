/**
 * Forms Module Exports
 * Clean exports for the unified form system
 */

// Core form components
export { BaseInquiryForm } from './BaseInquiryForm'
export {
  PerformanceInquiryForm,
  CollaborationInquiryForm,
  TeachingInquiryForm,
  UniversalInquiryForm,
  // Backward compatibility aliases
  PerformanceInquiry,
  CollaborationInquiry,
} from './ServiceInquiryForm'

// Validation component (already exists)
export { ValidationMessage, ValidationSummary } from './ValidationMessage'

// Types and configurations
export type {
  BaseInquiryData,
  PerformanceInquiryData,
  CollaborationInquiryData,
  TeachingInquiryData,
  UniversalInquiryData,
  InquiryData,
  ServiceType,
  BaseInquiryFormProps,
  PerformanceInquiryFormProps,
  CollaborationInquiryFormProps,
  TeachingInquiryFormProps,
  UniversalInquiryFormProps,
  FormErrors,
  FormState,
} from './types'

export type {
  FieldConfig,
  SectionConfig,
  FormConfig,
} from './formConfigurations'

export {
  formConfigurations,
  getFormConfiguration,
  performanceFormConfig,
  collaborationFormConfig,
  teachingFormConfig,
  universalFormConfig,
} from './formConfigurations'