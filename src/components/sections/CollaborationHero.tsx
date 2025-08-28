/**
 * Collaboration Hero Section Component
 *
 * Hero section for the collaboration services page, emphasizing creative
 * partnerships and artistic collaboration capabilities.
 *
 * Features:
 * - Creative partnership focus and value proposition
 * - Professional hero imagery/background
 * - Clear service positioning
 * - Primary CTA for collaboration inquiries
 * - Mobile-responsive design
 * - Brand-consistent styling
 */

import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { CollaborationInquiryCTA } from '@/components/ui/CollaborationInquiryCTA'

interface CollaborationHeroProps {
  className?: string
}

/**
 * Collaboration Hero Section
 *
 * Primary hero section showcasing creative partnership capabilities
 * and inviting potential collaborators to connect.
 */
export const CollaborationHero: React.FC<CollaborationHeroProps> = ({
  className = '',
}) => {
  return (
    <section
      className={`collaboration-hero relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-primary/5 via-white to-brand-blue-secondary/5 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzE2NzNhYiIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBhdGggZD0iTTMwIDMwYzAtMTYuNTY5IDEzLjQzMS0zMCAzMC0zMHMzMCAxMy40MzEgMzAgMzAtMTMuNDMxIDMwLTMwIDMwLTMwLTEzLjQzMS0zMC0zMHoiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-50"></div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-neutral-charcoal">Creative</span>{' '}
            <span className="text-brand-blue-primary">Collaboration</span>
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-brand-blue-secondary font-medium mb-8 leading-relaxed"
          >
            Bringing musical visions to life through
            <br className="hidden md:block" />
            creative partnerships and artistic collaboration
          </motion.h2>

          {/* Value Proposition */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-neutral-charcoal/80 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            From studio sessions and creative projects to artistic partnerships
            and collaborative music creation, I bring experience, creativity,
            and professionalism to every collaboration. Let's create something
            extraordinary together.
          </motion.p>

          {/* Key Services */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-brand-blue-primary/10">
              <div className="text-brand-blue-primary mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-charcoal">
                Studio Sessions
              </h3>
              <p className="text-neutral-charcoal/70 text-sm leading-relaxed">
                Professional recording sessions and studio collaboration for
                your projects
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-brand-blue-primary/10">
              <div className="text-brand-blue-primary mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-charcoal">
                Creative Projects
              </h3>
              <p className="text-neutral-charcoal/70 text-sm leading-relaxed">
                Collaborative music creation, arrangements, and creative
                partnerships
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-brand-blue-primary/10">
              <div className="text-brand-blue-primary mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-charcoal">
                Artistic Partnerships
              </h3>
              <p className="text-neutral-charcoal/70 text-sm leading-relaxed">
                Long-term creative partnerships and ongoing collaborative
                relationships
              </p>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <CollaborationInquiryCTA variant="primary" size="large">
              Start Creative Project
            </CollaborationInquiryCTA>

            <button className="text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200 font-medium flex items-center gap-2">
              View Portfolio
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CollaborationHero
