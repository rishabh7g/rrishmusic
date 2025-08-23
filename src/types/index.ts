// Component Props
export interface SectionProps {
  id: string;
  className?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

// Business Logic Types
export interface LessonPackage {
  id: string;
  name: string;
  sessions: number;
  price: number;
  discount?: number;
  features: string[];
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
