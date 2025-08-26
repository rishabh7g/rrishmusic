import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { usePageSEO } from '../../hooks/usePageSEO';
import { CTAHierarchy } from '../ui/CTAHierarchy';

export function Hero() {
  const { seoData } = usePageSEO();
  
  return (
    <motion.section
      className="section bg-gradient-to-r from-theme-primary to-theme-accent text-white theme-transition duration-theme-normal relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      role="banner"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-theme-overlay/20 to-theme-overlay/40 z-0"></div>
      
      {/* Hero content */}
      <div className="container-custom text-center relative z-10">
        {/* Loading skeleton with theme-aware styling */}
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-white/20 rounded mb-6 mx-auto max-w-md theme-transition duration-theme-fast"></div>
            <div className="h-6 bg-white/20 rounded mb-4 mx-auto max-w-2xl theme-transition duration-theme-fast"></div>
            <div className="h-6 bg-white/20 rounded mb-6 mx-auto max-w-xl theme-transition duration-theme-fast"></div>
            <div className="h-12 bg-white/20 rounded mx-auto max-w-xs theme-transition duration-theme-fast"></div>
          </div>
        }>
          {/* Animated Hero Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Hero Heading */}
            <motion.h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {seoData.title || 'Multi-Service Musician Platform'}
            </motion.h1>

            {/* Hero Subheading */}
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto font-light opacity-90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Performance | Teaching | Collaboration
            </motion.p>

            {/* Hero Description */}
            <motion.p 
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto font-light opacity-80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {seoData.description || 'Professional musical services tailored to your unique needs.'}
            </motion.p>

            {/* CTA Buttons with theme-aware styling */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <CTAHierarchy 
                variant="hero"
                className="theme-transition duration-theme-normal"
              />
            </motion.div>
          </motion.div>
        </Suspense>
      </div>

      {/* Decorative elements with theme-aware colors */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-theme-bg/10 to-transparent z-5 pointer-events-none"></div>
      
      {/* Hero pattern/texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </motion.section>
  );
}