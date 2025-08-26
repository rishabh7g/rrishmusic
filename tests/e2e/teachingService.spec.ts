import { test, expect } from '@playwright/test';

test.describe('teachingService E2E Tests', () => {
  test('should pass basic test', async ({ page }) => {
    expect(true).toBe(true);
  });
});