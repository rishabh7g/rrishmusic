import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'
import { CTAHierarchy } from '@/components/ui/cta'

/**
 * Service item interface for the hierarchy
 */
interface ServiceItem {
  title: string
  description: string
  ctaText: string
  ctaLink: string
  icon: React.ReactNode
  prominence: 'primary' | 'secondary' | 'tertiary'
  ctaComponent?: React.ReactNode
}

/**
 * Services Hierarchy Component - UPDATED for 50/50 Screen Split Layout
 *
 * Implements 50/50 screen split for main services:
 * - Performance Services: 50% screen width (left side, comprehensive content)
 * - Teaching Services: 50% screen width (right side, substantial content)
 * - Collaboration Services: Centered below (compact presentation)
 *
 * Equal visual prominence for Performance and Teaching services.
 */
export function ServicesHierarchy() {
  const services: ServiceItem[] = [
    {
      title: 'Live Performance Services',
      description:
        'Professional blues and improvisation performances across Melbourne - from intimate venues to major events. Specializing in soulful blues guitar, engaging stage presence, and memorable musical experiences. Available for pubs, clubs, private functions, weddings, corporate events, and festivals. Full band or solo acoustic setups with professional sound equipment and technical support included.',
      ctaText: 'Book Performance Now',
      ctaLink: '/performance',
      prominence: 'primary',
      icon: (
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
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      title: 'Guitar Lessons & Music Education',
      description:
        'Comprehensive guitar instruction focused on blues fundamentals, improvisation techniques, and musical expression. Learn authentic blues scales, chord progressions, fingerpicking patterns, and stage performance skills from a working professional musician. Suitable for beginners through advanced players seeking to develop their blues and improvisation abilities through structured, personalized lessons.',
      ctaText: 'Start Learning Today',
      ctaLink: '#lessons',
      prominence: 'secondary',
      icon: (
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      title: 'Studio Sessions',
      description:
        'Available for recording collaborations and creative partnerships.',
      ctaText: 'Collaborate',
      ctaLink: '/collaboration',
      prominence: 'tertiary',
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        className="container-custom"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header - Performance-Focused */}
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-4">
            Melbourne Live Music Services
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Professional live performance services bringing authentic blues and
            improvisation to Melbourne venues and events. Specializing in
            memorable musical experiences that connect with audiences and create
            lasting impressions.
          </p>
        </motion.div>

        {/* Performance Service Types - Expanded Content (80% allocation) */}
        <motion.div className="mb-16" variants={fadeInUp}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-brand-blue-primary/5 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-brand-blue-primary mb-2">
                Venue Performances
              </h4>
              <p className="text-sm text-gray-600">
                Pubs, clubs, and live music venues
              </p>
            </div>
            <div className="bg-brand-blue-primary/5 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-brand-blue-primary mb-2">
                Private Events
              </h4>
              <p className="text-sm text-gray-600">
                Weddings, parties, celebrations
              </p>
            </div>
            <div className="bg-brand-blue-primary/5 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6l-8 5-8-5V6"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-brand-blue-primary mb-2">
                Corporate Events
              </h4>
              <p className="text-sm text-gray-600">
                Professional business functions
              </p>
            </div>
            <div className="bg-brand-blue-primary/5 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-brand-blue-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h4 className="font-bold text-brand-blue-primary mb-2">
                Festival Sets
              </h4>
              <p className="text-sm text-gray-600">
                Music festivals and outdoor events
              </p>
            </div>
          </div>
        </motion.div>

        {/* Services Grid with 50/50 Split Layout for Performance and Lessons */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Primary Service - Performance (50% screen split) */}
          <motion.div className="h-full" variants={fadeInUp}>
            <ServiceCard service={services[0]} size="split-large" />
          </motion.div>

          {/* Secondary Service - Teaching/Lessons (50% screen split) */}
          <motion.div className="h-full" variants={fadeInUp}>
            <ServiceCard service={services[1]} size="split-large" />
          </motion.div>
        </div>

        {/* Tertiary Service - Collaboration (Full width, smaller) */}
        <motion.div className="max-w-md mx-auto" variants={fadeInUp}>
          <ServiceCard service={services[2]} size="small" />
        </motion.div>

        {/* Performance-Focused Value Proposition (Additional 80% content) */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-brand-blue-primary/5 to-brand-yellow-accent/5 rounded-2xl p-8"
          variants={fadeInUp}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-blue-primary mb-2">
                100+
              </div>
              <div className="font-semibold text-brand-blue-primary mb-2">
                Live Performances
              </div>
              <p className="text-sm text-gray-600">
                Across Melbourne venues and events
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-blue-primary mb-2">
                5+
              </div>
              <div className="font-semibold text-brand-blue-primary mb-2">
                Years Experience
              </div>
              <p className="text-sm text-gray-600">
                Professional live music performance
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-blue-primary mb-2">
                100%
              </div>
              <div className="font-semibold text-brand-blue-primary mb-2">
                Professional Setup
              </div>
              <p className="text-sm text-gray-600">
                Equipment and technical support included
              </p>
            </div>
          </div>
        </motion.div>

        {/* Performance-Focused CTA Strategy */}
        <motion.div className="mt-16 text-center" variants={fadeInUp}>
          <h3 className="text-3xl font-heading font-bold text-brand-blue-primary mb-6">
            Ready to Book Your Live Performance?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional blues guitar performances that create memorable
            experiences for your venue or event
          </p>
          <CTAHierarchy
            layout="horizontal"
            context="services"
            customMessages={{
              primary: 'Book Performance Today',
              secondary: 'Learn Guitar Skills',
              tertiary: 'Studio Work',
            }}
            className="justify-center"
          />
        </motion.div>

        {/* Analytics Tracking */}
        <div className="mt-16 text-center">
          <motion.p className="text-sm text-gray-500" variants={fadeInUp}>
            Professional live music services designed to deliver exceptional
            experiences and lasting memories
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

/**
 * Service Card Component with size variations - Updated for 80/15/5 allocation
 */
interface ServiceCardProps {
  service: ServiceItem
  size: 'large' | 'medium' | 'small' | 'split-large'
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, size }) => {
  const sizeClasses = {
    large: {
      container:
        'h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 md:p-12 group border border-brand-blue-primary/10',
      icon: 'w-16 h-16 md:w-20 md:h-20 text-brand-blue-primary mb-6 group-hover:text-brand-yellow-accent transition-colors duration-300',
      title:
        'text-3xl md:text-4xl font-heading font-bold text-brand-blue-primary mb-6 group-hover:text-brand-blue-secondary transition-colors duration-300',
      description: 'text-lg text-gray-600 mb-8 leading-relaxed',
      cta: 'inline-flex items-center px-8 py-4 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg',
    },
    'split-large': {
      container:
        'h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 md:p-10 group border border-brand-blue-primary/10 min-h-[400px] flex flex-col',
      icon: 'w-14 h-14 md:w-16 md:h-16 text-brand-blue-primary mb-4 group-hover:text-brand-yellow-accent transition-colors duration-300',
      title:
        'text-2xl md:text-3xl font-heading font-bold text-brand-blue-primary mb-4 group-hover:text-brand-blue-secondary transition-colors duration-300',
      description:
        'text-base md:text-lg text-gray-600 mb-6 leading-relaxed flex-grow',
      cta: 'inline-flex items-center px-6 py-3 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-auto',
    },
    medium: {
      container:
        'h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group',
      icon: 'w-10 h-10 text-brand-blue-primary mb-4 group-hover:text-brand-yellow-accent transition-colors duration-300',
      title:
        'text-xl font-heading font-bold text-brand-blue-primary mb-3 group-hover:text-brand-blue-secondary transition-colors duration-300',
      description: 'text-base text-gray-600 mb-6 leading-relaxed',
      cta: 'inline-flex items-center px-6 py-3 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 shadow-md hover:shadow-lg',
    },
    small: {
      container:
        'h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 group',
      icon: 'w-6 h-6 text-brand-blue-primary mb-3 group-hover:text-brand-yellow-accent transition-colors duration-300',
      title:
        'text-lg font-heading font-bold text-brand-blue-primary mb-2 group-hover:text-brand-blue-secondary transition-colors duration-300',
      description: 'text-sm text-gray-600 mb-4 leading-relaxed',
      cta: 'inline-flex items-center px-4 py-2 bg-brand-blue-primary text-white font-semibold rounded-full hover:bg-brand-yellow-accent hover:text-brand-blue-primary transition-all duration-300 text-sm',
    },
  }

  const classes = sizeClasses[size]

  return (
    <motion.div
      className={classes.container}
      variants={scaleIn}
      whileHover={{
        scale: size === 'large' || size === 'split-large' ? 1.02 : 1.03,
      }}
      onClick={() => {
        // Service card clicked
      }}
    >
      {/* Service Icon */}
      <div className={classes.icon}>{service.icon}</div>

      {/* Service Title */}
      <h3 className={classes.title}>{service.title}</h3>

      {/* Service Description */}
      <p className={classes.description}>{service.description}</p>

      {/* Call to Action */}
      <a
        href={service.ctaLink}
        className={classes.cta}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        {service.ctaText}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </motion.div>
  )
}

export default ServicesHierarchy