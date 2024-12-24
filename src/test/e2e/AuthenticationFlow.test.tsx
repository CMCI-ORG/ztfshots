import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import Login from '@/pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMockUser, createMockSession, createMockAuthError } from '@/test/mocks/authMocks';

// Skip this test suite temporarily
describe.skip('Authentication Flow', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const renderLogin = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('redirects admin users to admin dashboard', async () => {
    const mockUser = createMockUser();
    const mockSession = createMockSession({ user: mockUser });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin');
    });
  });

  it('redirects regular users to profile page', async () => {
    const mockUser = createMockUser();
    const mockSession = createMockSession({ user: mockUser });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { role: 'subscriber' },
        error: null,
      }),
    }));

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/profile');
    });
  });

  it('handles network errors gracefully', async () => {
    const mockError = createMockAuthError('Network error');

    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValueOnce(mockError);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
