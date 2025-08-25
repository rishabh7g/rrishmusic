# Data Calculation Utilities

This directory contains the unified data calculation system for the RrishMusic platform, providing centralized, cached, and performance-optimized calculations for all dynamic data operations.

## Overview

The data calculation system consists of three main components:

1. **Cache System** (`cache.ts`) - TTL-based caching with performance monitoring
2. **Data Calculator** (`dataCalculator.ts`) - Unified calculation utilities for all data types
3. **Content Manager** (`contentManager.ts`) - Integration layer with existing content hooks

## Architecture

```
┌─────────────────────────┐
│   Content Hooks        │  ← Existing useContent, useServiceContent
│   (useContent.ts)       │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Content Manager      │  ← Integration & backward compatibility
│   (contentManager.ts)   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Data Calculator      │  ← Unified calculation API
│   (dataCalculator.ts)   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Cache System         │  ← TTL-based caching & performance
│   (cache.ts)           │
└─────────────────────────┘
```

## Usage

### Basic Usage

```typescript
import { dataCalculator } from '@/utils/dataCalculator';

// Calculate testimonial statistics
const testimonialStats = await dataCalculator.calculateTestimonialStats(testimonials);

// Calculate performance data
const performanceData = await dataCalculator.calculatePerformanceData(rawData);

// Calculate general statistics  
const generalStats = await dataCalculator.calculateGeneralStats();

// Calculate lesson package pricing
const pricingData = await dataCalculator.calculateLessonPackagePricing(package);
```

### Hook Integration

```typescript
import { useContentCalculations } from '@/utils/contentManager';

function MyComponent() {
  const { 
    calculateTestimonialStats,
    clearAllCaches,
    getPerformanceMetrics 
  } = useContentCalculations();

  // Use calculations in component
  const handleCalculation = async () => {
    const stats = await calculateTestimonialStats(testimonials);
    // ...
  };
}
```

### Backward Compatibility

```typescript
// Old way (still works)
import { calculateTestimonialStats } from '@/utils/testimonialCalculations';

// New way (recommended)
import { calculateTestimonialStats } from '@/utils/contentManager';
```

## Features

### 1. Intelligent Caching

- **TTL-based expiration** - Automatic cache invalidation
- **Memory efficient** - Cleanup of expired entries
- **Hit rate monitoring** - Performance tracking
- **Configurable TTL** - Different expiration times for different data types

```typescript
// Cache TTL constants
const CacheTTL = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes  
  LONG: 900000,      // 15 minutes
  EXTENDED: 3600000  // 1 hour
};
```

### 2. Performance Monitoring

```typescript
// Get performance metrics
const metrics = dataCalculator.getPerformanceMetrics();
console.log({
  cacheHits: metrics.monitor.cacheHits,
  cacheMisses: metrics.monitor.cacheMisses,
  hitRate: metrics.hitRate,
  averageCalculationTime: metrics.monitor.averageCalculationTime
});
```

### 3. Error Handling

```typescript
import { safeCalculation, createCalculationError } from '@/utils/contentManager';

// Safe calculation with fallback
const stats = await safeCalculation(
  () => dataCalculator.calculateTestimonialStats(testimonials),
  defaultStats, // fallback value
  'testimonial_stats' // calculation type
);
```

### 4. Batch Operations

```typescript
import { batchCalculations } from '@/utils/contentManager';

const results = await batchCalculations({
  testimonials: () => dataCalculator.calculateTestimonialStats(testimonials),
  performance: () => dataCalculator.calculatePerformanceData(performanceData),
  stats: () => dataCalculator.calculateGeneralStats()
}, {
  testimonials: defaultTestimonialStats,
  performance: defaultPerformanceData,
  stats: defaultStats
});
```

## Calculator Classes

### TestimonialCalculator

Handles testimonial-related calculations:
- Overall statistics (total, average rating)
- Service-specific breakdowns
- Featured/verified counts
- Data validation and caching

### PerformanceCalculator

Handles performance data calculations:
- Total performances count
- Unique venues calculation
- Genre distribution analysis
- Year range and averages
- Enhanced metadata generation

### StatsCalculator

Handles general site statistics:
- Experience calculations (years active)
- Student counts and metrics
- Success story tracking
- Cross-service statistics

### PricingCalculator

Handles pricing-related calculations:
- Package pricing with discounts
- Per-lesson cost calculations
- Savings calculations
- Formatted price strings

## Cache Management

### Manual Cache Operations

```typescript
// Clear all caches
dataCalculator.clearAllCaches();

// Cleanup expired entries
const clearedCount = dataCalculator.cleanup();

// Get cache statistics
const cacheStats = globalCache.getStats();
```

### Automatic Maintenance

The cache system automatically:
- Expires entries based on TTL
- Tracks hit/miss ratios
- Monitors calculation performance
- Provides cleanup utilities

## Performance Optimizations

### 1. Data Hashing

Input data is hashed to create unique cache keys, ensuring calculations are only performed when data actually changes.

### 2. Lazy Calculation

Calculations are only performed when requested and cached results are not available.

### 3. Batch Processing

Multiple calculations can be batched together with individual error handling.

### 4. Progressive Enhancement

Fallback values ensure the application continues to work even if calculations fail.

## Integration with Existing Code

The system is designed to be backward-compatible with existing code:

1. **Drop-in replacement** - Existing calculation functions continue to work
2. **Progressive adoption** - Can be adopted incrementally
3. **Error boundaries** - Failures don't break existing functionality
4. **Performance monitoring** - Track adoption and performance gains

## Testing

All calculation utilities include comprehensive error handling and validation:

```typescript
import { validateCalculationInputs } from '@/utils/contentManager';

// Validate testimonial data
validateCalculationInputs(
  testimonials,
  (t) => t.rating >= 1 && t.rating <= 5,
  'Invalid testimonial rating'
);
```

## Future Enhancements

- **Real-time updates** - WebSocket integration for live data
- **Advanced caching strategies** - LRU, compression
- **Background calculation** - Web Workers for heavy computations
- **A/B testing support** - Multiple calculation variants
- **Analytics integration** - Usage tracking and optimization

## Troubleshooting

### Common Issues

1. **Cache not updating** - Check TTL settings and manual cache clearing
2. **Performance issues** - Monitor hit rates and calculation times
3. **Type errors** - Ensure proper TypeScript integration
4. **Memory usage** - Regular cache cleanup and monitoring

### Debug Tools

```typescript
// Performance debugging
const metrics = dataCalculator.getPerformanceMetrics();
console.log('Performance:', metrics);

// Cache debugging
const cacheStats = globalCache.getStats();
console.log('Cache:', cacheStats);

// Clear everything for testing
dataCalculator.clearAllCaches();
```