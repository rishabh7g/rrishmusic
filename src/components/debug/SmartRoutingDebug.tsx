/**
 * Smart Routing Debug Component
 *
 * Development component for visualizing and debugging the enhanced smart contact routing system.
 * Shows real-time user journey tracking, confidence scores, referral sources, and routing decisions.
 *
 * Features:
 * - Real-time journey visualization
 * - Confidence score breakdown
 * - Referral source analysis
 * - Session data inspection
 * - Manual routing testing
 * - Analytics event tracking
 */

import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ServiceType,
  ContactContext,
  detectServiceContext,
  clearUserJourney,
  trackContactRouting,
} from '@/utils/contactRouting'

interface SmartRoutingDebugProps {
  /**
   * Whether the debug panel is visible
   */
  isVisible?: boolean

  /**
   * Position of the debug panel
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  /**
   * Whether to show detailed analytics
   */
  showAnalytics?: boolean

  /**
   * Callback when manual service is selected for testing
   */
  onManualServiceSelect?: (service: ServiceType) => void
}

/**
 * Smart Routing Debug Component
 */
export const SmartRoutingDebug: React.FC<SmartRoutingDebugProps> = ({
  isVisible = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  showAnalytics = true,
  onManualServiceSelect,
}) => {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentContext, setCurrentContext] = useState<ContactContext | null>(
    null
  )
  const [refreshKey, setRefreshKey] = useState(0)

  /**
   * Update debug data
   */
  useEffect(() => {
    if (!isVisible) return

    const context = detectServiceContext(location, document.referrer)

    setCurrentContext(context)
  }, [location, isVisible, refreshKey])

  /**
   * Manual refresh function
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  /**
   * Clear journey data
   */
  const handleClearJourney = () => {
    clearUserJourney()
    handleRefresh()
  }

  /**
   * Test manual service routing
   */
  const handleTestService = (service: ServiceType) => {
    if (currentContext) {
      const testContext = { ...currentContext, serviceType: service }
      trackContactRouting(testContext, 'detected')
      onManualServiceSelect?.(service)
    }
  }

  /**
   * Get confidence level styling
   */
  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  /**
   * Position classes
   */
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  if (!isVisible || !currentContext) return null

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Smart Routing Debug
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="text-gray-300 hover:text-white p-1"
                title="Refresh"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-300 hover:text-white p-1"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isExpanded ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsed View */}
        {!isExpanded && (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm capitalize text-gray-900">
                  {currentContext.serviceType}
                </div>
                <div className="text-xs text-gray-500">
                  {currentContext.referralSourceType}
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceStyle(currentContext.sessionData.confidenceScore)}`}
              >
                {currentContext.sessionData.confidenceScore}%
              </div>
            </div>
          </div>
        )}

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Service Detection */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Service Detection
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Detected:</span>
                      <span className="text-sm font-medium capitalize">
                        {currentContext.serviceType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${getConfidenceStyle(currentContext.sessionData.confidenceScore)}`}
                      >
                        {currentContext.sessionData.confidenceScore}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Source:</span>
                      <span className="text-sm font-medium">
                        {currentContext.source}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Referral Information */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Referral Source
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium capitalize">
                        {currentContext.referralSourceType}
                      </span>
                    </div>
                    {currentContext.referrer && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Referrer:</span>
                        <span
                          className="text-sm font-medium truncate max-w-32"
                          title={currentContext.referrer}
                        >
                          {new URL(currentContext.referrer).hostname}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Journey */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    User Journey
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Session ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {currentContext.sessionData.sessionId.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pages:</span>
                      <span className="text-sm font-medium">
                        {currentContext.sessionData.pagesVisited}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time Spent:</span>
                      <span className="text-sm font-medium">
                        {Math.round(
                          currentContext.sessionData.totalTimeSpent / 1000
                        )}
                        s
                      </span>
                    </div>
                    {currentContext.sessionData.primaryServiceInterest && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Primary Interest:
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {currentContext.sessionData.primaryServiceInterest}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Data */}
                {currentContext.campaignData && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Campaign Data
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(currentContext.campaignData).map(
                        ([key, value]) =>
                          value && (
                            <div
                              key={key}
                              className="flex justify-between items-center"
                            >
                              <span className="text-gray-600">{key}:</span>
                              <span
                                className="font-medium truncate max-w-24"
                                title={value}
                              >
                                {value}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

                {/* Journey Steps */}
                {currentContext.userJourney.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Journey Steps
                    </h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {currentContext.userJourney
                        .slice(-3)
                        .map((step, index) => (
                          <div
                            key={index}
                            className="text-xs bg-gray-50 p-2 rounded"
                          >
                            <div className="font-medium">{step.path}</div>
                            <div className="text-gray-500">
                              {step.timeSpent
                                ? `${Math.round(step.timeSpent / 1000)}s`
                                : 'current'}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Manual Testing */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Test Services
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'performance',
                        'collaboration',
                        'teaching',
                        'general',
                      ] as ServiceType[]
                    ).map(service => (
                      <button
                        key={service}
                        onClick={() => handleTestService(service)}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          currentContext.serviceType === service
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-3 space-y-2">
                  <button
                    onClick={handleClearJourney}
                    className="w-full text-xs bg-red-50 text-red-700 py-2 rounded border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Clear Journey Data
                  </button>

                  {showAnalytics && (
                    <button
                      onClick={() =>
                        console.table({
                          Service: currentContext.serviceType,
                          Confidence: `${currentContext.sessionData.confidenceScore}%`,
                          Source: currentContext.source,
                          Referral: currentContext.referralSourceType,
                          'Journey Length': currentContext.userJourney.length,
                          'Session Time': `${Math.round(currentContext.sessionData.totalTimeSpent / 1000)}s`,
                        })
                      }
                      className="w-full text-xs bg-blue-50 text-blue-700 py-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      Log to Console
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default SmartRoutingDebug
