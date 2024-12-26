import { test, expect } from '@playwright/test';

test.describe('Footer Content Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays text content correctly', async ({ page }) => {
    const textContent = await page.getByText('About Us').first();
    await expect(textContent).toBeVisible();
  });

  test('displays social media links correctly', async ({ page }) => {
    const socialLinks = await page.$$('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThan(0);

    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('displays link groups correctly', async ({ page }) => {
    const linkGroups = await page.$$('.space-y-2');
    expect(linkGroups.length).toBeGreaterThan(0);
  });

  test('displays address information correctly', async ({ page }) => {
    const addressSection = await page.getByText(/^[0-9]+.+Street/);
    await expect(addressSection).toBeVisible();
  });

  test('all images load successfully', async ({ page }) => {
    const images = await page.$$('img');
    for (const img of images) {
      const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('external links have proper security attributes', async ({ page }) => {
    const externalLinks = await page.$$('a[target="_blank"]');
    for (const link of externalLinks) {
      expect(await link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});