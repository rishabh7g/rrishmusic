import React from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../ServiceSectionTemplate'

/**
 * Performance Venues Section
 * Showcases venues where Rrish has performed
 */
export const PerformanceVenues: React.FC<ServiceSectionProps> = React.memo(
  ({ className = '', animate = true }) => {
    const venues = [
      {
        id: 1,
        name: 'Melbourne Blues Festival',
        type: 'Festival',
        capacity: '5000+',
        location: 'Melbourne CBD',
        description:
          "Main stage performance at Melbourne's premier blues festival",
        image: '/api/placeholder/400/300',
        year: '2024',
        highlights: [
          'Main stage slot',
          'Audience of 5000+',
          'Live recording released',
        ],
      },
      {
        id: 2,
        name: 'The Corner Hotel',
        type: 'Venue',
        capacity: '600',
        location: 'Richmond',
        description:
          'Regular performances at this iconic Melbourne music venue',
        image: '/api/placeholder/400/300',
        year: '2023-2024',
        highlights: ['Monthly residency', 'Sold out shows', 'Featured artist'],
      },
      {
        id: 3,
        name: 'Cherry Bar',
        type: 'Club',
        capacity: '150',
        location: 'AC/DC Lane',
        description:
          "Intimate blues sessions in Melbourne's legendary rock bar",
        image: '/api/placeholder/400/300',
        year: '2023',
        highlights: ['Blues nights', 'Jam sessions', 'Local favorite'],
      },
      {
        id: 4,
        name: 'Corporate Events',
        type: 'Private',
        capacity: '50-500',
        location: 'Various',
        description:
          'Professional entertainment for corporate functions and private events',
        image: '/api/placeholder/400/300',
        year: 'Ongoing',
        highlights: [
          'High-profile clients',
          'Custom setlists',
          'Professional setup',
        ],
      },
    ]

    return (
      <ServiceSectionTemplate
        serviceType="performance"
        title="Performance Venues & Events"
        subtitle="From intimate club settings to major festivals - bringing blues to diverse audiences"
        sectionId="performance-venues"
        variant="portfolio"
        className={className}
        animate={animate}
      >
        <div className="venues-grid grid md:grid-cols-2 gap-8">
          {venues.map(venue => (
            <div
              key={venue.id}
              className="venue-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="venue-image relative">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-brand-blue-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {venue.type}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {venue.year}
                </div>
              </div>

              <div className="venue-info p-6">
                <div className="venue-header mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {venue.name}
                  </h3>
                  <div className="venue-meta flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {venue.location}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      {venue.capacity}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{venue.description}</p>

                <div className="venue-highlights">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Highlights:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-brand-blue-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
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

PerformanceVenues.displayName = 'PerformanceVenues'

export default PerformanceVenues
