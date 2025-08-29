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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  // Auto-play functionality (optional) - pause when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) return

    const interval = setInterval(() => {
      if (mediaItems.length > 1) {
        paginate(1)
      }
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [paginate, mediaItems.length, isLightboxOpen])

  // Lightbox functions
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }, [])

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const navigateLightbox = useCallback((direction: number) => {
    setLightboxIndex(prev => {
      const newIndex = prev + direction
      if (newIndex < 0) return mediaItems.length - 1
      if (newIndex >= mediaItems.length) return 0
      return newIndex
    })
  }, [mediaItems.length])

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      } else if (event.key === 'ArrowLeft') {
        navigateLightbox(-1)
      } else if (event.key === 'ArrowRight') {
        navigateLightbox(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, closeLightbox, navigateLightbox])

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

      {/* Carousel Container - Fixed layout to prevent shifts */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative">
          {/* Main Carousel - Static container with consistent dimensions */}
          <div className="relative h-[70vh] md:h-[75vh] rounded-3xl overflow-hidden bg-theme-bg-secondary shadow-2xl flex items-center justify-center">
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
                    className={`${
                      currentItemIsPortrait 
                        ? 'max-h-full max-w-full object-contain' 
                        : 'w-full h-full object-cover'
                    }`}
                    loading="lazy"
                    style={currentItemIsPortrait ? { maxHeight: '100%', maxWidth: '100%' } : {}}
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
          </div>

          {/* Indicators - Fixed position to prevent layout shifts */}
          <div className="flex justify-center mt-8 space-x-2">
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

          {/* Counter - Fixed position */}
          <div className="text-center mt-6">
            <span className="text-theme-text-secondary text-sm">
              {currentIndex + 1} of {mediaItems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pinterest-style Grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            Browse All Media
          </h2>
          <p className="text-lg text-white/80 drop-shadow">
            Click on any image or video to view it in full size
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-theme-bg-secondary shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {/* Thumbnail */}
              <div className={`relative ${
                imageAspectRatios[item.id] ? 'aspect-[3/4]' : 'aspect-[4/3]'
              } overflow-hidden`}>
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      VIDEO
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate group-hover:text-brand-yellow-accent transition-colors">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="text-xs text-white/60 capitalize">{item.category}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Lightbox Content */}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Current lightbox item */}
              {mediaItems[lightboxIndex] && (
                <div className="relative">
                  {mediaItems[lightboxIndex].type === 'video' ? (
                    <video
                      src={mediaItems[lightboxIndex].src}
                      controls
                      autoPlay
                      className="max-w-full max-h-[90vh] rounded-lg"
                      poster={mediaItems[lightboxIndex].src.replace(/\.[^/.]+$/, '.jpg')}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <img
                      src={mediaItems[lightboxIndex].src}
                      alt={mediaItems[lightboxIndex].title}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                  )}
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {mediaItems[lightboxIndex].title}
                    </h3>
                    {mediaItems[lightboxIndex].category && (
                      <span className="text-white/80 text-sm capitalize">
                        {mediaItems[lightboxIndex].category}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={() => navigateLightbox(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => navigateLightbox(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Close lightbox"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {lightboxIndex + 1} of {mediaItems.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </motion.div>
  )
}