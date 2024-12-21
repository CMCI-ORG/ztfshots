import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesTable } from '../CategoriesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock data
const mockCategories = [
  {
    id: '1',
    name: 'Faith & Trust',
    description: 'Quotes about faith and trust',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Prayer',
    description: 'Quotes about prayer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      insert: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      order: vi.fn().mockReturnThis(),
      url: new URL('https://example.com'),
      headers: {},
    })),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CategoriesTable', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders categories table with data', async () => {
    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
      expect(screen.getByText('Prayer')).toBeInTheDocument();
    });
  });

  it('shows delete confirmation dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
    });

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
  });

  it('handles category deletion', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
    });

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('categories');
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error('Failed to fetch categories') 
      }),
      order: vi.fn().mockReturnThis(),
    }));

    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch categories/i)).toBeInTheDocument();
    });
  });
});