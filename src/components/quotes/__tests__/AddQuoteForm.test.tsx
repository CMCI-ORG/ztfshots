import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddQuoteForm } from '../AddQuoteForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider } from '@/providers/AuthProvider';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        data: [
          { id: '1', name: 'Test Author' },
          { id: '2', name: 'Test Category' }
        ],
        error: null
      }),
      insert: () => ({
        data: [{ id: '1' }],
        error: null
      }),
      order: () => ({
        data: [
          { id: '1', name: 'Test Author' },
          { id: '2', name: 'Test Category' }
        ],
        error: null
      })
    }),
    auth: {
      getUser: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }, 
        error: null 
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } }
      })
    }
  }
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

const renderForm = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AddQuoteForm />
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('AddQuoteForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: () => ({
        data: null,
        error: new Error('Failed to fetch quotes')
      }),
      insert: () => ({
        data: null,
        error: new Error('Failed to submit quote')
      }),
      order: () => ({
        data: null,
        error: new Error('Failed to fetch quotes')
      })
    }));

    renderForm();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch quotes/i)).toBeInTheDocument();
    });
  });
});