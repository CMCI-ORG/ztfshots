import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import Quotes from '@/pages/Quotes';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '123',
            text: 'Test Quote',
            authors: { name: 'Test Author' },
            categories: { name: 'Test Category' },
            source_title: 'Test Book',
            source_url: 'https://example.com/book',
            post_date: new Date().toISOString().split('T')[0],
            status: 'live',
          },
        ],
        error: null,
      })),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: '456' }],
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
      url: new URL('https://example.com'),
      headers: {},
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

describe('Quote Workflow', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  const renderQuotes = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Quotes />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('displays quotes table with data', async () => {
    renderQuotes();

    await waitFor(() => {
      expect(screen.getByText('Test Quote')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });

  it('handles quote deletion', async () => {
    const user = userEvent.setup();
    renderQuotes();

    await waitFor(() => {
      expect(screen.getByText('Test Quote')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('quotes');
    });
  });
});