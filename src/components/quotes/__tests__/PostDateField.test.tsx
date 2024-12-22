import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostDateField } from '../fields/PostDateField';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { QuoteFormValues, quoteFormSchema } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, subDays } from 'date-fns';

const TestWrapper = () => {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      text: "Test quote",
      author_id: "123",
      category_id: "456",
      post_date: new Date(),
    },
  });

  return (
    <Form {...form}>
      <PostDateField form={form} />
    </Form>
  );
};

describe('PostDateField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the date picker button', () => {
    render(<TestWrapper />);
    expect(screen.getByRole('button', { name: /pick a date/i })).toBeInTheDocument();
  });

  it('opens calendar on button click', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    const button = screen.getByRole('button', { name: /pick a date/i });
    await user.click(button);
    
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('disables past dates', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByRole('button', { name: /pick a date/i }));
    
    const pastDate = subDays(new Date(), 1);
    const pastDateCell = screen.getByRole('gridcell', { 
      name: new RegExp(pastDate.getDate().toString()) 
    });
    
    expect(pastDateCell).toHaveAttribute('aria-disabled', 'true');
  });

  it('allows selecting future dates', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByRole('button', { name: /pick a date/i }));
    
    const futureDate = addDays(new Date(), 1);
    const futureDateCell = screen.getByRole('gridcell', { 
      name: new RegExp(futureDate.getDate().toString()) 
    });
    
    await user.click(futureDateCell);
    
    // Calendar should close after selection
    await waitFor(() => {
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  it('displays selected date in formatted form', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByRole('button', { name: /pick a date/i }));
    
    const futureDate = addDays(new Date(), 1);
    const futureDateCell = screen.getByRole('gridcell', { 
      name: new RegExp(futureDate.getDate().toString()) 
    });
    
    await user.click(futureDateCell);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(
        format(futureDate, "PPP")
      );
    });
  });
});