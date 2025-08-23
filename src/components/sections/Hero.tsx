import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/utils/animations';

export function Hero() {
  const { data: hero, loading, error } = useSectionContent('hero');

  if (loading) {
    return (
      <section
        id="hero"
        className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
      >
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded mb-6 mx-auto max-w-md"></div>
            <div className="h-6 bg-white/20 rounded mb-4 mx-auto max-w-2xl"></div>
            <div className="h-6 bg-white/20 rounded mb-6 mx-auto max-w-xl"></div>
            <div className="h-6 bg-white/20 rounded mx-auto max-w-xs"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !hero) {
    return (
      <section
        id="hero"
        className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white"
      >
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Hi, I'm Rrish.
          </h1>
          <p className="text-lg md:text-xl font-body mb-6 max-w-3xl mx-auto leading-relaxed">
            I'm a musician who improvises on blues and different music genres.
            I help people learn music at every level and improve their improvisation skills.
          </p>
          <p className="text-lg font-body">
            Find me on Instagram:{' '}
            <a
              href="https://instagram.com/rrishmusic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-yellow-accent hover:text-white transition-colors duration-300 font-medium underline 
                decoration-2 underline-offset-2"
            >
              @rrishmusic
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] bg-repeat opacity-10"></div>
      
      <motion.div 
        className="container-custom text-center relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-heading font-bold mb-6"
          variants={fadeInUp}
        >
          {hero.title}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl font-body mb-8 max-w-3xl mx-auto leading-relaxed"
          variants={fadeInUp}
        >
          {hero.subtitle}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          variants={fadeInUp}
        >
          <p className="text-lg font-body">
            {hero.ctaText}
          </p>
          
          <a
            href={hero.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-brand-yellow-accent text-brand-blue-primary 
              font-semibold rounded-full hover:bg-white transition-colors duration-300 
              shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {hero.instagramHandle}
          </a>
        </motion.div>
        
        {/* CTA Arrow */}
        <motion.div 
          className="mt-12"
          variants={fadeInUp}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#about" className="inline-block text-brand-yellow-accent hover:text-white transition-colors">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}