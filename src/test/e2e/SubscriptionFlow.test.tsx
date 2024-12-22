import { test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ClientPortal } from '@/pages/ClientPortal';
import { supabase } from "@/integrations/supabase/client";

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

test('complete subscription flow', async () => {
  const mockInvoke = vi.fn().mockResolvedValue({ data: { message: 'success' } });
  supabase.functions.invoke = mockInvoke;

  render(
    <BrowserRouter>
      <ClientPortal />
    </BrowserRouter>
  );

  const user = userEvent.setup();

  // Click subscribe button
  const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
  await user.click(subscribeButton);

  // Fill in subscription form
  await user.type(screen.getByPlaceholderText(/your name/i), 'John Doe');
  await user.type(screen.getByPlaceholderText(/your email/i), 'john@example.com');
  
  // Submit form
  const submitButton = screen.getByRole('button', { name: /subscribe now/i });
  await user.click(submitButton);

  // Verify subscription request was made
  await waitFor(() => {
    expect(mockInvoke).toHaveBeenCalledWith('subscribe', {
      body: { name: 'John Doe', email: 'john@example.com' },
    });
  });
});