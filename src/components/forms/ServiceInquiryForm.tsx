/**
 * Service-Specific Inquiry Form Components
 * Wrappers around BaseInquiryForm configured for each service type
 */
import React from 'react'
import { BaseInquiryForm } from './BaseInquiryForm'
import { formConfigurations } from './formConfigurations'
import {
  PerformanceInquiryData,
  CollaborationInquiryData,
  TeachingInquiryData,
  UniversalInquiryData,
  PerformanceInquiryFormProps,
  CollaborationInquiryFormProps,
  TeachingInquiryFormProps,
  UniversalInquiryFormProps,
} from './types'

/**
 * Performance Inquiry Form
 */
export const PerformanceInquiryForm: React.FC<PerformanceInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<PerformanceInquiryData>
      {...props}
      config={formConfigurations.performance}
    />
  )
}

/**
 * Collaboration Inquiry Form
 */
export const CollaborationInquiryForm: React.FC<CollaborationInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<CollaborationInquiryData>
      {...props}
      config={formConfigurations.collaboration}
    />
  )
}

/**
 * Teaching Inquiry Form
 */
export const TeachingInquiryForm: React.FC<TeachingInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<TeachingInquiryData>
      {...props}
      config={formConfigurations.teaching}
    />
  )
}

/**
 * Universal Inquiry Form
 */
export const UniversalInquiryForm: React.FC<UniversalInquiryFormProps> = (props) => {
  return (
    <BaseInquiryForm<UniversalInquiryData>
      {...props}
      config={formConfigurations.universal}
    />
  )
}

// Default exports for backward compatibility
export {
  PerformanceInquiryForm as default,
  PerformanceInquiryForm as PerformanceInquiry,
  CollaborationInquiryForm as CollaborationInquiry,
}