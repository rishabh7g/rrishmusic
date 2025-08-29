/**
 * Unified Instagram Service Module
 * Comprehensive Instagram integration with JSON-based data management and optional API support
 */

import instagramPostsData from '@/content/instagram-posts.json'

// ============================================================================
// CORE INSTAGRAM INTERFACES
// ============================================================================

export interface InstagramPost {
  id: string
  caption?: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  timestamp: string
  thumbnail_url?: string
  username: string
  is_performance_related?: boolean
  tags?: string[]
  venue?: string
  event_type?: string
  embed_code?: string
  use_native_embed?: boolean
  // Extended properties for API integration
  like_count?: number
  comments_count?: number
  media_product_type?: string
  video_title?: string
  children?: {
    data: Array<{
      id: string
      media_url: string
      media_type: 'IMAGE' | 'VIDEO'
    }>
  }
}

export interface InstagramFeedResponse {
  data: InstagramPost[]
  paging?: {
    cursors?: {
      before?: string
      after?: string
    }
    next?: string
    previous?: string
  }
  error?: {
    message: string
    code: number
  }
}

export interface InstagramProfile {
  id: string
  username: string
  account_type: 'PERSONAL' | 'BUSINESS'
  media_count: number
  followers_count?: number
  follows_count?: number
}

export interface InstagramAPIMetrics {
  impressions?: number
  reach?: number
  engagement?: number
  profile_visits?: number
}

export interface InstagramDataFile {
  posts: InstagramPost[]
  metadata: {
    last_updated: string
    total_posts: number
    username: string
    profile_url: string
  }
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

interface InstagramAPIConfig {
  accessToken?: string
  clientId?: string
  clientSecret?: string
  baseUrl: string
  version: string
  rateLimit: {
    requestsPerHour: number
    burstLimit: number
  }
}

const DEFAULT_API_CONFIG: InstagramAPIConfig = {
  baseUrl: 'https://graph.instagram.com',
  version: 'v18.0',
  rateLimit: {
    requestsPerHour: 200,
    burstLimit: 50,
  },
}

// Performance-related keywords for content filtering
const PERFORMANCE_KEYWORDS = [
  'performance',
  'live',
  'gig',
  'concert',
  'stage',
  'venue',
  'wedding',
  'corporate',
  'band',
  'acoustic',
  'electric',
  'guitar',
  'music',
  'show',
  'event',
  'festival',
  'blues',
  'rock',
  'jazz',
  'session',
  'recording',
]

const VENUE_KEYWORDS = [
  'venue',
  'pub',
  'bar',
  'club',
  'restaurant',
  'hotel',
  'winery',
  'brewery',
  'cafe',
  'hall',
  'center',
  'theatre',
  'theater',
]

// ============================================================================
// RATE LIMITING SYSTEM
// ============================================================================

class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests: number
  private readonly timeWindow: number

  constructor(maxRequests: number = 200, timeWindowMs: number = 3600000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now()

    // Remove requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow)

    return this.requests.length < this.maxRequests
  }

  recordRequest(): void {
    this.requests.push(Date.now())
  }

  getStatus(): { remainingRequests: number; resetTime: number } {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)

    const remainingRequests = Math.max(
      0,
      this.maxRequests - this.requests.length
    )
    const oldestRequest = this.requests[0] || now
    const resetTime = oldestRequest + this.timeWindow

    return { remainingRequests, resetTime }
  }
}

// ============================================================================
// MAIN INSTAGRAM SERVICE CLASS
// ============================================================================

class InstagramService {
  private data: InstagramDataFile
  private config: InstagramAPIConfig
  private rateLimiter: RateLimiter
  private useAPI: boolean = false

  constructor(config: Partial<InstagramAPIConfig> = {}) {
    this.data = instagramPostsData as InstagramDataFile
    this.config = { ...DEFAULT_API_CONFIG, ...config }
    this.rateLimiter = new RateLimiter(
      this.config.rateLimit.requestsPerHour,
      3600000 // 1 hour in milliseconds
    )

    // Enable API mode if access token is provided
    this.useAPI = !!this.config.accessToken
  }

  // ============================================================================
  // JSON DATA METHODS
  // ============================================================================

  /**
   * Get all posts from JSON data
   */
  getAllPosts(): InstagramPost[] {
    return [...this.data.posts]
  }

  /**
   * Get performance-related posts from JSON data
   */
  getPerformancePosts(limit?: number): InstagramPost[] {
    const performancePosts = this.data.posts.filter(
      post => post.is_performance_related
    )

    if (limit) {
      return performancePosts.slice(0, limit)
    }

    return performancePosts
  }

  /**
   * Get posts by venue from JSON data
   */
  getPostsByVenue(venue: string, limit?: number): InstagramPost[] {
    const venuePosts = this.data.posts.filter(post =>
      post.venue?.toLowerCase().includes(venue.toLowerCase())
    )

    if (limit) {
      return venuePosts.slice(0, limit)
    }

    return venuePosts
  }

  /**
   * Get recent posts from JSON data
   */
  getRecentPosts(limit: number = 6): InstagramPost[] {
    return [...this.data.posts]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit)
  }

  /**
   * Get posts by tags from JSON data
   */
  getPostsByTags(tags: string[], limit?: number): InstagramPost[] {
    const taggedPosts = this.data.posts.filter(post => {
      if (!post.tags || post.tags.length === 0) return false
      return tags.some(tag =>
        post.tags!.some(postTag =>
          postTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    })

    if (limit) {
      return taggedPosts.slice(0, limit)
    }

    return taggedPosts
  }

  /**
   * Search posts by caption or tags from JSON data
   */
  searchPosts(query: string, limit?: number): InstagramPost[] {
    const lowerQuery = query.toLowerCase()

    const matchingPosts = this.data.posts.filter(post => {
      // Search in caption
      if (post.caption?.toLowerCase().includes(lowerQuery)) {
        return true
      }

      // Search in tags
      if (post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true
      }

      // Search in venue
      if (post.venue?.toLowerCase().includes(lowerQuery)) {
        return true
      }

      return false
    })

    if (limit) {
      return matchingPosts.slice(0, limit)
    }

    return matchingPosts
  }

  /**
   * Get metadata from JSON data
   */
  getMetadata(): InstagramDataFile['metadata'] {
    return { ...this.data.metadata }
  }

  // ============================================================================
  // API METHODS (Optional Enhancement)
  // ============================================================================

  /**
   * Enable API mode with access token
   */
  enableAPI(accessToken: string): void {
    this.config.accessToken = accessToken
    this.useAPI = true
  }

  /**
   * Disable API mode (use JSON only)
   */
  disableAPI(): void {
    this.useAPI = false
  }

  /**
   * Get API status
   */
  getAPIStatus(): {
    enabled: boolean
    rateLimitStatus: { remainingRequests: number; resetTime: number }
    hasToken: boolean
  } {
    return {
      enabled: this.useAPI,
      rateLimitStatus: this.rateLimiter.getStatus(),
      hasToken: !!this.config.accessToken,
    }
  }

  /**
   * Fetch fresh data from Instagram API (if enabled)
   */
  async fetchFromAPI(limit: number = 25): Promise<InstagramPost[] | null> {
    if (!this.useAPI || !this.config.accessToken) {
      console.warn('Instagram API not enabled or token missing')
      return null
    }

    try {
      // Check rate limit
      const canMakeRequest = await this.rateLimiter.checkLimit()
      if (!canMakeRequest) {
        console.warn('Instagram API rate limit exceeded')
        return null
      }

      const url = `${this.config.baseUrl}/me/media?fields=id,caption,media_url,media_type,permalink,timestamp,thumbnail_url&access_token=${this.config.accessToken}&limit=${limit}`

      this.rateLimiter.recordRequest()

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message}`)
      }

      // Process and enhance the API data
      const processedPosts = await this.processAPIData(data.data || [])

      return processedPosts
    } catch (error) {
      console.error('Error fetching from Instagram API:', error)
      return null
    }
  }

  /**
   * Get user profile from API (if enabled)
   */
  async fetchProfile(): Promise<InstagramProfile | null> {
    if (!this.useAPI || !this.config.accessToken) {
      return null
    }

    try {
      const canMakeRequest = await this.rateLimiter.checkLimit()
      if (!canMakeRequest) {
        console.warn('Instagram API rate limit exceeded')
        return null
      }

      const url = `${this.config.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${this.config.accessToken}`

      this.rateLimiter.recordRequest()

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message}`)
      }

      return data as InstagramProfile
    } catch (error) {
      console.error('Error fetching Instagram profile:', error)
      return null
    }
  }

  /**
   * Process API data to match our interface
   */
  private async processAPIData(apiPosts: any[]): Promise<InstagramPost[]> {
    return apiPosts.map(post => {
      const processedPost: InstagramPost = {
        id: post.id,
        caption: post.caption || '',
        media_url: post.media_url,
        media_type: post.media_type,
        permalink: post.permalink,
        timestamp: post.timestamp,
        thumbnail_url: post.thumbnail_url,
        username: 'rrish_music', // Default username
      }

      // Auto-detect performance-related content
      processedPost.is_performance_related =
        this.isPerformanceRelated(processedPost)

      // Extract tags from caption
      if (processedPost.caption) {
        processedPost.tags = this.extractHashtags(processedPost.caption)

        // Try to extract venue information
        processedPost.venue = this.extractVenue(processedPost.caption)

        // Try to determine event type
        processedPost.event_type = this.determineEventType(
          processedPost.caption
        )
      }

      return processedPost
    })
  }

  // ============================================================================
  // CONTENT ANALYSIS HELPERS
  // ============================================================================

  /**
   * Determine if a post is performance-related
   */
  private isPerformanceRelated(post: InstagramPost): boolean {
    const text =
      `${post.caption || ''} ${post.tags?.join(' ') || ''}`.toLowerCase()

    return PERFORMANCE_KEYWORDS.some(keyword => text.includes(keyword))
  }

  /**
   * Extract hashtags from caption
   */
  private extractHashtags(caption: string): string[] {
    const hashtagRegex = /#[\w\d_]+/g
    const matches = caption.match(hashtagRegex)
    return matches ? matches.map(tag => tag.substring(1)) : []
  }

  /**
   * Try to extract venue information from caption
   */
  private extractVenue(caption: string): string | undefined {
    // Look for @ mentions or venue keywords
    const mentionRegex = /@[\w\d_.]+/g
    const mentions = caption.match(mentionRegex)

    if (mentions && mentions.length > 0) {
      return mentions[0].substring(1).replace(/[_.]/g, ' ')
    }

    // Look for venue keywords in context
    const words = caption.toLowerCase().split(/\s+/)
    for (let i = 0; i < words.length - 1; i++) {
      if (VENUE_KEYWORDS.includes(words[i])) {
        // Return the next word(s) as potential venue name
        return words.slice(i, Math.min(i + 3, words.length)).join(' ')
      }
    }

    return undefined
  }

  /**
   * Determine event type from caption
   */
  private determineEventType(caption: string): string | undefined {
    const lowerCaption = caption.toLowerCase()

    if (lowerCaption.includes('wedding')) return 'wedding'
    if (lowerCaption.includes('corporate')) return 'corporate'
    if (
      lowerCaption.includes('private') ||
      lowerCaption.includes('birthday') ||
      lowerCaption.includes('anniversary')
    )
      return 'private'
    if (lowerCaption.includes('festival')) return 'festival'
    if (
      lowerCaption.includes('pub') ||
      lowerCaption.includes('bar') ||
      lowerCaption.includes('venue')
    )
      return 'venue'

    return undefined
  }

  // ============================================================================
  // HYBRID MODE METHODS
  // ============================================================================

  /**
   * Get best available posts (API if available, fallback to JSON)
   */
  async getBestPosts(limit?: number): Promise<InstagramPost[]> {
    if (this.useAPI) {
      const apiPosts = await this.fetchFromAPI(limit)
      if (apiPosts && apiPosts.length > 0) {
        return apiPosts
      }
    }

    // Fallback to JSON data
    return limit ? this.getAllPosts().slice(0, limit) : this.getAllPosts()
  }

  /**
   * Get best performance posts (API if available, fallback to JSON)
   */
  async getBestPerformancePosts(limit?: number): Promise<InstagramPost[]> {
    if (this.useAPI) {
      const apiPosts = await this.fetchFromAPI(50) // Get more to filter
      if (apiPosts && apiPosts.length > 0) {
        const performancePosts = apiPosts.filter(
          post => post.is_performance_related
        )
        return limit ? performancePosts.slice(0, limit) : performancePosts
      }
    }

    // Fallback to JSON data
    return this.getPerformancePosts(limit)
  }

  // ============================================================================
  // EMBED GENERATION
  // ============================================================================

  /**
   * Generate Instagram embed code for a post
   */
  generateEmbedCode(
    post: InstagramPost,
    options: {
      width?: number
      height?: number
      hideCaption?: boolean
    } = {}
  ): string {
    const { width = 540, height = 540, hideCaption = false } = options

    if (post.embed_code) {
      return post.embed_code
    }

    // Generate basic embed code
    const embedUrl = `${post.permalink}embed${hideCaption ? '/captioned' : ''}`

    return `<blockquote class="instagram-media" data-instgrm-permalink="${post.permalink}" data-instgrm-version="14" style="max-width:${width}px; min-width:326px; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><a href="${post.permalink}" target="_blank" rel="noopener"><div style="padding:16px;"><div style="display:flex; align-items:center;"><div style="margin-left:8px;"><div style="font-weight:600; margin-bottom:4px;">${post.username}</div></div></div><div style="padding:19% 0;"></div><div style="display:block; height:50px; margin:0 auto 12px; width:50px;"></div><div style="padding-top:8px;"><div style="color:#3897f0; font-weight:600; text-align:center;">${post.caption?.substring(0, 50) || 'View on Instagram'}</div></div></div></a></blockquote><script async src="//www.instagram.com/embed.js"></script>`
  }

  /**
   * Check if native embed should be used
   */
  shouldUseNativeEmbed(post: InstagramPost): boolean {
    return post.use_native_embed === true
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get content statistics
   */
  getStatistics(): {
    totalPosts: number
    performancePosts: number
    mediaTypes: Record<string, number>
    lastUpdated: string
  } {
    const allPosts = this.getAllPosts()
    const performancePosts = this.getPerformancePosts()

    const mediaTypes = allPosts.reduce(
      (acc, post) => {
        acc[post.media_type] = (acc[post.media_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalPosts: allPosts.length,
      performancePosts: performancePosts.length,
      mediaTypes,
      lastUpdated: this.data.metadata.last_updated,
    }
  }

  /**
   * Validate post structure
   */
  validatePost(post: any): post is InstagramPost {
    return (
      typeof post === 'object' &&
      typeof post.id === 'string' &&
      typeof post.media_url === 'string' &&
      typeof post.media_type === 'string' &&
      ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(post.media_type) &&
      typeof post.permalink === 'string' &&
      typeof post.timestamp === 'string'
    )
  }

  /**
   * Filter posts by date range
   */
  getPostsByDateRange(startDate: Date, endDate: Date): InstagramPost[] {
    return this.getAllPosts().filter(post => {
      const postDate = new Date(post.timestamp)
      return postDate >= startDate && postDate <= endDate
    })
  }

  /**
   * Get unique venues from all posts
   */
  getUniqueVenues(): string[] {
    const venues = this.getAllPosts()
      .map(post => post.venue)
      .filter((venue): venue is string => !!venue)

    return [...new Set(venues)]
  }

  /**
   * Get posts grouped by month
   */
  getPostsByMonth(): Record<string, InstagramPost[]> {
    const posts = this.getAllPosts()
    const grouped: Record<string, InstagramPost[]> = {}

    posts.forEach(post => {
      const date = new Date(post.timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }

      grouped[monthKey].push(post)
    })

    return grouped
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const instagramService = new InstagramService()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get performance-related Instagram posts
 */
export const getPerformancePosts = (limit?: number): InstagramPost[] => {
  return instagramService.getPerformancePosts(limit)
}

/**
 * Get recent Instagram posts
 */
export const getRecentPosts = (limit: number = 6): InstagramPost[] => {
  return instagramService.getRecentPosts(limit)
}

/**
 * Search Instagram posts
 */
export const searchInstagramPosts = (
  query: string,
  limit?: number
): InstagramPost[] => {
  return instagramService.searchPosts(query, limit)
}

/**
 * Get Instagram content statistics
 */
export const getInstagramStats = () => {
  return instagramService.getStatistics()
}

/**
 * Get best available posts (hybrid mode)
 */
export const getBestInstagramPosts = async (
  limit?: number
): Promise<InstagramPost[]> => {
  return instagramService.getBestPosts(limit)
}

/**
 * Get best performance posts (hybrid mode)
 */
export const getBestPerformancePosts = async (
  limit?: number
): Promise<InstagramPost[]> => {
  return instagramService.getBestPerformancePosts(limit)
}

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// Export for backward compatibility
export default instagramService

// Legacy function exports for existing code
export { InstagramService, PERFORMANCE_KEYWORDS, VENUE_KEYWORDS, RateLimiter }

/**
 * Instagram Data Service Class (for backward compatibility)
 */
export class InstagramDataService {
  constructor() {
    console.warn(
      'InstagramDataService is deprecated. Use instagramService instead.'
    )
  }

  getAllPosts(): InstagramPost[] {
    return instagramService.getAllPosts()
  }

  getPerformancePosts(limit?: number): InstagramPost[] {
    return instagramService.getPerformancePosts(limit)
  }

  getRecentPosts(limit: number = 6): InstagramPost[] {
    return instagramService.getRecentPosts(limit)
  }

  searchPosts(query: string, limit?: number): InstagramPost[] {
    return instagramService.searchPosts(query, limit)
  }

  getMetadata(): InstagramDataFile['metadata'] {
    return instagramService.getMetadata()
  }
}

export const instagramDataService = new InstagramDataService()
