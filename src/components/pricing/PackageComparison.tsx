/**
 * Package Comparison Component
 * Side-by-side comparison of teaching packages with detailed analysis
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LessonPackage, PricingCalculation, formatPrice, comparePackages } from '@/utils/pricingCalculator';

/**
 * Props for PackageComparison component
 */
interface PackageComparisonProps {
  packages?: LessonPackage[];
  packageIds?: string[];
  className?: string;
  onPackageSelect?: (packageId: string) => void;
  selectedPackageId?: string;
  showValueScore?: boolean;
  showFeatures?: boolean;
  variant?: 'table' | 'cards' | 'detailed';
  maxPackages?: number;
}

/**
 * Comparison data structure
 */
interface ComparisonData {
  package: LessonPackage;
  pricing: PricingCalculation;
  valueScore: number;
}

/**
 * Comparison feature analysis
 */
interface FeatureComparison {
  feature: string;
  availability: Record<string, boolean>;
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

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

/**
 * PackageComparison Component
 */
export const PackageComparison: React.FC<PackageComparisonProps> = ({
  packages,
  packageIds = ['foundation', 'transformation', 'single'],
  className = '',
  onPackageSelect,
  selectedPackageId,
  showValueScore = true,
  showFeatures = true,
  variant = 'table',
  maxPackages = 4
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'value' | 'sessions'>('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get comparison data
  const comparisonData = useMemo<ComparisonData[]>(() => {
    if (packages) {
      // Use provided packages with pricing calculations
      return packages.slice(0, maxPackages).map(pkg => ({
        package: pkg,
        pricing: {
          basePrice: pkg.originalPrice || pkg.price,
          finalPrice: pkg.price,
          savings: pkg.savings || 0,
          savingsPercentage: pkg.savings && pkg.originalPrice 
            ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
            : 0,
          pricePerLesson: Math.round(pkg.price / pkg.sessions),
          totalValue: pkg.originalPrice || pkg.price,
          discountApplied: Boolean(pkg.savings)
        },
        valueScore: calculateValueScore(pkg)
      }));
    } else {
      // Use package IDs to generate comparison
      return comparePackages(packageIds.slice(0, maxPackages));
    }
  }, [packages, packageIds, maxPackages]);

  // Sort comparison data
  const sortedData = useMemo(() => {
    const sorted = [...comparisonData].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'name':
          return sortDirection === 'asc' 
            ? a.package.name.localeCompare(b.package.name)
            : b.package.name.localeCompare(a.package.name);
        case 'price':
          aValue = a.package.price;
          bValue = b.package.price;
          break;
        case 'value':
          aValue = a.valueScore;
          bValue = b.valueScore;
          break;
        case 'sessions':
          aValue = a.package.sessions;
          bValue = b.package.sessions;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [comparisonData, sortBy, sortDirection]);

  // Feature comparison analysis
  const featureComparison = useMemo<FeatureComparison[]>(() => {
    if (!showFeatures) return [];

    const allFeatures = new Set<string>();
    comparisonData.forEach(({ package: pkg }) => {
      pkg.features?.forEach(feature => allFeatures.add(feature));
    });

    return Array.from(allFeatures).map(feature => ({
      feature,
      availability: comparisonData.reduce((acc, { package: pkg }) => {
        acc[pkg.id] = Boolean(pkg.features?.includes(feature));
        return acc;
      }, {} as Record<string, boolean>)
    }));
  }, [comparisonData, showFeatures]);

  /**
   * Handle sort change
   */
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  /**
   * Get sort icon
   */
  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  /**
   * Render table variant
   */
  const renderTableVariant = () => (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium text-gray-900">Package</th>
            <th 
              className="text-center p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('sessions')}
            >
              Sessions {getSortIcon('sessions')}
            </th>
            <th 
              className="text-center p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('price')}
            >
              Total Price {getSortIcon('price')}
            </th>
            <th className="text-center p-4 font-medium text-gray-900">Per Lesson</th>
            <th className="text-center p-4 font-medium text-gray-900">Savings</th>
            {showValueScore && (
              <th 
                className="text-center p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('value')}
              >
                Value Score {getSortIcon('value')}
              </th>
            )}
            <th className="text-center p-4 font-medium text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(({ package: pkg, pricing, valueScore }) => (
            <motion.tr
              key={pkg.id}
              variants={itemVariants}
              className={`border-t hover:bg-gray-50 ${
                selectedPackageId === pkg.id ? 'bg-orange-50' : ''
              }`}
            >
              <td className="p-4">
                <div className="flex items-center">
                  {pkg.popular && (
                    <span className="bg-brand-orange-warm text-white text-xs px-2 py-1 rounded-full mr-2">
                      Popular
                    </span>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{pkg.name}</div>
                    <div className="text-sm text-gray-600">{pkg.description}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-center font-medium">{pkg.sessions}</td>
              <td className="p-4 text-center">
                <div className="font-bold text-lg text-brand-orange-warm">
                  {formatPrice(pkg.price)}
                </div>
                {pkg.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(pkg.originalPrice)}
                  </div>
                )}
              </td>
              <td className="p-4 text-center font-medium">
                {formatPrice(pricing.pricePerLesson)}
              </td>
              <td className="p-4 text-center">
                {pricing.discountApplied ? (
                  <div className="text-green-600 font-medium">
                    {formatPrice(pricing.savings)}
                    <div className="text-xs">({pricing.savingsPercentage}%)</div>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              {showValueScore && (
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-orange-warm h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((valueScore / 100) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium">{valueScore}</span>
                  </div>
                </td>
              )}
              <td className="p-4 text-center">
                <button
                  onClick={() => onPackageSelect?.(pkg.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedPackageId === pkg.id
                      ? 'bg-brand-orange-warm text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPackageId === pkg.id ? 'Selected' : 'Select'}
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /**
   * Render cards variant
   */
  const renderCardsVariant = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedData.map(({ package: pkg, pricing, valueScore }) => (
        <motion.div
          key={pkg.id}
          variants={itemVariants}
          className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-200 ${
            selectedPackageId === pkg.id 
              ? 'border-brand-orange-warm ring-2 ring-orange-100' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
              {pkg.popular && (
                <span className="inline-block bg-brand-orange-warm text-white text-xs px-2 py-1 rounded-full mt-1">
                  Popular
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl text-brand-orange-warm">
                {formatPrice(pkg.price)}
              </div>
              <div className="text-sm text-gray-600">
                {formatPrice(pricing.pricePerLesson)}/lesson
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sessions:</span>
              <span className="font-medium">{pkg.sessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{pkg.duration} min</span>
            </div>
            {pricing.discountApplied && (
              <div className="flex justify-between text-green-600">
                <span>Savings:</span>
                <span className="font-medium">
                  {formatPrice(pricing.savings)} ({pricing.savingsPercentage}%)
                </span>
              </div>
            )}
            {showValueScore && (
              <div className="flex justify-between">
                <span className="text-gray-600">Value Score:</span>
                <span className="font-medium">{valueScore}/100</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => onPackageSelect?.(pkg.id)}
            className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
              selectedPackageId === pkg.id
                ? 'bg-brand-orange-warm text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedPackageId === pkg.id ? '✓ Selected' : 'Select Package'}
          </button>
        </motion.div>
      ))}
    </div>
  );

  /**
   * Render detailed variant with features
   */
  const renderDetailedVariant = () => (
    <div className="space-y-8">
      {/* Main comparison */}
      {renderTableVariant()}

      {/* Feature comparison */}
      {showFeatures && featureComparison.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900">Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Feature</th>
                  {sortedData.map(({ package: pkg }) => (
                    <th key={pkg.id} className="text-center p-4 font-medium text-gray-900">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.map(({ feature, availability }) => (
                  <tr key={feature} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-700">{feature}</td>
                    {sortedData.map(({ package: pkg }) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {availability[pkg.id] ? (
                          <span className="text-green-600 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`package-comparison ${className}`}
    >
      {variant === 'table' && renderTableVariant()}
      {variant === 'cards' && renderCardsVariant()}
      {variant === 'detailed' && renderDetailedVariant()}
    </motion.div>
  );
};

/**
 * Calculate value score for a package (simplified version)
 */
function calculateValueScore(pkg: LessonPackage): number {
  let score = 0;
  
  // Base score from sessions
  score += pkg.sessions * 10;
  
  // Discount bonus
  if (pkg.savings && pkg.originalPrice) {
    const discountPercent = ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100;
    score += discountPercent * 2;
  }
  
  // Popular package bonus
  if (pkg.popular) {
    score += 20;
  }
  
  // Feature count bonus
  if (pkg.features) {
    score += pkg.features.length * 5;
  }
  
  return Math.round(score);
}

export default PackageComparison;