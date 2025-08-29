/**
 * Collaboration Inquiry Form - Unified System Wrapper
 *
 * This is now a lightweight wrapper around the unified form system.
 * All form logic has been consolidated into BaseInquiryForm with service-specific
 * configurations. This maintains backward compatibility while reducing duplication.
 */

import React from 'react'
import { BaseInquiryForm } from './BaseInquiryForm'
import { collaborationFormConfig } from './formConfigurations'
import type {
  CollaborationInquiryData,
  CollaborationInquiryFormProps,
} from './types'

/**
 * Collaboration Inquiry Form Component
 * @deprecated Use CollaborationInquiryForm from @/components/forms instead
 */
export const CollaborationInquiryForm: React.FC<
  CollaborationInquiryFormProps
> = props => {
  return (
    <BaseInquiryForm<CollaborationInquiryData>
      {...props}
      config={collaborationFormConfig}
    />
  )
}

// Export types for backward compatibility
export type { CollaborationInquiryData } from './types'

// Default export for backward compatibility
export default CollaborationInquiryForm
