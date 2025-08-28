/**
 * User Journey Optimization Utilities
 * Comprehensive system for mapping, tracking, and optimizing user journeys across all services
 */

import type { ServiceType } from '@/types'

export interface JourneyStep {
  id: string
  name: string
  path: string
  serviceType?: ServiceType
  isOptional: boolean
  expectedDuration: number // in seconds
  conversionGoal?: string
  exitPoints: string[]
  nextSteps: string[]
}

export interface JourneyMap {
  id: string
  name: string
  description: string
  serviceType: ServiceType
  startStep: string
  steps: JourneyStep[]
  conversionGoals: ConversionGoal[]
  averageCompletionTime: number
  conversionRate: number
}

export interface ConversionGoal {
  id: string
  name: string
  type:
    | 'form_submission'
    | 'booking_completed'
    | 'inquiry_sent'
    | 'email_signup'
    | 'download'
    | 'custom'
  value: number // business value score
  isRequired: boolean
  trackingEvents: string[]
}

export interface JourneyMetrics {
  totalViews: number
  completedJourneys: number
  dropOffPoints: Record<string, number>
  averageTimeSpent: number
  conversionsByGoal: Record<string, number>
  frictionPoints: FrictionPoint[]
  optimizationScore: number
}

export interface FrictionPoint {
  stepId: string
  type:
    | 'high_exit_rate'
    | 'long_time_spent'
    | 'low_conversion'
    | 'form_abandonment'
    | 'navigation_confusion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  suggestions: string[]
  impact: number // percentage impact on conversion
}

export interface UserSession {
  sessionId: string
  userId?: string
  journeyId: string
  currentStep: string
  startTime: Date
  lastActivity: Date
  completedSteps: string[]
  exitPoint?: string
  conversionGoalsAchieved: string[]
  deviceType: 'desktop' | 'mobile' | 'tablet'
  referralSource: string
  metadata: Record<string, unknown>
}

/**
 * Predefined journey maps for each service
 */
export const JOURNEY_MAPS: Record<ServiceType, JourneyMap> = {
  teaching: {
    id: 'teaching-main',
    name: 'Teaching Service Journey',
    description: 'Primary journey for guitar teaching inquiries and bookings',
    serviceType: 'teaching',
    startStep: 'homepage',
    averageCompletionTime: 420, // 7 minutes
    conversionRate: 0.15, // 15%
    steps: [
      {
        id: 'homepage',
        name: 'Homepage Visit',
        path: '/',
        isOptional: false,
        expectedDuration: 30,
        conversionGoal: 'explore_services',
        exitPoints: ['/about', '/contact', 'external'],
        nextSteps: ['teaching-info', 'about', 'contact'],
      },
      {
        id: 'teaching-info',
        name: 'Teaching Information',
        path: '/teaching',
        serviceType: 'teaching',
        isOptional: false,
        expectedDuration: 90,
        conversionGoal: 'interested_in_lessons',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['teaching-pricing', 'contact-teaching'],
      },
      {
        id: 'teaching-pricing',
        name: 'Pricing Exploration',
        path: '/teaching#pricing',
        serviceType: 'teaching',
        isOptional: true,
        expectedDuration: 45,
        conversionGoal: 'pricing_reviewed',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['contact-teaching', 'testimonials'],
      },
      {
        id: 'testimonials',
        name: 'Social Proof Review',
        path: '/teaching#testimonials',
        serviceType: 'teaching',
        isOptional: true,
        expectedDuration: 60,
        conversionGoal: 'trust_established',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['contact-teaching'],
      },
      {
        id: 'contact-teaching',
        name: 'Teaching Contact Form',
        path: '/contact?service=teaching',
        serviceType: 'teaching',
        isOptional: false,
        expectedDuration: 120,
        conversionGoal: 'form_submission',
        exitPoints: ['homepage', '/teaching', 'external'],
        nextSteps: ['form-completion'],
      },
      {
        id: 'form-completion',
        name: 'Form Submission Complete',
        path: '/contact/success',
        serviceType: 'teaching',
        isOptional: false,
        expectedDuration: 15,
        conversionGoal: 'inquiry_sent',
        exitPoints: ['homepage'],
        nextSteps: [],
      },
    ],
    conversionGoals: [
      {
        id: 'explore_services',
        name: 'Service Exploration',
        type: 'custom',
        value: 20,
        isRequired: false,
        trackingEvents: ['page_view_teaching', 'scroll_services_section'],
      },
      {
        id: 'interested_in_lessons',
        name: 'Lesson Interest Indicated',
        type: 'custom',
        value: 40,
        isRequired: false,
        trackingEvents: ['click_learn_more', 'scroll_teaching_details'],
      },
      {
        id: 'pricing_reviewed',
        name: 'Pricing Information Reviewed',
        type: 'custom',
        value: 60,
        isRequired: false,
        trackingEvents: ['click_pricing_section', 'expand_package_details'],
      },
      {
        id: 'trust_established',
        name: 'Social Proof Engagement',
        type: 'custom',
        value: 50,
        isRequired: false,
        trackingEvents: ['read_testimonials', 'play_demo_audio'],
      },
      {
        id: 'form_submission',
        name: 'Contact Form Started',
        type: 'form_submission',
        value: 80,
        isRequired: true,
        trackingEvents: ['form_focus', 'field_completion'],
      },
      {
        id: 'inquiry_sent',
        name: 'Teaching Inquiry Completed',
        type: 'inquiry_sent',
        value: 100,
        isRequired: true,
        trackingEvents: ['form_submit_success', 'confirmation_page_view'],
      },
    ],
  },

  performance: {
    id: 'performance-main',
    name: 'Performance Booking Journey',
    description:
      'Journey for performance booking inquiries with pricing estimation',
    serviceType: 'performance',
    startStep: 'homepage',
    averageCompletionTime: 360, // 6 minutes
    conversionRate: 0.12, // 12%
    steps: [
      {
        id: 'homepage',
        name: 'Homepage Visit',
        path: '/',
        isOptional: false,
        expectedDuration: 30,
        conversionGoal: 'service_discovery',
        exitPoints: ['/about', '/contact', 'external'],
        nextSteps: ['performance-info', 'about', 'contact'],
      },
      {
        id: 'performance-info',
        name: 'Performance Services',
        path: '/performance',
        serviceType: 'performance',
        isOptional: false,
        expectedDuration: 75,
        conversionGoal: 'performance_interest',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['performance-portfolio', 'contact-performance'],
      },
      {
        id: 'performance-portfolio',
        name: 'Portfolio Review',
        path: '/performance#portfolio',
        serviceType: 'performance',
        isOptional: true,
        expectedDuration: 90,
        conversionGoal: 'portfolio_engagement',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['contact-performance'],
      },
      {
        id: 'contact-performance',
        name: 'Performance Inquiry Form',
        path: '/contact?service=performance',
        serviceType: 'performance',
        isOptional: false,
        expectedDuration: 180,
        conversionGoal: 'pricing_estimation',
        exitPoints: ['homepage', '/performance', 'external'],
        nextSteps: ['pricing-review', 'consultation-booking'],
      },
      {
        id: 'pricing-review',
        name: 'Price Estimate Review',
        path: '/contact?service=performance&step=estimate',
        serviceType: 'performance',
        isOptional: true,
        expectedDuration: 60,
        conversionGoal: 'estimate_reviewed',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['consultation-booking', 'form-completion'],
      },
      {
        id: 'consultation-booking',
        name: 'Consultation Booking',
        path: '/contact?service=performance&step=consultation',
        serviceType: 'performance',
        isOptional: true,
        expectedDuration: 90,
        conversionGoal: 'consultation_booked',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['form-completion'],
      },
      {
        id: 'form-completion',
        name: 'Inquiry Submitted',
        path: '/contact/success',
        serviceType: 'performance',
        isOptional: false,
        expectedDuration: 15,
        conversionGoal: 'inquiry_sent',
        exitPoints: ['homepage'],
        nextSteps: [],
      },
    ],
    conversionGoals: [
      {
        id: 'service_discovery',
        name: 'Performance Service Discovery',
        type: 'custom',
        value: 25,
        isRequired: false,
        trackingEvents: ['click_performance_nav', 'hover_performance_section'],
      },
      {
        id: 'performance_interest',
        name: 'Performance Interest',
        type: 'custom',
        value: 45,
        isRequired: false,
        trackingEvents: ['page_view_performance', 'scroll_services_list'],
      },
      {
        id: 'portfolio_engagement',
        name: 'Portfolio Engagement',
        type: 'custom',
        value: 55,
        isRequired: false,
        trackingEvents: ['click_audio_sample', 'view_performance_photos'],
      },
      {
        id: 'pricing_estimation',
        name: 'Pricing Estimation Started',
        type: 'form_submission',
        value: 70,
        isRequired: true,
        trackingEvents: ['form_start_performance', 'pricing_fields_filled'],
      },
      {
        id: 'estimate_reviewed',
        name: 'Price Estimate Reviewed',
        type: 'custom',
        value: 75,
        isRequired: false,
        trackingEvents: ['estimate_displayed', 'estimate_range_viewed'],
      },
      {
        id: 'consultation_booked',
        name: 'Consultation Booked',
        type: 'booking_completed',
        value: 90,
        isRequired: false,
        trackingEvents: ['consultation_form_submit', 'booking_confirmed'],
      },
      {
        id: 'inquiry_sent',
        name: 'Performance Inquiry Sent',
        type: 'inquiry_sent',
        value: 100,
        isRequired: true,
        trackingEvents: ['inquiry_submit_success', 'confirmation_received'],
      },
    ],
  },

  collaboration: {
    id: 'collaboration-main',
    name: 'Collaboration Project Journey',
    description: 'Journey for creative collaboration and project inquiries',
    serviceType: 'collaboration',
    startStep: 'homepage',
    averageCompletionTime: 480, // 8 minutes
    conversionRate: 0.08, // 8%
    steps: [
      {
        id: 'homepage',
        name: 'Homepage Visit',
        path: '/',
        isOptional: false,
        expectedDuration: 30,
        conversionGoal: 'service_discovery',
        exitPoints: ['/about', '/contact', 'external'],
        nextSteps: ['collaboration-info', 'about', 'contact'],
      },
      {
        id: 'collaboration-info',
        name: 'Collaboration Services',
        path: '/collaboration',
        serviceType: 'collaboration',
        isOptional: false,
        expectedDuration: 120,
        conversionGoal: 'collaboration_interest',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['portfolio-review', 'contact-collaboration'],
      },
      {
        id: 'portfolio-review',
        name: 'Creative Portfolio Review',
        path: '/collaboration#portfolio',
        serviceType: 'collaboration',
        isOptional: true,
        expectedDuration: 150,
        conversionGoal: 'creative_alignment',
        exitPoints: ['homepage', '/contact', 'external'],
        nextSteps: ['contact-collaboration'],
      },
      {
        id: 'contact-collaboration',
        name: 'Collaboration Inquiry Form',
        path: '/contact?service=collaboration',
        serviceType: 'collaboration',
        isOptional: false,
        expectedDuration: 240,
        conversionGoal: 'project_scoping',
        exitPoints: ['homepage', '/collaboration', 'external'],
        nextSteps: ['vision-analysis', 'consultation-recommendation'],
      },
      {
        id: 'vision-analysis',
        name: 'Creative Vision Analysis',
        path: '/contact?service=collaboration&step=vision',
        serviceType: 'collaboration',
        isOptional: true,
        expectedDuration: 90,
        conversionGoal: 'vision_articulated',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['pricing-estimation', 'consultation-recommendation'],
      },
      {
        id: 'pricing-estimation',
        name: 'Project Pricing Estimation',
        path: '/contact?service=collaboration&step=estimate',
        serviceType: 'collaboration',
        isOptional: true,
        expectedDuration: 60,
        conversionGoal: 'budget_aligned',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['consultation-recommendation', 'form-completion'],
      },
      {
        id: 'consultation-recommendation',
        name: 'Consultation Recommended',
        path: '/contact?service=collaboration&step=consultation',
        serviceType: 'collaboration',
        isOptional: true,
        expectedDuration: 45,
        conversionGoal: 'consultation_considered',
        exitPoints: ['homepage', 'external'],
        nextSteps: ['form-completion'],
      },
      {
        id: 'form-completion',
        name: 'Project Inquiry Submitted',
        path: '/contact/success',
        serviceType: 'collaboration',
        isOptional: false,
        expectedDuration: 15,
        conversionGoal: 'inquiry_sent',
        exitPoints: ['homepage'],
        nextSteps: [],
      },
    ],
    conversionGoals: [
      {
        id: 'service_discovery',
        name: 'Collaboration Discovery',
        type: 'custom',
        value: 20,
        isRequired: false,
        trackingEvents: ['click_collaboration_nav', 'creative_section_view'],
      },
      {
        id: 'collaboration_interest',
        name: 'Collaboration Interest',
        type: 'custom',
        value: 35,
        isRequired: false,
        trackingEvents: ['page_view_collaboration', 'services_exploration'],
      },
      {
        id: 'creative_alignment',
        name: 'Creative Style Alignment',
        type: 'custom',
        value: 50,
        isRequired: false,
        trackingEvents: ['portfolio_engagement', 'style_match_indicated'],
      },
      {
        id: 'project_scoping',
        name: 'Project Scoping Started',
        type: 'form_submission',
        value: 60,
        isRequired: true,
        trackingEvents: ['collaboration_form_start', 'project_details_entered'],
      },
      {
        id: 'vision_articulated',
        name: 'Creative Vision Articulated',
        type: 'custom',
        value: 70,
        isRequired: false,
        trackingEvents: ['vision_text_completed', 'complexity_assessed'],
      },
      {
        id: 'budget_aligned',
        name: 'Budget Expectations Set',
        type: 'custom',
        value: 75,
        isRequired: false,
        trackingEvents: ['pricing_estimate_viewed', 'budget_range_selected'],
      },
      {
        id: 'consultation_considered',
        name: 'Consultation Considered',
        type: 'custom',
        value: 80,
        isRequired: false,
        trackingEvents: ['consultation_info_viewed', 'meeting_preference_set'],
      },
      {
        id: 'inquiry_sent',
        name: 'Collaboration Inquiry Sent',
        type: 'inquiry_sent',
        value: 100,
        isRequired: true,
        trackingEvents: [
          'collaboration_submit_success',
          'project_confirmation',
        ],
      },
    ],
  },
}

/**
 * Journey analysis and optimization utilities
 */
export class JourneyOptimizer {
  /**
   * Analyze journey metrics and identify friction points
   */
  static analyzeJourney(
    journeyId: string,
    sessions: UserSession[]
  ): JourneyMetrics {
    const journeyMap = Object.values(JOURNEY_MAPS).find(
      map => map.id === journeyId
    )
    if (!journeyMap) {
      throw new Error(`Journey map not found: ${journeyId}`)
    }

    const totalViews = sessions.length
    const completedJourneys = sessions.filter(session =>
      session.conversionGoalsAchieved.includes('inquiry_sent')
    ).length

    const dropOffPoints: Record<string, number> = {}
    const timeSpentByStep: Record<string, number[]> = {}
    const conversionsByGoal: Record<string, number> = {}

    // Initialize tracking objects
    journeyMap.steps.forEach(step => {
      dropOffPoints[step.id] = 0
      timeSpentByStep[step.id] = []
    })

    journeyMap.conversionGoals.forEach(goal => {
      conversionsByGoal[goal.id] = 0
    })

    // Analyze each session
    sessions.forEach(session => {
      // Track drop-off points
      if (session.exitPoint && session.exitPoint !== 'form-completion') {
        dropOffPoints[session.exitPoint] =
          (dropOffPoints[session.exitPoint] || 0) + 1
      }

      // Track time spent
      const sessionTime =
        session.lastActivity.getTime() - session.startTime.getTime()
      const currentStepTime = Math.min(sessionTime / 1000, 600) // Cap at 10 minutes
      if (timeSpentByStep[session.currentStep]) {
        timeSpentByStep[session.currentStep].push(currentStepTime)
      }

      // Track conversions
      session.conversionGoalsAchieved.forEach(goalId => {
        if (conversionsByGoal[goalId] !== undefined) {
          conversionsByGoal[goalId]++
        }
      })
    })

    // Calculate average time spent
    const averageTimeSpent =
      sessions.reduce((total, session) => {
        return (
          total +
          (session.lastActivity.getTime() - session.startTime.getTime()) / 1000
        )
      }, 0) / sessions.length

    // Identify friction points
    const frictionPoints: FrictionPoint[] = this.identifyFrictionPoints(
      journeyMap,
      dropOffPoints,
      timeSpentByStep,
      totalViews
    )

    // Calculate optimization score (0-100)
    const optimizationScore = this.calculateOptimizationScore(
      completedJourneys / totalViews,
      frictionPoints,
      averageTimeSpent,
      journeyMap.averageCompletionTime
    )

    return {
      totalViews,
      completedJourneys,
      dropOffPoints,
      averageTimeSpent,
      conversionsByGoal,
      frictionPoints,
      optimizationScore,
    }
  }

  /**
   * Identify friction points in the journey
   */
  private static identifyFrictionPoints(
    journeyMap: JourneyMap,
    dropOffPoints: Record<string, number>,
    timeSpentByStep: Record<string, number[]>,
    totalViews: number
  ): FrictionPoint[] {
    const frictionPoints: FrictionPoint[] = []

    journeyMap.steps.forEach(step => {
      const dropOffRate = (dropOffPoints[step.id] || 0) / totalViews
      const avgTimeSpent =
        timeSpentByStep[step.id]?.reduce((a, b) => a + b, 0) /
          (timeSpentByStep[step.id]?.length || 1) || 0
      const expectedTime = step.expectedDuration

      // High exit rate friction point
      if (dropOffRate > 0.3) {
        frictionPoints.push({
          stepId: step.id,
          type: 'high_exit_rate',
          severity:
            dropOffRate > 0.5
              ? 'critical'
              : dropOffRate > 0.4
                ? 'high'
                : 'medium',
          description: `${Math.round(dropOffRate * 100)}% of users exit at ${step.name}`,
          suggestions: [
            'Improve page loading speed',
            'Simplify content and navigation',
            'Add clear call-to-action',
            'Reduce information overload',
          ],
          impact: dropOffRate * 100,
        })
      }

      // Long time spent friction point
      if (avgTimeSpent > expectedTime * 2) {
        frictionPoints.push({
          stepId: step.id,
          type: 'long_time_spent',
          severity: avgTimeSpent > expectedTime * 3 ? 'high' : 'medium',
          description: `Users spend ${Math.round(avgTimeSpent)}s at ${step.name} (expected: ${expectedTime}s)`,
          suggestions: [
            'Streamline content presentation',
            'Add progress indicators',
            'Improve information architecture',
            'Add helpful tooltips or guidance',
          ],
          impact: ((avgTimeSpent - expectedTime) / expectedTime) * 20,
        })
      }

      // Form abandonment (for form steps)
      if (step.path.includes('contact') && dropOffRate > 0.4) {
        frictionPoints.push({
          stepId: step.id,
          type: 'form_abandonment',
          severity: dropOffRate > 0.6 ? 'critical' : 'high',
          description: `High form abandonment rate at ${step.name}`,
          suggestions: [
            'Reduce number of required fields',
            'Add form validation feedback',
            'Implement progressive disclosure',
            'Add save progress functionality',
          ],
          impact: dropOffRate * 120, // Forms have higher impact
        })
      }
    })

    return frictionPoints.sort((a, b) => b.impact - a.impact)
  }

  /**
   * Calculate overall optimization score
   */
  private static calculateOptimizationScore(
    conversionRate: number,
    frictionPoints: FrictionPoint[],
    averageTime: number,
    expectedTime: number
  ): number {
    let score = 50 // Base score

    // Conversion rate impact (0-40 points)
    score += Math.min(conversionRate * 200, 40)

    // Friction points impact (deduct 5-15 points per friction point)
    frictionPoints.forEach(friction => {
      const deduction =
        friction.severity === 'critical'
          ? 15
          : friction.severity === 'high'
            ? 10
            : friction.severity === 'medium'
              ? 5
              : 2
      score -= deduction
    })

    // Time efficiency impact (0-10 points)
    const timeEfficiency = Math.min(expectedTime / averageTime, 1)
    score += timeEfficiency * 10

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Generate optimization recommendations
   */
  static generateRecommendations(
    metrics: JourneyMetrics,
    journeyMap: JourneyMap
  ): {
    priority: 'immediate' | 'high' | 'medium' | 'low'
    category: string
    title: string
    description: string
    expectedImpact: number
    implementationEffort: 'low' | 'medium' | 'high'
  }[] {
    const recommendations = []

    // Critical friction points need immediate attention
    metrics.frictionPoints
      .filter(fp => fp.severity === 'critical')
      .forEach(friction => {
        recommendations.push({
          priority: 'immediate' as const,
          category: 'Friction Reduction',
          title: `Address ${friction.type.replace('_', ' ')} at ${friction.stepId}`,
          description: friction.description,
          expectedImpact: friction.impact,
          implementationEffort: 'medium' as const,
        })
      })

    // Conversion optimization opportunities
    if (metrics.completedJourneys / metrics.totalViews < 0.1) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Conversion Optimization',
        title: 'Improve overall conversion rate',
        description: `Current conversion rate is ${Math.round((metrics.completedJourneys / metrics.totalViews) * 100)}%, below industry average`,
        expectedImpact: 25,
        implementationEffort: 'high' as const,
      })
    }

    // Journey flow optimization
    if (metrics.averageTimeSpent > journeyMap.averageCompletionTime * 1.5) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'User Experience',
        title: 'Streamline journey flow',
        description:
          'Users are taking longer than expected to complete the journey',
        expectedImpact: 15,
        implementationEffort: 'medium' as const,
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { immediate: 4, high: 3, medium: 2, low: 1 }
      return (
        priorityOrder[b.priority] - priorityOrder[a.priority] ||
        b.expectedImpact - a.expectedImpact
      )
    })
  }
}

export default {
  JOURNEY_MAPS,
  JourneyOptimizer,
}
