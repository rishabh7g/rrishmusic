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
import { CollaborationInquiryCTA } from '@/components/ui/cta'

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
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-primary via-brand-blue-secondary to-brand-blue-dark overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/music-notes-pattern.svg')] bg-repeat opacity-20"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-brand-orange-warm/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-brand-orange-bright/20 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center text-white"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Hero Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
        >
          <span className="text-sm font-medium text-white">
            Creative Collaboration Services
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Let's Create
          <br />
          <span className="text-brand-orange-warm">Something Amazing</span>
          <br />
          Together
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          From studio sessions to creative projects, I bring{' '}
          <span className="font-semibold text-brand-orange-bright">
            professional experience
          </span>{' '}
          and{' '}
          <span className="font-semibold text-brand-orange-bright">
            creative passion
          </span>{' '}
          to every collaboration.
        </motion.p>

        {/* Key Services */}
        <motion.div
          variants={fadeInUp}
          className="mb-12 flex flex-wrap justify-center gap-6 text-white/80"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange-warm rounded-full"></div>
            <span>Studio Recording</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange-warm rounded-full"></div>
            <span>Creative Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange-warm rounded-full"></div>
            <span>Musical Partnerships</span>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <div className="relative">
            <CollaborationInquiryCTA variant="primary" size="large">
              Start Your Project
            </CollaborationInquiryCTA>

            {/* CTA Enhancement */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand-orange-bright rounded-full animate-pulse"></div>
          </div>

          <div className="text-white/70 text-sm">
            Free consultation • Quick response
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUp}
          className="text-white/60 text-sm max-w-2xl mx-auto"
        >
          <p>
            Trusted by artists, producers, and creative professionals for
            high-quality musical collaboration and innovative project
            development.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wide">Explore</span>
          <div className="w-px h-8 bg-white/40"></div>
          <div className="w-2 h-2 border border-white/40 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default CollaborationHero
