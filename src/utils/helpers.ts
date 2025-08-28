// Smooth scroll utility
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 80 // Account for fixed navigation
    const elementPosition = element.offsetTop - offset

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate discount price
export const calculateDiscountPrice = (
  price: number,
  discount: number
): number => {
  return Math.round(price * (1 - discount / 100))
}

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

// Debounce function (for performance)
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): ((...args: T) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Check if element is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
