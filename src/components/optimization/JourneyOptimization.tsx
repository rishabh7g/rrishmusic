/**
 * Journey Optimization Component
 * UI component for displaying journey analytics, friction points, and optimization recommendations
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import {
  JourneyMetrics,
  FrictionPoint,
  JourneyMap,
  JourneyOptimizer,
} from '@/utils/userJourney'

export interface JourneyOptimizationProps {
  /** Current journey metrics */
  metrics: JourneyMetrics | null
  /** Journey map for reference */
  journeyMap: JourneyMap | null
  /** Whether to show detailed analytics */
  showDetailedAnalytics?: boolean
  /** Whether to show A/B testing information */
  showABTesting?: boolean
  /** Callback when optimization is triggered */
  onOptimize?: () => void
  /** Callback when A/B test is started */
  onStartABTest?: (config: Record<string, unknown>) => void
  /** Custom CSS classes */
  className?: string
}

export const JourneyOptimization: React.FC<JourneyOptimizationProps> = ({
  metrics,
  journeyMap,
  showABTesting = false,
  onOptimize,
  onStartABTest,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'friction' | 'recommendations' | 'testing'
  >('overview')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showRecommendationDetails, setShowRecommendationDetails] = useState<
    Record<string, boolean>
  >({})

  // Generate recommendations when metrics change
  const recommendations = useMemo(() => {
    if (!metrics || !journeyMap) return []
    return JourneyOptimizer.generateRecommendations(metrics, journeyMap)
  }, [metrics, journeyMap])

  // Handle optimization trigger
  const handleOptimize = async () => {
    if (!onOptimize) return

    setIsOptimizing(true)
    try {
      await onOptimize()
    } finally {
      setIsOptimizing(false)
    }
  }

  // Toggle recommendation details
  const toggleRecommendationDetails = (index: number) => {
    setShowRecommendationDetails(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (!metrics || !journeyMap) {
    return (
      <div className={`p-6 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Journey Data</h3>
          <p className="text-sm">
            Start tracking user journeys to see optimization insights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Journey Optimization
            </h2>
            <p className="text-sm text-gray-600">
              {journeyMap.name} • Optimization Score:{' '}
              {metrics.optimizationScore}/100
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (metrics.completedJourneys / metrics.totalViews) * 100
                )}
                %
              </div>
              <div className="text-xs text-gray-500">Conversion Rate</div>
            </div>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Optimizing...
                </>
              ) : (
                <>
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  Optimize
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimization Score Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Optimization Score
            </span>
            <span
              className={`text-sm font-medium ${
                metrics.optimizationScore >= 80
                  ? 'text-green-600'
                  : metrics.optimizationScore >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {metrics.optimizationScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                metrics.optimizationScore >= 80
                  ? 'bg-green-500'
                  : metrics.optimizationScore >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.optimizationScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            {
              key: 'friction',
              label: 'Friction Points',
              icon: ExclamationTriangleIcon,
              badge: metrics.frictionPoints.length,
            },
            {
              key: 'recommendations',
              label: 'Recommendations',
              icon: LightBulbIcon,
              badge: recommendations.length,
            },
            ...(showABTesting
              ? [{ key: 'testing', label: 'A/B Testing', icon: UserGroupIcon }]
              : []),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`relative px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewTab metrics={metrics} journeyMap={journeyMap} />
            </motion.div>
          )}

          {activeTab === 'friction' && (
            <motion.div
              key="friction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FrictionPointsTab
                frictionPoints={metrics.frictionPoints}
                journeyMap={journeyMap}
              />
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RecommendationsTab
                recommendations={recommendations}
                showDetails={showRecommendationDetails}
                onToggleDetails={toggleRecommendationDetails}
              />
            </motion.div>
          )}

          {activeTab === 'testing' && showABTesting && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ABTestingTab onStartTest={onStartABTest} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Overview Tab Component
 */
const OverviewTab: React.FC<{
  metrics: JourneyMetrics
  journeyMap: JourneyMap
}> = ({ metrics, journeyMap }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <EyeIcon className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-2xl font-semibold text-gray-900">
              {metrics.completedJourneys.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Completed Journeys</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center">
          <ClockIcon className="h-8 w-8 text-yellow-600" />
          <div className="ml-3">
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(metrics.averageTimeSpent / 60)}m
            </p>
            <p className="text-sm text-gray-600">Avg. Time Spent</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center">
          <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
          <div className="ml-3">
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(
                (metrics.completedJourneys / metrics.totalViews) * 100
              )}
              %
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>

    {/* Conversion Goals */}
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">
        Conversion Goals Performance
      </h3>
      {journeyMap.conversionGoals.map(goal => {
        const achieved = metrics.conversionsByGoal[goal.id] || 0
        const rate = (achieved / metrics.totalViews) * 100

        return (
          <div
            key={goal.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{goal.name}</p>
              <p className="text-sm text-gray-600">
                {goal.type} • Value: {goal.value}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{achieved}</p>
              <p className="text-sm text-gray-600">{rate.toFixed(1)}% rate</p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

/**
 * Friction Points Tab Component
 */
const FrictionPointsTab: React.FC<{
  frictionPoints: FrictionPoint[]
  journeyMap: JourneyMap
}> = ({ frictionPoints, journeyMap }) => (
  <div className="space-y-4">
    {frictionPoints.length === 0 ? (
      <div className="text-center py-8">
        <CheckCircleIcon className="h-12 w-12 mx-auto text-green-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Major Friction Points
        </h3>
        <p className="text-gray-600">
          Your journey is performing well with minimal friction detected.
        </p>
      </div>
    ) : (
      frictionPoints.map((friction, index) => {
        const step = journeyMap.steps.find(s => s.id === friction.stepId)
        const severityColors = {
          critical: 'border-red-500 bg-red-50',
          high: 'border-orange-500 bg-orange-50',
          medium: 'border-yellow-500 bg-yellow-50',
          low: 'border-blue-500 bg-blue-50',
        }

        return (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${severityColors[friction.severity]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon
                    className={`h-5 w-5 ${
                      friction.severity === 'critical'
                        ? 'text-red-600'
                        : friction.severity === 'high'
                          ? 'text-orange-600'
                          : friction.severity === 'medium'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                    }`}
                  />
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      friction.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : friction.severity === 'high'
                          ? 'bg-orange-200 text-orange-800'
                          : friction.severity === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {friction.severity.toUpperCase()}
                  </span>
                  <span className="font-medium text-gray-900">
                    {step?.name || friction.stepId}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{friction.description}</p>

                {friction.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Suggested Improvements:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {friction.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-gray-900">
                  {friction.impact.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Impact</div>
              </div>
            </div>
          </div>
        )
      })
    )}
  </div>
)

/**
 * Recommendations Tab Component
 */
const RecommendationsTab: React.FC<{
  recommendations: {
    priority: 'immediate' | 'high' | 'medium' | 'low'
    category: string
    title: string
    description: string
    expectedImpact: number
    implementationEffort: 'low' | 'medium' | 'high'
  }[]
  showDetails: Record<string, boolean>
  onToggleDetails: (index: number) => void
}> = ({ recommendations, showDetails, onToggleDetails }) => (
  <div className="space-y-4">
    {recommendations.length === 0 ? (
      <div className="text-center py-8">
        <LightBulbIcon className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Recommendations Available
        </h3>
        <p className="text-gray-600">
          Your journey is well optimized. Keep monitoring for new insights.
        </p>
      </div>
    ) : (
      recommendations.map((rec, index) => {
        const priorityColors = {
          immediate: 'border-red-500 bg-red-50',
          high: 'border-orange-500 bg-orange-50',
          medium: 'border-yellow-500 bg-yellow-50',
          low: 'border-blue-500 bg-blue-50',
        }

        return (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <LightBulbIcon className="h-5 w-5 text-yellow-600" />
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rec.priority === 'immediate'
                        ? 'bg-red-200 text-red-800'
                        : rec.priority === 'high'
                          ? 'bg-orange-200 text-orange-800'
                          : rec.priority === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">{rec.category}</span>
                </div>

                <h3 className="font-medium text-gray-900 mb-2">{rec.title}</h3>
                <p className="text-gray-700">{rec.description}</p>

                <button
                  onClick={() => onToggleDetails(index)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {showDetails[index] ? 'Hide Details' : 'Show Details'}
                </button>

                <AnimatePresence>
                  {showDetails[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Expected Impact:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {rec.expectedImpact}%
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Implementation:
                          </span>
                          <span
                            className={`ml-2 ${
                              rec.implementationEffort === 'high'
                                ? 'text-red-600'
                                : rec.implementationEffort === 'medium'
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                            }`}
                          >
                            {rec.implementationEffort} effort
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )
      })
    )}
  </div>
)

/**
 * A/B Testing Tab Component
 */
const ABTestingTab: React.FC<{
  onStartTest?: (config: Record<string, unknown>) => void
}> = ({ onStartTest }) => (
  <div className="space-y-6">
    <div className="text-center py-8">
      <UserGroupIcon className="h-12 w-12 mx-auto text-blue-500 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">A/B Testing</h3>
      <p className="text-gray-600 mb-4">
        Create and manage experiments to optimize your journey.
      </p>

      <button
        onClick={() => onStartTest?.({})}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create New Test
      </button>
    </div>
  </div>
)

export default JourneyOptimization
