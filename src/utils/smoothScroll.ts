/**
 * Smooth Scroll Utilities
 *
 * Provides utilities for smooth scrolling and navigation transitions
 * between services in the multi-column layout
 */

export interface ScrollOptions {
  duration?: number
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  offset?: number
  behavior?: ScrollBehavior
}

/**
 * Default scroll options
 */
const defaultScrollOptions: Required<ScrollOptions> = {
  duration: 800,
  easing: 'ease-in-out',
  offset: 0,
  behavior: 'smooth',
}

/**
 * Easing functions for smooth scrolling
 */
const easingFunctions = {
  ease: (t: number) => t * t * (3 - 2 * t),
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => t * (2 - t),
  'ease-in-out': (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  linear: (t: number) => t,
}

/**
 * Smooth scroll to element
 */
export const smoothScrollToElement = (
  element: HTMLElement | null,
  options: ScrollOptions = {}
): Promise<void> => {
  return new Promise(resolve => {
    if (!element) {
      resolve()
      return
    }

    const config = { ...defaultScrollOptions, ...options }
    const startPosition = window.pageYOffset
    const elementPosition = element.offsetTop
    const targetPosition = elementPosition - config.offset
    const distance = targetPosition - startPosition

    if (Math.abs(distance) < 1) {
      resolve()
      return
    }

    let startTime: number | null = null
    const easingFunction = easingFunctions[config.easing]

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / config.duration, 1)
      const easedProgress = easingFunction(progress)

      const currentPosition = startPosition + distance * easedProgress
      window.scrollTo(0, currentPosition)

      if (progress < 1) {
        requestAnimationFrame(animation)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animation)
  })
}

/**
 * Smooth scroll to service column
 */
export const scrollToService = async (
  serviceId: string,
  options: ScrollOptions = {}
): Promise<void> => {
  const element = document.getElementById(`service-${serviceId}`)
  if (!element) {
    console.warn(`Service element not found: service-${serviceId}`)
    return
  }

  await smoothScrollToElement(element, {
    offset: 80, // Account for header
    ...options,
  })
}

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  )
}

/**
 * Get scroll position percentage
 */
export const getScrollPercentage = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight

  if (documentHeight <= 0) return 0

  return Math.min(Math.max((scrollTop / documentHeight) * 100, 0), 100)
}

/**
 * Smooth horizontal scroll for service navigation
 */
export const smoothScrollHorizontal = (
  container: HTMLElement,
  targetPosition: number,
  duration: number = 500
): Promise<void> => {
  return new Promise(resolve => {
    const startPosition = container.scrollLeft
    const distance = targetPosition - startPosition

    if (Math.abs(distance) < 1) {
      resolve()
      return
    }

    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easingFunctions['ease-in-out'](progress)

      const currentPosition = startPosition + distance * easedProgress
      container.scrollLeft = currentPosition

      if (progress < 1) {
        requestAnimationFrame(animation)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animation)
  })
}

/**
 * Calculate scroll velocity for momentum scrolling
 */
export const calculateScrollVelocity = (
  positions: { position: number; timestamp: number }[]
): number => {
  if (positions.length < 2) return 0

  const recent = positions.slice(-3)
  let totalVelocity = 0
  let count = 0

  for (let i = 1; i < recent.length; i++) {
    const timeDiff = recent[i].timestamp - recent[i - 1].timestamp
    if (timeDiff > 0) {
      const velocity = (recent[i].position - recent[i - 1].position) / timeDiff
      totalVelocity += velocity
      count++
    }
  }

  return count > 0 ? totalVelocity / count : 0
}

/**
 * Debounce scroll events
 */
export const debounceScroll = (
  callback: () => void,
  delay: number = 100
): (() => void) => {
  let timeoutId: NodeJS.Timeout

  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(callback, delay)
  }
}
