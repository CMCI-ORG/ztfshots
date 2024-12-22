import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroSection } from '../HeroSection';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

describe('HeroSection', () => {
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

  it('renders loading skeleton initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HeroSection />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('displays featured quote after loading', async () => {
    const mockQuote = {
      text: 'Test Quote',
      authors: { name: 'Test Author' },
    };

    vi.mocked(supabase.from).mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockResolvedValue({
        data: mockQuote,
        error: null,
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <HeroSection />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(mockQuote.text)).toBeInTheDocument();
      expect(screen.getByText(`— ${mockQuote.authors.name}`)).toBeInTheDocument();
    });
  });

  it('renders action buttons', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HeroSection />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Explore Quotes')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      ...createSupabaseMock().from(),
      select: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch quote'),
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <HeroSection />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});