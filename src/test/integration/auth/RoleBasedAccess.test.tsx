import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMockUser, createMockSession } from '@/test/mocks/authMocks';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      }),
    })),
  },
}));

describe.skip('Role-Based Access', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const renderProtectedRoute = (role: string) => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { role },
        error: null,
      }),
    }));

    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AdminProtectedRoute>
            <div>Protected Content</div>
          </AdminProtectedRoute>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('allows admin access to protected routes', async () => {
    const mockUser = createMockUser();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: createMockSession({ user: mockUser }),
      },
      error: null,
    });

    renderProtectedRoute('admin');

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects non-admin users from protected routes', async () => {
    const mockUser = createMockUser();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: createMockSession({ user: mockUser }),
      },
      error: null,
    });

    renderProtectedRoute('subscriber');

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  it('handles loading state correctly', async () => {
    vi.mocked(supabase.auth.getSession).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    renderProtectedRoute('admin');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles role fetch errors', async () => {
    const mockUser = createMockUser();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: createMockSession({ user: mockUser }),
      },
      error: null,
    });

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockRejectedValue(new Error('Failed to fetch role')),
    }));

    renderProtectedRoute('admin');

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
