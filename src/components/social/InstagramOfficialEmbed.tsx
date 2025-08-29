/**
 * Instagram Official Embed Component
 *
 * Uses Instagram's native embed system for full interactive posts
 * Requires Instagram's embed.js script to be loaded
 */

import React, { useEffect, useRef } from 'react'
import { processInstagramEmbed } from '@/utils/instagramUtils'

interface InstagramOfficialEmbedProps {
  embedCode: string
  className?: string
  fallbackUrl?: string
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void
      }
    }
  }
}

export const InstagramOfficialEmbed: React.FC<InstagramOfficialEmbedProps> = ({
  embedCode,
  className = '',
  fallbackUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    const loadInstagramScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.async = true
        script.src = '//www.instagram.com/embed.js'
        script.onload = () => resolve()
        script.onerror = () =>
          reject(new Error('Failed to load Instagram embed script'))
        document.head.appendChild(script)
      })
    }

    const processEmbeds = async () => {
      try {
        if (!scriptLoadedRef.current) {
          await loadInstagramScript()
          scriptLoadedRef.current = true
        }

        // Process Instagram embeds
        if (window.instgrm?.Embeds?.process) {
          window.instgrm.Embeds.process()
        }
      } catch (error) {
        console.warn('Instagram embed script failed to load:', error)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      processEmbeds()
    }, 100)

    return () => clearTimeout(timer)
  }, [embedCode])

  const handleError = () => {
    if (fallbackUrl) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Process the embed code to remove caption
  const processedEmbedCode = processInstagramEmbed(embedCode)

  return (
    <div
      ref={containerRef}
      className={`instagram-embed-container ${className}`}
      onError={handleError}
    >
      <div
        dangerouslySetInnerHTML={{ __html: processedEmbedCode }}
        className="instagram-embed-wrapper"
      />

      {/* Fallback link if embed fails */}
      {fallbackUrl && (
        <noscript>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">View this post on Instagram</p>
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Open Instagram Post
            </a>
          </div>
        </noscript>
      )}
    </div>
  )
}

export default InstagramOfficialEmbed
