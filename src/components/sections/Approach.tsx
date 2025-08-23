import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations';

export function Approach() {
  const { data: approach, loading, error } = useSectionContent('approach');

  if (loading) {
    return (
      <section id="approach" className="section bg-neutral-gray-light">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-300 rounded mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-gray-300 rounded mx-auto max-w-md"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-8">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !approach) {
    return (
      <section id="approach" className="section bg-neutral-gray-light">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-heading font-bold text-neutral-charcoal">
            My Teaching Approach
          </h2>
          <p className="text-lg text-neutral-charcoal mt-4">
            Content temporarily unavailable. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Map icons to approach principles
  const getIcon = (title: string) => {
    const iconMap: { [key: string]: string } = {
      'Individual Focus': 'user',
      'Practical Learning': 'play',
      'Creative Freedom': 'heart',
      'Theory & Practice': 'book',
      'Performance Ready': 'mic',
      'Supportive Environment': 'users'
    };
    
    return iconMap[title] || 'music';
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'play':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9V10z" />
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'book':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'mic':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        );
    }
  };

  return (
    <section id="approach" className="section bg-neutral-gray-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-blue-primary/5 rounded-full -translate-x-48"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-orange-warm/5 rounded-full translate-x-40"></div>
      
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
            {approach.title}
          </h2>
          <p className="text-xl text-neutral-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            {approach.subtitle}
          </p>
          <div className="w-24 h-1 bg-brand-orange-warm mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {approach.principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 
                group hover:-translate-y-2 relative overflow-hidden"
              variants={scaleIn}
              custom={index}
              whileHover={{ scale: 1.02 }}
            >
              {/* Card decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-blue-primary/10 
                to-brand-orange-warm/10 rounded-full -translate-y-10 translate-x-10"></div>
              
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary 
                  rounded-2xl flex items-center justify-center mx-auto mb-6 text-white
                  group-hover:scale-110 transition-transform duration-300 relative z-10"
                whileHover={{ rotate: 5 }}
              >
                {renderIcon(getIcon(principle.title))}
              </motion.div>
              
              <h3 className="text-xl font-heading font-bold text-neutral-charcoal mb-4 text-center">
                {principle.title}
              </h3>
              
              <p className="text-neutral-charcoal/80 leading-relaxed text-center">
                {principle.description}
              </p>
              
              {/* Subtle hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue-primary 
                to-brand-orange-warm transform scale-x-0 group-hover:scale-x-100 transition-transform 
                duration-300 origin-left"></div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div 
          className="text-center mt-16"
          variants={fadeInUp}
        >
          <p className="text-lg text-neutral-charcoal mb-8">
            Ready to experience this approach firsthand?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#lessons"
              className="inline-flex items-center px-8 py-3 bg-brand-blue-primary text-white 
                font-semibold rounded-full hover:bg-brand-blue-secondary transition-all duration-300 
                shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Lesson Packages
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 border-2 border-brand-orange-warm 
                text-brand-orange-warm font-semibold rounded-full hover:bg-brand-orange-warm 
                hover:text-white transition-all duration-300"
            >
              Ask Questions
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}