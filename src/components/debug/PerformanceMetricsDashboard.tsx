/**
 * Performance Metrics Dashboard Component
 *
 * Comprehensive analytics dashboard for monitoring service performance,
 * conversion funnels, user behavior, and optimization opportunities.
 *
 * Features:
 * - Real-time performance metrics
 * - Service-specific conversion funnels
 * - Cross-service analytics
 * - A/B testing results
 * - Optimization recommendations
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useAdvancedAnalytics,
  PerformanceDashboard,
  // ServicePerformance,
  // OptimizationOpportunity,
  // UserSegment
} from '@/utils/advancedAnalytics'
import { ServiceType } from '@/utils/contactRouting'

/**
 * Props for the Performance Metrics Dashboard
 */
interface PerformanceMetricsDashboardProps {
  /**
   * Whether to show the dashboard
   */
  isVisible?: boolean

  /**
   * Callback when dashboard is closed
   */
  onClose?: () => void

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Performance Metrics Dashboard Component
 */
export const PerformanceMetricsDashboard: React.FC<
  PerformanceMetricsDashboardProps
> = ({ isVisible = false, onClose, className = '' }) => {
  const [dashboardData, setDashboardData] =
    useState<PerformanceDashboard | null>(null)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'funnels' | 'abtests' | 'optimization'
  >('overview')
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] =
    useState<ServiceType>('teaching')

  const {
    getPerformanceDashboard,
    // getOptimizationRecommendations,
    // getConversionFunnel
  } = useAdvancedAnalytics()

  /**
   * Load dashboard data
   */
  useEffect(() => {
    if (isVisible) {
      setLoading(true)
      try {
        const data = getPerformanceDashboard()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [isVisible, getPerformanceDashboard])

  /**
   * Handle tab change
   */
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
  }

  /**
   * Format percentage
   */
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  /**
   * Format currency
   */
  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString()}`
  }

  /**
   * Get service color
   */
  const getServiceColor = (service: ServiceType): string => {
    const colors: Record<ServiceType, string> = {
      teaching: 'text-brand-orange-warm',
      performance: 'text-brand-blue-primary',
      collaboration: 'text-brand-yellow-accent',
    }
    return colors[service]
  }

  /**
   * Get service background color
   */
  const getServiceBgColor = (service: ServiceType): string => {
    const colors: Record<ServiceType, string> = {
      teaching: 'bg-brand-orange-warm/10',
      performance: 'bg-brand-blue-primary/10',
      collaboration: 'bg-brand-yellow-accent/10',
    }
    return colors[service]
  }

  if (!isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${className}`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-neutral-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  Performance Analytics Dashboard
                </h2>
                <p className="text-white/80">
                  Comprehensive insights into service performance and
                  optimization
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close dashboard"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'funnels', label: 'Conversion Funnels', icon: '📈' },
                { id: 'abtests', label: 'A/B Tests', icon: '🧪' },
                { id: 'optimization', label: 'Optimization', icon: '🚀' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as typeof activeTab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-blue-primary text-brand-blue-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-brand-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading dashboard data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && dashboardData && (
                  <div className="space-y-6">
                    {/* Real-time Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Active Users
                            </p>
                            <p className="text-2xl font-bold text-green-900">
                              {dashboardData.realtimeMetrics.activeUsers}
                            </p>
                          </div>
                          <div className="text-green-600 text-2xl">👥</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Active Inquiries
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              {dashboardData.realtimeMetrics.activeInquiries}
                            </p>
                          </div>
                          <div className="text-blue-600 text-2xl">💌</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-800">
                              24h Conversion
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {formatPercentage(
                                dashboardData.realtimeMetrics.conversionRate24h
                              )}
                            </p>
                          </div>
                          <div className="text-purple-600 text-2xl">📊</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-amber-800">
                              Today's Revenue
                            </p>
                            <p className="text-2xl font-bold text-amber-900">
                              {formatCurrency(
                                dashboardData.realtimeMetrics.revenueToday
                              )}
                            </p>
                          </div>
                          <div className="text-amber-600 text-2xl">💰</div>
                        </div>
                      </div>
                    </div>

                    {/* Service Performance */}
                    <div className="bg-neutral-gray-800 border border-neutral-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Service Performance Overview
                      </h3>
                      <div className="space-y-4">
                        {dashboardData.services.map(service => (
                          <div
                            key={service.service}
                            className="border border-neutral-gray-600 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4
                                className={`font-semibold capitalize ${getServiceColor(service.service)}`}
                              >
                                {service.service} Service
                              </h4>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceBgColor(service.service)} ${getServiceColor(service.service)}`}
                              >
                                {formatPercentage(
                                  service.conversionFunnel.conversionRate
                                )}{' '}
                                conversion
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Total Inquiries</p>
                                <p className="font-semibold">
                                  {service.kpis.totalInquiries}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Avg Revenue</p>
                                <p className="font-semibold">
                                  {formatCurrency(
                                    service.kpis.averageRevenuePerUser
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Quality Score</p>
                                <p className="font-semibold">
                                  {service.kpis.serviceQualityScore.toFixed(1)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Time to Convert</p>
                                <p className="font-semibold">
                                  {service.kpis.timeToConversion} days
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Service Metrics */}
                    <div className="bg-neutral-gray-800 border border-neutral-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Cross-Service Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-blue-primary">
                            {formatPercentage(
                              dashboardData.crossServiceMetrics.crossSellRate
                            )}
                          </div>
                          <p className="text-sm text-gray-300">
                            Cross-sell Rate
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-orange-warm">
                            {dashboardData.crossServiceMetrics.averageServicesPerCustomer.toFixed(
                              1
                            )}
                          </div>
                          <p className="text-sm text-gray-300">
                            Avg Services per Customer
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-yellow-accent">
                            {dashboardData.crossServiceMetrics.upsellingEffectiveness.toFixed(
                              1
                            )}
                          </div>
                          <p className="text-sm text-gray-300">
                            Upselling Effectiveness
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversion Funnels Tab */}
                {activeTab === 'funnels' && dashboardData && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Conversion Funnels
                      </h3>
                      <select
                        value={selectedService}
                        onChange={e =>
                          setSelectedService(e.target.value as ServiceType)
                        }
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="teaching">Teaching</option>
                        <option value="performance">Performance</option>
                        <option value="collaboration">Collaboration</option>
                      </select>
                    </div>

                    <div className="bg-neutral-gray-800 border border-neutral-gray-700 rounded-lg p-6">
                      {(() => {
                        const serviceData = dashboardData.services.find(
                          s => s.service === selectedService
                        )
                        if (!serviceData) return <p>No data available</p>

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-semibold capitalize ${getServiceColor(selectedService)}`}
                              >
                                {selectedService} Conversion Funnel
                              </h4>
                              <div className="text-sm text-gray-300">
                                Total Users:{' '}
                                {serviceData.conversionFunnel.totalUsers}
                              </div>
                            </div>

                            {/* Funnel Visualization */}
                            <div className="space-y-3">
                              {serviceData.conversionFunnel.stages.map(
                                (stage, index) => (
                                  <div
                                    key={stage.stageName}
                                    className="relative"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className="flex-shrink-0 w-8 h-8 bg-brand-blue-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-medium capitalize">
                                            {stage.stageName.replace('_', ' ')}
                                          </span>
                                          <div className="flex items-center space-x-4 text-sm">
                                            <span>{stage.users} users</span>
                                            {index > 0 && (
                                              <span
                                                className={
                                                  stage.conversionFromPrevious <
                                                  70
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                                }
                                              >
                                                {formatPercentage(
                                                  stage.conversionFromPrevious
                                                )}{' '}
                                                conversion
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                                            className="bg-brand-blue-primary h-2 rounded-full transition-all duration-300"
                                            style={{
                                              width: `${(stage.users / (serviceData.conversionFunnel.totalUsers || 1)) * 100}%`,
                                            }}
                                          ></div>
                                        </div>
                                        {stage.dropoffRate > 30 && (
                                          <p className="text-xs text-red-600 mt-1">
                                            High dropoff:{' '}
                                            {formatPercentage(
                                              stage.dropoffRate
                                            )}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Dropoff Analysis */}
                            {serviceData.conversionFunnel.dropoffAnalysis
                              .length > 0 && (
                              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                                <h5 className="font-semibold text-red-800 mb-2">
                                  Dropoff Analysis
                                </h5>
                                <div className="space-y-2">
                                  {serviceData.conversionFunnel.dropoffAnalysis.map(
                                    dropoff => (
                                      <div
                                        key={dropoff.stageName}
                                        className="text-sm"
                                      >
                                        <div className="font-medium text-red-700 capitalize">
                                          {dropoff.stageName.replace('_', ' ')}:{' '}
                                          {formatPercentage(
                                            dropoff.dropoffRate
                                          )}{' '}
                                          dropoff
                                        </div>
                                        <div className="text-red-600 ml-4">
                                          • {dropoff.primaryReasons.join(', ')}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}

                {/* A/B Tests Tab */}
                {activeTab === 'abtests' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        A/B Testing Framework
                      </h3>
                      <button className="bg-brand-blue-primary text-white px-4 py-2 rounded-lg hover:bg-brand-blue-secondary transition-colors">
                        Create New Test
                      </button>
                    </div>

                    <div className="bg-neutral-gray-800 border border-neutral-gray-700 rounded-lg p-6">
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🧪</div>
                        <h4 className="text-lg font-semibold mb-2">
                          A/B Testing Framework Ready
                        </h4>
                        <p className="text-gray-300 mb-4">
                          Advanced A/B testing system is implemented and ready
                          for experiments.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                          <div className="p-4 border border-neutral-gray-600 rounded-lg">
                            <div className="text-2xl font-bold text-brand-blue-primary">
                              95%
                            </div>
                            <div className="text-sm text-gray-300">
                              Statistical Confidence
                            </div>
                          </div>
                          <div className="p-4 border border-neutral-gray-600 rounded-lg">
                            <div className="text-2xl font-bold text-brand-orange-warm">
                              Auto
                            </div>
                            <div className="text-sm text-gray-300">
                              Traffic Allocation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optimization Tab */}
                {activeTab === 'optimization' && dashboardData && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Optimization Opportunities
                    </h3>

                    <div className="space-y-4">
                      {dashboardData.optimizationOpportunities.map(
                        (opportunity, index) => (
                          <div
                            key={index}
                            className="bg-neutral-gray-800 border border-neutral-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">
                                  {opportunity.area}
                                </h4>
                                <p className="text-gray-300 text-sm">
                                  {opportunity.description}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    opportunity.impact === 'high'
                                      ? 'bg-red-100 text-red-800'
                                      : opportunity.impact === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {opportunity.impact} impact
                                </div>
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    opportunity.effort === 'low'
                                      ? 'bg-green-100 text-green-800'
                                      : opportunity.effort === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {opportunity.effort} effort
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm font-medium text-brand-blue-primary mb-1">
                                Expected Improvement
                              </div>
                              <div className="text-sm text-gray-300">
                                {opportunity.expectedImprovement}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-white mb-2">
                                Implementation Steps:
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                {opportunity.implementationSteps.map(
                                  (step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {dashboardData.optimizationOpportunities.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🎯</div>
                        <h4 className="text-lg font-semibold mb-2">
                          All Systems Optimized
                        </h4>
                        <p className="text-gray-300">
                          No immediate optimization opportunities detected. Keep
                          monitoring for improvements.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-neutral-gray-900">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div>Last updated: {new Date().toLocaleString()}</div>
              <div>Advanced Analytics System v1.0</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerformanceMetricsDashboard
