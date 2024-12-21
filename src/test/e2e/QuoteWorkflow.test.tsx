import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({
        data: [
          {
            id: '456',
            text: 'New Quote',
            author_id: '789',
            category_id: '012',
          },
        ],
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
      // Add missing properties
      url: new URL('https://example.com'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
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

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Quote Management End-to-End Flow', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('displays quotes in the table', async () => {
    renderWithProviders(<Quotes />);

    await waitFor(() => {
      expect(screen.getByText('Test Quote')).toBeInTheDocument();
    });
  });

  it('handles adding a new quote', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quotes />);

    // Open the add quote form
    const addButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(addButton);

    // Fill out the quote form
    const quoteInput = screen.getByLabelText(/quote/i);
    await user.type(quoteInput, 'New inspirational quote');

    // Select author and category
    const authorSelect = screen.getByText(/select an author/i);
    await user.click(authorSelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Author'));
    });

    const categorySelect = screen.getByText(/select a category/i);
    await user.click(categorySelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Category'));
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/quote has been added/i)).toBeInTheDocument();
    });
  });

  it('handles quote deletion', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quotes />);

    // Wait for quotes to load
    await waitFor(() => {
      expect(screen.getByText('Test Quote')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Verify confirmation dialog
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/quote deleted/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'API Error' },
      }),
      insert: vi.fn(),
      delete: vi.fn(),
      order: vi.fn().mockReturnThis(),
      // Add missing properties
      url: new URL('https://example.com'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
    }));

    renderWithProviders(<Quotes />);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});