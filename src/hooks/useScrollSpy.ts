import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseScrollSpyOptions {
  offset?: number
  throttle?: number
  rootMargin?: string
}

/**
 * Optimized scroll spy hook with performance improvements
 * Uses Intersection Observer API for better performance
 */
export const useScrollSpy = (
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
): string => {
  const {
    offset = 100,
    throttle = 100,
    rootMargin = '-10% 0px -85% 0px',
  } = options
  const [activeSection, setActiveSection] = useState<string>('')

  // Memoize section elements to avoid repeated DOM queries
  const sectionElements = useMemo(() => {
    return sectionIds
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
  }, [sectionIds])

  // Throttled scroll handler as fallback
  const throttledScrollHandler = useCallback(() => {
    let timeoutId: number

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = window.setTimeout(() => {
        const scrollPosition = window.scrollY + offset

        for (const element of sectionElements) {
          const { offsetTop, offsetHeight } = element

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(element.id)
            break
          }
        }
      }, throttle)
    }
  }, [sectionElements, offset, throttle])

  useEffect(() => {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback to scroll event listener
      const handleScroll = throttledScrollHandler()

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial call

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // Use Intersection Observer for better performance
    const observerOptions: IntersectionObserverInit = {
      rootMargin,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }

    const observerCallback: IntersectionObserverCallback = entries => {
      // Find the section with the highest intersection ratio
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0]
        setActiveSection(mostVisible.target.id)
      } else {
        // If no sections are intersecting, determine active section by scroll position
        const scrollPosition = window.scrollY + offset

        for (const element of sectionElements) {
          const { offsetTop, offsetHeight } = element

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(element.id)
            break
          }
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section elements
    sectionElements.forEach(element => {
      observer.observe(element)
    })

    // Initial check for active section
    const initialCheck = () => {
      const scrollPosition = window.scrollY + offset

      for (const element of sectionElements) {
        const { offsetTop, offsetHeight } = element

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(element.id)
          break
        }
      }
    }

    // Use requestAnimationFrame for smooth initial check
    requestAnimationFrame(initialCheck)

    return () => {
      observer.disconnect()
    }
  }, [sectionElements, rootMargin, offset, throttledScrollHandler])

  return activeSection
}

/**
 * Hook for scroll progress within sections
 */
export const useScrollProgress = (sectionId: string): number => {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const updateProgress = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate progress based on element visibility
      const visibleTop = Math.max(0, -rect.top)
      const visibleBottom = Math.min(elementHeight, windowHeight - rect.top)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      const progressValue =
        elementHeight > 0 ? visibleHeight / elementHeight : 0
      setProgress(Math.min(1, Math.max(0, progressValue)))
    }

    const throttledUpdate = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', throttledUpdate, { passive: true })

    // Initial calculation
    updateProgress()

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      window.removeEventListener('resize', throttledUpdate)
    }
  }, [sectionId])

  return progress
}

/**
 * Hook for smooth scrolling to sections
 */
export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    const elementTop = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementTop - offset

    // Use native smooth scrolling if supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    } else {
      // Fallback smooth scroll implementation
      const startPosition = window.pageYOffset
      const distance = offsetPosition - startPosition
      const duration = Math.abs(distance) / 2 // Adjust speed as needed
      let startTime: number

      const animation = (currentTime: number) => {
        if (!startTime) startTime = currentTime

        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        window.scrollTo(0, startPosition + distance * easeOut)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }, [])

  const smoothScrollTo = useCallback(
    (sectionId: string, offset = 0) => {
      return scrollToSection(sectionId, offset)
    },
    [scrollToSection]
  )

  return { scrollToSection, smoothScrollTo }
}

// Category Navigation Types
export interface CategoryItem {
  id: string
  label: string
  icon?: string
  description?: string
  sectionId: string
}

export interface CategoryScrollState {
  activeCategory: string
  scrollPosition: number
  previousCategory?: string
}

/**
 * Enhanced scroll spy hook with category navigation support
 * Tracks active categories and maintains scroll state
 */
export const useCategoryScrollSpy = (
  categories: CategoryItem[],
  options: UseScrollSpyOptions = {}
): CategoryScrollState => {
  const sectionIds = categories.map(cat => cat.sectionId)
  const activeSection = useScrollSpy(sectionIds, options)

  const [scrollState, setScrollState] = useState<CategoryScrollState>({
    activeCategory: categories[0]?.id || '',
    scrollPosition: 0,
    previousCategory: undefined,
  })

  // Update scroll state when active section changes
  useEffect(() => {
    const activeCategory = categories.find(
      cat => cat.sectionId === activeSection
    )

    if (activeCategory && activeCategory.id !== scrollState.activeCategory) {
      setScrollState(prev => ({
        activeCategory: activeCategory.id,
        scrollPosition: window.scrollY,
        previousCategory: prev.activeCategory,
      }))
    }
  }, [activeSection, categories, scrollState.activeCategory])

  // Update scroll position on scroll
  useEffect(() => {
    let ticking = false

    const updateScrollPosition = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollState(prev => ({
            ...prev,
            scrollPosition: window.scrollY,
          }))
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', updateScrollPosition, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [])

  return scrollState
}

/**
 * Hook for category-aware smooth scrolling with context preservation
 */
export const useCategorySmoothScroll = (categories: CategoryItem[]) => {
  const { scrollToSection } = useSmoothScroll()

  const scrollToCategory = useCallback(
    (categoryId: string, offset = 80) => {
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        scrollToSection(category.sectionId, offset)
      }, 50)
    },
    [categories, scrollToSection]
  )

  const scrollToPreviousPosition = useCallback((position: number) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    })
  }, [])

  return { scrollToCategory, scrollToPreviousPosition }
}

export default useScrollSpy
