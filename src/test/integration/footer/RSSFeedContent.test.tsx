import { render, screen, waitFor } from '@testing-library/react';
import { RSSFeedContent } from '@/components/client-portal/footer/RSSFeedContent';
import { vi } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockRSSResponse = {
  contents: `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Test Feed</title>
        <link>http://example.com</link>
        <description>Test Description</description>
        <item>
          <title>Test Item 1</title>
          <link>http://example.com/1</link>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
        </item>
        <item>
          <title>Test Item 2</title>
          <link>http://example.com/2</link>
          <pubDate>Mon, 02 Jan 2024 00:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
  `
};

const mockAtomResponse = {
  contents: `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Test Atom Feed</title>
      <entry>
        <title>Atom Item 1</title>
        <link href="http://example.com/atom/1"/>
        <published>2024-01-01T00:00:00Z</published>
      </entry>
    </feed>
  `
};

describe('RSSFeedContent', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders RSS feed items correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockRSSResponse }),
    });

    render(<RSSFeedContent url="http://example.com/feed.rss" maxItems={2} />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'http://example.com/1');
    expect(links[1]).toHaveAttribute('href', 'http://example.com/2');
  });

  it('renders Atom feed items correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockAtomResponse }),
    });

    render(<RSSFeedContent url="http://example.com/feed" maxItems={1} />);

    await waitFor(() => {
      expect(screen.getByText('Atom Item 1')).toBeInTheDocument();
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://example.com/atom/1');
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<RSSFeedContent url="http://example.com/feed.rss" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load feed content')).toBeInTheDocument();
    });
  });

  it('respects maxItems limit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockRSSResponse }),
    });

    render(<RSSFeedContent url="http://example.com/feed.rss" maxItems={1} />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Item 2')).not.toBeInTheDocument();
    });
  });
});