import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { AuthProvider } from '@/providers/AuthProvider';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
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

describe('Author Creation', () => {
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
});