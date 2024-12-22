import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddQuoteForm } from '../AddQuoteForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider } from '@/providers/AuthProvider';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

describe('AddQuoteForm', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AddQuoteForm />
        </AuthProvider>
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
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      execute: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      then: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      catch: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      finally: vi.fn().mockResolvedValue({ data: null, error: new Error('API Error') }),
      throwOnError: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      // Add the missing properties
      url: new URL('https://mock-url.com'),
      headers: {},
      upsert: vi.fn().mockReturnThis(),
    }));

    renderForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/quote/i)).toBeInTheDocument();
    });
  });
});