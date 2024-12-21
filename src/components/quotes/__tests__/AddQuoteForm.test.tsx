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
  supabase: createSupabaseMock(),
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
  const dateButton = screen.getByRole('button', { name: /pick a date/i });
  fireEvent.click(dateButton);

  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(supabase.from).toHaveBeenCalledWith('quotes');
    expect(onSuccess).toHaveBeenCalled();
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
    ...createSupabaseMock().from(),
    insert: vi.fn().mockResolvedValue({ error: new Error(errorMessage) }),
  }));

  const user = userEvent.setup();
  renderForm();

  await user.type(screen.getByLabelText(/quote/i), 'Test quote text');
  
  const submitButton = screen.getByRole('button', { name: /add quote/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});