/**
 * Form Configuration System
 * Service-specific configurations for unified form rendering
 */
import { ServiceType } from './types'

// Field configuration interface
export interface FieldConfig {
  name: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'file'
    | 'date'
    | 'time'
  required: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string; description?: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null
  }
  conditional?: {
    dependsOn: string
    showWhen: (value: any) => boolean
  }
  description?: string
  helpText?: string
  section: string
  order: number
  className?: string
}

// Section configuration
export interface SectionConfig {
  name: string
  title: string
  description?: string
  order: number
  collapsible?: boolean
  isExpanded?: boolean
}

// Form configuration
export interface FormConfig {
  serviceType: ServiceType
  title: string
  description: string
  sections: SectionConfig[]
  fields: FieldConfig[]
  submitText: string
  successMessage: string
}

// Common field groups
const contactFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name',
    section: 'contact',
    order: 1,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'Enter your email address',
    section: 'contact',
    order: 2,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: false,
    placeholder: 'Enter your phone number (optional)',
    section: 'contact',
    order: 3,
    helpText: 'We may call to discuss your inquiry in detail',
  },
]

const marketingFields: FieldConfig[] = [
  {
    name: 'hearAboutUs',
    label: 'How did you hear about us?',
    type: 'select',
    required: false,
    section: 'marketing',
    order: 1,
    options: [
      { value: 'google', label: 'Google Search' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'referral', label: 'Friend/Family Referral' },
      { value: 'venue', label: 'Venue Recommendation' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    name: 'hearAboutUsDetail',
    label: 'Please provide details',
    type: 'text',
    required: false,
    placeholder: 'Tell us more...',
    section: 'marketing',
    order: 2,
    conditional: {
      dependsOn: 'hearAboutUs',
      showWhen: value => ['other', 'referral', 'venue'].includes(value),
    },
  },
]

// Performance form configuration
export const performanceFormConfig: FormConfig = {
  serviceType: 'performance',
  title: 'Performance Inquiry',
  description:
    "Tell us about your event and we'll create the perfect musical experience",
  submitText: 'Submit Performance Inquiry',
  successMessage:
    "Thank you for your performance inquiry! We'll get back to you within 24 hours.",
  sections: [
    { name: 'contact', title: 'Contact Information', order: 1 },
    { name: 'event', title: 'Event Details', order: 2 },
    { name: 'requirements', title: 'Performance Requirements', order: 3 },
    { name: 'additional', title: 'Additional Information', order: 4 },
    { name: 'marketing', title: 'How You Found Us', order: 5 },
  ],
  fields: [
    ...contactFields,
    // Event Details
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      required: true,
      section: 'event',
      order: 1,
      options: [
        {
          value: 'wedding',
          label: 'Wedding',
          description: 'Ceremonies, receptions, and celebrations',
        },
        {
          value: 'corporate',
          label: 'Corporate Event',
          description: 'Company parties, conferences, networking',
        },
        {
          value: 'venue',
          label: 'Venue Performance',
          description: 'Restaurants, bars, hotels',
        },
        {
          value: 'private',
          label: 'Private Party',
          description: 'Birthdays, anniversaries, gatherings',
        },
        {
          value: 'other',
          label: 'Other Event',
          description: 'Tell us about your unique event',
        },
      ],
    },
    {
      name: 'eventDate',
      label: 'Event Date',
      type: 'date',
      required: false,
      section: 'event',
      order: 2,
      helpText: 'If you have a specific date in mind',
    },
    {
      name: 'eventTime',
      label: 'Event Time',
      type: 'time',
      required: false,
      section: 'event',
      order: 3,
      helpText: 'Approximate start time for the performance',
    },
    {
      name: 'venueName',
      label: 'Venue Name',
      type: 'text',
      required: false,
      placeholder: 'Name of the venue',
      section: 'event',
      order: 4,
    },
    {
      name: 'venueAddress',
      label: 'Venue Address',
      type: 'text',
      required: false,
      placeholder: 'Venue location',
      section: 'event',
      order: 5,
    },
    // Performance Requirements
    {
      name: 'performanceFormat',
      label: 'Performance Format',
      type: 'radio',
      required: true,
      section: 'requirements',
      order: 1,
      options: [
        {
          value: 'solo',
          label: 'Solo Performance',
          description: 'Just me and my guitar',
        },
        {
          value: 'band',
          label: 'Band Performance',
          description: 'Full band setup',
        },
        {
          value: 'flexible',
          label: 'Either Works',
          description: "I'm flexible on format",
        },
        {
          value: 'unsure',
          label: 'Not Sure Yet',
          description: 'Help me decide what works best',
        },
      ],
    },
    {
      name: 'performanceStyle',
      label: 'Performance Style',
      type: 'radio',
      required: true,
      section: 'requirements',
      order: 2,
      options: [
        {
          value: 'acoustic',
          label: 'Acoustic',
          description: 'Intimate, unplugged sound',
        },
        {
          value: 'electric',
          label: 'Electric',
          description: 'Full amplified sound',
        },
        {
          value: 'both',
          label: 'Mix of Both',
          description: 'Variety throughout the event',
        },
        {
          value: 'unsure',
          label: 'Not Sure',
          description: 'Help me choose what fits',
        },
      ],
    },
    {
      name: 'duration',
      label: 'Performance Duration',
      type: 'text',
      required: true,
      placeholder: 'e.g., 2 hours, 3 sets of 45 minutes',
      section: 'requirements',
      order: 3,
      helpText: 'How long would you like the performance to last?',
    },
    {
      name: 'guestCount',
      label: 'Expected Guest Count',
      type: 'text',
      required: false,
      placeholder: 'Approximate number of guests',
      section: 'requirements',
      order: 4,
    },
    {
      name: 'budgetRange',
      label: 'Budget Range',
      type: 'select',
      required: true,
      section: 'requirements',
      order: 5,
      options: [
        { value: 'under-500', label: 'Under $500' },
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-2000', label: '$1,000 - $2,000' },
        { value: '2000-plus', label: '$2,000+' },
        { value: 'discuss', label: "Let's Discuss" },
      ],
    },
    // Additional Information
    {
      name: 'specialRequests',
      label: 'Special Requests',
      type: 'textarea',
      required: false,
      placeholder:
        "Any specific songs, arrangements, or special moments you'd like included?",
      section: 'additional',
      order: 1,
    },
    {
      name: 'musicPreferences',
      label: 'Music Preferences',
      type: 'textarea',
      required: false,
      placeholder:
        'What style of music fits your event? Any favorite artists or genres?',
      section: 'additional',
      order: 2,
    },
    {
      name: 'hasVenueRestrictions',
      label: 'Are there any venue restrictions we should know about?',
      type: 'radio',
      required: true,
      section: 'additional',
      order: 3,
      options: [
        { value: 'true', label: 'Yes, there are restrictions' },
        { value: 'false', label: 'No restrictions' },
      ],
    },
    {
      name: 'venueRestrictions',
      label: 'Venue Restrictions Details',
      type: 'textarea',
      required: false,
      placeholder:
        'Please describe any sound limits, setup restrictions, or other venue requirements',
      section: 'additional',
      order: 4,
      conditional: {
        dependsOn: 'hasVenueRestrictions',
        showWhen: value => value === 'true' || value === true,
      },
    },
    ...marketingFields,
  ],
}

// Collaboration form configuration
export const collaborationFormConfig: FormConfig = {
  serviceType: 'collaboration',
  title: 'Collaboration Inquiry',
  description: "Let's explore how we can create something amazing together",
  submitText: 'Submit Collaboration Inquiry',
  successMessage:
    "Thank you for your collaboration inquiry! We'll get back to you within 24 hours.",
  sections: [
    { name: 'contact', title: 'Contact Information', order: 1 },
    { name: 'project', title: 'Project Details', order: 2 },
    { name: 'timeline', title: 'Timeline & Scope', order: 3 },
    { name: 'budget', title: 'Budget & Investment', order: 4 },
    { name: 'additional', title: 'Additional Information', order: 5 },
    { name: 'marketing', title: 'How You Found Us', order: 6 },
  ],
  fields: [
    ...contactFields,
    // Project Details
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      required: true,
      section: 'project',
      order: 1,
      options: [
        {
          value: 'studio',
          label: 'Studio Collaboration',
          description: 'Recording, production, session work',
        },
        {
          value: 'creative',
          label: 'Creative Project',
          description: 'Songwriting, arranging, musical direction',
        },
        {
          value: 'partnership',
          label: 'Ongoing Partnership',
          description: 'Long-term musical collaboration',
        },
        {
          value: 'other',
          label: 'Other Collaboration',
          description: 'Something unique we should discuss',
        },
      ],
    },
    {
      name: 'projectTitle',
      label: 'Project Title/Name',
      type: 'text',
      required: false,
      placeholder: 'What are you calling this project?',
      section: 'project',
      order: 2,
    },
    {
      name: 'creativeVision',
      label: 'Creative Vision',
      type: 'textarea',
      required: true,
      placeholder:
        "Tell us about your creative vision, goals, and what you're hoping to achieve",
      section: 'project',
      order: 3,
      validation: {
        minLength: 20,
        maxLength: 1000,
      },
    },
    // Timeline & Scope
    {
      name: 'timeline',
      label: 'Timeline',
      type: 'radio',
      required: true,
      section: 'timeline',
      order: 1,
      options: [
        { value: 'urgent', label: 'Urgent (Within 2 weeks)' },
        { value: 'flexible', label: 'Flexible (Within 2 months)' },
        { value: 'specific-date', label: 'Specific Deadline' },
        { value: 'ongoing', label: 'Ongoing Project' },
      ],
    },
    {
      name: 'timelineDetails',
      label: 'Timeline Details',
      type: 'textarea',
      required: false,
      placeholder: 'Any specific dates or timeline requirements?',
      section: 'timeline',
      order: 2,
      conditional: {
        dependsOn: 'timeline',
        showWhen: value => ['specific-date', 'urgent'].includes(value),
      },
    },
    {
      name: 'projectScope',
      label: 'Project Scope',
      type: 'radio',
      required: true,
      section: 'timeline',
      order: 3,
      options: [
        {
          value: 'single-session',
          label: 'Single Session',
          description: 'One-time collaboration',
        },
        {
          value: 'short-term',
          label: 'Short-term',
          description: '2-4 weeks of work',
        },
        {
          value: 'long-term',
          label: 'Long-term',
          description: '1-3 months of collaboration',
        },
        {
          value: 'ongoing',
          label: 'Ongoing',
          description: 'Continuous partnership',
        },
      ],
    },
    // Budget & Investment
    {
      name: 'budgetRange',
      label: 'Budget Range',
      type: 'select',
      required: true,
      section: 'budget',
      order: 1,
      options: [
        { value: 'under-500', label: 'Under $500' },
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-2500', label: '$1,000 - $2,500' },
        { value: '2500-5000', label: '$2,500 - $5,000' },
        { value: '5000-plus', label: '$5,000+' },
        { value: 'discuss', label: "Let's Discuss" },
      ],
    },
    {
      name: 'budgetNotes',
      label: 'Budget Notes',
      type: 'textarea',
      required: false,
      placeholder: 'Any additional budget considerations or questions?',
      section: 'budget',
      order: 2,
    },
    // Additional Information
    {
      name: 'experience',
      label: 'Your Experience Level',
      type: 'radio',
      required: true,
      section: 'additional',
      order: 1,
      options: [
        {
          value: 'first-time',
          label: 'First-time Collaborator',
          description: 'New to musical collaboration',
        },
        {
          value: 'some-experience',
          label: 'Some Experience',
          description: 'Done a few projects before',
        },
        {
          value: 'experienced',
          label: 'Experienced',
          description: 'Regular collaborator',
        },
        {
          value: 'professional',
          label: 'Music Professional',
          description: 'Industry professional',
        },
      ],
    },
    {
      name: 'additionalInfo',
      label: 'Additional Information',
      type: 'textarea',
      required: false,
      placeholder:
        "Anything else you'd like us to know about this collaboration?",
      section: 'additional',
      order: 2,
    },
    {
      name: 'portfolioFiles',
      label: 'Portfolio/Reference Files',
      type: 'file',
      required: false,
      section: 'additional',
      order: 3,
      helpText: 'Share any demos, references, or examples (optional)',
    },
    // Marketing (updated for collaboration context)
    {
      name: 'hearAboutUs',
      label: 'How did you hear about us?',
      type: 'select',
      required: false,
      section: 'marketing',
      order: 1,
      options: [
        { value: 'google', label: 'Google Search' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'referral', label: 'Friend/Colleague Referral' },
        { value: 'community', label: 'Music Community' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'hearAboutUsDetail',
      label: 'Please provide details',
      type: 'text',
      required: false,
      placeholder: 'Tell us more...',
      section: 'marketing',
      order: 2,
      conditional: {
        dependsOn: 'hearAboutUs',
        showWhen: value => ['other', 'referral', 'community'].includes(value),
      },
    },
  ],
}

// Teaching form configuration
export const teachingFormConfig: FormConfig = {
  serviceType: 'teaching',
  title: 'Guitar Lesson Inquiry',
  description:
    'Start your musical journey with personalized guitar instruction',
  submitText: 'Submit Lesson Inquiry',
  successMessage:
    "Thank you for your interest in guitar lessons! We'll get back to you within 24 hours.",
  sections: [
    { name: 'contact', title: 'Contact Information', order: 1 },
    { name: 'lessons', title: 'Lesson Details', order: 2 },
    { name: 'schedule', title: 'Schedule & Format', order: 3 },
    { name: 'additional', title: 'Additional Information', order: 4 },
    { name: 'preferences', title: 'Communication Preferences', order: 5 },
    { name: 'marketing', title: 'How You Found Us', order: 6 },
  ],
  fields: [
    ...contactFields,
    // Lesson Details
    {
      name: 'packageType',
      label: 'Lesson Package',
      type: 'radio',
      required: true,
      section: 'lessons',
      order: 1,
      options: [
        {
          value: 'trial',
          label: 'Trial Lesson',
          description: 'Single lesson to get started ($75)',
        },
        {
          value: 'single',
          label: 'Single Lessons',
          description: 'Pay-as-you-go ($85 per lesson)',
        },
        {
          value: 'foundation',
          label: 'Foundation Package',
          description: '4 lessons for focused learning ($320)',
        },
        {
          value: 'transformation',
          label: 'Transformation Package',
          description: '8 lessons for serious progress ($600)',
        },
      ],
    },
    {
      name: 'experienceLevel',
      label: 'Your Experience Level',
      type: 'radio',
      required: true,
      section: 'lessons',
      order: 2,
      options: [
        {
          value: 'complete-beginner',
          label: 'Complete Beginner',
          description: 'Never played guitar before',
        },
        {
          value: 'some-basics',
          label: 'Know Some Basics',
          description: 'Can play a few chords or songs',
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          description: 'Comfortable with basics, want to improve',
        },
        {
          value: 'advanced',
          label: 'Advanced',
          description: 'Looking to refine technique and expand skills',
        },
      ],
    },
    {
      name: 'musicalGoals',
      label: 'Musical Goals',
      type: 'textarea',
      required: true,
      placeholder:
        'What would you like to achieve with guitar lessons? Any specific songs or styles you want to learn?',
      section: 'lessons',
      order: 3,
      validation: {
        minLength: 10,
        maxLength: 500,
      },
    },
    // Schedule & Format
    {
      name: 'lessonFormat',
      label: 'Lesson Format Preference',
      type: 'radio',
      required: true,
      section: 'schedule',
      order: 1,
      options: [
        {
          value: 'in-person',
          label: 'In-Person',
          description: 'Face-to-face lessons (Sydney area)',
        },
        {
          value: 'online',
          label: 'Online',
          description: 'Video call lessons via Zoom',
        },
        {
          value: 'flexible',
          label: 'Flexible',
          description: 'Mix of both formats',
        },
      ],
    },
    {
      name: 'preferredSchedule',
      label: 'Preferred Schedule',
      type: 'radio',
      required: true,
      section: 'schedule',
      order: 2,
      options: [
        {
          value: 'weekday-mornings',
          label: 'Weekday Mornings',
          description: '9am - 12pm, Monday-Friday',
        },
        {
          value: 'weekday-afternoons',
          label: 'Weekday Afternoons',
          description: '1pm - 5pm, Monday-Friday',
        },
        {
          value: 'weekday-evenings',
          label: 'Weekday Evenings',
          description: '6pm - 9pm, Monday-Friday',
        },
        {
          value: 'weekends',
          label: 'Weekends',
          description: 'Saturday or Sunday',
        },
        {
          value: 'flexible',
          label: 'Flexible',
          description: 'I can work around your availability',
        },
      ],
    },
    {
      name: 'scheduleDetails',
      label: 'Schedule Details',
      type: 'textarea',
      required: false,
      placeholder:
        'Any specific days/times that work best for you? Or times to avoid?',
      section: 'schedule',
      order: 3,
    },
    // Additional Information
    {
      name: 'previousExperience',
      label: 'Previous Musical Experience',
      type: 'textarea',
      required: false,
      placeholder:
        'Any other instruments? Previous lessons? Musical background?',
      section: 'additional',
      order: 1,
    },
    {
      name: 'specificInterests',
      label: 'Specific Interests',
      type: 'textarea',
      required: false,
      placeholder:
        "Particular genres, techniques, or aspects of guitar you're most interested in?",
      section: 'additional',
      order: 2,
    },
    {
      name: 'additionalInfo',
      label: 'Additional Information',
      type: 'textarea',
      required: false,
      placeholder: "Anything else you'd like me to know?",
      section: 'additional',
      order: 3,
    },
    // Communication Preferences
    {
      name: 'preferredContact',
      label: 'Preferred Contact Method',
      type: 'radio',
      required: true,
      section: 'preferences',
      order: 1,
      options: [
        {
          value: 'email',
          label: 'Email',
          description: 'Best for detailed information',
        },
        {
          value: 'phone',
          label: 'Phone Call',
          description: 'Quick discussion about lessons',
        },
        {
          value: 'text',
          label: 'Text Message',
          description: 'Brief and convenient',
        },
        {
          value: 'whatsapp',
          label: 'WhatsApp',
          description: 'Easy messaging and media sharing',
        },
      ],
    },
    {
      name: 'bestTimeToCall',
      label: 'Best Time to Call',
      type: 'text',
      required: false,
      placeholder: 'e.g., weekday evenings, Saturday mornings',
      section: 'preferences',
      order: 2,
      conditional: {
        dependsOn: 'preferredContact',
        showWhen: value => ['phone', 'whatsapp'].includes(value),
      },
    },
    // Marketing (updated for teaching context)
    {
      name: 'hearAboutUs',
      label: 'How did you hear about these lessons?',
      type: 'select',
      required: false,
      section: 'marketing',
      order: 1,
      options: [
        { value: 'google', label: 'Google Search' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'referral', label: 'Friend/Student Referral' },
        { value: 'student', label: 'Current/Former Student' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'hearAboutUsDetail',
      label: 'Please provide details',
      type: 'text',
      required: false,
      placeholder: 'Tell us more...',
      section: 'marketing',
      order: 2,
      conditional: {
        dependsOn: 'hearAboutUs',
        showWhen: value => ['other', 'referral', 'student'].includes(value),
      },
    },
  ],
}

// Universal form configuration
export const universalFormConfig: FormConfig = {
  serviceType: 'universal',
  title: 'Contact Us',
  description: "Get in touch and we'll help you find the right service",
  submitText: 'Send Message',
  successMessage: "Thank you for your message! We'll get back to you soon.",
  sections: [
    { name: 'contact', title: 'Your Information', order: 1 },
    { name: 'inquiry', title: 'Your Message', order: 2 },
  ],
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name',
      section: 'contact',
      order: 1,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      section: 'contact',
      order: 2,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter your mobile number',
      section: 'contact',
      order: 3,
    },
    {
      name: 'inquiry',
      label: 'Your Message',
      type: 'textarea',
      required: true,
      placeholder: 'Tell us how we can help you...',
      section: 'inquiry',
      order: 1,
      validation: {
        minLength: 10,
        maxLength: 1000,
      },
    },
  ],
}

// Configuration map
export const formConfigurations = {
  performance: performanceFormConfig,
  collaboration: collaborationFormConfig,
  teaching: teachingFormConfig,
  universal: universalFormConfig,
} as const

// Helper function to get form configuration
export const getFormConfiguration = (serviceType: ServiceType): FormConfig => {
  const config = formConfigurations[serviceType]
  if (!config) {
    throw new Error(`Unknown service type: ${serviceType}`)
  }
  return config
}
