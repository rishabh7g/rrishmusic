import { Variants } from 'framer-motion'
import { ANIMATION_DURATION } from './constants'

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: 'easeOut',
    },
  },
}

// Fade in from top
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: 'easeOut',
    },
  },
}

// Stagger container for multiple elements
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Scale in animation
export const scaleIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: 'easeOut',
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: 'easeOut',
    },
  },
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: 'easeOut',
    },
  },
}

// Button hover animation
export const buttonHover = {
  scale: 1.05,
  transition: { duration: ANIMATION_DURATION.fast },
}

// Card hover animation
export const cardHover = {
  y: -8,
  transition: { duration: ANIMATION_DURATION.fast },
}

// Fade in animation (simple)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
    },
  },
}

// Rotate in animation
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: 'easeOut',
    },
  },
}
