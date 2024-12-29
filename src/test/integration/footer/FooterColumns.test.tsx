import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FooterColumnsTable } from '@/components/admin/settings/footer/FooterColumnsTable';
import { renderWithProviders } from '@/test/utils/testUtils';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';
import { vi } from 'vitest';

type FooterColumn = Database['public']['Tables']['footer_columns']['Row'];
type Schema = Database['public'];

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', position: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', position: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ],
          error: null
        })) as unknown as PostgrestFilterBuilder<Schema, FooterColumn, FooterColumn[], "footer_columns">
      })),
      insert: vi.fn(() => Promise.resolve({
        error: null,
        data: [{ id: '3', position: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]
      })),
      delete: vi.fn(() => Promise.resolve({
        error: null,
        data: null
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
    const mockError = new Error('Failed to load columns');
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: () => ({
        order: () => Promise.resolve({
          data: null,
          error: mockError
        })
      })
    }) as unknown as ReturnType<typeof supabase.from>);

    renderWithProviders(<FooterColumnsTable />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});