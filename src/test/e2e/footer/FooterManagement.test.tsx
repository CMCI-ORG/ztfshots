import { test, expect } from '@playwright/test';

test.describe('Footer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/content/footer');
  });

  test.describe('Column Management', () => {
    test('can add a new footer column', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /add column/i });
      await addButton.click();
      
      await expect(page.getByText('Footer column added successfully')).toBeVisible();
    });

    test('can delete a footer column', async ({ page }) => {
      // Wait for columns to load
      await page.waitForSelector('[data-testid="footer-column"]');
      
      const deleteButton = page.locator('[data-testid="delete-column"]').first();
      await deleteButton.click();
      
      await expect(page.getByText('Footer column deleted successfully')).toBeVisible();
    });
  });

  test.describe('Content Management', () => {
    test('can move content up and down', async ({ page }) => {
      await page.waitForSelector('[data-testid="content-item"]');
      
      // Get the first content item's text
      const firstItemText = await page.locator('[data-testid="content-item"]').first().textContent();
      
      // Move it down
      await page.locator('[data-testid="move-down"]').first().click();
      
      // Verify it moved
      const newFirstItemText = await page.locator('[data-testid="content-item"]').first().textContent();
      expect(newFirstItemText).not.toBe(firstItemText);
    });

    test('can toggle content active state', async ({ page }) => {
      await page.waitForSelector('[data-testid="content-item"]');
      
      const toggleButton = page.locator('[data-testid="toggle-active"]').first();
      await toggleButton.click();
      
      await expect(page.getByText(/successfully/)).toBeVisible();
    });

    test('can delete content', async ({ page }) => {
      await page.waitForSelector('[data-testid="content-item"]');
      
      const deleteButton = page.locator('[data-testid="delete-content"]').first();
      await deleteButton.click();
      
      await expect(page.getByText('Content deleted successfully')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('shows error message when operations fail', async ({ page }) => {
      // Simulate network error
      await page.route('**/rest/v1/footer_columns**', route => route.abort());
      
      const addButton = page.getByRole('button', { name: /add column/i });
      await addButton.click();
      
      await expect(page.getByText(/failed to add/i)).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('shows loading skeleton while fetching data', async ({ page }) => {
      // Slow down the response
      await page.route('**/rest/v1/footer_columns**', route => 
        new Promise(resolve => setTimeout(() => resolve(route.continue()), 1000))
      );
      
      await page.goto('/admin/content/footer');
      
      // Check if skeleton is visible
      await expect(page.locator('.skeleton')).toBeVisible();
    });
  });
});