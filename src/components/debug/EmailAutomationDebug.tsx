/**
 * Email Automation Debug Panel
 *
 * Development tool for testing and monitoring email automation sequences.
 * Shows scheduled emails, active sequences, and provides testing capabilities.
 */

import React, { useState } from 'react'
import {
  useEmailAutomation,
  useEmailAutomationDebug,
  useContactFormAutomation,
} from '@/hooks/useEmailAutomation'
import type {
  ServiceType,
  EmailTemplateType,
  ContactFormData,
} from '@/services/emailAutomation'

interface EmailAutomationDebugProps {
  isVisible?: boolean
  onClose?: () => void
}

export const EmailAutomationDebug: React.FC<EmailAutomationDebugProps> = ({
  isVisible = true,
  onClose,
}) => {
  const { systemStatus, previewTemplate, setEnabled } = useEmailAutomation()
  const { debugData, debugStats, loadDebugData, clearDebugData, isDebugMode } =
    useEmailAutomationDebug()

  const [selectedService, setSelectedService] =
    useState<ServiceType>('performance')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(
    'immediate_confirmation'
  )
  const [testFormData, setTestFormData] = useState<
    Omit<ContactFormData, 'serviceType'>
  >({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test inquiry for debugging purposes.',
  })

  const testAutomation = useContactFormAutomation(selectedService)

  if (!isDebugMode || !isVisible) {
    return null
  }

  const handleTestSubmission = async () => {
    await testAutomation.handleFormSubmission(testFormData)
    setTimeout(loadDebugData, 1000) // Refresh debug data after submission
  }

  const serviceTypes: ServiceType[] = [
    'performance',
    'teaching',
    'collaboration',
    'general',
  ]
  const templateTypes: EmailTemplateType[] = [
    'immediate_confirmation',
    'follow_up_24h',
    'follow_up_3days',
    'follow_up_1week',
    'final_follow_up',
  ]

  const previewedTemplate = previewTemplate(
    selectedService,
    selectedTemplate,
    testFormData
  )

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border-2 border-blue-500 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="font-bold text-sm">Email Automation Debug</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-lg font-bold"
            aria-label="Close debug panel"
          >
            ×
          </button>
        )}
      </div>

      <div className="p-4 overflow-y-auto max-h-80">
        {/* System Status */}
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h4 className="font-semibold text-sm mb-2">System Status</h4>
          <div className="text-xs space-y-1">
            <div>
              Enabled:{' '}
              <span
                className={
                  systemStatus.enabled ? 'text-green-600' : 'text-red-600'
                }
              >
                {systemStatus.enabled ? 'Yes' : 'No'}
              </span>
            </div>
            <div>Templates: {systemStatus.templatesCount}</div>
            <div>Debug Mode: {systemStatus.debugMode ? 'Yes' : 'No'}</div>
          </div>
          <button
            onClick={() => setEnabled(!systemStatus.enabled)}
            className={`mt-2 px-2 py-1 text-xs rounded ${
              systemStatus.enabled
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {systemStatus.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Debug Statistics */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-sm mb-2">Debug Statistics</h4>
          <div className="text-xs space-y-1">
            <div>Active Sequences: {debugStats.activeSequences}</div>
            <div>Scheduled Emails: {debugStats.totalScheduledEmails}</div>
            <div>By Service:</div>
            <div className="ml-2">
              {Object.entries(debugStats.emailsByService).map(
                ([service, count]) => (
                  <div key={service} className="flex justify-between">
                    <span>{service}:</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={loadDebugData}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
            <button
              onClick={clearDebugData}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* Test Form */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-sm mb-2">Test Automation</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium">Service Type:</label>
              <select
                value={selectedService}
                onChange={e =>
                  setSelectedService(e.target.value as ServiceType)
                }
                className="w-full text-xs border rounded px-2 py-1"
              >
                {serviceTypes.map(service => (
                  <option key={service} value={service}>
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Test Name:</label>
              <input
                type="text"
                value={testFormData.name}
                onChange={e =>
                  setTestFormData(prev => ({ ...prev, name: e.target.value }))
                }
                className="w-full text-xs border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Test Email:</label>
              <input
                type="email"
                value={testFormData.email}
                onChange={e =>
                  setTestFormData(prev => ({ ...prev, email: e.target.value }))
                }
                className="w-full text-xs border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleTestSubmission}
              disabled={testAutomation.isInitializing}
              className="w-full px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {testAutomation.isInitializing ? 'Testing...' : 'Test Sequence'}
            </button>
            {testAutomation.isSuccess && (
              <div className="text-xs text-green-600">
                ✓ Sequence initiated successfully! (
                {testAutomation.scheduledEmails} emails scheduled)
              </div>
            )}
            {testAutomation.error && (
              <div className="text-xs text-red-600">
                ✗ Error: {testAutomation.error}
              </div>
            )}
          </div>
        </div>

        {/* Template Preview */}
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <h4 className="font-semibold text-sm mb-2">Template Preview</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium">Template:</label>
              <select
                value={selectedTemplate}
                onChange={e =>
                  setSelectedTemplate(e.target.value as EmailTemplateType)
                }
                className="w-full text-xs border rounded px-2 py-1"
              >
                {templateTypes.map(template => (
                  <option key={template} value={template}>
                    {template.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            {previewedTemplate && (
              <div className="bg-white border rounded p-2">
                <div className="text-xs">
                  <div className="font-medium">Subject:</div>
                  <div className="mb-2 bg-gray-100 p-1 rounded">
                    {previewedTemplate.subject}
                  </div>
                  <div className="font-medium">Preview:</div>
                  <div className="bg-gray-100 p-1 rounded max-h-20 overflow-y-auto text-xs">
                    {previewedTemplate.textContent.substring(0, 200)}...
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Delay: {previewedTemplate.delayHours}h | Tags:{' '}
                    {previewedTemplate.tags.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sequences */}
        {debugData.sequences.length > 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <h4 className="font-semibold text-sm mb-2">Recent Sequences</h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {debugData.sequences
                .slice(-3)
                .reverse()
                .map(sequence => (
                  <div
                    key={sequence.sequenceId}
                    className="text-xs bg-white p-1 rounded border"
                  >
                    <div className="flex justify-between">
                      <span>{sequence.customerName}</span>
                      <span
                        className={`px-1 rounded ${
                          sequence.status === 'active'
                            ? 'bg-green-200'
                            : 'bg-gray-200'
                        }`}
                      >
                        {sequence.status}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      {sequence.serviceType} • {sequence.emailsScheduled} emails
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailAutomationDebug
