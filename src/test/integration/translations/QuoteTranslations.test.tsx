import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '@/test/utils/testUtils';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { useLanguage } from '@/providers/LanguageProvider';
import { vi } from 'vitest';

// Mock the useLanguage hook
vi.mock('@/providers/LanguageProvider', () => ({
  useLanguage: vi.fn(),
}));

describe('Quote Translations Integration', () => {
  const mockQuote = {
    id: '1',
    quote: 'Original quote in English',
    author: 'Test Author',
    category: 'Test Category',
    date: '2024-03-20',
    translations: {
      fr: {
        text: 'Citation traduite en français',
        title: 'Titre en français'
      }
    },
    primaryLanguage: 'en'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('displays original content when primary language is selected', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: 'en',
      getTranslatedContent: (content: any, field: string) => content[field]
    });

    const { getByText } = renderWithProviders(
      <QuoteCard {...mockQuote} />
    );

    expect(getByText('Original quote in English')).toBeInTheDocument();
  });

  it('displays translated content when different language is selected', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: 'fr',
      getTranslatedContent: (content: any, field: string) => 
        content.translations?.fr?.[field] || content[field]
    });

    const { getByText } = renderWithProviders(
      <QuoteCard {...mockQuote} />
    );

    expect(getByText('Citation traduite en français')).toBeInTheDocument();
  });

  it('falls back to original content when translation is not available', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: 'es',
      getTranslatedContent: (content: any, field: string) => 
        content.translations?.es?.[field] || content[field]
    });

    const { getByText } = renderWithProviders(
      <QuoteCard {...mockQuote} />
    );

    expect(getByText('Original quote in English')).toBeInTheDocument();
  });
});