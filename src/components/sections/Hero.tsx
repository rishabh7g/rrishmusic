import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { CTAHierarchy } from '@/components/ui/CTAHierarchy';
import { CTAPresets } from '@/components/ui/CTAPresets';

export function Hero() {
  const { data: hero, loading, error } = useSectionContent('hero');

  if (loading) {
    return (
      <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded mb-6 mx-auto max-w-md"></div>
            <div className="h-6 bg-white/20 rounded mb-4 mx-auto max-w-2xl"></div>
            <div className="h-6 bg-white/20 rounded mb-6 mx-auto max-w-xl"></div>
            <div className="h-12 bg-white/20 rounded mb-4 mx-auto max-w-sm"></div>
            <div className="h-6 bg-white/20 rounded mx-auto max-w-xs"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hero) {
    return (
      <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Melbourne Live Music Performer
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-medium mb-6 text-brand-yellow-accent">
            Professional Blues & Improvisation Performances
          </h2>
          
          {/* Performance-Focused Description (80% content allocation) */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <p className="text-lg md:text-xl font-body leading-relaxed">
              I'm Rrish, a professional Melbourne musician specializing in authentic blues guitar and captivating live performances. 
              I bring soulful music and engaging stage presence to venues, events, and celebrations across Melbourne.
            </p>
            <p className="text-base md:text-lg font-body leading-relaxed text-white/90">
              From intimate pub sessions to major events, I deliver memorable musical experiences with professional equipment, 
              extensive repertoire, and the ability to connect with any audience. Available for solo acoustic sets, 
              full band performances, and everything in between.
            </p>
          </div>

          {/* Performance Service Highlights (80% allocation) */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
              variants={fadeInUp}
            >
              <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Venue Shows</div>
              <p className="text-sm text-white/90">Regular performances at Melbourne's top music venues</p>
            </motion.div>
            <motion.div 
              className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
              variants={fadeInUp}
            >
              <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Private Events</div>
              <p className="text-sm text-white/90">Weddings, parties, and corporate entertainment</p>
            </motion.div>
            <motion.div 
              className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
              variants={fadeInUp}
            >
              <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Full Setup</div>
              <p className="text-sm text-white/90">Professional equipment and technical support included</p>
            </motion.div>
          </motion.div>
          
          {/* CTA Strategy with 80/15/5 emphasis */}
          {CTAPresets.hero({ 
            className: "mb-8",
            customMessages: {
              primary: "Book Live Performance",
              secondary: "Guitar Lessons", 
              tertiary: "Studio Work"
            }
          })}
          
          {/* Social Proof - Performance Focused */}
          <div className="mb-6">
            <p className="text-brand-yellow-accent font-semibold text-lg mb-1">
              100+ Live Performances Across Melbourne
            </p>
            <p className="text-white/90 text-sm">
              Trusted by venues, event organizers, and music lovers
            </p>
          </div>
          
          <p className="text-lg font-body">
            Follow my music journey:{' '}
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
      </div>
    );
  }

  return (
    <div className="section bg-gradient-to-r from-brand-blue-primary to-brand-blue-secondary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] bg-repeat opacity-10"></div>
      
      <motion.div 
        className="container-custom text-center relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-heading font-bold mb-4"
          variants={fadeInUp}
        >
          {hero.title || "Melbourne Live Music Performer"}
        </motion.h1>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-heading font-medium mb-6 text-brand-yellow-accent"
          variants={fadeInUp}
        >
          {hero.subtitle || "Professional Blues & Improvisation Performances"}
        </motion.h2>
        
        {/* Performance-Focused Description (80% content allocation) */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8 space-y-4"
          variants={fadeInUp}
        >
          <p className="text-lg md:text-xl font-body leading-relaxed">
            {hero.description || `I'm Rrish, a professional Melbourne musician specializing in authentic blues guitar and captivating live performances. 
            I bring soulful music and engaging stage presence to venues, events, and celebrations across Melbourne.`}
          </p>
          
          {/* Additional performance content (80% allocation) */}
          <p className="text-base md:text-lg font-body leading-relaxed text-white/90">
            From intimate pub sessions to major events, I deliver memorable musical experiences with professional equipment, 
            extensive repertoire, and the ability to connect with any audience. Available for solo acoustic sets, 
            full band performances, and everything in between.
          </p>
        </motion.div>

        {/* Performance Service Highlights (80% allocation) */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            variants={fadeInUp}
          >
            <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Venue Shows</div>
            <p className="text-sm text-white/90">Regular performances at Melbourne's top music venues</p>
          </motion.div>
          <motion.div 
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            variants={fadeInUp}
          >
            <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Private Events</div>
            <p className="text-sm text-white/90">Weddings, parties, and corporate entertainment</p>
          </motion.div>
          <motion.div 
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            variants={fadeInUp}
          >
            <div className="text-brand-yellow-accent text-2xl font-bold mb-2">Full Setup</div>
            <p className="text-sm text-white/90">Professional equipment and technical support included</p>
          </motion.div>
        </motion.div>
        
        {/* CTA Hierarchy with 80/15/5 emphasis */}
        <motion.div 
          className="mb-8"
          variants={fadeInUp}
        >
          <CTAHierarchy 
            layout="horizontal"
            context="hero"
            customMessages={{
              primary: hero.primaryCta?.text || "Book Live Performance",
              secondary: "Guitar Lessons",
              tertiary: "Studio Work"
            }}
          />
        </motion.div>
        
        {/* Social Proof - Performance Focused */}
        <motion.div 
          className="mb-8 text-center"
          variants={fadeInUp}
        >
          {hero.socialProof ? (
            <>
              <p className="text-brand-yellow-accent font-semibold text-lg mb-1">
                {hero.socialProof.highlight}
              </p>
              <p className="text-white/90 text-sm">
                {hero.socialProof.description}
              </p>
            </>
          ) : (
            <>
              <p className="text-brand-yellow-accent font-semibold text-lg mb-1">
                100+ Live Performances Across Melbourne
              </p>
              <p className="text-white/90 text-sm">
                Trusted by venues, event organizers, and music lovers
              </p>
            </>
          )}
        </motion.div>
        
        {/* Instagram Link */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
          variants={fadeInUp}
        >
          <p className="text-lg font-body">
            {hero.ctaText || "Follow my music journey:"}
          </p>
          
          <a
            href={hero.instagramUrl || "https://instagram.com/rrishmusic"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-transparent border border-brand-yellow-accent 
              text-brand-yellow-accent font-semibold rounded-full hover:bg-brand-yellow-accent 
              hover:text-brand-blue-primary transition-colors duration-300 
              shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {hero.instagramHandle || "@rrishmusic"}
          </a>
        </motion.div>
        
        {/* CTA Arrow */}
        <motion.div 
          className="mt-12"
          variants={fadeInUp}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#services-hierarchy" className="inline-block text-brand-yellow-accent hover:text-white transition-colors">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}