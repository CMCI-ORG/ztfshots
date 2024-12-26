import { render, screen } from '@testing-library/react';
import { LinkContent } from '@/components/client-portal/footer/content-types/LinkContent';

describe('LinkContent', () => {
  const mockLinks = [
    { text: 'Link 1', url: 'https://example.com/1' },
    { text: 'Link 2', url: 'https://example.com/2' }
  ];

  it('renders links correctly', () => {
    render(<LinkContent links={mockLinks} title="Test Links" />);
    
    expect(screen.getByText('Test Links')).toBeInTheDocument();
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://example.com/1');
    expect(links[1]).toHaveAttribute('href', 'https://example.com/2');
  });

  it('handles missing title gracefully', () => {
    render(<LinkContent links={mockLinks} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('handles invalid links data gracefully', () => {
    // @ts-ignore - Testing invalid input
    render(<LinkContent links="invalid" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applies correct accessibility attributes', () => {
    render(<LinkContent links={mockLinks} />);
    const links = screen.getAllByRole('link');
    
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});