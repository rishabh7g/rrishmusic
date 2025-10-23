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

          <div className="max-w-2xl mx-auto text-center">
            {/* Session pricing - with subtle background */}
            {displayPrice && (
              <motion.div
                className="bg-theme-bg p-8 rounded-2xl shadow-md mb-6"
                variants={fadeInUp}
              >
                <p className="text-3xl font-heading font-bold">
                  {session.label ||
                    `A$${session.amountAud} per ${session.durationMins}-minute session`}
                </p>
              </motion.div>
            )}

            {/* Trial offer - supporting text below */}
            <motion.div variants={fadeInUp}>
              <p className="text-lg text-theme-text-secondary">{trial}</p>
              {session.notes && (
                <p className="text-theme-text-secondary mt-2">
                  {session.notes}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
