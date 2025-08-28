# Instagram Native Embed Management Guide

This guide shows you how to get embed codes from Instagram and add them to your website.

## 🎯 How It Works

Your website now supports **native Instagram embeds** - the actual interactive Instagram posts that show the real content, videos, and allow users to like/comment directly.

## 📋 Step-by-Step Process

### 1. Get Embed Code from Instagram

1. Go to your Instagram post (web version): https://instagram.com/rrishmusic
2. Click on the post you want to embed
3. Click the three dots (⋯) menu
4. Select **"Embed"**
5. Copy the **complete, original** embed code (including caption)

### 2. Paste Original Embed Code to JSON

Open `/src/data/instagram-posts.json` and add your post with these fields:

**✅ Just paste the original embed code - captions are automatically removed!**

```json
{
  "id": "reel-DNRjyAeu_fR",
  "caption": "Your post caption here",
  "media_url": "/images/placeholder.webp", 
  "media_type": "VIDEO",
  "permalink": "https://www.instagram.com/reel/DNRjyAeu_fR/",
  "timestamp": "2024-12-05T18:30:00Z",
  "username": "rrishmusic",
  "is_performance_related": true,
  "tags": ["livemusic", "performance", "music"],
  "venue": "Your venue name",
  "event_type": "Live Performance",
  "embed_code": "PASTE YOUR COMPLETE ORIGINAL EMBED CODE HERE (with caption)",
  "use_native_embed": true
}
```

### 3. Required Fields for Native Embeds

- **`embed_code`**: The complete, original HTML embed code from Instagram (with caption)
- **`use_native_embed`**: Set to `true` to use native embed instead of card
- **`permalink`**: Instagram URL (used as fallback)

### 4. Automatic Caption Removal ✨

The website automatically removes captions from embed codes, so:
- ✅ **DO**: Paste the complete original embed code from Instagram
- ❌ **DON'T**: Manually remove captions - the code handles this automatically
- 🎯 **Result**: Clean embeds without "A post shared by..." text

## 🔧 JSON Structure Example

Here's what your `instagram-posts.json` should look like:

```json
{
  "posts": [
    {
      "id": "reel-DNRjyAeu_fR",
      "caption": "Latest musical performance - bringing the energy! 🎸🔥",
      "media_url": "/images/instagram/placeholder.webp",
      "media_type": "VIDEO", 
      "permalink": "https://www.instagram.com/reel/DNRjyAeu_fR/",
      "timestamp": "2024-12-05T18:30:00Z",
      "username": "rrishmusic",
      "is_performance_related": true,
      "tags": ["livemusic", "performance", "music"],
      "venue": "Live Performance",
      "event_type": "Live Performance",
      "embed_code": "<blockquote class=\"instagram-media\"...FULL EMBED CODE HERE...</blockquote>",
      "use_native_embed": true
    },
    {
      "id": "another-post",
      "caption": "Another performance...",
      "use_native_embed": false
    }
  ],
  "metadata": {
    "last_updated": "2024-12-05T12:00:00Z",
    "total_posts": 2,
    "username": "rrishmusic", 
    "profile_url": "https://instagram.com/rrishmusic"
  }
}
```

## ✅ Benefits of Native Embeds

1. **Real Content**: Shows actual videos/images from Instagram
2. **Interactive**: Users can like, comment, share directly
3. **Auto-Updates**: If you edit the Instagram post, website updates automatically
4. **Mobile Optimized**: Instagram's responsive design works perfectly
5. **No CORS Issues**: Official Instagram embedding bypasses all restrictions

## 🔄 Fallback System

- If `use_native_embed: true` and `embed_code` exists → Shows native Instagram embed
- If `use_native_embed: false` or no embed code → Shows card-based preview
- If embed fails to load → Shows fallback link to Instagram

## 📝 Adding New Posts

1. Get the embed code from Instagram
2. Add new post object to the `posts` array in JSON file
3. Set `use_native_embed: true`
4. Include the full `embed_code`
5. The website will automatically show your new post

## 🎨 Display Locations

Your Instagram posts appear in:
- **Home Page**: First 6 posts (service boxes → Instagram feed)
- **Performance Page**: First 12 posts (Instagram → other content)

## 💡 Pro Tips

1. **Order Matters**: Posts at the top of the JSON array appear first
2. **Mix and Match**: You can have some posts as native embeds and others as cards
3. **Performance Filter**: Set `is_performance_related: true` for performance posts
4. **Tags**: Use tags for better organization and filtering
5. **Venue Info**: Include venue and event_type for richer content

Your first native embed post is already configured and ready to go!