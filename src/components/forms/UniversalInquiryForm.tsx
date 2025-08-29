/**
 * Universal Inquiry Form - Unified System Wrapper
 * 
 * This is now a lightweight wrapper around the unified form system.
 * All form logic has been consolidated into BaseInquiryForm with service-specific
 * configurations. This maintains backward compatibility while reducing duplication.
 */

import React from 'react'
import { BaseInquiryForm } from './BaseInquiryForm'
import { universalFormConfig } from './formConfigurations'
import type { UniversalInquiryData, UniversalInquiryFormProps } from './types'

/**
 * Universal Inquiry Form Component
 * @deprecated Use UniversalInquiryForm from @/components/forms instead
 */
export const UniversalInquiryForm: React.FC<UniversalInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<UniversalInquiryData>
      {...props}
      config={universalFormConfig}
    />
  )
}

// Export types for backward compatibility
export type { UniversalInquiryData } from './types'

// Default export for backward compatibility
export default UniversalInquiryForm