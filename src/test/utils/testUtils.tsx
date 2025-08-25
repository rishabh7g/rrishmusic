/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock data for testing
export const mockServiceData = {
  teaching: {
    title: 'Music Teaching',
    description: 'Personalized music instruction',
    pricing: {
      individual: 80,
      group: 60,
    },
  },
  performance: {
    title: 'Live Performances',
    description: 'Professional musical performances',
    pricing: 'inquiry',
  },
  collaboration: {
    title: 'Musical Collaboration',
    description: 'Creative musical partnerships',
    pricing: 'inquiry',
  },
};

export const mockPortfolioItem = {
  id: '1',
  title: 'Test Performance',
  category: 'performance',
  description: 'Test description',
  imageUrl: '/test-image.jpg',
  date: '2024-01-01',
  location: 'Test Location',
  tags: ['test', 'performance'],
};

export const mockTestimonial = {
  id: '1',
  name: 'Test Student',
  service: 'teaching',
  rating: 5,
  text: 'Great teacher!',
  date: '2024-01-01',
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test utilities
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...overrides,
});

export const createMockFormData = (data: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 100));

// Mock router functions
export const mockNavigate = vi.fn();
export const mockUseNavigate = () => mockNavigate;
export const mockUseLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
});

// Mock intersection observer entry
export const createMockIntersectionEntry = (isIntersecting = true) => ({
  isIntersecting,
  intersectionRatio: isIntersecting ? 1 : 0,
  target: document.createElement('div'),
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: {} as DOMRectReadOnly,
  time: Date.now(),
});

// Helper to test responsive behavior
export const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
};