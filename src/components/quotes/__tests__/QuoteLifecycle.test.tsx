import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';
import { QuoteForm } from '../QuoteForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Quote Lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <QuoteForm mode="add" />
      </QueryClientProvider>
    );
  };

  it('handles complete quote lifecycle from creation to update', async () => {
    const user = userEvent.setup();
    const quoteId = 'test-quote-id';
    const initialQuote = {
      id: quoteId,
      text: 'Initial quote',
      author_id: 'author-1',
      category_id: 'category-1',
      status: 'scheduled',
      post_date: new Date().toISOString(),
    };

    const mockSupabase = createSupabaseMock({
      insert: vi.fn().mockResolvedValue({ data: [initialQuote], error: null }),
      update: vi.fn().mockResolvedValue({ 
        data: [{ ...initialQuote, text: 'Updated quote' }],
        error: null 
      })
    });

    vi.mocked(supabase.from).mockImplementation(() => mockSupabase.from('quotes'));

    // Create quote
    renderForm();
    await user.type(screen.getByLabelText(/quote/i), initialQuote.text);
    
    // Fill other required fields
    const authorSelect = screen.getByText(/select an author/i);
    await user.click(authorSelect);
    await waitFor(() => {
      const authorOption = screen.getByText('Test Author');
      user.click(authorOption);
    });

    const categorySelect = screen.getByText(/select a category/i);
    await user.click(categorySelect);
    await waitFor(() => {
      const categoryOption = screen.getByText('Test Category');
      user.click(categoryOption);
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          text: initialQuote.text
        })
      );
    });

    // Verify success message
    expect(screen.getByText(/quote has been added successfully/i)).toBeInTheDocument();

    // Update quote
    render(
      <QueryClientProvider client={queryClient}>
        <QuoteForm 
          mode="edit" 
          quoteId={quoteId}
          initialValues={{
            text: initialQuote.text,
            author_id: initialQuote.author_id,
            category_id: initialQuote.category_id,
            post_date: new Date(),
          }}
        />
      </QueryClientProvider>
    );

    await user.clear(screen.getByLabelText(/quote/i));
    await user.type(screen.getByLabelText(/quote/i), 'Updated quote');

    const updateButton = screen.getByRole('button', { name: /update quote/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Updated quote'
        })
      );
    });

    // Verify update success message
    expect(screen.getByText(/quote has been updated successfully/i)).toBeInTheDocument();
  });
});