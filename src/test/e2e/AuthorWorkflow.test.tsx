import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [] }),
      insert: vi.fn().mockResolvedValue({ data: [{ id: '123', name: 'Test Author' }], error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      url: new URL('https://example.com/mock'),
      headers: {},
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/test.jpg' } })
        })
      }
    }))
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Author Management End-to-End Flow', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should successfully complete the full author management workflow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    // Test adding a new author
    await waitFor(() => {
      expect(screen.getByText('Add New Author')).toBeInTheDocument();
    });

    // Fill out the author form
    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/biography/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(bioInput, 'A test biography that is longer than 10 characters');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/author has been added successfully/i)).toBeInTheDocument();
    });

    // Test author deletion flow
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Verify confirmation dialog appears
    expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmDelete = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmDelete);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/author deleted successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle form validation errors correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    // Verify validation errors
    await waitFor(() => {
      expect(screen.getByText(/author name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/bio must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'API Error' } }),
      insert: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      url: new URL('https://example.com/mock'),
      headers: {}
    }));

    renderWithProviders(<Authors />);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error loading authors/i)).toBeInTheDocument();
    });
  });
});