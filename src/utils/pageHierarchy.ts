import { ServiceType } from '@/types/content'

/**
 * Page Hierarchy Management
 * Defines the structure and relationships between pages for breadcrumb navigation
 */

/**
 * Page node definition for hierarchy tree
 */
export interface PageNode {
  id: string
  title: string
  shortTitle?: string // For mobile breadcrumbs
  path: string
  serviceType?: ServiceType
  children?: PageNode[]
  metadata?: {
    description?: string
    keywords?: string[]
    priority?: number
    icon?: string
    category?: string
  }
}

/**
 * Breadcrumb item for navigation display
 */
export interface BreadcrumbItem {
  id: string
  title: string
  shortTitle?: string
  path: string
  isActive: boolean
  isClickable: boolean
  serviceType?: ServiceType
}

/**
 * Navigation context for page hierarchy
 */
export interface NavigationContext {
  currentPath: string
  ancestors: PageNode[]
  siblings: PageNode[]
  children: PageNode[]
  serviceContext?: ServiceType
  depth: number
}

/**
 * Complete page hierarchy definition
 */
const PAGE_HIERARCHY: PageNode = {
  id: 'root',
  title: 'Rrish Music',
  shortTitle: 'Home',
  path: '/',
  children: [
    {
      id: 'home',
      title: 'Home',
      shortTitle: 'Home',
      path: '/',
      metadata: {
        description: 'Professional musician services',
        priority: 1,
        icon: '🏠',
        category: 'main',
      },
    },
    {
      id: 'teaching',
      title: 'Guitar Lessons',
      shortTitle: 'Lessons',
      path: '/teaching',
      serviceType: 'teaching',
      metadata: {
        description: 'Professional guitar instruction',
        keywords: ['guitar', 'lessons', 'music', 'teaching'],
        priority: 2,
        icon: '🎸',
        category: 'service',
      },
      children: [
        {
          id: 'teaching-packages',
          title: 'Lesson Packages',
          shortTitle: 'Packages',
          path: '/teaching#packages',
          serviceType: 'teaching',
          metadata: {
            description: 'Available lesson packages and pricing',
            category: 'content',
          },
        },
        {
          id: 'teaching-approach',
          title: 'Teaching Approach',
          shortTitle: 'Approach',
          path: '/teaching#approach',
          serviceType: 'teaching',
          metadata: {
            description: 'My teaching methodology and philosophy',
            category: 'content',
          },
        },
        {
          id: 'teaching-curriculum',
          title: 'Curriculum',
          shortTitle: 'Curriculum',
          path: '/teaching#curriculum',
          serviceType: 'teaching',
          metadata: {
            description: 'Structured learning pathway',
            category: 'content',
          },
        },
      ],
    },
    {
      id: 'performance',
      title: 'Live Performances',
      shortTitle: 'Performances',
      path: '/performance',
      serviceType: 'performance',
      metadata: {
        description: 'Professional live music performances',
        keywords: ['performance', 'live', 'music', 'entertainment'],
        priority: 3,
        icon: '🎤',
        category: 'service',
      },
      children: [
        {
          id: 'performance-venues',
          title: 'Performance Venues',
          shortTitle: 'Venues',
          path: '/performance#venues',
          serviceType: 'performance',
          metadata: {
            description: 'Venues where I perform regularly',
            category: 'content',
          },
        },
        {
          id: 'performance-services',
          title: 'Performance Services',
          shortTitle: 'Services',
          path: '/performance#services',
          serviceType: 'performance',
          metadata: {
            description: 'Types of performance services offered',
            category: 'content',
          },
        },
        {
          id: 'performance-equipment',
          title: 'Equipment Setup',
          shortTitle: 'Equipment',
          path: '/performance#equipment',
          serviceType: 'performance',
          metadata: {
            description: 'Professional equipment and technical setup',
            category: 'content',
          },
        },
      ],
    },
    {
      id: 'collaboration',
      title: 'Music Collaboration',
      shortTitle: 'Collaboration',
      path: '/collaboration',
      serviceType: 'collaboration',
      metadata: {
        description: 'Creative musical collaborations and projects',
        keywords: ['collaboration', 'creative', 'projects', 'music'],
        priority: 4,
        icon: '🤝',
        category: 'service',
      },
      children: [
        {
          id: 'collaboration-portfolio',
          title: 'Project Portfolio',
          shortTitle: 'Portfolio',
          path: '/collaboration#portfolio',
          serviceType: 'collaboration',
          metadata: {
            description: 'Showcase of collaborative projects',
            category: 'content',
          },
        },
        {
          id: 'collaboration-process',
          title: 'Collaboration Process',
          shortTitle: 'Process',
          path: '/collaboration#process',
          serviceType: 'collaboration',
          metadata: {
            description: 'How collaboration projects work',
            category: 'content',
          },
        },
        {
          id: 'collaboration-services',
          title: 'Service Types',
          shortTitle: 'Services',
          path: '/collaboration#services',
          serviceType: 'collaboration',
          metadata: {
            description: 'Types of collaboration services available',
            category: 'content',
          },
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      shortTitle: 'About',
      path: '/about',
      metadata: {
        description: 'About Rrish and musical background',
        priority: 5,
        icon: '👤',
        category: 'main',
      },
    },
    {
      id: 'contact',
      title: 'Contact',
      shortTitle: 'Contact',
      path: '/contact',
      metadata: {
        description: 'Get in touch for bookings and inquiries',
        priority: 6,
        icon: '📞',
        category: 'main',
      },
    },
    // Demo pages
    {
      id: 'demos',
      title: 'Demos',
      shortTitle: 'Demos',
      path: '/demos',
      metadata: {
        description: 'Development and demo pages',
        priority: 999,
        icon: '🔧',
        category: 'dev',
      },
      children: [
        {
          id: 'category-demo',
          title: 'Category Navigation Demo',
          shortTitle: 'Categories',
          path: '/category-demo',
          metadata: {
            description: 'Single-page navigation demonstration',
            category: 'dev',
          },
        },
        {
          id: 'service-sections-demo',
          title: 'Service Sections Demo',
          shortTitle: 'Sections',
          path: '/service-sections-demo',
          metadata: {
            description: 'Service-specific content sections demo',
            category: 'dev',
          },
        },
      ],
    },
  ],
}

/**
 * Page Hierarchy Manager Class
 */
class PageHierarchyManager {
  private hierarchy: PageNode
  private pathMap: Map<string, PageNode>
  private idMap: Map<string, PageNode>

  constructor() {
    this.hierarchy = PAGE_HIERARCHY
    this.pathMap = new Map()
    this.idMap = new Map()
    this.buildMaps(this.hierarchy)
  }

  /**
   * Build internal maps for efficient lookups
   */
  private buildMaps(node: PageNode): void {
    this.pathMap.set(node.path, node)
    this.idMap.set(node.id, node)

    if (node.children) {
      node.children.forEach(child => {
        this.buildMaps(child)
      })
    }
  }

  /**
   * Find page node by path
   */
  findByPath(path: string): PageNode | null {
    // Try exact match first
    let node = this.pathMap.get(path)
    if (node) return node

    // Try path without hash
    const pathWithoutHash = path.split('#')[0]
    node = this.pathMap.get(pathWithoutHash)
    if (node) return node

    // Try finding by hash anchor
    if (path.includes('#')) {
      const [basePath, anchor] = path.split('#')
      const baseNode = this.pathMap.get(basePath)
      if (baseNode?.children) {
        const childNode = baseNode.children.find(
          child => child.path === path || child.path.endsWith(`#${anchor}`)
        )
        if (childNode) return childNode
      }
    }

    return null
  }

  /**
   * Find page node by ID
   */
  findById(id: string): PageNode | null {
    return this.idMap.get(id) || null
  }

  /**
   * Get breadcrumb trail for a given path
   */
  getBreadcrumbs(path: string): BreadcrumbItem[] {
    const node = this.findByPath(path)
    if (!node) return []

    const ancestors = this.getAncestors(node)
    const breadcrumbs: BreadcrumbItem[] = []

    // Add ancestors
    ancestors.forEach(ancestor => {
      breadcrumbs.push({
        id: ancestor.id,
        title: ancestor.title,
        shortTitle: ancestor.shortTitle,
        path: ancestor.path,
        isActive: false,
        isClickable: true,
        serviceType: ancestor.serviceType,
      })
    })

    // Add current page
    breadcrumbs.push({
      id: node.id,
      title: node.title,
      shortTitle: node.shortTitle,
      path: node.path,
      isActive: true,
      isClickable: false,
      serviceType: node.serviceType,
    })

    return breadcrumbs
  }

  /**
   * Get ancestor nodes for a given node
   */
  private getAncestors(targetNode: PageNode): PageNode[] {
    const ancestors: PageNode[] = []

    const findAncestors = (node: PageNode, path: PageNode[] = []): boolean => {
      if (node.id === targetNode.id) {
        ancestors.push(...path)
        return true
      }

      if (node.children) {
        for (const child of node.children) {
          if (findAncestors(child, [...path, node])) {
            return true
          }
        }
      }

      return false
    }

    findAncestors(this.hierarchy)
    return ancestors.filter(node => node.id !== 'root') // Exclude root from breadcrumbs
  }

  /**
   * Get navigation context for a path
   */
  getNavigationContext(path: string): NavigationContext | null {
    const node = this.findByPath(path)
    if (!node) return null

    const ancestors = this.getAncestors(node)
    const parent = ancestors[ancestors.length - 1] || this.hierarchy
    const siblings =
      parent.children?.filter(child => child.id !== node.id) || []
    const children = node.children || []

    return {
      currentPath: path,
      ancestors,
      siblings,
      children,
      serviceContext: node.serviceType,
      depth: ancestors.length,
    }
  }

  /**
   * Get all pages of a specific service type
   */
  getServicePages(serviceType: ServiceType): PageNode[] {
    const servicePages: PageNode[] = []

    const collectServicePages = (node: PageNode): void => {
      if (node.serviceType === serviceType) {
        servicePages.push(node)
      }

      if (node.children) {
        node.children.forEach(collectServicePages)
      }
    }

    collectServicePages(this.hierarchy)
    return servicePages
  }

  /**
   * Get page hierarchy as flat list
   */
  getAllPages(): PageNode[] {
    const allPages: PageNode[] = []

    const collectPages = (node: PageNode): void => {
      allPages.push(node)
      if (node.children) {
        node.children.forEach(collectPages)
      }
    }

    collectPages(this.hierarchy)
    return allPages.filter(page => page.id !== 'root')
  }

  /**
   * Generate sitemap data
   */
  generateSitemap(): { url: string; priority: number; changefreq: string }[] {
    return this.getAllPages()
      .filter(
        page => !page.path.includes('#') && page.metadata?.category !== 'dev'
      )
      .map(page => ({
        url: page.path,
        priority: this.calculateSitemapPriority(page),
        changefreq: this.getChangeFrequency(page),
      }))
  }

  /**
   * Calculate SEO priority for sitemap
   */
  private calculateSitemapPriority(page: PageNode): number {
    if (page.path === '/') return 1.0
    if (page.serviceType) return 0.8
    if (page.metadata?.category === 'main') return 0.6
    return 0.4
  }

  /**
   * Get change frequency for sitemap
   */
  private getChangeFrequency(page: PageNode): string {
    if (page.path === '/') return 'weekly'
    if (page.serviceType) return 'monthly'
    return 'yearly'
  }
}

/**
 * Singleton instance of page hierarchy manager
 */
export const pageHierarchy = new PageHierarchyManager()

/**
 * Utility functions for easy access
 */
export const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
  return pageHierarchy.getBreadcrumbs(path)
}

export const getNavigationContext = (
  path: string
): NavigationContext | null => {
  return pageHierarchy.getNavigationContext(path)
}

export const getServicePages = (serviceType: ServiceType): PageNode[] => {
  return pageHierarchy.getServicePages(serviceType)
}

export default {
  pageHierarchy,
  getBreadcrumbs,
  getNavigationContext,
  getServicePages,
  PageNode,
  BreadcrumbItem,
  NavigationContext,
}
