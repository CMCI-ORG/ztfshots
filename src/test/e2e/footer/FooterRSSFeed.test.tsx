import { test, expect } from '@playwright/test';

test.describe('Footer RSS Feed Integration', () => {
  test('displays RSS feeds in footer columns', async ({ page }) => {
    // Navigate to the footer section
    await page.goto('/');
    
    // Wait for the footer to load
    await page.waitForSelector('footer');

    // Check if RSS feed content is loaded in the footer columns
    const feedColumns = await page.$$('[data-testid="footer-rss-feed"]');
    
    // Verify at least one feed column exists
    expect(feedColumns.length).toBeGreaterThan(0);

    for (const column of feedColumns) {
      // Verify feed title is present
      const title = await column.$('h4');
      expect(title).toBeTruthy();

      // Get the maximum items setting
      const maxItems = await column.getAttribute('data-max-items');
      const maxItemsCount = maxItems ? parseInt(maxItems) : 5;

      // Verify feed items are loaded and respect the maxItems limit
      const items = await column.$$('[data-testid="feed-item-link"]');
      expect(items.length).toBeLessThanOrEqual(maxItemsCount);

      // Check if links are properly formatted
      for (const item of items) {
        const href = await item.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
        
        // Verify link text is not empty
        const text = await item.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('handles feed loading errors gracefully', async ({ page }) => {
    // Mock a failed feed request
    await page.route('**/api.allorigins.win/get*', route => 
      route.fulfill({
        status: 500,
        body: 'Server error'
      })
    );

    await page.goto('/');
    await page.waitForSelector('footer');

    // Check if error message is displayed
    const errorMessage = await page.textContent('[data-testid="feed-error"]');
    expect(errorMessage).toBe('Failed to load feed content');
  });

  test('respects maximum items setting from feed settings', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('footer');

    // Check each feed column
    const feedColumns = await page.$$('[data-testid="footer-rss-feed"]');
    
    for (const column of feedColumns) {
      const maxItems = await column.getAttribute('data-max-items');
      if (maxItems) {
        const items = await column.$$('[data-testid="feed-item-link"]');
        expect(items.length).toBeLessThanOrEqual(parseInt(maxItems));
      }
    }
  });
});