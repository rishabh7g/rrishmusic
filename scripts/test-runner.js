#!/usr/bin/env node

/**
 * Test Runner Helper Script for RrishMusic
 * 
 * This script provides a convenient interface to run different test suites
 * and interact with the comprehensive CI/CD workflow system.
 * 
 * Usage:
 *   npm run test-runner -- --suite comprehensive
 *   npm run test-runner -- --category unit --coverage
 *   npm run test-runner -- --help
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test configuration
const configPath = join(__dirname, '..', '.github', 'test-config.json');
let testConfig;

try {
  testConfig = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('❌ Failed to load test configuration:', error.message);
  process.exit(1);
}

// Color output functions
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    suite: null,
    category: null,
    coverage: false,
    watch: false,
    environment: 'local',
    browser: 'chromium',
    verbose: false,
    list: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--suite':
      case '-s':
        options.suite = args[++i];
        break;
      case '--category':
      case '-c':
        options.category = args[++i];
        break;
      case '--coverage':
        options.coverage = true;
        break;
      case '--watch':
      case '-w':
        options.watch = true;
        break;
      case '--environment':
      case '-e':
        options.environment = args[++i];
        break;
      case '--browser':
      case '-b':
        options.browser = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--list':
      case '-l':
        options.list = true;
        break;
      default:
        console.error(colors.red(`Unknown argument: ${arg}`));
        process.exit(1);
    }
  }

  return options;
}

// Display help information
function showHelp() {
  console.log(colors.bold('RrishMusic Test Runner'));
  console.log('');
  console.log(colors.cyan('Usage:'));
  console.log('  npm run test-runner -- [options]');
  console.log('');
  console.log(colors.cyan('Options:'));
  console.log('  --help, -h              Show this help message');
  console.log('  --list, -l              List available test suites and categories');
  console.log('  --suite, -s <name>      Run a specific test suite');
  console.log('  --category, -c <name>   Run a specific test category');
  console.log('  --coverage              Include coverage reporting');
  console.log('  --watch, -w             Run tests in watch mode');
  console.log('  --environment, -e <env> Set test environment (local/staging/production)');
  console.log('  --browser, -b <browser> Set browser for E2E tests (chromium/firefox/webkit)');
  console.log('  --verbose, -v           Enable verbose output');
  console.log('');
  console.log(colors.cyan('Examples:'));
  console.log('  npm run test-runner -- --suite quick');
  console.log('  npm run test-runner -- --category unit --coverage');
  console.log('  npm run test-runner -- --category e2e --browser firefox');
  console.log('  npm run test-runner -- --suite comprehensive --environment production');
  console.log('  npm run test-runner -- --watch --category unit');
}

// List available test suites and categories
function listAvailable() {
  console.log(colors.bold('Available Test Suites:'));
  console.log('');
  
  Object.entries(testConfig.testSuites).forEach(([name, config]) => {
    console.log(colors.green(`📋 ${name}`));
    console.log(colors.dim(`   ${config.description}`));
    console.log(colors.dim(`   Tests: ${config.tests.join(', ')}`));
    console.log(colors.dim(`   Browsers: ${Array.isArray(testConfig.browsers[config.browsers]) ? testConfig.browsers[config.browsers].join(', ') : config.browsers}`));
    console.log(colors.dim(`   Environment: ${config.environment}`));
    console.log(colors.dim(`   Estimated Duration: ${Math.round(config.timeout / 60000)} minutes`));
    console.log('');
  });

  console.log(colors.bold('Available Test Categories:'));
  console.log('');
  
  const categories = [
    { name: 'unit', desc: 'Fast unit tests for components, hooks, and utilities', icon: '🧪' },
    { name: 'integration', desc: 'Integration tests for component and service interactions', icon: '🔗' },
    { name: 'e2e', desc: 'End-to-end tests for complete user workflows', icon: '🎭' },
    { name: 'performance', desc: 'Performance tests with Lighthouse and Web Vitals', icon: '⚡' },
    { name: 'a11y', desc: 'Accessibility tests for WCAG compliance', icon: '♿' }
  ];

  categories.forEach(({ name, desc, icon }) => {
    console.log(colors.green(`${icon} ${name}`));
    console.log(colors.dim(`   ${desc}`));
    console.log('');
  });

  console.log(colors.bold('Available Environments:'));
  console.log('');
  Object.entries(testConfig.environments).forEach(([name, config]) => {
    console.log(colors.green(`🌐 ${name}`));
    console.log(colors.dim(`   URL: ${config.url}`));
    console.log(colors.dim(`   Timeout: ${config.timeout / 1000}s`));
    console.log('');
  });
}

// Run a specific command with proper error handling
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(colors.dim(`Running: ${command} ${args.join(' ')}`));
    
    const child = spawn(command, args, {
      stdio: options.verbose ? 'inherit' : 'pipe',
      shell: true,
      ...options
    });

    let stdout = '';
    let stderr = '';

    if (!options.verbose) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({ code, stdout, stderr });
      }
    });

    child.on('error', (error) => {
      reject({ error, stdout, stderr });
    });
  });
}

// Run unit tests
async function runUnitTests(options) {
  console.log(colors.blue('🧪 Running unit tests...'));
  
  const args = ['run', 'test'];
  
  if (!options.watch) {
    args.push('--', '--run');
  }
  
  if (options.coverage) {
    args.push('--coverage');
  }

  if (options.watch) {
    args.push('--', '--watch');
  }

  try {
    await runCommand('npm', args, { verbose: options.verbose });
    console.log(colors.green('✅ Unit tests completed successfully'));
  } catch (error) {
    console.error(colors.red('❌ Unit tests failed'));
    if (error.stderr && !options.verbose) {
      console.error(error.stderr);
    }
    process.exit(1);
  }
}

// Run integration tests
async function runIntegrationTests(options) {
  console.log(colors.blue('🔗 Running integration tests...'));
  
  const args = ['run', 'test', '--', '--run', 'tests/integration/'];
  
  if (options.coverage) {
    args.push('--coverage');
  }

  try {
    await runCommand('npm', args, { verbose: options.verbose });
    console.log(colors.green('✅ Integration tests completed successfully'));
  } catch (error) {
    console.error(colors.red('❌ Integration tests failed'));
    if (error.stderr && !options.verbose) {
      console.error(error.stderr);
    }
    process.exit(1);
  }
}

// Run E2E tests
async function runE2ETests(options) {
  console.log(colors.blue(`🎭 Running E2E tests with ${options.browser}...`));
  
  const args = ['run', 'test:e2e'];
  
  if (options.browser !== 'chromium') {
    args.push('--', `--project=${options.browser}`);
  }

  try {
    await runCommand('npm', args, { verbose: options.verbose });
    console.log(colors.green('✅ E2E tests completed successfully'));
  } catch (error) {
    console.error(colors.red('❌ E2E tests failed'));
    if (error.stderr && !options.verbose) {
      console.error(error.stderr);
    }
    process.exit(1);
  }
}

// Run performance tests
async function runPerformanceTests(options) {
  console.log(colors.blue('⚡ Running performance tests...'));
  
  try {
    // Build first
    console.log(colors.dim('Building project...'));
    await runCommand('npm', ['run', 'build'], { verbose: options.verbose });
    
    // Run performance tests
    await runCommand('npm', ['run', 'test:performance'], { verbose: options.verbose });
    
    console.log(colors.green('✅ Performance tests completed successfully'));
  } catch (error) {
    console.error(colors.red('❌ Performance tests failed'));
    if (error.stderr && !options.verbose) {
      console.error(error.stderr);
    }
    process.exit(1);
  }
}

// Run accessibility tests
async function runAccessibilityTests(options) {
  console.log(colors.blue('♿ Running accessibility tests...'));
  
  const args = ['run', 'test', '--', '--run', 'tests/a11y/'];

  try {
    await runCommand('npm', args, { verbose: options.verbose });
    console.log(colors.green('✅ Accessibility tests completed successfully'));
  } catch (error) {
    console.error(colors.red('❌ Accessibility tests failed'));
    if (error.stderr && !options.verbose) {
      console.error(error.stderr);
    }
    process.exit(1);
  }
}

// Run a specific test category
async function runTestCategory(category, options) {
  switch (category) {
    case 'unit':
      await runUnitTests(options);
      break;
    case 'integration':
      await runIntegrationTests(options);
      break;
    case 'e2e':
      await runE2ETests(options);
      break;
    case 'performance':
      await runPerformanceTests(options);
      break;
    case 'a11y':
    case 'accessibility':
      await runAccessibilityTests(options);
      break;
    default:
      console.error(colors.red(`❌ Unknown test category: ${category}`));
      console.log('Available categories: unit, integration, e2e, performance, a11y');
      process.exit(1);
  }
}

// Run a test suite
async function runTestSuite(suiteName, options) {
  const suite = testConfig.testSuites[suiteName];
  
  if (!suite) {
    console.error(colors.red(`❌ Unknown test suite: ${suiteName}`));
    console.log('Available suites:', Object.keys(testConfig.testSuites).join(', '));
    process.exit(1);
  }

  console.log(colors.bold(`🚀 Running test suite: ${suiteName}`));
  console.log(colors.dim(`Description: ${suite.description}`));
  console.log(colors.dim(`Tests: ${suite.tests.join(', ')}`));
  console.log('');

  const startTime = Date.now();
  
  try {
    for (const testCategory of suite.tests) {
      await runTestCategory(testCategory, {
        ...options,
        environment: suite.environment || options.environment
      });
    }
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log('');
    console.log(colors.green(`✅ Test suite '${suiteName}' completed successfully in ${duration}s`));
    
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log('');
    console.error(colors.red(`❌ Test suite '${suiteName}' failed after ${duration}s`));
    process.exit(1);
  }
}

// Show test status and recommendations
function showTestStatus() {
  console.log(colors.bold('🔍 RrishMusic Test System Status'));
  console.log('');
  
  console.log(colors.green('✅ Comprehensive CI/CD system is active'));
  console.log('');
  
  console.log(colors.cyan('Available Test Workflows:'));
  console.log('• tests.yml - Main comprehensive workflow (automatic on PRs)');
  console.log('• test-orchestrator.yml - Scheduled and manual comprehensive testing');
  console.log('• test-unit.yml - Unit tests with coverage');
  console.log('• test-integration.yml - Integration tests');
  console.log('• test-e2e.yml - End-to-end tests across browsers');
  console.log('• test-performance.yml - Performance and Lighthouse testing');
  console.log('• test-a11y.yml - Accessibility compliance validation');
  console.log('');
  
  console.log(colors.cyan('Local Development:'));
  console.log('• Use this script for local test execution');
  console.log('• GitHub workflows provide comprehensive CI/CD');
  console.log('• Performance and accessibility tests run in cloud environment');
  console.log('');
  
  console.log(colors.cyan('Recommendations:'));
  console.log('• Run "npm run test-runner -- --suite quick" for fast feedback');
  console.log('• Use "npm run test-runner -- --category unit --watch" during development');
  console.log('• Run "npm run test-runner -- --suite essential" before pushing');
}

// Main function
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  if (options.list) {
    listAvailable();
    return;
  }

  // Show status if no specific action requested
  if (!options.suite && !options.category) {
    showTestStatus();
    console.log('');
    console.log(colors.dim('Use --help for usage information or --list to see available options'));
    return;
  }

  try {
    if (options.suite) {
      await runTestSuite(options.suite, options);
    } else if (options.category) {
      await runTestCategory(options.category, options);
    }
  } catch (error) {
    console.error(colors.red('❌ Test runner failed:'), error.message);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(colors.red('❌ Unexpected error:'), error);
  process.exit(1);
});