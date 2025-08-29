// Core React types
export * from './content'

// Re-export commonly used React types
export type { FC, ReactNode, ComponentProps, ErrorInfo } from 'react'

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type StringKeys<T> = Extract<keyof T, string>
export type NumberKeys<T> = Extract<keyof T, number>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type NonNullable<T> = T extends null | undefined ? never : T
export type Awaited<T> = T extends Promise<infer U> ? U : T

// API types
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    page?: number
    totalPages?: number
    totalCount?: number
  }
}

export interface ApiError {
  message: string
  code?: string | number
  details?: Record<string, unknown>
  timestamp?: string
  path?: string
}

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void

// Performance types
export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'score'
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface WebVitals {
  CLS: number // Cumulative Layout Shift
  FID: number // First Input Delay
  FCP: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  TTFB: number // Time to First Byte
}

export interface ComponentPerformance {
  componentName: string
  renderTime: number
  mountTime?: number
  updateCount: number
  averageRenderTime: number
  memoryUsage?: number
}

// Form types
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  dirty: boolean
  valid: boolean
}

export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export type FormValidator<T = unknown> = (value: T) => string | undefined

// Animation types
export interface AnimationProps {
  duration?: number
  delay?: number
  easing?: string
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface MotionConfig {
  initial?: object
  animate?: object
  exit?: object
  transition?: object
  whileHover?: object
  whileTap?: object
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  surface: string
  text: string
  textSecondary: string
  textMuted: string
  border: string
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
export const DEFAULT_THEME_MODE: ThemeMode = 'system'

// Basic theme colors for light and dark modes
export const lightThemeColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#10b981',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#e2e8f0',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

export const darkThemeColors: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#9ca3af',
  accent: '#34d399',
  background: '#111827',
  backgroundSecondary: '#1f2937',
  backgroundTertiary: '#374151',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  border: '#374151',
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

// Transition configurations
export const themeTransitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.0, 0, 0.2, 1)',
    decelerated: 'cubic-bezier(0.0, 0, 0.2, 1)',
  },
}

// CSS custom properties helper
export const createCSSCustomProperties = (
  colors: ThemeColors
): Record<string, string> => {
  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-background-secondary': colors.backgroundSecondary,
    '--color-background-tertiary': colors.backgroundTertiary,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-border': colors.border,
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

// Component base types
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  id?: string
  'data-testid'?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
}

export interface InteractiveProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  tabIndex?: number
  'aria-disabled'?: boolean
}

export interface LoadingProps {
  loading?: boolean
  loadingText?: string
  spinnerSize?: 'sm' | 'md' | 'lg'
  overlay?: boolean
}

// SEO and Meta types
export interface MetaTag {
  name?: string
  property?: string
  content: string
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  canonical?: string
  robots?: string
  viewport?: string
  themeColor?: string
  manifest?: string
  appleTouchIcon?: string
  favicon?: string
  metaTags?: MetaTag[]
  openGraph?: OpenGraphData
  twitterCard?: TwitterCardData
}

export interface OpenGraphData {
  title?: string
  description?: string
  type?: string
  url?: string
  image?: string
  imageAlt?: string
  siteName?: string
  locale?: string
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title?: string
  description?: string
  image?: string
  imageAlt?: string
}

// Navigation types
export interface RouteConfig {
  path: string
  component: React.ComponentType
  exact?: boolean
  private?: boolean
  roles?: string[]
  meta?: {
    title?: string
    description?: string
  }
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavigationItem[]
  external?: boolean
  disabled?: boolean
  roles?: string[]
}

// Event handler types
export type EventHandler<T = HTMLElement> = (
  event: React.SyntheticEvent<T>
) => void
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>
) => void
export type SubmitHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void
export type KeyboardHandler<T = HTMLElement> = (
  event: React.KeyboardEvent<T>
) => void
export type MouseHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void
export type FocusHandler<T = HTMLElement> = (event: React.FocusEvent<T>) => void

// Scroll and intersection observer types
export interface ScrollSpyOptions {
  offset?: number
  smooth?: boolean
  duration?: number
  container?: string | HTMLElement
}

export interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface ScrollPosition {
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right' | null
}

// Lazy loading types
export interface LazyLoadOptions {
  threshold?: number
  rootMargin?: string
  placeholder?: string
  errorImage?: string
}

export interface ImageLoadState {
  loaded: boolean
  error: boolean
  src?: string
}

// Cache types
export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

export interface CacheOptions {
  ttl?: number
  maxEntries?: number
  strategy?: 'lru' | 'fifo' | 'ttl'
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  hitRate: number
}

// Testing types
export interface TestContext {
  container: HTMLElement
  debug: () => void
  rerender: (ui: React.ReactElement) => void
  unmount: () => void
  asFragment: () => DocumentFragment
  baseElement: HTMLElement
  getByText: (text: string | RegExp) => HTMLElement
  queryByText: (text: string | RegExp) => HTMLElement | null
  findByText: (text: string | RegExp) => Promise<HTMLElement>
  getByRole: (role: string, options?: object) => HTMLElement
  queryByRole: (role: string, options?: object) => Element | null
  findByRole: (role: string, options?: object) => Promise<Element>
  render: (component: React.ReactElement) => void
}

export interface MockFunction<
  T extends (...args: unknown[]) => unknown = (...args: unknown[]) => unknown,
> {
  (...args: Parameters<T>): ReturnType<T>
  mockReturnValue: (value: ReturnType<T>) => MockFunction<T>
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockFunction<T>
  mockRejectedValue: (error: Error | string | unknown) => MockFunction<T>
  mockImplementation: (fn: T) => MockFunction<T>
  mockClear: () => void
  mockReset: () => void
  mockRestore: () => void
  mock: {
    calls: Parameters<T>[]
    results: Array<{ type: 'return' | 'throw'; value: ReturnType<T> | Error }>
    instances: Array<ReturnType<T> extends object ? ReturnType<T> : unknown>
  }
}

// Development and debugging types
export interface DevToolsConfig {
  enabled: boolean
  showPerformanceMetrics: boolean
  showRenderCount: boolean
  showPropsChanges: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}

export interface DebugInfo {
  componentName: string
  props: Record<string, unknown>
  state: Record<string, unknown>
  renderCount: number
  lastRenderTime: number
  totalRenderTime: number
}

// Advanced utility types
export type ValueOf<T> = T[keyof T]
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
