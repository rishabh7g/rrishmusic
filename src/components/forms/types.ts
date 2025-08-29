/**
 * Unified Form Types
 * Consolidated type definitions for all inquiry forms
 */

// Base shared fields across all forms
export interface BaseInquiryData {
  // Contact Information
  name: string
  email: string
  phone?: string
}

// Service-specific data interfaces
export interface PerformanceInquiryData extends BaseInquiryData {
  // Event Details
  eventType: 'wedding' | 'corporate' | 'venue' | 'private' | 'other'
  eventDate?: string
  eventTime?: string
  venueName?: string
  venueAddress?: string

  // Performance Requirements
  performanceFormat: 'solo' | 'band' | 'flexible' | 'unsure'
  performanceStyle: 'acoustic' | 'electric' | 'both' | 'unsure'
  duration: string
  guestCount?: string
  budgetRange: 'under-500' | '500-1000' | '1000-2000' | '2000-plus' | 'discuss'

  // Additional Information
  specialRequests?: string
  musicPreferences?: string
  hasVenueRestrictions: boolean
  venueRestrictions?: string

  // Marketing
  hearAboutUs?: 'google' | 'instagram' | 'referral' | 'venue' | 'other'
  hearAboutUsDetail?: string
}

export interface CollaborationInquiryData extends BaseInquiryData {
  // Project Details
  projectType: 'studio' | 'creative' | 'partnership' | 'other'
  projectTitle?: string
  creativeVision: string

  // Timeline and Scope
  timeline: 'urgent' | 'flexible' | 'specific-date' | 'ongoing'
  timelineDetails?: string
  projectScope: 'single-session' | 'short-term' | 'long-term' | 'ongoing'

  // Budget and Pricing
  budgetRange:
    | 'under-500'
    | '500-1000'
    | '1000-2500'
    | '2500-5000'
    | '5000-plus'
    | 'discuss'
  budgetNotes?: string

  // Additional Information
  experience: 'first-time' | 'some-experience' | 'experienced' | 'professional'
  additionalInfo?: string
  portfolioFiles?: FileList

  // Marketing
  hearAboutUs?: 'google' | 'instagram' | 'referral' | 'community' | 'other'
  hearAboutUsDetail?: string
}

export interface TeachingInquiryData extends BaseInquiryData {
  // Lesson Details
  packageType: 'single' | 'foundation' | 'transformation' | 'trial'
  experienceLevel:
    | 'complete-beginner'
    | 'some-basics'
    | 'intermediate'
    | 'advanced'
  musicalGoals: string

  // Schedule and Format
  lessonFormat: 'in-person' | 'online' | 'flexible'
  preferredSchedule:
    | 'weekday-mornings'
    | 'weekday-afternoons'
    | 'weekday-evenings'
    | 'weekends'
    | 'flexible'
  scheduleDetails?: string

  // Additional Information
  previousExperience?: string
  specificInterests?: string
  additionalInfo?: string

  // Communication Preferences
  preferredContact: 'email' | 'phone' | 'text' | 'whatsapp'
  bestTimeToCall?: string

  // Marketing
  hearAboutUs?: 'google' | 'instagram' | 'referral' | 'student' | 'other'
  hearAboutUsDetail?: string
}

export interface UniversalInquiryData extends BaseInquiryData {
  mobile: string
  inquiry: string
}

// Union type for all inquiry data
export type InquiryData = 
  | PerformanceInquiryData 
  | CollaborationInquiryData 
  | TeachingInquiryData 
  | UniversalInquiryData

// Service types
import { ServiceType as CoreServiceType } from "@/types/content"
export type ServiceType = CoreServiceType | "universal"

// Common form props interface
export interface BaseInquiryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InquiryData) => void
  className?: string
  initialData?: Partial<InquiryData>
}

// Service-specific form props
export interface PerformanceInquiryFormProps extends Omit<BaseInquiryFormProps, 'onSubmit'> {
  onSubmit: (data: PerformanceInquiryData) => void
  initialData?: Partial<PerformanceInquiryData>
}

export interface CollaborationInquiryFormProps extends Omit<BaseInquiryFormProps, 'onSubmit'> {
  onSubmit: (data: CollaborationInquiryData) => void
  initialData?: Partial<CollaborationInquiryData>
}

export interface TeachingInquiryFormProps extends Omit<BaseInquiryFormProps, 'onSubmit'> {
  onSubmit: (data: TeachingInquiryData) => void
  initialData?: Partial<TeachingInquiryData>
}

export interface UniversalInquiryFormProps extends Omit<BaseInquiryFormProps, 'onSubmit'> {
  onSubmit: (data: UniversalInquiryData) => void
  initialData?: Partial<UniversalInquiryData>
}

// Form validation types
export interface FormErrors<T> {
  [K in keyof T]?: string
}

export interface FormState<T> {
  data: T
  errors: FormErrors<T>
  isSubmitting: boolean
  isSubmitted: boolean
}