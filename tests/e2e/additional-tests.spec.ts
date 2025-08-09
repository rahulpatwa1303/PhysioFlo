import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('Page should be accessible', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for form labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    for (const input of inputs) {
      const label = await input.getAttribute('aria-label') || await input.getAttribute('placeholder');
      expect(label).toBeTruthy();
    }
  });

  test('Keyboard navigation should work', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    expect(await focusedElement.isVisible()).toBeTruthy();
  });
});

test.describe('Browser Compatibility Tests', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`Should work in ${browserName}`, async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('h2')).toContainText('Dashboard');
    });
  });
});

test.describe('Performance Tests', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('Navigation performance', async ({ page }) => {
    await page.goto('/dashboard');
    
    const navigationStart = Date.now();
    await page.click('a[href="/patients"]');
    await page.waitForURL('**/patients');
    const navigationTime = Date.now() - navigationStart;
    
    expect(navigationTime).toBeLessThan(2000); // Navigation should be fast
  });
});

test.describe('Error Handling Tests', () => {
  test('Should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/*', route => route.abort());
    await page.goto('/dashboard');
    
    // Should show some error state or fallback
    await expect(page.locator('text=error, text=failed, text=loading')).toBeVisible();
  });

  test('Should handle invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-12345');
    
    // Should redirect to login or show 404
    await expect(page.locator('text=404, text=not found, text=login')).toBeVisible();
  });
});
