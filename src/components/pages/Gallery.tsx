/**
 * Gallery Page Component
 * Renders mosaic gallery from JSON configuration using blocks architecture
 */

import { usePageSEO } from '@/hooks/usePageSEO'
import { getGalleryBlocks } from '@/lib/content.service'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { BlockErrorFallback } from '@/components/common/BlockErrorFallback'

export function Gallery() {
  // Load page blocks from JSON via content service
  const blocks = getGalleryBlocks()

  // Set up SEO metadata
  usePageSEO({
    title: 'Gallery - Rrish Music',
    description:
      "Explore Rrish's musical journey through photos and videos from live music sessions and teaching moments.",
    keywords:
      'gallery, photos, videos, music, guitar, teaching, Melbourne musician',
    url: 'https://www.rrishmusic.com/gallery',
  })

  return (
    <>
      {/* Render blocks dynamically from JSON */}
      {blocks.map(({ Component, props }, index) => (
        <ErrorBoundary
          key={`block-${index}`}
          fallback={({ resetError }) => (
            <BlockErrorFallback blockName="Gallery" onRetry={resetError} />
          )}
        >
          <Component {...props} />
        </ErrorBoundary>
      ))}
    </>
  )
}
