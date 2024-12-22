import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authors from '@/pages/Authors';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Author Deletion Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows confirmation dialog before deleting', async () => {
    renderWithProviders(<Authors />);

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it('successfully deletes an author', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('authors');
    });
  });
});