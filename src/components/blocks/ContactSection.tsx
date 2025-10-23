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
    <section id="contact" className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
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
            {contactLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target={link.href.includes('instagram') ? '_blank' : undefined}
                rel={link.href.includes('instagram') ? 'noopener noreferrer' : undefined}
                className="px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold text-lg rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
