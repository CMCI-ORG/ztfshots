import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { AuthProvider } from '@/providers/AuthProvider';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        count: 5,
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({
        error: null,
      }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    })),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Quote Interactions', () => {
  const mockQuote = {
    id: '1',
    quote: 'Test quote',
    author: 'Test Author',
    category: 'Test Category',
    date: '2024-03-20',
    sourceTitle: 'Test Book',
    sourceUrl: 'https://example.com',
  };

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const renderQuoteCard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <QuoteCard {...mockQuote} />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('renders quote card with all interaction buttons', async () => {
    renderQuoteCard();

    await waitFor(() => {
      expect(screen.getByText(mockQuote.quote)).toBeInTheDocument();
      expect(screen.getByText(`— ${mockQuote.author}`)).toBeInTheDocument();
    });

    // Verify interaction buttons are present
    expect(screen.getAllByRole('button')).toHaveLength(5); // Like, Star, Comment, Share, Download
  });

  it('displays interaction counts', async () => {
    renderQuoteCard();

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some(button => button.textContent?.includes('5'))).toBe(true);
    });
  });

  it('handles share functionality', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    renderQuoteCard();

    const shareButton = await screen.findByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(`"${mockQuote.quote}" - ${mockQuote.author}`);
    });
  });
});