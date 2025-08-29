# Component Development Guide

This guide explains how to create and maintain components in the RrishMusic project following established patterns and TypeScript best practices.

## Architecture Overview

RrishMusic uses a modular component architecture organized by functionality:

```
src/components/
├── common/          # Reusable utility components
├── forms/           # Form components and validation
├── layout/          # Layout and navigation components
├── pages/           # Full page components
├── sections/        # Page sections and content blocks
├── social/          # Social media integrations
├── ui/              # UI elements and interactive components
└── optimization/    # Performance and user experience components
```

## TypeScript Patterns

### Component Props Interface

Always define props interfaces with clear naming:

```typescript
interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaHref: string;
  priority?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imageUrl,
  ctaText,
  ctaHref,
  priority = 'secondary',
  className = ''
}) => {
  // Component implementation
};
```

### Extending HTML Elements

When extending native HTML elements:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
```

### Service Context Types

For multi-service components, use the service context pattern:

```typescript
import { ServiceType } from '@/types/serviceContext';

interface ServiceContextProps {
  service: ServiceType;
  variant?: 'hero' | 'section' | 'card';
}

export const ContextAwareComponent: React.FC<ServiceContextProps> = ({
  service,
  variant = 'section'
}) => {
  const content = useContent(service);
  const seoData = usePageSEO(service);
  
  return (
    <div className={getServiceStyles(service, variant)}>
      {/* Component implementation */}
    </div>
  );
};
```

## Responsive Design with Tailwind

### Mobile-First Approach

Always start with mobile styles and enhance for larger screens:

```typescript
export const ResponsiveComponent: React.FC = () => {
  return (
    <div className="
      flex flex-col          // Mobile: stack vertically
      gap-4                  // Mobile: small gap
      p-4                    // Mobile: padding
      sm:flex-row            // Small screens: horizontal layout
      sm:gap-6               // Small screens: larger gap
      md:p-8                 // Medium screens: more padding
      lg:gap-8               // Large screens: largest gap
      xl:max-w-7xl           // XL screens: max width
      xl:mx-auto             // XL screens: center content
    ">
      {/* Content */}
    </div>
  );
};
```

### Breakpoint Usage
- No prefix: Mobile (default)
- `sm:`: Small screens (640px+)
- `md:`: Medium screens (768px+)
- `lg:`: Large screens (1024px+)
- `xl:`: Extra large screens (1280px+)

### Responsive Typography

```typescript
const headingClasses = "
  text-2xl               // Mobile: 24px
  leading-tight          // Mobile: tight line height
  sm:text-3xl           // Small: 30px
  md:text-4xl           // Medium: 36px
  lg:text-5xl           // Large: 48px
  xl:text-6xl           // XL: 60px
  font-bold             // All sizes: bold weight
";
```

## Component Patterns

### Page Components

Page components should follow this structure:

```typescript
import { usePageSEO } from '@/hooks/usePageSEO';
import { SEOHead } from '@/components/common/SEOHead';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const ServicePage: React.FC = () => {
  const seoData = usePageSEO('performance');
  
  return (
    <ErrorBoundary fallback={<ServicePageError />}>
      <SEOHead {...seoData} />
      <main className="min-h-screen overflow-x-hidden">
        {/* Page sections */}
      </main>
    </ErrorBoundary>
  );
};
```

### Section Components

Section components use consistent spacing and layout:

```typescript
interface SectionProps {
  className?: string;
  children: React.ReactNode;
  background?: 'white' | 'gray' | 'dark';
}

export const Section: React.FC<SectionProps> = ({
  className = '',
  children,
  background = 'white'
}) => {
  return (
    <section className={cn(
      'py-16 md:py-24',           // Vertical padding
      'px-4 sm:px-6 lg:px-8',    // Horizontal padding
      'max-w-7xl mx-auto',       // Max width and centering
      getSectionBackground(background),
      className
    )}>
      {children}
    </section>
  );
};
```

### Form Components

Form components use the unified form system:

```typescript
import { BaseInquiryForm } from '@/components/forms/BaseInquiryForm';
import { performanceFormConfig } from '@/components/forms/formConfigurations';

export const PerformanceInquiryForm: React.FC = () => {
  return (
    <BaseInquiryForm
      config={performanceFormConfig}
      serviceType="performance"
      className="max-w-2xl mx-auto"
    />
  );
};
```

## Styling Guidelines

### CSS Classes Organization

Organize Tailwind classes by category:

```typescript
const cardClasses = cn(
  // Layout
  'relative flex flex-col',
  'w-full max-w-sm',
  
  // Spacing
  'p-6 m-4',
  
  // Appearance
  'bg-white rounded-lg shadow-lg',
  'border border-gray-200',
  
  // Interactive states
  'hover:shadow-xl hover:scale-105',
  'focus:outline-none focus:ring-2 focus:ring-blue-500',
  
  // Transitions
  'transition-all duration-300',
  
  // Responsive
  'sm:p-8 md:max-w-md lg:max-w-lg'
);
```

### Component Variants

Use consistent variant patterns:

```typescript
const buttonVariants = {
  variant: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
};
```

## Performance Optimization

### Lazy Loading

Use lazy loading for components below the fold:

```typescript
import { LazySection } from '@/components/common/LazySection';

export const PageWithLazyContent: React.FC = () => {
  return (
    <div>
      {/* Above fold content loads immediately */}
      <HeroSection />
      
      {/* Below fold content loads when needed */}
      <LazySection>
        <TestimonialsSection />
      </LazySection>
      
      <LazySection>
        <PortfolioSection />
      </LazySection>
    </div>
  );
};
```

### Image Optimization

Always use the LazyImage component:

```typescript
import { LazyImage } from '@/components/ui/LazyImage';

export const ImageComponent: React.FC = () => {
  return (
    <LazyImage
      src="/images/performance/venue.jpg"
      alt="Performance at elegant venue"
      className="w-full h-64 object-cover rounded-lg"
      priority={false}  // Set true for above-fold images
    />
  );
};
```

## Accessibility Guidelines

### Semantic HTML

Always use appropriate semantic elements:

```typescript
export const AccessibleComponent: React.FC = () => {
  return (
    <article>
      <header>
        <h1>Article Title</h1>
        <time dateTime="2024-01-15">January 15, 2024</time>
      </header>
      
      <main>
        <p>Article content...</p>
      </main>
      
      <footer>
        <nav aria-label="Article navigation">
          {/* Navigation links */}
        </nav>
      </footer>
    </article>
  );
};
```

### ARIA Attributes

Include proper ARIA labels and roles:

```typescript
export const InteractiveComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        aria-label="Toggle dropdown menu"
      >
        Menu
      </button>
      
      <div
        id="dropdown-menu"
        role="menu"
        className={isOpen ? 'block' : 'hidden'}
        aria-hidden={!isOpen}
      >
        {/* Menu items */}
      </div>
    </div>
  );
};
```

### Keyboard Navigation

Ensure components work with keyboard navigation:

```typescript
export const KeyboardAccessibleComponent: React.FC = () => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Handle activation
    }
  };
  
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Component content */}
    </div>
  );
};
```

## Hooks Integration

### Using Project Hooks

Integrate with existing custom hooks:

```typescript
import { useContent } from '@/hooks/useContent';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export const SmartComponent: React.FC = () => {
  const content = useContent('performance');
  const { isMobile } = useDeviceDetection();
  const { activeSection } = useScrollSpy(['hero', 'about', 'contact']);
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout content={content} />
      ) : (
        <DesktopLayout content={content} />
      )}
    </div>
  );
};
```

## Error Handling

### Error Boundaries

Wrap components in error boundaries:

```typescript
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const ReliableComponent: React.FC = () => {
  return (
    <ErrorBoundary fallback={<ComponentError />}>
      <PotentiallyFailingComponent />
    </ErrorBoundary>
  );
};
```

### Error States

Handle loading and error states:

```typescript
export const DataComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  
  if (!data) {
    return <EmptyState />;
  }
  
  return <DataDisplay data={data} />;
};
```

## Testing Considerations

### Component Testing

Structure components for easy testing:

```typescript
// Separate logic from presentation
const useComponentLogic = (props) => {
  // Component logic here
  return { state, handlers };
};

export const TestableComponent: React.FC<Props> = (props) => {
  const { state, handlers } = useComponentLogic(props);
  
  return (
    <div data-testid="component-root">
      {/* Presentation layer */}
    </div>
  );
};
```

### Test-Friendly Props

Include test identifiers when needed:

```typescript
interface ComponentProps {
  // Other props
  testId?: string;
}

export const Component: React.FC<ComponentProps> = ({
  testId = 'default-component',
  // other props
}) => {
  return (
    <div data-testid={testId}>
      {/* Component content */}
    </div>
  );
};
```

This guide ensures components follow established patterns while maintaining type safety, accessibility, and performance standards across the RrishMusic platform.