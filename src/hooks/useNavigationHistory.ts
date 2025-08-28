import { useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Navigation history entry interface
 */
export interface NavigationHistoryEntry {
  path: string
  title: string
  timestamp: number
  fromBreadcrumb?: boolean
  serviceType?: string
}

/**
 * Navigation history hook options
 */
interface UseNavigationHistoryOptions {
  maxHistorySize?: number
  persistToStorage?: boolean
  storageKey?: string
  trackBreadcrumbClicks?: boolean
}

/**
 * Navigation history hook return type
 */
interface UseNavigationHistoryReturn {
  history: NavigationHistoryEntry[]
  currentIndex: number
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
  addToHistory: (path: string, title: string, fromBreadcrumb?: boolean) => void
  clearHistory: () => void
  getRecentPages: (count?: number) => NavigationHistoryEntry[]
  getServiceHistory: (serviceType: string) => NavigationHistoryEntry[]
  removeFromHistory: (index: number) => void
}

/**
 * Default options for navigation history
 */
const defaultOptions: Required<UseNavigationHistoryOptions> = {
  maxHistorySize: 50,
  persistToStorage: true,
  storageKey: 'rrishmusic-navigation-history',
  trackBreadcrumbClicks: true,
}

/**
 * Detect service type from path
 */
const detectServiceType = (path: string): string | undefined => {
  if (path.includes('/teaching') || path.includes('lesson')) return 'teaching'
  if (path.includes('/performance') || path.includes('show'))
    return 'performance'
  if (path.includes('/collaboration') || path.includes('project'))
    return 'collaboration'
  return undefined
}

/**
 * Custom hook for managing navigation history with breadcrumb integration
 *
 * Features:
 * - Track page navigation history
 * - Browser back/forward integration
 * - Breadcrumb click tracking
 * - Service-specific history filtering
 * - Persistent storage support
 * - History size management
 */
export const useNavigationHistory = (
  options: UseNavigationHistoryOptions = {}
): UseNavigationHistoryReturn => {
  const opts = { ...defaultOptions, ...options }
  const location = useLocation()
  const navigate = useNavigate()

  // Initialize history from storage or empty array
  const [history, setHistory] = useState<NavigationHistoryEntry[]>(() => {
    if (opts.persistToStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(opts.storageKey)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.warn('Failed to load navigation history from storage:', error)
        return []
      }
    }
    return []
  })

  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  /**
   * Save history to localStorage
   */
  const saveToStorage = useCallback(
    (newHistory: NavigationHistoryEntry[]) => {
      if (opts.persistToStorage && typeof window !== 'undefined') {
        try {
          localStorage.setItem(opts.storageKey, JSON.stringify(newHistory))
        } catch (error) {
          console.warn('Failed to save navigation history to storage:', error)
        }
      }
    },
    [opts.persistToStorage, opts.storageKey]
  )

  /**
   * Add entry to navigation history
   */
  const addToHistory = useCallback(
    (path: string, title: string, fromBreadcrumb: boolean = false) => {
      const entry: NavigationHistoryEntry = {
        path,
        title,
        timestamp: Date.now(),
        fromBreadcrumb,
        serviceType: detectServiceType(path),
      }

      setHistory(prevHistory => {
        // Don't add if it's the same as the last entry
        const lastEntry = prevHistory[prevHistory.length - 1]
        if (lastEntry && lastEntry.path === path) {
          return prevHistory
        }

        // Add new entry and limit size
        const newHistory = [...prevHistory, entry].slice(-opts.maxHistorySize)
        saveToStorage(newHistory)
        return newHistory
      })

      setCurrentIndex(prevIndex => {
        const newIndex = Math.min(prevIndex + 1, opts.maxHistorySize - 1)
        return newIndex
      })
    },
    [opts.maxHistorySize, saveToStorage]
  )

  /**
   * Navigate back in history
   */
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const previousEntry = history[currentIndex - 1]
      setCurrentIndex(currentIndex - 1)
      navigate(previousEntry.path)
    } else {
      // Fallback to browser back
      window.history.back()
    }
  }, [currentIndex, history, navigate])

  /**
   * Navigate forward in history
   */
  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextEntry = history[currentIndex + 1]
      setCurrentIndex(currentIndex + 1)
      navigate(nextEntry.path)
    } else {
      // Fallback to browser forward
      window.history.forward()
    }
  }, [currentIndex, history, navigate])

  /**
   * Clear all navigation history
   */
  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
    if (opts.persistToStorage && typeof window !== 'undefined') {
      localStorage.removeItem(opts.storageKey)
    }
  }, [opts.persistToStorage, opts.storageKey])

  /**
   * Get recent pages from history
   */
  const getRecentPages = useCallback(
    (count: number = 5): NavigationHistoryEntry[] => {
      return history.slice(-count).reverse() // Most recent first
    },
    [history]
  )

  /**
   * Get history entries for specific service type
   */
  const getServiceHistory = useCallback(
    (serviceType: string): NavigationHistoryEntry[] => {
      return history.filter(entry => entry.serviceType === serviceType)
    },
    [history]
  )

  /**
   * Remove entry from history by index
   */
  const removeFromHistory = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setHistory(prevHistory => {
          const newHistory = prevHistory.filter((_, i) => i !== index)
          saveToStorage(newHistory)
          return newHistory
        })

        // Adjust current index if necessary
        if (currentIndex >= index) {
          setCurrentIndex(Math.max(0, currentIndex - 1))
        }
      }
    },
    [history.length, currentIndex, saveToStorage]
  )

  /**
   * Track location changes automatically
   */
  useEffect(() => {
    const pathChanged =
      history.length === 0 ||
      history[history.length - 1]?.path !== location.pathname

    if (pathChanged) {
      // Get page title from document or generate from path
      const pageTitle =
        document.title.split(' | ')[0] ||
        location.pathname.split('/').pop()?.replace('-', ' ') ||
        'Page'

      addToHistory(location.pathname, pageTitle)
    }
  }, [location.pathname, addToHistory, history])

  /**
   * Set up keyboard shortcuts for navigation
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Left Arrow = Go Back
      if (event.altKey && event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault()
        goBack()
      }

      // Alt + Right Arrow = Go Forward
      if (
        event.altKey &&
        event.key === 'ArrowRight' &&
        currentIndex < history.length - 1
      ) {
        event.preventDefault()
        goForward()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goBack, goForward, currentIndex, history.length])

  /**
   * Handle browser back/forward buttons
   */
  useEffect(() => {
    const handlePopState = () => {
      // Update current index based on location
      const currentPath = location.pathname
      const foundIndex = history.findIndex(entry => entry.path === currentPath)
      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [history, location.pathname])

  // Calculate navigation capabilities
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < history.length - 1

  return {
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    addToHistory,
    clearHistory,
    getRecentPages,
    getServiceHistory,
    removeFromHistory,
  }
}

export default useNavigationHistory
