import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from '@/components/subscription/SubscriptionForm';
import { supabase } from "@/integrations/supabase/client";

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('Subscription Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles successful subscription flow', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({
      data: { message: 'Please check your email to verify your subscription' }
    });
    supabase.functions.invoke = mockInvoke;

    render(<SubscriptionForm />);
    const user = userEvent.setup();

    // Fill form
    await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/your email/i), 'john@example.com');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });

    // Verify API call
    expect(mockInvoke).toHaveBeenCalledWith('subscribe', {
      body: expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com'
      })
    });
  });

  it('handles subscription errors', async () => {
    const mockInvoke = vi.fn().mockRejectedValue(new Error('Subscription failed'));
    supabase.functions.invoke = mockInvoke;

    render(<SubscriptionForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/your email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/subscription failed/i)).toBeInTheDocument();
    });
  });

  it('handles existing subscriber error', async () => {
    const mockInvoke = vi.fn().mockRejectedValue(
      new Error('This email is already subscribed')
    );
    supabase.functions.invoke = mockInvoke;

    render(<SubscriptionForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
    await user.type(screen.getByPlaceholderText(/your email/i), 'existing@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument();
    });
  });
});