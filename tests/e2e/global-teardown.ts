/**
 * Playwright Global Teardown
 * 
 * Global teardown for E2E tests including cleanup, report generation,
 * and artifact management
 */

import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test global teardown...');

  // Clean up temporary files and artifacts
  await cleanupArtifacts();

  // Generate test summary report
  await generateTestSummary();

  // Clean up authentication states if they exist
  await cleanupAuthStates();

  // Archive old test results if in CI
  if (process.env.CI) {
    await archiveTestResults();
  }

  console.log('✅ E2E test global teardown completed successfully');
}

async function cleanupArtifacts() {
  console.log('🗑️ Cleaning up temporary test artifacts...');
  
  const tempDirs = [
    'test-results/temp',
    'test-results/downloads',
  ];

  tempDirs.forEach(dir => {
    const fullPath = path.resolve(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`🗑️ Cleaned up: ${dir}`);
    }
  });
}

async function generateTestSummary() {
  console.log('📊 Generating test summary...');
  
  const resultsPath = path.resolve(process.cwd(), 'test-results/json/e2e-results.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.log('⚠️ No test results found to summarize');
    return;
  }

  try {
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    
    const summary = {
      timestamp: new Date().toISOString(),
      total: results.stats?.total || 0,
      passed: results.stats?.expected || 0,
      failed: results.stats?.failed || 0,
      flaky: results.stats?.flaky || 0,
      skipped: results.stats?.skipped || 0,
      duration: results.stats?.duration || 0,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        ci: !!process.env.CI,
      }
    };

    const summaryPath = path.resolve(process.cwd(), 'test-results/summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`📊 Test Summary:
      Total: ${summary.total}
      Passed: ${summary.passed}
      Failed: ${summary.failed}
      Flaky: ${summary.flaky}
      Skipped: ${summary.skipped}
      Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      
  } catch (error) {
    console.error('❌ Failed to generate test summary:', error);
  }
}

async function cleanupAuthStates() {
  console.log('🔐 Cleaning up authentication states...');
  
  const authStatesDir = path.resolve(process.cwd(), 'auth-states');
  if (fs.existsSync(authStatesDir)) {
    fs.rmSync(authStatesDir, { recursive: true, force: true });
    console.log('🔐 Authentication states cleaned up');
  }
}

async function archiveTestResults() {
  console.log('📦 Archiving test results for CI...');
  
  // In CI, we might want to compress and archive test results
  // This is a placeholder for future implementation
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveName = `e2e-results-${timestamp}`;
  
  console.log(`📦 Test results would be archived as: ${archiveName}`);
  
  // Future: Implement compression and upload to artifact storage
  // const archivePath = path.resolve(process.cwd(), `${archiveName}.tar.gz`);
  // await compressDirectory('test-results', archivePath);
  // await uploadArtifact(archivePath);
}

export default globalTeardown;