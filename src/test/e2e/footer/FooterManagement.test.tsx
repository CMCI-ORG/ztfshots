import { test, expect } from '@playwright/test';

test.describe('Footer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to footer management page
    await page.goto('/admin/content/footer');
  });

  test.describe('Column Management', () => {
    test('can add a new footer column', async ({ page }) => {
      const initialColumnCount = await page.$$eval('[data-testid="footer-column"]', cols => cols.length);
      await page.click('button:has-text("Add Column")');
      await expect(page.locator('[data-testid="footer-column"]')).toHaveCount(initialColumnCount + 1);
    });

    test('can delete a footer column', async ({ page }) => {
      const initialColumnCount = await page.$$eval('[data-testid="footer-column"]', cols => cols.length);
      if (initialColumnCount > 0) {
        await page.click('[data-testid="delete-column-button"]:first-child');
        await expect(page.locator('[data-testid="footer-column"]')).toHaveCount(initialColumnCount - 1);
      }
    });

    test('shows empty state when no columns exist', async ({ page }) => {
      // Delete all existing columns first
      const deleteButtons = await page.$$('[data-testid="delete-column-button"]');
      for (const button of deleteButtons) {
        await button.click();
      }
      await expect(page.locator('text="No columns found"')).toBeVisible();
    });
  });

  test.describe('Content Management', () => {
    test('can add content to a column', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      await page.fill('[data-testid="content-title-input"]', 'Test Content');
      await page.selectOption('[data-testid="content-type-select"]', { label: 'Text' });
      await page.fill('[data-testid="content-text-input"]', 'Test text content');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Test Content"')).toBeVisible();
    });

    test('can reorder content within a column', async ({ page }) => {
      // Add two content items if they don't exist
      if (!(await page.isVisible('text="Test Content 1"'))) {
        await page.click('[data-testid="add-content-button"]:first-child');
        await page.fill('[data-testid="content-title-input"]', 'Test Content 1');
        await page.click('button:has-text("Save")');
      }
      if (!(await page.isVisible('text="Test Content 2"'))) {
        await page.click('[data-testid="add-content-button"]:first-child');
        await page.fill('[data-testid="content-title-input"]', 'Test Content 2');
        await page.click('button:has-text("Save")');
      }

      const firstContentItem = await page.locator('text="Test Content 1"');
      const initialPosition = await firstContentItem.boundingBox();
      
      await page.click('[data-testid="move-down-button"]:first-child');
      
      const newPosition = await firstContentItem.boundingBox();
      expect(newPosition?.y).toBeGreaterThan(initialPosition?.y || 0);
    });

    test('validates required fields in content form', async ({ page }) => {
      await page.click('[data-testid="add-content-button"]:first-child');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Title is required"')).toBeVisible();
      await expect(page.locator('text="Content type is required"')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('adapts to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check if columns stack vertically
      const columns = await page.$$('[data-testid="footer-column"]');
      for (let i = 0; i < columns.length; i++) {
        const box = await columns[i].boundingBox();
        if (i > 0) {
          const previousBox = await columns[i-1].boundingBox();
          expect(box?.y).toBeGreaterThan(previousBox?.y || 0);
        }
      }
    });

    test('adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check if columns are in a 2x2 grid
      const columns = await page.$$('[data-testid="footer-column"]');
      const firstColumn = await columns[0].boundingBox();
      const secondColumn = await columns[1].boundingBox();
      
      // Check if first two columns are side by side
      expect(secondColumn?.x).toBeGreaterThan(firstColumn?.x || 0);
    });
  });

  test.describe('Error Handling', () => {
    test('shows error toast on failed column addition', async ({ page }) => {
      // Simulate network error
      await page.route('**/rest/v1/footer_columns**', route => route.abort());
      
      await page.click('button:has-text("Add Column")');
      await expect(page.locator('text="Failed to add footer column"')).toBeVisible();
    });

    test('shows error toast on failed content addition', async ({ page }) => {
      // Simulate network error
      await page.route('**/rest/v1/footer_contents**', route => route.abort());
      
      await page.click('[data-testid="add-content-button"]:first-child');
      await page.fill('[data-testid="content-title-input"]', 'Test Content');
      await page.click('button:has-text("Save")');
      
      await expect(page.locator('text="Failed to add content"')).toBeVisible();
    });

    test('recovers from network errors', async ({ page }) => {
      // First simulate error
      await page.route('**/rest/v1/footer_columns**', route => route.abort());
      await page.click('button:has-text("Add Column")');
      
      // Then remove the error simulation
      await page.unroute('**/rest/v1/footer_columns**');
      await page.click('button:has-text("Add Column")');
      
      // Check if the operation succeeds after recovery
      await expect(page.locator('text="Footer column added successfully"')).toBeVisible();
    });
  });
});