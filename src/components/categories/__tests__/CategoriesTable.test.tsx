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
];

const mockQuoteCounts = [
  {
    category_id: '1',
    quote_count: 5
  }
];

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
    vi.clearAllMocks();
  });

  it('renders categories table with data', async () => {
    // Mock Supabase responses
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'category_quote_counts') {
        return {
          select: () => Promise.resolve({ data: mockQuoteCounts, error: null })
        } as any;
      }
      return {
        select: () => Promise.resolve({ data: mockCategories, error: null })
      } as any;
    });

    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch categories';
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: () => Promise.resolve({ 
        data: null, 
        error: new Error(errorMessage)
      })
    }) as any);

    renderWithProviders(<CategoriesTable />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});