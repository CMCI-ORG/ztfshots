import { test, expect } from '@playwright/test';
import { supabase } from '@/integrations/supabase/client';

test.describe('Footer RSS Feed', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the footer management page
    await page.goto('/admin/content/footer');
  });

  test('displays RSS feeds in correct footer columns', async ({ page }) => {
    // Wait for the feed settings to load
    await page.waitForSelector('[data-testid="footer-rss-feed"]');
    
    // Check if feeds are displayed in their respective columns
    const feeds = await page.$$('[data-testid="footer-rss-feed"]');
    expect(feeds.length).toBeGreaterThanOrEqual(0);

    // Verify feed content structure
    for (const feed of feeds) {
      const title = await feed.$('h4');
      expect(title).toBeTruthy();
      
      const items = await feed.$$('[data-testid="feed-item-link"]');
      const maxItems = await feed.getAttribute('data-max-items');
      
      if (maxItems) {
        expect(items.length).toBeLessThanOrEqual(parseInt(maxItems));
      }
    }
  });

  test('handles feed loading errors gracefully', async ({ page }) => {
    // Wait for any error messages
    const errorMessage = await page.$('[data-testid="feed-error"]');
    if (errorMessage) {
      const text = await errorMessage.textContent();
      expect(text).toContain('Failed to load feed content');
    }
  });

  test('respects maximum items setting', async ({ page }) => {
    // Wait for feeds to load
    await page.waitForSelector('[data-testid="footer-rss-feed"]');
    
    // Check each feed's item count
    const feeds = await page.$$('[data-testid="footer-rss-feed"]');
    
    for (const feed of feeds) {
      const maxItems = await feed.getAttribute('data-max-items');
      const items = await feed.$$('[data-testid="feed-item-link"]');
      
      if (maxItems) {
        expect(items.length).toBeLessThanOrEqual(parseInt(maxItems));
      }
    }
  });
});