// src/lib/schemas.ts
import { z } from 'zod'

const CTA = z.object({ label: z.string(), href: z.string() })

// ============================================================================
// Hero Schema - WITH Three-Image Layout + Optional Pricing
// ============================================================================

export const HeroPricingSchema = z.object({
  show: z.boolean().default(false),
  style: z.enum(['panel', 'inline', 'badge']).default('panel'),
  primary: z.string(), // "First session free"
  secondary: z.string(), // "Then A$30 per 30-minute session"
})

export const HeroSchema = z.object({
  headline: z.string(),
  subhead: z.string(),
  cta: CTA,
  images: z.object({
    left: z.object({ src: z.string(), alt: z.string() }),
    center: z.object({ src: z.string(), alt: z.string() }),
    right: z.object({ src: z.string(), alt: z.string() }),
  }),
  pricing: HeroPricingSchema.optional(),
})

// ============================================================================
// Teaching Blocks Schemas
// ============================================================================

export const FeatureListSchema = z.object({
  title: z.string(),
  items: z.array(z.string().min(1)),
})

export const PricingSchema = z.object({
  title: z.string().optional(),
  displayPrice: z.boolean().default(false), // toggle visibility
  trial: z.string(),
  session: z.object({
    amountAud: z.number().int().min(1), // keep price in data
    durationMins: z.number().int().min(1),
    label: z.string().optional(),
    notes: z.string().optional(),
  }),
})

export const ScheduleSchema = z.object({
  title: z.string(),
  windows: z.array(
    z.object({
      label: z.string(), // "Weekdays", "Weekends"
      times: z.array(z.string()), // ["6:00–8:00 PM"]
    })
  ),
})

export const ContactSectionSchema = z.object({
  title: z.string(),
  blurb: z.string().optional(),
  contactLinks: z.array(CTA).min(1),
})

// ============================================================================
// Gallery Mosaic Schemas - RESTORED
// ============================================================================

export const MediaItemSchema = z.object({
  filename: z.string(),
  category: z.string(),
  path: z.string(),
  aspectRatio: z.number(),
  isFeatured: z.boolean().optional().default(false),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
})

export type MediaItem = z.infer<typeof MediaItemSchema>

export const GridConfigSchema = z.object({
  mobile: z.string(),
  tablet: z.string(),
  desktop: z.string(),
  rowHeight: z.string(),
  gap: z.string(),
})

export const AnimationConfigSchema = z.object({
  hidden: z.object({ opacity: z.number() }),
  visible: z.object({
    opacity: z.number(),
    transition: z.object({
      duration: z.number(),
      ease: z.string(),
    }),
  }),
})

export const LayoutConfigSchema = z.object({
  grid: GridConfigSchema,
  animations: z.object({
    container: AnimationConfigSchema,
  }),
})

export const UIConfigSchema = z.object({
  loadingMessage: z.string(),
  emptyStateTitle: z.string(),
  emptyStateDescription: z.string(),
  featuredBadge: z.string(),
  videoBadge: z.string(),
})

export const GalleryGridBlockPropsSchema = z.object({
  mediaItems: z.array(MediaItemSchema),
  layout: LayoutConfigSchema,
  ui: UIConfigSchema,
})

export type GalleryGridBlockProps = z.infer<typeof GalleryGridBlockPropsSchema>

// ============================================================================
// Block Discriminated Union
// ============================================================================

export const BlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Hero'), props: HeroSchema }),
  z.object({ type: z.literal('FeatureList'), props: FeatureListSchema }),
  z.object({ type: z.literal('Pricing'), props: PricingSchema }),
  z.object({ type: z.literal('Schedule'), props: ScheduleSchema }),
  z.object({ type: z.literal('ContactSection'), props: ContactSectionSchema }),
  z.object({
    type: z.literal('GalleryGrid'),
    props: GalleryGridBlockPropsSchema,
  }),
])

export type Block = z.infer<typeof BlockSchema>

// ============================================================================
// Page Schema
// ============================================================================

export const PageSchema = z.object({ blocks: z.array(BlockSchema) })
