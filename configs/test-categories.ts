/**
 * Test Categorization and Execution Strategy
 * 
 * Defines test categories, patterns, and execution priorities
 * for optimal CI/CD performance and comprehensive local development
 */

export interface TestCategory {
  name: string;
  pattern: string[];
  timeout: number;
  parallel: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  ciEnabled: boolean;
  localEnabled: boolean;
  description: string;
  estimatedTime: string;
}

export const TEST_CATEGORIES: TestCategory[] = [
  {
    name: 'smoke',
    pattern: ['**/*.smoke.test.{ts,tsx}'],
    timeout: 2000,
    parallel: true,
    priority: 'critical',
    ciEnabled: true,
    localEnabled: true,
    description: 'Critical path functionality - fastest execution',
    estimatedTime: '<30 seconds'
  },
  {
    name: 'unit-fast',
    pattern: [
      'src/utils/**/*.test.{ts,tsx}',
      'src/hooks/**/*.test.{ts,tsx}',
      'src/types/**/*.test.{ts,tsx}',
      'src/content/**/*.test.{ts,tsx}'
    ],
    timeout: 3000,
    parallel: true,
    priority: 'critical',
    ciEnabled: true,
    localEnabled: true,
    description: 'Fast unit tests - utilities, hooks, pure functions',
    estimatedTime: '<1 minute'
  },
  {
    name: 'component-fast',
    pattern: [
      'src/components/**/*.test.{ts,tsx}',
      'src/components/**/*.ci.test.{ts,tsx}'
    ],
    timeout: 5000,
    parallel: true,
    priority: 'high',
    ciEnabled: true,
    localEnabled: true,
    description: 'Component tests optimized for CI',
    estimatedTime: '<2 minutes'
  },
  {
    name: 'integration-light',
    pattern: ['**/*.integration.test.{ts,tsx}'],
    timeout: 10000,
    parallel: true,
    priority: 'medium',
    ciEnabled: false,
    localEnabled: true,
    description: 'Lightweight integration tests',
    estimatedTime: '2-5 minutes'
  },
  {
    name: 'e2e-smoke',
    pattern: ['tests/e2e/smoke.spec.ts'],
    timeout: 30000,
    parallel: false,
    priority: 'high',
    ciEnabled: true,
    localEnabled: true,
    description: 'Critical E2E paths only',
    estimatedTime: '1-2 minutes'
  },
  {
    name: 'e2e-full',
    pattern: ['tests/e2e/**/*.spec.ts'],
    timeout: 60000,
    parallel: true,
    priority: 'medium',
    ciEnabled: false,
    localEnabled: true,
    description: 'Complete E2E test suite',
    estimatedTime: '5-10 minutes'
  },
  {
    name: 'performance',
    pattern: ['tests/performance/**/*.perf.test.{ts,tsx}'],
    timeout: 30000,
    parallel: false,
    priority: 'low',
    ciEnabled: false,
    localEnabled: true,
    description: 'Performance and benchmark tests',
    estimatedTime: '3-5 minutes'
  },
  {
    name: 'visual',
    pattern: ['tests/visual/**/*.spec.ts'],
    timeout: 45000,
    parallel: true,
    priority: 'low',
    ciEnabled: false,
    localEnabled: true,
    description: 'Visual regression tests',
    estimatedTime: '5-8 minutes'
  },
  {
    name: 'accessibility',
    pattern: ['tests/accessibility/**/*.test.{ts,tsx}'],
    timeout: 15000,
    parallel: true,
    priority: 'medium',
    ciEnabled: false,
    localEnabled: true,
    description: 'WCAG compliance and accessibility tests',
    estimatedTime: '2-3 minutes'
  }
];

// CI-specific configurations
export const CI_TEST_CONFIGS = {
  fast: {
    categories: ['smoke', 'unit-fast', 'component-fast'],
    maxTime: 300000, // 5 minutes
    parallel: true,
    coverage: false
  },
  standard: {
    categories: ['smoke', 'unit-fast', 'component-fast', 'e2e-smoke'],
    maxTime: 600000, // 10 minutes
    parallel: true,
    coverage: true
  },
  comprehensive: {
    categories: ['smoke', 'unit-fast', 'component-fast', 'integration-light', 'e2e-smoke'],
    maxTime: 900000, // 15 minutes
    parallel: true,
    coverage: true
  }
};

// Local development configurations
export const LOCAL_TEST_CONFIGS = {
  quick: {
    categories: ['smoke', 'unit-fast'],
    description: 'Quick validation during development',
    estimatedTime: '1-2 minutes'
  },
  standard: {
    categories: ['smoke', 'unit-fast', 'component-fast', 'integration-light'],
    description: 'Standard development testing',
    estimatedTime: '5-8 minutes'
  },
  full: {
    categories: TEST_CATEGORIES.map(c => c.name),
    description: 'Complete test suite - all categories',
    estimatedTime: '20-30 minutes'
  },
  precommit: {
    categories: ['smoke', 'unit-fast'],
    description: 'Pre-commit validation',
    estimatedTime: '1-2 minutes'
  },
  prepush: {
    categories: ['smoke', 'unit-fast', 'component-fast'],
    description: 'Pre-push validation',
    estimatedTime: '3-5 minutes'
  }
};

// Test execution priorities
export const EXECUTION_PRIORITIES = {
  critical: 0,  // Run first, fail fast
  high: 1,      // Run early
  medium: 2,    // Standard priority
  low: 3        // Run last
};

// Timeout configurations
export const TIMEOUTS = {
  ci: {
    unit: 3000,
    integration: 10000,
    e2e: 30000,
    performance: 15000,
    visual: 30000
  },
  local: {
    unit: 5000,
    integration: 15000,
    e2e: 60000,
    performance: 30000,
    visual: 45000
  }
};

// Parallel execution settings
export const PARALLEL_SETTINGS = {
  ci: {
    maxWorkers: 8,
    minWorkers: 2,
    maxConcurrency: 8
  },
  local: {
    maxWorkers: 4,
    minWorkers: 1,
    maxConcurrency: 4
  }
};

/**
 * Get tests to run based on environment and configuration
 */
export function getTestsForEnvironment(
  environment: 'ci-fast' | 'ci-standard' | 'ci-comprehensive' | 'local-quick' | 'local-standard' | 'local-full',
  changedFiles?: string[]
): TestCategory[] {
  const isCI = environment.startsWith('ci');
  const configKey = isCI 
    ? environment.replace('ci-', '') as keyof typeof CI_TEST_CONFIGS
    : environment.replace('local-', '') as keyof typeof LOCAL_TEST_CONFIGS;
  
  const config = isCI ? CI_TEST_CONFIGS[configKey] : LOCAL_TEST_CONFIGS[configKey];
  const categories = config.categories;
  
  let relevantTests = TEST_CATEGORIES.filter(category => 
    categories.includes(category.name) &&
    (isCI ? category.ciEnabled : category.localEnabled)
  );
  
  // File-based test selection for efficiency
  if (changedFiles && changedFiles.length > 0) {
    relevantTests = relevantTests.filter(category =>
      changedFiles.some(file =>
        category.pattern.some(pattern =>
          file.includes(pattern.replace('**/', '').replace('*.', '.'))
        )
      )
    );
  }
  
  // Sort by priority
  return relevantTests.sort((a, b) => 
    EXECUTION_PRIORITIES[a.priority] - EXECUTION_PRIORITIES[b.priority]
  );
}

/**
 * Generate test command based on category and environment
 */
export function generateTestCommand(
  categories: string[],
  environment: 'ci' | 'local' = 'local'
): string {
  const commands = categories.map(category => {
    const config = TEST_CATEGORIES.find(c => c.name === category);
    if (!config) return '';
    
    switch (category) {
      case 'smoke':
        return 'vitest run --config configs/vitest.config.smoke.ts';
      case 'unit-fast':
        return 'vitest run --config configs/vitest.config.ci-fast.ts';
      case 'component-fast':
        return 'vitest run --config configs/vitest.config.ci-fast.ts src/components';
      case 'e2e-smoke':
        return 'playwright test tests/e2e/smoke.spec.ts';
      default:
        return `npm run test:${category}`;
    }
  }).filter(cmd => cmd);
  
  return commands.join(' && ');
}

export default {
  TEST_CATEGORIES,
  CI_TEST_CONFIGS,
  LOCAL_TEST_CONFIGS,
  EXECUTION_PRIORITIES,
  TIMEOUTS,
  PARALLEL_SETTINGS,
  getTestsForEnvironment,
  generateTestCommand
};