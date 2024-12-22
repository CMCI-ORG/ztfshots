import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authors from '@/pages/Authors';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('Author Creation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens add author dialog when clicking add button', async () => {
    renderWithProviders(<Authors />);
    const addButton = await screen.findByRole('button', { name: /add author/i });
    await userEvent.click(addButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('successfully adds a new author', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    const addButton = await screen.findByRole('button', { name: /add author/i });
    await user.click(addButton);

    await user.type(screen.getByLabelText(/name/i), 'New Author');
    await user.type(screen.getByLabelText(/biography/i), 'New author biography');

    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('authors');
    });
  });
});