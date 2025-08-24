/**
 * Service Navigation Controls Component
 * 
 * Provides interactive navigation controls for smooth transitions between services
 * with keyboard support, accessibility features, and visual feedback
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceType } from '@/types/content';
import { useServiceNavigation } from '@/hooks/useServiceNavigation';

/**
 * Service Navigation Controls Props
 */
interface ServiceNavigationControlsProps {
  className?: string;
  position?: 'fixed' | 'sticky' | 'relative';
  showLabels?: boolean;
  compact?: boolean;
}

/**
 * Individual Service Button Props
 */
interface ServiceButtonProps {
  service: ServiceType;
  active: boolean;
  onClick: () => void;
  showLabel?: boolean;
  compact?: boolean;
}

/**
 * Service metadata
 */
const SERVICE_META: Record<ServiceType, {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
}> = {
  performance: {
    label: 'Live Performances',
    shortLabel: 'Perform',
    icon: '🎸',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Professional live music performances'
  },
  teaching: {
    label: 'Music Lessons',
    shortLabel: 'Teach',
    icon: '🎓',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    description: 'Personalized music instruction'
  },
  collaboration: {
    label: 'Music Collaboration',
    shortLabel: 'Collab',
    icon: '🤝',
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    description: 'Creative musical partnerships'
  }
};

/**
 * Service Button Component
 */
const ServiceButton: React.FC<ServiceButtonProps> = ({
  service,
  active,
  onClick,
  showLabel = true,
  compact = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const meta = SERVICE_META[service];

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group flex items-center justify-center
        ${compact ? 'p-2' : 'px-4 py-3'}
        rounded-xl transition-all duration-300 ease-out
        hover:scale-105 focus:scale-105
        ${active 
          ? 'bg-white/20 shadow-lg backdrop-blur-sm' 
          : 'bg-white/10 hover:bg-white/15'
        }
        border border-white/20 hover:border-white/30
        focus:outline-none focus:ring-2 focus:ring-white/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={`Navigate to ${meta.label}`}
      title={meta.description}
    >
      {/* Background gradient effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${meta.color}`}
        animate={{ opacity: active ? 0.3 : 0 }}
        whileHover={{ opacity: 0.4 }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center space-x-2 text-white">
        {/* Service Icon */}
        <motion.span
          className={`text-xl ${compact ? 'text-base' : 'text-xl'}`}
          animate={{ 
            scale: active ? 1.1 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0
          }}
          transition={{ 
            scale: { duration: 0.2 },
            rotate: { duration: 0.6, ease: 'easeInOut' }
          }}
        >
          {meta.icon}
        </motion.span>
        
        {/* Service Label */}
        {showLabel && (
          <motion.span
            className={`font-medium ${compact ? 'text-sm' : 'text-base'} whitespace-nowrap`}
            animate={{ 
              opacity: compact ? (active || isHovered ? 1 : 0) : 1,
              x: compact ? (active || isHovered ? 0 : -10) : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {compact ? meta.shortLabel : meta.label}
          </motion.span>
        )}
        
        {/* Active indicator */}
        {active && (
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {/* Ripple effect on click */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/10"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/**
 * Arrow Navigation Button
 */
interface ArrowButtonProps {
  direction: 'up' | 'down';
  onClick: () => void;
  disabled: boolean;
  compact?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
  compact = false
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`
      ${compact ? 'p-2' : 'px-3 py-2'}
      rounded-lg bg-white/10 hover:bg-white/20
      border border-white/20 hover:border-white/30
      text-white hover:text-white
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-white/50
      disabled:opacity-30 disabled:cursor-not-allowed
      group
    `}
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    aria-label={`Navigate ${direction}`}
  >
    <motion.svg
      className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      animate={{ 
        y: direction === 'up' ? 0 : 0,
        rotate: direction === 'up' ? 180 : 0
      }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 14l-7-7m0 0l-7 7m7-7v18" 
      />
    </motion.svg>
  </motion.button>
);

/**
 * Service Navigation Controls Component
 */
export const ServiceNavigationControls: React.FC<ServiceNavigationControlsProps> = ({
  className = '',
  position = 'fixed',
  showLabels = true,
  compact = false
}) => {
  const {
    activeService,
    isNavigating,
    canNavigateNext,
    canNavigatePrevious,
    navigateToService,
    navigateNext,
    navigatePrevious,
    servicesOrder
  } = useServiceNavigation();

  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Handle service navigation
   */
  const handleServiceClick = async (service: ServiceType) => {
    if (isNavigating) return;
    await navigateToService(service);
  };

  /**
   * Position classes
   */
  const positionClasses = {
    fixed: 'fixed top-1/2 right-6 transform -translate-y-1/2 z-50',
    sticky: 'sticky top-20 z-40',
    relative: 'relative'
  };

  return (
    <motion.nav
      className={`
        ${positionClasses[position]}
        ${className}
      `}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="navigation"
      aria-label="Service navigation"
    >
      <div className={`
        flex ${position === 'fixed' ? 'flex-col' : 'flex-row'} 
        space-${position === 'fixed' ? 'y' : 'x'}-2
        p-3 rounded-2xl 
        bg-black/20 backdrop-blur-md 
        border border-white/20
        shadow-2xl
      `}>
        {/* Navigation up arrow (only for fixed position) */}
        {position === 'fixed' && (
          <ArrowButton
            direction="up"
            onClick={navigatePrevious}
            disabled={!canNavigatePrevious || isNavigating}
            compact={compact}
          />
        )}
        
        {/* Service buttons */}
        <div className={`
          flex ${position === 'fixed' ? 'flex-col' : 'flex-row'}
          space-${position === 'fixed' ? 'y' : 'x'}-2
        `}>
          {servicesOrder.map((service) => (
            <ServiceButton
              key={service}
              service={service}
              active={activeService === service}
              onClick={() => handleServiceClick(service)}
              showLabel={showLabels && (position !== 'fixed' || isExpanded)}
              compact={compact}
            />
          ))}
        </div>
        
        {/* Navigation down arrow (only for fixed position) */}
        {position === 'fixed' && (
          <ArrowButton
            direction="down"
            onClick={navigateNext}
            disabled={!canNavigateNext || isNavigating}
            compact={compact}
          />
        )}
      </div>
      
      {/* Keyboard shortcuts hint */}
      {position === 'fixed' && isExpanded && (
        <motion.div
          className="mt-3 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs text-white/70 space-y-1">
            <div>↑↓ Navigate</div>
            <div>1-3 Jump to service</div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default ServiceNavigationControls;