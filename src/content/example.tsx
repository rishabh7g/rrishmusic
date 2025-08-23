/**
 * Example Usage of RrishMusic Content Management System
 * 
 * This file demonstrates how to use the content management system
 * in React components with proper TypeScript integration.
 */

import React from 'react';
import { 
  useContent, 
  useSectionContent, 
  useLessonPackages, 
  useTestimonials, 
  useContactMethods,
  useSEO,
  useNavigation,
  contentUtils,
  type HeroContent,
  type LessonPackage 
} from '@/content';

/**
 * Example 1: Basic Content Usage
 */
export function HeroSectionExample() {
  const { data: hero, loading, error, isValid } = useSectionContent('hero');
  
  if (loading) return <div className="animate-pulse">Loading hero content...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!hero || !isValid) return <div>Hero content unavailable</div>;
  
  return (
    <section className="hero-section">
      <h1 className="text-4xl font-bold">{hero.title}</h1>
      <p className="text-xl text-gray-600">{hero.subtitle}</p>
      {hero.description && (
        <p className="mt-4">{hero.description}</p>
      )}
      <a 
        href={hero.instagramUrl}
        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded"
      >
        {hero.ctaText}
      </a>
      
      {hero.socialProof && (
        <div className="mt-8 flex gap-6">
          {hero.socialProof.studentsCount && (
            <div className="text-center">
              <div className="text-2xl font-bold">{hero.socialProof.studentsCount}+</div>
              <div className="text-sm text-gray-500">Students</div>
            </div>
          )}
          {hero.socialProof.yearsExperience && (
            <div className="text-center">
              <div className="text-2xl font-bold">{hero.socialProof.yearsExperience}</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Example 2: Lesson Packages with Filtering
 */
export function LessonPackagesExample() {
  const { 
    packages, 
    stats, 
    loading, 
    error 
  } = useLessonPackages({
    popular: true,
    maxPrice: 200,
    targetAudience: ['beginner', 'intermediate']
  });
  
  if (loading) return <div>Loading lesson packages...</div>;
  if (error) return <div>Error loading packages: {error}</div>;
  
  return (
    <section className="lesson-packages">
      <h2 className="text-3xl font-bold mb-8">Popular Lesson Packages</h2>
      
      {stats && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <p>Showing {packages.length} of {stats.total} packages</p>
          <p>Average price: {contentUtils.formatPrice(stats.averagePrice)}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg: LessonPackage) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </section>
  );
}

/**
 * Package Card Component
 */
function PackageCard({ package: pkg }: { package: LessonPackage }) {
  const savings = pkg.originalPrice 
    ? contentUtils.calculateSavings(pkg.price, pkg.sessions, pkg.originalPrice / pkg.sessions)
    : 0;
    
  return (
    <div className={`border rounded-lg p-6 ${pkg.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      {pkg.popular && (
        <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-3 inline-block">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
      <p className="text-gray-600 mb-4">{pkg.description}</p>
      
      <div className="mb-4">
        <span className="text-2xl font-bold">{contentUtils.formatPrice(pkg.price)}</span>
        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
          <span className="ml-2 text-gray-500 line-through">
            {contentUtils.formatPrice(pkg.originalPrice)}
          </span>
        )}
        {savings > 0 && (
          <span className="ml-2 text-green-600 text-sm">
            Save {savings}%
          </span>
        )}
      </div>
      
      <ul className="mb-6 space-y-1">
        {pkg.features.slice(0, 3).map((feature, index) => (
          <li key={index} className="text-sm flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
        {pkg.features.length > 3 && (
          <li className="text-sm text-gray-500">
            +{pkg.features.length - 3} more features
          </li>
        )}
      </ul>
      
      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
        Choose Package
      </button>
    </div>
  );
}

/**
 * Example 3: Testimonials with Filtering
 */
export function TestimonialsExample() {
  const { 
    testimonials, 
    featured, 
    stats, 
    loading, 
    error 
  } = useTestimonials({
    featured: true,
    minRating: 4,
    verified: true,
    limit: 6
  });
  
  if (loading) return <div>Loading testimonials...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <section className="testimonials">
      <h2 className="text-3xl font-bold mb-8">What Students Say</h2>
      
      {stats && (
        <div className="mb-8 text-center">
          <div className="text-4xl font-bold text-yellow-500 mb-2">
            ⭐ {stats.averageRating}/5
          </div>
          <p className="text-gray-600">
            Based on {stats.total} verified reviews
          </p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
      
      {featured.length > testimonials.length && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50">
            View All Testimonials
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * Testimonial Card Component
 */
function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>
              ⭐
            </span>
          ))}
        </div>
        {testimonial.verified && (
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Verified
          </span>
        )}
      </div>
      
      <blockquote className="text-gray-700 mb-4">
        "{contentUtils.truncateText(testimonial.text, 150)}"
      </blockquote>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{testimonial.name}</div>
          {testimonial.instrument && (
            <div className="text-sm text-gray-500">
              {testimonial.instrument} Student
            </div>
          )}
        </div>
        
        {testimonial.level && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {testimonial.level}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Example 4: Contact Methods
 */
export function ContactExample() {
  const { methods, primaryContact, loading, error } = useContactMethods();
  
  if (loading) return <div>Loading contact info...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <section className="contact-info">
      <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
      
      {primaryContact && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Preferred Contact</h3>
          <a 
            href={primaryContact.href}
            className="text-blue-600 hover:underline text-lg"
          >
            {primaryContact.label}: {primaryContact.value}
          </a>
          {primaryContact.description && (
            <p className="text-sm text-gray-600 mt-1">
              {primaryContact.description}
            </p>
          )}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.filter(method => !method.primary).map((method) => (
          <a
            key={`${method.type}-${method.value}`}
            href={method.href}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{method.label}</div>
            <div className="text-sm text-gray-600">{method.value}</div>
            {method.availability && (
              <div className="text-xs text-gray-500 mt-1">
                {method.availability}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Example 5: SEO Integration
 */
export function SEOExample() {
  const { data: seoData, generatePageTitle } = useSEO('lessons', {
    title: 'Professional Music Lessons',
    description: 'Learn guitar, piano, and more with personalized instruction from experienced teacher Rrish.',
    keywords: 'music lessons, guitar lessons, piano lessons, online music teacher'
  });
  
  // In a real app, you'd use this with react-helmet or Next.js Head
  React.useEffect(() => {
    if (seoData) {
      document.title = generatePageTitle('Lessons');
      
      // Update meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.description);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', seoData.keywords);
      }
    }
  }, [seoData, generatePageTitle]);
  
  return (
    <div>
      {/* Your page content here */}
      <h1>Music Lessons</h1>
      {/* SEO meta tags are automatically managed */}
    </div>
  );
}

/**
 * Example 6: Navigation Usage
 */
export function NavigationExample() {
  const { navigation, loading, error } = useNavigation();
  
  if (loading) return <nav>Loading navigation...</nav>;
  if (error) return <nav>Navigation error</nav>;
  if (!navigation) return null;
  
  return (
    <nav className="flex space-x-6">
      {navigation.primary.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-gray-700 hover:text-blue-600 transition-colors"
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Example 7: Error Handling and Loading States
 */
export function ComprehensiveExample() {
  const { content, loading, error, validationResult, refresh, retryCount } = useContent();
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading content...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Retry attempt: {retryCount}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Content Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
          {retryCount >= 3 && (
            <p className="text-sm text-gray-500 mt-2">
              If the problem persists, please contact support.
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // Validation warnings
  if (validationResult && validationResult.warnings.length > 0) {
    console.warn('Content validation warnings:', validationResult.warnings);
  }
  
  // Success state
  return (
    <div className="min-h-screen">
      {/* Your main content here */}
      <HeroSectionExample />
      <LessonPackagesExample />
      <TestimonialsExample />
      <ContactExample />
      
      {/* Development helpers */}
      {process.env.NODE_ENV === 'development' && validationResult && (
        <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white rounded shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">Content Status</h3>
          <p className="text-sm">
            Valid: {validationResult.valid ? '✅' : '❌'}
          </p>
          <p className="text-sm">
            Errors: {validationResult.errors.length}
          </p>
          <p className="text-sm">
            Warnings: {validationResult.warnings.length}
          </p>
          <button
            onClick={refresh}
            className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}