# Content Management Troubleshooting Guide

## Common Issues and Solutions

### JSON Syntax Errors

#### Problem: Invalid JSON format causing build failures

**Symptoms:**
- Development server shows compile errors
- Browser console shows parsing errors
- TypeScript compilation fails

**Common JSON Syntax Issues:**

1. **Missing Commas**
   ```json
   // ❌ WRONG - Missing comma after "title"
   {
     "title": "Hello"
     "subtitle": "World"
   }

   // ✅ CORRECT
   {
     "title": "Hello",
     "subtitle": "World"
   }
   ```

2. **Trailing Commas in Objects**
   ```json
   // ❌ WRONG - Trailing comma not allowed in JSON
   {
     "title": "Hello",
     "subtitle": "World",
   }

   // ✅ CORRECT
   {
     "title": "Hello",
     "subtitle": "World"
   }
   ```

3. **Single vs Double Quotes**
   ```json
   // ❌ WRONG - Single quotes not allowed
   {
     'title': 'Hello'
   }

   // ✅ CORRECT
   {
     "title": "Hello"
   }
   ```

**Solution Steps:**
1. Use a JSON validator (e.g., jsonlint.com)
2. Enable JSON validation in your editor
3. Check the exact error line number
4. Common fixes:
   - Add missing commas
   - Remove trailing commas
   - Change single quotes to double quotes
   - Escape special characters in strings

---

### Content Validation Errors

#### Problem: Content doesn't match TypeScript interfaces

**Error Messages:**
```
Type 'string' is not assignable to type 'number'
Property 'rating' is missing in type but required
```

**Common Type Mismatches:**

1. **Rating Field Must Be Number**
   ```json
   // ❌ WRONG - Rating as string
   {
     "rating": "5"
   }

   // ✅ CORRECT - Rating as number
   {
     "rating": 5
   }
   ```

2. **Missing Required Fields**
   ```json
   // ❌ WRONG - Missing required 'href' field
   {
     "type": "email",
     "label": "Email",
     "value": "test@example.com"
   }

   // ✅ CORRECT - All required fields present
   {
     "type": "email",
     "label": "Email", 
     "value": "test@example.com",
     "href": "mailto:test@example.com",
     "primary": true
   }
   ```

3. **Array vs Object Confusion**
   ```json
   // ❌ WRONG - Skills as object instead of array
   {
     "skills": {
       "skill1": "Guitar",
       "skill2": "Piano"
     }
   }

   // ✅ CORRECT - Skills as array
   {
     "skills": [
       "Guitar",
       "Piano"
     ]
   }
   ```

**Solution Steps:**
1. Check TypeScript error messages in console
2. Compare your JSON structure to the interface in `src/types/content.ts`
3. Ensure all required fields are present
4. Verify data types match expectations
5. Use the validation functions in `contentManager.ts`

---

### Hot Reloading Issues

#### Problem: Changes not appearing immediately

**Symptoms:**
- Save JSON file but changes don't show
- Need to refresh browser manually
- Development server not detecting changes

**Troubleshooting Steps:**

1. **Check Development Server Status**
   ```bash
   # Ensure dev server is running
   npm run dev
   
   # If not running, start it
   # Look for "Local: http://localhost:5173" message
   ```

2. **Verify File Paths**
   - Ensure you're editing files in `src/content/`
   - Check file names match exactly: `site-content.json`, `lessons.json`, `testimonials.json`

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - Open DevTools → Network → Disable cache
   - Try incognito/private browsing mode

4. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for any error messages in Console tab
   - Check Network tab for failed requests

5. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   # Then restart
   npm run dev
   ```

---

### TypeScript Compilation Errors

#### Problem: TypeScript compiler showing errors

**Common Error Types:**

1. **Import Path Errors**
   ```typescript
   // Error: Cannot find module '@/content/site-content.json'
   
   // Solution: Check file exists and path is correct
   // Verify tsconfig.json has correct path mapping
   ```

2. **Type Definition Mismatches**
   ```typescript
   // Error: Type assertion may be incorrect
   const siteContent = siteContentData as SiteContent;
   
   // Solution: Ensure JSON structure matches TypeScript interface
   ```

3. **Missing Type Definitions**
   ```typescript
   // Error: Property 'newField' does not exist on type 'SiteContent'
   
   // Solution: Add new field to interface in src/types/content.ts
   ```

**Solution Steps:**
1. Run TypeScript compiler to see exact errors:
   ```bash
   npx tsc --noEmit
   ```
2. Fix type definition mismatches
3. Update interfaces when adding new content fields
4. Ensure all imports are correct

---

### Content Display Issues

#### Problem: Content appears blank or undefined

**Symptoms:**
- Page renders but content is empty
- Console shows "undefined" for content
- Components not receiving content data

**Debugging Steps:**

1. **Check Content Hook Usage**
   ```typescript
   // Add logging to debug
   const { content, loading, error } = useContent();
   console.log('Content:', content);
   console.log('Loading:', loading);
   console.log('Error:', error);
   ```

2. **Verify JSON Structure**
   ```bash
   # Validate JSON files
   cat src/content/site-content.json | jq .
   ```

3. **Check Import Statements**
   ```typescript
   // Ensure imports are correct in useContent.ts
   import siteContentData from '@/content/site-content.json';
   ```

4. **Test Content Directly**
   ```typescript
   // Add to component for testing
   import { rawContent } from '@/hooks/useContent';
   console.log('Raw content:', rawContent);
   ```

---

### Build and Deployment Issues

#### Problem: Production build fails

**Common Build Errors:**

1. **JSON Import Issues**
   ```
   Error: Failed to resolve import "@/content/site-content.json"
   ```
   
   **Solution:**
   - Ensure JSON files exist in correct location
   - Check Vite configuration supports JSON imports
   - Verify path aliases are configured correctly

2. **Type Checking Failures**
   ```
   Error: Type error in src/hooks/useContent.ts
   ```
   
   **Solution:**
   - Run `npx tsc --noEmit` to see exact issues
   - Fix all TypeScript errors before building
   - Ensure JSON structure matches interfaces

3. **Memory Issues with Large Content**
   ```
   Error: JavaScript heap out of memory
   ```
   
   **Solution:**
   - Optimize content file sizes
   - Remove unused content
   - Consider lazy loading for large datasets

**Build Troubleshooting Steps:**

1. **Clean Build**
   ```bash
   rm -rf dist/
   rm -rf node_modules/.vite/
   npm run build
   ```

2. **Check Build Logs**
   ```bash
   npm run build 2>&1 | tee build.log
   # Review build.log for specific errors
   ```

3. **Test Build Locally**
   ```bash
   npm run build
   npm run preview
   # Test the built version locally
   ```

---

### Performance Issues

#### Problem: Content loading slowly or causing lag

**Symptoms:**
- Slow page load times
- Browser becomes unresponsive
- High memory usage

**Optimization Strategies:**

1. **Content File Size**
   ```bash
   # Check file sizes
   ls -lh src/content/
   
   # Keep individual files under 50KB
   # Split large content into separate files
   ```

2. **Image References**
   ```json
   // ❌ Avoid large base64 images in JSON
   {
     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
   }

   // ✅ Use image file references instead
   {
     "image": "/images/testimonial-photo.jpg"
   }
   ```

3. **Minimize Nested Objects**
   ```json
   // ❌ Avoid deeply nested structures
   {
     "level1": {
       "level2": {
         "level3": {
           "level4": {
             "data": "value"
           }
         }
       }
     }
   }

   // ✅ Keep structure flat
   {
     "data": "value",
     "category": "level1-level2-level3"
   }
   ```

---

### Git and Version Control Issues

#### Problem: Content changes not being tracked

**Common Issues:**

1. **Files Not Added to Git**
   ```bash
   # Check git status
   git status
   
   # Add content files explicitly
   git add src/content/
   ```

2. **Merge Conflicts in JSON**
   ```bash
   # When merging branches with content changes
   git status
   # Look for conflicts in src/content/ files
   
   # Resolve conflicts manually
   # Ensure resulting JSON is valid
   ```

3. **Lost Content Changes**
   ```bash
   # Check git history for content files
   git log --oneline src/content/
   
   # Restore from previous commit if needed
   git show HEAD~1:src/content/site-content.json > temp.json
   ```

**Best Practices:**
- Always commit content changes on separate branches
- Test content thoroughly before merging
- Use meaningful commit messages for content updates
- Back up content files before major changes

---

### Emergency Recovery Procedures

#### Critical Content Corruption

**If content files become corrupted:**

1. **Stop Development Server**
   ```bash
   # Press Ctrl+C to stop npm run dev
   ```

2. **Assess Damage**
   ```bash
   # Check which files are affected
   git status
   git diff src/content/
   ```

3. **Restore from Git**
   ```bash
   # Restore all content to last known good state
   git checkout HEAD -- src/content/
   
   # Or restore specific file
   git checkout HEAD -- src/content/site-content.json
   ```

4. **Restore from Backup**
   ```bash
   # If you have local backups
   cp src/content-backup-*/site-content.json src/content/
   ```

5. **Rebuild from Scratch**
   ```bash
   # If all else fails, use content templates
   # Check contentManager.ts devHelpers.generateTemplate()
   ```

#### Quick Recovery Commands

```bash
# Create emergency backup
cp -r src/content src/content-emergency-backup-$(date +%Y%m%d-%H%M%S)

# Restore specific file from Git
git show HEAD:src/content/site-content.json > src/content/site-content.json

# Check JSON validity
cat src/content/site-content.json | jq . > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Reset to last commit
git reset --hard HEAD
```

---

## Prevention Strategies

### Content Validation Checklist

Before committing content changes:

- [ ] JSON syntax is valid (use jsonlint.com)
- [ ] All required fields are present
- [ ] Data types match TypeScript interfaces
- [ ] URLs and email addresses are properly formatted
- [ ] No trailing commas in JSON
- [ ] File encoding is UTF-8
- [ ] Content displays correctly in browser
- [ ] No console errors in browser
- [ ] TypeScript compilation passes
- [ ] Build process completes successfully

### Development Environment Setup

**Recommended VS Code Extensions:**
- JSON Language Features
- TypeScript and JavaScript Language Features  
- Error Lens (shows errors inline)
- Prettier (auto-formatting)
- Auto Rename Tag

**VS Code Settings:**
```json
{
  "files.associations": {
    "*.json": "jsonc"
  },
  "json.schemas": [
    {
      "fileMatch": [
        "**/content/*.json"
      ],
      "schema": "./src/types/content-schema.json"
    }
  ]
}
```

### Automated Monitoring

**Set up content validation scripts:**

```javascript
// scripts/validate-content.js
const fs = require('fs');
const path = require('path');

function validateContent() {
  const contentDir = path.join(__dirname, '../src/content');
  const files = ['site-content.json', 'lessons.json', 'testimonials.json'];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
      JSON.parse(content);
      console.log(`✅ ${file} is valid`);
    } catch (error) {
      console.error(`❌ ${file} is invalid:`, error.message);
      process.exit(1);
    }
  });
}

validateContent();
```

**Add to package.json:**
```json
{
  "scripts": {
    "validate-content": "node scripts/validate-content.js"
  }
}
```

---

*Last Updated: August 2025*  
*For immediate assistance with content issues, check the browser console first, then refer to this troubleshooting guide.*