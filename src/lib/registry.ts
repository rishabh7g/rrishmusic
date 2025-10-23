/**
 * Component Registry
 * Maps block type strings to React components for dynamic rendering
 */

import { Hero } from '@/components/blocks/Hero'
import { FeatureList } from '@/components/blocks/FeatureList'
import { Pricing } from '@/components/blocks/Pricing'
import { Schedule } from '@/components/blocks/Schedule'
import { ContactSection } from '@/components/blocks/ContactSection'
import { GalleryGrid } from '@/components/blocks/GalleryGrid'

/**
 * Registry object mapping block types to their React components
 * Used by the content service to resolve blocks to renderable components
 */
export const registry = {
  Hero,
  FeatureList,
  Pricing,
  Schedule,
  ContactSection,
  GalleryGrid,
} as const

/**
 * Type-safe registry keys
 */
export type RegistryKey = keyof typeof registry
