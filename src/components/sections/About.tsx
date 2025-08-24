import { motion } from 'framer-motion';
import { useSectionContent, useStats } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';

export function About() {
  const { data: about, loading, error } = useSectionContent('about');
  const { aboutStats } = useStats();

  if (loading) {
    return (
      <div className="section bg-white">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-8 mx-auto max-w-md"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-6"></div>
              </div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !about) {
    return (
      <div className="section bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
            About the Artist
          </h2>
          <p className="text-lg text-neutral-charcoal mt-4">
            Content temporarily unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-white relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-brand-blue-primary/5 rounded-full -translate-y-12 sm:-translate-y-24 lg:-translate-y-32 translate-x-12 sm:translate-x-24 lg:translate-x-32 hidden sm:block"></div>
      
      <motion.div 
        className="container-custom relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-neutral-charcoal mb-4">
            {about.title || "About the Artist"}
          </h2>
          <div className="w-24 h-1 bg-brand-blue-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-16 items-center">
          {/* Primary Content - Performance Focus (80% visual space) */}
          <motion.div 
            className="md:col-span-8 space-y-6"
            variants={slideInLeft}
          >
            {/* Performance-focused content */}
            <motion.div 
              className="bg-gradient-to-br from-brand-blue-primary/5 to-brand-yellow-accent/5 rounded-2xl p-8 mb-8"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-heading font-bold text-brand-blue-primary mb-4">
                Live Performance Background
              </h3>
              <p className="text-lg text-neutral-charcoal leading-relaxed mb-4">
                I'm Rrish, a professional Melbourne musician with extensive experience performing across the city's vibrant music scene. 
                My specialization in blues guitar and improvisation has led to regular performances at established venues, 
                private events, and collaborations with fellow musicians.
              </p>
              <p className="text-lg text-neutral-charcoal leading-relaxed">
                From intimate acoustic sessions to full band performances, I bring authentic blues expression and engaging 
                stage presence to every show. My approach combines technical skill with emotional connection, 
                creating memorable experiences that resonate with audiences.
              </p>
            </motion.div>

            {/* Performance Credentials - Additional 80% content */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={fadeInUp}
            >
              <div className="bg-white rounded-xl p-6 shadow-md border border-brand-blue-primary/10">
                <div className="w-12 h-12 bg-brand-blue-primary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="font-bold text-brand-blue-primary mb-2">Venue Experience</h4>
                <p className="text-sm text-gray-600">Regular performances at Melbourne's established music venues and events</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-brand-blue-primary/10">
                <div className="w-12 h-12 bg-brand-blue-primary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h4 className="font-bold text-brand-blue-primary mb-2">Musical Style</h4>
                <p className="text-sm text-gray-600">Blues-focused with strong improvisation and authentic expression</p>
              </div>
            </motion.div>

            {/* Teaching content (15% allocation) - Reduced but preserved */}
            {about?.content && (
              <motion.div variants={fadeInUp}>
                {about.content.slice(0, 1).map((paragraph, index) => (
                  <p key={index} className="text-base text-neutral-charcoal leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}

            <motion.div 
              className="flex flex-wrap gap-4 pt-6"
              variants={fadeInUp}
            >
              <a
                href="/performance"
                className="inline-flex items-center px-8 py-3 bg-brand-blue-primary text-white 
                  font-semibold rounded-full hover:bg-brand-blue-secondary transition-all duration-300 
                  shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Performance
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#lessons"
                className="inline-flex items-center px-6 py-3 bg-transparent border border-brand-blue-primary 
                  text-brand-blue-primary font-semibold rounded-full hover:bg-brand-blue-primary 
                  hover:text-white transition-all duration-300"
              >
                Guitar Lessons
              </a>
            </motion.div>
          </motion.div>

          {/* Compact Skills/Teaching Section (15% visual space) */}
          <motion.div 
            className="md:col-span-4"
            variants={slideInRight}
          >
            <div className="bg-neutral-gray-light rounded-2xl p-6">
              <h3 className="text-xl font-heading font-bold text-neutral-charcoal mb-6 text-center">
                Skills & Expertise
              </h3>
              
              {/* Compact skills grid */}
              <div className="space-y-3">
                {(about?.skills || [
                  { name: "Blues Guitar" },
                  { name: "Improvisation" },
                  { name: "Live Performance" },
                  { name: "Music Theory" }
                ]).slice(0, 4).map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md 
                      transition-shadow duration-300"
                    variants={fadeInUp}
                    custom={index}
                  >
                    <p className="font-medium text-neutral-charcoal text-sm">
                      {skill.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance-focused stats (80% allocation) */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={fadeInUp}
        >
          <motion.div
            className="text-center"
            variants={fadeInUp}
            custom={0}
          >
            <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-2">
              100+
            </div>
            <div className="text-lg text-neutral-charcoal font-medium">
              Live Performances
            </div>
          </motion.div>
          
          <motion.div
            className="text-center"
            variants={fadeInUp}
            custom={1}
          >
            <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-2">
              5+
            </div>
            <div className="text-lg text-neutral-charcoal font-medium">
              Years Professional Experience
            </div>
          </motion.div>

          {aboutStats && aboutStats.length > 2 ? (
            <motion.div
              className="text-center"
              variants={fadeInUp}
              custom={2}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-2">
                {aboutStats[2].number}
              </div>
              <div className="text-lg text-neutral-charcoal font-medium">
                {aboutStats[2].label}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="text-center"
              variants={fadeInUp}
              custom={2}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-2">
                50+
              </div>
              <div className="text-lg text-neutral-charcoal font-medium">
                Guitar Students Taught
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}