import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { QuoteForm } from '../QuoteForm';
import { addDays, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Quote Date Validation', () => {
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

  it('shows error when no date is selected', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill in other required fields
    await user.type(screen.getByLabelText(/quote/i), 'Test quote text');
    
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a post date/i)).toBeInTheDocument();
    });
  });

  it('shows error when past date is selected', async () => {
    const user = userEvent.setup();
    renderForm();

    // Try to select a past date
    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    // Verify past dates are disabled
    const pastDate = subDays(new Date(), 1);
    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();

    await waitFor(() => {
      const pastDateCell = screen.getByRole('gridcell', { 
        name: new RegExp(pastDate.getDate().toString()) 
      });
      expect(pastDateCell).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('accepts valid future date', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill in required fields
    await user.type(screen.getByLabelText(/quote/i), 'Test quote text');
    
    // Select author and category
    const authorSelect = screen.getByText(/select an author/i);
    await user.click(authorSelect);
    await waitFor(() => {
      user.click(screen.getByText('Test Author'));
    });

    const categorySelect = screen.getByText(/select a category/i);
    await user.click(categorySelect);
    await waitFor(() => {
      user.click(screen.getByText('Test Category'));
    });

    // Select future date
    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    const futureDate = addDays(new Date(), 1);
    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('quotes');
    });
  });

  it('handles date selection cancellation gracefully', async () => {
    const user = userEvent.setup();
    renderForm();

    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    // Click outside to close the calendar
    await user.click(document.body);

    // Verify the form is still in a valid state
    expect(screen.getByRole('button', { name: /pick a date/i })).toBeInTheDocument();
  });
});