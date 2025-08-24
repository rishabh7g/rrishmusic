/**
 * Collaboration Services Page Component
 * 
 * Dedicated page showcasing Rrish's creative partnership offerings and artistic 
 * collaboration capabilities with portfolio integration and process workflow.
 * 
 * Features:
 * - Service overview with creative partnership focus
 * - Instagram collaboration content integration
 * - Process workflow visualization (brief → scope → execution)
 * - "Start Creative Project" CTA with routing
 * - Mobile-responsive implementation
 * - SEO optimization for collaboration services
 */

import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { CollaborationHero } from '@/components/sections/CollaborationHero';
import { CollaborationPortfolio } from '@/components/sections/CollaborationPortfolio';
import { CollaborationProcess } from '@/components/sections/CollaborationProcess';
import { CollaborationCTA } from '@/components/sections/CollaborationCTA';

interface CollaborationPageProps {
  className?: string;
}

/**
 * Collaboration Services Page
 * 
 * Main page component that combines all collaboration-related sections
 * to create a comprehensive creative partnership showcase.
 */
export const Collaboration: React.FC<CollaborationPageProps> = ({ 
  className = '' 
}) => {
  // Configure SEO metadata for the Collaboration page
  usePageSEO({
    title: 'Creative Collaboration Services - Musical Partnerships | Rrish Music',
    description: 'Professional creative collaboration and musical partnership services by Rrish. Studio work, creative projects, artistic partnerships, and collaborative music creation in Melbourne.',
    keywords: 'creative collaboration, musical partnerships, studio work, creative projects, artistic collaboration, Melbourne musician, music collaboration, creative partnerships, studio sessions',
    type: 'website',
    twitterCard: 'summary_large_image'
  });

  return (
    <div className={`collaboration-page min-h-screen bg-white ${className}`}>
      {/* Hero Section - Service overview with creative partnership focus */}
      <CollaborationHero />
      
      {/* Portfolio Section - Instagram collaboration content integration */}
      <CollaborationPortfolio />
      
      {/* Process Section - Brief → Scope → Execution workflow */}
      <CollaborationProcess />
      
      {/* CTA Section - Start Creative Project with appropriate routing */}
      <CollaborationCTA />
    </div>
  );
};

export default Collaboration;