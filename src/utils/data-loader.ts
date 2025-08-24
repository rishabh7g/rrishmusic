/**
 * @fileoverview Data Loader Utility for JSON Data Management
 * 
 * This utility provides centralized access to all JSON data files,
 * ensuring consistent data loading and type safety across components.
 * 
 * Benefits:
 * - Single source of truth for all application data
 * - Type-safe data access with TypeScript interfaces
 * - Easy maintenance and updates without code changes
 * - Consistent error handling for missing or malformed data
 * - Performance optimization through cached data loading
 */

import collaborationData from '@/data/collaboration.json';
import teachingData from '@/data/teaching.json';
import performanceGalleryData from '@/data/performance-gallery.json';
import uiConfigData from '@/data/ui-config.json';

// Type definitions for better TypeScript support
export interface CollaborationProject {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  year: string;
  duration: string;
  tags: string[];
  details: {
    role: string;
    outcome: string;
    highlights: string[];
  };
}

export interface PortfolioCategory {
  id: string;
  label: string;
  count: number;
  description: string;
}

export interface TeachingPackage {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  sessions: number;
  savings?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  icon: string;
}

export interface UIConfig {
  navigation: {
    items: Array<{
      id: string;
      label: string;
      path: string;
      type: string;
    }>;
    mobileMenuLabel: string;
    closeMenuLabel: string;
  };
  forms: {
    validation: Record<string, string>;
    buttons: Record<string, string>;
    messages: Record<string, string>;
  };
  cta: {
    variants: Record<string, string>;
    sizes: Record<string, string>;
  };
  animations: {
    duration: Record<string, number>;
    easing: Record<string, string>;
  };
}

/**
 * Data Loader Class for Centralized JSON Data Management
 */
export class DataLoader {
  private static instance: DataLoader;
  private dataCache: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  /**
   * Load collaboration portfolio data
   */
  public getCollaborationData() {
    if (!this.dataCache.has('collaboration')) {
      this.dataCache.set('collaboration', {
        categories: collaborationData.portfolio.categories as PortfolioCategory[],
        projects: collaborationData.portfolio.projects as CollaborationProject[],
        ui: collaborationData.ui
      });
    }
    return this.dataCache.get('collaboration');
  }

  /**
   * Load teaching package data
   */
  public getTeachingData() {
    if (!this.dataCache.has('teaching')) {
      this.dataCache.set('teaching', {
        packages: teachingData.packages as Record<string, TeachingPackage>,
        ui: teachingData.ui
      });
    }
    return this.dataCache.get('teaching');
  }

  /**
   * Load performance gallery data
   */
  public getPerformanceGalleryData() {
    if (!this.dataCache.has('performanceGallery')) {
      this.dataCache.set('performanceGallery', {
        filters: performanceGalleryData.filters,
        tabs: performanceGalleryData.tabs,
        ui: performanceGalleryData.ui
      });
    }
    return this.dataCache.get('performanceGallery');
  }

  /**
   * Load UI configuration data
   */
  public getUIConfig(): UIConfig {
    if (!this.dataCache.has('uiConfig')) {
      this.dataCache.set('uiConfig', uiConfigData as UIConfig);
    }
    return this.dataCache.get('uiConfig');
  }

  /**
   * Get specific data by key with fallback
   */
  public getData<T>(key: string, fallback: T): T {
    const methodMap: Record<string, () => any> = {
      'collaboration': () => this.getCollaborationData(),
      'teaching': () => this.getTeachingData(),
      'performanceGallery': () => this.getPerformanceGalleryData(),
      'uiConfig': () => this.getUIConfig()
    };

    try {
      const method = methodMap[key];
      if (method) {
        return method() || fallback;
      }
      return fallback;
    } catch (error) {
      console.warn(`Failed to load data for key: ${key}`, error);
      return fallback;
    }
  }

  /**
   * Clear cache (useful for development/testing)
   */
  public clearCache(): void {
    this.dataCache.clear();
  }

  /**
   * Preload all data (useful for performance optimization)
   */
  public preloadAllData(): void {
    this.getCollaborationData();
    this.getTeachingData();
    this.getPerformanceGalleryData();
    this.getUIConfig();
  }
}

// Export singleton instance for easy access
export const dataLoader = DataLoader.getInstance();

// Export individual data getters for convenience
export const getCollaborationData = () => dataLoader.getCollaborationData();
export const getTeachingData = () => dataLoader.getTeachingData();
export const getPerformanceGalleryData = () => dataLoader.getPerformanceGalleryData();
export const getUIConfig = () => dataLoader.getUIConfig();

// Export validation helpers
export const validateCollaborationProject = (project: any): project is CollaborationProject => {
  return (
    typeof project === 'object' &&
    project !== null &&
    typeof project.id === 'number' &&
    typeof project.title === 'string' &&
    typeof project.category === 'string' &&
    Array.isArray(project.tags) &&
    typeof project.details === 'object'
  );
};

export const validateTeachingPackage = (pkg: any): pkg is TeachingPackage => {
  return (
    typeof pkg === 'object' &&
    pkg !== null &&
    typeof pkg.name === 'string' &&
    typeof pkg.price === 'string' &&
    typeof pkg.description === 'string' &&
    typeof pkg.sessions === 'number'
  );
};

/**
 * Usage Examples:
 * 
 * // In a component:
 * import { getCollaborationData } from '@/utils/data-loader';
 * 
 * const MyComponent = () => {
 *   const { categories, projects, ui } = getCollaborationData();
 *   
 *   return (
 *     <div>
 *       <h1>{ui.sectionTitle}</h1>
 *       {projects.map(project => (
 *         <ProjectCard key={project.id} project={project} />
 *       ))}
 *     </div>
 *   );
 * };
 * 
 * // With error handling:
 * import { dataLoader } from '@/utils/data-loader';
 * 
 * const SafeComponent = () => {
 *   const data = dataLoader.getData('collaboration', { 
 *     categories: [], 
 *     projects: [], 
 *     ui: {} 
 *   });
 *   
 *   return <div>{data.projects.length} projects found</div>;
 * };
 */