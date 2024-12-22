import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authors from '@/pages/Authors';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Author Error Handling Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch') }),
      insert: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to insert') }),
      update: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to update') }),
      delete: vi.fn().mockResolvedValue({ error: new Error('Failed to delete') }),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('https://mock-url.com'),
      headers: {},
      upsert: vi.fn()
    }));
  });

  it('handles fetch errors gracefully', async () => {
    renderWithProviders(<Authors />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('displays error message when author creation fails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    const addButton = await screen.findByRole('button', { name: /add author/i });
    await user.click(addButton);

    await user.type(screen.getByLabelText(/name/i), 'New Author');
    await user.type(screen.getByLabelText(/biography/i), 'New author biography');

    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to insert/i)).toBeInTheDocument();
    });
  });
});