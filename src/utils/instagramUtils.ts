/**
 * Instagram Utilities
 * 
 * Utility functions for processing Instagram embed codes
 */

/**
 * Processes Instagram embed code for display
 * Currently just returns the original embed code
 */
export function processInstagramEmbed(embedCode: string): string {
  return embedCode;
}

/**
 * Validates if a string is a valid Instagram embed code
 */
export function isValidInstagramEmbed(embedCode: string): boolean {
  return (
    embedCode.includes('instagram-media') &&
    embedCode.includes('blockquote') &&
    embedCode.includes('instagram.com')
  );
}

/**
 * Extracts Instagram post URL from embed code
 */
export function extractInstagramUrl(embedCode: string): string | null {
  const urlMatch = embedCode.match(/data-instgrm-permalink="([^"]+)"/);
  if (urlMatch && urlMatch[1]) {
    // Decode HTML entities
    return urlMatch[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
  }
  return null;
}

/**
 * Extracts Instagram post ID from embed code or URL
 */
export function extractInstagramPostId(embedCodeOrUrl: string): string | null {
  let url = embedCodeOrUrl;
  
  // If it's an embed code, extract the URL first
  if (embedCodeOrUrl.includes('instagram-media')) {
    const extractedUrl = extractInstagramUrl(embedCodeOrUrl);
    if (!extractedUrl) return null;
    url = extractedUrl;
  }
  
  // Extract post ID from URL patterns like:
  // https://www.instagram.com/p/ABC123/
  // https://www.instagram.com/reel/ABC123/
  const idMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return idMatch ? idMatch[1] : null;
}