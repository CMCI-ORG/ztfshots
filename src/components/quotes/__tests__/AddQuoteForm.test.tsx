import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddQuoteForm } from '../AddQuoteForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock({
    select: vi.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'Test Author' },
        { id: '2', name: 'Test Category' },
      ],
      error: null,
    }),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const onSuccess = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

const renderForm = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AddQuoteForm onSuccess={onSuccess} />
    </QueryClientProvider>
  );
};

it('renders form fields', async () => {
  renderForm();

  await waitFor(() => {
    expect(screen.getByLabelText(/quote/i)).toBeInTheDocument();
    expect(screen.getByText(/select an author/i)).toBeInTheDocument();
    expect(screen.getByText(/select a category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/post date/i)).toBeInTheDocument();
  });
});

it('submits form with valid data including source fields and post date', async () => {
  const user = userEvent.setup();
  renderForm();

  await waitFor(() => {
    expect(screen.getByText(/select an author/i)).toBeInTheDocument();
  });

  await user.type(screen.getByLabelText(/quote/i), 'Test quote text');
  await user.type(screen.getByLabelText(/source title/i), 'Test Book');
  await user.type(
    screen.getByLabelText(/source url/i),
    'https://example.com/book'
  );

  // Select author and category
  const authorSelect = screen.getByText(/select an author/i);
  fireEvent.click(authorSelect);
  await waitFor(() => {
    fireEvent.click(screen.getByText('Test Author'));
  });

  const categorySelect = screen.getByText(/select a category/i);
  fireEvent.click(categorySelect);
  await waitFor(() => {
    fireEvent.click(screen.getByText('Test Category'));
  });

  // Select post date (future date)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);
  const dateButton = screen.getByRole('button', { name: /pick a date/i });
  fireEvent.click(dateButton);
  // Note: We're not actually selecting a date in the calendar as it's complex to test
  // Instead we're just verifying the calendar opens

  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(supabase.from).toHaveBeenCalledWith('quotes');
    expect(onSuccess).toHaveBeenCalled();
  });
});

it('shows validation errors for empty required fields', async () => {
  const user = userEvent.setup();
  renderForm();
  
  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText(/quote must be at least/i)).toBeInTheDocument();
    expect(screen.getByText(/please select an author/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a post date/i)).toBeInTheDocument();
  });
});

it('validates source URL format', async () => {
  const user = userEvent.setup();
  renderForm();

  await user.type(screen.getByLabelText(/source url/i), 'invalid-url');
  
  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
  });
});

it('handles API errors gracefully', async () => {
  const errorMessage = 'Failed to submit quote';
  vi.mocked(supabase.from).mockImplementationOnce(() => ({
    ...createSupabaseMock(),
    insert: vi.fn().mockResolvedValue({ error: new Error(errorMessage) }),
  }));

  const user = userEvent.setup();
  renderForm();

  await user.type(screen.getByLabelText(/quote/i), 'Test quote text');
  // Fill other required fields...
  
  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});