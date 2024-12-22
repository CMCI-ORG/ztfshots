import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { AuthProvider } from '@/providers/AuthProvider';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          { 
            id: '1', 
            name: 'Test Author', 
            bio: 'Test Bio',
            image_url: 'https://example.com/image.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        error: null
      }),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: '2', name: 'New Author' }],
        error: null
      }),
      update: vi.fn().mockResolvedValue({
        data: [{ id: '1', name: 'Updated Author' }],
        error: null
      }),
      delete: vi.fn().mockResolvedValue({
        error: null
      }),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('https://example.com'),
      headers: {},
      upsert: vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        error: null
      }),
      // Add other required PostgrestQueryBuilder properties
      single: vi.fn(),
      maybeSingle: vi.fn(),
      range: vi.fn(),
      limit: vi.fn(),
      filter: vi.fn(),
      match: vi.fn(),
      neq: vi.fn(),
      gt: vi.fn(),
      lt: vi.fn(),
      gte: vi.fn(),
      lte: vi.fn(),
      like: vi.fn(),
      ilike: vi.fn(),
      is: vi.fn(),
      in: vi.fn(),
      contains: vi.fn(),
      containedBy: vi.fn(),
      rangeLt: vi.fn(),
      rangeGt: vi.fn(),
      rangeGte: vi.fn(),
      rangeLte: vi.fn(),
      rangeAdjacent: vi.fn(),
      overlaps: vi.fn(),
      textSearch: vi.fn(),
      not: vi.fn(),
      or: vi.fn(),
      filter: vi.fn(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-image.jpg' }, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test-image.jpg' } }))
      }))
    }
  }
}));

// Mock toast notifications
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

describe('Author Management Integration Tests', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const renderAuthorsPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Authors />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  describe('Author Listing', () => {
    it('displays authors list with correct data', async () => {
      renderAuthorsPage();

      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('Test Bio')).toBeInTheDocument();
      });
    });

    it('shows loading state while fetching authors', () => {
      renderAuthorsPage();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Author Creation', () => {
    it('opens add author dialog when clicking add button', async () => {
      renderAuthorsPage();
      const addButton = await screen.findByRole('button', { name: /add author/i });
      fireEvent.click(addButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('successfully adds a new author', async () => {
      const user = userEvent.setup();
      renderAuthorsPage();

      // Open add dialog
      const addButton = await screen.findByRole('button', { name: /add author/i });
      await user.click(addButton);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'New Author');
      await user.type(screen.getByLabelText(/biography/i), 'New author biography');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add author/i });
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('authors');
      });
    });
  });

  describe('Author Update', () => {
    it('opens edit dialog with pre-filled data', async () => {
      renderAuthorsPage();

      // Wait for authors to load
      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      // Verify form is pre-filled
      expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Bio')).toBeInTheDocument();
    });

    it('successfully updates an author', async () => {
      const user = userEvent.setup();
      renderAuthorsPage();

      // Wait for authors to load and click edit
      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
      });
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Update form
      const nameInput = screen.getByDisplayValue('Test Author');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Author');

      // Submit form
      const updateButton = screen.getByRole('button', { name: /update author/i });
      await user.click(updateButton);

      // Verify API call
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('authors');
      });
    });
  });

  describe('Author Deletion', () => {
    it('shows confirmation dialog before deleting', async () => {
      renderAuthorsPage();

      // Wait for authors to load
      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Verify confirmation dialog
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });

    it('successfully deletes an author', async () => {
      const user = userEvent.setup();
      renderAuthorsPage();

      // Wait for authors to load
      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      // Verify API call
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('authors');
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch') }),
        insert: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to insert') }),
        update: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to update') }),
        delete: vi.fn().mockResolvedValue({ error: new Error('Failed to delete') }),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }));
    });

    it('handles fetch errors gracefully', async () => {
      renderAuthorsPage();
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('displays error message when author creation fails', async () => {
      const user = userEvent.setup();
      renderAuthorsPage();

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
});