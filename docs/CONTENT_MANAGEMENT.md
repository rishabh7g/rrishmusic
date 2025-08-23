# RrishMusic Content Management Guide

## Overview

The RrishMusic website uses a **TypeScript + JSON-based content management system** that provides type-safe, hot-reloadable content updates. This system is designed for easy maintenance by both developers and non-technical users.

### System Architecture

```
src/content/
├── site-content.json      # Main website content
├── lessons.json          # Lesson packages and pricing
└── testimonials.json     # Student testimonials

src/types/content.ts       # TypeScript type definitions
src/hooks/useContent.ts    # React hooks for accessing content
src/utils/contentManager.ts # Validation and utility functions
```

### Key Benefits

- **Type Safety**: TypeScript ensures content structure integrity
- **Hot Reloading**: Changes appear instantly during development
- **Version Control**: All content changes are tracked in Git
- **Validation**: Automatic content validation prevents errors
- **Developer Friendly**: JSON format with full IDE support

---

## Content Structure Reference

### 1. Site Content (`src/content/site-content.json`)

The main website content is organized into logical sections:

#### Hero Section
```json
{
  "hero": {
    "title": "Hi, I'm Rrish.",
    "subtitle": "Description of what you do",
    "ctaText": "Call to action text",
    "instagramHandle": "@rrishmusic",
    "instagramUrl": "https://instagram.com/rrishmusic"
  }
}
```

#### About Section
```json
{
  "about": {
    "title": "About Me",
    "content": [
      "First paragraph about yourself",
      "Second paragraph with more details"
    ],
    "skills": [
      "Blues Improvisation",
      "Music Theory",
      "Guitar & Piano"
    ]
  }
}
```

#### Teaching Approach
```json
{
  "approach": {
    "title": "My Teaching Approach",
    "subtitle": "Brief description",
    "principles": [
      {
        "title": "Principle Name",
        "description": "Explanation of this principle",
        "icon": "icon-name"
      }
    ]
  }
}
```

#### Contact Information
```json
{
  "contact": {
    "title": "Get Started Today",
    "subtitle": "Call to action",
    "methods": [
      {
        "type": "email",
        "label": "Email",
        "value": "hello@rrishmusic.com",
        "href": "mailto:hello@rrishmusic.com",
        "primary": true
      }
    ],
    "location": "Melbourne, Victoria, Australia"
  }
}
```

#### SEO Settings
```json
{
  "seo": {
    "defaultTitle": "Page Title | Site Name",
    "defaultDescription": "Site description for search engines",
    "defaultKeywords": "relevant, keywords, separated, by, commas",
    "ogImage": "/images/og-image.jpg"
  }
}
```

### 2. Lesson Content (`src/content/lessons.json`)

#### Lesson Packages
```json
{
  "packages": [
    {
      "id": "unique-id",
      "name": "Package Name",
      "sessions": 4,
      "price": 190,
      "discount": 5,
      "popular": false,
      "features": [
        "Feature 1",
        "Feature 2"
      ],
      "description": "Package description"
    }
  ]
}
```

#### Additional Information
```json
{
  "additionalInfo": {
    "sessionLength": "60 minutes per individual lesson",
    "cancellationPolicy": "24-hour notice required",
    "reschedulePolicy": "Free rescheduling with 4-hour notice",
    "location": "Melbourne CBD studio or online",
    "instruments": ["Guitar", "Piano", "Music Theory"],
    "levels": "All levels welcome",
    "ageRange": "Lessons available for ages 12 and up"
  }
}
```

### 3. Testimonials (`src/content/testimonials.json`)

```json
[
  {
    "id": "unique-id",
    "name": "Student Name",
    "text": "Testimonial content",
    "rating": 5,
    "instrument": "Guitar",
    "level": "beginner",
    "featured": true
  }
]
```

---

## Content Update Procedures

### Prerequisites

Before making content updates:

1. **Development Environment**: Ensure you have the development server running
   ```bash
   npm run dev
   ```

2. **Text Editor**: Use VS Code or similar editor with JSON validation
3. **Backup**: Commit any existing changes before making updates

### Step-by-Step Update Process

#### 1. Updating Basic Site Content

**To update hero section text:**

1. Open `/Users/rrish/Documents/code/rrishmusic/src/content/site-content.json`
2. Locate the `"hero"` section
3. Modify the desired fields:
   ```json
   {
     "hero": {
       "title": "Hi, I'm Rrish.",  ← Edit this
       "subtitle": "Your new subtitle here"  ← Edit this
     }
   }
   ```
4. Save the file
5. Check your browser - changes should appear immediately

**To update about section:**

1. Find the `"about"` section in the same file
2. Update content array (each item is a paragraph):
   ```json
   {
     "about": {
       "content": [
         "New first paragraph",
         "New second paragraph",
         "You can add more paragraphs here"
       ],
       "skills": [
         "Update your skills list",
         "Add new skills",
         "Remove old ones"
       ]
     }
   }
   ```

#### 2. Updating Contact Information

**To add or modify contact methods:**

1. Open `site-content.json`
2. Navigate to `"contact"` → `"methods"`
3. Add new contact method:
   ```json
   {
     "contact": {
       "methods": [
         {
           "type": "phone",
           "label": "Phone",
           "value": "+61 xxx xxx xxx",
           "href": "tel:+61xxxxxxxxx",
           "primary": false
         }
       ]
     }
   }
   ```

**Available contact types:** `"email"`, `"instagram"`, `"phone"`

#### 3. Updating Lesson Pricing

**To modify lesson prices:**

1. Open `/Users/rrish/Documents/code/rrishmusic/src/content/lessons.json`
2. Find the package to update:
   ```json
   {
     "id": "package-4",
     "name": "4-Lesson Package",
     "sessions": 4,
     "price": 190,  ← Update price here
     "discount": 5  ← Update discount percentage
   }
   ```

**To add a new lesson package:**

1. Add new object to the `"packages"` array:
   ```json
   {
     "id": "package-12",
     "name": "12-Lesson Package",
     "sessions": 12,
     "price": 480,
     "discount": 20,
     "popular": false,
     "features": [
       "12 individual lessons (1 hour each)",
       "Comprehensive skill development",
       "Priority booking",
       "20% savings"
     ],
     "description": "Extended package for serious students"
   }
   ```

**To mark a package as popular:**
- Set `"popular": true` for the package you want to highlight
- Only one package should have `"popular": true`

#### 4. Managing Testimonials

**To add a new testimonial:**

1. Open `/Users/rrish/Documents/code/rrishmusic/src/content/testimonials.json`
2. Add new testimonial to the array:
   ```json
   {
     "id": "new-student-id",
     "name": "Student Name",
     "text": "Their testimonial text here",
     "rating": 5,
     "instrument": "Guitar",
     "level": "intermediate",
     "featured": true
   }
   ```

**Testimonial Guidelines:**
- `id`: Must be unique (use format: `firstname-lastname-initial`)
- `rating`: Number from 1-5
- `level`: `"beginner"`, `"intermediate"`, or `"advanced"`
- `featured`: Set to `true` for testimonials to appear on the homepage
- `instrument`: Match instruments listed in lessons.json

**To feature/unfeature testimonials:**
- Set `"featured": true` for testimonials to show on homepage
- Set `"featured": false` to hide from homepage but keep in database

#### 5. Updating SEO Settings

**To improve search engine optimization:**

1. Open `site-content.json`
2. Update the `"seo"` section:
   ```json
   {
     "seo": {
       "defaultTitle": "Rrish Music - Blues Lessons | Melbourne",
       "defaultDescription": "Professional blues improvisation and music theory lessons in Melbourne. All skill levels welcome.",
       "defaultKeywords": "blues guitar, piano lessons melbourne, improvisation, music theory",
       "ogImage": "/images/social-share-image.jpg"
     }
   }
   ```

**SEO Best Practices:**
- **Title**: Keep under 60 characters, include main keywords
- **Description**: 150-160 characters, compelling and informative
- **Keywords**: Use relevant terms, separated by commas
- **ogImage**: Social media image (1200x630px recommended)

---

## Development Integration

### Git Workflow for Content Changes

**For all content updates, follow this process:**

1. **Create a branch for your changes:**
   ```bash
   git checkout -b content/update-lesson-pricing
   ```

2. **Make your content changes** following the procedures above

3. **Test your changes:**
   - Check the development server (`npm run dev`)
   - Verify all content displays correctly
   - Test on mobile devices

4. **Commit your changes:**
   ```bash
   git add src/content/
   git commit -m "content: update lesson pricing for 2025
   
   - Increased package prices by 5%
   - Added new 12-lesson package option
   - Updated package descriptions
   
   🤖 Generated with Claude Code
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

5. **Create Pull Request:**
   - Push branch to GitHub
   - Create PR with detailed description
   - Link to any relevant issues

### Content Validation

The system includes automatic validation to prevent errors:

**Validation Checks:**
- ✅ Required fields are present
- ✅ Data types are correct
- ✅ URLs are properly formatted
- ✅ Email addresses are valid
- ✅ Rating numbers are between 1-5
- ✅ Contact method types are valid

**If validation fails:**
1. Check the browser console for error messages
2. Review the error details
3. Fix the JSON syntax or data issues
4. Save and check again

### Hot Reloading

When the development server is running:
- **JSON changes** appear immediately
- **No browser refresh** required
- **Type errors** are caught instantly
- **Validation errors** show in console

---

## Advanced Content Management

### Content Hooks Usage

The system provides React hooks for accessing content in components:

```typescript
// Access all site content
const { content, lessons, loading, error } = useContent();

// Access specific sections
const { data: heroData } = useSectionContent('hero');

// Access filtered lesson packages
const { packages } = useLessonPackages({ popular: true });

// Access SEO data
const { getSEOData } = useSEO();
```

### Content Utilities

Use the built-in utilities for common operations:

```typescript
import { contentUtils } from '@/utils/contentManager';

// Format prices
contentUtils.formatPrice(190); // "$190"

// Calculate package savings
contentUtils.calculateSavings(190, 4, 50); // 5% savings

// Filter testimonials
contentUtils.filterTestimonials(testimonials, { featured: true });
```

### Adding New Content Types

**To add a new content section:**

1. **Define TypeScript types** in `src/types/content.ts`:
   ```typescript
   export interface NewSection {
     title: string;
     items: string[];
   }

   // Add to SiteContent interface
   export interface SiteContent {
     // ... existing sections
     newSection: NewSection;
   }
   ```

2. **Add to JSON file** with matching structure:
   ```json
   {
     "newSection": {
       "title": "New Section Title",
       "items": ["Item 1", "Item 2"]
     }
   }
   ```

3. **Update validation** in `contentManager.ts`:
   ```typescript
   const requiredSections = [
     'hero', 'about', 'approach', 'community', 'contact', 'seo', 'newSection'
   ];
   ```

### Performance Considerations

**Content Optimization:**
- Keep JSON files under 50KB each
- Optimize images referenced in content
- Use descriptive but concise text
- Minimize nested object depth

**Caching:**
- Content is cached at build time
- Changes require development server restart in production
- Consider CDN caching for JSON files

---

## Best Practices

### Content Writing Guidelines

**General Principles:**
- Write for your audience (music students)
- Use active voice and clear language
- Keep paragraphs short and scannable
- Include specific benefits and outcomes
- Use consistent tone throughout

**SEO Writing Tips:**
- Include relevant keywords naturally
- Write compelling meta descriptions
- Use descriptive headings and titles
- Optimize for local search (Melbourne)

### JSON Maintenance

**Formatting Standards:**
- Use 2-space indentation
- Keep consistent property order
- Use double quotes for strings
- Add trailing commas where allowed

**Data Consistency:**
- Use consistent naming conventions
- Maintain uniform date formats
- Keep price formatting consistent
- Use standard abbreviations

**Error Prevention:**
- Validate JSON syntax before committing
- Test content changes locally first
- Keep backup copies of working versions
- Use meaningful commit messages

### Accessibility Considerations

**Content Guidelines:**
- Write clear, descriptive link text
- Provide alt text for any images referenced
- Use heading hierarchy properly
- Ensure color contrast meets standards
- Write in plain language

**Technical Accessibility:**
- Test with screen readers
- Verify keyboard navigation
- Check mobile responsiveness
- Validate HTML output

---

## Backup and Recovery

### Content Backup Strategy

**Automatic Backups:**
- Git version control tracks all changes
- GitHub stores complete history
- Easy to revert to previous versions

**Manual Backups:**
```bash
# Create backup of current content
cp -r src/content src/content-backup-$(date +%Y%m%d)

# Or backup specific files
cp src/content/site-content.json site-content-backup.json
```

### Recovery Procedures

**To revert recent changes:**
```bash
# See recent commits
git log --oneline src/content/

# Revert to specific commit
git checkout [commit-hash] -- src/content/
```

**To restore from backup:**
```bash
# Restore from local backup
cp src/content-backup-20250823/site-content.json src/content/

# Or restore from Git history
git show HEAD~1:src/content/site-content.json > src/content/site-content.json
```

---

## Support and Troubleshooting

### Common Issues

**Problem: Changes don't appear on website**
- ✅ Check development server is running
- ✅ Verify JSON syntax is valid
- ✅ Clear browser cache
- ✅ Check console for errors

**Problem: Validation errors**
- ✅ Review error message in console
- ✅ Check required fields are present
- ✅ Verify data types match TypeScript definitions
- ✅ Ensure unique IDs for testimonials/packages

**Problem: Build failures**
- ✅ Validate all JSON files
- ✅ Check TypeScript compilation
- ✅ Verify all imports are working
- ✅ Review recent changes

### Getting Help

**Documentation Resources:**
- This content management guide
- TypeScript documentation
- React hooks documentation
- JSON validation tools

**Development Support:**
- Check browser developer console
- Review Git commit history
- Use TypeScript error messages
- Test in development environment

---

*Last Updated: August 2025*  
*For technical questions about the content system, refer to the developer documentation or contact the development team.*