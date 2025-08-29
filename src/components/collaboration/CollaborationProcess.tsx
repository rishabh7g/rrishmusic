import React, { memo } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../sections/ServiceSectionTemplate'

/**
 * Collaboration Process Section
 * Explains the collaborative workflow and approach
 */
export const CollaborationProcess: React.FC<ServiceSectionProps> = memo(
  ({ className = '', animate = true }) => {
    const processSteps = [
      {
        id: 1,
        title: 'Initial Consultation',
        description:
          'We discuss your creative vision, project goals, and timeline to ensure perfect alignment.',
        duration: '1-2 hours',
        deliverables: [
          'Project brief',
          'Creative direction',
          'Timeline proposal',
        ],
        icon: '🤝',
      },
      {
        id: 2,
        title: 'Creative Development',
        description:
          'Collaborative ideation and development phase where we explore musical directions and arrangements.',
        duration: '1-2 weeks',
        deliverables: [
          'Demo tracks',
          'Arrangement sketches',
          'Feedback sessions',
        ],
        icon: '💡',
      },
      {
        id: 3,
        title: 'Production Phase',
        description:
          'Full production with recording, mixing, and refinement until we achieve the perfect result.',
        duration: '2-6 weeks',
        deliverables: ['Master recordings', 'Mix versions', 'Production notes'],
        icon: '🎵',
      },
      {
        id: 4,
        title: 'Delivery & Support',
        description:
          'Final delivery of all assets with ongoing support for promotion and future collaborations.',
        duration: '1 week',
        deliverables: [
          'Final masters',
          'Promotional materials',
          'Usage rights',
        ],
        icon: '🚀',
      },
    ]

    return (
      <ServiceSectionTemplate
        serviceType="collaboration"
        title="Collaboration Process"
        subtitle="A structured approach to creative partnerships that ensures exceptional results"
        sectionId="collaboration-process"
        variant="featured"
        background="white"
        className={className}
        animate={animate}
      >
        <div className="process-steps space-y-8">
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className="process-step flex items-start space-x-6"
            >
              {/* Step Number & Icon */}
              <div className="step-indicator flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                  {step.icon}
                </div>
                <div className="text-sm font-medium text-green-600">
                  Step {step.id}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="w-px h-16 bg-green-200 mt-4"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="step-content flex-1">
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="step-header mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <div className="text-sm text-green-600 font-medium">
                      {step.duration}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{step.description}</p>

                  <div className="step-deliverables">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Deliverables:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((deliverable, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ServiceSectionTemplate>
    )
  }
)

CollaborationProcess.displayName = 'CollaborationProcess'

export default CollaborationProcess
