import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardMetrics } from '../DashboardMetrics';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [],
        count: 5,
        error: null,
      }),
    })),
  },
}));

describe('DashboardMetrics', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('renders loading skeletons initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays metrics after loading', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: [],
        count: 5,
        error: null,
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Quotes')).toBeInTheDocument();
      expect(screen.getByText('Total Authors')).toBeInTheDocument();
      expect(screen.getByText('Total Categories')).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch metrics'),
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});