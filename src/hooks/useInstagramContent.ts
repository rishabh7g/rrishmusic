/**
 * Instagram Content Hook
 *
 * Custom hook for managing Instagram content integration across components
 * Features: Content fetching, error handling, caching management, and performance optimization
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { instagramService, InstagramPost } from '@/services/instagram'

export interface InstagramContentState {
  posts: InstagramPost[]
  loading: boolean
  error: string | null
  fromCache: boolean
  hasMore: boolean
}

export interface InstagramContentOptions {
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
  enableCaching?: boolean
}

export interface InstagramContentActions {
  refresh: () => Promise<void>
  clearCache: () => void
  loadMore: () => Promise<void>
  retry: () => Promise<void>
}

/**
 * Custom hook for Instagram content management
 */
export const useInstagramContent = (
  options: InstagramContentOptions = {}
): InstagramContentState & InstagramContentActions => {
  const {
    limit = 8,
    autoRefresh = false,
    refreshInterval = 30 * 60 * 1000, // 30 minutes
    enableCaching = true,
  } = options

  // State management
  const [state, setState] = useState<InstagramContentState>({
    posts: [],
    loading: true,
    error: null,
    fromCache: false,
    hasMore: false,
  })

  // Refs for cleanup and preventing duplicate requests
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const loadingRef = useRef(false)
  const mountedRef = useRef(true)

  /**
   * Load Instagram posts with error handling
   */
  const loadPosts = useCallback(
    async (isRetry: boolean = false, additionalLimit?: number) => {
      if (loadingRef.current && !isRetry) return

      loadingRef.current = true

      try {
        setState(prev => ({
          ...prev,
          loading: true,
          error: isRetry ? null : prev.error,
        }))

        const effectiveLimit = additionalLimit || limit
        const result =
          await instagramService.getPerformancePosts(effectiveLimit)

        if (!mountedRef.current) return

        setState(prev => ({
          ...prev,
          posts: result.posts,
          fromCache: result.fromCache,
          error: result.error || null,
          loading: false,
          hasMore: result.posts.length >= effectiveLimit,
        }))

        // Log for debugging
        if (result.error) {
          console.warn('Instagram content warning:', result.error)
        }
      } catch (error) {
        if (!mountedRef.current) return

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to load Instagram content'
        console.error('Instagram content error:', error)

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
      } finally {
        loadingRef.current = false
      }
    },
    [limit]
  )

  /**
   * Refresh Instagram content
   */
  const refresh = useCallback(async () => {
    await loadPosts(true)
  }, [loadPosts])

  /**
   * Clear cached content and refresh
   */
  const clearCache = useCallback(() => {
    if (enableCaching) {
      instagramService.clearCache()
    }
    loadPosts(true)
  }, [loadPosts, enableCaching])

  /**
   * Load more Instagram posts
   */
  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return

    const newLimit = state.posts.length + limit
    await loadPosts(false, newLimit)
  }, [loadPosts, limit, state.loading, state.hasMore, state.posts.length])

  /**
   * Retry loading after error
   */
  const retry = useCallback(async () => {
    await loadPosts(true)
  }, [loadPosts])

  /**
   * Setup auto-refresh interval
   */
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        if (!loadingRef.current) {
          refresh()
        }
      }, refreshInterval)

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
        }
      }
    }
  }, [autoRefresh, refreshInterval, refresh])

  /**
   * Initial load effect
   */
  useEffect(() => {
    loadPosts()

    // Cleanup on unmount
    return () => {
      mountedRef.current = false
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [loadPosts])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    // State
    ...state,

    // Actions
    refresh,
    clearCache,
    loadMore,
    retry,
  }
}

/**
 * Simplified hook for basic Instagram feed display
 */
export const useInstagramFeed = (limit?: number) => {
  return useInstagramContent({
    limit,
    autoRefresh: true,
    refreshInterval: 30 * 60 * 1000, // 30 minutes
    enableCaching: true,
  })
}

/**
 * Hook for Instagram content with manual refresh control
 */
export const useInstagramGallery = (limit?: number) => {
  return useInstagramContent({
    limit,
    autoRefresh: false,
    enableCaching: true,
  })
}

export default useInstagramContent
