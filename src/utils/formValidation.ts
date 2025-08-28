/**
 * Context-Aware Form Validation Utilities
 * Comprehensive validation system that adapts to service context and user journey
 */

import { ServiceType } from '@/types/content'
import {
  ValidationRule,
  ValidationResult,
  ValidationContext,
  ServiceFieldRequirements,
  BuiltInValidationType,
  SERVICE_VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  AccessibleValidationError,
} from '@/types/formValidation'

/**
 * Built-in validation functions
 */
const BUILT_IN_VALIDATORS = {
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  },

  email: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value.trim())
  },

  phone: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    return phoneRegex.test(value.replace(/\s/g, ''))
  },

  url: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  minLength: (value: unknown, options: { min: number }): boolean => {
    if (!value || typeof value !== 'string') return false
    return value.length >= options.min
  },

  maxLength: (value: unknown, options: { max: number }): boolean => {
    if (!value || typeof value !== 'string') return true
    return value.length <= options.max
  },

  pattern: (value: unknown, options: { pattern: RegExp | string }): boolean => {
    if (!value || typeof value !== 'string') return false
    const regex =
      typeof options.pattern === 'string'
        ? new RegExp(options.pattern)
        : options.pattern
    return regex.test(value)
  },

  numeric: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    return /^\d+$/.test(value)
  },

  alphanumeric: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    return /^[a-zA-Z0-9]+$/.test(value)
  },

  noSpecialChars: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    return /^[a-zA-Z0-9\s]+$/.test(value)
  },

  strongPassword: (value: unknown): boolean => {
    if (!value || typeof value !== 'string') return false
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value)
  },

  confirmPassword: (
    value: unknown,
    options: { originalPassword: string }
  ): boolean => {
    return value === options.originalPassword
  },
}

/**
 * Service-specific field requirements configuration
 */
const SERVICE_FIELD_REQUIREMENTS: Record<
  ServiceType,
  ServiceFieldRequirements
> = {
  teaching: {
    required: ['name', 'email', 'experience', 'goals'],
    optional: ['phone', 'instrument', 'preferredTime', 'timezone'],
    conditional: {
      package: {
        condition: data => data.lessonType === 'package',
        fields: ['packageSize', 'startDate'],
      },
      trial: {
        condition: data => data.lessonType === 'trial',
        fields: ['availableDates'],
      },
    },
    serviceSpecific: {
      experience: {
        rules: [
          {
            id: 'teaching-experience',
            field: 'experience',
            validator: value =>
              BUILT_IN_VALIDATORS.pattern(value, {
                pattern: SERVICE_VALIDATION_PATTERNS.teaching.experience,
              }),
            message: 'Please select your experience level',
            severity: 'error',
          },
        ],
        guidance: 'Help us tailor lessons to your current skill level',
      },
      goals: {
        rules: [
          {
            id: 'teaching-goals',
            field: 'goals',
            validator: value =>
              BUILT_IN_VALIDATORS.pattern(value, {
                pattern: SERVICE_VALIDATION_PATTERNS.teaching.goals,
              }),
            message: 'Please describe your musical goals (10-500 characters)',
            severity: 'error',
          },
        ],
        guidance: 'Share what you hope to achieve through lessons',
      },
    },
  },

  performance: {
    required: ['name', 'email', 'eventType', 'eventDate', 'venue'],
    optional: ['phone', 'duration', 'guestCount', 'specialRequests', 'budget'],
    conditional: {
      wedding: {
        condition: data => data.eventType === 'wedding',
        fields: ['ceremonyMusic', 'receptionMusic', 'specialSongs'],
      },
      corporate: {
        condition: data => data.eventType === 'corporate',
        fields: ['companyName', 'eventTheme', 'audioRequirements'],
      },
    },
    serviceSpecific: {
      eventType: {
        rules: [
          {
            id: 'performance-eventType',
            field: 'eventType',
            validator: value =>
              BUILT_IN_VALIDATORS.pattern(value, {
                pattern: SERVICE_VALIDATION_PATTERNS.performance.eventType,
              }),
            message: 'Please select a valid event type',
            severity: 'error',
          },
        ],
        guidance: 'Select the type of event you need music for',
      },
      venue: {
        rules: [
          {
            id: 'performance-venue',
            field: 'venue',
            validator: value =>
              BUILT_IN_VALIDATORS.pattern(value, {
                pattern: SERVICE_VALIDATION_PATTERNS.performance.venue,
              }),
            message: 'Please provide venue information',
            severity: 'error',
          },
        ],
        guidance: 'Include venue name and location',
      },
    },
  },

  collaboration: {
    required: ['name', 'email', 'projectType', 'projectDescription'],
    optional: ['phone', 'genre', 'timeline', 'budget', 'referenceLinks'],
    conditional: {
      recording: {
        condition: data => data.projectType === 'recording',
        fields: ['trackCount', 'sessionType', 'deliverables'],
      },
      composition: {
        condition: data => data.projectType === 'composition',
        fields: ['compositionType', 'instrumentation', 'duration'],
      },
    },
    serviceSpecific: {
      projectType: {
        rules: [
          {
            id: 'collaboration-projectType',
            field: 'projectType',
            validator: value =>
              BUILT_IN_VALIDATORS.pattern(value, {
                pattern: SERVICE_VALIDATION_PATTERNS.collaboration.projectType,
              }),
            message: 'Please select a valid project type',
            severity: 'error',
          },
        ],
        guidance: 'Choose the type of collaboration you need',
      },
      projectDescription: {
        rules: [
          {
            id: 'collaboration-description',
            field: 'projectDescription',
            validator: value =>
              BUILT_IN_VALIDATORS.minLength(value, { min: 20 }),
            message:
              'Please provide a detailed project description (minimum 20 characters)',
            severity: 'error',
          },
        ],
        guidance: 'Describe your project vision and requirements',
      },
    },
  },
}

/**
 * Create validation rule from built-in type
 */
export function createValidationRule(
  field: string,
  type: BuiltInValidationType,
  options: Record<string, unknown> = {},
  context?: ValidationContext
): ValidationRule {
  const validator = BUILT_IN_VALIDATORS[type]
  const message = VALIDATION_MESSAGES[type]

  return {
    id: `${field}-${type}`,
    field,
    validator: value => {
      if (type === 'required' && context?.isRequired === false) return true
      return validator(value, options)
    },
    message: typeof message === 'function' ? message(options) : message,
    severity: 'error',
    when: context?.isRequired !== false ? undefined : () => true,
  }
}

/**
 * Get service-specific validation rules
 */
export function getServiceValidationRules(
  serviceType: ServiceType,
  formData: Record<string, unknown> = {}
): ValidationRule[] {
  const requirements = SERVICE_FIELD_REQUIREMENTS[serviceType]
  const rules: ValidationRule[] = []

  // Add required field validation
  requirements.required.forEach(field => {
    rules.push(
      createValidationRule(field, 'required', {}, { isRequired: true })
    )

    // Add field-specific validation if available
    if (requirements.serviceSpecific[field]) {
      rules.push(...requirements.serviceSpecific[field].rules)
    }
  })

  // Add conditional field validation
  Object.entries(requirements.conditional).forEach(([, condition]) => {
    if (condition.condition(formData)) {
      condition.fields.forEach(field => {
        rules.push(
          createValidationRule(field, 'required', {}, { isRequired: true })
        )
      })
    }
  })

  // Add common validation rules
  if (
    requirements.required.includes('email') ||
    requirements.optional.includes('email')
  ) {
    rules.push(createValidationRule('email', 'email'))
  }

  if (
    requirements.required.includes('phone') ||
    requirements.optional.includes('phone')
  ) {
    rules.push(createValidationRule('phone', 'phone'))
  }

  return rules
}

/**
 * Validate individual field
 */
export function validateField(
  field: string,
  value: unknown,
  rules: ValidationRule[],
  context?: ValidationContext
): ValidationResult {
  const fieldRules = rules.filter(
    rule => rule.field === field && (!rule.when || rule.when(context))
  )

  for (const rule of fieldRules) {
    const isValid = rule.validator(value, context)
    if (!isValid) {
      return {
        field,
        isValid: false,
        severity: rule.severity,
        message:
          typeof rule.message === 'function'
            ? rule.message(value, context)
            : rule.message,
        timestamp: Date.now(),
      }
    }
  }

  return {
    field,
    isValid: true,
    severity: 'info',
    message: '',
    timestamp: Date.now(),
  }
}

/**
 * Validate entire form
 */
export function validateForm(
  formData: Record<string, unknown>,
  serviceType: ServiceType,
  context?: ValidationContext
): Record<string, ValidationResult> {
  const rules = getServiceValidationRules(serviceType, formData)
  const results: Record<string, ValidationResult> = {}

  // Get all fields from form data and requirements
  const allFields = new Set([
    ...Object.keys(formData),
    ...SERVICE_FIELD_REQUIREMENTS[serviceType].required,
    ...SERVICE_FIELD_REQUIREMENTS[serviceType].optional,
  ])

  allFields.forEach(field => {
    results[field] = validateField(field, formData[field], rules, context)
  })

  return results
}

/**
 * Get accessible validation errors
 */
export function getAccessibleValidationErrors(
  results: Record<string, ValidationResult>,
  serviceType: ServiceType
): AccessibleValidationError[] {
  const errors: AccessibleValidationError[] = []
  const requirements = SERVICE_FIELD_REQUIREMENTS[serviceType]

  Object.entries(results).forEach(([field, result]) => {
    if (!result.isValid) {
      const fieldGuidance = requirements.serviceSpecific[field]?.guidance

      errors.push({
        field,
        id: `${field}-error`,
        message: result.message,
        severity: result.severity,
        ariaLabel: `${field} ${result.severity}: ${result.message}`,
        description: fieldGuidance,
        suggestions: getSuggestions(field, result, serviceType),
        relatedFields: getRelatedFields(field, requirements),
      })
    }
  })

  return errors
}

/**
 * Get validation suggestions for field
 */
function getSuggestions(
  field: string,
  result: ValidationResult,
  serviceType: ServiceType
): string[] {
  const suggestions: string[] = []

  if (field === 'email' && result.message.includes('valid email')) {
    suggestions.push('Use format: yourname@example.com')
  }

  if (field === 'phone' && result.message.includes('valid phone')) {
    suggestions.push(
      'Include area code',
      'Format: (555) 123-4567 or +1-555-123-4567'
    )
  }

  if (serviceType === 'teaching' && field === 'goals') {
    suggestions.push(
      'Example: "I want to learn acoustic guitar and play my favorite songs"'
    )
  }

  if (serviceType === 'performance' && field === 'venue') {
    suggestions.push(
      'Include venue name and city',
      'Example: "Central Park, New York"'
    )
  }

  return suggestions
}

/**
 * Get related fields for grouping errors
 */
function getRelatedFields(
  field: string,
  requirements: ServiceFieldRequirements
): string[] {
  const related: string[] = []

  // Check conditional relationships
  Object.entries(requirements.conditional).forEach(([, condition]) => {
    if (condition.fields.includes(field)) {
      related.push(...condition.fields.filter(f => f !== field))
    }
  })

  // Add common groupings
  if (['name', 'email', 'phone'].includes(field)) {
    related.push(...['name', 'email', 'phone'].filter(f => f !== field))
  }

  return related
}

/**
 * Progressive validation helper
 */
export function shouldValidateField(
  field: string,
  stage: number,
  progressiveStages: Array<{ name: string; fields: string[] }>
): boolean {
  if (stage >= progressiveStages.length) return true

  for (let i = 0; i <= stage; i++) {
    if (progressiveStages[i].fields.includes(field)) {
      return true
    }
  }

  return false
}

/**
 * Get field validation priority
 */
export function getFieldValidationPriority(
  field: string,
  serviceType: ServiceType
): number {
  const requirements = SERVICE_FIELD_REQUIREMENTS[serviceType]

  if (requirements.required.includes(field)) return 1
  if (requirements.optional.includes(field)) return 2

  // Check conditional fields
  for (const condition of Object.values(requirements.conditional)) {
    if (condition.fields.includes(field)) return 1.5
  }

  return 3
}

export default {
  BUILT_IN_VALIDATORS,
  SERVICE_FIELD_REQUIREMENTS,
  createValidationRule,
  getServiceValidationRules,
  validateField,
  validateForm,
  getAccessibleValidationErrors,
  shouldValidateField,
  getFieldValidationPriority,
}
