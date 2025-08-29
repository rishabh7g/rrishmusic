import React, { memo } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../sections/ServiceSectionTemplate'

/**
 * Collaboration Success Stories Section
 * Case studies and success stories from past collaborations
 */
export const CollaborationSuccessStories: React.FC<ServiceSectionProps> = memo(
  ({ className = '', animate = true }) => {
    const successStories = [
      {
        id: 1,
        title: 'Melbourne Blues Collective Album',
        type: 'Studio Collaboration',
        description:
          'Led guitar arrangements for a 10-track album featuring 6 local Melbourne blues artists.',
        client: 'Melbourne Blues Collective',
        duration: '3 months',
        outcome: 'Album reached #3 on Australian Blues Charts',
        metrics: {
          tracks: 10,
          artists: 6,
          streams: '150K+',
          awards: 'Australian Blues Music Awards Nomination',
        },
        testimonial:
          'Rrish brought exactly the creative energy and professional expertise our project needed. His guitar work elevated every track.',
        image: '/api/placeholder/400/250',
      },
      {
        id: 2,
        title: 'Corporate Brand Music Series',
        type: 'Business Partnership',
        description:
          "Created custom music content for a major brand's marketing campaign and digital presence.",
        client: 'Fortune 500 Company',
        duration: '6 months',
        outcome: 'Campaign music used across multiple platforms',
        metrics: {
          compositions: 8,
          platforms: 5,
          reach: '2M+ views',
          renewal: 'Extended for additional year',
        },
        testimonial:
          'Professional, creative, and delivered exactly what our brand needed. The music perfectly captured our company values.',
        image: '/api/placeholder/400/250',
      },
      {
        id: 3,
        title: 'Educational Workshop Series',
        type: 'Educational Collaboration',
        description:
          'Developed and delivered a comprehensive blues guitar workshop series for music schools.',
        client: 'Australian Music Schools Network',
        duration: '4 months',
        outcome: 'Workshop adopted by 12+ music schools',
        metrics: {
          schools: 12,
          students: '300+',
          satisfaction: '98%',
          expansion: 'National rollout planned',
        },
        testimonial:
          'Rrish created an engaging curriculum that students love and teachers find easy to implement. Outstanding educational partnership.',
        image: '/api/placeholder/400/250',
      },
    ]

    return (
      <ServiceSectionTemplate
        serviceType="collaboration"
        title="Success Stories"
        subtitle="Real results from creative partnerships that made a lasting impact"
        sectionId="collaboration-success"
        variant="testimonial"
        background="white"
        className={className}
        animate={animate}
      >
        <div className="success-stories space-y-12">
          {successStories.map((story, index) => (
            <div
              key={story.id}
              className={`story-card ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-8 items-center`}
            >
              <div className="story-image lg:w-1/2">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>

              <div className="story-content lg:w-1/2">
                <div className="content-header mb-6">
                  <div className="text-sm text-green-600 font-medium mb-2">
                    {story.type}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {story.title}
                  </h3>
                  <p className="text-gray-700 text-lg">{story.description}</p>
                </div>

                <div className="story-details grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Client</div>
                    <div className="font-medium text-gray-900">
                      {story.client}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium text-gray-900">
                      {story.duration}
                    </div>
                  </div>
                </div>

                <div className="story-metrics bg-green-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Key Metrics
                  </h4>
                  <div className="metrics-grid grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(story.metrics).map(([key, value]) => (
                      <div key={key} className="metric-item">
                        <div className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="font-bold text-green-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="story-outcome mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Outcome</h4>
                  <p className="text-green-700 font-medium">{story.outcome}</p>
                </div>

                <blockquote className="text-gray-700 italic border-l-4 border-green-600 pl-4">
                  "{story.testimonial}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </ServiceSectionTemplate>
    )
  }
)

CollaborationSuccessStories.displayName = 'CollaborationSuccessStories'

export default CollaborationSuccessStories
