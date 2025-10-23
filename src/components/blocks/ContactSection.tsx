/**
 * ContactSection Block Component
 * Simple contact links component - no form, just direct contact options
 */

import { motion } from 'framer-motion'
import { z } from 'zod'
import { ContactSectionSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type ContactSectionProps = z.infer<typeof ContactSectionSchema>

export function ContactSection({
  title,
  blurb,
  contactLinks,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="py-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Title */}
          <motion.h2
            className="text-4xl lg:text-5xl font-heading font-bold mb-6"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>

          {/* Blurb */}
          {blurb && (
            <motion.p
              className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {blurb}
            </motion.p>
          )}

          {/* Contact Links */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
            variants={staggerContainer}
          >
            {contactLinks.map((link, index) => {
              const isInstagram = link.href.includes('instagram')
              const isEmail = link.href.includes('mailto')

              return (
                <motion.a
                  key={index}
                  href={link.href}
                  target={isInstagram ? '_blank' : undefined}
                  rel={isInstagram ? 'noopener noreferrer' : undefined}
                  className="px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold text-lg rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Email Icon */}
                  {isEmail && (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  )}

                  {/* Instagram Icon */}
                  {isInstagram && (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}

                  {link.label}
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
