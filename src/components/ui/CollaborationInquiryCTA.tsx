/**
 * Collaboration Inquiry CTA Component
 * 
 * Reusable CTA component for collaboration services that triggers
 * a collaboration-specific inquiry form with appropriate styling variants.
 * 
 * Features:
 * - Multiple visual variants (primary, secondary, outline, minimal)
 * - Size options (small, medium, large)
 * - Collaboration-specific form integration
 * - Customizable styling and content
 * - Analytics tracking for CTA interactions
 * - Accessibility compliance
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CollaborationInquiryForm, CollaborationInquiryData } from '@/components/forms/CollaborationInquiryForm';

/**
 * CTA Visual Variants
 */
export type CTAVariant = 'primary' | 'secondary' | 'outline' | 'minimal';

/**
 * CTA Size Options
 */
export type CTASize = 'small' | 'medium' | 'large';

/**
 * Collaboration Inquiry CTA Props
 */
export interface CollaborationInquiryCTAProps {
  variant?: CTAVariant;
  size?: CTASize;
  fullWidth?: boolean;
  projectType?: 'studio' | 'creative' | 'partnership' | 'other';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  trackingLabel?: string;
}

/**
 * Get variant-specific styling classes
 */
const getVariantClasses = (variant: CTAVariant): string => {
  const variants = {
    primary: 'bg-brand-blue-primary text-white hover:bg-brand-blue-primary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-brand-blue-secondary text-white hover:bg-brand-blue-secondary/90 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-brand-blue-primary text-brand-blue-primary hover:bg-brand-blue-primary hover:text-white',
    minimal: 'bg-transparent text-brand-blue-primary hover:text-brand-blue-secondary hover:bg-brand-blue-primary/5'
  };
  return variants[variant];
};

/**
 * Get size-specific styling classes
 */
const getSizeClasses = (size: CTASize): string => {
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  return sizes[size];
};

/**
 * Collaboration Inquiry CTA Component
 * 
 * Main CTA component that opens collaboration-specific inquiry form
 * with customizable styling and tracking.
 */
export const CollaborationInquiryCTA: React.FC<CollaborationInquiryCTAProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  projectType,
  children,
  className = '',
  onClick,
  trackingLabel = 'Collaboration CTA'
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'click', {
        event_category: 'CTA',
        event_label: trackingLabel,
        value: 1
      });
    }

    // Custom click handler
    if (onClick) {
      onClick();
    }

    // Open form
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CollaborationInquiryData) => {
    try {
      // Analytics tracking for form submission
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'form_submit', {
          event_category: 'Collaboration Inquiry',
          event_label: data.projectType || 'general',
          value: 1
        });
      }

      // TODO: Implement actual form submission logic
      console.log('Collaboration inquiry submitted:', data);
      
      // Close form on successful submission
      setIsFormOpen(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-brand-blue-primary/20
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${trackingLabel} - Open collaboration inquiry form`}
      >
        {children || (
          <>
            <span>Start Collaboration</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </motion.button>

      <CollaborationInquiryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialProjectType={projectType}
      />
    </>
  );
};

/**
 * Pre-configured CTA Variants
 */
export const PrimaryCollaborationCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'variant'>> = (props) => (
  <CollaborationInquiryCTA variant="primary" {...props} />
);

export const SecondaryCollaborationCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'variant'>> = (props) => (
  <CollaborationInquiryCTA variant="secondary" {...props} />
);

export const OutlineCollaborationCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'variant'>> = (props) => (
  <CollaborationInquiryCTA variant="outline" {...props} />
);

export const MinimalCollaborationCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'variant'>> = (props) => (
  <CollaborationInquiryCTA variant="minimal" {...props} />
);

/**
 * Project-Specific CTA Components
 */
export const StudioCollaborationCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'projectType' | 'trackingLabel'>> = (props) => (
  <CollaborationInquiryCTA 
    projectType="studio" 
    trackingLabel="Studio Collaboration CTA"
    {...props}
  >
    {props.children || (
      <>
        <span>Book Studio Session</span>
        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.705-.532-3.283-1.343-4.657a1 1 0 010-1.414z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </>
    )}
  </CollaborationInquiryCTA>
);

export const CreativeProjectCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'projectType' | 'trackingLabel'>> = (props) => (
  <CollaborationInquiryCTA 
    projectType="creative" 
    trackingLabel="Creative Project CTA"
    {...props}
  >
    {props.children || (
      <>
        <span>Start Creative Project</span>
        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </>
    )}
  </CollaborationInquiryCTA>
);

export const PartnershipInquiryCTA: React.FC<Omit<CollaborationInquiryCTAProps, 'projectType' | 'trackingLabel'>> = (props) => (
  <CollaborationInquiryCTA 
    projectType="partnership" 
    trackingLabel="Partnership CTA"
    {...props}
  >
    {props.children || (
      <>
        <span>Explore Partnership</span>
        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      </>
    )}
  </CollaborationInquiryCTA>
);

export default CollaborationInquiryCTA;