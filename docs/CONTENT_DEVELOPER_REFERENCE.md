# Content Management System - Developer Reference

## Architecture Overview

The RrishMusic content management system is built on a **TypeScript + JSON** foundation with the following key components:

```
Content Management System Architecture
├── Content Storage (JSON files in src/content/)
├── Type Definitions (TypeScript interfaces)
├── Content Hooks (React hooks for data access)
├── Validation Layer (Runtime validation utilities)
└── Developer Tools (Utilities and helpers)
```

### Core Philosophy

1. **Type Safety First**: All content is strongly typed with TypeScript
2. **Hot Reloading**: Immediate feedback during development
3. **Version Control**: All content changes tracked in Git
4. **Validation**: Automatic content validation prevents runtime errors
5. **Developer Experience**: Full IDE support with autocomplete and error detection

---

## TypeScript Interfaces Reference

### Core Content Types

Located in `src/types/content.ts`:

#### SiteContent Interface
```typescript
export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  approach: ApproachContent;
  community: CommunityContent;
  contact: ContactContent;
  seo: SEOContent;
}
```

#### Detailed Interface Definitions

**HeroContent**
```typescript
export interface HeroContent {
  title: string;           // Main heading text
  subtitle: string;        // Subheading/description  
  ctaText: string;        // Call-to-action text
  instagramHandle: string; // Handle with @ symbol
  instagramUrl: string;   // Full Instagram URL
}
```

**ContactMethod**
```typescript
export interface ContactMethod {
  type: 'email' | 'instagram' | 'phone'; // Restricted to these types
  label: string;           // Display label
  value: string;          // Display value
  href: string;           // Clickable URL/tel/mailto
  primary: boolean;       // Is this the primary contact method
}
```

**LessonPackage**
```typescript
export interface LessonPackage {
  id: string;             // Unique identifier
  name: string;           // Package display name
  sessions: number;       // Number of sessions (0 = unlimited)
  price: number;          // Price in AUD
  discount?: number;      // Optional discount percentage
  features: string[];     // Array of feature descriptions
  popular?: boolean;      // Optional - marks as popular choice
  description?: string;   // Optional package description
}
```

**Testimonial**
```typescript
export interface Testimonial {
  id: string;                                    // Unique identifier
  name: string;                                  // Student name
  text: string;                                  // Testimonial content
  rating: number;                                // 1-5 star rating
  image?: string;                                // Optional profile image
  instrument?: string;                           // Instrument studied
  level?: 'beginner' | 'intermediate' | 'advanced'; // Skill level
  featured?: boolean;                            // Show on homepage
}
```

---

## Content Hooks API

Located in `src/hooks/useContent.ts`:

### Primary Hooks

#### useContent()
```typescript
function useContent(): {
  content: SiteContent;    // Main site content
  lessons: LessonContent;  // Lesson packages and info
  loading: boolean;        // Loading state
  error: string | null;    // Error state
}
```

**Usage Example:**
```typescript
import { useContent } from '@/hooks/useContent';

function MyComponent() {
  const { content, lessons, loading, error } = useContent();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{content.hero.title}</h1>
      <p>{content.hero.subtitle}</p>
    </div>
  );
}
```

#### useSectionContent()
```typescript
function useSectionContent<T extends keyof SiteContent>(section: T): {
  data: SiteContent[T];    // Specific section data
  loading: boolean;        // Loading state
  error: string | null;    // Error state
}
```

**Usage Example:**
```typescript
import { useSectionContent } from '@/hooks/useContent';

function HeroSection() {
  const { data: hero, loading, error } = useSectionContent('hero');
  
  return (
    <section>
      <h1>{hero.title}</h1>
      <p>{hero.subtitle}</p>
    </section>
  );
}
```

#### useLessonPackages()
```typescript
function useLessonPackages(filters?: {
  popular?: boolean;       // Filter for popular packages
  maxPrice?: number;       // Maximum price filter
  minSessions?: number;    // Minimum session count
}): {
  packages: LessonPackage[];     // Filtered packages
  allPackages: LessonPackage[];  // All packages
  packageInfo: object;           // Additional lesson info
  loading: boolean;
  error: string | null;
}
```

**Usage Example:**
```typescript
import { useLessonPackages } from '@/hooks/useContent';

function PricingSection() {
  const { packages, loading } = useLessonPackages({ popular: true });
  
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

#### useSEO()
```typescript
function useSEO(): {
  seo: SEOContent;         // SEO configuration
  getSEOData: (title?: string, description?: string) => SEOData;
}
```

**Usage Example:**
```typescript
import { useSEO } from '@/hooks/useContent';

function PageHead() {
  const { getSEOData } = useSEO();
  const seoData = getSEOData('Custom Page Title', 'Custom description');
  
  return (
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
    </Helmet>
  );
}
```

### Utility Functions

#### getContentByPath()
```typescript
function getContentByPath(path: string): any
```

**Usage Example:**
```typescript
import { getContentByPath } from '@/hooks/useContent';

// Get nested content value
const heroTitle = getContentByPath('hero.title');
const firstSkill = getContentByPath('about.skills.0');
```

#### getContent()
```typescript
function getContent<T>(
  getter: (content: SiteContent) => T,
  fallback: T
): T
```

**Usage Example:**
```typescript
import { getContent } from '@/hooks/useContent';

// Safe content access with fallback
const heroTitle = getContent(
  content => content.hero.title,
  'Default Title'
);
```

---

## Content Validation System

Located in `src/utils/contentManager.ts`:

### Validation Functions

#### validateContent Object
```typescript
export const validateContent = {
  siteContent: (content: any): content is SiteContent => boolean;
  lessonContent: (content: any): content is LessonContent => boolean;
  testimonial: (testimonial: any): testimonial is Testimonial => boolean;
}
```

**Usage Example:**
```typescript
import { validateContent } from '@/utils/contentManager';

const jsonData = JSON.parse(jsonString);

if (validateContent.siteContent(jsonData)) {
  // TypeScript now knows jsonData is SiteContent
  console.log(jsonData.hero.title);
} else {
  console.error('Invalid content structure');
}
```

#### Content Structure Validation
```typescript
export const contentStructure = {
  getSections: (content: SiteContent) => string[];
  validateStructure: (content: any) => { valid: boolean; errors: string[] };
}
```

**Usage Example:**
```typescript
import { contentStructure } from '@/utils/contentManager';

const validation = contentStructure.validateStructure(contentData);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### Content Utilities

#### contentUtils Object
```typescript
export const contentUtils = {
  formatPrice: (price: number, currency?: string) => string;
  calculateSavings: (packagePrice: number, sessions: number, singlePrice: number) => number;
  generateSlug: (text: string) => string;
  truncateText: (text: string, maxLength: number) => string;
  filterTestimonials: (testimonials: Testimonial[], filters: object) => Testimonial[];
}
```

**Usage Examples:**
```typescript
import { contentUtils } from '@/utils/contentManager';

// Format currency
const formattedPrice = contentUtils.formatPrice(190); // "$190"

// Calculate savings percentage
const savings = contentUtils.calculateSavings(190, 4, 50); // 5%

// Generate URL-friendly slug
const slug = contentUtils.generateSlug("My Blog Post Title"); // "my-blog-post-title"

// Truncate long text
const excerpt = contentUtils.truncateText("Long text here...", 100);

// Filter testimonials
const featuredTestimonials = contentUtils.filterTestimonials(
  testimonials,
  { featured: true, minRating: 4 }
);
```

### Development Helpers

#### devHelpers Object
```typescript
export const devHelpers = {
  logContentStructure: (content: any, depth?: number) => void;
  generateTemplate: (sectionType: keyof SiteContent) => any;
}
```

**Usage Examples:**
```typescript
import { devHelpers } from '@/utils/contentManager';

// Debug content structure
devHelpers.logContentStructure(contentData, 3);

// Generate template for new section
const heroTemplate = devHelpers.generateTemplate('hero');
console.log(JSON.stringify(heroTemplate, null, 2));
```

---

## Build and Import System

### JSON Import Configuration

The system uses Vite's built-in JSON import support:

```typescript
// Direct JSON imports (compile-time)
import siteContentData from '@/content/site-content.json';
import lessonsData from '@/content/lessons.json';

// Type assertions for safety
const siteContent = siteContentData as SiteContent;
const lessonContent = lessonsData as LessonContent;
```

### Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
// Available path aliases
'@/content/*'     // Points to src/content/*
'@/types/*'       // Points to src/types/*  
'@/hooks/*'       // Points to src/hooks/*
'@/utils/*'       // Points to src/utils/*
'@/components/*'  // Points to src/components/*
```

### Build Process

1. **Development**: JSON files imported directly with hot reloading
2. **Build**: JSON content bundled into JavaScript modules
3. **Type Checking**: All content validated against TypeScript interfaces
4. **Tree Shaking**: Unused content sections eliminated in production

---

## Performance Considerations

### Content Loading Strategy

**Current Implementation:**
- All content loaded synchronously at app startup
- Content cached in memory for the session
- Hot reloading enabled in development only

**Performance Characteristics:**
- Initial load: ~1-3ms for JSON parsing
- Memory usage: ~10-50KB for typical content
- Subsequent access: Immediate (cached)

### Optimization Guidelines

**Content Size Limits:**
- Individual JSON files: Keep under 50KB
- Total content size: Keep under 200KB
- Testimonials: Limit to 20-30 active testimonials
- Images: Reference external files, don't embed base64

**Content Structure:**
- Avoid deeply nested objects (max 3-4 levels)
- Use arrays for collections (testimonials, packages)
- Keep string content under 500 characters per field
- Use consistent data types throughout

### Caching Strategy

**Development:**
```typescript
// No caching - hot reload on file changes
import.meta.hot?.accept(['./content/site-content.json'], (newModule) => {
  // Content automatically reloads
});
```

**Production:**
```typescript
// Content bundled at build time
// Browser caching via HTTP headers
// CDN caching for JSON imports
```

---

## Testing Integration

### Content Validation Testing

```typescript
// Example test for content validation
import { validateContent } from '@/utils/contentManager';
import siteContent from '@/content/site-content.json';

describe('Content Validation', () => {
  test('site content structure is valid', () => {
    expect(validateContent.siteContent(siteContent)).toBe(true);
  });

  test('all testimonials have required fields', () => {
    testimonials.forEach(testimonial => {
      expect(validateContent.testimonial(testimonial)).toBe(true);
    });
  });
});
```

### Hook Testing

```typescript
// Example test for content hooks
import { renderHook } from '@testing-library/react';
import { useContent } from '@/hooks/useContent';

describe('useContent Hook', () => {
  test('returns content without errors', () => {
    const { result } = renderHook(() => useContent());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.content).toBeDefined();
  });
});
```

### JSON Schema Validation

```json
// content-schema.json (for automated validation)
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "hero": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" }
      },
      "required": ["title", "subtitle"]
    }
  },
  "required": ["hero", "about", "contact"]
}
```

---

## Extending the System

### Adding New Content Types

1. **Define TypeScript Interface**
   ```typescript
   // In src/types/content.ts
   export interface NewContentType {
     id: string;
     data: string[];
   }

   // Add to main interface
   export interface SiteContent {
     // ... existing types
     newContent: NewContentType;
   }
   ```

2. **Add JSON Data**
   ```json
   // In src/content/site-content.json
   {
     "newContent": {
       "id": "unique-id",
       "data": ["item1", "item2"]
     }
   }
   ```

3. **Update Validation**
   ```typescript
   // In src/utils/contentManager.ts
   const requiredSections = [
     'hero', 'about', 'approach', 'community', 'contact', 'seo', 'newContent'
   ];
   ```

4. **Create Hook (Optional)**
   ```typescript
   // In src/hooks/useContent.ts
   export function useNewContent() {
     const { content } = useContent();
     return {
       data: content.newContent,
       // ... additional processing
     };
   }
   ```

### Creating Custom Validation Rules

```typescript
// Example custom validator
export const customValidators = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validatePhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  validateURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};
```

### Adding Content Transformations

```typescript
// Example content transformer
export const contentTransformers = {
  processTestimonials: (testimonials: Testimonial[]) => {
    return testimonials
      .filter(t => t.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  },
  
  formatPricing: (packages: LessonPackage[]) => {
    return packages.map(pkg => ({
      ...pkg,
      formattedPrice: contentUtils.formatPrice(pkg.price),
      savings: pkg.discount ? `${pkg.discount}% off` : null
    }));
  }
};
```

---

## Migration and Versioning

### Content Schema Versioning

```typescript
// Version tracking in content files
{
  "version": "1.0.0",
  "lastUpdated": "2025-08-23",
  "content": {
    // ... actual content
  }
}
```

### Migration Scripts

```typescript
// Example migration from v1 to v2
export const migrations = {
  'v1-to-v2': (oldContent: any) => {
    return {
      ...oldContent,
      newField: 'default value',
      renamedField: oldContent.oldField
    };
  }
};
```

### Backward Compatibility

```typescript
// Handle legacy content formats
export const legacySupport = {
  normalizeContent: (content: any) => {
    // Handle old format
    if (content.legacyField) {
      content.newField = content.legacyField;
      delete content.legacyField;
    }
    return content;
  }
};
```

---

## Security Considerations

### Content Sanitization

```typescript
// XSS prevention for user-generated content
import DOMPurify from 'dompurify';

export const sanitizeContent = {
  testimonialText: (text: string): string => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  },
  
  richText: (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
      ALLOWED_ATTR: []
    });
  }
};
```

### Input Validation

```typescript
// Validate content before saving
export const securityValidators = {
  validateContentLength: (content: string, maxLength: number): boolean => {
    return content.length <= maxLength;
  },
  
  validateNoScripts: (content: string): boolean => {
    return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content);
  },
  
  validateRating: (rating: number): boolean => {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
  }
};
```

---

## Deployment Configuration

### Environment-Specific Content

```typescript
// Environment-based content loading
const isDevelopment = import.meta.env.DEV;
const contentSource = isDevelopment 
  ? '@/content/site-content.json'
  : '@/content/site-content.prod.json';
```

### Build Optimization

```typescript
// Vite configuration for content optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'content': ['src/content/site-content.json', 'src/content/lessons.json']
        }
      }
    }
  }
});
```

### CDN Integration

```typescript
// Content delivery via CDN
const contentCDN = 'https://cdn.rrishmusic.com/content';

export const cdnContent = {
  loadFromCDN: async (filename: string) => {
    const response = await fetch(`${contentCDN}/${filename}`);
    return response.json();
  }
};
```

---

*Last Updated: August 2025*  
*This developer reference covers the technical implementation details of the RrishMusic content management system.*