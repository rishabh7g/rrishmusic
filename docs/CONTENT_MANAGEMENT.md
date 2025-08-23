# Content Management Guide

This guide explains how to manage content for the RrishMusic website using the file-based content management system.

## 📋 Overview

The website uses a **file-based content management system** where all content is stored in JSON files with full TypeScript type safety. This approach provides:

- ✅ **Version control** - All content changes are tracked in Git
- ✅ **Type safety** - Full TypeScript validation  
- ✅ **Zero cost** - No external services required
- ✅ **Performance** - Content bundled at build time
- ✅ **Developer friendly** - Easy to update via code editor

## 📁 Content Structure

```
src/
├── content/
│   ├── site-content.json    # Main site content (hero, about, etc.)
│   ├── lessons.json         # Lesson packages and pricing
│   └── testimonials.json    # Student testimonials
├── types/
│   └── content.ts          # TypeScript type definitions
├── hooks/
│   └── useContent.ts       # Content access hooks
└── utils/
    └── contentManager.ts   # Content utilities
```

## 🛠️ Quick Start

### 1. Update Site Content

Edit `/src/content/site-content.json`:

```json
{
  "hero": {
    "title": "Hi, I'm Rrish.",
    "subtitle": "Your updated subtitle here...",
    "instagramUrl": "https://instagram.com/rrishmusic"
  },
  "about": {
    "title": "About Me", 
    "content": [
      "First paragraph of about section...",
      "Second paragraph..."
    ]
  }
}
```

### 2. Update Lesson Prices

**Option A: Direct Edit**
Edit `/src/content/lessons.json`:

```json
{
  "packages": [
    {
      "id": "single",
      "name": "Single Lesson",
      "price": 60,
      "sessions": 1
    }
  ]
}
```

**Option B: Using Script**
```bash
node scripts/update-content.cjs prices
```

### 3. Add Testimonials

**Option A: Direct Edit**
Edit `/src/content/testimonials.json`:

```json
[
  {
    "id": "new-student",
    "name": "New Student Name",
    "text": "Great lesson experience...",
    "rating": 5,
    "instrument": "Guitar",
    "level": "beginner",
    "featured": true
  }
]
```

**Option B: Using Script**
```bash
node scripts/update-content.cjs testimonial
```

## 🎯 Content Management Scripts

We provide several Node.js scripts for easier content management:

### Validate Content
```bash
node scripts/update-content.cjs validate
```
Checks all JSON files for structural validity and required fields.

### Backup Content  
```bash
node scripts/update-content.cjs backup
```
Creates timestamped backup of all content files in `/backups/content/`.

### Update Prices Interactively
```bash 
node scripts/update-content.cjs prices
```
Guided process to update lesson package prices with automatic discount calculation.

### Add Testimonial
```bash
node scripts/update-content.cjs testimonial  
```
Interactive form to add new student testimonials.

## 📝 Content Types Reference

### Site Content (`site-content.json`)

```typescript
interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    instagramHandle: string;
    instagramUrl: string;
  };
  about: {
    title: string;
    content: string[];
    skills: string[];
  };
  // ... other sections
}
```

### Lesson Content (`lessons.json`)

```typescript
interface LessonPackage {
  id: string;
  name: string;
  sessions: number;
  price: number;
  discount?: number;
  features: string[];
  popular?: boolean;
  description?: string;
}
```

### Testimonials (`testimonials.json`)

```typescript
interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number; // 1-5
  instrument?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}
```

## 🔧 Usage in Components  

### Using Content Hooks

```typescript
import { useContent, useSectionContent } from '@/hooks/useContent';

function HeroSection() {
  const { data: heroContent } = useSectionContent('hero');
  
  return (
    <h1>{heroContent.title}</h1>
  );
}

function LessonsSection() {
  const { packages } = useLessonPackages({ popular: true });
  
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

### Direct Content Access

```typescript
import { rawContent } from '@/hooks/useContent';

// Access content directly (useful in constants, configs)
const siteTitle = rawContent.site.seo.defaultTitle;
const instagramUrl = rawContent.site.hero.instagramUrl;
```

## 🚀 Deployment Workflow

1. **Edit Content**: Modify JSON files locally
2. **Validate**: Run `node scripts/update-content.cjs validate`
3. **Test Locally**: Run `npm run dev` to test changes
4. **Commit Changes**: Git commit with descriptive message
5. **Push**: Push to GitHub - auto-deploys via GitHub Pages

### Example Workflow
```bash
# Edit content files
vim src/content/site-content.json

# Validate changes
node scripts/update-content.cjs validate

# Test locally
npm run dev

# Commit and push
git add src/content/
git commit -m "Update hero section copy and pricing"
git push origin main
```

## 🔍 Content Validation

### Automatic Validation
- **Build Time**: TypeScript validates all content structure
- **Runtime**: Hooks provide type-safe access
- **Scripts**: Validation script checks JSON structure

### Common Issues & Fixes

**JSON Syntax Errors**
```bash
# Check for syntax issues
node scripts/update-content.cjs validate
```

**Missing Required Fields**
- Check TypeScript errors in IDE
- Use validation script to identify missing fields

**Image Paths**
- All images should be in `/public/images/`
- Use absolute paths starting with `/images/`

## 🌟 Best Practices

### Content Updates
1. **Always backup** before major changes
2. **Test locally** before pushing to production
3. **Use descriptive commit messages** for content changes
4. **Validate** content after editing

### File Organization  
1. **Keep JSON files clean** - use proper formatting
2. **Use meaningful IDs** - helps with maintenance
3. **Group related content** - don't spread across multiple files unnecessarily

### SEO Considerations
1. **Update meta descriptions** when changing page content
2. **Keep URLs consistent** - avoid changing section IDs
3. **Optimize images** before adding to content

## 🛟 Troubleshooting

### Build Errors
```bash
# Check TypeScript errors
npm run type-check

# Validate content structure  
node scripts/update-content.cjs validate
```

### Content Not Updating
1. Clear browser cache (Ctrl+F5)
2. Check if changes were committed and pushed
3. Verify GitHub Pages deployment status
4. Check for console errors in browser

### Performance Issues
- **Image optimization**: Compress images before adding
- **Content size**: Keep individual JSON files under 100KB
- **Caching**: Content is cached at build time for performance

## 📞 Support

If you encounter issues with content management:
1. Check this guide first
2. Validate content using scripts
3. Check GitHub Issues for similar problems
4. Create new issue with validation output

---

**Next**: [Component Development Guide](COMPONENTS.md) | [Deployment Guide](DEPLOYMENT.md)