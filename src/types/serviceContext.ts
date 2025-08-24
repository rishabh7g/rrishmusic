/**
 * Service context types for context-aware navigation and headers
 */

export type ServiceType = 'home' | 'teaching' | 'performance' | 'collaboration';

export interface ServiceContextualData {
  /**
   * Service identifier
   */
  service: ServiceType;
  
  /**
   * Service display name
   */
  name: string;
  
  /**
   * Service description for meta/SEO
   */
  description: string;
  
  /**
   * Primary color theme for the service
   */
  primaryColor: string;
  
  /**
   * Secondary color theme for the service
   */
  secondaryColor: string;
  
  /**
   * Service-specific navigation items
   */
  navigationItems: ServiceNavigationItem[];
  
  /**
   * Primary call-to-action configuration
   */
  primaryCTA: ServiceCTA;
  
  /**
   * Secondary call-to-action configuration
   */
  secondaryCTA?: ServiceCTA;
}

export interface ServiceNavigationItem {
  /**
   * Navigation item identifier
   */
  id: string;
  
  /**
   * Display label
   */
  label: string;
  
  /**
   * Navigation target (route or anchor)
   */
  href: string;
  
  /**
   * Whether this item is highlighted in current context
   */
  highlighted?: boolean;
  
  /**
   * Navigation item type
   */
  type: 'route' | 'anchor' | 'external';
}

export interface ServiceCTA {
  /**
   * CTA button text
   */
  text: string;
  
  /**
   * CTA action target
   */
  href: string;
  
  /**
   * CTA action type
   */
  type: 'route' | 'anchor' | 'external';
  
  /**
   * Visual style variant
   */
  variant: 'primary' | 'secondary' | 'outline';
  
  /**
   * Icon name (optional)
   */
  icon?: string;
}

export interface ServiceContextState {
  /**
   * Current active service context
   */
  currentService: ServiceType;
  
  /**
   * Available service contexts
   */
  services: Record<ServiceType, ServiceContextualData>;
  
  /**
   * Whether context is being transitioned
   */
  isTransitioning: boolean;
  
  /**
   * Previous service context (for transition animations)
   */
  previousService?: ServiceType;
}

export interface ServiceContextActions {
  /**
   * Change the current service context
   */
  setService: (service: ServiceType) => void;
  
  /**
   * Get contextual data for a specific service
   */
  getServiceData: (service: ServiceType) => ServiceContextualData;
  
  /**
   * Check if a service is currently active
   */
  isServiceActive: (service: ServiceType) => boolean;
  
  /**
   * Get navigation items for current service
   */
  getCurrentNavigation: () => ServiceNavigationItem[];
  
  /**
   * Get primary CTA for current service
   */
  getCurrentPrimaryCTA: () => ServiceCTA;
  
  /**
   * Get secondary CTA for current service (if available)
   */
  getCurrentSecondaryCTA: () => ServiceCTA | undefined;
}