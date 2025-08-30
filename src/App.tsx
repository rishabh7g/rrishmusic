import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navigation from './components/layout/Navigation'
import { usePageSEO } from './hooks/usePageSEO'
import { ThemeProvider } from './contexts/ThemeContext'

// Lazy load components for better performance
const Home = lazy(() =>
  import('./components/pages/Home').then(module => ({ default: module.Home }))
)
const Teaching = lazy(() => import('./components/pages/Teaching'))
const Gallery = lazy(() =>
  import('./components/pages/Gallery').then(module => ({
    default: module.Gallery,
  }))
)

// Simple loading spinner with theme awareness
const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-theme-bg transition-theme duration-theme-normal">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
    </div>
  )
}

// Page transition variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageVariants = {
  initial: pageTransition.initial,
  animate: pageTransition.in,
  exit: pageTransition.out,
}

const pageTransitions = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
}

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
  )
}

function AppContent() {
  const location = useLocation()
  const { seoData } = usePageSEO()

  // Update document head with SEO data
  useEffect(() => {
    if (seoData.title) {
      document.title = seoData.title
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', seoData.description)

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', seoData.canonicalUrl)

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', seoData.keywords)
  }, [seoData])

  return (
    <>
      <div className="min-h-screen bg-theme-bg text-theme-text relative overflow-x-hidden transition-theme duration-theme-normal theme-transition">
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
                  path="/lessons"
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Teaching />
                      </Suspense>
                    </PageWrapper>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <PageWrapper>
                      <Suspense fallback={<Spinner />}>
                        <Gallery />
                      </Suspense>
                    </PageWrapper>
                  }
                />
                {/* Redirect old performance route to home */}
                <Route
                  path="/performance"
                  element={<Navigate to="/" replace />}
                />
                {/* Redirect old collaboration route to home */}
                <Route
                  path="/collaboration"
                  element={<Navigate to="/" replace />}
                />
                {/* Redirect teaching to lessons for consistency */}
                <Route
                  path="/teaching"
                  element={<Navigate to="/lessons" replace />}
                />
                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </>
  )
}

function App(): React.JSX.Element {
  useEffect(() => {
    // Resource hints and preloading
    const criticalStylesheets = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ]

    criticalStylesheets.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = href
      link.onload = function () {
        this.onload = null
        this.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })

    // Only preload images that are immediately visible on the homepage
    // Performance-specific images are loaded when the user navigates to those pages
    const immediateImages = [
      // Add only images that are immediately visible on page load
      '/images/services/performance-bg.webp', // Used on homepage service cards
    ]

    immediateImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // DNS prefetch for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect to high-priority external origins
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
