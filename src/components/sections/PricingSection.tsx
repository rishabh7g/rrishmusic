import React from 'react'
import { motion } from 'framer-motion'
import { useSectionContent } from '@/hooks/useContent'
import { fadeInUp, staggerContainer } from '@/utils/animations'

interface PricingPackage {
  id: string
  name: string
  description: string
  price: string
  duration: string
  features: string[]
  popular: boolean
  bestFor: string
}

interface AdditionalService {
  name: string
  price: string
}

interface PricingData {
  title: string
  subtitle: string
  description: string
  packages: PricingPackage[]
  additionalServices: AdditionalService[]
  notes: string[]
}

/**
 * Performance Pricing Section Component
 *
 * Features:
 * - Displays performance service packages and pricing
 * - Highlights popular package with visual emphasis
 * - Shows additional services and pricing notes
 * - Responsive card layout with professional styling
 * - Clear call-to-action for booking inquiries
 */
const PricingSection: React.FC = () => {
  const { data: performanceData, loading } = useSectionContent('performance')

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="text-center mb-16">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map(j => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const pricingData = performanceData?.pricing as PricingData

  if (!pricingData) {
    return null
  }

  return (
    <section
      id="pricing"
      className="py-16 lg:py-24 bg-white"
      aria-labelledby="pricing-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2
              id="pricing-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
            >
              {pricingData.title}
            </h2>
            <p className="text-lg sm:text-xl text-brand-blue-primary font-medium mb-4">
              {pricingData.subtitle}
            </p>
            <p className="text-lg text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              {pricingData.description}
            </p>
          </motion.div>

          {/* Pricing Packages */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingData.packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className={`relative bg-white rounded-xl border-2 p-6 lg:p-8 ${
                  pkg.popular
                    ? 'border-brand-orange-warm shadow-xl scale-105'
                    : 'border-gray-200 shadow-sm hover:shadow-md'
                } transition-all duration-300`}
                variants={fadeInUp}
                custom={index}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-orange-warm text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-bold text-neutral-charcoal mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-neutral-charcoal/70 mb-4 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-heading font-bold text-brand-blue-primary">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-charcoal/60">
                    {pkg.duration} performance
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-brand-orange-warm mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-neutral-charcoal leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Best For */}
                <div className="border-t pt-4 mb-6">
                  <p className="text-xs text-neutral-charcoal/60 font-medium mb-2">
                    Best For:
                  </p>
                  <p className="text-sm text-neutral-charcoal">{pkg.bestFor}</p>
                </div>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-brand-orange-warm text-white hover:bg-brand-orange-warm/90 shadow-lg hover:shadow-xl'
                      : 'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary'
                  }`}
                  aria-label={`Inquire about ${pkg.name} package`}
                >
                  Get Quote
                </a>
              </motion.div>
            ))}
          </div>

          {/* Additional Services */}
          <motion.div
            className="bg-gradient-to-r from-neutral-light/40 to-neutral-light/20 rounded-2xl p-8 lg:p-12 mb-12"
            variants={fadeInUp}
          >
            <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-neutral-charcoal mb-6 text-center">
              Additional Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingData.additionalServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="bg-white rounded-lg p-4 text-center shadow-sm"
                  variants={fadeInUp}
                  custom={index}
                >
                  <h4 className="font-semibold text-neutral-charcoal mb-2 text-sm">
                    {service.name}
                  </h4>
                  <p className="text-brand-blue-primary font-bold">
                    {service.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            className="bg-blue-50 rounded-xl p-6 lg:p-8"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-heading font-semibold text-neutral-charcoal mb-4 flex items-center">
              <svg
                className="w-6 h-6 text-brand-blue-primary mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Important Information
            </h3>
            <ul className="space-y-2">
              {pricingData.notes.map((note, index) => (
                <li
                  key={index}
                  className="text-sm text-neutral-charcoal/80 flex items-start"
                >
                  <span className="text-brand-blue-primary mr-2 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact CTA */}
          <motion.div className="mt-16 text-center" variants={fadeInUp}>
            <h3 className="text-2xl lg:text-3xl font-heading font-semibold text-neutral-charcoal mb-4">
              Ready to Discuss Your Event?
            </h3>
            <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Every event is unique. Contact us for a personalized quote and to
              discuss how we can make your occasion unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@rrishmusic.com"
                className="inline-flex items-center justify-center bg-brand-orange-warm text-white font-heading font-semibold px-8 py-4 rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20 shadow-xl text-lg min-w-48"
                aria-label="Send email for performance booking"
              >
                Get Custom Quote
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-transparent border-2 border-brand-blue-primary text-brand-blue-primary font-heading font-semibold px-8 py-4 rounded-full hover:bg-brand-blue-primary hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-blue-primary/20 text-lg min-w-48"
                aria-label="View contact information"
              >
                Contact Info
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
