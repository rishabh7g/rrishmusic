// Re-export legacy content types for compatibility
export * from './content';

// Re-export comprehensive content management types
export * from '../content/types';

// Component Props
export interface SectionProps {
  id: string;
  className?: string;
}

// Legacy NavigationItem interface (keeping for backward compatibility)
export interface NavigationItemLegacy {
  id: string;
  label: string;
  href: string;
}

// Business Logic Types (keeping existing for compatibility)
export interface LessonPackageLegacy {
  id: string;
  name: string;
  sessions: number;
  price: number;
  discount?: number;
  features: string[];
  popular?: boolean;
  description?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  lessonType: "individual" | "consultation";
}

export interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// UI Component Props
export interface ButtonProps {
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

// Animation Types (for Framer Motion)
export interface AnimationProps {
  initial?: object;
  animate?: object;
  transition?: object;
  delay?: number;
}

// Legacy Content Management Types (keeping for compatibility)
export interface ContentError {
  section?: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ContentValidationResultLegacy {
  valid: boolean;
  errors: ContentError[];
  warnings: ContentError[];
}

// Utility type exports for common patterns
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// React component type helpers
export type ComponentPropsWithRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>;
export type ComponentPropsWithoutRef<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;

// Export type guards for runtime type checking
export const isContentError = (obj: unknown): obj is ContentError => {
  return typeof obj === 'object' && obj !== null && 'message' in obj && 'severity' in obj;
};

export const isValidationResult = (obj: unknown): obj is ContentValidationResultLegacy => {
  return typeof obj === 'object' && 
         obj !== null && 
         'valid' in obj && 
         'errors' in obj && 
         'warnings' in obj;
};

// Common type utilities
export type NonEmptyArray<T> = [T, ...T[]];
export type ValueOf<T> = T[keyof T];
export type Entries<T> = Array<[keyof T, ValueOf<T>]>;

// API response wrapper types
export type ApiResponse<T> = 
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: string };

export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch?: () => void;
};