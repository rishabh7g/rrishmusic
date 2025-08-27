/**
 * Instagram Service Module
 * 
 * Handles Instagram content integration with JSON-based data management
 * Features: Content filtering, caching, error handling, and manual content curation
 */

import { instagramDataService } from './instagramData';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
  username: string;
  is_performance_related?: boolean;
  tags?: string[];
  venue?: string;
  event_type?: string;
}

export interface InstagramFeedResponse {
  data: InstagramPost[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
    previous?: string;
  };
  error?: {
    message: string;
    code: number;
  };
}

// Performance-related keywords for content filtering
const PERFORMANCE_KEYWORDS = [
  'performance', 'live', 'gig', 'concert', 'stage', 'venue', 
  'blues', 'guitar', 'music', 'acoustic', 'electric', 'band',
  'wedding', 'corporate', 'event', 'rehearsal', 'practice',
  'melbourne', 'show', 'playing', 'singing'
];

// Fallback content for API failures or development
const FALLBACK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'fallback-1',
    caption: 'Blues session at Melbourne venue last weekend. Great crowd and amazing energy! 🎸 #livemusic #blues #melbourne',
    media_url: '/images/instagram/blues-performance-fallback.webp',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/rrishmusic',
    timestamp: '2024-01-15T18:30:00Z',
    username: 'rrishmusic',
    is_performance_related: true
  },
  {
    id: 'fallback-2',
    caption: 'Acoustic set for a beautiful wedding ceremony. Congratulations to the happy couple! 💍🎵 #weddingmusic #acoustic #liveperformance',
    media_url: '/images/instagram/wedding-performance-fallback.webp',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/rrishmusic',
    timestamp: '2024-01-10T14:20:00Z',
    username: 'rrishmusic',
    is_performance_related: true
  },
  {
    id: 'fallback-3',
    caption: 'Corporate event entertainment in Melbourne CBD. Music creates the perfect networking atmosphere. 🏢🎶 #corporate #livemusic #networking',
    media_url: '/images/instagram/corporate-event-fallback.webp',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/rrishmusic',
    timestamp: '2024-01-05T19:45:00Z',
    username: 'rrishmusic',
    is_performance_related: true
  },
  {
    id: 'fallback-4',
    caption: 'Behind the scenes: Setting up for tonight\'s performance. The calm before the musical storm! 🎸⚡ #behindthescenes #setup #preparation',
    media_url: '/images/instagram/behind-scenes-fallback.webp',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/rrishmusic',
    timestamp: '2024-01-01T16:30:00Z',
    username: 'rrishmusic',
    is_performance_related: true
  }
];

/**
 * Instagram Service Class
 * Handles JSON-based content management and caching
 */
class InstagramService {
  private cache: Map<string, { data: InstagramPost[]; timestamp: number }> = new Map();
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private readonly useJsonData = true; // Primary data source is now JSON

  constructor() {
    // Using JSON-based data management for secure, manual content curation
  }

  /**
   * Check if content is performance-related based on caption
   */
  private isPerformanceRelated(post: InstagramPost): boolean {
    if (post.is_performance_related !== undefined) {
      return post.is_performance_related;
    }

    const caption = (post.caption || '').toLowerCase();
    return PERFORMANCE_KEYWORDS.some(keyword => 
      caption.includes(keyword.toLowerCase())
    );
  }

  /**
   * Filter posts for performance-related content
   */
  private filterPerformancePosts(posts: InstagramPost[]): InstagramPost[] {
    return posts.filter(post => this.isPerformanceRelated(post));
  }

  /**
   * Get cached data if valid
   */
  private getCachedData(key: string): InstagramPost[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache data with timestamp
   */
  private setCachedData(key: string, data: InstagramPost[]): void {
    this.cache.set(key, {
      data: [...data],
      timestamp: Date.now()
    });

    // Store in localStorage for persistence (optional)
    try {
      localStorage.setItem(`instagram_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {
      // Ignore localStorage errors (privacy mode, quota exceeded, etc.)
    }
  }

  /**
   * Load cached data from localStorage on app start
   */
  private loadCachedFromStorage(key: string): InstagramPost[] | null {
    try {
      const stored = localStorage.getItem(`instagram_cache_${key}`);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const isExpired = Date.now() - parsed.timestamp > this.cacheTimeout;
      
      if (isExpired) {
        localStorage.removeItem(`instagram_cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  }

  /**
   * Fetch Instagram posts from API
   */
  private async fetchFromAPI(limit: number = 12): Promise<InstagramPost[]> {
    if (!this.accessToken) {
      throw new Error('Instagram access token not configured');
    }

    const fields = 'id,caption,media_url,media_type,permalink,timestamp,thumbnail_url,username';
    const url = `${this.baseUrl}/me/media?fields=${fields}&limit=${limit}&access_token=${this.accessToken}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data: InstagramFeedResponse = await response.json();
    
    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }

    return data.data || [];
  }

  /**
   * Get performance-related Instagram posts from JSON data
   */
  async getPerformancePosts(limit: number = 8): Promise<{
    posts: InstagramPost[];
    fromCache: boolean;
    error?: string;
  }> {
    const cacheKey = `performance_posts_${limit}`;
    
    try {
      // Try cache first
      const cachedPosts = this.getCachedData(cacheKey);
      if (cachedPosts && cachedPosts.length > 0) {
        return {
          posts: cachedPosts.slice(0, limit),
          fromCache: true
        };
      }

      // Load from JSON data service
      const jsonPosts = instagramDataService.getRecentPosts(limit);
      
      // Cache the results
      this.setCachedData(cacheKey, jsonPosts);
      
      return {
        posts: jsonPosts,
        fromCache: false
      };

    } catch (error) {
      // Return fallback content on any error
      const fallbackPosts = FALLBACK_INSTAGRAM_POSTS.slice(0, limit);
      
      return {
        posts: fallbackPosts,
        fromCache: false,
        error: error instanceof Error ? error.message : 'Failed to load Instagram content from JSON'
      };
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('instagram_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Check if service is using fallback content
   */
  isUsingFallback(): boolean {
    return !this.accessToken;
  }
}

// Export singleton instance
export const instagramService = new InstagramService();
export default instagramService;