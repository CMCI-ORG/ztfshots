import { test, expect } from '@playwright/test';

test.describe('Footer RSS Feed Integration', () => {
  test('displays RSS feeds in footer columns', async ({ page }) => {
    // Navigate to a page with the footer
    await page.goto('/');
    
    // Wait for the footer to load
    await page.waitForSelector('footer');

    // Check if RSS feed content is loaded in the footer columns
    const feedColumns = await page.$$('footer [data-testid="footer-rss-feed"]');
    
    for (const column of feedColumns) {
      // Verify feed title is present
      const title = await column.$('h4');
      expect(title).toBeTruthy();

      // Verify feed items are loaded
      const items = await column.$$('li a');
      expect(items.length).toBeGreaterThan(0);

      // Check if links are properly formatted
      for (const item of items) {
        const href = await item.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
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
    expect(errorMessage).toContain('Failed to load feed content');
  });

  test('respects maximum items setting', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('footer');

    // Check each feed column
    const feedColumns = await page.$$('[data-testid="footer-rss-feed"]');
    
    for (const column of feedColumns) {
      const items = await column.$$('li');
      const maxItems = await column.getAttribute('data-max-items');
      
      if (maxItems) {
        expect(items.length).toBeLessThanOrEqual(parseInt(maxItems));
      }
    }
  });
});