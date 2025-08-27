import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/common/SEOHead';

export function Home() {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const boxAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <>
      <SEOHead
        title="Rrish - Piano Performances & Music Lessons"
        description="Experience live piano performances and learn music with Rrish. Choose from professional performances or personalized music lessons."
        keywords="piano, music, performance, lessons, teaching, live music, blues, improvisation"
      />
      
      <main 
        id="main-content"
        className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center p-4 transition-theme-colors"
      >
        <motion.div
          className="container mx-auto max-w-6xl"
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.div 
            className="text-center mb-12"
            variants={boxAnimation}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-theme-text mb-4 transition-theme-colors">
              Welcome to Rrish Music
            </h1>
            <p className="text-xl md:text-2xl text-theme-text-secondary transition-theme-colors">
              Choose your musical journey
            </p>
          </motion.div>

          {/* Two Big Boxes */}
          <div className="grid md:grid-cols-2 gap-8 h-auto md:h-[500px]">
            
            {/* Performances Box */}
            <motion.div variants={boxAnimation}>
              <Link 
                to="/performance"
                className="group block h-full"
              >
                <div className="h-full bg-theme-bg-secondary border-2 border-theme-border hover:border-theme-primary rounded-2xl p-8 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transition-theme-colors">
                  
                  {/* Performance Icon */}
                  <div className="mb-6">
                    <svg 
                      className="w-24 h-24 text-theme-primary group-hover:scale-110 transition-transform duration-300"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                    Performances
                  </h2>
                  
                  <p className="text-lg text-theme-text-secondary mb-6 transition-theme-colors">
                    Live performances, studio work, and musical collaborations. 
                    Experience the artistry of blues improvisation and diverse musical genres.
                  </p>

                  <div className="bg-theme-primary text-white px-8 py-3 rounded-full font-semibold group-hover:bg-theme-primary-hover transition-colors duration-300">
                    Explore Performances
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Lessons Box */}
            <motion.div variants={boxAnimation}>
              <Link 
                to="/lessons"
                className="group block h-full"
              >
                <div className="h-full bg-theme-bg-secondary border-2 border-theme-border hover:border-theme-secondary rounded-2xl p-8 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transition-theme-colors">
                  
                  {/* Lessons Icon */}
                  <div className="mb-6">
                    <svg 
                      className="w-24 h-24 text-theme-secondary group-hover:scale-110 transition-transform duration-300"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                    Lessons
                  </h2>
                  
                  <p className="text-lg text-theme-text-secondary mb-6 transition-theme-colors">
                    Personalized music education for all levels. 
                    Learn piano, music theory, improvisation, and develop your unique musical voice.
                  </p>

                  <div className="bg-theme-secondary text-white px-8 py-3 rounded-full font-semibold group-hover:bg-theme-secondary-hover transition-colors duration-300">
                    Start Learning
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </>
  );
}

export default Home;