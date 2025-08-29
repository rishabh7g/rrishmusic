/**
 * Performance Inquiry Form - Unified System Wrapper
 * 
 * This is now a lightweight wrapper around the unified form system.
 * All form logic has been consolidated into BaseInquiryForm with service-specific
 * configurations. This maintains backward compatibility while reducing duplication.
 */

import React from 'react'
import { BaseInquiryForm } from './BaseInquiryForm'
import { performanceFormConfig } from './formConfigurations'
import type { PerformanceInquiryData, PerformanceInquiryFormProps } from './types'

/**
 * Performance Inquiry Form Component
 * @deprecated Use PerformanceInquiryForm from @/components/forms instead
 */
export const PerformanceInquiryForm: React.FC<PerformanceInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<PerformanceInquiryData>
      {...props}
      config={performanceFormConfig}
    />
  )
}

// Export types for backward compatibility
export type { PerformanceInquiryData } from './types'

// Default export for backward compatibility
export default PerformanceInquiryForm