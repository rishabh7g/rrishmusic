import React, { useState } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from './ServiceSectionTemplate'

/**
 * Performance Venues Section
 * Showcases venues where Rrish has performed
 */
export const PerformanceVenues: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
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
      description: 'Regular performances at this iconic Melbourne music venue',
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
      description: "Intimate blues sessions in Melbourne's legendary rock bar",
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
                <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
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

/**
 * Performance Services Section
 * Different types of performance services offered
 */
export const PerformanceServices: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
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
              <h4 className="font-bold text-gray-900 mb-4">Service Details</h4>
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
                  <div className="text-sm text-gray-600">Typical Audience</div>
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

/**
 * Performance Equipment Section
 * Details about the professional setup and equipment
 */
export const PerformanceEquipment: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const equipment = {
    guitars: [
      {
        name: 'Fender Stratocaster',
        type: 'Electric',
        use: 'Blues, Rock, Jazz',
      },
      { name: 'Gibson Les Paul', type: 'Electric', use: 'Blues, Rock' },
      { name: 'Martin Acoustic', type: 'Acoustic', use: 'Folk, Unplugged' },
    ],
    amplification: [
      {
        name: 'Fender Blues Deluxe',
        power: '40W Tube',
        use: 'Small-Medium Venues',
      },
      { name: 'Marshall JCM800', power: '100W', use: 'Large Venues' },
      { name: 'Line 6 Wireless', power: 'Digital', use: 'Freedom of Movement' },
    ],
    effects: [
      'Blues Driver Overdrive',
      'Tube Screamer',
      'Reverb & Delay',
      'Wah Pedal',
      'Chorus & Modulation',
    ],
  }

  return (
    <ServiceSectionTemplate
      serviceType="performance"
      title="Professional Equipment Setup"
      subtitle="High-quality gear ensuring exceptional sound at every performance"
      sectionId="performance-equipment"
      variant="default"
      background="gray"
      className={className}
      animate={animate}
    >
      <div className="equipment-sections grid lg:grid-cols-3 gap-8">
        {/* Guitars */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🎸
            </div>
            <h3 className="text-xl font-bold text-gray-900">Guitars</h3>
          </div>

          <div className="equipment-list space-y-4">
            {equipment.guitars.map((guitar, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg"
              >
                <div className="font-medium text-gray-900">{guitar.name}</div>
                <div className="text-sm text-gray-600">{guitar.type}</div>
                <div className="text-xs text-brand-blue-primary">
                  {guitar.use}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amplification */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔊
            </div>
            <h3 className="text-xl font-bold text-gray-900">Amplification</h3>
          </div>

          <div className="equipment-list space-y-4">
            {equipment.amplification.map((amp, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg"
              >
                <div className="font-medium text-gray-900">{amp.name}</div>
                <div className="text-sm text-gray-600">{amp.power}</div>
                <div className="text-xs text-brand-blue-primary">{amp.use}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="equipment-category bg-white rounded-2xl p-6 shadow-lg">
          <div className="category-header text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Effects & Pedals
            </h3>
          </div>

          <div className="equipment-list space-y-2">
            {equipment.effects.map((effect, index) => (
              <div
                key={index}
                className="equipment-item p-3 bg-blue-50 rounded-lg text-center"
              >
                <div className="font-medium text-gray-900 text-sm">
                  {effect}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Information */}
      <div className="setup-info mt-12 bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Complete Professional Setup
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              🎛️
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Sound Engineering
            </h4>
            <p className="text-sm text-gray-600">
              Professional sound mixing and level control
            </p>
          </div>
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              📡
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Wireless Freedom
            </h4>
            <p className="text-sm text-gray-600">
              Wireless guitar system for stage mobility
            </p>
          </div>
          <div className="setup-feature">
            <div className="w-12 h-12 bg-brand-blue-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
              🔧
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Setup</h4>
            <p className="text-sm text-gray-600">
              Efficient setup and soundcheck process
            </p>
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Performance Testimonials Section
 * Client testimonials from venues and event organizers
 */
export const PerformanceTestimonials: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const testimonials = [
    {
      id: 1,
      client: 'The Corner Hotel',
      role: 'Venue Manager',
      quote:
        "Rrish brings exactly what we look for - professional attitude, great sound, and the ability to read and engage with the crowd. He's become one of our regular artists.",
      rating: 5,
      event: 'Monthly Blues Nights',
    },
    {
      id: 2,
      client: 'Melbourne Corporate Events',
      role: 'Event Coordinator',
      quote:
        'Reliable, professional, and musically excellent. Rrish has performed at multiple corporate functions for us and always delivers exactly what the client needs.',
      rating: 5,
      event: 'Corporate Functions',
    },
    {
      id: 3,
      client: "Sarah & Michael's Wedding",
      role: 'Bride',
      quote:
        "Our wedding ceremony was perfect thanks to Rrish's beautiful acoustic performance. He created the exact atmosphere we wanted for our special day.",
      rating: 5,
      event: 'Private Wedding',
    },
  ]

  return (
    <ServiceSectionTemplate
      serviceType="performance"
      title="Client Testimonials"
      subtitle="What venues, event organizers, and private clients say about working with Rrish"
      sectionId="performance-testimonials"
      variant="testimonial"
      background="white"
      className={className}
      animate={animate}
    >
      <div className="testimonials-grid grid md:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <div
            key={testimonial.id}
            className="testimonial-card bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border-l-4 border-brand-blue-primary"
          >
            <div className="testimonial-header mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">
                  {testimonial.client}
                </h4>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
              <div className="text-xs text-brand-blue-primary font-medium">
                {testimonial.event}
              </div>
            </div>

            <blockquote className="text-gray-700 italic">
              "{testimonial.quote}"
            </blockquote>
          </div>
        ))}
      </div>
    </ServiceSectionTemplate>
  )
}

export default {
  PerformanceVenues,
  PerformanceServices,
  PerformanceEquipment,
  PerformanceTestimonials,
}
