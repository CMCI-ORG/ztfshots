import { describe, it, expect } from 'vitest';
import { useLanguage } from '@/providers/LanguageProvider';
import { renderHook } from '@testing-library/react';

describe('Translation Utils', () => {
  const mockContent = {
    text: 'Original English text',
    title: 'Original title',
    primary_language: 'en',
    translations: {
      fr: {
        text: 'Texte français',
        title: 'Titre français'
      }
    }
  };

  it('getTranslatedContent returns correct translation when available', () => {
    const { result } = renderHook(() => useLanguage());
    const translatedContent = result.current.getTranslatedContent(mockContent, 'text');
    
    expect(translatedContent).toBe(mockContent.text);
  });

  it('getTranslatedContent falls back to original content when translation is missing', () => {
    const { result } = renderHook(() => useLanguage());
    const translatedContent = result.current.getTranslatedContent({
      ...mockContent,
      translations: {}
    }, 'text');
    
    expect(translatedContent).toBe(mockContent.text);
  });

  it('getTranslatedContent handles missing translations object', () => {
    const { result } = renderHook(() => useLanguage());
    const translatedContent = result.current.getTranslatedContent({
      text: 'Original text',
      primary_language: 'en'
    }, 'text');
    
    expect(translatedContent).toBe('Original text');
  });
});