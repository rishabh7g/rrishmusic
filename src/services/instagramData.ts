/**
 * Instagram Data Service - JSON-based content management
 *
 * Simple, secure alternative to Instagram API integration
 * Allows manual content curation without API credentials
 */

import { InstagramPost } from './instagram'
import instagramPostsData from '@/data/instagram-posts.json'

export interface InstagramDataFile {
  posts: InstagramPost[]
  metadata: {
    last_updated: string
    total_posts: number
    username: string
    profile_url: string
  }
}

/**
 * Instagram Data Service Class
 * Manages JSON-based Instagram content
 */
class InstagramDataService {
  private data: InstagramDataFile

  constructor() {
    this.data = instagramPostsData as InstagramDataFile
  }

  /**
   * Get all posts
   */
  getAllPosts(): InstagramPost[] {
    return [...this.data.posts]
  }

  /**
   * Get performance-related posts
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
   * Get posts by tags
   */
  getPostsByTags(tags: string[], limit?: number): InstagramPost[] {
    const filteredPosts = this.data.posts.filter(post => {
      const postTags = post.tags || []
      return tags.some(tag => postTags.includes(tag))
    })

    if (limit) {
      return filteredPosts.slice(0, limit)
    }

    return filteredPosts
  }

  /**
   * Get posts by event type
   */
  getPostsByEventType(eventType: string, limit?: number): InstagramPost[] {
    const filteredPosts = this.data.posts.filter(
      post => post.event_type?.toLowerCase() === eventType.toLowerCase()
    )

    if (limit) {
      return filteredPosts.slice(0, limit)
    }

    return filteredPosts
  }

  /**
   * Get recent posts (sorted by timestamp)
   */
  getRecentPosts(limit?: number): InstagramPost[] {
    const sortedPosts = [...this.data.posts].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    if (limit) {
      return sortedPosts.slice(0, limit)
    }

    return sortedPosts
  }

  /**
   * Get metadata about the Instagram account
   */
  getMetadata() {
    return { ...this.data.metadata }
  }

  /**
   * Get Instagram profile URL
   */
  getProfileUrl(): string {
    return this.data.metadata.profile_url
  }

  /**
   * Get username
   */
  getUsername(): string {
    return this.data.metadata.username
  }

  /**
   * Get total number of posts
   */
  getTotalPosts(): number {
    return this.data.posts.length
  }

  /**
   * Search posts by caption content
   */
  searchPosts(query: string, limit?: number): InstagramPost[] {
    const searchQuery = query.toLowerCase()
    const matchingPosts = this.data.posts.filter(post =>
      post.caption?.toLowerCase().includes(searchQuery)
    )

    if (limit) {
      return matchingPosts.slice(0, limit)
    }

    return matchingPosts
  }
}

// Export singleton instance
export const instagramDataService = new InstagramDataService()
export default instagramDataService

// Extended Instagram Post interface with additional fields
export interface ExtendedInstagramPost extends InstagramPost {
  tags?: string[]
  venue?: string
  event_type?: string
}
