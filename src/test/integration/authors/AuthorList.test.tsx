import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import Authors from '@/pages/Authors';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{ 
          id: '1', 
          name: 'Test Author', 
          bio: 'Test Bio',
          image_url: 'https://example.com/image.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }],
        error: null
      })
    }))
  }
}));

describe('Author Listing Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays authors list with correct data', async () => {
    renderWithProviders(<Authors />);
    await waitFor(() => {
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test Bio')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching authors', () => {
    renderWithProviders(<Authors />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});