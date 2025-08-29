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


export function Gallery() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
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
          <p className="text-theme-text-secondary mb-4">No media content available at the moment.</p>
          <p className="text-sm text-theme-text-secondary">Media files will appear here once they're added to the gallery.</p>
        </div>
      </div>
    )
  }


  return (
    <motion.div
      className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >


      {/* Media Mosaic Grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-8">

        {/* Masonry/Mosaic Grid - Natural aspect ratios */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl bg-theme-bg-secondary shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer break-inside-avoid mb-4 md:mb-6 ${
                imageAspectRatios[item.id] === false ? 'transform scale-110 my-6 md:my-8' : ''
              }`}
              whileHover={{ scale: imageAspectRatios[item.id] === false ? 1.12 : 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {/* Natural aspect ratio thumbnail */}
              <div className="relative overflow-hidden">
                {item.type === 'video' ? (
                  <div className="relative w-full aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      VIDEO
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    style={{ display: 'block' }}
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