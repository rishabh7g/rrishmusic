# RrishMusic Content Management System

A comprehensive TypeScript content management system for the RrishMusic React website, providing type-safe content access, validation, and management.

## Overview

This content management system provides:

- **Type-safe content access** with full TypeScript support
- **Runtime validation** of content structure and data
- **React hooks** for easy content consumption in components
- **Caching and performance optimization**
- **Hot reloading support** for development
- **Search and filtering capabilities**
- **Comprehensive error handling**

## Project Structure

```
src/content/
├── types/
│   └── index.ts        # All content type definitions
├── hooks/
│   └── useContent.ts   # React hooks for content access
├── utils/
│   └── validation.ts   # Content validation utilities
├── data/              # JSON content files (to be created)
├── index.ts           # Main export file
└── README.md          # This documentation
```

## Quick Start

### Basic Usage

```tsx
import { useContent, useSectionContent } from '@/content';

function MyComponent() {
  const { content, loading, error } = useContent();
  const { data: heroData } = useSectionContent('hero');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{heroData?.title}</h1>
      <p>{heroData?.subtitle}</p>
    </div>
  );
}
```

### Lesson Packages with Filtering

```tsx
import { useLessonPackages } from '@/content';

function LessonPackages() {
  const { packages, loading } = useLessonPackages({
    popular: true,
    maxPrice: 200,
    targetAudience: ['beginner', 'intermediate']
  });
  
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>${pkg.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Testimonials

```tsx
import { useTestimonials } from '@/content';

function TestimonialsList() {
  const { testimonials, stats } = useTestimonials({
    featured: true,
    minRating: 4,
    limit: 3
  });
  
  return (
    <div>
      <h2>Featured Testimonials (Avg: {stats?.averageRating}/5)</h2>
      {testimonials.map(testimonial => (
        <blockquote key={testimonial.id}>
          <p>{testimonial.text}</p>
          <cite>— {testimonial.name}</cite>
          <div>Rating: {testimonial.rating}/5</div>
        </blockquote>
      ))}
    </div>
  );
}
```

## Available Hooks

### Core Hooks

#### `useContent()`
Main content hook with caching and validation.

```tsx
const { 
  content,     // Complete site content
  lessons,     // Lesson-specific content
  loading,     // Loading state
  error,       // Error message if any
  refresh      // Manual refresh function
} = useContent();
```

#### `useSectionContent<T>(section)`
Access specific content sections with type safety.

```tsx
const { data, loading, error, sectionErrors, isValid } = useSectionContent('hero');
```

### Specialized Hooks

#### `useLessonPackages(filters?)`
Access lesson packages with filtering and sorting.

```tsx
const { 
  packages,        // Filtered packages
  allPackages,     // All packages
  packageInfo,     // Additional info
  stats,          // Package statistics
  loading, 
  error 
} = useLessonPackages({
  popular: true,
  maxPrice: 150,
  targetAudience: ['beginner']
});
```

#### `useTestimonials(filters?)`
Access testimonials with filtering and statistics.

```tsx
const { 
  testimonials,    // Filtered testimonials
  featured,        // Featured testimonials
  stats,          // Rating statistics
  loading, 
  error 
} = useTestimonials({
  featured: true,
  minRating: 4,
  verified: true
});
```

#### `useContactMethods(filters?)`
Access contact information.

```tsx
const { 
  methods,        // All contact methods
  primaryContact, // Primary contact method
  loading, 
  error 
} = useContactMethods({ primary: true });
```

#### `useSEO(pageType?, customData?)`
SEO content management.

```tsx
const { 
  seo,              // SEO configuration
  data,             // Processed SEO data
  generatePageTitle // Utility function
} = useSEO('about', { 
  title: 'Custom Page Title' 
});
```

#### `useNavigation()`
Navigation structure access.

```tsx
const { navigation, loading, error } = useNavigation();
```

#### `useContentSearch()`
Content search functionality.

```tsx
const { search } = useContentSearch();
const results = search('guitar lessons', { section: 'lessons' });
```

## Content Types

The system includes comprehensive TypeScript interfaces for all content:

### Core Content Types
- `SiteContent` - Main site content structure
- `HeroContent` - Hero section data
- `AboutContent` - About section with skills and achievements
- `ApproachContent` - Teaching approach and methodology
- `LessonContent` - Lesson packages and scheduling
- `CommunityContent` - Community features and testimonials
- `ContactContent` - Contact information and methods
- `SEOContent` - SEO and metadata

### Supporting Types
- `LessonPackage` - Individual lesson package details
- `Testimonial` - Student testimonials with ratings
- `ContactMethod` - Contact method definitions
- `NavigationItem` - Navigation structure
- `MediaItem` - Media assets (images, videos, etc.)
- `BlogPost` - Blog content (future use)

## Validation

The system includes comprehensive runtime validation:

### Automatic Validation
All content is automatically validated when loaded:

```tsx
const { validationResult } = useContent();

if (validationResult && !validationResult.valid) {
  console.log('Validation errors:', validationResult.errors);
  console.log('Warnings:', validationResult.warnings);
}
```

### Manual Validation
You can validate content manually:

```tsx
import { validateSiteContent, validateLessonPackage } from '@/content';

const result = validateSiteContent(content);
if (!result.valid) {
  console.error('Content validation failed:', result.errors);
}
```

### Validation Utilities
```tsx
import { validationUtils } from '@/content';

// Get validation summary
const summary = validationUtils.getValidationSummary(result);

// Format errors for display
const errorMessage = validationUtils.formatValidationErrors(result.errors);

// Check minimum requirements
const isUsable = validationUtils.meetsMinimumRequirements(result);
```

## Content Utilities

### Formatting and Display

```tsx
import { contentUtils } from '@/content';

// Format prices
const price = contentUtils.formatPrice(150); // "$150"

// Calculate savings
const savings = contentUtils.calculateSavings(120, 4, 40); // 25%

// Generate slugs
const slug = contentUtils.generateSlug('Advanced Guitar Lessons'); // "advanced-guitar-lessons"

// Truncate text
const preview = contentUtils.truncateText(longText, 150);
```

### Development Helpers

```tsx
import { devHelpers } from '@/content';

// Log content structure (development only)
devHelpers.logContentStructure(content);

// Measure performance
const { result, duration } = await devHelpers.measureContentOperation(
  () => loadHeavyContent(),
  'Heavy Content Load'
);

// Validate in development
devHelpers.validateInDevelopment(content, 'hero');
```

## Error Handling

The content system provides comprehensive error handling:

### Loading States
```tsx
const { loading, error, retryCount } = useContent();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} retryCount={retryCount} />;
```

### Validation Errors
```tsx
const { sectionErrors, isValid } = useSectionContent('hero');

if (!isValid) {
  return <ValidationErrors errors={sectionErrors} />;
}
```

### Error Recovery
The system includes automatic retry with exponential backoff for transient errors.

## Performance Optimization

### Caching
- Content is automatically cached for 5 minutes
- Cache is invalidated on manual refresh
- Supports hot reloading in development

### Bundle Optimization
- JSON content is imported statically for optimal bundling
- Type-only imports prevent runtime overhead
- Tree-shaking eliminates unused validation code

### Memory Management
- Hooks clean up subscriptions and timeouts
- Validation results are memoized
- Search results are cached per query

## Integration with Existing Code

The content system is designed to integrate seamlessly with existing code:

### Path Aliases
All imports use configured path aliases:
```tsx
import { useContent } from '@/content';
import { SiteContent } from '@/types'; // Re-exported from content types
```

### Backward Compatibility
Legacy interfaces are preserved:
```tsx
// Old interface still works
import { LessonPackage } from '@/types';

// New comprehensive interface available
import { LessonPackage as NewLessonPackage } from '@/content/types';
```

### Vite Configuration
The system works with existing Vite configuration and build process.

## Best Practices

### Component Integration
```tsx
function HeroSection() {
  const { data: hero, loading, error } = useSectionContent('hero');
  
  // Always handle loading and error states
  if (loading) return <HeroSkeleton />;
  if (error) return <HeroFallback />;
  if (!hero) return null;
  
  return (
    <section>
      <h1>{hero.title}</h1>
      <p>{hero.subtitle}</p>
    </section>
  );
}
```

### Type Safety
```tsx
// Use specific section types
function AboutSection() {
  const { data } = useSectionContent('about');
  
  // TypeScript knows data is AboutContent | null
  return data ? (
    <div>
      {data.skills.map(skill => (
        <SkillBadge key={skill.name} skill={skill} />
      ))}
    </div>
  ) : null;
}
```

### Error Boundaries
Wrap content-consuming components in error boundaries for graceful degradation.

### Performance
- Use specific hooks rather than `useContent()` when you only need part of the content
- Implement proper loading states
- Consider using `React.memo()` for components that render large content lists

## Future Enhancements

The content system is designed to support future features:

- **API Integration**: Easy migration from JSON to API-based content
- **Real-time Updates**: WebSocket support for live content updates
- **Content Versioning**: Track and rollback content changes
- **Multi-language Support**: Internationalization ready
- **Content Analytics**: Usage tracking and performance metrics
- **Admin Interface**: Content management UI

## Contributing

When adding new content types or functionality:

1. Add TypeScript interfaces in `types/index.ts`
2. Create validation functions in `utils/validation.ts`
3. Add specialized hooks in `hooks/useContent.ts`
4. Update this documentation
5. Add tests for new functionality

## Support

For questions or issues with the content management system, refer to:

1. TypeScript compiler errors for type issues
2. Console warnings for validation problems  
3. React DevTools for hook state inspection
4. This documentation for usage examples