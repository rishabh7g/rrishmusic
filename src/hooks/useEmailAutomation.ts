/**
 * Email Automation Hook - React integration for follow-up sequences
 *
 * Provides easy integration of email automation service with React components,
 * particularly contact forms and service-specific inquiries.
 */

import { useState, useCallback, useEffect } from 'react'
import {
  emailAutomationService,
  type ContactFormData,
  type EmailAutomationResult,
  type ServiceType,
  type EmailTemplateType,
  type EmailTemplate,
} from '@/services/emailAutomation'

/**
 * Email automation hook state
 */
interface EmailAutomationState {
  isInitializing: boolean
  lastResult: EmailAutomationResult | null
  error: string | null
  systemStatus: {
    enabled: boolean
    debugMode: boolean
    templatesCount: number
  }
}

/**
 * Sequence metadata for debug tracking
 */
interface SequenceMetadata {
  sequenceId: string
  serviceType: ServiceType
  customerEmail: string
  customerName: string
  startTime: number
  totalDuration: number
  status: string
  emailsScheduled: number
  emailsSent: number
}

/**
 * Scheduled email data for debug tracking
 */
interface ScheduledEmailData {
  to: string
  subject: string
  sendTime: number
  templateType: EmailTemplateType
  sequenceId: string
  metadata: {
    serviceType: ServiceType
    originalSubmissionTime: number
    customerName: string
  }
  status: string
  createdAt: number
}

/**
 * Hook for email automation integration
 */
export function useEmailAutomation() {
  const [state, setState] = useState<EmailAutomationState>({
    isInitializing: false,
    lastResult: null,
    error: null,
    systemStatus: emailAutomationService.getStatus(),
  })

  /**
   * Initialize follow-up sequence for contact form submission
   */
  const initializeSequence = useCallback(
    async (formData: ContactFormData): Promise<EmailAutomationResult> => {
      setState(prev => ({ ...prev, isInitializing: true, error: null }))

      try {
        const result =
          await emailAutomationService.initializeFollowUpSequence(formData)

        setState(prev => ({
          ...prev,
          isInitializing: false,
          lastResult: result,
          error: result.success ? null : result.error || 'Unknown error',
        }))

        return result
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to initialize sequence'

        setState(prev => ({
          ...prev,
          isInitializing: false,
          error: errorMessage,
          lastResult: { success: false, error: errorMessage },
        }))

        return { success: false, error: errorMessage }
      }
    },
    []
  )

  /**
   * Cancel an active email sequence
   */
  const cancelSequence = useCallback(
    async (sequenceId: string, reason?: string): Promise<boolean> => {
      try {
        const success = await emailAutomationService.cancelSequence(
          sequenceId,
          reason
        )

        if (!success) {
          setState(prev => ({
            ...prev,
            error: 'Failed to cancel email sequence',
          }))
        }

        return success
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to cancel sequence'
        setState(prev => ({ ...prev, error: errorMessage }))
        return false
      }
    },
    []
  )

  /**
   * Preview email template
   */
  const previewTemplate = useCallback(
    (
      serviceType: ServiceType,
      templateType: EmailTemplateType,
      sampleData?: Partial<ContactFormData>
    ): EmailTemplate | null => {
      return emailAutomationService.previewEmail(
        serviceType,
        templateType,
        sampleData
      )
    },
    []
  )

  /**
   * Get available templates for a service type
   */
  const getTemplates = useCallback((serviceType: ServiceType) => {
    return emailAutomationService.getSequenceTemplates(serviceType)
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState({
      isInitializing: false,
      lastResult: null,
      error: null,
      systemStatus: emailAutomationService.getStatus(),
    })
  }, [])

  /**
   * Enable/disable automation system
   */
  const setEnabled = useCallback((enabled: boolean) => {
    emailAutomationService.setEnabled(enabled)
    setState(prev => ({
      ...prev,
      systemStatus: emailAutomationService.getStatus(),
    }))
  }, [])

  /**
   * Update system status on mount
   */
  useEffect(() => {
    setState(prev => ({
      ...prev,
      systemStatus: emailAutomationService.getStatus(),
    }))
  }, [])

  return {
    // State
    isInitializing: state.isInitializing,
    lastResult: state.lastResult,
    error: state.error,
    systemStatus: state.systemStatus,

    // Actions
    initializeSequence,
    cancelSequence,
    previewTemplate,
    getTemplates,
    clearError,
    reset,
    setEnabled,

    // Computed values
    isEnabled: state.systemStatus.enabled,
    isSuccess: state.lastResult?.success === true,
    hasError: !!state.error,
    scheduledEmails: state.lastResult?.scheduledEmails || 0,
    sequenceId: state.lastResult?.sequenceId || null,
  }
}

/**
 * Hook for debugging email automation in development
 */
export function useEmailAutomationDebug() {
  const [debugData, setDebugData] = useState<{
    sequences: SequenceMetadata[]
    scheduledEmails: ScheduledEmailData[]
  }>({
    sequences: [],
    scheduledEmails: [],
  })

  /**
   * Load debug data from localStorage
   */
  const loadDebugData = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const sequences = JSON.parse(
        localStorage.getItem('email_sequences') || '[]'
      ) as SequenceMetadata[]
      const scheduledEmails = JSON.parse(
        localStorage.getItem('scheduled_emails') || '[]'
      ) as ScheduledEmailData[]

      setDebugData({ sequences, scheduledEmails })
    } catch (error) {
      console.error('Failed to load debug data:', error)
    }
  }, [])

  /**
   * Clear debug data
   */
  const clearDebugData = useCallback(() => {
    if (typeof window === 'undefined') return

    localStorage.removeItem('email_sequences')
    localStorage.removeItem('scheduled_emails')
    setDebugData({ sequences: [], scheduledEmails: [] })
  }, [])

  /**
   * Get debug statistics
   */
  const getDebugStats = useCallback(() => {
    return {
      totalSequences: debugData.sequences.length,
      activeSequences: debugData.sequences.filter(
        seq => seq.status === 'active'
      ).length,
      totalScheduledEmails: debugData.scheduledEmails.length,
      emailsByService: debugData.scheduledEmails.reduce(
        (acc, email) => {
          const service = email.metadata?.serviceType || 'unknown'
          acc[service] = (acc[service] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ),
    }
  }, [debugData])

  /**
   * Load debug data on mount and set up refresh interval
   */
  useEffect(() => {
    loadDebugData()

    // Refresh debug data every 5 seconds in development
    const interval = setInterval(loadDebugData, 5000)

    return () => clearInterval(interval)
  }, [loadDebugData])

  return {
    debugData,
    debugStats: getDebugStats(),
    loadDebugData,
    clearDebugData,
    isDebugMode: process.env.NODE_ENV === 'development',
  }
}

/**
 * Utility hook for form integration
 */
export function useContactFormAutomation(serviceType: ServiceType) {
  const { initializeSequence, isInitializing, error, isSuccess, clearError } =
    useEmailAutomation()

  /**
   * Handle form submission with automatic email sequence initialization
   */
  const handleFormSubmission = useCallback(
    async (formData: Omit<ContactFormData, 'serviceType'>) => {
      const fullFormData: ContactFormData = {
        ...formData,
        serviceType,
      }

      const result = await initializeSequence(fullFormData)

      if (result.success) {
        console.log(
          `Email sequence initiated for ${serviceType} inquiry from ${formData.name}`
        )
      }

      return result
    },
    [initializeSequence, serviceType]
  )

  return {
    handleFormSubmission,
    isInitializing,
    error,
    isSuccess,
    clearError,
    serviceType,
    scheduledEmails: 0, // Will be updated after successful submission
  }
}

export default useEmailAutomation
