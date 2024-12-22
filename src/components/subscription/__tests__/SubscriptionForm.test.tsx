import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from '../SubscriptionForm';
import { supabase } from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('SubscriptionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders subscription form correctly', () => {
    render(<SubscriptionForm />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe now/i })).toBeInTheDocument();
  });

  it('handles successful subscription', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({ data: { message: 'success' } });
    supabase.functions.invoke = mockInvoke;

    render(<SubscriptionForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/your email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe now/i }));

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('subscribe', {
        body: { name: 'John Doe', email: 'john@example.com' },
      });
    });
  });

  it('handles subscription failure', async () => {
    const mockInvoke = vi.fn().mockRejectedValue(new Error('Subscription failed'));
    supabase.functions.invoke = mockInvoke;

    render(<SubscriptionForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/your email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe now/i }));

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalled();
    });
  });
});