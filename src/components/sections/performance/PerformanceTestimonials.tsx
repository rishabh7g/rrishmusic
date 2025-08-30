import React from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../ServiceSectionTemplate'

/**
 * Performance Testimonials Section
 * Client testimonials from venues and event organizers
 */
export const PerformanceTestimonials: React.FC<ServiceSectionProps> =
  React.memo(({ className = '', animate = true }) => {
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
  })

PerformanceTestimonials.displayName = 'PerformanceTestimonials'

export default PerformanceTestimonials
