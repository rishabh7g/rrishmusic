import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import React from 'react';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Helper function to strip Framer Motion props
/* eslint-disable @typescript-eslint/no-unused-vars */
const stripMotionProps = (props: Record<string, unknown>) => {
  // Destructure Framer Motion props to exclude them from clean props
  const {
    animate,
    initial,
    exit,
    transition,
    variants,
    layoutId,
    whileHover,
    whileTap,
    whileInView,
    whileFocus,
    whileDrag,
    onViewportEnter,
    onViewportLeave,
    onAnimationStart,
    onAnimationComplete,
    onUpdate,
    onDrag,
    onDragStart,
    onDragEnd,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    ...cleanProps
  } = props;
  return cleanProps;
};
/* eslint-enable @typescript-eslint/no-unused-vars */

// Create motion component factory
const createMotionComponent = (element: string) => React.forwardRef<HTMLElement, Record<string, unknown>>(
  ({ children, ...props }, ref) => {
    const cleanProps = stripMotionProps(props);
    return React.createElement(element, { ...cleanProps, ref }, children);
  }
);

// Mock framer-motion with proper DOM prop stripping
vi.mock('framer-motion', () => ({
  motion: {
    div: createMotionComponent('div'),
    section: createMotionComponent('section'),
    h1: createMotionComponent('h1'),
    h2: createMotionComponent('h2'),
    h3: createMotionComponent('h3'),
    p: createMotionComponent('p'),
    button: createMotionComponent('button'),
    form: createMotionComponent('form'),
    input: createMotionComponent('input'),
    textarea: createMotionComponent('textarea'),
    nav: createMotionComponent('nav'),
    ul: createMotionComponent('ul'),
    li: createMotionComponent('li'),
    a: createMotionComponent('a'),
    img: createMotionComponent('img'),
    span: createMotionComponent('span'),
    label: createMotionComponent('label'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => [true, vi.fn()],
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});