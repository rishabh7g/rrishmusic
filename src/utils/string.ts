/**
 * String utility functions for text formatting and manipulation
 */

/**
 * Pluralize a word based on count
 * @param count - Number to check for pluralization
 * @param singular - Singular form of the word
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Properly pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

/**
 * Get full pluralized phrase with number
 * @param count - Number to display
 * @param singular - Singular form of the word
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Full phrase like "1 year" or "2 years"
 */
export function pluralizeWithCount(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number, ellipsis = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + ellipsis;
}