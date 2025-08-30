/**
 * Base Inquiry Form Component
 * Unified form logic and UI that can be configured for different services
 */
import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { ValidationMessage } from './ValidationMessage'
import {
  FormConfig,
  FieldConfig,
  InquiryData,
  FormErrors,
  FormState,
} from './types'

interface BaseInquiryFormProps<T extends InquiryData> {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: T) => void
  config: FormConfig
  initialData?: Partial<T>
  className?: string
}

export function BaseInquiryForm<T extends InquiryData>({
  isOpen,
  onClose,
  onSubmit,
  config,
  initialData = {},
  className = '',
}: BaseInquiryFormProps<T>) {
  // Initialize form state with config defaults
  const getInitialFormData = useCallback((): T => {
    const data: any = { ...initialData }

    // Set default values based on field configuration
    config.fields.forEach(field => {
      if (data[field.name] === undefined) {
        switch (field.type) {
          case 'checkbox':
            data[field.name] = false
            break
          case 'text':
          case 'email':
          case 'tel':
          case 'textarea':
          case 'date':
          case 'time':
            data[field.name] = ''
            break
          case 'select':
          case 'radio':
            data[field.name] = field.required ? '' : undefined
            break
          default:
            data[field.name] = field.required ? '' : undefined
        }
      }
    })

    return data as T
  }, [config.fields, initialData])

  const [formState, setFormState] = useState<FormState<T>>({
    data: getInitialFormData(),
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
  })

  // Reset form when opened/closed
  useEffect(() => {
    if (isOpen) {
      setFormState({
        data: getInitialFormData(),
        errors: {},
        isSubmitting: false,
        isSubmitted: false,
      })
    }
  }, [isOpen, getInitialFormData])

  // Handle field changes
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: undefined }, // Clear error when field changes
    }))
  }, [])

  // Validate a single field
  const validateField = useCallback(
    (field: FieldConfig, value: any): string | null => {
      // Required validation
      if (
        field.required &&
        (!value || (typeof value === 'string' && !value.trim()))
      ) {
        return `${field.label} is required`
      }

      // Skip further validation if field is empty and not required
      if (!value || (typeof value === 'string' && !value.trim())) {
        return null
      }

      // Type-specific validation
      if (field.validation) {
        const { minLength, maxLength, pattern, custom } = field.validation

        if (
          minLength &&
          typeof value === 'string' &&
          value.length < minLength
        ) {
          return `${field.label} must be at least ${minLength} characters`
        }

        if (
          maxLength &&
          typeof value === 'string' &&
          value.length > maxLength
        ) {
          return `${field.label} must not exceed ${maxLength} characters`
        }

        if (pattern && typeof value === 'string' && !pattern.test(value)) {
          if (field.type === 'email') {
            return 'Please enter a valid email address'
          }
          return `${field.label} format is invalid`
        }

        if (custom) {
          const customError = custom(value)
          if (customError) return customError
        }
      }

      return null
    },
    []
  )

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors<T> = {}
    let isValid = true

    config.fields.forEach(field => {
      // Check if field should be shown (conditional logic)
      if (field.conditional) {
        const dependentValue = (formState.data as any)[
          field.conditional.dependsOn
        ]
        if (!field.conditional.showWhen(dependentValue)) {
          return // Skip validation for hidden fields
        }
      }

      const value = (formState.data as any)[field.name]
      const error = validateField(field, value)

      if (error) {
        ;(errors as any)[field.name] = error
        isValid = false
      }
    })

    setFormState(prev => ({ ...prev, errors }))
    return isValid
  }, [config.fields, formState.data, validateField])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (formState.isSubmitting) return

      const isValid = validateForm()
      if (!isValid) return

      setFormState(prev => ({ ...prev, isSubmitting: true }))

      try {
        await onSubmit(formState.data)
        setFormState(prev => ({
          ...prev,
          isSubmitted: true,
          isSubmitting: false,
        }))
      } catch (error) {
        console.error('Form submission error:', error)
        setFormState(prev => ({ ...prev, isSubmitting: false }))
        // Could add error handling here
      }
    },
    [formState.data, formState.isSubmitting, validateForm, onSubmit]
  )

  // Handle modal close with escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Render field based on configuration
  const renderField = useCallback(
    (field: FieldConfig) => {
      // Check conditional rendering
      if (field.conditional) {
        const dependentValue = (formState.data as any)[
          field.conditional.dependsOn
        ]
        if (!field.conditional.showWhen(dependentValue)) {
          return null
        }
      }

      const value = (formState.data as any)[field.name] || ''
      const error = (formState.errors as any)[field.name]
      const fieldId = `${config.serviceType}-${field.name}`

      const commonProps = {
        id: fieldId,
        name: field.name,
        value: field.type === 'checkbox' ? undefined : value,
        checked: field.type === 'checkbox' ? value : undefined,
        onChange: (
          e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >
        ) => {
          const newValue =
            field.type === 'checkbox'
              ? (e.target as HTMLInputElement).checked
              : e.target.value
          handleFieldChange(field.name, newValue)
        },
        className: `w-full px-4 py-3 border rounded-lg bg-theme-bg theme-text placeholder:text-theme-text-muted focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-colors ${
          error ? 'border-red-500' : 'border-theme-border'
        } ${field.className || ''}`,
        placeholder: field.placeholder,
        required: field.required,
        'aria-describedby': error
          ? `${fieldId}-error`
          : field.helpText
            ? `${fieldId}-help`
            : undefined,
        'aria-invalid': error ? 'true' : undefined,
      }

      let fieldElement: React.ReactNode

      switch (field.type) {
        case 'textarea':
          fieldElement = <textarea {...commonProps} rows={4} />
          break

        case 'select':
          fieldElement = (
            <select {...commonProps}>
              <option value="">
                {field.required
                  ? `Select ${field.label}`
                  : `Select ${field.label} (Optional)`}
              </option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
          break

        case 'radio':
          fieldElement = (
            <div className="space-y-3">
              {field.options?.map(option => (
                <label
                  key={option.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={e =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    className="mt-1 h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme-border"
                    aria-describedby={error ? `${fieldId}-error` : undefined}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium theme-text">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm theme-text-muted mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )
          break

        case 'checkbox':
          fieldElement = (
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...commonProps}
                className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme-border rounded"
              />
              <span className="text-sm theme-text">{field.label}</span>
            </label>
          )
          break

        case 'file':
          fieldElement = (
            <input
              type="file"
              {...commonProps}
              className="w-full px-4 py-3 border border-theme-border rounded-lg bg-theme-bg theme-text placeholder:text-theme-text-muted focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme-bg-secondary file:text-theme-primary hover:file:bg-theme-bg-tertiary"
              onChange={e => {
                const files = (e.target as HTMLInputElement).files
                handleFieldChange(field.name, files)
              }}
            />
          )
          break

        default: // text, email, tel, date, time
          fieldElement = <input type={field.type} {...commonProps} />
      }

      return (
        <motion.div key={field.name} variants={fadeInUp} className="space-y-2">
          {field.type !== 'checkbox' && (
            <label
              htmlFor={fieldId}
              className="block text-sm font-medium theme-text-secondary"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {fieldElement}

          {field.helpText && !error && (
            <p id={`${fieldId}-help`} className="text-sm theme-text-muted">
              {field.helpText}
            </p>
          )}

          {error && (
            <ValidationMessage
              field={field.name}
              error={{
                field: field.name,
                message: error,
                severity: 'error',
              }}
              serviceType={config.serviceType}
              className="mt-1"
            />
          )}
        </motion.div>
      )
    },
    [formState.data, formState.errors, config.serviceType, handleFieldChange]
  )

  // Group fields by section
  const fieldsBySection = React.useMemo(() => {
    const grouped: { [sectionName: string]: FieldConfig[] } = {}

    config.fields.forEach(field => {
      if (!grouped[field.section]) {
        grouped[field.section] = []
      }
      grouped[field.section].push(field)
    })

    // Sort fields within each section by order
    Object.keys(grouped).forEach(section => {
      grouped[section].sort((a, b) => a.order - b.order)
    })

    return grouped
  }, [config.fields])

  if (!isOpen) return null

  if (formState.isSubmitted) {
    return (
      <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-theme-bg rounded-xl shadow-xl p-8 w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold theme-text mb-2">Thank You!</h3>
            <p className="theme-text-secondary mb-6">{config.successMessage}</p>
            <button
              onClick={onClose}
              className="w-full bg-theme-primary text-white px-6 py-3 rounded-lg hover:bg-theme-primary-hover transition-colors font-medium"
            >
              Close
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-theme-bg rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-theme-bg border-b border-theme-border px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold theme-text">
                  {config.title}
                </h2>
                <p className="theme-text-secondary mt-1">
                  {config.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-theme-bg-secondary rounded-full transition-colors theme-text"
                aria-label="Close form"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {config.sections
                .sort((a, b) => a.order - b.order)
                .map(section => {
                  const sectionFields = fieldsBySection[section.name] || []
                  if (sectionFields.length === 0) return null

                  return (
                    <motion.div
                      key={section.name}
                      variants={fadeInUp}
                      className="space-y-4"
                    >
                      <div className="border-b border-theme-border pb-2">
                        <h3 className="text-lg font-semibold theme-text">
                          {section.title}
                        </h3>
                        {section.description && (
                          <p className="text-sm theme-text-secondary mt-1">
                            {section.description}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4">
                        {sectionFields.map(renderField)}
                      </div>
                    </motion.div>
                  )
                })}
            </motion.div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-theme-bg border-t border-theme-border pt-6 mt-8 -mx-6 px-6 pb-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-theme-border rounded-lg theme-text-secondary hover:bg-theme-bg-secondary transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="px-6 py-3 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[140px]"
                >
                  {formState.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    config.submitText
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
