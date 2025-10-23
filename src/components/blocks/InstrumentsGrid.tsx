/**
 * InstrumentsGrid Block Component
 * Displays three instrument cards (drums, keyboard, guitar)
 * Uses inline SVG icons for crisp scaling and easy theming (no attribution required)
 */

import { motion } from 'framer-motion'
import { z } from 'zod'
import { InstrumentsGridSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type InstrumentsGridProps = z.infer<typeof InstrumentsGridSchema>

// Icon map for instruments - clean inline SVGs
const instrumentIcons = {
  drums: (
    <svg
      className="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <circle
        cx="12"
        cy="9"
        r="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 15c-1.5 1.5-2 3.5-2 5s.5 3.5 2 5m12 0c1.5-1.5 2-3.5 2-5s-.5-3.5-2-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 3v12m-5-5h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  keyboard: (
    <svg
      className="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <rect
        x="2"
        y="7"
        width="20"
        height="12"
        rx="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="5"
        y1="11"
        x2="5"
        y2="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="9"
        y1="11"
        x2="9"
        y2="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="13"
        y1="11"
        x2="13"
        y2="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="17"
        y1="11"
        x2="17"
        y2="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2"
        y1="19"
        x2="22"
        y2="19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  guitar: (
    <svg
      className="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <circle
        cx="12"
        cy="14"
        r="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2c-2 0-3 1-3 3v2c0 0-2 1-2 3v6c0 2 2 3 2 3h6c0 0 2-1 2-3v-6c0-2-2-3-2-3V5c0-2-1-3-3-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function InstrumentsGrid({ items }: InstrumentsGridProps) {
  return (
    <section className="section bg-theme-bg-secondary text-theme-text">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Grid of instrument cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map(instrument => (
              <motion.div
                key={instrument.id}
                className="bg-theme-bg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4 text-brand-blue-primary">
                  {
                    instrumentIcons[
                      instrument.id as keyof typeof instrumentIcons
                    ]
                  }
                </div>

                {/* Title */}
                <h3 className="text-2xl font-heading font-bold mb-2">
                  {instrument.title}
                </h3>

                {/* Blurb */}
                <p className="text-theme-text-secondary">{instrument.blurb}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
