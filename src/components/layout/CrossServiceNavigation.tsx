import React, { useState, useEffect } from 'react'
import { ServiceType } from '@/types/content'
import {
  ServiceRecommendation,
  CrossServiceSuggestion,
} from '@/types/serviceRelationships'
import { useServiceTransitions } from '@/hooks/useServiceTransitions'
import {
  getServiceRecommendations,
  getCrossServiceSuggestions,
} from '@/utils/serviceRecommendations'

/**
 * Cross-Service Navigation Component
 * Intelligent navigation that suggests related services and enables seamless transitions
 */

interface CrossServiceNavigationProps {
  currentService: ServiceType
  variant?: 'minimal' | 'card' | 'banner' | 'sidebar'
  maxRecommendations?: number
  showCrossServiceSuggestions?: boolean
  className?: string
  onNavigate?: (service: ServiceType) => void
}

export const CrossServiceNavigation: React.FC<CrossServiceNavigationProps> = ({
  currentService,
  variant = 'card',
  maxRecommendations = 2,
  showCrossServiceSuggestions = true,
  className = '',
  onNavigate,
}) => {
  const [recommendations, setRecommendations] = useState<
    ServiceRecommendation[]
  >([])
  const [crossSuggestions, setCrossSuggestions] = useState<
    CrossServiceSuggestion[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  const { transitionToService, userContext, trackInteraction } =
    useServiceTransitions()

  // Load recommendations when component mounts or service changes
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true)

      try {
        // Get service recommendations
        const serviceRecs = getServiceRecommendations(
          currentService,
          userContext
        )
        setRecommendations(serviceRecs.slice(0, maxRecommendations))

        // Get cross-service suggestions if enabled
        if (showCrossServiceSuggestions) {
          const crossRecs = getCrossServiceSuggestions(
            currentService,
            userContext
          )
          setCrossSuggestions(crossRecs.slice(0, 2))
        }
      } catch (error) {
        console.error('Failed to load service recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [
    currentService,
    userContext,
    maxRecommendations,
    showCrossServiceSuggestions,
  ])

  const handleServiceClick = (
    targetService: ServiceType,
    method: string = 'recommendation'
  ) => {
    // Track interaction
    trackInteraction('click', {
      targetService,
      method,
      sourceComponent: 'CrossServiceNavigation',
    })

    // Call custom handler if provided
    onNavigate?.(targetService)

    // Navigate to service
    transitionToService(targetService, {
      method: method as
        | 'direct_link'
        | 'navigation'
        | 'recommendation'
        | 'search',
      userIntent: 'service_recommendation',
    })
  }

  if (isLoading) {
    return (
      <CrossServiceNavigationSkeleton variant={variant} className={className} />
    )
  }

  if (recommendations.length === 0 && crossSuggestions.length === 0) {
    return null
  }

  switch (variant) {
    case 'minimal':
      return (
        <MinimalNavigation
          {...{
            recommendations,
            crossSuggestions,
            handleServiceClick,
            className,
          }}
        />
      )
    case 'banner':
      return (
        <BannerNavigation
          {...{
            recommendations,
            crossSuggestions,
            handleServiceClick,
            className,
          }}
        />
      )
    case 'sidebar':
      return (
        <SidebarNavigation
          {...{
            recommendations,
            crossSuggestions,
            handleServiceClick,
            className,
          }}
        />
      )
    default:
      return (
        <CardNavigation
          {...{
            recommendations,
            crossSuggestions,
            handleServiceClick,
            className,
          }}
        />
      )
  }
}

/**
 * Minimal Navigation Variant
 */
const MinimalNavigation: React.FC<{
  recommendations: ServiceRecommendation[]
  crossSuggestions: CrossServiceSuggestion[]
  handleServiceClick: (service: ServiceType, method?: string) => void
  className: string
}> = ({ recommendations, handleServiceClick, className }) => (
  <div className={`cross-service-minimal flex gap-2 ${className}`}>
    {recommendations.map((rec, index) => (
      <button
        key={`${rec.service}-${index}`}
        onClick={() => handleServiceClick(rec.service)}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
      >
        {rec.actionText}
      </button>
    ))}
  </div>
)

/**
 * Card Navigation Variant (Default)
 */
const CardNavigation: React.FC<{
  recommendations: ServiceRecommendation[]
  crossSuggestions: CrossServiceSuggestion[]
  handleServiceClick: (service: ServiceType, method?: string) => void
  className: string
}> = ({ recommendations, crossSuggestions, handleServiceClick, className }) => (
  <div className={`cross-service-cards space-y-6 ${className}`}>
    {/* Service Recommendations */}
    {recommendations.length > 0 && (
      <div className="service-recommendations">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          You might also be interested in:
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <ServiceRecommendationCard
              key={`${rec.service}-${index}`}
              recommendation={rec}
              onNavigate={handleServiceClick}
            />
          ))}
        </div>
      </div>
    )}

    {/* Cross-Service Suggestions */}
    {crossSuggestions.length > 0 && (
      <div className="cross-service-suggestions">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Complete Package Options:
        </h3>
        <div className="space-y-4">
          {crossSuggestions.map((suggestion, index) => (
            <CrossServiceSuggestionCard
              key={`suggestion-${index}`}
              suggestion={suggestion}
              onNavigate={handleServiceClick}
            />
          ))}
        </div>
      </div>
    )}
  </div>
)

/**
 * Banner Navigation Variant
 */
const BannerNavigation: React.FC<{
  recommendations: ServiceRecommendation[]
  crossSuggestions: CrossServiceSuggestion[]
  handleServiceClick: (service: ServiceType, method?: string) => void
  className: string
}> = ({ recommendations, crossSuggestions, handleServiceClick, className }) => {
  const topSuggestion = crossSuggestions[0] || null
  const topRecommendation = recommendations[0] || null

  if (!topSuggestion && !topRecommendation) return null

  return (
    <div
      className={`cross-service-banner bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {topSuggestion ? (
            <>
              <h4 className="font-semibold text-gray-900 mb-2">
                {topSuggestion.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {topSuggestion.description}
              </p>
              <div className="flex gap-2">
                {topSuggestion.services.slice(0, 2).map(service => (
                  <button
                    key={service}
                    onClick={() => handleServiceClick(service, 'banner')}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    Explore {getServiceDisplayName(service)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            topRecommendation && (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {getServiceDisplayName(topRecommendation.service)}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {topRecommendation.reasoning[0]}
                </p>
                <button
                  onClick={() =>
                    handleServiceClick(topRecommendation.service, 'banner')
                  }
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                >
                  {topRecommendation.actionText}
                </button>
              </>
            )
          )}
        </div>
        <div className="flex-shrink-0 ml-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
            🎵
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Sidebar Navigation Variant
 */
const SidebarNavigation: React.FC<{
  recommendations: ServiceRecommendation[]
  crossSuggestions: CrossServiceSuggestion[]
  handleServiceClick: (service: ServiceType, method?: string) => void
  className: string
}> = ({ recommendations, crossSuggestions, handleServiceClick, className }) => (
  <div className={`cross-service-sidebar space-y-4 ${className}`}>
    <h4 className="font-semibold text-gray-900">More Services</h4>

    {recommendations.map((rec, index) => (
      <div
        key={`${rec.service}-${index}`}
        className="border-l-2 border-gray-200 pl-4 py-2"
      >
        <button
          onClick={() => handleServiceClick(rec.service, 'sidebar')}
          className="text-left w-full group"
        >
          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {getServiceDisplayName(rec.service)}
          </div>
          <div className="text-sm text-gray-600 mt-1">{rec.reasoning[0]}</div>
        </button>
      </div>
    ))}

    {crossSuggestions.length > 0 && (
      <div className="pt-4 border-t border-gray-200">
        <h5 className="font-medium text-gray-900 mb-2">Package Deals</h5>
        {crossSuggestions.slice(0, 1).map((suggestion, index) => (
          <div key={`cross-${index}`} className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-sm text-gray-900 mb-1">
              {suggestion.title}
            </div>
            <div className="text-xs text-gray-600">
              {suggestion.description}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

/**
 * Service Recommendation Card Component
 */
const ServiceRecommendationCard: React.FC<{
  recommendation: ServiceRecommendation
  onNavigate: (service: ServiceType, method?: string) => void
}> = ({ recommendation, onNavigate }) => {
  const priorityColors = {
    high: 'border-green-200 bg-green-50',
    medium: 'border-blue-200 bg-blue-50',
    low: 'border-gray-200 bg-gray-50',
  }

  return (
    <div
      className={`recommendation-card border-2 ${priorityColors[recommendation.priority]} rounded-xl p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900">
          {getServiceDisplayName(recommendation.service)}
        </h4>
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-2 h-2 bg-current rounded-full mr-1"></span>
          {Math.round(recommendation.confidence * 100)}% match
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {recommendation.reasoning[0]}
      </p>

      <button
        onClick={() => onNavigate(recommendation.service, 'card')}
        className="w-full bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors"
      >
        {recommendation.actionText}
      </button>
    </div>
  )
}

/**
 * Cross-Service Suggestion Card Component
 */
const CrossServiceSuggestionCard: React.FC<{
  suggestion: CrossServiceSuggestion
  onNavigate: (service: ServiceType, method?: string) => void
}> = ({ suggestion, onNavigate }) => (
  <div className="cross-suggestion-card border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {suggestion.benefits.slice(0, 2).map((benefit, index) => (
            <div
              key={index}
              className="flex items-center text-xs text-gray-600"
            >
              <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 ml-4">
        {suggestion.services.slice(0, 2).map(service => (
          <button
            key={service}
            onClick={() => onNavigate(service, 'cross_service')}
            className="px-3 py-1 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 rounded-full border border-gray-200 transition-colors whitespace-nowrap"
          >
            {getServiceDisplayName(service)}
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={() => onNavigate(suggestion.services[0], 'cross_service_cta')}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      {suggestion.callToAction}
    </button>
  </div>
)

/**
 * Loading Skeleton Component
 */
const CrossServiceNavigationSkeleton: React.FC<{
  variant: string
  className: string
}> = ({ variant, className }) => {
  if (variant === 'minimal') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[1, 2].map(i => (
          <div
            key={i}
            className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Utility function to get service display name
 */
function getServiceDisplayName(service: ServiceType): string {
  const names = {
    teaching: 'Guitar Lessons',
    performance: 'Live Performances',
    collaboration: 'Music Collaboration',
  }
  return names[service]
}

export default CrossServiceNavigation
