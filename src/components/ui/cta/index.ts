/**
 * CTA Components Index
 * 
 * Consolidated exports for all CTA-related components
 */

// Main unified service CTA component
export {
  ServiceCTA,
  type ServiceCTAProps,
  type ServiceType,
  type CTAVariant,
  type CTASize,
  
  // Service-specific CTA components
  PerformanceCTA,
  CollaborationCTA,
  TeachingCTA,
  
  // Variant-specific Performance CTAs
  PrimaryPerformanceCTA,
  SecondaryPerformanceCTA,
  OutlinePerformanceCTA,
  MinimalPerformanceCTA,
  
  // Event-specific Performance CTAs
  WeddingInquiryCTA,
  CorporateInquiryCTA,
  VenueInquiryCTA,
  
  // Variant-specific Collaboration CTAs
  PrimaryCollaborationCTA,
  SecondaryCollaborationCTA,
  OutlineCollaborationCTA,
  MinimalCollaborationCTA,
  
  // Project-specific Collaboration CTAs
  StudioCollaborationCTA,
  CreativeProjectCTA,
  PartnershipInquiryCTA,
  
  // Variant-specific Teaching CTAs
  PrimaryTeachingCTA,
  SecondaryTeachingCTA,
  OutlineTeachingCTA,
  MinimalTeachingCTA,
  
  // Legacy component aliases for backward compatibility
  PerformanceInquiryCTA,
  CollaborationInquiryCTA,
  TeachingInquiryCTA,
  
} from './ServiceCTA'

// CTA hierarchy and orchestration
export {
  CTAHierarchy,
  type CTAContext,
  type CTALayout,
} from './CTAHierarchy'

// Smart contact CTA (complex routing logic)
export {
  SmartContactCTA,
} from './SmartContactCTA'

// Preset configurations
export {
  CTAPresets,
} from './CTAPresets'