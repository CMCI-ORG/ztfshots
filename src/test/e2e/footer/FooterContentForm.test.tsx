import { test, expect } from '@playwright/test';

test.describe('Footer Content Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/content/footer');
  });

  test.describe('Content Type Switching', () => {
    test('shows different fields based on content type', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');

      // Test Text type fields
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await expect(page.locator('[data-testid="content-text-input"]')).toBeVisible();

      // Test Link type fields
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Link' });
      await expect(page.locator('[data-testid="link-url-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="link-text-input"]')).toBeVisible();

      // Test Social type fields
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Social' });
      await expect(page.locator('[data-testid="social-links-container"]')).toBeVisible();
    });

    test('preserves common fields when switching types', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      
      // Fill common fields
      await page.fill('[data-testid="content-title-input"]', 'Test Title');
      
      // Switch content type
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Link' });
      
      // Check if common fields are preserved
      await expect(page.locator('[data-testid="content-title-input"]')).toHaveValue('Test Title');
    });
  });

  test.describe('Form Validation', () => {
    test('validates URL format for link type', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Link' });
      
      await page.fill('[data-testid="link-url-input"]', 'invalid-url');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Please enter a valid URL"')).toBeVisible();
    });

    test('validates required fields for each content type', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      
      // Text type validation
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await page.click('button:has-text("Save")');
      await expect(page.locator('text="Content text is required"')).toBeVisible();
      
      // Link type validation
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Link' });
      await page.click('button:has-text("Save")');
      await expect(page.locator('text="URL is required"')).toBeVisible();
      await expect(page.locator('text="Link text is required"')).toBeVisible();
    });
  });

  test.describe('Form Submission', () => {
    test('successfully submits valid form data', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      
      await page.fill('[data-testid="content-title-input"]', 'Test Content');
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await page.fill('[data-testid="content-text-input"]', 'Test content text');
      
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Content added successfully"')).toBeVisible();
    });

    test('handles form submission errors gracefully', async ({ page }) => {
      // Simulate network error during form submission
      await page.route('**/rest/v1/footer_contents**', route => route.abort());
      
      await page.click('[data-testid="add-content-button"]:first-child');
      await page.fill('[data-testid="content-title-input"]', 'Test Content');
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await page.fill('[data-testid="content-text-input"]', 'Test content text');
      
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Failed to add content"')).toBeVisible();
      // Form should still be visible with entered data
      await expect(page.locator('[data-testid="content-title-input"]')).toHaveValue('Test Content');
    });
  });
});