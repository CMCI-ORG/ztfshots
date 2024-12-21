import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuotesTable } from '../QuotesTable';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            text: 'Test quote',
            authors: { name: 'Test Author' },
            categories: { name: 'Test Category' },
          },
        ],
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
      // Add missing properties to match PostgrestQueryBuilder type
      url: new URL('https://example.com'),
      headers: {},
      insert: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    })),
  },
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('QuotesTable', () => {
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

  const renderTable = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <QuotesTable />
      </QueryClientProvider>
    );
  };

  it('renders quotes table with data', async () => {
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Test quote')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });

  it('handles quote deletion', async () => {
    renderTable();

    await waitFor(() => {
      expect(screen.getByText('Test quote')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('quotes');
    });
  });

  it('handles error state', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch quotes'),
      }),
      delete: vi.fn(),
      order: vi.fn().mockReturnThis(),
      // Add missing properties
      url: new URL('https://example.com'),
      headers: {},
      insert: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    }));

    renderTable();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch quotes/i)).toBeInTheDocument();
    });
  });
});