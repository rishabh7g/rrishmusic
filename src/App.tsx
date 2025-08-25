import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  
  return (
    <>
      <Helmet
        titleTemplate={seoData.titleTemplate}
        defaultTitle={seoData.defaultTitle}
      >
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e40af" />
        
        {/* Base SEO */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:url" content={seoData.openGraph.url} />
        <meta property="og:image" content={seoData.openGraph.image} />
        <meta property="og:image:alt" content={seoData.openGraph.imageAlt} />
        <meta property="og:site_name" content={seoData.openGraph.siteName} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
        <meta name="twitter:image:alt" content={seoData.twitter.imageAlt} />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content={seoData.robots} />
        <meta name="author" content={seoData.author} />
        
        {/* Service-specific keywords */}
        <meta name="keywords" content={seoData.keywords} />
        
        {/* Local SEO - Melbourne based */}
        <meta property="business:contact_data:locality" content="Melbourne" />
        <meta property="business:contact_data:region" content="Victoria" />
        <meta property="business:contact_data:country_name" content="Australia" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
        
        {/* Breadcrumb Structured Data */}
        {seoData.breadcrumbData && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.breadcrumbData)}
          </script>
        )}
      </Helmet>

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