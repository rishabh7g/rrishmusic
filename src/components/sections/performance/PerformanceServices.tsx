import React, { useState } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../ServiceSectionTemplate'

/**
 * Performance Services Section
 * Different types of performance services offered
 */
export const PerformanceServices: React.FC<ServiceSectionProps> = React.memo(
  ({ className = '', animate = true }) => {
    const [activeService, setActiveService] = useState('venue')

    const services = {
      venue: {
        title: 'Venue Entertainment',
        description:
          'Professional live music for bars, restaurants, and music venues',
        features: [
          'Full sound system setup',
          'Customizable setlists',
          'Professional stage presence',
          'Audience engagement',
          'Flexible performance duration',
        ],
        pricing: 'From $300/night',
        duration: '2-4 hours',
        audience: '50-500 people',
        icon: '🎸',
      },
      private: {
        title: 'Private Events',
        description:
          'Intimate acoustic performances for weddings, parties, and celebrations',
        features: [
          'Acoustic or electric setups',
          'Ceremony and reception music',
          'Background and featured sets',
          'Song requests welcome',
          'Professional appearance',
        ],
        pricing: 'From $400/event',
        duration: '1-6 hours',
        audience: '20-200 people',
        icon: '🎵',
      },
      corporate: {
        title: 'Corporate Functions',
        description:
          'Sophisticated entertainment for business events and conferences',
        features: [
          'Professional networking music',
          'Award ceremony entertainment',
          'Cocktail hour performances',
          'Branded presentation options',
          'Reliable and punctual service',
        ],
        pricing: 'From $500/event',
        duration: '2-4 hours',
        audience: '50-1000 people',
        icon: '🏢',
      },
      session: {
        title: 'Session Work',
        description:
          'Professional guitar services for recordings, tours, and projects',
        features: [
          'Studio recording sessions',
          'Live session work',
          'Tour support musician',
          'Creative collaboration',
          'Quick turnaround times',
        ],
        pricing: 'From $150/session',
        duration: '2-8 hours',
        audience: 'Artists & Producers',
        icon: '🎧',
      },
    }

    return (
      <ServiceSectionTemplate
        serviceType="performance"
        title="Performance Services"
        subtitle="Professional live music tailored to your venue and audience"
        sectionId="performance-services"
        variant="featured"
        background="white"
        className={className}
        animate={animate}
      >
        <div className="services-content">
          {/* Service Selector */}
          <div className="service-selector grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`
                service-button p-6 rounded-2xl text-center transition-all duration-300
                ${
                  activeService === key
                    ? 'bg-brand-blue-primary text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-brand-blue-primary'
                }
              `}
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <div className="font-medium">{service.title}</div>
              </button>
            ))}
          </div>

          {/* Active Service Details */}
          <div className="active-service bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="service-info">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {services[activeService].title}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {services[activeService].description}
                </p>

                <div className="service-features space-y-3">
                  {services[activeService].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-blue-primary rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-specs bg-white rounded-xl p-6 shadow-md">
                <h4 className="font-bold text-gray-900 mb-4">
                  Service Details
                </h4>
                <div className="specs-grid space-y-4">
                  <div className="spec-item">
                    <div className="text-sm text-gray-600">Starting Price</div>
                    <div className="text-lg font-bold text-brand-blue-primary">
                      {services[activeService].pricing}
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium text-gray-900">
                      {services[activeService].duration}
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="text-sm text-gray-600">
                      Typical Audience
                    </div>
                    <div className="font-medium text-gray-900">
                      {services[activeService].audience}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-brand-blue-primary text-white py-3 rounded-lg font-medium hover:bg-brand-blue-dark transition-colors">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </ServiceSectionTemplate>
    )
  }
)

PerformanceServices.displayName = 'PerformanceServices'

export default PerformanceServices
