/**
 * Visual Test Setup
 * 
 * Setup for visual regression tests including screenshot directories,
 * baseline management, and visual testing utilities
 */

import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function visualSetup(config: FullConfig) {
  console.log('📸 Starting Visual test setup...');

  // Ensure visual test directories exist
  const visualDirs = [
    'test-results/visual-report',
    'test-results/visual-artifacts',
    'tests/visual/screenshots',
    'tests/visual/screenshots/baseline',
    'tests/visual/screenshots/actual',
    'tests/visual/screenshots/diff',
  ];

  visualDirs.forEach(dir => {
    const fullPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created visual directory: ${dir}`);
    }
  });

  // Set up visual test environment
  process.env.NODE_ENV = 'test';
  process.env.PLAYWRIGHT_VISUAL_MODE = 'true';
  
  // Disable animations globally for consistent screenshots
  process.env.REACT_DISABLE_ANIMATION = 'true';

  // Check for baseline screenshots
  await checkBaselines();

  console.log('✅ Visual test setup completed successfully');
}

async function checkBaselines() {
  const baselineDir = path.resolve(process.cwd(), 'tests/visual/screenshots/baseline');
  
  if (!fs.existsSync(baselineDir) || fs.readdirSync(baselineDir).length === 0) {
    console.log('⚠️ No baseline screenshots found. First run will generate baselines.');
    
    // Create a marker file to indicate this is the first run
    const markerPath = path.resolve(process.cwd(), 'tests/visual/.first-run');
    fs.writeFileSync(markerPath, new Date().toISOString());
  } else {
    console.log(`📸 Found ${fs.readdirSync(baselineDir).length} baseline screenshots`);
  }
}

export default visualSetup;