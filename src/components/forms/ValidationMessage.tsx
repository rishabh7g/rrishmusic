/**
 * Validation Message Component
 * Accessible validation feedback with context-aware messaging
 */

import React from 'react'
import { ServiceType } from '@/types/content'
import {
  ValidationResult,
  ValidationSeverity,
  AccessibleValidationError,
} from '@/types/formValidation'

/**
 * Props for ValidationMessage component
 */
interface ValidationMessageProps {
  field: string
  result?: ValidationResult
  error?: AccessibleValidationError
  serviceType?: ServiceType
  showIcon?: boolean
  showSuggestions?: boolean
  className?: string
  compact?: boolean
  position?: 'below' | 'inline' | 'tooltip'
  animate?: boolean
  announceToScreenReader?: boolean
}

/**
 * Props for ValidationSummary component
 */
interface ValidationSummaryProps {
  errors: AccessibleValidationError[]
  warnings?: ValidationResult[]
  serviceType: ServiceType
  title?: string
  className?: string
  collapsible?: boolean
  showFieldNames?: boolean
  groupByType?: boolean
}

/**
 * Validation icons based on severity
 */
const ValidationIcons = {
  error: (
    <svg
      className="w-4 h-4 text-red-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-4 h-4 text-yellow-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-4 h-4 text-blue-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
}

/**
 * Get severity-based styling classes
 */
function getSeverityClasses(severity: ValidationSeverity): string {
  const classes = {
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
  }

  return classes[severity]
}

/**
 * Format field name for display
 */
function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * ValidationMessage Component
 *
 * Displays validation feedback with accessibility features:
 * - ARIA labels and descriptions
 * - Screen reader announcements
 * - Context-aware suggestions
 * - Service-specific guidance
 */
export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  field,
  result,
  error,
  showIcon = true,
  showSuggestions = true,
  className = '',
  compact = false,
  position = 'below',
  animate = true,
  announceToScreenReader = true,
}) => {
  // Use error prop if provided, otherwise create from result
  const validationError =
    error ||
    (result && !result.isValid
      ? ({
          field,
          id: `${field}-error`,
          message: result.message,
          severity: result.severity,
          ariaLabel: `${formatFieldName(field)} ${result.severity}: ${result.message}`,
        } as AccessibleValidationError)
      : null)

  if (!validationError) {
    return null
  }

  const severityClasses = getSeverityClasses(validationError.severity)
  const icon = ValidationIcons[validationError.severity]

  const positionClasses = {
    below: 'mt-1',
    inline: 'ml-2',
    tooltip: 'absolute z-10 mt-1',
  }

  const baseClasses = `
    flex items-start gap-2 p-2 rounded-md border text-sm
    ${severityClasses}
    ${positionClasses[position]}
    ${compact ? 'p-1 text-xs' : ''}
    ${animate ? 'transition-all duration-200 ease-in-out' : ''}
    ${className}
  `.trim()

  return (
    <div
      id={validationError.id}
      className={baseClasses}
      role={validationError.severity === 'error' ? 'alert' : 'status'}
      aria-live={announceToScreenReader ? 'polite' : 'off'}
      aria-label={validationError.ariaLabel}
    >
      {/* Icon */}
      {showIcon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Main Message */}
        <p className="font-medium">{validationError.message}</p>

        {/* Description/Guidance */}
        {validationError.description && (
          <p className="mt-1 text-xs opacity-75">
            {validationError.description}
          </p>
        )}

        {/* Suggestions */}
        {showSuggestions &&
          validationError.suggestions &&
          validationError.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium opacity-75">Suggestions:</p>
              <ul className="mt-1 text-xs space-y-1 list-disc list-inside opacity-75">
                {validationError.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Related Fields */}
        {validationError.relatedFields &&
          validationError.relatedFields.length > 0 && (
            <p className="mt-1 text-xs opacity-60">
              Also check:{' '}
              {validationError.relatedFields.map(formatFieldName).join(', ')}
            </p>
          )}
      </div>
    </div>
  )
}

/**
 * ValidationSummary Component
 *
 * Displays a summary of all validation errors and warnings
 */
export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  warnings = [],
  title,
  className = '',
  collapsible = false,
  showFieldNames = true,
  groupByType = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  if (errors.length === 0 && warnings.length === 0) {
    return null
  }

  const errorCount = errors.length
  const warningCount = warnings.length

  const summaryTitle =
    title ||
    `Please fix ${errorCount} error${errorCount !== 1 ? 's' : ''}${
      warningCount > 0
        ? ` and ${warningCount} warning${warningCount !== 1 ? 's' : ''}`
        : ''
    }`

  const groupedErrors = groupByType
    ? {
        required: errors.filter(e =>
          e.message.toLowerCase().includes('required')
        ),
        format: errors.filter(
          e =>
            !e.message.toLowerCase().includes('required') &&
            (e.message.toLowerCase().includes('valid') ||
              e.message.toLowerCase().includes('format'))
        ),
        other: errors.filter(
          e =>
            !e.message.toLowerCase().includes('required') &&
            !e.message.toLowerCase().includes('valid') &&
            !e.message.toLowerCase().includes('format')
        ),
      }
    : { all: errors }

  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
      role="alert"
      aria-labelledby="validation-summary-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">{ValidationIcons.error}</div>
          <h3
            id="validation-summary-title"
            className="text-sm font-medium text-red-800"
          >
            {summaryTitle}
          </h3>
        </div>

        {collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-red-800 hover:text-red-900"
            aria-expanded={!isCollapsed}
            aria-controls="validation-summary-content"
          >
            <svg
              className={`w-4 h-4 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      {(!collapsible || !isCollapsed) && (
        <div id="validation-summary-content" className="mt-3">
          {Object.entries(groupedErrors).map(([groupName, groupErrors]) => (
            <div key={groupName}>
              {groupByType && groupName !== 'all' && groupErrors.length > 0 && (
                <h4 className="text-xs font-medium text-red-700 uppercase tracking-wide mb-2">
                  {groupName === 'required'
                    ? 'Required Fields'
                    : groupName === 'format'
                      ? 'Format Errors'
                      : 'Other Issues'}
                </h4>
              )}

              <ul className="space-y-2 text-sm text-red-700">
                {groupErrors.map(error => (
                  <li key={error.id} className="flex items-start gap-2">
                    <span className="block w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      {showFieldNames && (
                        <span className="font-medium">
                          {formatFieldName(error.field)}:
                        </span>
                      )}{' '}
                      {error.message}
                      {error.suggestions && error.suggestions.length > 0 && (
                        <div className="mt-1 text-xs text-red-600">
                          Try: {error.suggestions[0]}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mt-4 pt-3 border-t border-red-200">
              <h4 className="text-xs font-medium text-yellow-700 uppercase tracking-wide mb-2">
                Warnings
              </h4>
              <ul className="space-y-1 text-sm text-yellow-700">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="block w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      {showFieldNames && (
                        <span className="font-medium">
                          {formatFieldName(warning.field)}:
                        </span>
                      )}{' '}
                      {warning.message}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * FieldValidationWrapper Component
 *
 * Wraps form fields with validation feedback
 */
export const FieldValidationWrapper: React.FC<{
  field: string
  children: React.ReactNode
  validation: {
    isValid: boolean
    hasError: boolean
    hasWarning: boolean
    message: string
    shouldShow: boolean
  }
  error?: AccessibleValidationError
  serviceType?: ServiceType
  showMessage?: boolean
  className?: string
}> = ({
  field,
  children,
  validation,
  error,
  serviceType,
  showMessage = true,
  className = '',
}) => {
  const fieldId = `field-${field}`
  const errorId = `${field}-error`
  const descriptionId = `${field}-description`

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Field with accessibility attributes */}
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-invalid': validation.hasError,
          'aria-describedby':
            [
              validation.shouldShow && validation.hasError ? errorId : '',
              error?.description ? descriptionId : '',
            ]
              .filter(Boolean)
              .join(' ') || undefined,
        })}
      </div>

      {/* Validation message */}
      {showMessage && validation.shouldShow && !validation.isValid && (
        <ValidationMessage
          field={field}
          result={{
            field,
            isValid: validation.isValid,
            severity: validation.hasError ? 'error' : 'warning',
            message: validation.message,
            timestamp: Date.now(),
          }}
          error={error}
          serviceType={serviceType}
        />
      )}

      {/* Field description for accessibility */}
      {error?.description && (
        <p id={descriptionId} className="text-xs theme-text-muted">
          {error.description}
        </p>
      )}
    </div>
  )
}

export default ValidationMessage
