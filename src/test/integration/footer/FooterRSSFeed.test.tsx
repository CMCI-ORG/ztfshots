import { render, screen, waitFor } from '@testing-library/react';
import { FooterRSSFeed } from '@/components/client-portal/footer/FooterRSSFeed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Create a properly typed mock using our helper
const supabaseMock = createSupabaseMock();

// Mock the entire supabase client module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: supabaseMock
}));

// Mock RSSFeedContent component
vi.mock('@/components/client-portal/footer/RSSFeedContent', () => ({
  RSSFeedContent: ({ url, maxItems }: { url: string; maxItems: number }) => (
    <div data-testid="mock-rss-content" data-url={url} data-max-items={maxItems}>
      Mock RSS Content
    </div>
  )
}));

describe('FooterRSSFeed', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders feed settings correctly', async () => {
    // Setup mock response
    const mockData = [{
      id: '1',
      section_title: 'Latest Blog Posts',
      rss_url: 'http://example.com/feed.rss',
      feed_count: 3
    }];

    supabaseMock.from.mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockData,
        error: null
      })
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <FooterRSSFeed position="column_1" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Latest Blog Posts')).toBeInTheDocument();
    });

    const rssContent = screen.getByTestId('mock-rss-content');
    expect(rssContent).toHaveAttribute('data-url', 'http://example.com/feed.rss');
    expect(rssContent).toHaveAttribute('data-max-items', '3');
  });

  it('handles empty feed settings', async () => {
    // Mock empty response
    supabaseMock.from.mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null
      })
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <FooterRSSFeed position="column_1" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('mock-rss-content')).not.toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock error response
    supabaseMock.from.mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch feeds')
      })
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <FooterRSSFeed position="column_1" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('mock-rss-content')).not.toBeInTheDocument();
    });
  });
});