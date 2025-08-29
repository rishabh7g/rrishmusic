/**
 * Service context types for context-aware navigation and headers
 */
import { ServiceType } from './content'

// Note: ServiceContext includes 'home' for navigation but core services are performance, teaching, collaboration
export type ExtendedServiceType = ServiceType | 'home'

export interface ServiceContextualData {
  /**
   * Service identifier
   */
  service: ExtendedServiceType

  /**
   * Service display name
   */
  name: string

  /**
   * Service description for meta/SEO
   */
  description: string

  /**
   * Primary color theme for the service
   */
  primaryColor: string

  /**
   * Secondary color theme for the service
   */
  secondaryColor: string

  /**
   * Service-specific navigation items
   */
  navigationItems: ServiceNavigationItem[]

  /**
   * Primary call-to-action configuration
   */
  primaryCTA: ServiceCTA

  /**
   * Secondary call-to-action configuration
   */
  secondaryCTA?: ServiceCTA
}

export interface ServiceNavigationItem {
  /**
   * Navigation item identifier
   */
  id: string

  /**
   * Display label
   */
  label: string

  /**
   * Navigation target (route or anchor)
   */
  href: string

  /**
   * Whether this item is highlighted in current context
   */
  highlighted?: boolean

  /**
   * Navigation item type
   */
  type: 'route' | 'anchor' | 'external'
}

export interface ServiceCTA {
  /**
   * CTA button text
   */
  text: string

  /**
   * CTA action target
   */
  href: string

  /**
   * CTA action type
   */
  type: 'route' | 'anchor' | 'external'

  /**
   * Visual style variant
   */
  variant: 'primary' | 'secondary' | 'outline'

  /**
   * Icon name (optional)
   */
  icon?: string
}

export interface ServiceContextState {
  /**
   * Current active service context
   */
  currentService: ExtendedServiceType

  /**
   * Available service contexts
   */
  services: Record<ExtendedServiceType, ServiceContextualData>

  /**
   * Whether context is being transitioned
   */
  isTransitioning: boolean

  /**
   * Previous service context (for transition animations)
   */
  previousService?: ExtendedServiceType
}

export interface ServiceContextActions {
  /**
   * Change the current service context
   */
  setService: (service: ExtendedServiceType) => void

  /**
   * Get contextual data for a specific service
   */
  getServiceData: (service: ExtendedServiceType) => ServiceContextualData

  /**
   * Check if a service is currently active
   */
  isServiceActive: (service: ExtendedServiceType) => boolean

  /**
   * Get navigation items for current service
   */
  getCurrentNavigation: () => ServiceNavigationItem[]

  /**
   * Get primary CTA for current service
   */
  getCurrentPrimaryCTA: () => ServiceCTA

  /**
   * Get secondary CTA for current service (if available)
   */
  getCurrentSecondaryCTA: () => ServiceCTA | undefined
}
