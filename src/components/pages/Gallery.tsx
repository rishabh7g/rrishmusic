import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { usePageSEO } from '@/hooks/usePageSEO'
import galleryData from '@/content/gallery.json'

// Types
interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  name: string
  location?: string
  hasUnderscore: boolean
  category?: string
  aspectRatio: number // width/height ratio
  isPortrait: boolean
  isFeatured?: boolean
  priority?: 'high' | 'medium' | 'low'
  gridSpan?: { cols: number; rows: number }
  objectFit?: 'cover' | 'contain'
}

interface GalleryItem {
  filename: string
  category: string
  path: string
  aspectRatio: number
  isFeatured?: boolean
  priority: 'high' | 'medium' | 'low'
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/**
 * Parse image filename to extract name and location
 * Format: {name}_{location} with optional serial numbers
 * Examples:
 * - "All star band_Grazeland.jpg" → name: "All star band", location: "Grazeland", hasUnderscore: true
 * - "XBand_Grazeland 1.jpeg" → name: "XBand", location: "Grazeland", hasUnderscore: true
 * - "Rrish solo 1.jpg" → name: "Rrish solo", location: undefined, hasUnderscore: false
 * - "Rrish_Rishikesh.jpg" → name: "Rrish", location: "Rishikesh", hasUnderscore: true
 */
const parseImageName = (
  filename: string
): { name: string; location?: string; hasUnderscore: boolean } => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Check if there's an underscore (indicating location)
  const underscoreIndex = nameWithoutExt.indexOf('_')

  if (underscoreIndex === -1) {
    // No underscore, so no location - just remove serial numbers if any and use the full name
    const name = nameWithoutExt.replace(/\s+\d+$/, '').trim()
    return { name, hasUnderscore: false }
  }

  // Split by first underscore
  const name = nameWithoutExt.substring(0, underscoreIndex).trim()
  const locationPart = nameWithoutExt.substring(underscoreIndex + 1).trim()

  // Remove serial numbers from location part (numbers at the end)
  const location = locationPart.replace(/\s+\d+$/, '').trim()

  return { name, location: location || undefined, hasUnderscore: true }
}

export function Gallery() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // SEO setup
  usePageSEO({
    title: galleryData.seo.title,
    description: galleryData.seo.description,
    keywords: galleryData.seo.keywords,
    url: galleryData.seo.canonicalUrl,
  })

  // Advanced mosaic layout calculator
  const calculateMosaicLayout = useCallback((items: MediaItem[]) => {
    return items.map((item, index) => {
      const { aspectRatio, isPortrait, isFeatured } = item

      // Enhanced sizing algorithm based on aspect ratio and importance
      let gridSpan = { cols: 1, rows: 1 }
      let objectFit: 'cover' | 'contain' = 'cover'

      if (isFeatured) {
        // Featured images get premium real estate
        gridSpan = isPortrait ? { cols: 2, rows: 3 } : { cols: 3, rows: 2 }
        objectFit = 'contain'
      } else if (aspectRatio >= 2.0) {
        // Wide landscape images (panoramic)
        gridSpan = { cols: 3, rows: 1 }
        objectFit = 'cover'
      } else if (aspectRatio >= 1.5) {
        // Standard landscape images - give them more prominence
        gridSpan = { cols: 2, rows: 2 }
        objectFit = 'cover'
      } else if (aspectRatio >= 1.2) {
        // Slightly wide images
        gridSpan = { cols: 2, rows: 1 }
        objectFit = 'cover'
      } else if (aspectRatio <= 0.6) {
        // Tall portrait images
        gridSpan = { cols: 1, rows: 3 }
        objectFit = 'contain'
      } else if (aspectRatio <= 0.8) {
        // Standard portrait images
        gridSpan = { cols: 1, rows: 2 }
        objectFit = 'cover'
      } else {
        // Square-ish images
        gridSpan = { cols: 1, rows: 1 }
        objectFit = 'cover'
      }

      // Add some randomization for visual interest (every 4th item gets variation)
      if (index % 4 === 0 && !isFeatured) {
        if (isPortrait && gridSpan.rows < 3) {
          gridSpan.rows += 1
        } else if (!isPortrait && gridSpan.cols < 3) {
          gridSpan.cols += 1
        }
      }

      return { ...item, gridSpan, objectFit }
    })
  }, [])

  // Load media items
  useEffect(() => {
    const loadMediaItems = () => {
      try {
        const items: MediaItem[] = []

        // Load image files from JSON configuration
        const imageFiles: GalleryItem[] = galleryData.mediaItems

        imageFiles.forEach((file, index) => {
          const itemId = `image-${file.category}-${index}`
          const parsed = parseImageName(file.filename)

          items.push({
            id: itemId,
            type: 'image',
            src: encodeURI(file.path),
            title: file.filename.replace(/\.[^/.]+$/, ''),
            name: parsed.name,
            location: parsed.location,
            hasUnderscore: parsed.hasUnderscore,
            category: file.category,
            aspectRatio: file.aspectRatio,
            isPortrait: file.aspectRatio < 1,
            isFeatured: file.isFeatured || false,
            priority: file.priority || 'medium',
          })
        })

        // TODO: Load video files when they're added
        // This will scan the /videos/ folder for video files

        // Calculate advanced mosaic layout
        const itemsWithLayout = calculateMosaicLayout(items)
        setMediaItems(itemsWithLayout)
      } catch (error) {
        console.error('Failed to load media items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMediaItems()
  }, [calculateMosaicLayout])

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

  const navigateLightbox = useCallback(
    (direction: number) => {
      setLightboxIndex(prev => {
        const newIndex = prev + direction
        if (newIndex < 0) return mediaItems.length - 1
        if (newIndex >= mediaItems.length) return 0
        return newIndex
      })
    },
    [mediaItems.length]
  )

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
          <p className="text-theme-text-secondary">{galleryData.ui.loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center transition-theme-colors">
        <div className="text-center max-w-md px-4">
          <p className="text-theme-text-secondary mb-4">
            {galleryData.ui.emptyStateTitle}
          </p>
          <p className="text-sm text-theme-text-secondary">
            {galleryData.ui.emptyStateDescription}
          </p>
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
      {/* Enhanced Media Mosaic Grid */}
      <div className="container mx-auto px-4 max-w-7xl mt-8">
        {/* Advanced CSS Grid - Responsive with dynamic spanning */}
        <div className={`grid ${galleryData.layout.grid.mobile} ${galleryData.layout.grid.tablet} ${galleryData.layout.grid.desktop} ${galleryData.layout.grid.rowHeight} ${galleryData.layout.grid.gap}`}>
          {mediaItems.map((item: MediaItem, index) => {
            const { gridSpan, objectFit } = item

            // Responsive grid classes with proper landscape prominence
            const getGridClasses = () => {
              let classes = ''

              // Mobile (2 cols): Simplify spans
              if (gridSpan.cols >= 3) {
                classes += 'col-span-2 '
              } else if (gridSpan.cols >= 2) {
                classes += 'col-span-2 '
              } else {
                classes += 'col-span-1 '
              }

              // Tablet (3-4 cols): Allow more variety
              if (gridSpan.cols >= 3) {
                classes += 'sm:col-span-3 md:col-span-3 '
              } else if (gridSpan.cols >= 2) {
                classes += 'sm:col-span-2 md:col-span-2 '
              } else {
                classes += 'sm:col-span-1 md:col-span-1 '
              }

              // Desktop (6-8 cols): Use static classes for Tailwind build
              const lgCols = Math.min(gridSpan.cols, 4)
              const xlCols = gridSpan.cols
              
              // LG classes (max 4 cols)
              switch (lgCols) {
                case 1: classes += 'lg:col-span-1 '; break;
                case 2: classes += 'lg:col-span-2 '; break;
                case 3: classes += 'lg:col-span-3 '; break;
                case 4: classes += 'lg:col-span-4 '; break;
                default: classes += 'lg:col-span-1 '; break;
              }
              
              // XL classes (up to 8 cols)
              switch (xlCols) {
                case 1: classes += 'xl:col-span-1 '; break;
                case 2: classes += 'xl:col-span-2 '; break;
                case 3: classes += 'xl:col-span-3 '; break;
                case 4: classes += 'xl:col-span-4 '; break;
                case 5: classes += 'xl:col-span-5 '; break;
                case 6: classes += 'xl:col-span-6 '; break;
                case 7: classes += 'xl:col-span-7 '; break;
                case 8: classes += 'xl:col-span-8 '; break;
                default: classes += 'xl:col-span-1 '; break;
              }

              // Row spans - more generous for portraits
              if (gridSpan.rows >= 3) {
                classes += 'row-span-3 sm:row-span-3 md:row-span-4 '
              } else if (gridSpan.rows >= 2) {
                classes += 'row-span-2 sm:row-span-2 md:row-span-3 '
              } else {
                classes += 'row-span-1 sm:row-span-1 md:row-span-2 '
              }

              return classes.trim()
            }

            const gridClasses = getGridClasses()

            // Special styling for featured images
            const featuredClasses = item.isFeatured
              ? 'ring-4 ring-theme-primary/30 shadow-2xl scale-[1.02] z-10'
              : ''

            return (
              <motion.div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl bg-theme-bg-secondary shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${gridClasses} ${featuredClasses}`}
                whileHover={{ scale: item.isFeatured ? 1.03 : 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openLightbox(index)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
              >
                {/* Enhanced image container with proper aspect ratio handling */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Priority badge for high-priority images */}
                  {item.priority === 'high' && (
                    <div className="absolute top-2 left-2 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        {galleryData.ui.featuredBadge}
                      </div>
                    </div>
                  )}

                  {item.type === 'video' ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white/80"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {galleryData.ui.videoBadge}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                        objectFit === 'contain'
                          ? 'object-contain p-2'
                          : 'object-cover'
                      }`}
                      loading="lazy"
                      style={{
                        display: 'block',
                        minHeight: '100%',
                        minWidth: '100%',
                      }}
                    />
                  )}

                  {/* Enhanced overlay with better visual hierarchy */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-3">
                    {/* Content at bottom */}
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {/* Main title */}
                      <h4 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-1">
                        {item.name}
                      </h4>

                      {/* Location and category */}
                      <div className="flex items-center justify-between text-xs text-white/90">
                        {item.hasUnderscore && item.location && (
                          <div className="flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}

                        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full capitalize">
                          {item.category}
                        </div>
                      </div>

                      {/* Aspect ratio indicator */}
                      <div className="mt-2 text-xs text-white/70">
                        {item.aspectRatio >= 1.5
                          ? '🖼️ Landscape'
                          : item.aspectRatio <= 0.8
                            ? '📱 Portrait'
                            : '⏹️ Square'}
                      </div>
                    </div>

                    {/* Zoom icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="bg-white/10 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Layout info for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
            <h4 className="font-semibold mb-2">Layout Debug Info:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {mediaItems.map((item: MediaItem) => (
                <div key={item.id} className="bg-white p-2 rounded">
                  <div className="font-medium">{item.name}</div>
                  <div>Ratio: {item.aspectRatio}</div>
                  <div>
                    Grid: {item.gridSpan?.cols}x{item.gridSpan?.rows}
                  </div>
                  <div>Fit: {item.objectFit}</div>
                  {item.isFeatured && (
                    <div className="text-yellow-600">⭐ Featured</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
              onClick={e => e.stopPropagation()}
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
                      poster={mediaItems[lightboxIndex].src.replace(
                        /\.[^/.]+$/,
                        '.jpg'
                      )}
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
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {mediaItems[lightboxIndex].name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {mediaItems[lightboxIndex].hasUnderscore &&
                          mediaItems[lightboxIndex].location && (
                            <div className="flex items-center text-white/90 text-sm mb-1">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {mediaItems[lightboxIndex].location}
                            </div>
                          )}
                        {mediaItems[lightboxIndex].category && (
                          <span className="text-white/70 text-xs capitalize bg-white/10 px-2 py-1 rounded-full inline-block w-fit">
                            {mediaItems[lightboxIndex].category}
                          </span>
                        )}
                      </div>
                    </div>
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
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => navigateLightbox(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
