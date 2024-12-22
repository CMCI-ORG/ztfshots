import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import { AuthProvider } from '@/providers/AuthProvider';

// Mock Supabase client with proper types
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        data: [
          {
            id: '1',
            name: 'Test Author',
            bio: 'Test bio',
            image_url: 'test.jpg'
          }
        ],
        error: null,
        order: () => ({
          data: [
            {
              id: '1',
              name: 'Test Author',
              bio: 'Test bio',
              image_url: 'test.jpg'
            }
          ],
          error: null
        }),
        eq: () => ({
          single: () => ({
            data: { role: 'admin' },
            error: null
          })
        })
      }),
      insert: () => ({
        data: [{ id: '1' }],
        error: null,
        select: () => ({
          data: [{ id: '1' }],
          error: null
        })
      }),
      update: () => ({
        data: [{ id: '1' }],
        error: null,
        eq: () => ({
          select: () => ({
            data: [{ id: '1' }],
            error: null
          })
        })
      }),
      delete: () => ({
        data: null,
        error: null,
        eq: () => ({
          select: () => ({
            data: null,
            error: null
          })
        })
      }),
      order: () => ({
        data: [
          {
            id: '1',
            name: 'Test Author',
            bio: 'Test bio',
            image_url: 'test.jpg'
          }
        ],
        error: null
      })
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: { path: 'test.jpg' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'http://test.com/test.jpg' } })
      })
    },
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

describe('Author Management', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('renders authors list', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  it('handles author creation', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const addButton = await screen.findByRole('button', { name: /add author/i });
    await user.click(addButton);

    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/biography/i);
    
    await user.type(nameInput, 'New Author');
    await user.type(bioInput, 'New author biography');

    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/author has been added/i)).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: () => ({
        data: null,
        error: new Error('Failed to fetch authors'),
        order: () => ({
          data: null,
          error: new Error('Failed to fetch authors')
        }),
        eq: () => ({
          single: () => ({
            data: null,
            error: new Error('Failed to fetch authors')
          })
        })
      }),
      insert: () => ({
        data: null,
        error: new Error('Failed to create author'),
        select: () => ({
          data: null,
          error: new Error('Failed to create author')
        })
      }),
      update: () => ({
        data: null,
        error: new Error('Failed to update author'),
        eq: () => ({
          select: () => ({
            data: null,
            error: new Error('Failed to update author')
          })
        })
      }),
      delete: () => ({
        data: null,
        error: new Error('Failed to delete author'),
        eq: () => ({
          select: () => ({
            data: null,
            error: new Error('Failed to delete author')
          })
        })
      }),
      order: () => ({
        data: null,
        error: new Error('Failed to fetch authors')
      })
    }));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch authors/i)).toBeInTheDocument();
    });
  });
});