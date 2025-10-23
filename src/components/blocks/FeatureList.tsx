/**
 * FeatureList Block Component
 * Displays teaching methodology as a titled bullet list
 */

import { motion } from 'framer-motion'
import { z } from 'zod'
import { FeatureListSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type FeatureListProps = z.infer<typeof FeatureListSchema>

export function FeatureList({ title, items }: FeatureListProps) {
  return (
    <section className="section bg-theme-bg text-theme-text">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Title */}
          <motion.h2
            className="text-3xl lg:text-4xl font-heading font-bold mb-8 text-center"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>

          {/* Feature items */}
          <motion.ul
            className="space-y-4 max-w-2xl mx-auto"
            variants={staggerContainer}
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-4 text-lg"
                variants={fadeInUp}
              >
                {/* Checkmark icon */}
                <div className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-brand-blue-primary flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-theme-text-secondary">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
