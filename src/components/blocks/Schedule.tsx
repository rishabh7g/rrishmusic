/**
 * Schedule Block Component
 * Displays availability windows
 */

import { motion } from 'framer-motion'
import { z } from 'zod'
import { ScheduleSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type ScheduleProps = z.infer<typeof ScheduleSchema>

export function Schedule({ title, windows }: ScheduleProps) {
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
            className="text-3xl lg:text-4xl font-heading font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>

          {/* Time windows */}
          <div className="max-w-2xl mx-auto space-y-4">
            {windows.map((window, index) => (
              <motion.div
                key={index}
                className="bg-theme-bg p-6 rounded-xl shadow-md"
                variants={fadeInUp}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <svg
                    className="w-6 h-6 text-brand-blue-primary flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <div className="flex-1">
                    {/* Label */}
                    <h3 className="text-lg font-bold mb-2">{window.label}</h3>

                    {/* Times */}
                    <ul className="space-y-1">
                      {window.times.map((time, timeIndex) => (
                        <li
                          key={timeIndex}
                          className="text-theme-text-secondary"
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
