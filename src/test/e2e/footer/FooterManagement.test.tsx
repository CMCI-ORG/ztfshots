import { test, expect } from '@playwright/test';

test.describe('Footer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/content/footer');
  });

  test('can delete individual content items', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('[data-testid="content-item"]');
    
    // Get initial content count
    const initialContentCount = await page.locator('[data-testid="content-item"]').count();
    
    // Click delete button on first content item
    await page.locator('button:has-text("Delete")').first().click();
    
    // Confirm deletion in dialog
    await page.locator('button:has-text("Delete")').last().click();
    
    // Wait for success message
    await expect(page.getByText('Content deleted successfully')).toBeVisible();
    
    // Verify content count decreased by 1
    const newContentCount = await page.locator('[data-testid="content-item"]').count();
    expect(newContentCount).toBe(initialContentCount - 1);
  });

  test('can delete columns', async ({ page }) => {
    // Wait for columns to load
    await page.waitForSelector('[data-testid="footer-column"]');
    
    // Get initial column count
    const initialColumnCount = await page.locator('[data-testid="footer-column"]').count();
    
    // Click delete column button
    await page.locator('button:has-text("Delete Column")').first().click();
    
    // Confirm deletion in dialog
    await page.locator('button:has-text("Delete")').last().click();
    
    // Wait for success message
    await expect(page.getByText('Column deleted successfully')).toBeVisible();
    
    // Verify column count decreased by 1
    const newColumnCount = await page.locator('[data-testid="footer-column"]').count();
    expect(newColumnCount).toBe(initialColumnCount - 1);
  });

  test('shows confirmation dialog before deleting', async ({ page }) => {
    await page.waitForSelector('[data-testid="content-item"]');
    
    // Try to delete content
    await page.locator('button:has-text("Delete")').first().click();
    
    // Verify confirmation dialog appears
    await expect(page.getByText('This action cannot be undone')).toBeVisible();
    
    // Cancel deletion
    await page.locator('button:has-text("Cancel")').click();
    
    // Verify content still exists
    await expect(page.locator('[data-testid="content-item"]').first()).toBeVisible();
  });

  test('handles errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/rest/v1/footer_contents**', route => route.abort());
    
    await page.waitForSelector('[data-testid="content-item"]');
    
    // Try to delete content
    await page.locator('button:has-text("Delete")').first().click();
    await page.locator('button:has-text("Delete")').last().click();
    
    // Verify error message appears
    await expect(page.getByText(/failed to delete/i)).toBeVisible();
  });
});