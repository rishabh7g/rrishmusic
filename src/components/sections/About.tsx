import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';

export function About() {
  const { data: about, loading, error } = useSectionContent('about');

  if (loading) {
    return (
      <section id="about" className="section bg-white">
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
      </section>
    );
  }

  if (error || !about) {
    return (
      <section id="about" className="section bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
            About Me
          </h2>
          <p className="text-lg text-neutral-charcoal mt-4">
            Content temporarily unavailable. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section bg-white relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange-warm/5 rounded-full -translate-y-32 translate-x-32"></div>
      
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
            {about.title}
          </h2>
          <div className="w-24 h-1 bg-brand-orange-warm mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-6"
            variants={slideInLeft}
          >
            {about.content.map((paragraph, index) => (
              <motion.p
                key={index}
                className="text-lg text-neutral-charcoal leading-relaxed"
                variants={fadeInUp}
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.div 
              className="pt-6"
              variants={fadeInUp}
            >
              <a
                href="#lessons"
                className="inline-flex items-center px-8 py-3 bg-brand-orange-warm text-white 
                  font-semibold rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 
                  shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Journey
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div 
            className="bg-neutral-gray-light rounded-3xl p-8"
            variants={slideInRight}
          >
            <h3 className="text-2xl font-heading font-bold text-neutral-charcoal mb-8 text-center">
              What I Teach
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {about.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md 
                    transition-shadow duration-300"
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-brand-blue-primary rounded-full flex items-center 
                    justify-center mx-auto mb-3">
                    {/* Music note icon */}
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-neutral-charcoal text-sm">
                    {skill}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats or achievements section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={fadeInUp}
        >
          {[
            { number: "5+", label: "Years Teaching" },
            { number: "100+", label: "Happy Students" },
            { number: "∞", label: "Musical Moments" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={fadeInUp}
              custom={index}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-brand-blue-primary mb-2">
                {stat.number}
              </div>
              <div className="text-lg text-neutral-charcoal font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}