import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuickActions } from '../QuickActions';

describe('QuickActions', () => {
  const renderQuickActions = () => {
    return render(
      <BrowserRouter>
        <QuickActions />
      </BrowserRouter>
    );
  };

  it('renders all quick action cards', () => {
    renderQuickActions();

    expect(screen.getByText('Add New Quote')).toBeInTheDocument();
    expect(screen.getByText('Manage Authors')).toBeInTheDocument();
    expect(screen.getByText('Manage Categories')).toBeInTheDocument();
    expect(screen.getByText('View All Quotes')).toBeInTheDocument();
  });

  it('renders correct icons for each action', () => {
    renderQuickActions();

    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons).toHaveLength(4);
  });

  it('contains correct navigation links', () => {
    renderQuickActions();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    expect(links[0]).toHaveAttribute('href', '/admin/quotes');
    expect(links[1]).toHaveAttribute('href', '/admin/authors');
    expect(links[2]).toHaveAttribute('href', '/admin/categories');
    expect(links[3]).toHaveAttribute('href', '/admin/quotes');
  });

  it('applies animation classes correctly', () => {
    renderQuickActions();

    const cards = screen.getAllByRole('link');
    cards.forEach((card) => {
      expect(card).toHaveClass('animate-fade-in');
    });
  });
});