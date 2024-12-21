import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock(),
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

  it('handles API errors gracefully', async () => {
    // Mock API error
    const errorMock = createSupabaseMock({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'API Error' },
        status: 400,
        statusText: 'Bad Request'
      })
    });

    vi.mocked(supabase.from).mockImplementationOnce(() => errorMock.from('authors'));

    renderWithProviders(<Authors />);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('handles image upload errors', async () => {
    const user = userEvent.setup();
    const errorMock = createSupabaseMock({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: null, error: new Error('Upload failed') }),
        }),
      }
    });

    vi.mocked(supabase.from).mockImplementationOnce(() => errorMock.from('authors'));

    renderWithProviders(<Authors />);

    // Try to upload an image
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/image/i);
    await user.upload(input, file);

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/failed to upload image/i)).toBeInTheDocument();
    });
  });
});
