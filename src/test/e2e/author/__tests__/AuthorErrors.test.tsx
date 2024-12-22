import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { AuthProvider } from '@/providers/AuthProvider';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        data: null,
        error: new Error('Failed to fetch authors'),
        order: () => ({
          data: null,
          error: new Error('Failed to fetch authors')
        })
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
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    }
  }
}));

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

describe('Author Error Handling', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Authors />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('handles errors gracefully', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch authors/i)).toBeInTheDocument();
    });
  });
});