import React from 'react'
import { motion } from 'framer-motion'

export const CollaborationHero: React.FC = () => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Creative
            <span className="text-blue-400"> Collaboration</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed">
            Partner with Rrish on musical projects, recordings, and artistic collaborations
          </p>
          <motion.a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}