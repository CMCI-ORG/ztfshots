import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FooterColumnsTable } from '@/components/admin/settings/footer/FooterColumnsTable';
import { renderWithProviders } from '@/test/utils/testUtils';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            { id: '1', position: 1 },
            { id: '2', position: 2 }
          ],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        error: null,
        data: [{ id: '3', position: 3 }]
      })),
      delete: vi.fn(() => ({
        error: null
      }))
    }))
  }
}));

describe('FooterColumns Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders existing columns', async () => {
    renderWithProviders(<FooterColumnsTable />);

    await waitFor(() => {
      expect(screen.getByText('Column 1')).toBeInTheDocument();
      expect(screen.getByText('Column 2')).toBeInTheDocument();
    });
  });

  test('adds new column', async () => {
    renderWithProviders(<FooterColumnsTable />);

    const addButton = screen.getByRole('button', { name: /add column/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('footer_columns');
    });
  });

  test('deletes column', async () => {
    renderWithProviders(<FooterColumnsTable />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Delete column');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('footer_columns');
    });
  });

  test('handles error states', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: () => ({
        order: () => ({
          data: null,
          error: new Error('Failed to load columns')
        })
      })
    }));

    renderWithProviders(<FooterColumnsTable />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});