import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardMetrics } from '../DashboardMetrics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMetricsQuery } from '../metrics/useMetricsQuery';

// Mock the useMetricsQuery hook
vi.mock('../metrics/useMetricsQuery', () => ({
  useMetricsQuery: vi.fn(() => ({
    data: {
      visitors: 100,
      quotes: 50,
      authors: 20,
      categories: 10,
      likes: 200,
      stars: 150,
      downloads: 75,
      shares: 45
    },
    isLoading: false,
    isError: false
  }))
}));

describe('DashboardMetrics', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all metric cards', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
    expect(screen.getByText('Total Quotes')).toBeInTheDocument();
    expect(screen.getByText('Total Authors')).toBeInTheDocument();
    expect(screen.getByText('Total Categories')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    (useMetricsQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
  });

  it('handles error state appropriately', () => {
    (useMetricsQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardMetrics />
      </QueryClientProvider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to load dashboard metrics/i)).toBeInTheDocument();
  });
});