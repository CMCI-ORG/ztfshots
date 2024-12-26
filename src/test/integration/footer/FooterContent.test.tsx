import { render, screen } from '@testing-library/react';
import { FooterContentRenderer } from '@/components/client-portal/footer/FooterContentRenderer';
import { renderWithProviders } from '@/test/utils/testUtils';

describe('FooterContentRenderer', () => {
  const mockContent = {
    id: '1',
    column_id: '1',
    content_type_id: '1',
    title: 'Test Title',
    content: {},
    order_position: 0,
  };

  const mockContentType = {
    id: '1',
    name: 'Test Type',
    type: 'text' as const,
    fields: {},
  };

  test('renders text content correctly', () => {
    const textContent = {
      ...mockContent,
      content: { text: 'Test text content' }
    };

    renderWithProviders(<FooterContentRenderer content={textContent} contentType={mockContentType} />);
    expect(screen.getByText('Test text content')).toBeInTheDocument();
  });

  test('renders links content correctly', () => {
    const linksContent = {
      ...mockContent,
      content: {
        links: [
          { text: 'Link 1', url: 'https://example.com/1' },
          { text: 'Link 2', url: 'https://example.com/2' }
        ]
      }
    };
    const linksType = { ...mockContentType, type: 'links' as const };

    renderWithProviders(<FooterContentRenderer content={linksContent} contentType={linksType} />);
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  test('renders social content correctly', () => {
    const socialContent = {
      ...mockContent,
      content: {
        links: [
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'twitter', url: 'https://twitter.com' }
        ]
      }
    };
    const socialType = { ...mockContentType, type: 'social' as const };

    renderWithProviders(<FooterContentRenderer content={socialContent} contentType={socialType} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://facebook.com');
    expect(links[1]).toHaveAttribute('href', 'https://twitter.com');
  });

  test('renders address content correctly', () => {
    const addressContent = {
      ...mockContent,
      content: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        email: 'test@example.com'
      }
    };
    const addressType = { ...mockContentType, type: 'address' as const };

    renderWithProviders(<FooterContentRenderer content={addressContent} contentType={addressType} />);
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('Test City, TS 12345')).toBeInTheDocument();
  });

  test('handles invalid content gracefully', () => {
    const invalidContent = {
      ...mockContent,
      content: null
    };

    renderWithProviders(<FooterContentRenderer content={invalidContent} contentType={mockContentType} />);
    expect(screen.getByText(/Failed to display content/i)).toBeInTheDocument();
  });
});