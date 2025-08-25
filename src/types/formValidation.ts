/**
 * Form Validation Types
 * Types and interfaces for context-aware form validation system
 */

import { ServiceType } from './content';

/**
 * Validation rule severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Validation context for contextual validation
 */
export interface ValidationContext {
  serviceType?: ServiceType;
  formStep?: number;
  userJourneyStage?: 'initial' | 'interested' | 'ready' | 'converting';
  fieldDependencies?: Record<string, unknown>;
  isRequired?: boolean;
  customRules?: string[];
}

/**
 * Individual validation rule definition
 */
export interface ValidationRule {
  id: string;
  field: string;
  validator: (value: unknown, context?: ValidationContext) => boolean;
  message: string | ((value: unknown, context?: ValidationContext) => string);
  severity: ValidationSeverity;
  when?: (context?: ValidationContext) => boolean;
  dependencies?: string[];
  debounceMs?: number;
}

/**
 * Validation result for a field
 */
export interface ValidationResult {
  field: string;
  isValid: boolean;
  severity: ValidationSeverity;
  message: string;
  timestamp: number;
}

/**
 * Form validation state
 */
export interface FormValidationState {
  isValidating: boolean;
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  fieldResults: Record<string, ValidationResult>;
  globalMessages: ValidationResult[];
  touchedFields: Set<string>;
  validationCount: number;
}

/**
 * Service-specific field requirements
 */
export interface ServiceFieldRequirements {
  required: string[];
  optional: string[];
  conditional: Record<string, {
    condition: (formData: Record<string, unknown>) => boolean;
    fields: string[];
  }>;
  serviceSpecific: Record<string, {
    rules: ValidationRule[];
    guidance: string;
  }>;
}

/**
 * Progressive validation configuration
 */
export interface ProgressiveValidationConfig {
  stages: Array<{
    name: string;
    fields: string[];
    trigger: 'blur' | 'change' | 'submit' | 'delay';
    delayMs?: number;
    showGuidance?: boolean;
  }>;
  skipStagesOnError: boolean;
  enableRealtimeValidation: boolean;
}

/**
 * Validation error details for accessibility
 */
export interface AccessibleValidationError {
  field: string;
  id: string;
  message: string;
  severity: ValidationSeverity;
  ariaLabel: string;
  description?: string;
  suggestions?: string[];
  relatedFields?: string[];
}

/**
 * Form validation configuration
 */
export interface FormValidationConfig {
  rules: ValidationRule[];
  serviceRequirements: Record<ServiceType, ServiceFieldRequirements>;
  progressiveConfig?: ProgressiveValidationConfig;
  accessibility: {
    announceErrors: boolean;
    groupRelatedErrors: boolean;
    provideCorrections: boolean;
    describePurpose: boolean;
  };
  realTimeValidation: boolean;
  validateOnMount: boolean;
  resetOnSubmit: boolean;
}

/**
 * Validation hook options
 */
export interface UseValidationOptions {
  context?: ValidationContext;
  config?: Partial<FormValidationConfig>;
  onValidationChange?: (state: FormValidationState) => void;
  onFieldValidation?: (field: string, result: ValidationResult) => void;
  debounce?: boolean;
  debounceMs?: number;
}

/**
 * Built-in validation types
 */
export type BuiltInValidationType = 
  | 'required'
  | 'email'
  | 'phone'
  | 'url'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'numeric'
  | 'alphanumeric'
  | 'noSpecialChars'
  | 'strongPassword'
  | 'confirmPassword'
  | 'serviceSpecific';

/**
 * Field validation configuration
 */
export interface FieldValidationConfig {
  type: BuiltInValidationType | string;
  options?: Record<string, unknown>;
  message?: string;
  when?: (context: ValidationContext) => boolean;
  severity?: ValidationSeverity;
}

/**
 * Service-specific validation patterns
 */
export const SERVICE_VALIDATION_PATTERNS = {
  teaching: {
    experience: /^(beginner|intermediate|advanced)$/i,
    lessonType: /^(trial|single|package)$/i,
    instrument: /^(guitar|bass|ukulele)$/i,
    goals: /^[a-zA-Z0-9\s,.-]{10,500}$/
  },
  performance: {
    eventType: /^(wedding|corporate|private|venue|festival)$/i,
    venue: /^[a-zA-Z0-9\s,.-]{2,100}$/,
    duration: /^([1-9]|[1-5][0-9]|60)$/,
    guestCount: /^([1-9]|[1-9][0-9]|[1-4][0-9]{2}|500)$/
  },
  collaboration: {
    projectType: /^(recording|composition|arrangement|session)$/i,
    genre: /^[a-zA-Z0-9\s,.-]{2,50}$/,
    timeline: /^(rush|standard|flexible)$/i,
    budget: /^(low|medium|high|enterprise)$/i
  }
} as const;

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: 'Please enter a valid format',
  numeric: 'Please enter numbers only',
  alphanumeric: 'Please use only letters and numbers',
  noSpecialChars: 'Special characters are not allowed',
  strongPassword: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  confirmPassword: 'Passwords do not match'
} as const;

