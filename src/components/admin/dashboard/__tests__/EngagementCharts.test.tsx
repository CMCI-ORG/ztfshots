import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EngagementCharts } from '../EngagementCharts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useEngagementQueries hook
vi.mock('../charts/useEngagementQueries', () => ({
  useEngagementQueries: () => ({
    userGrowthQuery: {
      data: [
        { month: 'Jan', users: 10 },
        { month: 'Feb', users: 20 }
      ],
      isLoading: false,
      isError: false
    },
    categoryEngagementQuery: {
      data: [
        { category: 'Faith', engagement: 100 },
        { category: 'Prayer', engagement: 80 }
      ],
      isLoading: false,
      isError: false
    }
  })
}));

describe('EngagementCharts', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both charts', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getByLabelText('Select time range for analytics')).toBeInTheDocument();
  });

  it('handles time range filter changes', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EngagementCharts />
      </QueryClientProvider>
    );

    const timeRangeFilter = screen.getByLabelText('Select time range for analytics');
    fireEvent.change(timeRangeFilter, { target: { value: 'this_month' } });

    expect(timeRangeFilter).toHaveValue('this_month');
  });
});