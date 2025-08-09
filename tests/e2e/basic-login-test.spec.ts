import { test, expect } from '@playwright/test';

test.describe('Basic Login Page Tests', () => {
  test('Login page should load and display correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if the login page loads
    await expect(page.locator('h3')).toContainText('PhysioFlow Login');
    
    // Check if email input is present
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    
    // Check if Send OTP button is present
    await expect(page.locator('button:has-text("Send OTP")')).toBeVisible();
    
    // Check for login instructions
    await expect(page.locator('text=Enter your email to receive a one-time login code')).toBeVisible();
  });

  test('Email input validation should work', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit without email
    await page.click('button:has-text("Send OTP")');
    
    // Should see validation error
    await expect(page.locator('text=Please enter your email')).toBeVisible();
  });

  test('OTP form should appear after email submission', async ({ page }) => {
    await page.goto('/');
    
    // Fill in a valid email
    await page.fill('input[placeholder="you@example.com"]', 'test@example.com');
    
    // Click Send OTP
    await page.click('button:has-text("Send OTP")');
    
    // Should see OTP form
    await expect(page.locator('input[placeholder="Enter code"]')).toBeVisible();
    await expect(page.locator('button:has-text("Verify & Login")')).toBeVisible();
    
    // Should see email confirmation message
    await expect(page.locator('text=Please check your email (test@example.com)')).toBeVisible();
  });
});
