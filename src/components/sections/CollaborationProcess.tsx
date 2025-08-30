/**
 * Collaboration Process Section Component
 *
 * Visual workflow section explaining the collaboration process from
 * initial brief to final execution with clear step-by-step guidance.
 *
 * Features:
 * - Brief → Scope → Execution workflow visualization
 * - Interactive process steps with detailed explanations
 * - Visual progress indicators and icons
 * - Mobile-responsive design
 * - Professional and approachable presentation
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'

interface CollaborationProcessProps {
  className?: string
}

/**
 * Process steps data structure
 */
const processSteps = [
  {
    id: 'brief',
    title: 'Initial Brief',
    subtitle: 'Understanding Your Vision',
    description:
      'We start with a detailed discussion about your creative vision, goals, and requirements. This includes understanding the style, scope, timeline, and any specific elements you want to incorporate into the collaboration.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    features: [
      'Vision alignment discussion',
      'Style and genre exploration',
      'Timeline and budget planning',
      'Creative goals definition',
    ],
    duration: '1-2 sessions',
    deliverables: [
      'Creative brief document',
      'Project timeline',
      'Budget outline',
    ],
  },
  {
    id: 'scope',
    title: 'Scope Planning',
    subtitle: 'Defining the Framework',
    description:
      "Together, we develop a comprehensive project scope that outlines roles, responsibilities, creative direction, and deliverables. This ensures we're aligned on expectations and sets the foundation for successful collaboration.",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: [
      'Detailed project roadmap',
      'Role and responsibility mapping',
      'Creative milestone definition',
      'Resource allocation planning',
    ],
    duration: '1-2 weeks',
    deliverables: [
      'Project scope document',
      'Collaboration agreement',
      'Milestone schedule',
    ],
  },
  {
    id: 'execution',
    title: 'Creative Execution',
    subtitle: 'Bringing Ideas to Life',
    description:
      'The collaborative creation phase where we work together to bring your vision to life. This includes regular check-ins, creative sessions, feedback integration, and iterative refinement until we achieve the desired outcome.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    ),
    features: [
      'Collaborative creative sessions',
      'Regular progress reviews',
      'Feedback integration process',
      'Quality assurance and refinement',
    ],
    duration: 'Project dependent',
    deliverables: [
      'Final creative output',
      'Project documentation',
      'Usage rights agreement',
    ],
  },
]

/**
 * Collaboration Process Section
 *
 * Interactive section displaying the three-step collaboration workflow
 * with detailed information for each phase.
 */
export const CollaborationProcess: React.FC<CollaborationProcessProps> = ({
  className = '',
}) => {
  const [activeStep, setActiveStep] = useState('brief')

  const activeStepData = processSteps.find(step => step.id === activeStep)

  return (
    <section
      className={`collaboration-process py-20 bg-theme-bg transition-theme-colors ${className}`}
    >
      <div className="container mx-auto max-w-7xl p-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-text mb-6 transition-theme-colors"
            >
              Collaboration{' '}
              <span className="text-brand-blue-primary">Process</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed transition-theme-colors"
            >
              A structured yet flexible approach to creative collaboration that
              ensures your vision is understood, planned, and executed to the
              highest standard.
            </motion.p>
          </div>

          {/* Process Steps Navigation */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-center items-center mb-12"
          >
            {processSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex flex-col items-center p-6 rounded-lg transition-all duration-300 ${
                    activeStep === step.id
                      ? 'bg-brand-blue-primary text-white shadow-lg scale-105'
                      : 'bg-theme-bg-secondary text-theme-text hover:bg-brand-blue-primary/10 hover:text-brand-blue-primary transition-theme-colors'
                  }`}
                >
                  <div
                    className={`mb-3 ${activeStep === step.id ? 'text-white' : 'text-brand-blue-primary'}`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm opacity-80">{step.subtitle}</p>
                </button>

                {/* Arrow connector (desktop only) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block mx-4">
                    <svg
                      className="w-8 h-8 text-brand-blue-primary/30"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Active Step Details */}
          {activeStepData && (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-theme-bg-secondary rounded-xl p-8 md:p-12 transition-theme-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Description */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="text-brand-blue-primary mr-4">
                      {activeStepData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-theme-text transition-theme-colors">
                        {activeStepData.title}
                      </h3>
                      <p className="text-lg text-brand-blue-secondary">
                        {activeStepData.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-theme-text-secondary leading-relaxed mb-8 transition-theme-colors">
                    {activeStepData.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-theme-text mb-3 transition-theme-colors">
                        Duration
                      </h4>
                      <p className="text-brand-blue-primary font-medium">
                        {activeStepData.duration}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-theme-text mb-3 transition-theme-colors">
                        Key Deliverables
                      </h4>
                      <ul className="text-theme-text-secondary space-y-1 transition-theme-colors">
                        {activeStepData.deliverables.map(
                          (deliverable, index) => (
                            <li key={index} className="flex items-center">
                              <svg
                                className="w-4 h-4 text-brand-blue-primary mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {deliverable}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Column - Features */}
                <div>
                  <h4 className="text-xl font-semibold text-theme-text mb-6 transition-theme-colors">
                    What This Includes
                  </h4>
                  <div className="space-y-4">
                    {activeStepData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-theme-bg/50 rounded-lg border border-theme-border transition-theme-colors"
                      >
                        <svg
                          className="w-5 h-5 text-brand-blue-primary mr-3 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-theme-text transition-theme-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default CollaborationProcess
