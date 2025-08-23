#!/usr/bin/env node

/**
 * Script to update package.json with optimized CI/CD test scripts
 * Maintains existing dependencies while adding fast test configurations
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add new optimized scripts while preserving existing ones
const newScripts = {
  // CI/CD optimized scripts - Fast execution
  "test:ci-fast": "vitest run --config ./configs/vitest.config.ci-fast.ts",
  "test:ci-smoke": "vitest run --config ./configs/vitest.config.smoke.ts",
  "test:ci-build-check": "npm run type-check:fast && npm run lint:ci && npm run build:verify",
  "test:ci-comprehensive": "npm run test:ci-fast && npm run test:ci-smoke && npm run test:e2e:smoke",
  
  // Smoke testing - Critical path only
  "test:smoke": "vitest run --config ./configs/vitest.config.smoke.ts --reporter=basic",
  "test:smoke:watch": "vitest --config ./configs/vitest.config.smoke.ts",
  
  // Local development workflows
  "test:local-quick": "npm run test:smoke && npm run test:ci-fast",
  "test:local-standard": "npm run test:local-quick && npm run test:integration",
  "test:local-full": "npm run test:local-standard && npm run test:e2e && npm run test:performance && npm run test:a11y",
  
  // Git workflow hooks
  "test:precommit": "npm run test:smoke && npm run test:ci-fast",
  "test:prepush": "npm run test:precommit && npm run test:ci-build-check",
  
  // Fast build and quality checks
  "lint:ci": "eslint src --ext ts,tsx --max-warnings 0 --quiet",
  "type-check:fast": "tsc --noEmit --skipLibCheck",
  "build:verify": "vite build --mode ci --silent",
};

// Merge new scripts with existing ones
packageJson.scripts = { ...packageJson.scripts, ...newScripts };

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Package.json updated with optimized CI/CD test scripts');
console.log('📝 Added scripts:');
Object.keys(newScripts).forEach(script => {
  console.log(`   - ${script}`);
});

console.log('\n🚀 Fast CI/CD Commands:');
console.log('   npm run test:ci-fast        # <2 minutes - Essential tests only');
console.log('   npm run test:ci-smoke       # <30 seconds - Critical path');
console.log('   npm run test:ci-comprehensive # <5 minutes - Standard CI suite');

console.log('\n🛠  Local Development Commands:');
console.log('   npm run test:local-quick     # <2 minutes - Quick validation');
console.log('   npm run test:precommit       # <2 minutes - Pre-commit checks');
console.log('   npm run test:prepush         # <5 minutes - Pre-push validation');