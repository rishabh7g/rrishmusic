import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws during render
const RenderError = () => {
  throw new Error('Render error');
};

describe('ErrorBoundary Component - Business Logic Testing', () => {
  describe('Core Error Handling', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child component</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child component')).toBeInTheDocument();
    });

    it('should catch and display render errors', () => {
      render(
        <ErrorBoundary>
          <RenderError />
        </ErrorBoundary>
      );

      // Should show error UI instead of crashing
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText('Effect component')).not.toBeInTheDocument();
    });

    it('should show fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again|reload/i })).toBeInTheDocument();
    });

    it('should not catch errors when shouldThrow is false', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  describe('Custom Fallback UI', () => {
    const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
      <div>
        <h2>Custom Error: {error.message}</h2>
        <button onClick={resetError}>Reset</button>
      </div>
    );

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    it('should pass error and resetError to custom fallback', () => {
      const mockFallback = vi.fn(({ error, resetError }) => (
        <div>
          <span>Error: {error.message}</span>
          <button onClick={resetError}>Reset</button>
        </div>
      ));

      render(
        <ErrorBoundary fallback={mockFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockFallback).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          resetError: expect.any(Function)
        }),
        {}
      );
    });
  });

  describe('Error Recovery', () => {
    it('should allow recovery from errors using try again button', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: /try again|reload/i });
      tryAgainButton.click();

      // Re-render with no error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('should reset error state when children change', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Render different children
      rerender(
        <ErrorBoundary>
          <div>New child component</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('New child component')).toBeInTheDocument();
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Logging and Reporting', () => {
    it('should log errors to console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('ErrorBoundary caught an error'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should call custom onError callback when provided', () => {
      const mockOnError = vi.fn();

      render(
        <ErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockOnError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });

    it('should include component stack in error info', () => {
      const mockOnError = vi.fn();

      render(
        <ErrorBoundary onError={mockOnError}>
          <div>
            <div>
              <ThrowError shouldThrow={true} />
            </div>
          </div>
        </ErrorBoundary>
      );

      const errorInfo = mockOnError.mock.calls[0][1];
      expect(errorInfo.componentStack).toBeDefined();
      expect(errorInfo.componentStack).toContain('ThrowError');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have proper heading structure in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/something went wrong/i);
    });

    it('should have accessible try again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /try again|reload/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName();
    });
  });

  describe('Production vs Development Behavior', () => {
    it('should show detailed error in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error details in development
      expect(screen.getByText(/test error/i)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should show generic error message in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show generic message in production
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText('Test error')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      expect(() =>
        render(<ErrorBoundary>{null}</ErrorBoundary>)
      ).not.toThrow();
    });

    it('should handle undefined children gracefully', () => {
      expect(() =>
        render(<ErrorBoundary>{undefined}</ErrorBoundary>)
      ).not.toThrow();
    });

    it('should handle multiple children when some throw errors', () => {
      render(
        <ErrorBoundary>
          <div>Good child 1</div>
          <ThrowError shouldThrow={true} />
          <div>Good child 2</div>
        </ErrorBoundary>
      );

      // Should show error UI for the whole boundary
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText('Good child 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Good child 2')).not.toBeInTheDocument();
    });

    it('should handle errors in nested error boundaries', () => {
      render(
        <ErrorBoundary>
          <div>Outer boundary</div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <div>Should still show</div>
        </ErrorBoundary>
      );

      // Inner boundary should catch error, outer should still show its children
      expect(screen.getByText('Outer boundary')).toBeInTheDocument();
      expect(screen.getByText('Should still show')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('should not impact performance when no errors occur', () => {
      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <div>Normal component</div>
          <div>Another component</div>
        </ErrorBoundary>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly when no errors
      expect(renderTime).toBeLessThan(10);
    });

    it('should handle multiple error boundaries efficiently', () => {
      const startTime = performance.now();

      render(
        <div>
          <ErrorBoundary><div>Boundary 1</div></ErrorBoundary>
          <ErrorBoundary><div>Boundary 2</div></ErrorBoundary>
          <ErrorBoundary><div>Boundary 3</div></ErrorBoundary>
          <ErrorBoundary><div>Boundary 4</div></ErrorBoundary>
          <ErrorBoundary><div>Boundary 5</div></ErrorBoundary>
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(50);
    });
  });

  describe('Real-World Integration', () => {
    it('should work with async components', async () => {
      const AsyncError = () => {
        const [shouldThrow, setShouldThrow] = React.useState(false);

        React.useEffect(() => {
          setTimeout(() => setShouldThrow(true), 10);
        }, []);

        if (shouldThrow) {
          throw new Error('Async error');
        }

        return <div>Async component</div>;
      };

      render(
        <ErrorBoundary>
          <AsyncError />
        </ErrorBoundary>
      );

      // Initially should show component
      expect(screen.getByText('Async component')).toBeInTheDocument();

      // After timeout, should show error (though this is a limitation of error boundaries)
      // Error boundaries don't catch errors in event handlers, async code, etc.
      // This test documents the limitation
    });

    it('should integrate with service pages correctly', () => {
      const ServicePageContent = () => (
        <div>
          <h1>Service Page</h1>
          <ThrowError shouldThrow={true} />
        </div>
      );

      render(
        <ErrorBoundary>
          <ServicePageContent />
        </ErrorBoundary>
      );

      // Should show error instead of crashing the page
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText('Service Page')).not.toBeInTheDocument();
    });

    it('should provide user-friendly experience during errors', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should provide clear messaging and recovery option
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      
      // Should have contact information or helpful context
      expect(screen.getByText(/contact support|refresh/i)).toBeInTheDocument();
    });
  });
});