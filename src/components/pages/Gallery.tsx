import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageSEO } from '@/hooks/usePageSEO'

// Types
interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  category?: string
  isPortrait?: boolean
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
}

const transition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
}

export function Gallery() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, boolean>>({})

  // SEO setup
  usePageSEO({
    title: 'Gallery - Rrish Music',
    description: 'Explore Rrish\'s musical journey through photos and videos showcasing performances and collaborations.',
    keywords: 'gallery, photos, videos, performances, music, collaboration, band',
    canonicalUrl: 'https://www.rrishmusic.com/gallery'
  })

  // Detect image aspect ratio
  const detectImageAspectRatio = useCallback((src: string, itemId: string) => {
    const img = new Image()
    img.onload = () => {
      const isPortrait = img.height > img.width
      setImageAspectRatios(prev => ({
        ...prev,
        [itemId]: isPortrait
      }))
    }
    img.onerror = () => {
      // Fallback to landscape if image fails to load
      setImageAspectRatios(prev => ({
        ...prev,
        [itemId]: false
      }))
    }
    img.src = src
  }, [])

  // Load media items
  useEffect(() => {
    const loadMediaItems = () => {
      try {
        const items: MediaItem[] = []

        // Load image files from known structure
        const imageFiles = [
          {
            filename: 'All star band.jpg',
            category: 'band',
            path: '/images/instagram/band/All star band.jpg'
          },
          {
            filename: 'XBand 1.jpg',
            category: 'band', 
            path: '/images/instagram/band/XBand 1.jpg'
          },
          {
            filename: 'XBand 2.jpg',
            category: 'band',
            path: '/images/instagram/band/XBand 2.jpg'
          },
          {
            filename: 'XBand 3.jpg',
            category: 'band',
            path: '/images/instagram/band/XBand 3.jpg'
          },
          {
            filename: 'My portrait 1.jpg',
            category: 'portrait',
            path: '/images/instagram/portrait/My portrait 1.jpg'
          },
          {
            filename: 'My portrait 2.jpg',
            category: 'portrait',
            path: '/images/instagram/portrait/My portrait 2.jpg'
          },
          {
            filename: 'My portrait 4.jpg',
            category: 'portrait',
            path: '/images/instagram/portrait/My portrait 4.jpg'
          }
        ]

        imageFiles.forEach((file, index) => {
          const itemId = `image-${file.category}-${index}`
          items.push({
            id: itemId,
            type: 'image',
            src: file.path,
            title: file.filename.replace(/\.[^/.]+$/, ''),
            category: file.category
          })
          
          // Detect aspect ratio for each image
          detectImageAspectRatio(file.path, itemId)
        })

        // TODO: Load video files when they're added
        // This will scan the /videos/ folder for video files

        setMediaItems(items)
      } catch (error) {
        console.error('Failed to load media items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMediaItems()
  }, [detectImageAspectRatio])

  // Navigation functions
  const paginate = useCallback((newDirection: number) => {
    if (mediaItems.length === 0) return
    
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
      } else {
        return prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
      }
    })
  }, [mediaItems.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        paginate(-1)
      } else if (event.key === 'ArrowRight') {
        paginate(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paginate])

  // Auto-play functionality (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (mediaItems.length > 1) {
        paginate(1)
      }
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [paginate, mediaItems.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center transition-theme-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme-primary mx-auto mb-4"></div>
          <p className="text-theme-text-secondary">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center transition-theme-colors">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-heading font-bold mb-4">Gallery</h1>
          <p className="text-theme-text-secondary mb-4">No media content available at the moment.</p>
          <p className="text-sm text-theme-text-secondary">Media files will appear here once they're added to the gallery.</p>
        </div>
      </div>
    )
  }

  const currentItem = mediaItems[currentIndex]
  const currentItemIsPortrait = currentItem ? imageAspectRatios[currentItem.id] : false

  return (
    <motion.div
      className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Explore the musical journey through photos and videos of performances, collaborations, and behind-the-scenes moments.
          </p>
          <div className="w-24 h-1 bg-brand-orange-warm mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      {/* Carousel Container */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative">
          {/* Main Carousel - Dynamic height based on image orientation */}
          <motion.div 
            className={`relative rounded-3xl overflow-hidden bg-theme-bg-secondary shadow-2xl transition-all duration-500 ${
              currentItemIsPortrait 
                ? 'h-[70vh] md:h-[80vh] max-w-2xl mx-auto' 
                : 'h-[60vh] md:h-[70vh]'
            }`}
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 w-full h-full"
              >
                {currentItem.type === 'video' ? (
                  <video
                    src={currentItem.src}
                    controls
                    className="w-full h-full object-cover"
                    poster={currentItem.src.replace(/\.[^/.]+$/, '.jpg')}
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title}
                    className={`w-full h-full ${
                      currentItemIsPortrait 
                        ? 'object-contain bg-black' 
                        : 'object-cover'
                    }`}
                    loading="lazy"
                  />
                )}

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <h3 className="text-white text-xl md:text-2xl font-heading font-bold mb-2">
                    {currentItem.title}
                  </h3>
                  {currentItem.category && (
                    <span className="inline-block px-3 py-1 bg-brand-blue-primary/20 text-brand-blue-light text-sm rounded-full">
                      {currentItem.category}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === currentIndex
                    ? 'bg-brand-orange-warm scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-theme-text-secondary text-sm">
              {currentIndex + 1} of {mediaItems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </motion.div>
  )
}