import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authors from '@/pages/Authors';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Author Update Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens edit dialog with pre-filled data', async () => {
    renderWithProviders(<Authors />);

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Bio')).toBeInTheDocument();
  });

  it('successfully updates an author', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('Test Author');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Author');

    const updateButton = screen.getByRole('button', { name: /update author/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('authors');
    });
  });
});