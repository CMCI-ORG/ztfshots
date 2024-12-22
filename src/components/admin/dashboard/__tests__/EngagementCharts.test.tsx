import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EngagementCharts } from '../EngagementCharts';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
}));

describe('EngagementCharts', () => {
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

  it('renders chart titles', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getByText('Category Engagement')).toBeInTheDocument();
  });

  it('fetches and processes user growth data', async () => {
    const mockData = [
      { created_at: '2024-01-01' },
      { created_at: '2024-01-02' },
    ];

    vi.mocked(supabase.from).mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  it('fetches and processes category engagement data', async () => {
    const mockData = [
      { 
        categories: { name: 'Category 1' },
        quote_likes: [1, 2, 3],
      },
    ];

    vi.mocked(supabase.from).mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('quotes');
    });
  });

  it('handles error states gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch data'),
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});