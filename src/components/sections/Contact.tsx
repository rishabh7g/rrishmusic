import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { ContactForm } from '@/components/forms/ContactForm'

export function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleOpenForm = () => {
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
  }

  return (
    <>
      <div id="contact" className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white overflow-hidden">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            className="text-center py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-heading font-bold mb-6"
              variants={fadeInUp}
            >
              Get in Touch
            </motion.h2>
            
            <motion.p
              className="text-xl text-white/80 max-w-2xl mx-auto mb-12"
              variants={fadeInUp}
            >
              Ready to start your musical journey? Let's connect and discuss how I can help you achieve your goals.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <motion.button
                onClick={handleOpenForm}
                className="inline-flex items-center px-12 py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold text-lg rounded-full hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
                <svg 
                  className="w-6 h-6 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm isOpen={isFormOpen} onClose={handleCloseForm} />
    </>
  )
}