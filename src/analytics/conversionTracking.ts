/**
 * Conversion Tracking and Analytics
 * Comprehensive analytics system for tracking conversions, user behavior, and optimization metrics
 */

import type { ServiceType } from '@/types'
import type { UserSession } from '@/utils/userJourney'

export interface AnalyticsEvent {
  eventId: string
  sessionId: string
  userId: string
  eventName: string
  eventType:
    | 'page_view'
    | 'click'
    | 'form_interaction'
    | 'conversion'
    | 'custom'
  timestamp: Date
  properties: Record<string, unknown>
  serviceType?: ServiceType
  journeyStep?: string
  deviceInfo: DeviceInfo
  locationInfo?: LocationInfo
}

export interface DeviceInfo {
  userAgent: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browserName: string
  browserVersion: string
  operatingSystem: string
  screenResolution: string
  viewportSize: string
}

export interface LocationInfo {
  country?: string
  region?: string
  city?: string
  timezone: string
  language: string
}

export interface ConversionTrackingOptions {
  enableAutoTracking?: boolean
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
  trackFormInteractions?: boolean
  trackButtonClicks?: boolean
  enableHeatmaps?: boolean
  enableSessionRecording?: boolean
  dataRetentionDays?: number
}

export interface AnalyticsMetrics {
  totalSessions: number
  uniqueUsers: number
  bounceRate: number
  averageSessionDuration: number
  conversionsTotal: number
  conversionRate: number
  topExitPages: { page: string; exits: number; rate: number }[]
  topEntryPages: { page: string; entries: number; rate: number }[]
  deviceBreakdown: Record<string, number>
  trafficSources: Record<string, number>
  conversionFunnel: ConversionFunnelData
}

export interface ConversionFunnelData {
  steps: {
    stepName: string
    users: number
    conversionRate: number
    dropOffRate: number
  }[]
  totalDropOffs: number
  overallConversionRate: number
}

/**
 * Main Analytics and Conversion Tracking Class
 */
export class ConversionTracker {
  private options: ConversionTrackingOptions
  private sessionData: Map<string, UserSession> = new Map()
  private events: AnalyticsEvent[] = []
  private isInitialized = false

  constructor(options: ConversionTrackingOptions = {}) {
    this.options = {
      enableAutoTracking: true,
      trackScrollDepth: true,
      trackTimeOnPage: true,
      trackFormInteractions: true,
      trackButtonClicks: true,
      enableHeatmaps: false,
      enableSessionRecording: false,
      dataRetentionDays: 30,
      ...options,
    }
  }

  /**
   * Initialize conversion tracking
   */
  initialize(): void {
    if (this.isInitialized) return

    // Set up automatic event tracking
    if (this.options.enableAutoTracking) {
      this.setupAutoTracking()
    }

    // Load existing data from localStorage
    this.loadStoredData()

    // Set up data cleanup
    this.setupDataCleanup()

    this.isInitialized = true
    console.log('Conversion tracking initialized with options:', this.options)
  }

  /**
   * Track a custom event
   */
  trackEvent(
    eventName: string,
    properties: Record<string, unknown> = {},
    eventType: AnalyticsEvent['eventType'] = 'custom'
  ): void {
    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.getCurrentSessionId(),
      userId: this.getCurrentUserId(),
      eventName,
      eventType,
      timestamp: new Date(),
      properties: {
        ...properties,
        url: window.location.href,
        referrer: document.referrer,
        pageTitle: document.title,
      },
      serviceType: properties.serviceType as ServiceType,
      journeyStep: properties.journeyStep as string,
      deviceInfo: this.getDeviceInfo(),
      locationInfo: this.getLocationInfo(),
    }

    this.events.push(event)
    this.persistEvent(event)

    // Send to analytics service (in production)
    this.sendToAnalyticsService(event)

    console.log('Event tracked:', event)
  }

  /**
   * Track page view
   */
  trackPageView(
    path: string,
    serviceType?: ServiceType,
    additionalProps?: Record<string, unknown>
  ): void {
    this.trackEvent(
      'page_view',
      {
        path,
        serviceType,
        timestamp: Date.now(),
        ...additionalProps,
      },
      'page_view'
    )
  }

  /**
   * Track conversion goal achievement
   */
  trackConversion(
    goalId: string,
    goalValue: number = 1,
    properties: Record<string, unknown> = {}
  ): void {
    this.trackEvent(
      'conversion_achieved',
      {
        goalId,
        goalValue,
        conversionTimestamp: Date.now(),
        ...properties,
      },
      'conversion'
    )

    // Update session conversion data
    const sessionId = this.getCurrentSessionId()
    const session = this.sessionData.get(sessionId)
    if (session) {
      session.conversionGoalsAchieved.push(goalId)
      this.sessionData.set(sessionId, session)
    }
  }

  /**
   * Track form interactions
   */
  trackFormStart(
    formId: string,
    formType: string,
    serviceType?: ServiceType
  ): void {
    this.trackEvent(
      'form_started',
      {
        formId,
        formType,
        serviceType,
        startTimestamp: Date.now(),
      },
      'form_interaction'
    )
  }

  trackFormFieldFocus(
    formId: string,
    fieldName: string,
    fieldType: string
  ): void {
    this.trackEvent(
      'form_field_focused',
      {
        formId,
        fieldName,
        fieldType,
        timestamp: Date.now(),
      },
      'form_interaction'
    )
  }

  trackFormFieldComplete(
    formId: string,
    fieldName: string,
    fieldValue: string
  ): void {
    // Don't track sensitive field values
    const sanitizedValue = this.sanitizeFieldValue(fieldName, fieldValue)

    this.trackEvent(
      'form_field_completed',
      {
        formId,
        fieldName,
        fieldLength: fieldValue.length,
        fieldValue: sanitizedValue,
        timestamp: Date.now(),
      },
      'form_interaction'
    )
  }

  trackFormSubmit(
    formId: string,
    formType: string,
    formData: Record<string, unknown>
  ): void {
    // Sanitize form data before tracking
    const sanitizedData = this.sanitizeFormData(formData)

    this.trackEvent(
      'form_submitted',
      {
        formId,
        formType,
        fieldCount: Object.keys(formData).length,
        formData: sanitizedData,
        timestamp: Date.now(),
      },
      'form_interaction'
    )
  }

  trackFormAbandon(
    formId: string,
    completedFields: string[],
    totalFields: number
  ): void {
    this.trackEvent(
      'form_abandoned',
      {
        formId,
        completedFields: completedFields.length,
        totalFields,
        completionRate: (completedFields.length / totalFields) * 100,
        timestamp: Date.now(),
      },
      'form_interaction'
    )
  }

  /**
   * Track button/link clicks
   */
  trackClick(
    element: string,
    elementType: 'button' | 'link' | 'navigation',
    properties: Record<string, unknown> = {}
  ): void {
    this.trackEvent(
      'element_clicked',
      {
        element,
        elementType,
        ...properties,
        timestamp: Date.now(),
      },
      'click'
    )
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number, maxDepth: number): void {
    // Only track significant scroll milestones
    const milestones = [25, 50, 75, 90, 100]
    const currentMilestone = Math.max(...milestones.filter(m => depth >= m))

    if (currentMilestone && !this.hasScrollMilestone(currentMilestone)) {
      this.trackEvent('scroll_depth', {
        depth,
        maxDepth,
        milestone: currentMilestone,
        timestamp: Date.now(),
      })
      this.markScrollMilestone(currentMilestone)
    }
  }

  /**
   * Start session tracking
   */
  startSession(
    userId: string,
    sessionId: string,
    journeyId: string
  ): UserSession {
    const session: UserSession = {
      sessionId,
      userId,
      journeyId,
      currentStep: 'start',
      startTime: new Date(),
      lastActivity: new Date(),
      completedSteps: [],
      conversionGoalsAchieved: [],
      deviceType: this.getDeviceInfo().deviceType,
      referralSource: this.getReferralSource(),
      metadata: {
        scrollDepth: 0,
        timeOnPage: {},
        formInteractions: [],
        clickEvents: [],
      },
    }

    this.sessionData.set(sessionId, session)
    this.persistSession(session)

    this.trackEvent('session_started', {
      sessionId,
      userId,
      journeyId,
    })

    return session
  }

  /**
   * End session tracking
   */
  endSession(sessionId: string, exitPoint?: string): void {
    const session = this.sessionData.get(sessionId)
    if (!session) return

    const sessionDuration = Date.now() - session.startTime.getTime()

    this.trackEvent('session_ended', {
      sessionId,
      sessionDuration,
      exitPoint: exitPoint || session.currentStep,
      conversionsAchieved: session.conversionGoalsAchieved.length,
      stepsCompleted: session.completedSteps.length,
    })

    // Update session with end data
    session.exitPoint = exitPoint || session.currentStep
    session.lastActivity = new Date()
    this.sessionData.set(sessionId, session)
    this.persistSession(session)
  }

  /**
   * Generate analytics metrics
   */
  generateMetrics(dateRange?: { start: Date; end: Date }): AnalyticsMetrics {
    const filteredEvents = dateRange
      ? this.events.filter(
          e => e.timestamp >= dateRange.start && e.timestamp <= dateRange.end
        )
      : this.events

    const sessions = Array.from(this.sessionData.values())
    const filteredSessions = dateRange
      ? sessions.filter(
          s => s.startTime >= dateRange.start && s.startTime <= dateRange.end
        )
      : sessions

    // Calculate basic metrics
    const totalSessions = filteredSessions.length
    const uniqueUsers = new Set(filteredSessions.map(s => s.userId)).size
    const conversions = filteredEvents.filter(
      e => e.eventType === 'conversion'
    ).length
    const conversionRate =
      totalSessions > 0 ? (conversions / totalSessions) * 100 : 0

    // Calculate bounce rate (sessions with only 1 page view)
    const bounceRate = this.calculateBounceRate(
      filteredSessions,
      filteredEvents
    )

    // Calculate average session duration
    const averageSessionDuration =
      this.calculateAverageSessionDuration(filteredSessions)

    // Generate top pages data
    const topExitPages = this.getTopExitPages(filteredSessions)
    const topEntryPages = this.getTopEntryPages(filteredEvents)

    // Device and traffic source breakdown
    const deviceBreakdown = this.getDeviceBreakdown(filteredSessions)
    const trafficSources = this.getTrafficSources(filteredSessions)

    // Conversion funnel analysis
    const conversionFunnel = this.generateConversionFunnel(
      filteredSessions,
      filteredEvents
    )

    return {
      totalSessions,
      uniqueUsers,
      bounceRate,
      averageSessionDuration,
      conversionsTotal: conversions,
      conversionRate,
      topExitPages,
      topEntryPages,
      deviceBreakdown,
      trafficSources,
      conversionFunnel,
    }
  }

  /**
   * A/B Test tracking
   */
  trackABTestAssignment(
    testId: string,
    variantId: string,
    userId: string
  ): void {
    this.trackEvent('ab_test_assigned', {
      testId,
      variantId,
      userId,
      timestamp: Date.now(),
    })
  }

  trackABTestConversion(
    testId: string,
    variantId: string,
    goalId: string,
    userId: string
  ): void {
    this.trackEvent('ab_test_conversion', {
      testId,
      variantId,
      goalId,
      userId,
      timestamp: Date.now(),
    })
  }

  /**
   * Private helper methods
   */
  private setupAutoTracking(): void {
    // Track page views automatically
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname)
    })

    // Track scroll depth
    if (this.options.trackScrollDepth) {
      let scrollTimeout: NodeJS.Timeout
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          const depth =
            (window.scrollY /
              (document.documentElement.scrollHeight - window.innerHeight)) *
            100
          this.trackScrollDepth(depth, 100)
        }, 150)
      })
    }

    // Track button clicks
    if (this.options.trackButtonClicks) {
      document.addEventListener('click', event => {
        const target = event.target as HTMLElement
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          this.trackClick(
            target.textContent || 'unknown',
            target.tagName === 'BUTTON' ? 'button' : 'link',
            {
              href: (target as HTMLAnchorElement).href,
            }
          )
        }
      })
    }

    // Track form interactions
    if (this.options.trackFormInteractions) {
      this.setupFormTracking()
    }
  }

  private setupFormTracking(): void {
    // Track form field interactions
    document.addEventListener('focusin', event => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        const form = target.closest('form')
        const formId = form?.id || `form-${Date.now()}`
        this.trackFormFieldFocus(
          formId,
          target.getAttribute('name') || 'unknown',
          target.tagName.toLowerCase()
        )
      }
    })

    // Track form submissions
    document.addEventListener('submit', event => {
      const form = event.target as HTMLFormElement
      const formId = form.id || `form-${Date.now()}`
      const formData = new FormData(form)
      const dataObject = Object.fromEntries(formData.entries())

      this.trackFormSubmit(formId, form.className || 'unknown', dataObject)
    })
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentSessionId(): string {
    return sessionStorage.getItem('rrish_session_id') || 'unknown'
  }

  private getCurrentUserId(): string {
    return localStorage.getItem('rrish_user_id') || 'anonymous'
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent
    return {
      userAgent: ua,
      deviceType:
        window.innerWidth < 768
          ? 'mobile'
          : window.innerWidth < 1024
            ? 'tablet'
            : 'desktop',
      browserName: this.getBrowserName(ua),
      browserVersion: this.getBrowserVersion(ua),
      operatingSystem: this.getOperatingSystem(ua),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    }
  }

  private getLocationInfo(): LocationInfo {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    }
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/)
    return match ? match[1] : 'Unknown'
  }

  private getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getReferralSource(): string {
    if (document.referrer) {
      try {
        const referrerDomain = new URL(document.referrer).hostname
        if (referrerDomain.includes('google')) return 'Google'
        if (referrerDomain.includes('facebook')) return 'Facebook'
        if (referrerDomain.includes('instagram')) return 'Instagram'
        return referrerDomain
      } catch {
        return 'Unknown'
      }
    }
    return 'Direct'
  }

  private sanitizeFieldValue(fieldName: string, fieldValue: string): string {
    const sensitiveFields = ['password', 'ssn', 'credit', 'card', 'cvv']
    const isSensitive = sensitiveFields.some(field =>
      fieldName.toLowerCase().includes(field)
    )

    return isSensitive ? '[REDACTED]' : fieldValue.substring(0, 100) // Limit length
  }

  private sanitizeFormData(
    formData: Record<string, unknown>
  ): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(formData)) {
      sanitized[key] = this.sanitizeFieldValue(key, String(value))
    }

    return sanitized
  }

  private hasScrollMilestone(milestone: number): boolean {
    const milestones = JSON.parse(
      sessionStorage.getItem('scroll_milestones') || '[]'
    )
    return milestones.includes(milestone)
  }

  private markScrollMilestone(milestone: number): void {
    const milestones = JSON.parse(
      sessionStorage.getItem('scroll_milestones') || '[]'
    )
    milestones.push(milestone)
    sessionStorage.setItem('scroll_milestones', JSON.stringify(milestones))
  }

  private persistEvent(event: AnalyticsEvent): void {
    const events = JSON.parse(localStorage.getItem('rrish_events') || '[]')
    events.push(event)

    // Keep only recent events (based on retention policy)
    const cutoffDate = new Date()
    cutoffDate.setDate(
      cutoffDate.getDate() - (this.options.dataRetentionDays || 30)
    )

    const filteredEvents = events.filter(
      (e: AnalyticsEvent) => new Date(e.timestamp) >= cutoffDate
    )

    localStorage.setItem('rrish_events', JSON.stringify(filteredEvents))
  }

  private persistSession(session: UserSession): void {
    const sessions = JSON.parse(localStorage.getItem('rrish_sessions') || '[]')
    const existingIndex = sessions.findIndex(
      (s: UserSession) => s.sessionId === session.sessionId
    )

    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.push(session)
    }

    localStorage.setItem('rrish_sessions', JSON.stringify(sessions))
  }

  private loadStoredData(): void {
    // Load events
    const storedEvents = JSON.parse(
      localStorage.getItem('rrish_events') || '[]'
    )
    this.events = storedEvents.map(
      (e: AnalyticsEvent & { timestamp: string }) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      })
    )

    // Load sessions
    const storedSessions = JSON.parse(
      localStorage.getItem('rrish_sessions') || '[]'
    )
    storedSessions.forEach(
      (s: UserSession & { startTime: string; lastActivity: string }) => {
        this.sessionData.set(s.sessionId, {
          ...s,
          startTime: new Date(s.startTime),
          lastActivity: new Date(s.lastActivity),
        })
      }
    )
  }

  private setupDataCleanup(): void {
    // Clean up old data periodically
    setInterval(
      () => {
        const cutoffDate = new Date()
        cutoffDate.setDate(
          cutoffDate.getDate() - (this.options.dataRetentionDays || 30)
        )

        // Clean events
        this.events = this.events.filter(e => e.timestamp >= cutoffDate)

        // Clean sessions
        Array.from(this.sessionData.keys()).forEach(sessionId => {
          const session = this.sessionData.get(sessionId)
          if (session && session.startTime < cutoffDate) {
            this.sessionData.delete(sessionId)
          }
        })

        // Persist cleaned data
        localStorage.setItem('rrish_events', JSON.stringify(this.events))
        localStorage.setItem(
          'rrish_sessions',
          JSON.stringify(Array.from(this.sessionData.values()))
        )
      },
      24 * 60 * 60 * 1000
    ) // Daily cleanup
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // In production, send to analytics service
    // Example: Google Analytics, Mixpanel, custom analytics API

    // For now, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }
  }

  private calculateBounceRate(
    sessions: UserSession[],
    events: AnalyticsEvent[]
  ): number {
    const sessionPageViews = new Map<string, number>()

    events
      .filter(e => e.eventType === 'page_view')
      .forEach(e => {
        const count = sessionPageViews.get(e.sessionId) || 0
        sessionPageViews.set(e.sessionId, count + 1)
      })

    const bounces = Array.from(sessionPageViews.values()).filter(
      views => views === 1
    ).length
    return sessions.length > 0 ? (bounces / sessions.length) * 100 : 0
  }

  private calculateAverageSessionDuration(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0

    const totalDuration = sessions.reduce((sum, session) => {
      return (
        sum + (session.lastActivity.getTime() - session.startTime.getTime())
      )
    }, 0)

    return totalDuration / sessions.length / 1000 // Convert to seconds
  }

  private getTopExitPages(
    sessions: UserSession[]
  ): { page: string; exits: number; rate: number }[] {
    const exitCounts = new Map<string, number>()
    const totalSessions = sessions.length

    sessions.forEach(session => {
      if (session.exitPoint) {
        const count = exitCounts.get(session.exitPoint) || 0
        exitCounts.set(session.exitPoint, count + 1)
      }
    })

    return Array.from(exitCounts.entries())
      .map(([page, exits]) => ({
        page,
        exits,
        rate: (exits / totalSessions) * 100,
      }))
      .sort((a, b) => b.exits - a.exits)
      .slice(0, 10)
  }

  private getTopEntryPages(
    events: AnalyticsEvent[]
  ): { page: string; entries: number; rate: number }[] {
    const entryEvents = events.filter(e => e.eventName === 'session_started')
    const entryCounts = new Map<string, number>()
    const totalEntries = entryEvents.length

    entryEvents.forEach(event => {
      const page = (event.properties.path as string) || 'unknown'
      const count = entryCounts.get(page) || 0
      entryCounts.set(page, count + 1)
    })

    return Array.from(entryCounts.entries())
      .map(([page, entries]) => ({
        page,
        entries,
        rate: (entries / totalEntries) * 100,
      }))
      .sort((a, b) => b.entries - a.entries)
      .slice(0, 10)
  }

  private getDeviceBreakdown(sessions: UserSession[]): Record<string, number> {
    const breakdown: Record<string, number> = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
    }

    sessions.forEach(session => {
      breakdown[session.deviceType] = (breakdown[session.deviceType] || 0) + 1
    })

    return breakdown
  }

  private getTrafficSources(sessions: UserSession[]): Record<string, number> {
    const sources: Record<string, number> = {}

    sessions.forEach(session => {
      const source = session.referralSource
      sources[source] = (sources[source] || 0) + 1
    })

    return sources
  }

  private generateConversionFunnel(
    sessions: UserSession[],
    events: AnalyticsEvent[]
  ): ConversionFunnelData {
    // Define funnel steps
    const funnelSteps = [
      { stepName: 'Page Visit', users: 0, conversionRate: 100, dropOffRate: 0 },
      {
        stepName: 'Service Interest',
        users: 0,
        conversionRate: 0,
        dropOffRate: 0,
      },
      { stepName: 'Form Started', users: 0, conversionRate: 0, dropOffRate: 0 },
      {
        stepName: 'Form Completed',
        users: 0,
        conversionRate: 0,
        dropOffRate: 0,
      },
    ]

    const totalUsers = sessions.length
    funnelSteps[0].users = totalUsers

    // Calculate users at each step
    const serviceInterestUsers = new Set(
      events
        .filter(
          e =>
            e.eventName.includes('service') || e.eventName.includes('interest')
        )
        .map(e => e.userId)
    ).size
    funnelSteps[1].users = serviceInterestUsers

    const formStartUsers = new Set(
      events.filter(e => e.eventName === 'form_started').map(e => e.userId)
    ).size
    funnelSteps[2].users = formStartUsers

    const formCompleteUsers = new Set(
      events.filter(e => e.eventName === 'form_submitted').map(e => e.userId)
    ).size
    funnelSteps[3].users = formCompleteUsers

    // Calculate conversion and drop-off rates
    for (let i = 1; i < funnelSteps.length; i++) {
      const previousUsers = funnelSteps[i - 1].users
      const currentUsers = funnelSteps[i].users

      funnelSteps[i].conversionRate =
        previousUsers > 0 ? (currentUsers / previousUsers) * 100 : 0
      funnelSteps[i].dropOffRate = 100 - funnelSteps[i].conversionRate
    }

    const totalDropOffs = totalUsers - formCompleteUsers
    const overallConversionRate =
      totalUsers > 0 ? (formCompleteUsers / totalUsers) * 100 : 0

    return {
      steps: funnelSteps,
      totalDropOffs,
      overallConversionRate,
    }
  }
}

/**
 * Global analytics instance
 */
export const analytics = new ConversionTracker({
  enableAutoTracking: true,
  trackScrollDepth: true,
  trackTimeOnPage: true,
  trackFormInteractions: true,
  trackButtonClicks: true,
  dataRetentionDays: 90,
})

// Initialize analytics when module loads
if (typeof window !== 'undefined') {
  analytics.initialize()
}

export default analytics
