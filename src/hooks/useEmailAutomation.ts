/**
 * Simplified Email Automation Hook
 * Basic email automation for contact form submissions
 */

import { useState, useCallback } from 'react'

export interface ContactFormData {
  name: string
  email: string
  message: string
  serviceType: string
  priority?: string
  metadata?: Record<string, unknown>
}

export interface EmailAutomationResult {
  success: boolean
  error?: string
  sequenceId?: string | null
}

/**
 * Simplified email automation hook
 */
export function useEmailAutomation() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [lastResult, setLastResult] = useState<EmailAutomationResult | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  const initializeSequence = useCallback(
    async (formData: ContactFormData): Promise<EmailAutomationResult> => {
      setIsInitializing(true)
      setError(null)

      try {
        // For now, just log the automation trigger
        console.log('📧 Email sequence would be initialized:', {
          service: formData.serviceType,
          name: formData.name,
          email: formData.email,
          timestamp: new Date().toISOString(),
        })

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const result = {
          success: true,
          sequenceId: `seq_${Date.now()}`,
        }

        setLastResult(result)
        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize email sequence'
        setError(errorMessage)
        const result = { success: false, error: errorMessage }
        setLastResult(result)
        return result
      } finally {
        setIsInitializing(false)
      }
    },
    []
  )

  return {
    initializeSequence,
    isInitializing,
    isSuccess: lastResult?.success === true,
    error,
  }
}
