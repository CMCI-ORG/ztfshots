import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractionButton } from '../InteractionButton';
import { Heart } from 'lucide-react';

describe('InteractionButton', () => {
  it('renders children correctly', () => {
    render(
      <InteractionButton>
        <Heart className="h-4 w-4" />
      </InteractionButton>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays count when provided', () => {
    render(
      <InteractionButton count={5}>
        <Heart className="h-4 w-4" />
      </InteractionButton>
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    render(
      <InteractionButton isActive={true}>
        <Heart className="h-4 w-4" />
      </InteractionButton>
    );
    
    expect(screen.getByRole('button')).toHaveClass('text-[#8B5CF6]');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <InteractionButton onClick={handleClick}>
        <Heart className="h-4 w-4" />
      </InteractionButton>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});