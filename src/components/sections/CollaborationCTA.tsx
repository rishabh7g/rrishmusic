import React from 'react'
import { motion } from 'framer-motion'

export const CollaborationCTA: React.FC = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/60 backdrop-blur-sm rounded-xl p-8 sm:p-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Let's discuss your creative vision and bring it to life through collaborative music-making
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Collaboration
            </motion.a>
            <motion.a
              href="/gallery"
              className="border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}