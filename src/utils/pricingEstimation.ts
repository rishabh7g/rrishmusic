/**
 * Pricing Estimation Utilities
 * Dynamic pricing algorithms for Performance and Collaboration services based on project scope
 */

export interface PriceEstimate {
  estimatedRange: {
    min: number
    max: number
  }
  basePrice: number
  adjustments: PriceAdjustment[]
  totalAdjustment: number
  confidence: 'low' | 'medium' | 'high'
  factors: string[]
  consultationRecommended: boolean
  estimateValidDays: number
}

export interface PriceAdjustment {
  factor: string
  impact: 'increase' | 'decrease'
  percentage: number
  amount: number
  description: string
}

/**
 * Performance event pricing configuration
 */
export const PERFORMANCE_PRICING_CONFIG = {
  baseRates: {
    solo: {
      acoustic: 300,
      electric: 400,
      both: 450,
    },
    band: {
      acoustic: 800,
      electric: 1200,
      both: 1400,
    },
  },

  eventTypeMultipliers: {
    wedding: 1.5, // Premium event
    corporate: 1.3, // Professional event
    venue: 1.0, // Standard rate
    private: 1.2, // Personal event
    other: 1.0, // Base rate
  },

  durationAdjustments: {
    '1-2': 0, // 1-2 hours baseline
    '3-4': 0.25, // 25% increase for 3-4 hours
    '5-6': 0.5, // 50% increase for 5-6 hours
    '7-8': 0.75, // 75% increase for 7-8 hours
    'full-day': 1.0, // 100% increase for full day
    'multi-day': 1.5, // 150% increase for multi-day
  },

  guestCountAdjustments: {
    small: 0, // Under 50 guests
    medium: 0.1, // 50-150 guests
    large: 0.2, // 150-300 guests
    xlarge: 0.3, // Over 300 guests
  },

  seasonalAdjustments: {
    peak: 0.25, // Wedding season (May-October)
    standard: 0, // Off-season
    holiday: 0.4, // Holiday seasons
  },

  locationAdjustments: {
    local: 0, // Within 30 miles
    regional: 0.15, // 30-100 miles
    distant: 0.3, // Over 100 miles
    international: 0.5, // International travel
  },
}

/**
 * Collaboration project pricing configuration
 */
export const COLLABORATION_PRICING_CONFIG = {
  baseRates: {
    studio: 150, // Per hour studio work
    creative: 100, // Per hour creative consultation
    partnership: 200, // Per hour partnership/production
    other: 125, // General collaboration rate
  },

  scopeMultipliers: {
    'single-session': 1.0, // One-time session
    'short-term': 0.9, // 10% discount for short projects
    'long-term': 0.8, // 20% discount for long projects
    ongoing: 0.75, // 25% discount for ongoing work
  },

  timelineAdjustments: {
    urgent: 0.5, // 50% rush charge
    flexible: -0.1, // 10% discount for flexible timeline
    'specific-date': 0.2, // 20% premium for specific dates
    ongoing: -0.05, // 5% discount for ongoing work
  },

  experienceAdjustments: {
    'first-time': 0.1, // 10% premium for first-time guidance
    'some-experience': 0, // Standard rate
    experienced: -0.05, // 5% discount for experienced clients
    professional: -0.1, // 10% discount for professional projects
  },

  complexityFactors: {
    simple: 0, // Straightforward project
    moderate: 0.2, // Some complexity
    complex: 0.4, // High complexity
    expert: 0.6, // Requires specialized expertise
  },
}

/**
 * Estimate performance pricing based on event details
 */
export function estimatePerformancePricing(data: {
  performanceFormat: 'solo' | 'band' | 'flexible' | 'unsure'
  performanceStyle: 'acoustic' | 'electric' | 'both' | 'unsure'
  eventType: 'wedding' | 'corporate' | 'venue' | 'private' | 'other'
  duration: string
  guestCount?: string
  eventDate?: string
  venueAddress?: string
  budgetRange: string
}): PriceEstimate {
  // Determine base rate
  let basePrice = 0
  const adjustments: PriceAdjustment[] = []
  const factors: string[] = []

  // Handle format flexibility
  let format = data.performanceFormat
  let style = data.performanceStyle

  if (format === 'flexible' || format === 'unsure') {
    format = 'solo' // Conservative estimate
    factors.push('Format flexibility considered')
  }

  if (style === 'unsure') {
    style = 'acoustic' // Conservative estimate
    factors.push('Performance style flexibility considered')
  }

  // Get base rate
  basePrice =
    PERFORMANCE_PRICING_CONFIG.baseRates[format as 'solo' | 'band'][
      style as 'acoustic' | 'electric' | 'both'
    ]

  // Event type adjustment
  const eventMultiplier =
    PERFORMANCE_PRICING_CONFIG.eventTypeMultipliers[data.eventType]
  if (eventMultiplier !== 1.0) {
    const adjustment = basePrice * (eventMultiplier - 1)
    adjustments.push({
      factor: 'Event Type',
      impact: eventMultiplier > 1 ? 'increase' : 'decrease',
      percentage: Math.round((eventMultiplier - 1) * 100),
      amount: adjustment,
      description: `${data.eventType} events ${eventMultiplier > 1 ? 'require premium service' : 'qualify for standard rate'}`,
    })
    factors.push(`Event type: ${data.eventType}`)
  }

  // Duration adjustment
  const durationKey = parseDuration(data.duration)
  const durationMultiplier =
    PERFORMANCE_PRICING_CONFIG.durationAdjustments[durationKey]
  if (durationMultiplier > 0) {
    const adjustment = basePrice * durationMultiplier
    adjustments.push({
      factor: 'Duration',
      impact: 'increase',
      percentage: Math.round(durationMultiplier * 100),
      amount: adjustment,
      description: `Extended performance duration (${data.duration})`,
    })
    factors.push(`Duration: ${data.duration}`)
  }

  // Guest count adjustment
  if (data.guestCount) {
    const guestKey = parseGuestCount(data.guestCount)
    const guestMultiplier =
      PERFORMANCE_PRICING_CONFIG.guestCountAdjustments[guestKey]
    if (guestMultiplier > 0) {
      const adjustment = basePrice * guestMultiplier
      adjustments.push({
        factor: 'Guest Count',
        impact: 'increase',
        percentage: Math.round(guestMultiplier * 100),
        amount: adjustment,
        description: `Larger venue/audience size (${data.guestCount} guests)`,
      })
      factors.push(`Guest count: ${data.guestCount}`)
    }
  }

  // Seasonal adjustment (if event date provided)
  if (data.eventDate) {
    const season = getEventSeason(data.eventDate)
    const seasonMultiplier =
      PERFORMANCE_PRICING_CONFIG.seasonalAdjustments[season]
    if (seasonMultiplier > 0) {
      const adjustment = basePrice * seasonMultiplier
      adjustments.push({
        factor: 'Seasonal Demand',
        impact: 'increase',
        percentage: Math.round(seasonMultiplier * 100),
        amount: adjustment,
        description: `${season} season pricing`,
      })
      factors.push(`Season: ${season}`)
    }
  }

  // Calculate totals
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.amount, 0)
  const finalPrice = basePrice * eventMultiplier + totalAdjustment

  // Generate range (±20% for consultation discussion)
  const rangeVariance = finalPrice * 0.2

  // Determine confidence based on available information
  const confidence = getEstimateConfidence([
    data.performanceFormat !== 'unsure' &&
      data.performanceFormat !== 'flexible',
    data.performanceStyle !== 'unsure',
    Boolean(data.guestCount),
    Boolean(data.eventDate),
    data.eventType !== 'other',
  ])

  return {
    estimatedRange: {
      min: Math.round(finalPrice - rangeVariance),
      max: Math.round(finalPrice + rangeVariance),
    },
    basePrice: Math.round(basePrice),
    adjustments,
    totalAdjustment: Math.round(totalAdjustment),
    confidence,
    factors,
    consultationRecommended:
      confidence === 'low' || data.budgetRange === 'discuss',
    estimateValidDays: 30,
  }
}

/**
 * Estimate collaboration pricing based on project details
 */
export function estimateCollaborationPricing(data: {
  projectType: 'studio' | 'creative' | 'partnership' | 'other'
  projectScope: 'single-session' | 'short-term' | 'long-term' | 'ongoing'
  timeline: 'urgent' | 'flexible' | 'specific-date' | 'ongoing'
  experience: 'first-time' | 'some-experience' | 'experienced' | 'professional'
  creativeVision: string
  budgetRange: string
}): PriceEstimate {
  const baseRate = COLLABORATION_PRICING_CONFIG.baseRates[data.projectType]
  const adjustments: PriceAdjustment[] = []
  const factors: string[] = []

  // Project scope adjustment
  const scopeMultiplier =
    COLLABORATION_PRICING_CONFIG.scopeMultipliers[data.projectScope]
  factors.push(`Project scope: ${data.projectScope}`)

  // Timeline adjustment
  const timelineAdjustment =
    COLLABORATION_PRICING_CONFIG.timelineAdjustments[data.timeline]
  if (timelineAdjustment !== 0) {
    adjustments.push({
      factor: 'Timeline',
      impact: timelineAdjustment > 0 ? 'increase' : 'decrease',
      percentage: Math.round(Math.abs(timelineAdjustment) * 100),
      amount: baseRate * timelineAdjustment,
      description: getTimelineDescription(data.timeline),
    })
    factors.push(`Timeline: ${data.timeline}`)
  }

  // Experience adjustment
  const experienceAdjustment =
    COLLABORATION_PRICING_CONFIG.experienceAdjustments[data.experience]
  if (experienceAdjustment !== 0) {
    adjustments.push({
      factor: 'Experience Level',
      impact: experienceAdjustment > 0 ? 'increase' : 'decrease',
      percentage: Math.round(Math.abs(experienceAdjustment) * 100),
      amount: baseRate * experienceAdjustment,
      description: getExperienceDescription(data.experience),
    })
    factors.push(`Experience: ${data.experience}`)
  }

  // Project complexity based on creative vision length and keywords
  const complexity = assessProjectComplexity(data.creativeVision)
  const complexityAdjustment =
    COLLABORATION_PRICING_CONFIG.complexityFactors[complexity]
  if (complexityAdjustment > 0) {
    adjustments.push({
      factor: 'Project Complexity',
      impact: 'increase',
      percentage: Math.round(complexityAdjustment * 100),
      amount: baseRate * complexityAdjustment,
      description: `${complexity} project complexity level`,
    })
    factors.push(`Complexity: ${complexity}`)
  }

  // Calculate estimated hours based on scope
  const estimatedHours = getProjectHours(data.projectScope, complexity)

  // Calculate totals
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.amount, 0)
  const finalHourlyRate = baseRate * scopeMultiplier + totalAdjustment
  const totalEstimate = finalHourlyRate * estimatedHours

  // Generate range
  const rangeVariance = totalEstimate * 0.25 // ±25% for project variation

  const confidence = getEstimateConfidence([
    data.projectType !== 'other',
    data.creativeVision.length > 50,
    data.timeline !== 'ongoing',
    data.budgetRange !== 'discuss',
  ])

  return {
    estimatedRange: {
      min: Math.round(totalEstimate - rangeVariance),
      max: Math.round(totalEstimate + rangeVariance),
    },
    basePrice: Math.round(baseRate * estimatedHours),
    adjustments,
    totalAdjustment: Math.round(totalAdjustment * estimatedHours),
    confidence,
    factors: [...factors, `Estimated hours: ${estimatedHours}`],
    consultationRecommended:
      confidence === 'low' ||
      complexity === 'expert' ||
      data.budgetRange === 'discuss',
    estimateValidDays: 14, // Shorter validity for project-based work
  }
}

/**
 * Helper functions
 */

function parseDuration(duration: string): string {
  const lower = duration.toLowerCase()
  if (lower.includes('1') || lower.includes('2')) return '1-2'
  if (lower.includes('3') || lower.includes('4')) return '3-4'
  if (lower.includes('5') || lower.includes('6')) return '5-6'
  if (lower.includes('7') || lower.includes('8')) return '7-8'
  if (lower.includes('full') || lower.includes('day')) return 'full-day'
  if (lower.includes('multi') || lower.includes('weekend')) return 'multi-day'
  return '1-2' // Default
}

function parseGuestCount(guestCount: string): string {
  const count = parseInt(guestCount.replace(/\D/g, ''), 10)
  if (isNaN(count)) return 'small'
  if (count < 50) return 'small'
  if (count < 150) return 'medium'
  if (count < 300) return 'large'
  return 'xlarge'
}

function getEventSeason(eventDate: string): string {
  const date = new Date(eventDate)
  const month = date.getMonth() + 1 // 1-12

  // Wedding peak season (May-October)
  if (month >= 5 && month <= 10) return 'peak'

  // Holiday season (November-December)
  if (month >= 11) return 'holiday'

  return 'standard'
}

function assessProjectComplexity(
  creativeVision: string
): 'simple' | 'moderate' | 'complex' | 'expert' {
  const vision = creativeVision.toLowerCase()
  const complexKeywords = [
    'complex',
    'advanced',
    'professional',
    'sophisticated',
    'intricate',
  ]
  const expertKeywords = [
    'experimental',
    'innovative',
    'cutting-edge',
    'masterclass',
    'expert',
  ]

  if (expertKeywords.some(keyword => vision.includes(keyword))) return 'expert'
  if (complexKeywords.some(keyword => vision.includes(keyword)))
    return 'complex'
  if (vision.length > 200) return 'moderate'
  return 'simple'
}

function getProjectHours(scope: string, complexity: string): number {
  const baseHours = {
    'single-session': 2,
    'short-term': 8,
    'long-term': 24,
    ongoing: 16, // Average monthly hours
  }

  const complexityMultipliers = {
    simple: 1,
    moderate: 1.25,
    complex: 1.5,
    expert: 2,
  }

  return Math.round(
    baseHours[scope as keyof typeof baseHours] *
      complexityMultipliers[complexity as keyof typeof complexityMultipliers]
  )
}

function getEstimateConfidence(factors: boolean[]): 'low' | 'medium' | 'high' {
  const trueCount = factors.filter(Boolean).length
  const total = factors.length
  const percentage = trueCount / total

  if (percentage >= 0.8) return 'high'
  if (percentage >= 0.5) return 'medium'
  return 'low'
}

function getTimelineDescription(timeline: string): string {
  const descriptions = {
    urgent: 'Rush delivery premium',
    flexible: 'Flexible schedule discount',
    'specific-date': 'Fixed deadline premium',
    ongoing: 'Long-term commitment discount',
  }
  return descriptions[timeline as keyof typeof descriptions] || ''
}

function getExperienceDescription(experience: string): string {
  const descriptions = {
    'first-time': 'Additional guidance and support',
    'some-experience': 'Standard collaboration rate',
    experienced: 'Streamlined process discount',
    professional: 'Professional project discount',
  }
  return descriptions[experience as keyof typeof descriptions] || ''
}

/**
 * Format price estimate for display
 */
export function formatPriceEstimate(estimate: PriceEstimate): {
  range: string
  confidence: string
  summary: string
} {
  const range = `$${estimate.estimatedRange.min.toLocaleString()} - $${estimate.estimatedRange.max.toLocaleString()}`
  const confidence = `${estimate.confidence} confidence`
  const summary = estimate.consultationRecommended
    ? 'Consultation recommended for accurate pricing'
    : `Based on ${estimate.factors.length} project factors`

  return { range, confidence, summary }
}

export default {
  estimatePerformancePricing,
  estimateCollaborationPricing,
  formatPriceEstimate,
  PERFORMANCE_PRICING_CONFIG,
  COLLABORATION_PRICING_CONFIG,
}
