import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { QuoteForm } from '../QuoteForm';

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

  it('validates past dates are not allowed', async () => {
    const user = userEvent.setup();
    renderForm();

    // Try to select a past date
    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    // Verify past dates are disabled
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateCell = screen.getByRole('gridcell', { name: new RegExp(pastDate.getDate().toString()) });
    expect(pastDateCell).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles invalid date inputs', async () => {
    const user = userEvent.setup();
    renderForm();

    const dateButton = screen.getByRole('button', { name: /pick a date/i });
    await user.click(dateButton);

    // Try to submit without selecting a date
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a post date/i)).toBeInTheDocument();
    });
  });
});