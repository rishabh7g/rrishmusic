/**
 * Teaching Pricing Component
 * Comprehensive explicit pricing display for teaching services with clear packages and calculations
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonPackage } from '@/utils/pricingCalculator';
import { useTeachingPricing } from '@/hooks/useTeachingPricing';
import { formatPrice, getSavingsMessage } from '@/utils/pricingCalculator';

/**
 * Props for TeachingPricing component
 */
interface TeachingPricingProps {
  className?: string;
  showComparison?: boolean;
  enablePackageSelection?: boolean;
  onPackageSelect?: (packageId: string, package: LessonPackage) => void;
  userProfile?: {
    experience?: 'beginner' | 'intermediate' | 'advanced';
    commitment?: 'low' | 'medium' | 'high';
    budget?: 'low' | 'medium' | 'high';
  };
  compact?: boolean;
  variant?: 'default' | 'modal' | 'inline';
}

/**
 * Animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { 
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  }
};

/**
 * TeachingPricing Component
 */
export const TeachingPricing: React.FC<TeachingPricingProps> = ({
  className = '',
  showComparison = true,
  enablePackageSelection = true,
  onPackageSelect,
  userProfile,
  compact = false,
  variant = 'default'
}) => {
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  
  const { state, actions, computed } = useTeachingPricing({
    userProfile,
    enableComparison: showComparison,
    comparisonPackages: ['foundation', 'transformation', 'single']
  });

  /**
   * Handle package selection
   */
  const handlePackageSelect = useCallback((packageId: string) => {
    actions.selectPackage(packageId);
    
    const selectedPackage = actions.getPackageById(packageId);
    if (selectedPackage && onPackageSelect) {
      onPackageSelect(packageId, selectedPackage);
    }
  }, [actions, onPackageSelect]);

  /**
   * Toggle package details expansion
   */
  const togglePackageExpansion = useCallback((packageId: string) => {
    setExpandedPackage(prev => prev === packageId ? null : packageId);
  }, []);

  /**
   * Render package card
   */
  const renderPackageCard = (pkg: LessonPackage, isSelected: boolean = false) => {
    const isExpanded = expandedPackage === pkg.id;
    const isRecommended = pkg.id === state.recommendedPackageId;
    
    return (
      <motion.div
        key={pkg.id}
        variants={cardVariants}
        whileHover="hover"
        className={`
          relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300
          ${isSelected ? 'border-brand-orange-warm ring-4 ring-orange-100' : 'border-gray-200'}
          ${pkg.popular ? 'ring-2 ring-brand-blue-primary' : ''}
          ${compact ? 'p-4' : 'p-6 lg:p-8'}
          cursor-pointer overflow-hidden
          ${className}
        `}
        onClick={() => enablePackageSelection && handlePackageSelect(pkg.id)}
        aria-selected={isSelected}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (enablePackageSelection) { handlePackageSelect(pkg.id); }
          }
        }}
      >
        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-brand-orange-warm text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
          </div>
        )}

        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Recommended
            </div>
          </div>
        )}

        {/* Package Header */}
        <div className="text-center mb-6">
          <h3 className={`font-heading font-bold text-neutral-charcoal mb-2 ${
            compact ? 'text-lg' : 'text-xl lg:text-2xl'
          }`}>
            {pkg.name}
          </h3>

          {/* Pricing Display */}
          <div className="pricing-section">
            <div className={`font-bold text-brand-orange-warm mb-1 ${
              compact ? 'text-2xl' : 'text-3xl lg:text-4xl'
            }`}>
              {formatPrice(pkg.price)}
            </div>

            {/* Original Price & Savings */}
            {pkg.originalPrice && pkg.savings && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-500 line-through text-sm">
                  {formatPrice(pkg.originalPrice)}
                </span>
                <span className="text-green-600 font-medium text-sm">
                  Save {formatPrice(pkg.savings)}
                </span>
              </div>
            )}

            {/* Per Lesson Breakdown */}
            {pkg.sessions > 1 && (
              <div className="text-sm text-gray-600">
                {formatPrice(Math.round(pkg.price / pkg.sessions))} per lesson
              </div>
            )}
          </div>
        </div>

        {/* Package Description */}
        <p className={`text-gray-700 text-center mb-6 ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {pkg.description}
        </p>

        {/* Package Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Sessions:</span>
            <span className="font-medium text-gray-900">{pkg.sessions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{pkg.duration} minutes</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Valid for:</span>
            <span className="font-medium text-gray-900">{pkg.validity} days</span>
          </div>
        </div>

        {/* Package Features */}
        {pkg.features && pkg.features.length > 0 && (
          <div className="mb-6">
            <button
              className="text-sm font-medium text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200 mb-2"
              onClick={(e) => {
                e.stopPropagation();
                togglePackageExpansion(pkg.id);
              }}
            >
              {isExpanded ? 'Hide Details' : 'Show Details'} 
              <span className={`ml-1 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}>▼</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 text-sm text-gray-700">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-brand-orange-warm mr-2 mt-1 text-xs">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && enablePackageSelection && (
          <div className="absolute bottom-4 right-4">
            <div className="w-6 h-6 bg-brand-orange-warm rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange-warm" />
        <span className="ml-3 text-gray-600">Loading pricing...</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">Failed to load pricing</p>
        <p className="text-red-600 text-sm mt-1">{state.error}</p>
        <button
          onClick={actions.refreshPricing}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className={`py-12 ${variant === 'modal' ? '' : 'lg:py-16'} ${className}`}>
      <div className={variant === 'modal' ? 'space-y-8' : 'container-custom'}>
        {/* Section Header */}
        {variant !== 'inline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className={`font-heading font-bold text-neutral-charcoal mb-4 ${
              compact ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl xl:text-5xl'
            }`}>
              Choose Your Learning Package
            </h2>
            <p className={`text-gray-700 max-w-3xl mx-auto ${
              compact ? 'text-base' : 'text-lg lg:text-xl'
            }`}>
              Transparent pricing with no hidden fees. All packages include personalized instruction, 
              practice materials, and ongoing support.
            </p>
          </motion.div>
        )}

        {/* Package Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-6 ${
            compact 
              ? 'md:grid-cols-2 lg:grid-cols-4' 
              : 'md:grid-cols-2 lg:grid-cols-4 lg:gap-8'
          }`}
        >
          {state.packages.map(pkg => 
            renderPackageCard(
              pkg, 
              enablePackageSelection && state.selectedPackageId === pkg.id
            )
          )}
        </motion.div>

        {/* Selected Package Summary */}
        {enablePackageSelection && state.selectedPackage && state.pricing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 rounded-xl p-6 lg:p-8 mt-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Selected: {state.selectedPackage.name}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-orange-warm">
                  {formatPrice(state.selectedPackage.price)}
                </div>
                <div className="text-sm text-gray-600">Total Price</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-brand-blue-primary">
                  {formatPrice(computed.pricePerLesson)}
                </div>
                <div className="text-sm text-gray-600">Per Lesson</div>
              </div>
              
              {computed.hasDiscount && (
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(computed.savingsAmount)}
                  </div>
                  <div className="text-sm text-gray-600">You Save</div>
                </div>
              )}
            </div>

            {computed.hasDiscount && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
                <p className="text-green-800 font-medium">
                  {getSavingsMessage(state.pricing)}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Package Comparison */}
        {showComparison && computed.comparisonEnabled && state.comparison.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gray-50 rounded-xl p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Package Comparison
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4">Package</th>
                    <th className="text-center py-3 px-4">Sessions</th>
                    <th className="text-center py-3 px-4">Price</th>
                    <th className="text-center py-3 px-4">Per Lesson</th>
                    <th className="text-center py-3 px-4">Savings</th>
                    <th className="text-center py-3 px-4">Value Score</th>
                  </tr>
                </thead>
                <tbody>
                  {state.comparison.map(({ package: pkg, pricing, valueScore }) => (
                    <tr key={pkg.id} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium">{pkg.name}</td>
                      <td className="py-3 px-4 text-center">{pkg.sessions}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        {formatPrice(pkg.price)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {formatPrice(pricing.pricePerLesson)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {pricing.discountApplied ? (
                          <span className="text-green-600 font-medium">
                            {formatPrice(pricing.savings)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-brand-orange-warm h-2 rounded-full" 
                              style={{ width: `${Math.min(valueScore, 100)}%` }}
                            />
                          </div>
                          <span className="ml-2 text-xs">{valueScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-blue-50 rounded-xl p-6 lg:p-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            All Packages Include:
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-brand-blue-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">♪</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Personalized Instruction</h4>
              <p className="text-sm text-gray-600">
                Every lesson tailored to your goals and skill level
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-brand-orange-warm rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Practice Materials</h4>
              <p className="text-sm text-gray-600">
                Custom tabs, chord charts, and learning resources
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">💬</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Ongoing Support</h4>
              <p className="text-sm text-gray-600">
                Email support between lessons for any questions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeachingPricing;