/**
 * WCAG Accessibility Color Contrast Analysis Tool
 * 
 * This utility analyzes color combinations for WCAG 2.1 AA and AAA compliance
 * Focuses on yellow accent (#fbbf24) usage throughout the platform
 */

// Brand colors from tailwind.config.js
export const brandColors = {
  'brand-blue-primary': '#1e40af',      // Deep blue for main elements  
  'brand-blue-secondary': '#3b82f6',    // Lighter blue for hover states
  'brand-yellow-accent': '#fbbf24',     // Golden yellow for highlights
  'brand-green-success': '#10b981',     // Green for success states
  'brand-orange-warm': '#ea580c',       // Warm orange accent
  'neutral-charcoal': '#374151',        // Dark gray for text
  'neutral-white': '#ffffff',           // Pure white
  'neutral-gray-50': '#f9fafb',         // Very light gray
  'neutral-gray-100': '#f3f4f6',        // Light gray
  'neutral-gray-800': '#1f2937',        // Dark gray
  'neutral-gray-900': '#111827',        // Very dark gray
} as const;

// Common background colors where yellow accent is used
export const backgroundColors = {
  'blue-primary': brandColors['brand-blue-primary'],
  'blue-secondary': brandColors['brand-blue-secondary'], 
  'white': brandColors['neutral-white'],
  'charcoal': brandColors['neutral-charcoal'],
  'gray-50': brandColors['neutral-gray-50'],
  'gray-800': brandColors['neutral-gray-800'],
  'gray-900': brandColors['neutral-gray-900'],
  // Gradient backgrounds (using dominant color for testing)
  'blue-gradient-bg': brandColors['brand-blue-primary'], // Approximation of blue gradients
} as const;

/**
 * Calculate relative luminance of a color
 * @param color Hex color string (e.g., '#fbbf24')
 * @returns Relative luminance value (0-1)
 */
export function getRelativeLuminance(color: string): number {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 First color (hex)
 * @param color2 Second color (hex) 
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 * @param ratio Contrast ratio
 * @returns Object with AA and AAA compliance status
 */
export function checkWCAGCompliance(ratio: number) {
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA_normal: ratio >= 4.5,   // WCAG 2.1 AA normal text (4.5:1)
    AA_large: ratio >= 3.0,    // WCAG 2.1 AA large text (3.0:1) 
    AAA_normal: ratio >= 7.0,  // WCAG 2.1 AAA normal text (7.0:1)
    AAA_large: ratio >= 4.5,   // WCAG 2.1 AAA large text (4.5:1)
  };
}

/**
 * Analyze yellow accent accessibility across all background colors
 * @returns Complete analysis of yellow accent usage
 */
export function analyzeYellowAccentAccessibility() {
  const yellowAccent = brandColors['brand-yellow-accent'];
  const results = [];
  
  console.log('🔍 WCAG Accessibility Analysis: Yellow Accent (#fbbf24)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  for (const [bgName, bgColor] of Object.entries(backgroundColors)) {
    const ratio = getContrastRatio(yellowAccent, bgColor);
    const compliance = checkWCAGCompliance(ratio);
    
    const result = {
      background: bgName,
      backgroundColor: bgColor,
      foregroundColor: yellowAccent,
      contrastRatio: compliance.ratio,
      wcagAA: compliance.AA_normal,
      wcagAAA: compliance.AAA_normal,
      wcagAA_large: compliance.AA_large,
      wcagAAA_large: compliance.AAA_large,
      status: compliance.AA_normal ? '✅ PASS' : '❌ FAIL',
      severity: compliance.AA_normal ? 'COMPLIANT' : (compliance.AA_large ? 'LARGE_TEXT_ONLY' : 'NON_COMPLIANT')
    };
    
    results.push(result);
    
    // Console output for analysis
    console.log(`Background: ${bgName.toUpperCase().padEnd(15)} | ${bgColor}`);
    console.log(`Contrast Ratio: ${compliance.ratio}:1`);
    console.log(`WCAG AA Normal: ${compliance.AA_normal ? '✅ PASS' : '❌ FAIL'} (≥4.5:1)`);
    console.log(`WCAG AA Large:  ${compliance.AA_large ? '✅ PASS' : '❌ FAIL'} (≥3.0:1)`);
    console.log(`WCAG AAA Normal:${compliance.AAA_normal ? '✅ PASS' : '❌ FAIL'} (≥7.0:1)`);
    console.log(`Status: ${result.status} - ${result.severity}`);
    console.log('─'.repeat(60));
  }
  
  return results;
}

/**
 * Generate recommendations for improving accessibility
 * @param results Analysis results from analyzeYellowAccentAccessibility()
 * @returns Array of actionable recommendations
 */
export function generateAccessibilityRecommendations(results: ReturnType<typeof analyzeYellowAccentAccessibility>) {
  const recommendations = [];
  const failedCombinations = results.filter(r => !r.wcagAA);
  
  if (failedCombinations.length === 0) {
    recommendations.push({
      type: 'SUCCESS',
      priority: 'LOW',
      message: '🎉 All yellow accent color combinations meet WCAG AA standards!'
    });
    return recommendations;
  }
  
  console.log('\n🚨 ACCESSIBILITY ISSUES FOUND:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  failedCombinations.forEach(combo => {
    console.log(`❌ FAILED: Yellow accent on ${combo.background}`);
    console.log(`   Ratio: ${combo.contrastRatio}:1 (needs ≥4.5:1 for AA)`);
    console.log(`   Severity: ${combo.severity}`);
    
    if (combo.severity === 'NON_COMPLIANT') {
      recommendations.push({
        type: 'CRITICAL',
        priority: 'HIGH',
        background: combo.background,
        currentRatio: combo.contrastRatio,
        requiredRatio: 4.5,
        message: `Critical: Yellow accent on ${combo.background} is not accessible. Consider alternative colors or usage patterns.`
      });
    } else if (combo.severity === 'LARGE_TEXT_ONLY') {
      recommendations.push({
        type: 'WARNING', 
        priority: 'MEDIUM',
        background: combo.background,
        currentRatio: combo.contrastRatio,
        requiredRatio: 4.5,
        message: `Warning: Yellow accent on ${combo.background} only works for large text (≥18pt). Avoid for normal text.`
      });
    }
  });
  
  // Generate alternative color suggestions
  if (failedCombinations.length > 0) {
    recommendations.push({
      type: 'SOLUTION',
      priority: 'HIGH', 
      message: 'Consider these alternatives:',
      alternatives: [
        { color: '#f59e0b', name: 'Darker Yellow', ratio: getContrastRatio('#f59e0b', brandColors['brand-blue-primary']) },
        { color: '#d97706', name: 'Amber Orange', ratio: getContrastRatio('#d97706', brandColors['brand-blue-primary']) },
        { color: '#ffffff', name: 'White Text', ratio: getContrastRatio('#ffffff', brandColors['brand-blue-primary']) },
      ]
    });
  }
  
  return recommendations;
}

/**
 * Suggest improved yellow accent color that meets WCAG standards
 * @param targetBackgrounds Array of background colors to optimize for
 * @returns Suggested color improvements
 */
export function suggestImprovedYellowAccent(targetBackgrounds: string[] = [brandColors['brand-blue-primary']]) {
  const suggestions = [];
  
  // Test different shades of yellow/amber
  const yellowVariations = [
    { name: 'Current Yellow', hex: '#fbbf24' },
    { name: 'Darker Yellow', hex: '#f59e0b' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Dark Amber', hex: '#b45309' },
    { name: 'Orange Amber', hex: '#ea580c' },
    { name: 'Bright Orange', hex: '#dc2626' },
  ];
  
  console.log('\n💡 ALTERNATIVE COLOR SUGGESTIONS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  for (const variation of yellowVariations) {
    const results = targetBackgrounds.map(bg => {
      const ratio = getContrastRatio(variation.hex, bg);
      const compliance = checkWCAGCompliance(ratio);
      return {
        background: bg,
        ratio: compliance.ratio,
        wcagAA: compliance.AA_normal,
        status: compliance.AA_normal ? '✅ PASS' : '❌ FAIL'
      };
    });
    
    const allPass = results.every(r => r.wcagAA);
    
    suggestions.push({
      name: variation.name,
      hex: variation.hex,
      results,
      recommended: allPass,
      status: allPass ? '✅ RECOMMENDED' : '❌ NOT SUITABLE'
    });
    
    console.log(`${variation.name.padEnd(15)} | ${variation.hex} | ${allPass ? '✅ RECOMMENDED' : '❌ NOT SUITABLE'}`);
    results.forEach(r => {
      const bgName = Object.entries(brandColors).find(([, v]) => v === r.background)?.[0] || r.background;
      console.log(`  vs ${bgName}: ${r.ratio}:1 ${r.status}`);
    });
    console.log('─'.repeat(60));
  }
  
  return suggestions;
}

// Export analysis functions for use in development
export const accessibility = {
  analyzeYellowAccentAccessibility,
  generateAccessibilityRecommendations,
  suggestImprovedYellowAccent,
  getContrastRatio,
  checkWCAGCompliance,
  getRelativeLuminance,
};

export default accessibility;