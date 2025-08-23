/**
 * Main Types Export File
 * Centralized exports for all TypeScript interfaces and types
 */

// Export all content-related types
export * from './content';

// Re-export common React types for convenience
export type { FC, ReactNode, ComponentProps, ErrorInfo } from 'react';

// Utility types for better TypeScript experience
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type StringKeys<T> = Extract<keyof T, string>;
export type NumberKeys<T> = Extract<keyof T, number>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp?: string;
}

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError?: () => void;
}

export type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'score' | 'count';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface WebVitals {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
}

export interface ComponentPerformance {
  componentName: string;
  renderTime: number;
  mountTime?: number;
  updateTime?: number;
  memoryUsage?: number;
}

// Form handling types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
  validated?: boolean;
  dirty?: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

export type FormValidator<T = unknown> = (value: T) => string | undefined;

// Animation and UI types
export interface AnimationProps {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  variants?: Record<string, object>;
}

export interface MotionConfig {
  duration?: number;
  ease?: string | number[];
  delay?: number;
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  stiffness?: number;
  damping?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
}

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  tabIndex?: number;
}

export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: React.ComponentType;
  skeleton?: boolean;
}

// SEO and Meta types
export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  meta?: MetaTag[];
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
  locale?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image: string;
  creator?: string;
  site?: string;
}

// Navigation and routing types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  private?: boolean;
  title?: string;
  description?: string;
  keywords?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  description?: string;
  children?: NavigationItem[];
  order?: number;
  active?: boolean;
}

// Event handling types
export type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;
export type KeyboardHandler<T = HTMLElement> = (event: React.KeyboardEvent<T>) => void;
export type MouseHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;
export type FocusHandler<T = HTMLElement> = (event: React.FocusEvent<T>) => void;

// Scroll and intersection observer types
export interface ScrollSpyOptions {
  offset?: number;
  throttle?: number;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

// Lazy loading types
export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ImageLoadState {
  loaded: boolean;
  error: boolean;
  loading: boolean;
}

// Cache types
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  staleWhileRevalidate?: boolean;
}

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
  keys: string[];
}

// Testing types
export interface TestContext {
  user: {
    type: (element: Element, text: string) => Promise<void>;
    click: (element: Element) => Promise<void>;
    hover: (element: Element) => Promise<void>;
    keyboard: (keys: string) => Promise<void>;
  };
  screen: {
    getByRole: (role: string, options?: object) => Element;
    getByText: (text: string) => Element;
    getByLabelText: (label: string) => Element;
    queryByRole: (role: string, options?: object) => Element | null;
    findByRole: (role: string, options?: object) => Promise<Element>;
  };
  render: (component: React.ReactElement) => void;
}

export interface MockFunction<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  mockReturnValue: (value: ReturnType<T>) => MockFunction<T>;
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockFunction<T>;
  mockRejectedValue: (error: any) => MockFunction<T>;
  mockImplementation: (fn: T) => MockFunction<T>;
  mockClear: () => void;
  mockReset: () => void;
  mockRestore: () => void;
  mock: {
    calls: Parameters<T>[];
    results: Array<{ type: 'return' | 'throw'; value: any }>;
    instances: any[];
  };
}

// Development and debugging types
export interface DevToolsConfig {
  enabled: boolean;
  showPerformanceMetrics: boolean;
  showErrorBoundaryInfo: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface DebugInfo {
  componentName: string;
  props: Record<string, unknown>;
  state?: Record<string, unknown>;
  renderCount: number;
  lastRenderTime: number;
}

// Export commonly used generic types
export type ValueOf<T> = T[keyof T];
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;