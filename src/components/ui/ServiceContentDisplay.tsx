import React from 'react'
import { motion } from 'framer-motion'
import { ServiceContentData } from '@/hooks/useServiceContent'

interface ServiceContentDisplayProps {
  content: ServiceContentData
  compact?: boolean
  showStats?: boolean
  showTestimonials?: boolean
  showPricing?: boolean
  className?: string
}

/**
 * Service Content Display Component
 *
 * Features:
 * - Dynamic service content rendering
 * - Statistics display with animations
 * - Testimonials preview
 * - Pricing information
 * - Responsive design
 * - Loading and error states
 */
export const ServiceContentDisplay: React.FC<ServiceContentDisplayProps> = ({
  content,
  compact = false,
  showStats = true,
  showTestimonials = false,
  showPricing = true,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Features List */}
      <motion.div variants={itemVariants}>
        <div className="space-y-3">
          {content.features.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center text-sm"
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <svg
                className="w-4 h-4 mr-3 text-current flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Statistics Display */}
      {showStats && !compact && (
        <motion.div
          className="grid grid-cols-2 gap-3 pt-4 border-t border-current/20"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-lg font-bold">
              {content.stats.totalTestimonials}+
            </div>
            <div className="text-xs opacity-75">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {content.stats.averageRating}/5
            </div>
            <div className="text-xs opacity-75">Rating</div>
          </div>
          {content.stats.yearsExperience && (
            <div className="text-center">
              <div className="text-lg font-bold">
                {content.stats.yearsExperience}
              </div>
              <div className="text-xs opacity-75">Years Exp</div>
            </div>
          )}
          {content.stats.totalLessons && (
            <div className="text-center">
              <div className="text-lg font-bold">
                {content.stats.totalLessons}
              </div>
              <div className="text-xs opacity-75">Packages</div>
            </div>
          )}
          {content.stats.successfulProjects && (
            <div className="text-center">
              <div className="text-lg font-bold">
                {content.stats.successfulProjects}+
              </div>
              <div className="text-xs opacity-75">Projects</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Compact Statistics */}
      {showStats && compact && (
        <motion.div
          className="flex justify-between items-center pt-3 border-t border-current/20 text-xs"
          variants={itemVariants}
        >
          <span>{content.stats.averageRating}/5 ⭐</span>
          <span>{content.stats.totalTestimonials}+ clients</span>
          {content.stats.yearsExperience && (
            <span>{content.stats.yearsExperience} years</span>
          )}
        </motion.div>
      )}

      {/* Pricing Information */}
      {showPricing && content.pricing && (
        <motion.div
          className="pt-3 border-t border-current/20"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-75">Starting from</span>
            <div className="font-bold">
              ${content.pricing.from} {content.pricing.currency}
              {content.pricing.packages && (
                <span className="text-xs font-normal opacity-75 ml-1">
                  ({content.pricing.packages} packages)
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Testimonials Preview */}
      {showTestimonials && content.testimonials.length > 0 && (
        <motion.div
          className="pt-4 border-t border-current/20"
          variants={itemVariants}
        >
          <div className="text-xs font-semibold mb-2 opacity-75">
            Recent Reviews
          </div>
          <div className="space-y-2">
            {content.testimonials.slice(0, 2).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="text-xs opacity-90 italic"
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                "{testimonial.content.substring(0, 80)}..."
                <div className="text-right mt-1 not-italic font-medium">
                  - {testimonial.author}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ServiceContentDisplay
