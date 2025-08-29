import React, { useState, memo } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../sections/ServiceSectionTemplate'

/**
 * Collaboration Services Section
 * Different types of collaborative services offered
 */
export const CollaborationServices: React.FC<ServiceSectionProps> = memo(
  ({ className = '', animate = true }) => {
    const [activeService, setActiveService] = useState('recording')

    const services = {
      recording: {
        title: 'Studio Collaborations',
        description:
          'Professional recording partnerships for albums, EPs, and single tracks',
        features: [
          'Lead and rhythm guitar parts',
          'Creative arrangement input',
          'Professional studio recording',
          'Multiple revision rounds',
          'High-quality mix contributions',
        ],
        pricing: 'From $200/day',
        duration: '1-5 days',
        ideal: 'Artists, Producers, Bands',
        icon: '🎧',
      },
      creative: {
        title: 'Creative Projects',
        description:
          'Original compositions and artistic collaborations for unique musical ventures',
        features: [
          'Original composition creation',
          'Co-writing partnerships',
          'Artistic vision development',
          'Cross-genre experimentation',
          'Innovative sound design',
        ],
        pricing: 'Project-based',
        duration: '2-12 weeks',
        ideal: 'Artists, Composers, Producers',
        icon: '🎨',
      },
      business: {
        title: 'Business Partnerships',
        description:
          'Long-term professional relationships and ongoing musical collaborations',
        features: [
          'Ongoing project partnerships',
          'Tour musician services',
          'Musical direction consulting',
          'Brand collaboration opportunities',
          'Industry networking support',
        ],
        pricing: 'Negotiable retainer',
        duration: '3+ months',
        ideal: 'Music Businesses, Labels, Artists',
        icon: '🤝',
      },
      education: {
        title: 'Educational Collaborations',
        description:
          'Workshops, masterclasses, and educational content partnerships',
        features: [
          'Workshop development',
          'Masterclass instruction',
          'Educational content creation',
          'Curriculum consultation',
          'Student mentorship programs',
        ],
        pricing: 'From $150/hour',
        duration: '1 day - 3 months',
        ideal: 'Schools, Organizations, Platforms',
        icon: '📚',
      },
    }

    return (
      <ServiceSectionTemplate
        serviceType="collaboration"
        title="Collaboration Services"
        subtitle="Diverse partnership opportunities tailored to your creative and business needs"
        sectionId="collaboration-services"
        variant="default"
        background="gray"
        className={className}
        animate={animate}
      >
        <div className="services-content">
          {/* Service Navigation */}
          <div className="service-nav grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`
                service-nav-button p-4 rounded-xl text-center transition-all duration-300
                ${
                  activeService === key
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }
              `}
              >
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="font-medium text-sm">{service.title}</div>
              </button>
            ))}
          </div>

          {/* Active Service Details */}
          <div className="active-service-details bg-white rounded-2xl shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="service-info">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {services[activeService].title}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {services[activeService].description}
                </p>

                <div className="service-features space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    What's Included:
                  </h4>
                  {services[activeService].features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-details bg-gradient-to-br from-green-50 to-white rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-6">
                  Service Overview
                </h4>

                <div className="details-grid space-y-4">
                  <div className="detail-item">
                    <div className="text-sm text-gray-600 mb-1">Pricing</div>
                    <div className="text-lg font-bold text-green-600">
                      {services[activeService].pricing}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="text-sm text-gray-600 mb-1">
                      Typical Duration
                    </div>
                    <div className="font-medium text-gray-900">
                      {services[activeService].duration}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="text-sm text-gray-600 mb-1">Ideal For</div>
                    <div className="font-medium text-gray-900">
                      {services[activeService].ideal}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Start Collaboration
                  </button>
                  <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ServiceSectionTemplate>
    )
  }
)

CollaborationServices.displayName = 'CollaborationServices'

export default CollaborationServices
