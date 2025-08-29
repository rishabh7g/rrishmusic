# Content Management Guide

This guide explains how to manage content in the RrishMusic project, including updating text, images, services, and SEO content across the multi-service platform.

## Content Architecture

RrishMusic uses a modular content system organized by service type and content category:

```
Content Sources:
├── Component Content (Embedded)    # Direct in component files
├── Hook-Based Content (Dynamic)    # Via useContent hook
├── SEO Content (Structured)        # Via usePageSEO hook
└── Static Assets                   # Images, media files
```

## Service-Based Content Organization

### Service Types
- **Performance**: Live music, events, venues
- **Teaching**: Music lessons, educational content
- **Collaboration**: Artist partnerships, session work

### Content Categories Per Service
- Hero sections and taglines
- Service descriptions and features
- Portfolio/gallery content
- Testimonials and social proof
- Contact forms and CTAs
- SEO metadata

## Dynamic Content with Hooks

### Using the useContent Hook

The project uses a centralized content system via the `useContent` hook:

```typescript
// Example usage in components
import { useContent } from '@/hooks/useContent';

export const ServiceSection: React.FC<{ service: ServiceType }> = ({ service }) => {
  const content = useContent(service);
  
  return (
    <div>
      <h2>{content.hero.title}</h2>
      <p>{content.hero.subtitle}</p>
      <div>
        {content.services.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
};
```

### Content Structure Pattern

Content follows this typical structure:

```typescript
// Content type definition
interface ServiceContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage: string;
  };
  services: Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    image?: string;
  }>;
  contact: {
    title: string;
    description: string;
    formFields: FormField[];
  };
}
```

## SEO Content Management

### Using the usePageSEO Hook

SEO content is managed through the `usePageSEO` hook:

```typescript
import { usePageSEO } from '@/hooks/usePageSEO';
import { SEOHead } from '@/components/common/SEOHead';

export const ServicePage: React.FC = () => {
  const seoData = usePageSEO('performance');
  
  return (
    <>
      <SEOHead {...seoData} />
      <main>
        {/* Page content */}
      </main>
    </>
  );
};
```

### SEO Content Structure

```typescript
interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  structuredData: Record<string, any>;
}
```

## Updating Content

### 1. Service Hero Sections

To update hero content for any service:

**Location**: Look for hero-related components in `/src/components/sections/`

```typescript
// Example: PerformanceHero.tsx
export const PerformanceHero: React.FC = () => {
  const heroContent = {
    title: "Professional Music Performances",  // ← Update this
    subtitle: "Elevating your events with exceptional live music",  // ← Update this
    ctaText: "Book Performance",  // ← Update this
    ctaHref: "/contact?service=performance"
  };
  
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Hero implementation */}
    </section>
  );
};
```

### 2. Service Descriptions and Features

**Location**: Service-specific components in `/src/components/sections/`

```typescript
// Example: PerformanceServices.tsx
const performanceServices = [
  {
    id: 'wedding',
    title: 'Wedding Performances',  // ← Update title
    description: 'Create magical moments...',  // ← Update description
    features: [  // ← Update features list
      'Ceremony music',
      'Cocktail hour entertainment',
      'Reception performances'
    ],
    icon: 'Wedding'
  },
  // Add more services here
];
```

### 3. Portfolio and Gallery Content

**Location**: Gallery and portfolio components

```typescript
// Example: Adding new portfolio items
const portfolioItems = [
  {
    id: 'venue-1',
    title: 'Grand Ballroom Performance',  // ← Update title
    description: 'Elegant evening performance...',  // ← Update description
    image: '/images/performance/venue-1.jpg',  // ← Update image path
    category: 'venue',
    date: '2024-01-15'
  },
  // Add new items here
];
```

### 4. Testimonials and Social Proof

**Location**: Testimonial sections and social proof components

```typescript
// Example: MultiServiceTestimonialsSection.tsx
const testimonials = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',  // ← Update name
    role: 'Wedding Coordinator',  // ← Update role  
    service: 'performance',  // ← Update service type
    content: 'Rrish provided beautiful music...',  // ← Update testimonial
    rating: 5,
    image: '/images/testimonials/sarah.jpg'  // ← Update image
  },
  // Add new testimonials here
];
```

### 5. Contact Forms and CTAs

**Location**: Form configuration files `/src/components/forms/formConfigurations.ts`

```typescript
export const performanceFormConfig: FormConfig = {
  title: 'Book a Performance',  // ← Update form title
  description: 'Let\'s discuss your event needs',  // ← Update description
  fields: [
    {
      name: 'eventType',
      label: 'Event Type',  // ← Update field labels
      type: 'select',
      options: [  // ← Update options
        'Wedding',
        'Corporate Event',
        'Private Party',
        'Other'
      ],
      required: true
    }
    // Add or modify fields
  ],
  submitText: 'Request Quote',  // ← Update button text
  successMessage: 'Thank you! We\'ll be in touch soon.'  // ← Update success message
};
```

## Image and Media Management

### Image Organization

```
public/images/
├── performance/       # Performance-related images
├── teaching/         # Teaching-related images  
├── collaboration/    # Collaboration images
├── testimonials/     # Client/testimonial photos
├── gallery/          # Portfolio gallery images
└── social/          # Social media content
```

### Adding New Images

1. **Optimize images** before adding (recommended: WebP format, appropriate sizes)
2. **Use descriptive filenames**: `performance-wedding-venue-2024.jpg`
3. **Add to appropriate directory** based on service/category
4. **Update component references**:

```typescript
// Example: Adding new gallery image
const newGalleryItem = {
  id: 'new-performance',
  src: '/images/performance/new-venue-performance.jpg',  // ← New image path
  alt: 'Rrish performing at elegant venue with piano',   // ← Descriptive alt text
  title: 'Elegant Venue Performance',
  category: 'performance'
};
```

### Image Optimization Guidelines

```typescript
// Use LazyImage component for performance
import { LazyImage } from '@/components/ui/LazyImage';

<LazyImage
  src="/images/performance/venue.jpg"
  alt="Professional performance at wedding venue"  // ← Always include descriptive alt
  className="w-full h-64 object-cover rounded-lg"
  priority={false}  // Set true only for above-fold images
/>
```

## Multi-Service Content Strategy

### Content Hierarchy (60/25/15 Rule)

- **60%**: Performance content (primary service)
- **25%**: Teaching content (secondary service) 
- **15%**: Collaboration content (tertiary service)

### Cross-Service Content Integration

```typescript
// Example: Cross-service suggestions
export const CrossServiceSuggestions: React.FC<{ currentService: ServiceType }> = ({ 
  currentService 
}) => {
  const suggestions = getCrossServiceSuggestions(currentService);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">You might also be interested in:</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {suggestions.map(service => (
            <ServiceCard
              key={service.type}
              title={service.title}           // ← Update cross-service titles
              description={service.description}  // ← Update descriptions
              href={service.href}
              ctaText={service.ctaText}      // ← Update CTA text
            />
          ))}
        </div>
      </div>
    </section>
  );
};
```

## SEO Content Updates

### Page Titles and Meta Descriptions

**Location**: SEO hook implementation or component-level SEO data

```typescript
// Example: Performance page SEO
const performanceSEO = {
  title: 'Professional Music Performances | Rrish Music',  // ← Update page title
  description: 'Hire professional musician Rrish for weddings, corporate events, and private performances. Exceptional live music for your special occasion.',  // ← Update description
  keywords: [  // ← Update keywords
    'professional musician',
    'live music performance', 
    'wedding music',
    'corporate entertainment',
    'private events'
  ]
};
```

### Structured Data

```typescript
// Example: Performance structured data
const performanceStructuredData = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "Rrish Music",  // ← Update name
  "description": "Professional music performance services",  // ← Update description
  "url": "https://www.rrishmusic.com/performance",
  "sameAs": [  // ← Update social media links
    "https://instagram.com/rrishmusic",
    "https://facebook.com/rrishmusic"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Your City",  // ← Update location
    "addressRegion": "Your State",   // ← Update region
    "addressCountry": "US"
  }
};
```

## Content Update Workflow

### 1. Identify Content Location
- Hero sections: `/src/components/sections/[Service]Hero.tsx`
- Services: `/src/components/sections/[Service]Services.tsx`  
- Testimonials: `/src/components/sections/TestimonialsSection.tsx`
- Forms: `/src/components/forms/formConfigurations.ts`

### 2. Make Content Changes
- Update text content directly in components
- Add new images to `/public/images/[category]/`
- Update image references in components

### 3. Test Changes Locally
```bash
npm run dev
# Test all affected pages
# Verify mobile responsiveness
# Check accessibility
```

### 4. Quality Checks
```bash
# TypeScript compilation
npm run type-check

# Code formatting
npm run format

# Build verification
npm run build
```

### 5. Deploy Changes
Follow the standard development workflow (see development-workflow.md) to deploy content updates.

## Best Practices

### Content Guidelines
- **Consistency**: Maintain consistent tone and messaging across services
- **Clarity**: Use clear, benefit-focused language
- **Mobile-First**: Ensure content works on mobile devices
- **Accessibility**: Include alt text, proper headings, descriptive links

### SEO Best Practices
- **Unique Titles**: Each page should have a unique, descriptive title
- **Meta Descriptions**: 150-160 characters, compelling and informative
- **Header Hierarchy**: Proper H1, H2, H3 structure
- **Image Alt Text**: Descriptive alternative text for all images

### Performance Considerations
- **Image Optimization**: Use appropriate file sizes and formats
- **Lazy Loading**: Implement lazy loading for below-fold content
- **Content Length**: Balance comprehensive content with loading speed

This guide ensures content updates maintain consistency, quality, and performance across the RrishMusic multi-service platform.