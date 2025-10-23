/**
 * Home Page Component
 * Renders blocks from JSON configuration using blocks architecture
 */

import SEOHead from '@/components/common/SEOHead'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { BlockErrorFallback } from '@/components/common/BlockErrorFallback'
import { getHomeBlocks } from '@/lib/content.service'

export function Home() {
  // Load page blocks from JSON via content service
  const blocks = getHomeBlocks()

  return (
    <>
      {/* SEO metadata */}
      <SEOHead
        title="Music Lessons - Drums, Keyboard, Guitar | Private One-on-One Teaching"
        description="Private music lessons for drums, keyboard, and guitar. Free 30-minute trial. Learn theory, technique, and complete songs with a focus on real progress."
        keywords="music lessons, drum lessons, keyboard lessons, guitar lessons, private music teacher, one-on-one lessons"
        canonical="https://www.rrishmusic.com"
        type="website"
      />

      <main
        id="main-content"
        className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      >
        {/* Render blocks dynamically from JSON */}
        {blocks.map(({ Component, props }, index) => (
          <ErrorBoundary
            key={`block-${index}`}
            fallback={({ resetError }) => (
              <BlockErrorFallback
                blockName={props.title || `Section ${index + 1}`}
                onRetry={resetError}
              />
            )}
          >
            <Component {...props} />
          </ErrorBoundary>
        ))}
      </main>
    </>
  )
}
