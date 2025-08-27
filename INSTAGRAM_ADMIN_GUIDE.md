# 📸 Instagram Content Management Guide

## Overview
Your website now uses a simple JSON-based system to manage Instagram content. No API keys required - you have full control over what appears on your site!

## 📁 File Location
**Main file**: `/src/data/instagram-posts.json`

## 🚀 How to Add New Instagram Posts

### Step 1: Get Your Instagram Post Information
For each Instagram post you want to add, gather:

1. **Post URL**: Copy the Instagram post URL (e.g., `https://instagram.com/p/ABC123/`)
2. **Image/Video URL**: Right-click on the image/video → "Copy image address"
3. **Caption**: Copy the caption text
4. **Post Date**: Note when you posted it

### Step 2: Add to JSON File
Open `/src/data/instagram-posts.json` and add a new post object to the `"posts"` array:

```json
{
  "id": "post-7",
  "caption": "Your Instagram caption here with emojis! 🎸 #hashtags #music",
  "media_url": "PASTE_YOUR_MEDIA_URL_HERE",
  "media_type": "IMAGE",
  "permalink": "https://instagram.com/p/YOUR_POST_ID/",
  "timestamp": "2024-01-20T20:00:00Z",
  "username": "rrishmusic",
  "is_performance_related": true,
  "tags": ["music", "performance", "live"],
  "venue": "Your Venue Name",
  "event_type": "Live Performance"
}
```

### Step 3: Update Metadata
Update the metadata section at the bottom:
```json
"metadata": {
  "last_updated": "2024-01-20T10:00:00Z",
  "total_posts": 7,
  "username": "rrishmusic", 
  "profile_url": "https://instagram.com/rrishmusic"
}
```

## 📝 Field Explanations

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier | `"post-7"` |
| `caption` | Your Instagram caption | `"Great show tonight! 🎸"` |
| `media_url` | Direct link to image/video | Instagram media URL |
| `media_type` | Type of content | `"IMAGE"` or `"VIDEO"` |
| `permalink` | Instagram post URL | `"https://instagram.com/p/ABC123/"` |
| `timestamp` | When you posted (ISO format) | `"2024-01-20T20:00:00Z"` |
| `is_performance_related` | Show on performance page? | `true` or `false` |
| `tags` | Hashtags/keywords (array) | `["music", "live", "blues"]` |
| `venue` | Where it happened | `"Melbourne Blues Club"` |
| `event_type` | Type of event | `"Live Performance"`, `"Wedding"`, `"Corporate Event"` |

## 🎯 Content Categories

### Performance Content (`is_performance_related: true`)
- Live performances
- Behind the scenes
- Setup/soundcheck
- Band collaborations
- Venue performances

### Teaching Content (`is_performance_related: false`)  
- Student lessons
- Practice sessions
- Music theory examples
- Teaching moments

## 🔧 Easy Media URL Collection

### Method 1: Right-click Copy (Easiest)
1. Go to your Instagram post
2. Right-click on the image/video
3. Select "Copy image address" or "Copy video address"
4. Paste into `media_url` field

### Method 2: Instagram Post URL Pattern
Most Instagram media URLs follow this pattern:
```
https://instagram.com/p/POST_ID/media/?size=l
```
Replace `POST_ID` with the ID from your post URL.

## 📋 Quick Template for New Posts

```json
{
  "id": "post-X",
  "caption": "",
  "media_url": "",
  "media_type": "IMAGE",
  "permalink": "",
  "timestamp": "2024-01-20T20:00:00Z",
  "username": "rrishmusic",
  "is_performance_related": true,
  "tags": [],
  "venue": "",
  "event_type": ""
}
```

## 🚨 Important Notes

### File Safety
- Always make a backup before editing
- Use a JSON validator to check syntax
- Keep the file structure intact

### Post Ordering
- Posts appear in reverse chronological order (newest first)
- Update `timestamp` accurately for proper ordering

### Image Quality
- Instagram serves different sizes - use `?size=l` for large images
- Videos may need different URL format

## ✅ Testing Your Changes

After editing the JSON file:
1. Save the file
2. Refresh your website
3. Check Home page and Performance page for new content
4. Verify images/videos load correctly
5. Check that captions and links work

## 🎨 Content Strategy Tips

### What Works Well
- High-quality performance photos
- Behind-the-scenes content
- Student achievement moments  
- Venue atmosphere shots
- Equipment/setup photos

### Optimal Mix
- 60% Live performance content
- 25% Teaching/education content
- 15% Behind-the-scenes/personal content

## 🔄 Regular Updates

**Weekly**: Add 1-2 new posts from recent performances
**Monthly**: Review and curate best content
**Quarterly**: Clean up old posts if needed

## 🆘 Troubleshooting

### Images not loading?
- Check the `media_url` - try copying it again
- Ensure the Instagram post is public
- Try adding `?size=l` to the URL

### JSON errors?
- Use [JSONLint.com](https://jsonlint.com) to validate
- Check for missing commas or quotes
- Ensure proper array structure

### Content not appearing?
- Check `is_performance_related` setting
- Verify `timestamp` format
- Clear browser cache

## 📞 Support

If you need help updating content or encounter issues, the JSON file is easy to restore from git history if something goes wrong!

---

**Remember**: This system gives you complete control over your Instagram content display without needing any API credentials or external dependencies! 🎉