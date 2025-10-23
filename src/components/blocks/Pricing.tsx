/**
 * Pricing Block Component
 * Displays pricing with conditional visibility based on displayPrice flag
 */

import { motion } from 'framer-motion'
import { z } from 'zod'
import { PricingSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type PricingProps = z.infer<typeof PricingSchema>

export function Pricing({ title, displayPrice, trial, session }: PricingProps) {
  return (
    <section className="section bg-theme-bg-secondary text-theme-text">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Title */}
          {title && (
            <motion.h2
              className="text-3xl lg:text-4xl font-heading font-bold mb-12 text-center"
              variants={fadeInUp}
            >
              {title}
            </motion.h2>
          )}

          <div className="max-w-2xl mx-auto">
            {/* Trial offer */}
            <motion.div
              className="bg-brand-yellow-accent text-brand-blue-primary p-8 rounded-2xl shadow-lg mb-6"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-4">
                <svg
                  className="w-8 h-8 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <p className="text-xl font-bold">{trial}</p>
              </div>
            </motion.div>

            {/* Session pricing - only show if displayPrice is true */}
            {displayPrice && (
              <motion.div
                className="bg-theme-bg-secondary p-8 rounded-2xl shadow-lg"
                variants={fadeInUp}
              >
                <div className="text-center">
                  {/* Price label */}
                  <p className="text-3xl font-heading font-bold mb-2">
                    {session.label ||
                      `A$${session.amountAud} per ${session.durationMins}-minute session`}
                  </p>

                  {/* Notes */}
                  {session.notes && (
                    <p className="text-theme-text-secondary mt-4">
                      {session.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
