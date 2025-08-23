/**
 * App Component Smoke Tests
 * 
 * Critical path functionality only - fastest possible execution
 * Tests core rendering and essential functionality
 */
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { renderFast } from '@/test/setup-ci';

// Minimal test wrapper for speed
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('App Smoke Tests', () => {
  it('renders without crashing', () => {
    render(<App />, { wrapper: TestWrapper });
  });

  it('displays main navigation', () => {
    render(<App />, { wrapper: TestWrapper });
    
    // Test critical navigation elements exist
    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    render(<App />, { wrapper: TestWrapper });
    
    // Test main content container exists
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('loads without JavaScript errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />, { wrapper: TestWrapper });
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});