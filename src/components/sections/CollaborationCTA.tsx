/**
 * Collaboration Call-to-Action Section Component
 *
 * Final CTA section for the collaboration page encouraging users to start
 * their creative project with clear messaging and action buttons.
 *
 * Features:
 * - "Start Creative Project" primary CTA
 * - Secondary contact options
 * - Compelling value proposition
 * - Professional and inviting design
 * - Mobile-responsive layout
 * - Integration with collaboration inquiry form
 */

import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { CollaborationInquiryCTA } from '@/components/ui/cta'

interface CollaborationCTAProps {
  className?: string
}

/**
 * Collaboration Call-to-Action Section
 *
 * Conversion-focused section that encourages visitors to start a
 * collaboration project with compelling messaging and clear CTAs.
 */
export const CollaborationCTA: React.FC<CollaborationCTAProps> = ({
  className = '',
}) => {
  return (
    <section
      className={`collaboration-cta py-20 bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary text-white relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="collaboration-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#collaboration-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            Ready to Create Something
            <br className="hidden md:block" />
            <span className="text-brand-yellow-accent"> Extraordinary?</span>
          </motion.h2>

          {/* Value Proposition */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto"
          >
            Whether you have a clear vision or just an idea waiting to be
            developed, let's collaborate to bring your musical project to life.
            Every great collaboration starts with a conversation.
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-brand-yellow-accent mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Professional Quality
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                High-standard creative output with attention to detail and
                professional polish
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-brand-yellow-accent mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Creative Flexibility
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Adaptable approach that embraces your unique style and creative
                vision
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-brand-yellow-accent mb-3">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Clear Communication
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Transparent process with regular updates and collaborative
                decision-making
              </p>
            </div>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <CollaborationInquiryCTA
              variant="secondary"
              size="large"
              className="bg-white text-brand-blue-primary hover:bg-gray-100 shadow-lg"
            >
              Start Creative Project
            </CollaborationInquiryCTA>

            <a
              href="mailto:hello@rrishmusic.com?subject=Collaboration Inquiry"
              className="flex items-center gap-2 text-white hover:text-brand-yellow-accent transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Send Direct Email
            </a>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-sm opacity-80 mb-4">
              Have questions about the collaboration process?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <a
                href="mailto:hello@rrishmusic.com"
                className="flex items-center gap-2 text-white hover:text-brand-yellow-accent transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                hello@rrishmusic.com
              </a>

              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-brand-yellow-accent transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @rrishmusic
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CollaborationCTA