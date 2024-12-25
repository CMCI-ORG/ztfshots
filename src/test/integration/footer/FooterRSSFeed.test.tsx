import { render, screen, waitFor } from '@testing-library/react';
import { FooterRSSFeed } from '@/components/client-portal/footer/FooterRSSFeed';
import { createSupabaseMock } from '../../mocks/supabaseMock';
import { vi } from 'vitest';
import { test, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('FooterRSSFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays RSS feeds in the correct footer column', async () => {
    const mockFeeds = [
      {
        id: '1',
        rss_url: 'https://example.com/feed.rss',
        section_title: 'Test Feed',
        feed_count: 3,
        footer_position: 'column_1',
        footer_order: 0
      }
    ];

    // Mock the Supabase response
    const supabaseMock = createSupabaseMock();
    supabaseMock.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockFeeds, error: null })
    }));

    renderWithProviders(<FooterRSSFeed position="column_1" />);

    await waitFor(() => {
      expect(screen.getByTestId('footer-rss-feed')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Feed')).toBeInTheDocument();
  });

  test('handles empty feed data', async () => {
    // Mock empty response
    const supabaseMock = createSupabaseMock();
    supabaseMock.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }));

    renderWithProviders(<FooterRSSFeed position="column_1" />);

    await waitFor(() => {
      expect(screen.queryByTestId('footer-rss-feed')).not.toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock error response
    const supabaseMock = createSupabaseMock();
    supabaseMock.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('Test error') })
    }));

    renderWithProviders(<FooterRSSFeed position="column_1" />);

    await waitFor(() => {
      expect(screen.queryByTestId('footer-rss-feed')).not.toBeInTheDocument();
    });
  });
});