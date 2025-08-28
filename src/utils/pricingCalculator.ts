/**
 * Pricing Calculator Utilities
 * Dynamic pricing calculations for teaching services with discount logic
 */

export interface LessonPackage {
  id: string
  name: string
  sessions: number
  price: number
  originalPrice?: number
  savings?: number
  description: string
  popular?: boolean
  features?: string[]
  duration: number // minutes
  validity: number // days
}

export interface PricingCalculation {
  basePrice: number
  finalPrice: number
  savings: number
  savingsPercentage: number
  pricePerLesson: number
  totalValue: number
  discountApplied: boolean
}

export interface PricingOptions {
  includeDiscount?: boolean
  customDiscountRate?: number
  bulkDiscountThreshold?: number
  loyaltyDiscount?: number
}

/**
 * Base pricing configuration for teaching services
 */
export const TEACHING_PRICING_CONFIG = {
  baseLessonPrice: 50, // Base price per lesson
  trialLessonPrice: 45, // Special trial lesson price

  // Bulk discount tiers
  discountTiers: [
    { minSessions: 4, discountPercent: 5, name: 'Foundation Discount' },
    { minSessions: 8, discountPercent: 10, name: 'Transformation Discount' },
    { minSessions: 12, discountPercent: 15, name: 'Mastery Discount' },
  ],

  // Package configurations
  packages: [
    {
      id: 'trial',
      sessions: 1,
      duration: 30,
      validity: 30,
      features: [
        '30-minute session',
        'Teaching style introduction',
        'Goal assessment',
      ],
    },
    {
      id: 'single',
      sessions: 1,
      duration: 60,
      validity: 60,
      features: [
        'Full 60-minute lesson',
        'Personalized instruction',
        'Practice materials',
      ],
    },
    {
      id: 'foundation',
      sessions: 4,
      duration: 60,
      validity: 90,
      features: [
        '4 weekly lessons',
        '5% bulk discount',
        'Progress tracking',
        'Email support',
      ],
    },
    {
      id: 'transformation',
      sessions: 8,
      duration: 60,
      validity: 120,
      popular: true,
      features: [
        '8 weekly lessons',
        '10% bulk discount',
        'Comprehensive curriculum',
        'Performance preparation',
      ],
    },
  ],
}

/**
 * Calculate pricing for a lesson package with dynamic discounts
 */
export function calculatePackagePricing(
  sessions: number,
  options: PricingOptions = {}
): PricingCalculation {
  const {
    includeDiscount = true,
    customDiscountRate,
    bulkDiscountThreshold = 4,
    loyaltyDiscount = 0,
  } = options

  const basePrice =
    sessions === 1 && sessions < bulkDiscountThreshold
      ? TEACHING_PRICING_CONFIG.baseLessonPrice
      : TEACHING_PRICING_CONFIG.baseLessonPrice

  const totalBasePrice = basePrice * sessions

  // Calculate bulk discount
  let discountPercent = 0
  let discountApplied = false

  if (includeDiscount && sessions >= bulkDiscountThreshold) {
    // Find applicable discount tier
    const applicableTier = TEACHING_PRICING_CONFIG.discountTiers
      .filter(tier => sessions >= tier.minSessions)
      .sort((a, b) => b.discountPercent - a.discountPercent)[0]

    if (applicableTier) {
      discountPercent = customDiscountRate ?? applicableTier.discountPercent
      discountApplied = true
    }
  }

  // Add loyalty discount if applicable
  if (loyaltyDiscount > 0) {
    discountPercent = Math.min(discountPercent + loyaltyDiscount, 25) // Cap at 25%
    discountApplied = true
  }

  const savings = Math.round(totalBasePrice * (discountPercent / 100))
  const finalPrice = totalBasePrice - savings
  const pricePerLesson = Math.round(finalPrice / sessions)

  return {
    basePrice: totalBasePrice,
    finalPrice,
    savings,
    savingsPercentage: discountPercent,
    pricePerLesson,
    totalValue: totalBasePrice,
    discountApplied,
  }
}

/**
 * Get package details with calculated pricing
 */
export function getPackageWithPricing(
  packageId: string,
  options: PricingOptions = {}
): LessonPackage | null {
  const packageConfig = TEACHING_PRICING_CONFIG.packages.find(
    pkg => pkg.id === packageId
  )
  if (!packageConfig) return null

  const pricing = calculatePackagePricing(packageConfig.sessions, options)

  // Special handling for trial lesson
  if (packageId === 'trial') {
    return {
      id: packageConfig.id,
      name: 'Trial Lesson',
      sessions: packageConfig.sessions,
      price: TEACHING_PRICING_CONFIG.trialLessonPrice,
      description: 'Shorter 30-minute introduction to my teaching style',
      duration: packageConfig.duration,
      validity: packageConfig.validity,
      features: packageConfig.features,
    }
  }

  return {
    id: packageConfig.id,
    name: getPackageName(packageConfig.sessions),
    sessions: packageConfig.sessions,
    price: pricing.finalPrice,
    originalPrice: pricing.discountApplied ? pricing.basePrice : undefined,
    savings: pricing.discountApplied ? pricing.savings : undefined,
    description: getPackageDescription(packageConfig.sessions, pricing),
    popular: packageConfig.popular,
    duration: packageConfig.duration,
    validity: packageConfig.validity,
    features: packageConfig.features,
  }
}

/**
 * Get all available packages with pricing
 */
export function getAllPackagesWithPricing(
  options: PricingOptions = {}
): LessonPackage[] {
  return TEACHING_PRICING_CONFIG.packages
    .map(pkg => getPackageWithPricing(pkg.id, options))
    .filter((pkg): pkg is LessonPackage => pkg !== null)
}

/**
 * Compare packages side by side
 */
export function comparePackages(
  packageIds: string[],
  options: PricingOptions = {}
): Array<{
  package: LessonPackage
  pricing: PricingCalculation
  valueScore: number
}> {
  return packageIds
    .map(id => {
      const pkg = getPackageWithPricing(id, options)
      if (!pkg) return null

      const pricing = calculatePackagePricing(pkg.sessions, options)
      const valueScore = calculateValueScore(pkg, pricing)

      return { package: pkg, pricing, valueScore }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.valueScore - a.valueScore)
}

/**
 * Calculate value score for package comparison
 */
function calculateValueScore(
  pkg: LessonPackage,
  pricing: PricingCalculation
): number {
  let score = 0

  // Base score from sessions (more sessions = higher value)
  score += pkg.sessions * 10

  // Discount bonus
  if (pricing.discountApplied) {
    score += pricing.savingsPercentage * 2
  }

  // Popular package bonus
  if (pkg.popular) {
    score += 20
  }

  // Feature count bonus
  if (pkg.features) {
    score += pkg.features.length * 5
  }

  // Efficiency score (better price per lesson)
  const efficiencyScore = Math.max(
    0,
    TEACHING_PRICING_CONFIG.baseLessonPrice - pricing.pricePerLesson
  )
  score += efficiencyScore

  return Math.round(score)
}

/**
 * Generate package name based on sessions
 */
function getPackageName(sessions: number): string {
  const nameMap: Record<number, string> = {
    1: 'Single Lesson',
    4: 'Foundation Package',
    8: 'Transformation Intensive',
    12: 'Mastery Program',
  }

  return nameMap[sessions] || `${sessions}-Lesson Package`
}

/**
 * Generate package description with pricing context
 */
function getPackageDescription(
  sessions: number,
  pricing: PricingCalculation
): string {
  const baseDescriptions: Record<number, string> = {
    1: 'Perfect for trying out my teaching style or addressing specific challenges',
    4: 'Build solid foundations with weekly lessons',
    8: 'Comprehensive package for serious improvement',
    12: 'Complete transformation with extensive curriculum',
  }

  let description =
    baseDescriptions[sessions] || `${sessions} personalized guitar lessons`

  if (pricing.discountApplied) {
    description += ` - Save ${pricing.savingsPercentage}% with bulk pricing!`
  }

  return description
}

/**
 * Format price for display
 */
export function formatPrice(
  amount: number,
  showCents: boolean = false
): string {
  return showCents ? `$${amount.toFixed(2)}` : `$${Math.round(amount)}`
}

/**
 * Calculate savings message for display
 */
export function getSavingsMessage(pricing: PricingCalculation): string {
  if (!pricing.discountApplied || pricing.savings === 0) {
    return ''
  }

  return `Save ${formatPrice(pricing.savings)} (${pricing.savingsPercentage}%) compared to individual lessons!`
}

/**
 * Get recommended package based on user profile
 */
export function getRecommendedPackage(
  experience: 'beginner' | 'intermediate' | 'advanced',
  commitment: 'low' | 'medium' | 'high',
  budget: 'low' | 'medium' | 'high'
): string {
  // Logic for package recommendation
  if (commitment === 'low' || budget === 'low') {
    return experience === 'beginner' ? 'trial' : 'single'
  }

  if (commitment === 'high' && budget === 'high') {
    return 'transformation'
  }

  return 'foundation' // Most balanced option
}

export default {
  TEACHING_PRICING_CONFIG,
  calculatePackagePricing,
  getPackageWithPricing,
  getAllPackagesWithPricing,
  comparePackages,
  formatPrice,
  getSavingsMessage,
  getRecommendedPackage,
}
