import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddQuoteForm } from '../AddQuoteForm';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Test Author' },
          { id: '2', name: 'Test Category' },
        ],
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
      // Add missing properties
      url: new URL('https://example.com'),
      headers: {},
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

describe('AddQuoteForm', () => {
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
    });
  });

  it('submits form with valid data including source fields', async () => {
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

    const submitButton = screen.getByRole('button', { name: /add quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('quotes');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    renderForm();
    
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/quote must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/please select an author/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
    });
  });

  it('validates source URL format', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/source url/i), 'invalid-url');
    
    const submitButton = screen.getByRole('button', { name: /add quote/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
    });
  });
});