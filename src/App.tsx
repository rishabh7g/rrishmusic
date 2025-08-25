import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navigation from './components/layout/Navigation';
import { usePageSEO } from './hooks/usePageSEO';

// Lazy load components for better performance
const Home = lazy(() => import('./components/pages/Home').then(module => ({ default: module.Home })));
const Teaching = lazy(() => import('./components/pages/Teaching'));
const Performance = lazy(() => import('./components/pages/Performance'));
const Collaboration = lazy(() => import('./components/pages/Collaboration'));

// Simple loading spinner
const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Page transition variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageVariants = {
  initial: pageTransition.initial,
  animate: pageTransition.in,
  exit: pageTransition.out
};

const pageTransitions = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransitions}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const { seoData } = usePageSEO();
  
  // Update document head with SEO data
  useEffect(() => {
    if (seoData.title) {
      document.title = seoData.title;
    }
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoData.description);
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoData.canonicalUrl);
    
    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seoData.keywords);
    
  }, [seoData]);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
        <Navigation />
        
        <main className="main-content">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Home />
                      </Suspense>
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="/teaching" 
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Teaching />
                      </Suspense>
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="/performance" 
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Performance />
                      </Suspense>
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="/collaboration" 
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Collaboration />
                      </Suspense>
                    </PageWrapper>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    // Resource hints and preloading
    const criticalStylesheets = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalStylesheets.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Preload hero images for faster LCP
    const heroImages = [
      '/images/performance-hero-bg.webp',
      '/images/services/performance-bg.webp'
    ];

    heroImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const externalDomains = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect to high-priority external origins
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  return <AppContent />;
}

export default App;