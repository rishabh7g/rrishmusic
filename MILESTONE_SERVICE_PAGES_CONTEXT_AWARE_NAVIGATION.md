# Milestone: Service Pages & Context-Aware Navigation

## Overview
Create dedicated service pages for Performance, Teaching, and Collaboration with context-aware navigation system that dynamically adjusts based on current service while maintaining cross-category access.

## Objectives
- **Enhanced User Experience**: Dedicated pages for each service with tailored content
- **Context-Aware Navigation**: Dynamic header showing current service + 2 others + Instagram
- **Service-Specific Contact Forms**: Category-specific inquiry forms with appropriate routing
- **Filtered Testimonials**: Service-specific testimonials on each page
- **Pricing Strategy Alignment**: Teaching shows explicit pricing, Performance/Collaboration inquiry-based

---

## Technical Architecture

### Page Structure
```
src/components/pages/
├── Home.tsx (existing - teaching-focused homepage)
├── Performance.tsx (existing - enhance with new requirements)
├── Teaching.tsx (NEW - dedicated teaching page)
└── Collaboration.tsx (existing - enhance with new requirements)
```

### Navigation System Enhancement
```
src/components/layout/
├── Navigation.tsx (enhance with context-aware system)
└── ContextAwareHeader.tsx (NEW - dynamic header component)
```

### Data Architecture
```
src/data/
├── navigation.json (update with teaching route)
├── content/testimonials.json (existing - service filtering)
└── servicePages.json (NEW - page-specific content)
```

---

## Implementation Details

### 1. Context-Aware Navigation System

#### Current Navigation Items
```json
// src/data/navigation.json - UPDATE
{
  "navigationItems": [
    { "id": "home", "label": "Home", "href": "/" },
    { "id": "performance", "label": "Performances", "href": "/performance" },
    { "id": "teaching", "label": "Teaching", "href": "/teaching" }, // NEW
    { "id": "collaboration", "label": "Collaboration", "href": "/collaboration" },
    { "id": "about", "label": "About", "href": "#about" },
    { "id": "contact", "label": "Contact", "href": "#contact" },
    { "id": "instagram", "label": "Instagram", "href": "https://instagram.com/rrishmusic", "external": true, "icon": "instagram" }
  ]
}
```

#### Context-Aware Header Logic
```typescript
// src/hooks/useContextNavigation.ts - NEW
interface ContextNavigationConfig {
  currentService: 'home' | 'performance' | 'teaching' | 'collaboration';
  primaryServices: NavigationItem[];
  secondaryItems: NavigationItem[];
  socialLinks: NavigationItem[];
}

// Dynamic navigation based on current page:
// Home: [Performance, Teaching, Collaboration, Instagram]
// Performance: [Home, Teaching, Collaboration, Instagram]  
// Teaching: [Home, Performance, Collaboration, Instagram]
// Collaboration: [Home, Performance, Teaching, Instagram]
```

#### Enhanced Navigation Component
```typescript
// src/components/layout/Navigation.tsx - ENHANCE
interface NavigationProps {
  activeSection?: string;
  contextualMode?: boolean; // NEW - enables context-aware behavior
}

// Context-aware navigation items rendering:
const getContextualNavItems = (currentPath: string): NavigationItem[] => {
  const serviceMap = {
    '/': 'home',
    '/performance': 'performance', 
    '/teaching': 'teaching',
    '/collaboration': 'collaboration'
  };
  
  const currentService = serviceMap[currentPath] || 'home';
  
  // Always show: other 2 services + Instagram
  return NAVIGATION_ITEMS.filter(item => 
    (item.id !== currentService && ['home', 'performance', 'teaching', 'collaboration', 'instagram'].includes(item.id)) ||
    ['about', 'contact'].includes(item.id)
  );
};
```

### 2. Teaching Page Creation

#### New Teaching Page Component
```typescript
// src/components/pages/Teaching.tsx - NEW
interface TeachingPageProps {
  className?: string;
}

export const Teaching: React.FC<TeachingPageProps> = ({ className = '' }) => {
  const { getFeaturedTestimonials } = useMultiServiceTestimonials({ service: 'teaching' });
  
  return (
    <main className={`min-h-screen ${className}`} id="main-content">
      <SEOHead 
        title="Guitar Lessons & Music Teaching | Rrish Music"
        description="Professional guitar lessons and music education in Melbourne. From beginner to advanced, personalized instruction for all ages."
        path="/teaching"
      />
      
      {/* Teaching Hero Section */}
      <TeachingHero />
      
      {/* Pricing Section - Explicit Pricing */}
      <LazySection>
        <TeachingPricing showExplicitPricing={true} />
      </LazySection>
      
      {/* Teaching Approach */}
      <LazySection>
        <Approach />
      </LazySection>
      
      {/* Lessons Details */}
      <LazySection>
        <Lessons />
      </LazySection>
      
      {/* Teaching-Specific Testimonials */}
      <LazySection>
        <TestimonialsSection 
          testimonials={getFeaturedTestimonials()}
          serviceFilter="teaching"
          title="What My Students Say"
        />
      </LazySection>
      
      {/* Teaching Inquiry CTA */}
      <LazySection>
        <TeachingInquiryCTA />
      </LazySection>
    </main>
  );
};
```

#### Teaching Hero Component
```typescript
// src/components/sections/TeachingHero.tsx - NEW
export const TeachingHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary text-white py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master the Guitar with 
            <span className="text-brand-accent"> Expert Guidance</span>
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Personalized guitar lessons for all skill levels. From basic chords to advanced techniques, 
            unlock your musical potential with professional instruction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TeachingInquiryCTA variant="primary" />
            <a href="#pricing" className="btn-secondary">
              View Lesson Packages
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
```

### 3. Enhanced Service Pages

#### Performance Page Enhancements
```typescript
// src/components/pages/Performance.tsx - ENHANCE
// Add service-specific testimonials filtering:
const { getFeaturedTestimonials } = useMultiServiceTestimonials({ service: 'performance' });

// Update testimonials section:
<TestimonialsSection 
  testimonials={getFeaturedTestimonials()}
  serviceFilter="performance"
  title="Client Testimonials"
/>

// Ensure NO pricing display (inquiry-based only)
<PerformanceInquiryCTA hidePrice={true} />
```

#### Collaboration Page Enhancements  
```typescript
// src/components/pages/Collaboration.tsx - ENHANCE
// Add service-specific testimonials filtering:
const { getFeaturedTestimonials } = useMultiServiceTestimonials({ service: 'collaboration' });

// Update testimonials section:
<TestimonialsSection 
  testimonials={getFeaturedTestimonials()}
  serviceFilter="collaboration" 
  title="Collaboration Success Stories"
/>

// Ensure NO pricing display (mutual benefit focus)
<CollaborationInquiryCTA hidePricing={true} />
```

### 4. Service-Specific Testimonials System

#### Enhanced Testimonials Hook
```typescript
// src/hooks/useMultiServiceTestimonials.ts - ENHANCE
interface TestimonialFilters {
  service?: 'performance' | 'teaching' | 'collaboration';
  serviceSubType?: string;
  featured?: boolean;
  limit?: number;
}

// Add service-specific methods:
const getServiceTestimonials = useCallback((service: string, limit: number = 6) => {
  return filterTestimonials({ service, featured: true, limit });
}, [filterTestimonials]);

const getPerformanceTestimonials = useCallback((limit?: number) => 
  getServiceTestimonials('performance', limit), [getServiceTestimonials]);

const getTeachingTestimonials = useCallback((limit?: number) => 
  getServiceTestimonials('teaching', limit), [getServiceTestimonials]);

const getCollaborationTestimonials = useCallback((limit?: number) => 
  getServiceTestimonials('collaboration', limit), [getServiceTestimonials]);
```

#### Enhanced Testimonials Section
```typescript
// src/components/sections/TestimonialsSection.tsx - ENHANCE
interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  serviceFilter?: 'performance' | 'teaching' | 'collaboration';
  title?: string;
  showServiceBadges?: boolean;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials: propTestimonials,
  serviceFilter,
  title = "Client Testimonials", 
  showServiceBadges = false
}) => {
  const { 
    getPerformanceTestimonials,
    getTeachingTestimonials, 
    getCollaborationTestimonials,
    getFeaturedTestimonials
  } = useMultiServiceTestimonials();

  const testimonials = useMemo(() => {
    if (propTestimonials) return propTestimonials;
    
    switch (serviceFilter) {
      case 'performance':
        return getPerformanceTestimonials(6);
      case 'teaching':
        return getTeachingTestimonials(6);
      case 'collaboration':
        return getCollaborationTestimonials(6);
      default:
        return getFeaturedTestimonials(6);
    }
  }, [propTestimonials, serviceFilter, getPerformanceTestimonials, getTeachingTestimonials, getCollaborationTestimonials, getFeaturedTestimonials]);

  // Rest of component...
};
```

### 5. Service-Specific Contact Forms

#### Enhanced Form Routing
```typescript
// src/components/forms/TeachingInquiryForm.tsx - ENHANCE
// Pre-populate service type and show explicit pricing information

// src/components/forms/PerformanceInquiryForm.tsx - ENHANCE  
// Focus on event details, no pricing display

// src/components/forms/CollaborationInquiryForm.tsx - ENHANCE
// Focus on project details and mutual benefit
```

### 6. Pricing Strategy Implementation

#### Teaching Page - Explicit Pricing
```typescript
// src/components/sections/TeachingPricing.tsx - NEW
interface TeachingPricingProps {
  showExplicitPricing?: boolean;
}

export const TeachingPricing: React.FC<TeachingPricingProps> = ({ 
  showExplicitPricing = false 
}) => {
  const pricingPackages = [
    {
      name: "Single Session",
      price: "$45",
      duration: "45 minutes",
      description: "Perfect for trying out lessons"
    },
    {
      name: "Monthly Package", 
      price: "$160",
      duration: "4 × 45min sessions",
      description: "Most popular choice",
      popular: true
    },
    {
      name: "Intensive Package",
      price: "$360", 
      duration: "10 × 45min sessions",
      description: "Best value for dedicated learners"
    }
  ];

  if (!showExplicitPricing) {
    return <PricingSection hideExactPrices={true} />;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Lesson Packages & Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {pricingPackages.map((pkg, index) => (
            <PricingCard key={index} package={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### Performance/Collaboration Pages - Inquiry-Based
```typescript
// No explicit pricing display
// Focus on "Get Quote" and "Discuss Your Project" CTAs
// Pricing handled through inquiry forms and personal consultation
```

---

## Routing Updates

### App.tsx Route Configuration
```typescript
// src/App.tsx - UPDATE
<Routes>
  {/* Home route - Teaching-focused homepage */}
  <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
  
  {/* Service Pages */}
  <Route path="/performance" element={<ErrorBoundary><Performance /></ErrorBoundary>} />
  <Route path="/teaching" element={<ErrorBoundary><Teaching /></ErrorBoundary>} />
  <Route path="/collaboration" element={<ErrorBoundary><Collaboration /></ErrorBoundary>} />
  
  {/* Redirects */}
  <Route path="/lessons" element={<Navigate to="/teaching" replace />} />
  <Route path="/performances" element={<Navigate to="/performance" replace />} />
  
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Pages Index Update
```typescript
// src/components/pages/index.ts - UPDATE
export { Home, default as HomeDefault } from './Home';
export { Performance, default as PerformanceDefault } from './Performance';
export { Teaching, default as TeachingDefault } from './Teaching'; // NEW
export { Collaboration, default as CollaborationDefault } from './Collaboration';
```

---

## Content Strategy

### Service Page Content Structure
```json
// src/data/servicePages.json - NEW
{
  "teaching": {
    "hero": {
      "title": "Master the Guitar with Expert Guidance",
      "subtitle": "Personalized guitar lessons for all skill levels",
      "cta": "Start Your Musical Journey"
    },
    "pricing": {
      "showExplicit": true,
      "packages": [...]
    },
    "testimonials": {
      "title": "What My Students Say",
      "filter": "teaching"
    }
  },
  "performance": {
    "hero": {
      "title": "Unforgettable Live Music Experiences",
      "subtitle": "Professional performances for weddings, events, and venues"
    },
    "pricing": {
      "showExplicit": false,
      "ctaText": "Get Performance Quote"
    },
    "testimonials": {
      "title": "Client Testimonials", 
      "filter": "performance"
    }
  },
  "collaboration": {
    "hero": {
      "title": "Create Music Together",
      "subtitle": "Collaborative projects for artists and creators"
    },
    "pricing": {
      "showExplicit": false,
      "ctaText": "Discuss Your Project"
    },
    "testimonials": {
      "title": "Collaboration Success Stories",
      "filter": "collaboration" 
    }
  }
}
```

---

## User Experience Flow

### Navigation Behavior
1. **Home Page (/)**: Shows [Performance, Teaching, Collaboration, Instagram] in header
2. **Performance Page (/performance)**: Shows [Home, Teaching, Collaboration, Instagram] in header  
3. **Teaching Page (/teaching)**: Shows [Home, Performance, Collaboration, Instagram] in header
4. **Collaboration Page (/collaboration)**: Shows [Home, Performance, Teaching, Instagram] in header

### Service-Specific Features
- **Teaching Page**: Explicit pricing ($45-$360), detailed lesson info, student testimonials
- **Performance Page**: Portfolio gallery, event testimonials, inquiry-based pricing
- **Collaboration Page**: Project showcases, collaboration testimonials, project discussion focus

### Cross-Service Navigation
- Instagram icon always present for social proof
- Easy switching between services via header
- About/Contact accessible from dropdown or footer
- Consistent branding across all pages

---

## Technical Implementation Tasks

### Phase 1: Navigation System Enhancement
1. **Update Navigation Data Structure**
   - Add teaching route to navigation.json
   - Add Instagram link with external flag
   - Update navigation item priorities

2. **Implement Context-Aware Navigation**
   - Create useContextNavigation hook
   - Update Navigation component with contextual behavior
   - Add dynamic navigation item filtering logic

### Phase 2: Teaching Page Creation
3. **Create Teaching Page Components**
   - TeachingHero component with pricing focus
   - TeachingPricing component with explicit prices
   - Enhanced TeachingInquiryForm with package selection

4. **Update App Routing**
   - Add /teaching route
   - Add redirect from /lessons to /teaching
   - Update pages index exports

### Phase 3: Enhanced Service Pages  
5. **Enhance Performance Page**
   - Add service-specific testimonial filtering
   - Ensure no pricing display (inquiry-based only)
   - Update performance inquiry form

6. **Enhance Collaboration Page**
   - Add service-specific testimonial filtering  
   - Focus on project collaboration benefits
   - Update collaboration inquiry form

### Phase 4: Testimonials System Enhancement
7. **Enhance Testimonials Hook**
   - Add service-specific filtering methods
   - Implement getServiceTestimonials function
   - Add performance/teaching/collaboration shortcuts

8. **Update Testimonials Section**
   - Add serviceFilter prop
   - Implement automatic filtering based on page context
   - Add service badges (optional)

### Phase 5: Form System Enhancement  
9. **Update Service-Specific Forms**
   - TeachingInquiryForm: Add package selection, show pricing
   - PerformanceInquiryForm: Focus on event details, inquiry-based
   - CollaborationInquiryForm: Focus on project scope, mutual benefit

10. **Form Routing Enhancement**
    - Pre-populate service context in forms
    - Update form submission routing logic
    - Add service-specific form validation

---

## Success Metrics

### User Experience Metrics
- **Page Engagement**: Increased time on service-specific pages
- **Conversion Rates**: Higher inquiry form completion rates
- **Navigation Efficiency**: Reduced bounce rate on service pages

### Technical Metrics  
- **Page Load Performance**: Maintain <3s load times for all service pages
- **Mobile Responsiveness**: Perfect mobile experience across all devices
- **SEO Performance**: Improved service-specific search rankings

### Business Metrics
- **Service Clarity**: Clear differentiation between services
- **Pricing Transparency**: Teaching inquiries include pricing discussions
- **Cross-Service Discovery**: Users explore multiple services

---

## Quality Assurance

### Testing Checklist
- [ ] Context-aware navigation works on all pages
- [ ] Service-specific testimonials display correctly  
- [ ] Teaching page shows explicit pricing
- [ ] Performance/Collaboration pages hide pricing
- [ ] All forms route correctly based on service context
- [ ] Mobile navigation works with new structure
- [ ] Instagram link opens externally
- [ ] SEO meta tags correct for each service page
- [ ] Page transitions smooth between services
- [ ] Accessibility maintained across all pages

### Browser Testing
- [ ] Desktop: Chrome, Firefox, Safari, Edge
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Tablet: iPad Safari, Android tablet

### Performance Testing
- [ ] Lighthouse scores >90 for all service pages
- [ ] Core Web Vitals within acceptable ranges
- [ ] Image loading optimized with lazy loading
- [ ] JavaScript bundle sizes optimized

---

## Deployment Strategy

### Development Phase
1. Create feature branch: `feature/service-pages-context-nav`
2. Implement navigation system enhancements first
3. Create Teaching page and components
4. Enhance existing service pages
5. Update testimonials and forms systems

### Testing Phase
1. Comprehensive testing across all devices/browsers
2. User acceptance testing with stakeholders
3. Performance optimization and validation
4. SEO validation and meta tag verification

### Production Deployment
1. Merge to main branch with comprehensive PR
2. Monitor analytics for user behavior changes
3. Validate conversion rate impacts
4. Collect user feedback and iterate

---

## Future Enhancements

### Advanced Features (Future Phases)
- **Service-Specific Analytics**: Track conversion funnels per service
- **Dynamic Content Management**: CMS integration for service content
- **Advanced Testimonials**: Video testimonials, service ratings
- **Booking Integration**: Direct booking system for teaching services
- **Performance Calendar**: Available dates for performance bookings

### Technical Improvements
- **Advanced Navigation**: Breadcrumbs, service switching animations
- **Enhanced SEO**: Service-specific schema markup, advanced meta tags
- **Progressive Web App**: Enhanced mobile experience features
- **Accessibility Plus**: Advanced screen reader support, keyboard navigation

This milestone provides a comprehensive roadmap for implementing dedicated service pages with context-aware navigation, creating a more focused and professional user experience while maintaining the interconnected nature of Rrish's multi-service platform.