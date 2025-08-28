import React, { useState } from 'react'
import { SEOHead } from '@/components/common/SEOHead'
import {
  TeachingPackages,
  TeachingApproach,
  TeachingCurriculum,
  TeachingSuccessStories,
  PerformanceVenues,
  PerformanceServices,
  PerformanceEquipment,
  PerformanceTestimonials,
  CollaborationPortfolioSection,
  CollaborationProcessSection,
  CollaborationServices,
  CollaborationSuccessStories,
} from '@/components/sections'
import { ServiceType } from '@/types/content'

/**
 * Service Sections Demo Page
 *
 * Comprehensive demonstration of all service-specific content sections
 * with dynamic switching between service types.
 */
export const ServiceSectionsDemo: React.FC = () => {
  const [activeServiceTab, setActiveServiceTab] =
    useState<ServiceType>('teaching')

  const serviceConfig = {
    teaching: {
      label: 'Teaching Services',
      color: 'orange',
      sections: [
        { component: TeachingPackages, title: 'Teaching Packages' },
        { component: TeachingApproach, title: 'Teaching Approach' },
        { component: TeachingCurriculum, title: 'Teaching Curriculum' },
        { component: TeachingSuccessStories, title: 'Success Stories' },
      ],
    },
    performance: {
      label: 'Performance Services',
      color: 'blue',
      sections: [
        { component: PerformanceVenues, title: 'Performance Venues' },
        { component: PerformanceServices, title: 'Performance Services' },
        { component: PerformanceEquipment, title: 'Equipment Setup' },
        { component: PerformanceTestimonials, title: 'Client Testimonials' },
      ],
    },
    collaboration: {
      label: 'Collaboration Services',
      color: 'green',
      sections: [
        {
          component: CollaborationPortfolioSection,
          title: 'Project Portfolio',
        },
        {
          component: CollaborationProcessSection,
          title: 'Collaboration Process',
        },
        { component: CollaborationServices, title: 'Service Types' },
        { component: CollaborationSuccessStories, title: 'Success Stories' },
      ],
    },
  }

  const handleServiceChange = (service: ServiceType) => {
    setActiveServiceTab(service)
    // Smooth scroll to content area
    const contentArea = document.getElementById('sections-content')
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <SEOHead
        title="Service Sections Demo | Dynamic Content Display | Rrish Music"
        description="Comprehensive demonstration of service-specific content sections including teaching, performance, and collaboration services with dynamic content switching."
        keywords="service sections, content management, teaching sections, performance sections, collaboration sections"
        canonical="https://www.rrishmusic.com/service-sections-demo"
        ogType="website"
      />

      <div className="service-sections-demo min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="demo-hero bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Service-Specific Content Sections
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Comprehensive, contextual content sections that adapt to each
              service type, providing detailed information and engaging user
              experiences.
            </p>
            <div className="demo-features grid md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="feature bg-white/10 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  🎯
                </div>
                <h3 className="font-semibold mb-2">Context-Aware Content</h3>
                <p className="text-sm text-gray-300">
                  Each section adapts its content, styling, and functionality
                  based on the service context.
                </p>
              </div>
              <div className="feature bg-white/10 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  📱
                </div>
                <h3 className="font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-sm text-gray-300">
                  Fully responsive design with touch-optimized interactions and
                  mobile-first approach.
                </p>
              </div>
              <div className="feature bg-white/10 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  ⚡
                </div>
                <h3 className="font-semibold mb-2">Dynamic Switching</h3>
                <p className="text-sm text-gray-300">
                  Seamless transitions between service types with consistent
                  styling and behavior.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Navigation */}
        <section className="service-nav bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4">
            <div className="flex justify-center py-6">
              <div className="service-tabs flex bg-gray-100 rounded-full p-1">
                {Object.entries(serviceConfig).map(([serviceKey, config]) => (
                  <button
                    key={serviceKey}
                    onClick={() =>
                      handleServiceChange(serviceKey as ServiceType)
                    }
                    className={`
                      px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2
                      ${
                        activeServiceTab === serviceKey
                          ? `bg-${config.color}-500 text-white shadow-lg`
                          : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active Service Info */}
        <section className="service-info bg-gradient-to-r from-white to-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div
                className={`inline-block px-4 py-2 bg-${serviceConfig[activeServiceTab].color}-100 text-${serviceConfig[activeServiceTab].color}-800 rounded-full text-sm font-medium mb-4`}
              >
                Currently Viewing
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {serviceConfig[activeServiceTab].label}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Explore the comprehensive content sections designed specifically
                for {activeServiceTab} services. Each section includes
                interactive elements, detailed information, and optimized user
                experience.
              </p>

              <div className="sections-overview grid md:grid-cols-4 gap-4">
                {serviceConfig[activeServiceTab].sections.map(
                  (section, index) => (
                    <div
                      key={index}
                      className="section-preview bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {section.title}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Sections */}
        <div id="sections-content" className="sections-content">
          {serviceConfig[activeServiceTab].sections.map((section, index) => {
            const SectionComponent = section.component
            return (
              <div
                key={`${activeServiceTab}-${index}`}
                className="section-wrapper"
              >
                <SectionComponent
                  serviceType={activeServiceTab}
                  animate={true}
                  className="animate-fade-in"
                />
              </div>
            )
          })}
        </div>

        {/* Implementation Details */}
        <section className="implementation-details bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Implementation Features
              </h2>

              <div className="features-grid grid md:grid-cols-2 gap-8">
                <div className="feature-category">
                  <h3 className="text-xl font-semibold mb-6 text-blue-400">
                    Technical Features
                  </h3>
                  <div className="feature-list space-y-4">
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">
                          ServiceSectionTemplate
                        </div>
                        <div className="text-sm text-gray-300">
                          Reusable template with consistent styling
                        </div>
                      </div>
                    </div>
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">
                          Dynamic Content Loading
                        </div>
                        <div className="text-sm text-gray-300">
                          Context-aware content from JSON data
                        </div>
                      </div>
                    </div>
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">
                          TypeScript Integration
                        </div>
                        <div className="text-sm text-gray-300">
                          Full type safety and IntelliSense
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="feature-category">
                  <h3 className="text-xl font-semibold mb-6 text-green-400">
                    User Experience
                  </h3>
                  <div className="feature-list space-y-4">
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Interactive Elements</div>
                        <div className="text-sm text-gray-300">
                          Engaging user interactions and animations
                        </div>
                      </div>
                    </div>
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Responsive Design</div>
                        <div className="text-sm text-gray-300">
                          Mobile-first with optimized layouts
                        </div>
                      </div>
                    </div>
                    <div className="feature-item flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">
                          Accessibility Compliant
                        </div>
                        <div className="text-sm text-gray-300">
                          WCAG guidelines and keyboard navigation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="implementation-stats mt-12 grid md:grid-cols-4 gap-6 text-center">
                <div className="stat-item">
                  <div className="text-3xl font-bold text-blue-400">12</div>
                  <div className="text-sm text-gray-300">Content Sections</div>
                </div>
                <div className="stat-item">
                  <div className="text-3xl font-bold text-green-400">3</div>
                  <div className="text-sm text-gray-300">Service Types</div>
                </div>
                <div className="stat-item">
                  <div className="text-3xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-gray-300">Mobile Responsive</div>
                </div>
                <div className="stat-item">
                  <div className="text-3xl font-bold text-yellow-400">A+</div>
                  <div className="text-sm text-gray-300">
                    Accessibility Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to top button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default ServiceSectionsDemo
