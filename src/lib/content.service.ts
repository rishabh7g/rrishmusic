/**
 * Content Service
 * Loads JSON page data, validates with Zod, and resolves blocks to React components
 */

import galleryData from '@/data/gallery.json'
import { PageSchema, type Block } from '@/lib/schemas'
import { registry, type RegistryKey } from '@/lib/registry'
import home from '@/data/home.json'

/**
 * Resolved block with Component and props ready for rendering
 */
export interface ResolvedBlock {
  Component: React.ComponentType<any>
  props: any
}

/**
 * Transform block props for normalization and enhancement
 * Examples: normalize tel: links, derive embed URLs, add defaults
 */
function transformBlockProps(_type: string, props: any): any {
  // Props are already properly formatted in JSON, no transformation needed currently
  return props
}

/**
 * Resolve a block to its React component and transformed props
 */
function resolveBlock(block: Block): ResolvedBlock {
  const componentKey = block.type as RegistryKey

  if (!(componentKey in registry)) {
    throw new Error(`Unknown block type: ${block.type}`)
  }

  const Component = registry[componentKey]
  const transformedProps = transformBlockProps(block.type, block.props)

  return {
    Component,
    props: transformedProps,
  }
}

/**
 * Load and resolve Home page blocks
 * Validates JSON with Zod and returns resolved blocks
 */
export function getHomeBlocks(): ResolvedBlock[] {
  try {
    const parsed = PageSchema.parse(home)

    // Resolve blocks to components
    const resolvedBlocks = parsed.blocks.map(resolveBlock)

    return resolvedBlocks
  } catch (error) {
    console.error('Failed to load home page data:', error)
    throw new Error('Invalid home page data structure')
  }
}

/**
 * Load and resolve Gallery page blocks
 * Validates JSON with Zod and returns resolved blocks
 */
export function getGalleryBlocks(): ResolvedBlock[] {
  try {
    // Validate with Zod schema
    const validated = PageSchema.parse(galleryData)

    // Resolve blocks to components
    const resolvedBlocks = validated.blocks.map(resolveBlock)

    return resolvedBlocks
  } catch (error) {
    console.error('Failed to load gallery page data:', error)
    throw new Error('Invalid gallery page data structure')
  }
}

/**
 * Generic page loader for future extensibility
 */
export function getPageBlocks(pageData: unknown): ResolvedBlock[] {
  try {
    const validated = PageSchema.parse(pageData)
    const resolvedBlocks = validated.blocks.map(resolveBlock)

    return resolvedBlocks
  } catch (error) {
    console.error('Failed to load page data:', error)
    throw new Error('Invalid page data structure')
  }
}
