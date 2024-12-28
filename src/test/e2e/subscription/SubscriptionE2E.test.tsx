import { test, expect } from '@playwright/test';

test.describe('Subscription E2E Flow', () => {
  test('completes full subscription flow', async ({ page }) => {
    // Navigate to subscription page
    await page.goto('/subscribe');
    
    // Fill subscription form
    await page.fill('input[placeholder*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"]', 'test@example.com');
    
    // Submit form
    await page.click('button:has-text("Subscribe")');
    
    // Verify success message
    await expect(page.locator('text=check your email')).toBeVisible();
    
    // Verify form is cleared
    await expect(page.locator('input[placeholder*="name"]')).toBeEmpty();
    await expect(page.locator('input[placeholder*="email"]')).toBeEmpty();
  });

  test('handles validation errors', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Submit empty form
    await page.click('button:has-text("Subscribe")');
    
    // Verify validation messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('handles existing subscriber', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Fill form with existing email
    await page.fill('input[placeholder*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"]', 'existing@example.com');
    
    await page.click('button:has-text("Subscribe")');
    
    // Verify error message
    await expect(page.locator('text=already subscribed')).toBeVisible();
  });

  test('handles network errors', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/functions/v1/subscribe', route => route.abort());
    
    await page.goto('/subscribe');
    
    await page.fill('input[placeholder*="name"]', 'John Doe');
    await page.fill('input[placeholder*="email"]', 'test@example.com');
    
    await page.click('button:has-text("Subscribe")');
    
    // Verify error message
    await expect(page.locator('text=Failed to process')).toBeVisible();
  });
});