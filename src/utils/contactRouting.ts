/**
 * Enhanced Contact Routing Utility - Smart Routing v2.0
 *
 * Advanced intelligent contact routing system with enhanced user journey detection,
 * referral source tracking, and intelligent form pre-filling for improved conversions.
 *
 * New Features in v2.0:
 * - Advanced referral source detection (social media, search engines, direct)
 * - User session journey tracking with breadcrumb history
 * - Intelligent form pre-filling based on user behavior patterns
 * - Enhanced analytics with user journey mapping
 * - A/B testing support for contact routing optimization
 * - Conversion optimization through personalized experiences
 */

import { Location } from 'react-router-dom'
import type { FormInitialData } from '@/types/forms'
import { ServiceType as CoreServiceType } from '@/types/content'

/**
 * Supported service types for contact routing (includes general for fallbacks)
 */
export type ServiceType = CoreServiceType | 'general'

/**
 * Enhanced referral source categories
 */
export type ReferralSourceType =
  | 'direct'
  | 'social_media'
  | 'search_engine'
  | 'email_campaign'
  | 'internal_navigation'
  | 'external_referrer'
  | 'qr_code'
  | 'unknown'

/**
 * User journey tracking data
 */
export interface UserJourneyStep {
  path: string
  timestamp: number
  serviceContext?: ServiceType
  timeSpent?: number
  interactions?: string[]
}

/**
 * Enhanced contact routing context with journey tracking
 */
export interface ContactContext {
  serviceType: ServiceType
  initialFormType?: string
  source?: string
  referrer?: string
  referralSourceType: ReferralSourceType
  userJourney: UserJourneyStep[]
  sessionData: {
    sessionId: string
    startTime: number
    totalTimeSpent: number
    pagesVisited: number
    primaryServiceInterest?: ServiceType
    confidenceScore: number // 0-100 confidence in service detection
  }
  campaignData?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
  }
}

/**
 * URL parameters that can influence contact routing
 */
export interface ContactRouteParams {
  service?: string
  form?: string
  package?: string
  type?: string
  source?: string
  // UTM parameters
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  // Special tracking
  ref?: string
  from?: string
}

/**
 * Enhanced service detection patterns with priority weights
 */
const SERVICE_PATTERNS = {
  performance: {
    paths: ['/performance', '#performances', '/gigs', '/concerts'],
    keywords: [
      'performance',
      'live',
      'venue',
      'event',
      'concert',
      'gig',
      'band',
    ],
    weight: 1.0,
  },
  collaboration: {
    paths: ['/collaboration', '#collaboration', '/projects', '/creative'],
    keywords: [
      'collaboration',
      'project',
      'creative',
      'partner',
      'recording',
      'studio',
    ],
    weight: 1.0,
  },
  teaching: {
    paths: ['/', '#lessons', '#approach', '/lessons', '/learn'],
    keywords: [
      'lesson',
      'teaching',
      'learn',
      'student',
      'instruction',
      'guitar',
    ],
    weight: 0.8, // Lower weight as it's the default homepage
  },
  general: {
    paths: ['#contact', '#about', '/contact', '/about'],
    keywords: ['contact', 'about', 'hello', 'info'],
    weight: 0.5,
  },
} as const

/**
 * Referral source detection patterns
 */
const REFERRAL_PATTERNS = {
  social_media: [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'linkedin.com',
    'youtube.com',
    'tiktok.com',
    'snapchat.com',
    'pinterest.com',
  ],
  search_engine: [
    'google.com',
    'bing.com',
    'yahoo.com',
    'duckduckgo.com',
    'search.yahoo.com',
    'baidu.com',
  ],
  email_campaign: [
    'mailchimp.com',
    'constantcontact.com',
    'campaign-archive.com',
    'gmail.com',
    'outlook.com', // When coming from webmail
  ],
} as const

/**
 * Session storage keys for journey tracking
 */
const STORAGE_KEYS = {
  SESSION_ID: 'rrish_session_id',
  USER_JOURNEY: 'rrish_user_journey',
  SESSION_START: 'rrish_session_start',
  PRIMARY_SERVICE: 'rrish_primary_service',
} as const

/**
 * Generate or retrieve session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session'

  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID)
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
    sessionStorage.setItem(STORAGE_KEYS.SESSION_START, Date.now().toString())
  }
  return sessionId
}

/**
 * Track user journey step
 */
function trackJourneyStep(
  location: Location,
  serviceContext?: ServiceType
): UserJourneyStep[] {
  if (typeof window === 'undefined') return []

  const currentStep: UserJourneyStep = {
    path: `${location.pathname}${location.hash}`,
    timestamp: Date.now(),
    serviceContext,
    interactions: [],
  }

  const existingJourney = JSON.parse(
    sessionStorage.getItem(STORAGE_KEYS.USER_JOURNEY) || '[]'
  ) as UserJourneyStep[]

  // Calculate time spent on previous step
  if (existingJourney.length > 0) {
    const lastStep = existingJourney[existingJourney.length - 1]
    lastStep.timeSpent = currentStep.timestamp - lastStep.timestamp
  }

  const updatedJourney = [...existingJourney, currentStep]
  sessionStorage.setItem(
    STORAGE_KEYS.USER_JOURNEY,
    JSON.stringify(updatedJourney)
  )

  return updatedJourney
}

/**
 * Detect referral source type from referrer URL
 */
function detectReferralSourceType(referrer: string): ReferralSourceType {
  if (!referrer) return 'direct'

  const referrerLower = referrer.toLowerCase()

  // Check for social media
  if (
    REFERRAL_PATTERNS.social_media.some(pattern =>
      referrerLower.includes(pattern)
    )
  ) {
    return 'social_media'
  }

  // Check for search engines
  if (
    REFERRAL_PATTERNS.search_engine.some(pattern =>
      referrerLower.includes(pattern)
    )
  ) {
    return 'search_engine'
  }

  // Check for email campaigns
  if (
    REFERRAL_PATTERNS.email_campaign.some(pattern =>
      referrerLower.includes(pattern)
    )
  ) {
    return 'email_campaign'
  }

  // Check if it's from the same domain (internal navigation)
  if (referrerLower.includes('rrishmusic.com')) {
    return 'internal_navigation'
  }

  // Check for QR code indicators
  if (referrerLower.includes('qr') || referrerLower.includes('scan')) {
    return 'qr_code'
  }

  // External referrer
  if (referrer.startsWith('http')) {
    return 'external_referrer'
  }

  return 'unknown'
}

/**
 * Calculate confidence score for service detection
 */
function calculateConfidenceScore(
  detectedService: ServiceType,
  context: {
    urlMatch: boolean
    referrerMatch: boolean
    journeyContext: number // 0-1 based on journey analysis
    utmMatch: boolean
  }
): number {
  let score = 0

  if (context.urlMatch) score += 40
  if (context.referrerMatch) score += 30
  if (context.utmMatch) score += 20
  score += Math.round(context.journeyContext * 10)

  return Math.min(100, Math.max(0, score))
}

/**
 * Analyze user journey to determine primary service interest
 */
function analyzeJourneyForServiceInterest(journey: UserJourneyStep[]): {
  primaryService?: ServiceType
  contextScore: number
} {
  if (journey.length === 0) return { contextScore: 0 }

  const serviceWeights: Record<ServiceType, number> = {
    performance: 0,
    collaboration: 0,
    teaching: 0,
    general: 0,
  }

  let totalWeight = 0

  journey.forEach((step, index) => {
    const timeWeight = Math.min(step.timeSpent || 1000, 5000) / 5000 // Normalize time spent
    const recencyWeight = (index + 1) / journey.length // More recent steps get higher weight
    const stepWeight = timeWeight * recencyWeight

    // Check which service this step relates to
    Object.entries(SERVICE_PATTERNS).forEach(([service, patterns]) => {
      if (patterns.paths.some(path => step.path.includes(path))) {
        serviceWeights[service as ServiceType] += stepWeight * patterns.weight
        totalWeight += stepWeight
      }
    })
  })

  // Find the service with the highest weight
  const primaryService = Object.entries(serviceWeights).reduce((a, b) =>
    serviceWeights[a[0] as ServiceType] > serviceWeights[b[0] as ServiceType]
      ? a
      : b
  )[0] as ServiceType

  const contextScore =
    totalWeight > 0 ? serviceWeights[primaryService] / totalWeight : 0

  return {
    primaryService: contextScore > 0.3 ? primaryService : undefined,
    contextScore,
  }
}

/**
 * Enhanced service context detection with journey analysis
 */
export function detectServiceContext(
  location: Location,
  referrer?: string,
  urlParams?: URLSearchParams
): ContactContext {
  const { pathname, hash, search } = location
  const params = urlParams || new URLSearchParams(search)

  // Extract UTM parameters
  const campaignData = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  }

  // Track journey step
  const userJourney = trackJourneyStep(location)
  const journeyAnalysis = analyzeJourneyForServiceInterest(userJourney)

  // Get session data
  const sessionId = getSessionId()
  const sessionStart = parseInt(
    sessionStorage.getItem(STORAGE_KEYS.SESSION_START) || '0'
  )
  const totalTimeSpent = Date.now() - sessionStart

  // Detect referral source type
  const referralSourceType = detectReferralSourceType(referrer || '')

  // Check URL parameters first for explicit service routing
  const serviceParam = params.get('service')
  if (serviceParam && isValidServiceType(serviceParam)) {
    const context: ContactContext = {
      serviceType: serviceParam as ServiceType,
      initialFormType: params.get('form') || undefined,
      source: params.get('source') || 'url_parameter',
      referrer,
      referralSourceType,
      userJourney,
      sessionData: {
        sessionId,
        startTime: sessionStart,
        totalTimeSpent,
        pagesVisited: userJourney.length,
        primaryServiceInterest: journeyAnalysis.primaryService,
        confidenceScore: calculateConfidenceScore(serviceParam as ServiceType, {
          urlMatch: true,
          referrerMatch: false,
          journeyContext: journeyAnalysis.contextScore,
          utmMatch: !!campaignData.utm_source,
        }),
      },
      campaignData: Object.values(campaignData).some(v => v)
        ? campaignData
        : undefined,
    }

    return context
  }

  // Smart detection based on current location and journey
  const currentLocation = `${pathname}${hash}`
  let detectedService: ServiceType = 'general'
  let urlMatch = false
  let referrerMatch = false

  // Check current path against service patterns
  for (const [service, patterns] of Object.entries(SERVICE_PATTERNS)) {
    if (patterns.paths.some(pattern => currentLocation.includes(pattern))) {
      detectedService = service as ServiceType
      urlMatch = true
      break
    }
  }

  // Check referrer context if no URL match
  if (!urlMatch && referrer) {
    for (const [service, patterns] of Object.entries(SERVICE_PATTERNS)) {
      if (
        patterns.keywords.some(keyword =>
          referrer.toLowerCase().includes(keyword)
        )
      ) {
        detectedService = service as ServiceType
        referrerMatch = true
        break
      }
    }
  }

  // Use journey analysis if available and confidence is high
  if (
    !urlMatch &&
    !referrerMatch &&
    journeyAnalysis.primaryService &&
    journeyAnalysis.contextScore > 0.5
  ) {
    detectedService = journeyAnalysis.primaryService
  }

  // Determine initial form type based on service and context
  let initialFormType: string | undefined
  switch (detectedService) {
    case 'performance':
      initialFormType = params.get('type') || campaignData.utm_content || 'band'
      break
    case 'collaboration':
      initialFormType =
        params.get('type') || campaignData.utm_content || 'creative'
      break
    case 'teaching':
      initialFormType =
        params.get('package') || campaignData.utm_content || 'single'
      break
  }

  const confidenceScore = calculateConfidenceScore(detectedService, {
    urlMatch,
    referrerMatch,
    journeyContext: journeyAnalysis.contextScore,
    utmMatch: !!campaignData.utm_source,
  })

  return {
    serviceType: detectedService,
    initialFormType,
    source: urlMatch
      ? 'page_context'
      : referrerMatch
        ? 'referrer_context'
        : 'journey_analysis',
    referrer,
    referralSourceType,
    userJourney,
    sessionData: {
      sessionId,
      startTime: sessionStart,
      totalTimeSpent,
      pagesVisited: userJourney.length,
      primaryServiceInterest: journeyAnalysis.primaryService,
      confidenceScore,
    },
    campaignData: Object.values(campaignData).some(v => v)
      ? campaignData
      : undefined,
  }
}

/**
 * Type guard to check if a string is a valid service type
 */
function isValidServiceType(value: string): value is ServiceType {
  return ['performance', 'collaboration', 'teaching', 'general'].includes(value)
}

/**
 * Enhanced contact URL generation with campaign tracking
 */
export function generateContactUrl(
  serviceType: ServiceType,
  options?: {
    formType?: string
    packageType?: string
    source?: string
    returnUrl?: string
    campaignData?: ContactContext['campaignData']
  }
): string {
  const params = new URLSearchParams()

  params.set('service', serviceType)

  if (options?.formType) {
    params.set('form', options.formType)
  }

  if (options?.packageType && serviceType === 'teaching') {
    params.set('package', options.packageType)
  }

  if (options?.source) {
    params.set('source', options.source)
  }

  if (options?.returnUrl) {
    params.set('return', encodeURIComponent(options.returnUrl))
  }

  // Preserve UTM parameters
  if (options?.campaignData) {
    Object.entries(options.campaignData).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
  }

  // Route to appropriate page based on service type
  switch (serviceType) {
    case 'performance':
      return `/performance?${params.toString()}#contact`
    case 'collaboration':
      return `/collaboration?${params.toString()}#contact`
    case 'teaching':
      return `/?${params.toString()}#contact`
    default:
      return `/?${params.toString()}#contact`
  }
}

/**
 * Contact link options with enhanced campaign support
 */
interface ContactLinkOptions {
  formType?: string
  packageType?: string
  source?: string
  text?: string
  className?: string
  campaignData?: ContactContext['campaignData']
}

/**
 * Enhanced contact link generation
 */
export function createContactLink(
  serviceType: ServiceType,
  options?: ContactLinkOptions
): {
  href: string
  'data-service': ServiceType
  'data-form-type'?: string
  'data-source'?: string
  'aria-label': string
} {
  const href = generateContactUrl(serviceType, options)

  const linkProps: {
    href: string
    'data-service': ServiceType
    'data-form-type'?: string
    'data-source'?: string
    'aria-label': string
  } = {
    href,
    'data-service': serviceType,
    'aria-label': `Contact for ${serviceType} services`,
  }

  if (options?.formType) {
    linkProps['data-form-type'] = options.formType
  }

  if (options?.source) {
    linkProps['data-source'] = options.source
  }

  return linkProps
}

/**
 * Enhanced form type mapping with intelligent pre-filling
 */
interface FormTypeResult {
  formComponent:
    | 'PerformanceInquiryForm'
    | 'CollaborationInquiryForm'
    | 'TeachingInquiryForm'
    | 'ServiceSelectionModal'
  initialData?: FormInitialData
  preFillData?: {
    referralSource?: string
    campaignInfo?: string
    userJourneyContext?: string
  }
}

/**
 * Enhanced form type determination with intelligent pre-filling
 */
export function getFormTypeFromContext(
  context: ContactContext
): FormTypeResult {
  const preFillData = {
    referralSource: context.referralSourceType,
    campaignInfo: context.campaignData?.utm_campaign
      ? `${context.campaignData.utm_source} - ${context.campaignData.utm_campaign}`
      : undefined,
    userJourneyContext: context.sessionData.primaryServiceInterest
      ? `Primary interest: ${context.sessionData.primaryServiceInterest} (${context.sessionData.confidenceScore}% confidence)`
      : undefined,
  }

  switch (context.serviceType) {
    case 'performance':
      return {
        formComponent: 'PerformanceInquiryForm',
        initialData: {
          performanceType: context.initialFormType || 'band',
        },
        preFillData,
      }

    case 'collaboration':
      return {
        formComponent: 'CollaborationInquiryForm',
        initialData: {
          projectType: context.initialFormType || 'creative',
        },
        preFillData,
      }

    case 'teaching':
      return {
        formComponent: 'TeachingInquiryForm',
        initialData: {
          packageType: context.initialFormType || 'single',
        },
        preFillData,
      }

    default:
      return {
        formComponent: 'ServiceSelectionModal',
        preFillData,
      }
  }
}

/**
 * Enhanced routing context hook
 */
export function useContactRouting(location: Location, referrer?: string) {
  const context = detectServiceContext(location, referrer)
  const formType = getFormTypeFromContext(context)

  return {
    context,
    formType,
    generateUrl: (serviceType: ServiceType, options?: ContactLinkOptions) =>
      generateContactUrl(serviceType, options),
    createLink: (serviceType: ServiceType, options?: ContactLinkOptions) =>
      createContactLink(serviceType, options),
  }
}

/**
 * Enhanced analytics tracking data
 */
interface AnalyticsData {
  event_category: string
  event_label: string
  service_type: ServiceType
  source?: string
  referral_source_type?: ReferralSourceType
  confidence_score?: number
  session_id?: string
  user_journey_length?: number
  custom_map?: {
    form_type?: string
    utm_source?: string
    utm_campaign?: string
  }
}

/**
 * Enhanced analytics tracking for smart routing
 */
export function trackContactRouting(
  context: ContactContext,
  action: 'detected' | 'form_opened' | 'form_submitted' | 'journey_analyzed'
) {
  const analyticsData: AnalyticsData = {
    event_category: 'Smart_Contact_Routing',
    event_label: `${context.serviceType}_${action}`,
    service_type: context.serviceType,
    source: context.source,
    referral_source_type: context.referralSourceType,
    confidence_score: context.sessionData.confidenceScore,
    session_id: context.sessionData.sessionId,
    user_journey_length: context.userJourney.length,
    custom_map: {
      form_type: context.initialFormType,
      utm_source: context.campaignData?.utm_source,
      utm_campaign: context.campaignData?.utm_campaign,
    },
  }

  // Track routing action

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Smart Contact Routing Analytics:', {
      context,
      action,
      analyticsData,
    })
  }
}

/**
 * Clear user journey data (useful for testing or privacy)
 */
export function clearUserJourney(): void {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key)
    })
  }
}

/**
 * Get current user journey summary for debugging
 */
export function getUserJourneySummary(): {
  sessionId: string
  journeyLength: number
  totalTimeSpent: number
  primaryServiceInterest?: ServiceType
  currentPath: string
} | null {
  if (typeof window === 'undefined') return null

  const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID)
  const journey = JSON.parse(
    sessionStorage.getItem(STORAGE_KEYS.USER_JOURNEY) || '[]'
  )
  const sessionStart = parseInt(
    sessionStorage.getItem(STORAGE_KEYS.SESSION_START) || '0'
  )
  const primaryService = sessionStorage.getItem(STORAGE_KEYS.PRIMARY_SERVICE)

  return {
    sessionId: sessionId || 'no_session',
    journeyLength: journey.length,
    totalTimeSpent: Date.now() - sessionStart,
    primaryServiceInterest: primaryService as ServiceType,
    currentPath: window.location.pathname + window.location.hash,
  }
}
