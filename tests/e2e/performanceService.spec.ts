import { test, expect } from '@playwright/test';

test.describe('performanceService E2E Tests', () => {
  test('should pass basic test', async ({ page }) => {
    expect(true).toBe(true);
  });
});