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

describe('Quote Status Transitions', () => {
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

  it('sets status to scheduled for future dates', async () => {
    const user = userEvent.setup();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockSupabase = createSupabaseMock({
      insert: vi.fn().mockResolvedValue({ 
        data: [{ status: 'scheduled', post_date: tomorrow.toISOString() }],
        error: null 
      })
    });

    vi.mocked(supabase.from).mockImplementation(() => mockSupabase.from('quotes'));
    
    renderForm();

    await user.type(screen.getByLabelText(/quote/i), 'Future scheduled quote');
    
    // Select future date
    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);
    // Select tomorrow in the calendar
    const tomorrowCell = screen.getByRole('gridcell', { name: new RegExp(tomorrow.getDate().toString()) });
    await user.click(tomorrowCell);

    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'scheduled'
        })
      );
    });
  });

  it('sets status to live for current date', async () => {
    const user = userEvent.setup();
    const today = new Date();

    const mockSupabase = createSupabaseMock({
      insert: vi.fn().mockResolvedValue({ 
        data: [{ status: 'live', post_date: today.toISOString() }],
        error: null 
      })
    });

    vi.mocked(supabase.from).mockImplementation(() => mockSupabase.from('quotes'));
    
    renderForm();

    await user.type(screen.getByLabelText(/quote/i), 'Live quote');
    
    // Select today's date
    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);
    const todayCell = screen.getByRole('gridcell', { name: new RegExp(today.getDate().toString()) });
    await user.click(todayCell);

    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'live'
        })
      );
    });
  });
});