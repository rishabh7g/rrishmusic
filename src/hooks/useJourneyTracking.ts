/**
 * Journey Tracking Hook
 * React hook for tracking user journeys, analytics, and A/B testing
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { ServiceType } from '@/types'
import {
  UserSession,
  JourneyMap,
  JourneyMetrics,
  JOURNEY_MAPS,
  JourneyOptimizer,
} from '@/utils/userJourney'

export interface UseJourneyTrackingOptions {
  serviceType?: ServiceType
  enableAnalytics?: boolean
  enableABTesting?: boolean
  sessionPersistence?: boolean
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
}

export interface UseJourneyTrackingReturn {
  // Current journey state
  currentSession: UserSession | null
  currentJourney: JourneyMap | null
  currentStep: string | null
  journeyProgress: number

  // Analytics
  metrics: JourneyMetrics | null
  conversionGoalsAchieved: string[]

  // Actions
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void
  trackConversionGoal: (goalId: string) => void
  trackPageView: (path: string, serviceType?: ServiceType) => void
  trackFormStart: (formType: string) => void
  trackFormComplete: (formType: string) => void
  updateSessionMetadata: (metadata: Record<string, unknown>) => void

  // Journey control
  startJourney: (journeyId: string) => void
  exitJourney: (exitPoint?: string) => void
  optimizeJourney: () => void

  // A/B Testing
  assignToTest: (testId: string) => void
  recordTestConversion: (goalId: string) => void
}

/**
 * Hook for comprehensive journey tracking and optimization
 */
export function useJourneyTracking(
  options: UseJourneyTrackingOptions = {}
): UseJourneyTrackingReturn {
  const {
    serviceType,
    enableAnalytics = true,
    enableABTesting = false,
    sessionPersistence = true,
    trackScrollDepth = true,
  } = options

  const location = useLocation()

  // Core state
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null)
  const [currentJourney, setCurrentJourney] = useState<JourneyMap | null>(null)
  const [conversionGoalsAchieved, setConversionGoalsAchieved] = useState<
    string[]
  >([])
  const [metrics, setMetrics] = useState<JourneyMetrics | null>(null)

  // Refs for tracking
  const startTimeRef = useRef<Date>(new Date())
  const lastActivityRef = useRef<Date>(new Date())
  const scrollDepthRef = useRef<number>(0)
  const sessionIdRef = useRef<string>('')
  const userIdRef = useRef<string>('')

  /**
   * Start a new journey
   */
  const startJourney = useCallback(
    (journeyId: string) => {
      const journey = Object.values(JOURNEY_MAPS).find(
        map => map.id === journeyId
      )
      if (!journey) {
        console.warn(`Journey not found: ${journeyId}`)
        return
      }

      const newSession: UserSession = {
        sessionId: sessionIdRef.current,
        userId: userIdRef.current,
        journeyId,
        currentStep: journey.startStep,
        startTime: new Date(),
        lastActivity: new Date(),
        completedSteps: [journey.startStep],
        conversionGoalsAchieved: [],
        deviceType: getDeviceType(),
        referralSource: getReferralSource(),
        metadata: {
          scrollDepth: 0,
          timeOnPage: {},
        },
      }

      setCurrentSession(newSession)
      setCurrentJourney(journey)
      setConversionGoalsAchieved([])
      startTimeRef.current = new Date()
      lastActivityRef.current = new Date()

      if (enableAnalytics) {
        trackEvent('journey_started', {
          journeyId,
          startStep: journey.startStep,
        })
      }
    },
    [enableAnalytics, trackEvent]
  )

  /**
   * Track events
   */
  const trackEvent = useCallback(
    (eventName: string, properties: Record<string, unknown> = {}) => {
      if (!enableAnalytics) return

      const eventData = {
        eventName,
        properties: {
          ...properties,
          sessionId: sessionIdRef.current,
          userId: userIdRef.current,
          timestamp: new Date().toISOString(),
          currentStep: currentSession?.currentStep,
          journeyId: currentSession?.journeyId,
          scrollDepth: scrollDepthRef.current,
        },
      }

      // In a real implementation, send to analytics service
      console.log('Journey Event:', eventData)

      // Update last activity
      lastActivityRef.current = new Date()
    },
    [enableAnalytics, currentSession]
  )

  /**
   * Track conversion goals
   */
  const trackConversionGoal = useCallback(
    (goalId: string) => {
      if (!currentSession || !currentJourney) return

      const goal = currentJourney.conversionGoals.find(g => g.id === goalId)
      if (!goal) {
        console.warn(`Conversion goal not found: ${goalId}`)
        return
      }

      if (!conversionGoalsAchieved.includes(goalId)) {
        const newGoals = [...conversionGoalsAchieved, goalId]
        setConversionGoalsAchieved(newGoals)

        // Update session
        setCurrentSession(prev =>
          prev
            ? {
                ...prev,
                conversionGoalsAchieved: newGoals,
                lastActivity: new Date(),
              }
            : null
        )

        // Track the conversion
        trackEvent('conversion_goal_achieved', {
          goalId,
          goalName: goal.name,
          goalValue: goal.value,
          goalType: goal.type,
        })

        // Record test conversion if in A/B test
        recordTestConversion(goalId)
      }
    },
    [
      currentSession,
      currentJourney,
      conversionGoalsAchieved,
      trackEvent,
      recordTestConversion,
    ]
  )

  /**
   * Track page views and step progression
   */
  const trackPageView = useCallback(
    (path: string, serviceType?: ServiceType) => {
      if (!currentSession || !currentJourney) return

      // Find matching step in journey
      const matchingStep = currentJourney.steps.find(
        step =>
          step.path === path ||
          (step.serviceType === serviceType &&
            step.path.includes(serviceType || ''))
      )

      if (matchingStep && matchingStep.id !== currentSession.currentStep) {
        // Update current step
        setCurrentSession(prev =>
          prev
            ? {
                ...prev,
                currentStep: matchingStep.id,
                completedSteps: [...prev.completedSteps, matchingStep.id],
                lastActivity: new Date(),
                metadata: {
                  ...prev.metadata,
                  timeOnPage: {
                    ...prev.metadata.timeOnPage,
                    [prev.currentStep]:
                      Date.now() - lastActivityRef.current.getTime(),
                  },
                },
              }
            : null
        )

        // Check for automatic conversion goals
        if (matchingStep.conversionGoal) {
          trackConversionGoal(matchingStep.conversionGoal)
        }

        trackEvent('step_completed', {
          stepId: matchingStep.id,
          stepName: matchingStep.name,
          path,
          serviceType,
        })
      }
    },
    [currentSession, currentJourney, trackEvent, trackConversionGoal]
  )

  /**
   * Track form interactions
   */
  const trackFormStart = useCallback(
    (formType: string) => {
      trackEvent('form_started', { formType })
      trackConversionGoal('form_submission')
    },
    [trackEvent, trackConversionGoal]
  )

  const trackFormComplete = useCallback(
    (formType: string) => {
      trackEvent('form_completed', { formType })
      trackConversionGoal('inquiry_sent')
    },
    [trackEvent, trackConversionGoal]
  )

  /**
   * Update session metadata
   */
  const updateSessionMetadata = useCallback(
    (metadata: Record<string, unknown>) => {
      setCurrentSession(prev =>
        prev
          ? {
              ...prev,
              metadata: { ...prev.metadata, ...metadata },
              lastActivity: new Date(),
            }
          : null
      )
    },
    []
  )

  /**
   * Exit journey
   */
  const exitJourney = useCallback(
    (exitPoint?: string) => {
      if (!currentSession) return

      const exitData = {
        exitPoint: exitPoint || currentSession.currentStep,
        completionRate:
          currentSession.completedSteps.length /
          (currentJourney?.steps.length || 1),
        timeSpent: Date.now() - currentSession.startTime.getTime(),
        conversionGoalsAchieved: conversionGoalsAchieved.length,
      }

      trackEvent('journey_exited', exitData)

      // Update session with exit point
      setCurrentSession(prev =>
        prev
          ? {
              ...prev,
              exitPoint: exitPoint || prev.currentStep,
              lastActivity: new Date(),
            }
          : null
      )

      // Clear current journey
      setTimeout(() => {
        setCurrentSession(null)
        setCurrentJourney(null)
        setConversionGoalsAchieved([])
      }, 1000)
    },
    [currentSession, currentJourney, conversionGoalsAchieved, trackEvent]
  )

  /**
   * Optimize journey based on current metrics
   */
  const optimizeJourney = useCallback(() => {
    if (!currentJourney) return

    // In a real implementation, this would fetch actual session data
    const mockSessions: UserSession[] = [] // Would be fetched from analytics service

    const journeyMetrics = JourneyOptimizer.analyzeJourney(
      currentJourney.id,
      mockSessions
    )
    setMetrics(journeyMetrics)

    const recommendations = JourneyOptimizer.generateRecommendations(
      journeyMetrics,
      currentJourney
    )

    trackEvent('journey_optimization_performed', {
      optimizationScore: journeyMetrics.optimizationScore,
      frictionPointCount: journeyMetrics.frictionPoints.length,
      recommendationCount: recommendations.length,
    })

    console.log('Journey Optimization Results:', {
      metrics: journeyMetrics,
      recommendations,
    })
  }, [currentJourney, trackEvent])

  /**
   * A/B Testing functions
   */
  const assignToTest = useCallback(
    (testId: string) => {
      if (!enableABTesting) return

      // In a real implementation, fetch test configuration
      // const test = await fetchABTest(testId);
      // const variant = ABTestManager.assignVariant(test, userIdRef.current);

      // Mock implementation
      console.log(`Assigned to A/B test: ${testId}`)
    },
    [enableABTesting]
  )

  const recordTestConversion = useCallback(
    (goalId: string) => {
      trackEvent('ab_test_conversion', {
        goalId,
      })
    },
    [trackEvent]
  )

  /**
   * Initialize session and user tracking
   */
  useEffect(() => {
    // Generate or retrieve user ID
    let userId = localStorage.getItem('rrish_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('rrish_user_id', userId)
    }
    userIdRef.current = userId

    // Generate session ID
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Determine initial journey based on path or service type
    const initialJourney = determineJourneyFromPath(
      location.pathname,
      serviceType
    )
    if (initialJourney) {
      startJourney(initialJourney.id)
    }

    // Set up scroll depth tracking
    if (trackScrollDepth) {
      const handleScroll = () => {
        const scrollPercent =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100
        scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent)
        lastActivityRef.current = new Date()
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname, serviceType, trackScrollDepth, startJourney])

  /**
   * Track page changes
   */
  useEffect(() => {
    if (currentSession && enableAnalytics) {
      trackPageView(location.pathname, serviceType)
      lastActivityRef.current = new Date()
    }
  }, [
    location.pathname,
    serviceType,
    enableAnalytics,
    currentSession,
    trackPageView,
  ])

  /**
   * Persist session data
   */
  useEffect(() => {
    if (sessionPersistence && currentSession) {
      const sessionData = {
        ...currentSession,
        lastActivity: lastActivityRef.current,
        metadata: {
          ...currentSession.metadata,
          scrollDepth: scrollDepthRef.current,
        },
      }
      localStorage.setItem('rrish_current_session', JSON.stringify(sessionData))
    }
  }, [currentSession, sessionPersistence])

  /**
   * Load persisted session on mount
   */
  useEffect(() => {
    if (sessionPersistence) {
      const savedSession = localStorage.getItem('rrish_current_session')
      if (savedSession) {
        try {
          const sessionData = JSON.parse(savedSession)
          // Only restore if session is less than 30 minutes old
          const sessionAge =
            Date.now() - new Date(sessionData.startTime).getTime()
          if (sessionAge < 30 * 60 * 1000) {
            // 30 minutes
            setCurrentSession({
              ...sessionData,
              startTime: new Date(sessionData.startTime),
              lastActivity: new Date(sessionData.lastActivity),
            })
          }
        } catch (error) {
          console.warn('Failed to restore session:', error)
        }
      }
    }
  }, [sessionPersistence])

  /**
   * Computed values
   */
  const journeyProgress = useMemo(() => {
    if (!currentSession || !currentJourney) return 0
    return (
      (currentSession.completedSteps.length / currentJourney.steps.length) * 100
    )
  }, [currentSession, currentJourney])

  const currentStep = currentSession?.currentStep || null

  return {
    // Current journey state
    currentSession,
    currentJourney,
    currentStep,
    journeyProgress,

    // Analytics
    metrics,
    conversionGoalsAchieved,

    // Actions
    trackEvent,
    trackConversionGoal,
    trackPageView,
    trackFormStart,
    trackFormComplete,
    updateSessionMetadata,

    // Journey control
    startJourney,
    exitJourney,
    optimizeJourney,

    // A/B Testing
    assignToTest,
    recordTestConversion,
  }
}

/**
 * Simplified hook for basic journey tracking
 */
export function useSimpleJourneyTracking(serviceType: ServiceType) {
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState<string>('')
  const [eventsTracked, setEventsTracked] = useState<string[]>([])

  const trackSimpleEvent = useCallback(
    (eventName: string) => {
      if (!eventsTracked.includes(eventName)) {
        setEventsTracked(prev => [...prev, eventName])
        console.log(
          `Simple Journey Event: ${eventName} at ${location.pathname}`
        )
      }
    },
    [eventsTracked, location.pathname]
  )

  useEffect(() => {
    // Simple step detection based on path
    const step =
      location.pathname === '/'
        ? 'homepage'
        : location.pathname.includes(serviceType)
          ? `${serviceType}-page`
          : location.pathname.includes('contact')
            ? 'contact-form'
            : 'unknown'

    setCurrentStep(step)
    trackSimpleEvent(`page_view_${step}`)
  }, [location.pathname, serviceType, trackSimpleEvent])

  return {
    currentStep,
    eventsTracked,
    trackEvent: trackSimpleEvent,
  }
}

/**
 * Helper functions
 */
function determineJourneyFromPath(
  path: string,
  serviceType?: ServiceType
): JourneyMap | null {
  if (serviceType && JOURNEY_MAPS[serviceType]) {
    return JOURNEY_MAPS[serviceType]
  }

  // Determine from path
  if (path.includes('/teaching')) return JOURNEY_MAPS.teaching
  if (path.includes('/performance')) return JOURNEY_MAPS.performance
  if (path.includes('/collaboration')) return JOURNEY_MAPS.collaboration

  // Default to teaching journey from homepage
  return JOURNEY_MAPS.teaching
}

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getReferralSource(): string {
  // Check referrer
  if (document.referrer) {
    try {
      const referrerDomain = new URL(document.referrer).hostname
      if (referrerDomain.includes('google')) return 'google'
      if (referrerDomain.includes('facebook')) return 'facebook'
      if (referrerDomain.includes('instagram')) return 'instagram'
      if (referrerDomain.includes('youtube')) return 'youtube'
      return referrerDomain
    } catch {
      return 'unknown'
    }
  }

  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const utm_source = urlParams.get('utm_source')
  if (utm_source) return utm_source

  return 'direct'
}

export default useJourneyTracking
