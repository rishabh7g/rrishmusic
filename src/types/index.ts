// Core data types
export interface Person {
  name: string
  role: string
  image: string
  bio: string
  credentials: string[]
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  price?: string
  duration?: string
  popular?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image?: string
  service?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  color?: string
}

export interface ContactInfo {
  email: string
  phone?: string
  location?: string
  availability?: string
}

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
}

export interface PageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    cta: {
      primary: string
      secondary?: string
    }
    image?: string
    video?: string
  }
  sections: {
    [key: string]: any
  }
  seo: SEOData
}

// Theme system types
export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryActive: string
  secondary: string
  secondaryHover: string
  secondaryActive: string
  accent: string
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  surface: string
  text: string
  textSecondary: string
  textMuted: string
  border: string
  borderHover: string
  success: string
  warning: string
  error: string
  info: string
}

export type ThemeMode = 'light' | 'dark' | 'system'
export type ActiveTheme = 'light' | 'dark'

export interface ThemeConfig {
  colors: ThemeColors
  mode: ThemeMode
  name: string
}

// Theme constants
export const THEME_STORAGE_KEY = 'theme-mode'
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'
export const DEFAULT_THEME_MODE: ThemeMode = 'dark'

// Basic theme colors for light and dark modes
export const lightThemeColors: ThemeColors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryActive: '#1d4ed8',
  secondary: '#6b7280',
  secondaryHover: '#4b5563',
  secondaryActive: '#374151',
  accent: '#10b981',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#e2e8f0',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderHover: '#d1d5db',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

export const darkThemeColors: ThemeColors = {
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  primaryActive: '#2563eb',
  secondary: '#9ca3af',
  secondaryHover: '#d1d5db',
  secondaryActive: '#e5e7eb',
  accent: '#34d399',
  background: '#111827',
  backgroundSecondary: '#1f2937',
  backgroundTertiary: '#374151',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  border: '#374151',
  borderHover: '#4b5563',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
}

export const themes: Record<ActiveTheme, ThemeConfig> = {
  light: {
    colors: lightThemeColors,
    mode: 'light',
    name: 'Light',
  },
  dark: {
    colors: darkThemeColors,
    mode: 'dark',
    name: 'Dark',
  },
}

// Animation system types
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  staggerDelay?: number
}

export interface TransitionConfig {
  property: string
  duration: string
  easing: string
  delay?: string
}

// Theme transitions for smooth color changes
export const themeTransitions: Record<string, TransitionConfig> = {
  colors: {
    property:
      'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  transform: {
    property: 'transform',
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  layout: {
    property: 'width, height, margin, padding',
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Enhanced easing curves
export const easingCurves = {
  // Standard easing
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // Emphasized easing for important transitions
  emphasized: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Decelerated easing for entering elements
  decelerated: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Accelerated easing for exiting elements
  accelerated: 'cubic-bezier(0.4, 0, 1, 1)',
}

// Animation durations
export const animationDurations = {
  fast: 150,
  medium: 300,
  slow: 500,
  extra: 1000,
}

// Easing curves for different interaction states
export const interactionEasing = {
  hover: 'cubic-bezier(0.4, 0, 0.2, 1)',
  active: 'cubic-bezier(0.4, 0, 1, 1)',
  focus: 'cubic-bezier(0.0, 0, 0.2, 1)',
  disabled: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

// Advanced animation configurations
export const animations = {
  fadeIn: {
    duration: 300,
    easing: easingCurves.decelerated,
  },
  slideIn: {
    duration: 400,
    easing: easingCurves.emphasized,
  },
  scaleIn: {
    duration: 200,
    easing: easingCurves.standard,
    staggerDelay: 50,
  },
  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  smooth: {
    duration: 250,
    easing: easingCurves.decelerated,
  },
}

// CSS custom properties helper
export const createCSSCustomProperties = (
  colors: ThemeColors
): Record<string, string> => {
  return {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-active': colors.primaryActive,
    '--color-secondary': colors.secondary,
    '--color-secondary-hover': colors.secondaryHover,
    '--color-secondary-active': colors.secondaryActive,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-background-secondary': colors.backgroundSecondary,
    '--color-background-tertiary': colors.backgroundTertiary,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-border': colors.border,
    '--color-border-hover': colors.borderHover,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-info': colors.info,
  }
}

export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const breakpoints: Breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Responsive design utilities
export interface MediaQueries {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export const mediaQueries: MediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
}

// Layout system types
export interface GridConfig {
  columns: number
  gap: string
  breakpoints: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export interface SpacingScale {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
}

export const spacing: SpacingScale = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
  '3xl': '6rem',
  '4xl': '8rem',
}

// Typography system
export interface FontWeights {
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
}

export const fontWeights: FontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export interface FontSizes {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export const fontSizes: FontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
}

// Component state types
export type ComponentSize = 'sm' | 'md' | 'lg'
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'outline'
export type ComponentState =
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'
  | 'loading'

// Form system types
export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required?: boolean
  validation?: {
    pattern?: string
    message?: string
    minLength?: number
    maxLength?: number
  }
  options?: { value: string; label: string }[]
}

export interface FormConfig {
  fields: FormField[]
  submitLabel: string
  submitEndpoint?: string
  successMessage?: string
  errorMessage?: string
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  href: string
  external?: boolean
  children?: NavItem[]
}

export interface NavigationConfig {
  primary: NavItem[]
  secondary?: NavItem[]
  social?: SocialLink[]
}

// Content management types
export interface ContentSection {
  id: string
  type:
    | 'hero'
    | 'about'
    | 'services'
    | 'testimonials'
    | 'contact'
    | 'gallery'
    | 'faq'
  title?: string
  content: any
  settings?: {
    background?: string
    spacing?: string
    alignment?: 'left' | 'center' | 'right'
    columns?: number
  }
}

// API types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
  service?: string
  phone?: string
  preferredTime?: string
}

// Event types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'performance' | 'lesson' | 'workshop' | 'collaboration'
  ticketUrl?: string
  featured?: boolean
}

// Portfolio types
export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  media: {
    type: 'image' | 'video' | 'audio'
    url: string
    thumbnail?: string
  }
  tags?: string[]
  date?: string
  featured?: boolean
}

// Error handling types
export interface ErrorInfo {
  message: string
  code?: string
  details?: any
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: ErrorInfo
}

// Performance monitoring types
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage?: number
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

// Accessibility types
export interface A11yConfig {
  reducedMotion?: boolean
  highContrast?: boolean
  screenReader?: boolean
  keyboardNavigation?: boolean
}

// Internationalization types
export interface LocaleConfig {
  code: string
  name: string
  direction: 'ltr' | 'rtl'
  currency?: string
  dateFormat?: string
}

// Search types
export interface SearchResult {
  id: string
  type: string
  title: string
  description: string
  url: string
  relevance: number
}

// Cache types
export interface CacheConfig {
  ttl: number
  maxSize: number
  strategy: 'lru' | 'fifo' | 'lifo'
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent) => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
}
