/**
 * CTA Hierarchy Presets
 *
 * Predefined CTA configurations for common use cases
 */

import React from 'react'
import { CTAHierarchy, type CTAContext, type CTALayout } from './CTAHierarchy'
import ctaConfig from '@/content/ui/cta.json'

/**
 * Props interface for CTA Hierarchy (imported from main component)
 */
interface CTAHierarchyProps {
  layout?: CTALayout
  context?: CTAContext
  primaryOnly?: boolean
  customMessages?: {
    primary?: string
    secondary?: string
    tertiary?: string
  }
  className?: string
  performanceEventType?: string
  teachingPackageType?: 'individual' | 'package_4' | 'package_8'
  collaborationProjectType?: 'studio' | 'creative' | 'partnership' | 'other'
}

/**
 * Preset CTA configurations for common use cases
 */
export const CTAPresets = {
  /**
   * Hero section CTA with maximum prominence
   */
  hero: (props?: Partial<CTAHierarchyProps>) => (
    <CTAHierarchy
      layout={ctaConfig.presets.hero.layout as CTALayout}
      context={ctaConfig.presets.hero.context as CTAContext}
      customMessages={{
        primary: ctaConfig.presets.hero.primary,
        secondary: ctaConfig.presets.hero.secondary,
        tertiary: ctaConfig.presets.hero.tertiary,
      }}
      {...props}
    />
  ),

  /**
   * Services section CTA with balanced prominence
   */
  services: (props?: Partial<CTAHierarchyProps>) => (
    <CTAHierarchy layout="horizontal" context="services" {...props} />
  ),

  /**
   * Footer CTA with compact layout
   */
  footer: (props?: Partial<CTAHierarchyProps>) => (
    <CTAHierarchy
      layout="horizontal"
      context="footer"
      customMessages={{
        primary: 'Book Show',
        secondary: 'Learn Guitar',
        tertiary: 'Collaborate',
      }}
      {...props}
    />
  ),

  /**
   * Primary-only CTA for focused conversion
   */
  primaryFocus: (props?: Partial<CTAHierarchyProps>) => (
    <CTAHierarchy
      primaryOnly={true}
      layout="vertical"
      customMessages={{
        primary: 'Book Your Performance Today',
      }}
      {...props}
    />
  ),

  /**
   * Mobile-optimized vertical CTA stack
   */
  mobileOptimized: (props?: Partial<CTAHierarchyProps>) => (
    <CTAHierarchy layout="vertical" context="inline" {...props} />
  ),
}
