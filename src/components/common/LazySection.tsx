/**
 * Lazy Loading Component for Performance Optimization
 * Implements intersection observer for efficient section loading
 */

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
  once?: boolean
}

/**
 * Loading skeleton component
 */
const DefaultFallback: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
)

/**
 * Intersection observer hook for lazy loading
 */
function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (options.once !== false) {
            observer.unobserve(entry.target)
          }
        } else if (options.once === false) {
          setIsIntersecting(false)
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(elementRef.current)

    return () => observer.disconnect()
  }, [elementRef, options])

  return isIntersecting
}

/**
 * Lazy section component with intersection observer
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  fallback = <DefaultFallback />,
  rootMargin = '100px',
  threshold = 0.1,
  once = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, {
    rootMargin,
    threshold,
    once,
  })

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </motion.div>
      ) : (
        <div
          style={{ height: '300px' }}
          className="flex items-center justify-center"
        >
          {fallback}
        </div>
      )}
    </div>
  )
}

/**
 * Image lazy loading component
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  className?: string
  wrapperClassName?: string
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className = '',
  wrapperClassName = '',
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '50px' }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        ref={imgRef}
        src={
          isInView
            ? src
            : placeholder ||
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
        }
        alt={alt}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={handleLoad}
        loading="lazy"
        {...imgProps}
      />
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default LazySection
