/**
 * SEO utility functions for RrishMusic
 */

/**
 * Utility function to generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength = 155): string {
  // Remove HTML tags and extra whitespace
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Truncate at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Utility function to validate and format structured data
 */
export function validateStructuredData(data: Record<string, unknown>): boolean {
  // Basic validation for structured data
  if (!data['@context'] || !data['@type']) {
    console.warn('Structured data missing required @context or @type');
    return false;
  }

  // Additional validation could be added here
  return true;
}