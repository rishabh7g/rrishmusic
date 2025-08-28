import { motion } from 'framer-motion'
import { useLessonPackages } from '@/hooks/useContent'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'
import { TeachingInquiryCTA } from '@/components/ui/TeachingInquiryCTA'
import type { TeachingInquiryData } from '@/components/forms/TeachingInquiryForm'

export function Lessons() {
  const { packages, packageInfo, loading, error } = useLessonPackages()

  if (loading) {
    return (
      <div className="section bg-theme-bg/30 backdrop-blur-sm transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="animate-pulse">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-300 rounded mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-gray-300 rounded mx-auto max-w-md"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-gray-light rounded-2xl p-8 h-96"
                >
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-12 bg-gray-300 rounded mb-6"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !packages.length) {
    return null // Don't render anything if packages unavailable, since there's already a teaching approach section
  }

  // Extract numeric price from string (e.g., "$200" -> 200)
  const extractPrice = (priceStr: string): number => {
    const match = priceStr.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  // Extract session count from duration (e.g., "4 lessons" -> 4)
  const extractSessions = (duration: string): number => {
    const match = duration.match(/\d+/)
    return match ? parseInt(match[0], 10) : 1
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(0)}`
  }

  const getPackageIcon = (packageId: string) => {
    if (packageId === 'beginner') {
      return (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    } else if (packageId === 'intermediate') {
      return (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )
    } else {
      return (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      )
    }
  }

  /**
   * Map package data to form package types
   */
  const getFormPackageType = (
    pkg: (typeof packages)[0]
  ): TeachingInquiryData['packageType'] => {
    if (pkg.id === 'beginner') {
      return 'foundation'
    } else if (pkg.id === 'intermediate') {
      return 'transformation'
    } else if (pkg.id === 'advanced') {
      return 'transformation'
    } else {
      return 'single' // fallback
    }
  }

  return (
    <div className="section bg-theme-bg/30 backdrop-blur-sm transition-theme-colors relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-brand-yellow-accent/5 rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-36 hidden sm:block"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 bg-brand-blue-primary/5 rounded-full translate-y-16 sm:translate-y-24 lg:translate-y-40 hidden sm:block"></div>

      <motion.div
        className="container mx-auto max-w-7xl p-4 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            Lesson Packages
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Choose the perfect package for your musical journey. All lessons are
            personalized to your goals and skill level.
          </p>
          <div className="w-24 h-1 bg-brand-orange-warm mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className={`relative rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 
                group transform hover:-translate-y-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary text-white scale-105 lg:scale-110'
                    : pkg.id === 'beginner'
                      ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                      : pkg.id === 'intermediate'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-br from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
              variants={scaleIn}
              custom={index}
              whileHover={{ scale: pkg.popular ? 1.02 : 1.05 }}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className="bg-brand-yellow-accent text-brand-blue-primary px-6 py-2 rounded-full 
                    text-sm font-bold shadow-lg"
                  >
                    Most Popular
                  </div>
                </div>
              )}

              {/* Discount badge */}
              {pkg.discount && (
                <div className="absolute -top-3 -right-3">
                  <div
                    className="bg-brand-orange-warm text-white w-16 h-16 rounded-full 
                    flex items-center justify-center text-sm font-bold shadow-lg"
                  >
                    -{pkg.discount}%
                  </div>
                </div>
              )}

              <div className="text-center">
                {/* Icon */}
                <motion.div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 
                    ${
                      pkg.popular
                        ? 'bg-white/20 text-white'
                        : 'bg-white/20 text-white'
                    } group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  {getPackageIcon(pkg.id)}
                </motion.div>

                {/* Package name */}
                <h3 className="text-2xl font-heading font-bold mb-2 text-white">
                  {pkg.title}
                </h3>

                {/* Sessions */}
                <p className="text-lg mb-4 text-white/90">{pkg.duration}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-heading font-bold text-white">
                    {pkg.price}
                  </div>
                  <div className="text-sm mt-1 text-white/80">
                    $
                    {Math.round(
                      extractPrice(pkg.price) / extractSessions(pkg.duration)
                    )}{' '}
                    per session
                  </div>
                </div>

                {/* Description */}
                {pkg.description && (
                  <p className="text-sm mb-6 leading-relaxed text-white/90">
                    {pkg.description}
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-8 text-left">
                  {pkg.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <svg
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 
                          ${pkg.popular ? 'text-brand-yellow-accent' : 'text-brand-green-success'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Updated CTA Button - Now uses TeachingInquiryCTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TeachingInquiryCTA
                    initialPackageType={getFormPackageType(pkg)}
                    ctaText="Get Started"
                    variant="compact"
                    showPricing={false}
                    className={`w-full 
                      ${
                        pkg.popular
                          ? 'bg-brand-yellow-accent text-brand-blue-primary hover:bg-white'
                          : 'bg-brand-blue-primary text-white hover:bg-brand-blue-secondary'
                      } text-center justify-center rounded-full font-semibold shadow-lg hover:shadow-xl`}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional information */}
        {packageInfo && (
          <motion.div
            className="bg-theme-bg/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20"
            variants={fadeInUp}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-6 drop-shadow-lg">
                  What's Included
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-brand-green-success"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white/90 drop-shadow">
                      {packageInfo.sessionLength} minute sessions
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-brand-green-success"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white/90 drop-shadow">
                      Instruments:{' '}
                      {packageInfo.instruments?.join(', ') || 'Not specified'}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-brand-green-success"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white/90 drop-shadow">
                      Location: {packageInfo.location}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-6 drop-shadow-lg">
                  Policies
                </h3>
                <div className="space-y-4 text-sm text-white/80 drop-shadow">
                  <p>
                    <strong>Cancellation:</strong>{' '}
                    {packageInfo.cancellationPolicy}
                  </p>
                  <p>
                    <strong>Rescheduling:</strong>{' '}
                    {packageInfo.reschedulePolicy}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Updated Final CTA - Now uses TeachingInquiryCTA */}
        <motion.div className="text-center mt-16" variants={fadeInUp}>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Not sure which package is right for you? Let's have a chat about
            your musical goals and find the perfect fit.
          </p>

          <TeachingInquiryCTA
            ctaText="Book Your First Lesson"
            variant="default"
            showPricing={true}
            className="inline-block"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
