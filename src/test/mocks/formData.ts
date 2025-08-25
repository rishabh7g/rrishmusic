/**
 * Form Data Mocks for Integration Tests
 * 
 * Comprehensive test data for form validation, submission, and user journey testing.
 * Includes valid and invalid data scenarios for all service types.
 */

import type { TeachingInquiryData } from '@/components/forms/TeachingInquiryForm';
import type { PerformanceInquiryData } from '@/components/forms/PerformanceInquiryForm';
import type { CollaborationInquiryData } from '@/components/forms/CollaborationInquiryForm';

// Valid form data for successful submissions
export const validTeachingData: TeachingInquiryData = {
  // Contact Information
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  
  // Lesson Details
  packageType: 'foundation',
  experienceLevel: 'some-basics',
  musicalGoals: 'I want to learn acoustic guitar and be able to play my favorite songs around the campfire. I\'m particularly interested in folk and country music, and would love to develop fingerpicking techniques.',
  
  // Schedule and Format
  lessonFormat: 'in-person',
  preferredSchedule: 'weekday-evenings',
  scheduleDetails: 'Tuesday or Thursday evenings work best for me',
  
  // Additional Information
  previousExperience: 'Played piano for 3 years in high school',
  specificInterests: 'Acoustic fingerpicking, folk music, songwriting basics',
  additionalInfo: 'I have my own acoustic guitar (Yamaha FG800) and am very motivated to learn',
  
  // Communication Preferences
  preferredContact: 'email',
  bestTimeToContact: 'Evenings after 6 PM or weekends'
};

export const validPerformanceData: PerformanceInquiryData = {
  // Contact Information
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 987-6543',
  
  // Event Details
  eventType: 'wedding',
  eventDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  })(),
  eventTime: '18:00',
  venueName: 'Garden Terrace Restaurant',
  venueAddress: '456 Oak Street, Downtown, CA 90210',
  
  // Performance Requirements
  performanceFormat: 'solo',
  performanceStyle: 'acoustic',
  duration: '3 hours',
  guestCount: '120',
  budgetRange: '1000-2000',
  
  // Additional Information
  specialRequests: 'Would love to include "Here Comes the Sun" during the ceremony and some jazz standards during cocktail hour',
  musicPreferences: 'Acoustic covers of popular songs, jazz standards, and some original material',
  hasVenueRestrictions: true,
  venueRestrictions: 'Acoustic only due to noise ordinance, setup must be complete by 5:30 PM',
  
  // Marketing
  hearAboutUs: 'google',
  hearAboutUsDetail: 'Found through Google search for wedding musicians in the area'
};

export const validCollaborationData: CollaborationInquiryData = {
  // Contact Information
  name: 'Michael Chen',
  email: 'michael.chen@musiclabel.com',
  phone: '+1 (555) 246-8135',
  
  // Project Details
  projectType: 'studio',
  projectTitle: 'Indie Folk Album - "Seasons of Change"',
  creativeVision: 'We\'re working on an indie folk album that blends traditional acoustic elements with modern production techniques. Looking for a skilled guitarist who can provide both rhythm and lead parts, with a focus on creating atmospheric textures that complement our vocalist\'s storytelling style. The project explores themes of personal growth and environmental consciousness.',
  
  // Timeline and Scope
  timeline: 'specific-date',
  timelineDetails: 'Recording sessions planned for March 2024, with final tracks needed by May 2024 for summer release',
  projectScope: 'short-term',
  
  // Budget and Pricing
  budgetRange: '2500-5000',
  budgetNotes: 'Budget includes session fees, studio time contribution, and potential songwriting credits',
  
  // Additional Information
  experience: 'professional',
  additionalInfo: 'We\'ve worked with several indie artists and have had releases on Spotify\'s New Music Friday playlist. Looking for long-term creative partnership beyond this initial project.',
  
  // Communication Preferences
  preferredContact: 'email',
  bestTimeToContact: 'Weekdays 9 AM - 6 PM PST'
};

// Invalid form data for validation testing
export const invalidTeachingData = {
  name: '', // Required field empty
  email: 'invalid-email', // Invalid email format
  phone: '123', // Too short phone number
  packageType: '', // Required field empty
  experienceLevel: '', // Required field empty
  musicalGoals: 'Short', // Too short, requires more detail
  lessonFormat: '',
  preferredSchedule: '',
  scheduleDetails: '',
  previousExperience: '',
  specificInterests: '',
  additionalInfo: '',
  preferredContact: 'email' as const,
  bestTimeToContact: ''
};

export const invalidPerformanceData = {
  name: '', // Required field empty
  email: 'bad@email', // Invalid email
  phone: '555-CALL-ME', // Invalid phone format
  eventType: '', // Required field empty
  eventDate: '2020-01-01', // Past date
  eventTime: '25:00', // Invalid time
  venueName: '',
  venueAddress: '',
  performanceFormat: '', // Required field empty
  performanceStyle: '',
  duration: '', // Required field empty
  guestCount: '',
  budgetRange: '', // Required field empty
  specialRequests: '',
  musicPreferences: '',
  hasVenueRestrictions: false,
  venueRestrictions: '',
  hearAboutUs: 'google' as const,
  hearAboutUsDetail: ''
};

export const invalidCollaborationData = {
  name: '', // Required field empty
  email: 'incomplete@', // Incomplete email
  phone: '++1234567890', // Invalid phone format
  projectType: '', // Required field empty
  projectTitle: '',
  creativeVision: 'Too short', // Requires minimum length
  timeline: '',
  timelineDetails: '',
  projectScope: '',
  budgetRange: '', // Required field empty
  budgetNotes: '',
  experience: '',
  additionalInfo: '',
  portfolioFiles: undefined,
  preferredContact: 'email' as const,
  bestTimeToContact: ''
};

// Edge case test data
export const edgeCaseFormData = {
  teaching: {
    // Maximum length inputs
    name: 'A'.repeat(100),
    email: 'very.long.email.address.that.might.cause.issues@extremely-long-domain-name-that-could-break-validation.com',
    phone: '+1 (555) 123-4567 ext. 9999',
    musicalGoals: 'A'.repeat(2000), // Very long text
    additionalInfo: 'B'.repeat(1500)
  },
  performance: {
    // Special characters and international content
    name: 'José María García-López',
    email: 'josé@música.es',
    venueName: 'Château de Beauté & Élégance',
    venueAddress: '123 Rué de la Musique, Montréal, QC H3A 0G4, Canada',
    specialRequests: 'Need música tradicional and some English covers. Event includes 中文 speaking guests.',
    musicPreferences: 'Mix of français, español, and English songs'
  },
  collaboration: {
    // Creative project with artistic language
    name: 'Artist Collective',
    email: 'collective@artspace.org',
    projectTitle: 'Experimental Sound Installation: "Echoes of Tomorrow"',
    creativeVision: 'An immersive multimedia experience combining guitar loops, field recordings, and interactive visual elements to explore themes of urban decay and natural regeneration...',
    additionalInfo: 'This project will be exhibited at the Museum of Contemporary Art and requires someone comfortable with avant-garde approaches to music-making.'
  }
};

// Performance and load test data
export const performanceTestData = {
  // Large form datasets for stress testing
  massSubmissionData: Array.from({ length: 100 }, (_, index) => ({
    name: `Test User ${index + 1}`,
    email: `testuser${index + 1}@example.com`,
    serviceType: ['teaching', 'performance', 'collaboration'][index % 3] as 'teaching' | 'performance' | 'collaboration',
    timestamp: new Date(Date.now() + index * 1000).toISOString()
  })),
  
  // Large text content for performance testing
  largeTextFields: {
    musicalGoals: 'A'.repeat(10000),
    creativeVision: 'B'.repeat(8000),
    additionalInfo: 'C'.repeat(5000),
    specialRequests: 'D'.repeat(3000)
  }
};

// Context-aware validation test scenarios
export const contextTestCases = [
  {
    scenario: 'new_user_teaching_inquiry',
    context: {
      userJourneyStage: 'initial',
      serviceType: 'teaching' as const,
      previousInteractions: 0,
      timeOnSite: 120, // seconds
      sourceReferrer: 'google'
    },
    expectedValidation: {
      emailRequired: true,
      phoneOptional: true,
      experienceDetailRequired: true
    }
  },
  {
    scenario: 'returning_user_performance_inquiry',
    context: {
      userJourneyStage: 'engaged',
      serviceType: 'performance' as const,
      previousInteractions: 3,
      timeOnSite: 900,
      sourceReferrer: 'direct'
    },
    expectedValidation: {
      budgetRangeRequired: true,
      eventDetailsRequired: true,
      venueInfoOptional: false
    }
  },
  {
    scenario: 'professional_collaboration_inquiry',
    context: {
      userJourneyStage: 'professional',
      serviceType: 'collaboration' as const,
      previousInteractions: 1,
      timeOnSite: 1800,
      sourceReferrer: 'linkedin'
    },
    expectedValidation: {
      portfolioExpected: true,
      detailedVisionRequired: true,
      budgetDiscussionExpected: true
    }
  }
];

// User journey test scenarios
export const userJourneyScenarios = [
  {
    name: 'complete_teaching_journey',
    steps: [
      { action: 'land_on_homepage', expectedElements: ['teaching_cta', 'navigation'] },
      { action: 'click_teaching_cta', expectedElements: ['teaching_page_content', 'pricing_info'] },
      { action: 'click_inquiry_button', expectedElements: ['form_modal', 'form_fields'] },
      { action: 'fill_form', data: validTeachingData },
      { action: 'submit_form', expectedResult: 'success_message' },
      { action: 'verify_analytics', expectedEvents: ['form_submit', 'conversion'] }
    ],
    analytics: {
      conversionGoal: 'teaching_inquiry_submission',
      funnelSteps: ['homepage_view', 'teaching_page_view', 'form_open', 'form_submit'],
      expectedDuration: 300 // seconds
    }
  },
  {
    name: 'performance_inquiry_with_details',
    steps: [
      { action: 'navigate_to_performance', expectedElements: ['performance_content'] },
      { action: 'open_inquiry_form', expectedElements: ['performance_specific_fields'] },
      { action: 'fill_event_details', data: validPerformanceData },
      { action: 'add_special_requests', data: { specialRequests: 'Custom song requests' } },
      { action: 'submit_inquiry', expectedResult: 'confirmation_with_id' }
    ],
    analytics: {
      conversionGoal: 'performance_inquiry_submission',
      customProperties: ['event_type', 'budget_range', 'performance_format']
    }
  },
  {
    name: 'collaboration_with_portfolio',
    steps: [
      { action: 'access_collaboration_page', expectedElements: ['project_examples'] },
      { action: 'start_project_inquiry', expectedElements: ['file_upload_option'] },
      { action: 'describe_creative_vision', data: { creativeVision: validCollaborationData.creativeVision } },
      { action: 'upload_portfolio_files', files: ['demo.mp3', 'project_outline.pdf'] },
      { action: 'submit_collaboration_request', expectedResult: 'project_review_confirmation' }
    ],
    fileHandling: {
      maxFileSize: '10MB',
      allowedTypes: ['audio/mpeg', 'audio/wav', 'application/pdf', 'image/jpeg'],
      uploadValidation: true
    }
  }
];

// Submission test scenarios for different response cases
export const submissionTestScenarios = [
  {
    name: 'successful_submission',
    mockResponse: {
      status: 200,
      ok: true,
      json: async () => ({
        success: true,
        submissionId: 'INQ-2024-001',
        message: 'Thank you for your inquiry!',
        nextSteps: [
          'You will receive a confirmation email within 5 minutes',
          'Expect a personal response within 24 hours',
          'Check your calendar for available lesson times'
        ],
        estimatedResponse: '24 hours'
      })
    },
    expectedBehavior: {
      showSuccessMessage: true,
      includeSubmissionId: true,
      displayNextSteps: true,
      triggerAnalytics: true,
      closeFormAfterDelay: true
    }
  },
  {
    name: 'validation_error',
    mockResponse: {
      status: 400,
      ok: false,
      json: async () => ({
        error: 'Validation failed',
        details: {
          email: 'Invalid email format',
          phone: 'Phone number is required for performance inquiries',
          eventDate: 'Event date must be at least 2 weeks in the future'
        },
        suggestions: [
          'Please check your email address format',
          'Include area code in phone number',
          'Select a date at least 14 days from today'
        ]
      })
    },
    expectedBehavior: {
      showFieldErrors: true,
      highlightInvalidFields: true,
      preserveFormData: true,
      showSuggestions: true,
      allowRetry: true
    }
  },
  {
    name: 'server_error',
    mockResponse: {
      status: 500,
      ok: false,
      json: async () => ({
        error: 'Internal server error',
        message: 'Something went wrong on our end',
        supportInfo: {
          contactEmail: 'support@rrishmusic.com',
          phone: '+1 (555) 123-4567',
          hours: 'Monday-Friday 9AM-6PM PST'
        }
      })
    },
    expectedBehavior: {
      showGenericError: true,
      preserveFormData: true,
      showSupportInfo: true,
      allowRetry: true,
      suggestAlternativeContact: true
    }
  },
  {
    name: 'network_error',
    mockResponse: new Error('Network connection failed'),
    expectedBehavior: {
      showNetworkError: true,
      preserveFormData: true,
      suggestRetry: true,
      showOfflineMessage: true,
      cacheFormDataLocally: true
    }
  },
  {
    name: 'timeout_error',
    mockResponse: new Error('Request timeout'),
    expectedBehavior: {
      showTimeoutMessage: true,
      preserveFormData: true,
      automaticRetry: false,
      manualRetryOption: true,
      suggestPatience: true
    }
  }
];

// Accessibility test data
export const accessibilityTestData = {
  screenReaderContent: {
    formLabels: [
      'Full name (required)',
      'Email address (required)',
      'Phone number (optional)',
      'Experience level (required for teaching inquiries)',
      'Musical goals (required, minimum 50 characters)'
    ],
    errorMessages: [
      'Error: Please enter your full name',
      'Error: Please enter a valid email address',
      'Error: Please select your experience level',
      'Error: Please describe your musical goals in more detail'
    ],
    successMessages: [
      'Success: Your teaching inquiry has been submitted',
      'Success: Your performance quote request has been received',
      'Success: Your collaboration proposal is under review'
    ]
  },
  keyboardNavigation: {
    tabOrder: [
      'name_field',
      'email_field',
      'phone_field',
      'package_select',
      'experience_select',
      'goals_textarea',
      'submit_button',
      'cancel_button'
    ],
    shortcuts: {
      'Escape': 'close_form',
      'Enter': 'submit_form_if_valid',
      'Tab': 'next_field',
      'Shift+Tab': 'previous_field'
    }
  },
  contrastRequirements: {
    normalText: '4.5:1',
    largeText: '3:1',
    nonTextElements: '3:1',
    focusIndicators: '3:1'
  }
};

// Mobile test data and scenarios
export const mobileTestData = {
  viewports: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Android Small', width: 360, height: 640 }
  ],
  touchTargets: {
    minimumSize: 44, // pixels
    recommendedSpacing: 8, // pixels between targets
    maximumTextInputHeight: 56 // pixels
  },
  mobileSpecificBehaviors: {
    virtualKeyboard: true,
    touchScrolling: true,
    orientationChange: true,
    pinchZoom: false, // should be disabled in forms
    swipeGestures: true
  }
};

export default {
  validTeachingData,
  validPerformanceData,
  validCollaborationData,
  invalidTeachingData,
  invalidPerformanceData,
  invalidCollaborationData,
  edgeCaseFormData,
  performanceTestData,
  contextTestCases,
  userJourneyScenarios,
  submissionTestScenarios,
  accessibilityTestData,
  mobileTestData
};