import { NavigationItem, LessonPackage } from "../types";

// Navigation Configuration
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "approach", label: "Approach", href: "#approach" },
  { id: "lessons", label: "Lessons", href: "#lessons" },
  { id: "community", label: "Community", href: "#community" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// Business Configuration
export const LESSON_PACKAGES: LessonPackage[] = [
  {
    id: "single",
    name: "Single Lesson",
    sessions: 1,
    price: 50,
    features: [
      "1-hour individual lesson",
      "Personalized feedback",
      "Practice materials",
      "Recording of session",
    ],
  },
  {
    id: "package-4",
    name: "4-Lesson Package",
    sessions: 4,
    price: 190,
    discount: 5,
    features: [
      "4 individual lessons",
      "Progress tracking",
      "Custom practice plan",
      "Email support",
      "5% savings",
    ],
  },
  {
    id: "package-8",
    name: "8-Lesson Package",
    sessions: 8,
    price: 360,
    discount: 10,
    features: [
      "8 individual lessons",
      "Structured curriculum",
      "Performance goals",
      "Priority booking",
      "Community access",
      "10% savings",
    ],
  },
];

// Contact Configuration
export const CONTACT_INFO = {
  email: "hello@rrishmusic.com",
  instagram: "https://instagram.com/rrishmusic",
  location: "Melbourne, Victoria, Australia",
};

// Animation Configuration
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
