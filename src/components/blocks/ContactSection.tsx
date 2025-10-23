/**
 * ContactSection Block Component
 * Renders a dynamic contact form based on JSON field configuration
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { ContactSectionSchema } from '@/lib/schemas'
import { fadeInUp, staggerContainer } from '@/utils/animations'

type ContactSectionProps = z.infer<typeof ContactSectionSchema>

export function ContactSection({
  title,
  blurb,
  form,
  altLinks,
}: ContactSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // TODO: Implement actual form submission logic
      // For now, just log the data
      console.log('Form submitted:', formData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitMessage("Message sent successfully! I'll get back to you soon.")
      setFormData({})
    } catch (error) {
      setSubmitMessage(
        'Failed to send message. Please try again or use the email link below.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {/* Title */}
          <motion.h2
            className="text-4xl lg:text-5xl font-heading font-bold mb-6 text-center"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>

          {/* Blurb */}
          {blurb && (
            <motion.p
              className="text-xl text-white/90 mb-12 text-center max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {blurb}
            </motion.p>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            <div className="space-y-6">
              {form.fields.map(field => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-2"
                  >
                    {field.label}
                    {field.required !== false && (
                      <span className="text-brand-yellow-accent ml-1">*</span>
                    )}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required !== false}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow-accent"
                      placeholder={field.label}
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required !== false}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow-accent"
                    >
                      <option value="" disabled>
                        Select {field.label.toLowerCase()}
                      </option>
                      {field.options.map(option => (
                        <option
                          key={option}
                          value={option}
                          className="bg-brand-blue-primary text-white"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required !== false}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow-accent"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold text-lg rounded-full hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Sending...' : form.submitLabel}
            </motion.button>

            {/* Submit message */}
            {submitMessage && (
              <motion.p
                className={`mt-4 text-center ${
                  submitMessage.includes('success')
                    ? 'text-brand-yellow-accent'
                    : 'text-red-300'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {submitMessage}
              </motion.p>
            )}
          </motion.form>

          {/* Alternative links */}
          {altLinks && altLinks.length > 0 && (
            <motion.div
              className="mt-8 text-center space-y-2"
              variants={fadeInUp}
            >
              {altLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-white/80 hover:text-brand-yellow-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
