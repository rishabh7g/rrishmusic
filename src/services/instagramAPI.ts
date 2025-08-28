/**
 * Instagram API Service Module
 *
 * Enhanced Instagram Basic Display API integration with advanced features
 * Features: Real-time API integration, rate limiting, webhook support, and analytics
 */
import { InstagramPost } from './instagram'

// API Configuration
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

// Extended Instagram API Response Types
export interface InstagramMediaDetails extends InstagramPost {
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
  website_clicks?: number
}

// Rate Limiting Interface
interface RateLimitState {
  requests: number
  resetTime: number
  burstRequests: number
  burstResetTime: number
}

// API Response Types
interface APIResponse<T = Record<string, unknown>> {
  data?: T
  error?: {
    message: string
    code: number
  }
}

interface MediaResponse {
  data: InstagramMediaDetails[]
  paging?: {
    cursors: {
      before?: string
      after?: string
    }
    next?: string
    previous?: string
  }
}

interface InsightsResponse {
  data: Array<{
    name: string
    values: Array<{ value: number }>
  }>
}

// API Error Types
export class InstagramAPIError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: 'auth' | 'rate_limit' | 'network' | 'api' = 'api'
  ) {
    super(message)
    this.name = 'InstagramAPIError'
  }
}

/**
 * Enhanced Instagram API Service Class
 */
export class InstagramAPIService {
  private config: InstagramAPIConfig
  private rateLimit: RateLimitState
  private requestQueue: Array<() => Promise<unknown>> = []
  private isProcessingQueue = false

  constructor(config?: Partial<InstagramAPIConfig>) {
    this.config = {
      accessToken:
        process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || config?.accessToken,
      clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID || config?.clientId,
      clientSecret:
        process.env.REACT_APP_INSTAGRAM_CLIENT_SECRET || config?.clientSecret,
      baseUrl: 'https://graph.instagram.com',
      version: 'v18.0',
      rateLimit: {
        requestsPerHour: 200,
        burstLimit: 25,
      },
      ...config,
    }

    this.rateLimit = {
      requests: 0,
      resetTime: Date.now() + 3600000, // 1 hour from now
      burstRequests: 0,
      burstResetTime: Date.now() + 300000, // 5 minutes from now
    }

    // Restore rate limit state from localStorage
    this.loadRateLimitState()
  }

  /**
   * Save rate limit state to localStorage
   */
  private saveRateLimitState(): void {
    try {
      localStorage.setItem(
        'instagram_rate_limit',
        JSON.stringify({
          ...this.rateLimit,
          timestamp: Date.now(),
        })
      )
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Load rate limit state from localStorage
   */
  private loadRateLimitState(): void {
    try {
      const stored = localStorage.getItem('instagram_rate_limit')
      if (stored) {
        const data = JSON.parse(stored)
        const age = Date.now() - data.timestamp

        // Only restore if less than 1 hour old
        if (age < 3600000) {
          this.rateLimit = {
            requests: data.requests || 0,
            resetTime: data.resetTime || Date.now() + 3600000,
            burstRequests: data.burstRequests || 0,
            burstResetTime: data.burstResetTime || Date.now() + 300000,
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Check if we can make a request based on rate limits
   */
  private canMakeRequest(): { allowed: boolean; waitTime?: number } {
    const now = Date.now()

    // Reset counters if time has passed
    if (now >= this.rateLimit.resetTime) {
      this.rateLimit.requests = 0
      this.rateLimit.resetTime = now + 3600000
    }

    if (now >= this.rateLimit.burstResetTime) {
      this.rateLimit.burstRequests = 0
      this.rateLimit.burstResetTime = now + 300000
    }

    // Check burst limit (short term)
    if (this.rateLimit.burstRequests >= this.config.rateLimit.burstLimit) {
      return {
        allowed: false,
        waitTime: this.rateLimit.burstResetTime - now,
      }
    }

    // Check hourly limit
    if (this.rateLimit.requests >= this.config.rateLimit.requestsPerHour) {
      return {
        allowed: false,
        waitTime: this.rateLimit.resetTime - now,
      }
    }

    return { allowed: true }
  }

  /**
   * Increment rate limit counters
   */
  private incrementRateLimit(): void {
    this.rateLimit.requests++
    this.rateLimit.burstRequests++
    this.saveRateLimitState()
  }

  /**
   * Make authenticated request to Instagram API
   */
  private async makeRequest<T = Record<string, unknown>>(
    endpoint: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    if (!this.config.accessToken) {
      throw new InstagramAPIError(
        'Instagram access token not configured',
        401,
        'auth'
      )
    }

    const rateLimitCheck = this.canMakeRequest()
    if (!rateLimitCheck.allowed) {
      throw new InstagramAPIError(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.waitTime || 0) / 1000)} seconds`,
        429,
        'rate_limit'
      )
    }

    const url = new URL(`${this.config.baseUrl}/${endpoint}`)
    const searchParams = new URLSearchParams({
      access_token: this.config.accessToken,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ),
    })

    url.search = searchParams.toString()

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'RrishMusic/1.0',
        },
      })

      this.incrementRateLimit()

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }))
        throw new InstagramAPIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          response.status === 401
            ? 'auth'
            : response.status === 429
              ? 'rate_limit'
              : 'network'
        )
      }

      const data = (await response.json()) as APIResponse<T>

      if (data.error) {
        throw new InstagramAPIError(
          data.error.message || 'API Error',
          data.error.code || 500,
          'api'
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof InstagramAPIError) {
        throw error
      }
      throw new InstagramAPIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'network'
      )
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<InstagramProfile> {
    return this.makeRequest<InstagramProfile>('me', {
      fields: 'id,username,account_type,media_count',
    })
  }

  /**
   * Get detailed media information
   */
  async getMediaDetails(mediaId: string): Promise<InstagramMediaDetails> {
    return this.makeRequest<InstagramMediaDetails>(`${mediaId}`, {
      fields:
        'id,caption,media_url,media_type,permalink,timestamp,thumbnail_url,username,like_count,comments_count,media_product_type,video_title,children{media_url,media_type}',
    })
  }

  /**
   * Get user media with enhanced fields
   */
  async getUserMedia(
    options: {
      limit?: number
      before?: string
      after?: string
      since?: string
      until?: string
    } = {}
  ): Promise<MediaResponse> {
    const params: Record<string, unknown> = {
      fields:
        'id,caption,media_url,media_type,permalink,timestamp,thumbnail_url,username,like_count,comments_count',
      limit: options.limit || 25,
    }

    if (options.before) params.before = options.before
    if (options.after) params.after = options.after
    if (options.since) params.since = options.since
    if (options.until) params.until = options.until

    return this.makeRequest<MediaResponse>('me/media', params)
  }

  /**
   * Get media insights (for business accounts)
   */
  async getMediaInsights(mediaId: string): Promise<InstagramAPIMetrics> {
    try {
      const insights = await this.makeRequest<InsightsResponse>(
        `${mediaId}/insights`,
        {
          metric:
            'impressions,reach,engagement,saves,profile_visits,website_clicks',
        }
      )

      const metrics: InstagramAPIMetrics = {}
      insights.data.forEach(insight => {
        const value = insight.values[0]?.value || 0
        switch (insight.name) {
          case 'impressions':
            metrics.impressions = value
            break
          case 'reach':
            metrics.reach = value
            break
          case 'engagement':
            metrics.engagement = value
            break
          case 'profile_visits':
            metrics.profile_visits = value
            break
          case 'website_clicks':
            metrics.website_clicks = value
            break
        }
      })

      return metrics
    } catch (apiError) {
      // Insights might not be available for personal accounts
      console.warn('Media insights not available:', apiError)
      return {}
    }
  }

  /**
   * Refresh long-lived access token
   */
  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    if (!this.config.accessToken) {
      throw new InstagramAPIError('No access token to refresh', 401, 'auth')
    }

    return this.makeRequest<{ access_token: string; expires_in: number }>(
      'refresh_access_token',
      {
        grant_type: 'ig_refresh_token',
      }
    )
  }

  /**
   * Validate current access token
   */
  async validateToken(): Promise<{
    is_valid: boolean
    expires_at?: number
    scopes?: string[]
  }> {
    try {
      const response = await this.makeRequest<{
        data: {
          app_id: string
          type: string
          application: string
          data_access_expires_at: number
          expires_at: number
          is_valid: boolean
          scopes: string[]
        }
      }>('debug_token', {
        input_token: this.config.accessToken,
      })

      return {
        is_valid: response.data.is_valid,
        expires_at: response.data.expires_at,
        scopes: response.data.scopes,
      }
    } catch {
      return { is_valid: false }
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): {
    requests: number
    requestsRemaining: number
    resetTime: number
    burstRequests: number
    burstRemaining: number
    burstResetTime: number
  } {
    return {
      requests: this.rateLimit.requests,
      requestsRemaining: Math.max(
        0,
        this.config.rateLimit.requestsPerHour - this.rateLimit.requests
      ),
      resetTime: this.rateLimit.resetTime,
      burstRequests: this.rateLimit.burstRequests,
      burstRemaining: Math.max(
        0,
        this.config.rateLimit.burstLimit - this.rateLimit.burstRequests
      ),
      burstResetTime: this.rateLimit.burstResetTime,
    }
  }

  /**
   * Clear rate limit state (for testing)
   */
  clearRateLimit(): void {
    this.rateLimit = {
      requests: 0,
      resetTime: Date.now() + 3600000,
      burstRequests: 0,
      burstResetTime: Date.now() + 300000,
    }
    this.saveRateLimitState()
  }

  /**
   * Check if API service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.accessToken && this.config.clientId)
  }

  /**
   * Get service configuration status
   */
  getServiceStatus(): {
    configured: boolean
    hasAccessToken: boolean
    hasClientId: boolean
    rateLimit: ReturnType<typeof this.getRateLimitStatus>
  } {
    return {
      configured: this.isConfigured(),
      hasAccessToken: !!this.config.accessToken,
      hasClientId: !!this.config.clientId,
      rateLimit: this.getRateLimitStatus(),
    }
  }
}

// Export singleton instance
export const instagramAPI = new InstagramAPIService()

// Export service class for custom configurations
export { InstagramAPIService }

export default instagramAPI
