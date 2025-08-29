/**
 * Teaching Inquiry Form - Unified System Wrapper
 * 
 * This is now a lightweight wrapper around the unified form system.
 * All form logic has been consolidated into BaseInquiryForm with service-specific
 * configurations. This maintains backward compatibility while reducing duplication.
 */

import React from 'react'
import { BaseInquiryForm } from './BaseInquiryForm'
import { teachingFormConfig } from './formConfigurations'
import type { TeachingInquiryData, TeachingInquiryFormProps } from './types'

/**
 * Teaching Inquiry Form Component
 * @deprecated Use TeachingInquiryForm from @/components/forms instead
 */
export const TeachingInquiryForm: React.FC<TeachingInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<TeachingInquiryData>
      {...props}
      config={teachingFormConfig}
    />
  )
}

// Export types for backward compatibility
export type { TeachingInquiryData } from './types'

// Default export for backward compatibility
export default TeachingInquiryForm