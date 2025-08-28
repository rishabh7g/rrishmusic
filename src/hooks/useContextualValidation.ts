/**
 * Contextual Validation Hook
 * Provides context-aware form validation with real-time feedback
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { ServiceType } from '@/types/content'
import {
  ValidationContext,
  ValidationResult,
  FormValidationState,
  UseValidationOptions,
  AccessibleValidationError,
} from '@/types/formValidation'
import {
  getServiceValidationRules,
  validateField,
  validateForm,
  getAccessibleValidationErrors,
  shouldValidateField,
  getFieldValidationPriority,
} from '@/utils/formValidation'

/**
 * Debounced validation function
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Contextual validation hook for form fields
 */
export function useContextualValidation(
  formData: Record<string, unknown>,
  serviceType: ServiceType,
  options: UseValidationOptions = {}
) {
  const {
    context = {},
    config = {},
    onValidationChange,
    onFieldValidation,
    debounce = true,
    debounceMs = 300,
  } = options

  // Validation state
  const [validationState, setValidationState] = useState<FormValidationState>({
    isValidating: false,
    isValid: true,
    hasErrors: false,
    hasWarnings: false,
    fieldResults: {},
    globalMessages: [],
    touchedFields: new Set<string>(),
    validationCount: 0,
  })

  // Progressive validation stage
  const [currentStage, setCurrentStage] = useState(0)

  // Debounced form data for real-time validation
  const debouncedFormData = useDebounce(formData, debounce ? debounceMs : 0)

  // Validation rules
  const validationRules = useMemo(() => {
    return getServiceValidationRules(serviceType, formData)
  }, [serviceType, formData])

  // Validation context with current state
  const validationContext = useMemo(
    (): ValidationContext => ({
      serviceType,
      formStep: currentStage,
      userJourneyStage: context.userJourneyStage || 'initial',
      fieldDependencies: formData,
      customRules: context.customRules,
    }),
    [serviceType, currentStage, context, formData]
  )

  // Progressive validation stages
  const progressiveStages = useMemo(() => {
    if (config.progressiveConfig?.stages) {
      return config.progressiveConfig.stages
    }

    // Default progressive stages based on service type
    const defaultStages = {
      teaching: [
        {
          name: 'contact',
          fields: ['name', 'email'],
          trigger: 'blur' as const,
        },
        {
          name: 'experience',
          fields: ['experience', 'goals'],
          trigger: 'change' as const,
        },
        {
          name: 'preferences',
          fields: ['instrument', 'preferredTime'],
          trigger: 'submit' as const,
        },
      ],
      performance: [
        {
          name: 'contact',
          fields: ['name', 'email'],
          trigger: 'blur' as const,
        },
        {
          name: 'event',
          fields: ['eventType', 'eventDate', 'venue'],
          trigger: 'change' as const,
        },
        {
          name: 'details',
          fields: ['duration', 'guestCount', 'specialRequests'],
          trigger: 'submit' as const,
        },
      ],
      collaboration: [
        {
          name: 'contact',
          fields: ['name', 'email'],
          trigger: 'blur' as const,
        },
        {
          name: 'project',
          fields: ['projectType', 'projectDescription'],
          trigger: 'change' as const,
        },
        {
          name: 'details',
          fields: ['genre', 'timeline', 'budget'],
          trigger: 'submit' as const,
        },
      ],
    }

    return defaultStages[serviceType]
  }, [serviceType, config.progressiveConfig?.stages])

  /**
   * Validate individual field with context awareness
   */
  const validateFieldWithContext = useCallback(
    (field: string, value: unknown, immediate = false): ValidationResult => {
      // Check if field should be validated at current stage
      if (
        !immediate &&
        !shouldValidateField(field, currentStage, progressiveStages)
      ) {
        return {
          field,
          isValid: true,
          severity: 'info',
          message: '',
          timestamp: Date.now(),
        }
      }

      const result = validateField(
        field,
        value,
        validationRules,
        validationContext
      )

      // Call field validation callback
      if (onFieldValidation) {
        onFieldValidation(field, result)
      }

      return result
    },
    [
      validationRules,
      validationContext,
      currentStage,
      progressiveStages,
      onFieldValidation,
    ]
  )

  /**
   * Validate all form fields
   */
  const validateAllFields = useCallback(
    (immediate = false) => {
      setValidationState(prev => ({
        ...prev,
        isValidating: true,
      }))

      const results = validateForm(
        debouncedFormData,
        serviceType,
        validationContext
      )

      // Filter results based on progressive validation
      const filteredResults: Record<string, ValidationResult> = {}
      Object.entries(results).forEach(([field, result]) => {
        if (
          immediate ||
          shouldValidateField(field, currentStage, progressiveStages)
        ) {
          filteredResults[field] = result
        }
      })

      const hasErrors = Object.values(filteredResults).some(
        r => !r.isValid && r.severity === 'error'
      )
      const hasWarnings = Object.values(filteredResults).some(
        r => !r.isValid && r.severity === 'warning'
      )
      const isValid = !hasErrors

      const newState: FormValidationState = {
        isValidating: false,
        isValid,
        hasErrors,
        hasWarnings,
        fieldResults: filteredResults,
        globalMessages: [],
        touchedFields: validationState.touchedFields,
        validationCount: validationState.validationCount + 1,
      }

      setValidationState(newState)

      if (onValidationChange) {
        onValidationChange(newState)
      }

      return newState
    },
    [
      debouncedFormData,
      serviceType,
      validationContext,
      currentStage,
      progressiveStages,
      validationState.touchedFields,
      validationState.validationCount,
      onValidationChange,
    ]
  )

  /**
   * Mark field as touched and validate
   */
  const touchField = useCallback(
    (field: string) => {
      setValidationState(prev => {
        const newTouchedFields = new Set(prev.touchedFields)
        newTouchedFields.add(field)

        return {
          ...prev,
          touchedFields: newTouchedFields,
        }
      })

      const result = validateFieldWithContext(field, formData[field])

      setValidationState(prev => ({
        ...prev,
        fieldResults: {
          ...prev.fieldResults,
          [field]: result,
        },
      }))
    },
    [formData, validateFieldWithContext]
  )

  /**
   * Validate single field on demand
   */
  const validateSingleField = useCallback(
    (field: string, value?: unknown) => {
      const fieldValue = value !== undefined ? value : formData[field]
      const result = validateFieldWithContext(field, fieldValue, true)

      setValidationState(prev => ({
        ...prev,
        fieldResults: {
          ...prev.fieldResults,
          [field]: result,
        },
        hasErrors: Object.values({
          ...prev.fieldResults,
          [field]: result,
        }).some(r => !r.isValid && r.severity === 'error'),
        hasWarnings: Object.values({
          ...prev.fieldResults,
          [field]: result,
        }).some(r => !r.isValid && r.severity === 'warning'),
        isValid: !Object.values({ ...prev.fieldResults, [field]: result }).some(
          r => !r.isValid && r.severity === 'error'
        ),
      }))

      return result
    },
    [formData, validateFieldWithContext]
  )

  /**
   * Clear validation for specific field
   */
  const clearFieldValidation = useCallback((field: string) => {
    setValidationState(prev => {
      const newFieldResults = { ...prev.fieldResults }
      delete newFieldResults[field]

      const newTouchedFields = new Set(prev.touchedFields)
      newTouchedFields.delete(field)

      return {
        ...prev,
        fieldResults: newFieldResults,
        touchedFields: newTouchedFields,
        hasErrors: Object.values(newFieldResults).some(
          r => !r.isValid && r.severity === 'error'
        ),
        hasWarnings: Object.values(newFieldResults).some(
          r => !r.isValid && r.severity === 'warning'
        ),
        isValid: !Object.values(newFieldResults).some(
          r => !r.isValid && r.severity === 'error'
        ),
      }
    })
  }, [])

  /**
   * Reset all validation
   */
  const resetValidation = useCallback(() => {
    setValidationState({
      isValidating: false,
      isValid: true,
      hasErrors: false,
      hasWarnings: false,
      fieldResults: {},
      globalMessages: [],
      touchedFields: new Set<string>(),
      validationCount: 0,
    })
  }, [])

  /**
   * Advance to next validation stage
   */
  const nextStage = useCallback(() => {
    if (currentStage < progressiveStages.length - 1) {
      setCurrentStage(prev => prev + 1)
    }
  }, [currentStage, progressiveStages.length])

  /**
   * Go back to previous validation stage
   */
  const previousStage = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1)
    }
  }, [currentStage])

  /**
   * Get accessible validation errors
   */
  const accessibleErrors = useMemo((): AccessibleValidationError[] => {
    return getAccessibleValidationErrors(
      validationState.fieldResults,
      serviceType
    )
  }, [validationState.fieldResults, serviceType])

  /**
   * Get field validation status
   */
  const getFieldStatus = useCallback(
    (field: string) => {
      const result = validationState.fieldResults[field]
      const isTouched = validationState.touchedFields.has(field)

      return {
        isValid: result?.isValid !== false,
        hasError: result?.isValid === false && result.severity === 'error',
        hasWarning: result?.isValid === false && result.severity === 'warning',
        message: result?.message || '',
        isTouched,
        shouldShow: isTouched || config.realTimeValidation,
        priority: getFieldValidationPriority(field, serviceType),
      }
    },
    [
      validationState.fieldResults,
      validationState.touchedFields,
      config.realTimeValidation,
      serviceType,
    ]
  )

  // Auto-validate on form data changes (if real-time validation enabled)
  useEffect(() => {
    if (
      config.realTimeValidation &&
      Object.keys(debouncedFormData).length > 0
    ) {
      validateAllFields()
    }
  }, [debouncedFormData, config.realTimeValidation, validateAllFields])

  // Validate on mount if configured
  useEffect(() => {
    if (config.validateOnMount && Object.keys(formData).length > 0) {
      validateAllFields(true)
    }
  }, [config.validateOnMount, formData, validateAllFields])

  return {
    // Validation state
    validationState,
    isValid: validationState.isValid,
    hasErrors: validationState.hasErrors,
    hasWarnings: validationState.hasWarnings,
    isValidating: validationState.isValidating,

    // Field operations
    validateField: validateSingleField,
    touchField,
    clearFieldValidation,
    getFieldStatus,

    // Form operations
    validateForm: () => validateAllFields(true),
    resetValidation,

    // Progressive validation
    currentStage,
    nextStage,
    previousStage,
    progressiveStages,

    // Accessibility
    accessibleErrors,

    // Utilities
    rules: validationRules,
    context: validationContext,
  }
}

export default useContextualValidation
