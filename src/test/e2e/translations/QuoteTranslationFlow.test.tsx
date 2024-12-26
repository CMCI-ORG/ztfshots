import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/components/client-portal/HeroSection';
import { LanguageProvider } from '@/providers/LanguageProvider';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{
          id: '1',
          text: 'Test quote in English',
          translations: {
            fr: {
              text: 'Citation de test en français',
              title: 'Titre en français'
            }
          },
          primary_language: 'en',
          authors: { name: 'Test Author' },
          categories: { name: 'Test Category' },
          created_at: new Date().toISOString(),
        }],
        error: null,
      }),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
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

describe('Quote Translation E2E Flow', () => {
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <BrowserRouter>
            <HeroSection />
          </BrowserRouter>
        </LanguageProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('loads and displays quote in default language', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test quote in English')).toBeInTheDocument();
    });
  });

  it('switches quote content when language is changed', async () => {
    renderComponent();

    // Wait for the initial quote to load
    await waitFor(() => {
      expect(screen.getByText('Test quote in English')).toBeInTheDocument();
    });

    // Find and click the language switcher
    const languageSwitcher = screen.getByRole('combobox');
    fireEvent.change(languageSwitcher, { target: { value: 'fr' } });

    // Wait for the translated content to appear
    await waitFor(() => {
      expect(screen.getByText('Citation de test en français')).toBeInTheDocument();
    });
  });

  it('falls back to original content when translation is missing', async () => {
    // Mock the quote data without French translation
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{
          id: '1',
          text: 'Test quote in English',
          translations: {},
          primary_language: 'en',
          authors: { name: 'Test Author' },
          categories: { name: 'Test Category' },
          created_at: new Date().toISOString(),
        }],
        error: null,
      }),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
    }));

    renderComponent();

    // Wait for the initial quote to load
    await waitFor(() => {
      expect(screen.getByText('Test quote in English')).toBeInTheDocument();
    });

    // Switch to French
    const languageSwitcher = screen.getByRole('combobox');
    fireEvent.change(languageSwitcher, { target: { value: 'fr' } });

    // Should still show English content as fallback
    await waitFor(() => {
      expect(screen.getByText('Test quote in English')).toBeInTheDocument();
    });
  });
});