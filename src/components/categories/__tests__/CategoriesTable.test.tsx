import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesTable } from '../CategoriesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

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

const mockQuoteCounts = [
  {
    category_id: '1',
    quote_count: 5
  },
  {
    category_id: '2',
    quote_count: 3
  }
];

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock({
    select: vi.fn().mockImplementation(() => ({
      then: (onfulfilled: any) => {
        const response = { data: mockCategories, error: null };
        return Promise.resolve(onfulfilled ? onfulfilled(response) : response);
      }
    }))
  }),
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
      // Verify quote counts are displayed
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
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
    const errorMock = createSupabaseMock({
      select: vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error('Failed to fetch categories'),
        status: 400,
        statusText: 'Bad Request'
      })
    });

    vi.mocked(supabase.from).mockImplementationOnce(() => errorMock.from('categories'));

    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch categories/i)).toBeInTheDocument();
    });
  });
});