# Content Management Quick Reference

## File Locations

```
/Users/rrish/Documents/code/rrishmusic/src/content/
├── site-content.json      # Main website content
├── lessons.json          # Lesson packages and pricing  
└── testimonials.json     # Student testimonials
```

---

## Common Tasks

### Update Lesson Prices

**File:** `src/content/lessons.json`

```json
{
  "packages": [
    {
      "id": "package-4",
      "name": "4-Lesson Package", 
      "price": 190,  ← Change this number
      "discount": 5  ← Percentage savings
    }
  ]
}
```

### Add New Testimonial

**File:** `src/content/testimonials.json`

```json
[
  {
    "id": "firstname-l",
    "name": "First Name L.", 
    "text": "Testimonial text here...",
    "rating": 5,
    "instrument": "Guitar",
    "level": "beginner",
    "featured": true
  }
]
```

### Update Contact Information

**File:** `src/content/site-content.json`

```json
{
  "contact": {
    "methods": [
      {
        "type": "email",
        "label": "Email",
        "value": "new@email.com",  ← Update email
        "href": "mailto:new@email.com",  ← Update href too
        "primary": true
      }
    ],
    "location": "New Location"  ← Update location
  }
}
```

### Change Website Text

**File:** `src/content/site-content.json`

```json
{
  "hero": {
    "title": "New Title",  ← Main heading
    "subtitle": "New description"  ← Subheading
  },
  "about": {
    "content": [
      "First paragraph",  ← Each item is a paragraph
      "Second paragraph"
    ]
  }
}
```

### Update SEO Settings

**File:** `src/content/site-content.json`

```json
{
  "seo": {
    "defaultTitle": "New Page Title",
    "defaultDescription": "New description for search engines",
    "defaultKeywords": "new, keywords, here"
  }
}
```

---

## Data Types Reference

### Required Formats

| Field | Type | Example | Notes |
|-------|------|---------|--------|
| `price` | Number | `190` | No quotes, no currency symbols |
| `rating` | Number | `5` | Must be 1-5 |
| `featured` | Boolean | `true` or `false` | No quotes |
| `sessions` | Number | `4` | Use `0` for unlimited |
| `discount` | Number | `5` | Percentage (5 = 5% off) |

### Contact Method Types

| Type | Example |
|------|---------|
| `"email"` | `"mailto:hello@example.com"` |
| `"instagram"` | `"https://instagram.com/username"` |
| `"phone"` | `"tel:+61123456789"` |

### Testimonial Levels

- `"beginner"`
- `"intermediate"` 
- `"advanced"`

---

## Quick Validation

### JSON Syntax Checklist

✅ **Valid JSON:**
```json
{
  "title": "Hello",
  "subtitle": "World"
}
```

❌ **Invalid JSON:**
```json
{
  "title": "Hello"      ← Missing comma
  "subtitle": "World",  ← Trailing comma not allowed
}
```

### Common Mistakes

1. **Missing Commas Between Properties**
2. **Trailing Commas at End of Objects**
3. **Single Quotes Instead of Double Quotes**
4. **Numbers as Strings** (use `5` not `"5"`)
5. **Missing Required Fields**

---

## Emergency Commands

### Backup Content
```bash
cp -r src/content src/content-backup-$(date +%Y%m%d)
```

### Restore from Git
```bash
git checkout HEAD -- src/content/
```

### Validate JSON
```bash
cat src/content/site-content.json | python -m json.tool
```

### Check File Status
```bash
git status src/content/
```

---

## Development Server

### Start/Stop Server
```bash
npm run dev          # Start development server
# Press Ctrl+C       # Stop server
```

### Check Server Status
- Look for: `Local: http://localhost:5173`
- Open browser to that URL
- Changes appear automatically when you save

---

## Troubleshooting

### Changes Not Appearing?

1. ✅ Check development server is running
2. ✅ Refresh browser (Ctrl+F5 or Cmd+Shift+R)  
3. ✅ Check browser console for errors (F12)
4. ✅ Validate JSON syntax

### JSON Errors?

1. ✅ Copy content to jsonlint.com
2. ✅ Fix syntax errors shown
3. ✅ Check for missing commas
4. ✅ Remove trailing commas

### Build Failing?

1. ✅ Run `npm run build` to see exact error
2. ✅ Fix any TypeScript errors
3. ✅ Ensure all files are valid JSON
4. ✅ Check import paths are correct

---

## File Templates

### New Lesson Package Template
```json
{
  "id": "package-name",
  "name": "Package Display Name", 
  "sessions": 4,
  "price": 200,
  "discount": 10,
  "popular": false,
  "features": [
    "Feature 1",
    "Feature 2", 
    "Feature 3"
  ],
  "description": "Package description"
}
```

### New Testimonial Template
```json
{
  "id": "firstname-l",
  "name": "First Name L.",
  "text": "Student testimonial text here...",
  "rating": 5,
  "instrument": "Guitar", 
  "level": "beginner",
  "featured": true
}
```

### New Contact Method Template
```json
{
  "type": "email",
  "label": "Display Label",
  "value": "display@value.com",
  "href": "mailto:display@value.com", 
  "primary": false
}
```

---

*For detailed instructions, see [CONTENT_MANAGEMENT.md](/Users/rrish/Documents/code/rrishmusic/docs/CONTENT_MANAGEMENT.md)*

*For troubleshooting, see [CONTENT_TROUBLESHOOTING.md](/Users/rrish/Documents/code/rrishmusic/docs/CONTENT_TROUBLESHOOTING.md)*