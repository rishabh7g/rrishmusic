import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/animations'

/**
 * Service card data interface
 */
export interface ServiceCardData {
  id: string
  title: string
  description: string
  highlights: string[]
  icon: string
  colorScheme: 'blue' | 'orange' | 'yellow'
}

/**
 * Service card component props
 */
export interface ServiceCardProps {
  service: ServiceCardData
  className?: string
  delay?: number
}

/**
 * Color scheme mapping for service cards
 */
const colorSchemes = {
  blue: {
    background:
      'bg-gradient-to-br from-brand-blue-primary/5 to-brand-blue-primary/10',
    border: 'border-brand-blue-primary/20',
    iconBg: 'bg-brand-blue-primary/20',
    checkmark: 'text-brand-blue-primary',
  },
  orange: {
    background:
      'bg-gradient-to-br from-brand-orange-warm/5 to-brand-orange-warm/10',
    border: 'border-brand-orange-warm/20',
    iconBg: 'bg-brand-orange-warm/20',
    checkmark: 'text-brand-orange-warm',
  },
  yellow: {
    background:
      'bg-gradient-to-br from-brand-yellow-accent/5 to-brand-yellow-accent/10',
    border: 'border-brand-yellow-accent/20',
    iconBg: 'bg-brand-yellow-accent/20',
    checkmark: 'text-brand-yellow-accent',
  },
}

/**
 * Reusable ServiceCard component for performance service offerings
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Accessible with proper ARIA labels and semantic HTML
 * - Animated entrance with Framer Motion
 * - Customizable color schemes for different service types
 * - Professional styling with gradient backgrounds and hover effects
 *
 * @param service - Service data object containing title, description, highlights, etc.
 * @param className - Optional additional CSS classes
 * @param delay - Optional animation delay for stagger effects
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  className = '',
  delay = 0,
}) => {
  const colors = colorSchemes[service.colorScheme]

  return (
    <motion.div
      className={`
        ${colors.background} 
        ${colors.border}
        rounded-xl 
        p-6 
        sm:p-8 
        border 
        hover:shadow-xl 
        transition-shadow 
        duration-300 
        ${className}
      `}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      role="article"
      aria-labelledby={`service-${service.id}-title`}
    >
      {/* Service Header */}
      <div className="mb-6">
        {/* Service Icon */}
        <div
          className={`
            w-12 
            h-12 
            ${colors.iconBg} 
            rounded-lg 
            flex 
            items-center 
            justify-center 
            mb-4
          `}
          aria-hidden="true"
        >
          <span
            className="text-2xl"
            role="img"
            aria-label={`${service.title} icon`}
          >
            {service.icon}
          </span>
        </div>

        {/* Service Title */}
        <h3
          id={`service-${service.id}-title`}
          className="text-xl sm:text-2xl font-heading font-semibold text-neutral-charcoal mb-4"
        >
          {service.title}
        </h3>

        {/* Service Description */}
        <p className="text-neutral-charcoal/80 leading-relaxed mb-6 text-sm sm:text-base">
          {service.description}
        </p>
      </div>

      {/* Service Highlights */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-charcoal/90 uppercase tracking-wide mb-3">
          Key Features
        </h4>
        <ul
          className="space-y-2"
          role="list"
          aria-label={`${service.title} features`}
        >
          {service.highlights.map((highlight, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-neutral-charcoal/80 text-sm sm:text-base"
            >
              <span
                className={`${colors.checkmark} mt-1 flex-shrink-0 font-bold`}
                aria-hidden="true"
              >
                ✓
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/**
 * ServiceCard component display name for debugging
 */
ServiceCard.displayName = 'ServiceCard'

export default ServiceCard
