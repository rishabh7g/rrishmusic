# Gallery Management Guide

## Overview

The RrishMusic gallery system underwent a major overhaul in August 2025, migrating from embedded performance content to a dedicated, sophisticated gallery management system. This guide covers the current implementation, management workflow, and technical architecture.

## Migration Summary

### Before (Legacy System)
- Gallery content embedded in `performance.json`
- Basic grid layout with limited responsiveness
- Manual image management
- Limited mobile optimization

### After (Current System)
- Dedicated `gallery.json` with comprehensive schema
- Advanced masonry layout with smart positioning
- Automatic aspect ratio calculations
- Enhanced mobile responsiveness
- Video preview support
- Category-based filtering
- Priority-based loading

## Current Architecture

### File Structure
```
src/
├── content/
│   └── gallery.json              # Gallery configuration and media
├── components/
│   ├── pages/
│   │   └── Gallery.tsx          # Main gallery page component
│   └── social/
│       ├── InstagramFeed.tsx    # Instagram integration
│       └── InstagramEmbed.tsx   # Individual post embeds
└── hooks/
    └── useInstagramContent.ts   # Instagram API integration
```

### Gallery Configuration Schema

The gallery system is configured through `src/content/gallery.json`:

```json
{
  "seo": {
    "title": "Gallery - RrishMusic",
    "description": "Explore Rrish's musical journey through photos and videos",
    "keywords": "gallery, photos, videos, performances, music",
    "canonicalUrl": "https://www.rrishmusic.com/gallery"
  },
  "ui": {
    "loadingMessage": "Loading gallery...",
    "emptyStateTitle": "No media content available at the moment.",
    "emptyStateDescription": "Media files will appear here once they're added to the gallery.",
    "featuredBadge": "⭐ Featured",
    "videoBadge": "VIDEO"
  },
  "layout": {
    "grid": {
      "mobile": "grid-cols-2",
      "tablet": "sm:grid-cols-3 md:grid-cols-4",
      "desktop": "lg:grid-cols-6 xl:grid-cols-8",
      "rowHeight": "auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px]",
      "gap": "gap-3 md:gap-4"
    },
    "animations": {
      "container": {
        "hidden": { "opacity": 0 },
        "visible": {
          "opacity": 1,
          "transition": { "duration": 0.6, "ease": "easeOut" }
        }
      },
      "item": {
        "hidden": { "opacity": 0, "y": 20 },
        "visible": { 
          "opacity": 1, 
          "y": 0,
          "transition": { "duration": 0.4 }
        }
      }
    }
  },
  "media": [
    {
      "filename": "performance-venue.jpg",
      "category": "landscape",
      "path": "/images/instagram/landscape/performance-venue.jpg",
      "aspectRatio": 1.77,
      "priority": "high",
      "featured": true,
      "description": "Live performance at premier venue"
    }
  ]
}
```

## Media Item Schema

Each media item in the gallery follows this schema:

```typescript
interface MediaItem {
  filename: string              // Unique filename
  category: 'portrait' | 'landscape' | 'video'
  path: string                 // Relative path from public/
  aspectRatio: number          // Width/height ratio (e.g., 1.77 for 16:9)
  priority: 'high' | 'medium' | 'low'
  featured?: boolean           // Show featured badge
  description?: string         // Alt text and caption
}
```

### Category Types

**Portrait** (`aspectRatio < 1.2`)
- Typical ratio: 0.8 (4:5) to 1.0 (1:1)
- Best for: Artist photos, close-up shots
- Layout: Takes vertical space in masonry

**Landscape** (`aspectRatio > 1.2`)
- Typical ratio: 1.33 (4:3) to 1.77 (16:9)
- Best for: Venue photos, wide performance shots
- Layout: Spans horizontal space

**Video** (Any aspect ratio)
- Includes video badge overlay
- Supports preview thumbnail
- Click-to-play functionality

### Priority System

**High Priority**
- Loads immediately
- Featured in top positions
- Better mobile visibility

**Medium Priority**
- Loads with standard lazy loading
- Good positioning in grid

**Low Priority**
- Loads last
- Lower in grid hierarchy
- Mobile: May be hidden on small screens

## Gallery Component Implementation

### Main Gallery Component
```typescript
// src/components/pages/Gallery.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { usePageSEO } from '@/hooks/usePageSEO'
import { SEOHead } from '@/components/common/SEOHead'
import { InstagramFeed } from '@/components/social/InstagramFeed'

export const Gallery: React.FC = () => {
  usePageSEO({
    title: "Gallery - RrishMusic",
    description: "Explore Rrish's musical journey through photos and videos"
  })

  return (
    <>
      <SEOHead />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      >
        <InstagramFeed />
      </motion.div>
    </>
  )
}
```

### Instagram Integration
```typescript
// src/components/social/InstagramFeed.tsx
export const InstagramFeed: React.FC = () => {
  const { posts, loading, error } = useInstagramContent()
  const galleryConfig = useContent().gallery

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{galleryConfig.ui.loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className={`
          grid ${galleryConfig.layout.grid.mobile}
          ${galleryConfig.layout.grid.tablet}
          ${galleryConfig.layout.grid.desktop}
          ${galleryConfig.layout.grid.rowHeight}
          ${galleryConfig.layout.grid.gap}
        `}
        variants={galleryConfig.layout.animations.container}
        initial="hidden"
        animate="visible"
      >
        {posts.map(post => (
          <GalleryItem
            key={post.id}
            item={post}
            variants={galleryConfig.layout.animations.item}
          />
        ))}
      </motion.div>
    </div>
  )
}
```

### Masonry Layout Implementation

The gallery uses CSS Grid with automatic row sizing for masonry effect:

```css
/* Applied through Tailwind classes */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-auto-rows: 120px;
  gap: 12px;
}

.gallery-item {
  /* Span rows based on aspect ratio */
  grid-row: span calc(var(--aspect-ratio) * 2);
}
```

Smart positioning based on aspect ratio:
```typescript
const getGridSpan = (aspectRatio: number): number => {
  if (aspectRatio < 0.7) return 3    // Tall portrait: 3 rows
  if (aspectRatio < 1.0) return 2    // Square/portrait: 2 rows  
  if (aspectRatio < 1.5) return 2    // Landscape: 2 rows
  return 1                           // Wide landscape: 1 row
}
```

## Content Management Workflow

### Adding New Media Items

**Step 1: Add Images to Public Directory**
```bash
# Add images to appropriate category folder
public/images/instagram/
├── portrait/
│   └── new-portrait.jpg
├── landscape/  
│   └── new-landscape.jpg
└── video/
    └── new-video-thumb.jpg
```

**Step 2: Update gallery.json**
```json
{
  "media": [
    {
      "filename": "new-portrait.jpg",
      "category": "portrait", 
      "path": "/images/instagram/portrait/new-portrait.jpg",
      "aspectRatio": 0.8,
      "priority": "high",
      "featured": true,
      "description": "Recent studio session"
    }
  ]
}
```

**Step 3: Calculate Aspect Ratio**
```typescript
// For image dimensions 800x1000 (portrait)
const aspectRatio = 800 / 1000 // = 0.8

// For image dimensions 1920x1080 (landscape)
const aspectRatio = 1920 / 1080 // = 1.77
```

### Batch Adding Media

For multiple media items, use this JSON template:

```json
{
  "media": [
    {
      "filename": "batch-item-1.jpg",
      "category": "landscape",
      "path": "/images/instagram/landscape/batch-item-1.jpg", 
      "aspectRatio": 1.5,
      "priority": "medium"
    },
    {
      "filename": "batch-item-2.jpg",
      "category": "portrait",
      "path": "/images/instagram/portrait/batch-item-2.jpg",
      "aspectRatio": 0.9, 
      "priority": "medium"
    }
  ]
}
```

### Instagram Integration Workflow

The gallery integrates with Instagram through the `useInstagramContent` hook:

**Automatic Integration:**
1. Instagram API fetches latest posts
2. Posts are processed and cached
3. Local fallback used if API fails
4. Gallery displays combined content

**Manual Override:**
```typescript
// To prioritize local content over Instagram
const { posts, error } = useInstagramContent()
const localMedia = useContent().gallery.media

const displayMedia = error ? localMedia : [...posts, ...localMedia]
```

## Performance Optimizations

### Lazy Loading Implementation

```typescript
const GalleryItem: React.FC = ({ item }) => {
  const [isInView, setIsInView] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={itemRef} className="gallery-item">
      {isInView && (
        <img
          src={item.path}
          alt={item.description}
          onLoad={() => setImageLoaded(true)}
          className={`transition-opacity ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
```

### Mobile Optimization

**Responsive Grid:**
```typescript
// Tailwind classes adapt to screen size
const gridClasses = `
  grid-cols-2                    // Mobile: 2 columns
  sm:grid-cols-3                // Small: 3 columns  
  md:grid-cols-4                // Medium: 4 columns
  lg:grid-cols-6                // Large: 6 columns
  xl:grid-cols-8                // XL: 8 columns
`

// Row height adapts to screen size
const rowClasses = `
  auto-rows-[120px]             // Mobile: 120px rows
  sm:auto-rows-[140px]          // Small: 140px rows
  md:auto-rows-[160px]          // Medium: 160px rows
`
```

**Touch Optimizations:**
- Minimum 44px touch targets
- Smooth scroll behavior
- Touch-friendly zoom interactions

### Image Format Optimization

The system supports modern image formats:

```typescript
// Automatic format detection and fallback
const getOptimizedImageSrc = (path: string) => {
  const supportsWebP = checkWebPSupport()
  const supportsAVIF = checkAVIFSupport()
  
  if (supportsAVIF) return path.replace('.jpg', '.avif')
  if (supportsWebP) return path.replace('.jpg', '.webp')
  return path
}
```

## Video Support

The gallery system includes comprehensive video support:

### Video Configuration
```json
{
  "filename": "performance-video.mp4",
  "category": "video",
  "path": "/videos/performance-video.mp4",
  "aspectRatio": 1.77,
  "priority": "high",
  "thumbnail": "/images/thumbnails/performance-video-thumb.jpg"
}
```

### Video Component Implementation
```typescript
const VideoItem: React.FC = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative group">
      {!isPlaying ? (
        <div 
          className="cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <img src={item.thumbnail} alt={item.description} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity">
            <PlayIcon className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            VIDEO
          </div>
        </div>
      ) : (
        <video
          src={item.path}
          controls
          autoPlay
          className="w-full h-full object-cover rounded"
        />
      )}
    </div>
  )
}
```

## SEO and Accessibility

### SEO Implementation
```typescript
// Dynamic SEO based on gallery content
const useGallerySEO = () => {
  const gallery = useContent().gallery
  const featuredItems = gallery.media.filter(item => item.featured)
  
  return usePageSEO({
    title: gallery.seo.title,
    description: gallery.seo.description,
    keywords: gallery.seo.keywords,
    ogImage: featuredItems[0]?.path,
    canonicalUrl: gallery.seo.canonicalUrl
  })
}
```

### Accessibility Features
- Comprehensive alt text for all images
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Reduced motion respect

```typescript
const GalleryItem: React.FC = ({ item }) => {
  return (
    <div
      role="img"
      aria-label={item.description}
      tabIndex={0}
      className="gallery-item focus:ring-2 focus:ring-blue-500"
    >
      <img
        src={item.path}
        alt={item.description}
        loading="lazy"
      />
      {item.featured && (
        <span className="sr-only">Featured image</span>
      )}
    </div>
  )
}
```

## Troubleshooting

### Common Issues

**Images Not Loading**
1. Check file paths in gallery.json
2. Verify images exist in public/ directory
3. Check case sensitivity in filenames
4. Validate JSON syntax

**Layout Issues**
1. Verify aspect ratios are calculated correctly
2. Check grid configuration in gallery.json
3. Test responsive breakpoints
4. Validate CSS grid classes

**Performance Issues**
1. Optimize image sizes (recommended: < 500KB)
2. Check lazy loading implementation
3. Monitor bundle size impact
4. Use image compression tools

### Debug Mode

Enable gallery debug information:

```typescript
const Gallery = () => {
  const debugMode = process.env.NODE_ENV === 'development'
  
  return (
    <div>
      {debugMode && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 text-xs">
          Gallery Debug: {posts.length} items loaded
        </div>
      )}
      {/* Gallery content */}
    </div>
  )
}
```

---
**Last Updated**: August 2025  
**Related**: [Content Schemas](../api/content-schemas.md) | [Component Hierarchy](../architecture/component-hierarchy.md)