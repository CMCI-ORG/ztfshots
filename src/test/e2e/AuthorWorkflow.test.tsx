import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Authors from '@/pages/Authors';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import { createSupabaseMock } from '@/test/mocks/supabaseMock';
import { toast } from '@/components/ui/use-toast';

// Mock the toast component
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() }),
}));

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
    vi.clearAllMocks();
  });

  it('should successfully complete the full author management workflow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    // Test adding a new author
    await waitFor(() => {
      expect(screen.getByText('Add Author')).toBeInTheDocument();
    });

    // Click add author button
    const addButton = screen.getByRole('button', { name: /add author/i });
    await user.click(addButton);

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
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: expect.stringContaining('added successfully'),
        })
      );
    });

    // Test editing an author
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Update author details
    const editNameInput = screen.getByLabelText(/name/i);
    await user.clear(editNameInput);
    await user.type(editNameInput, 'John Doe Updated');

    const editBioInput = screen.getByLabelText(/biography/i);
    await user.clear(editBioInput);
    await user.type(editBioInput, 'Updated biography for testing');

    // Submit edit form
    const updateButton = screen.getByRole('button', { name: /update author/i });
    await user.click(updateButton);

    // Verify edit success message
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: expect.stringContaining('updated successfully'),
        })
      );
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
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: expect.stringContaining('deleted successfully'),
        })
      );
    });
  });

  it('should handle form validation errors correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    // Open add author form
    const addButton = screen.getByRole('button', { name: /add author/i });
    await user.click(addButton);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    // Verify validation errors
    await waitFor(() => {
      expect(screen.getByText(/author name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/bio must be at least 10 characters/i)).toBeInTheDocument();
    });

    // Test invalid image upload
    const imageInput = screen.getByLabelText(/profile image/i);
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    await user.upload(imageInput, invalidFile);

    await waitFor(() => {
      expect(screen.getByText(/only .jpg, .jpeg, .png and .webp files are accepted/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error for author creation
    const errorMessage = 'Failed to create author';
    const errorMock = createSupabaseMock({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: new Error(errorMessage) }),
      }),
    });

    vi.mocked(supabase.from).mockImplementation(errorMock.from);

    const user = userEvent.setup();
    renderWithProviders(<Authors />);

    // Open add author form
    const addButton = screen.getByRole('button', { name: /add author/i });
    await user.click(addButton);

    // Fill form with valid data
    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/biography/i);
    
    await user.type(nameInput, 'Test Author');
    await user.type(bioInput, 'Test biography for error handling');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining(errorMessage),
          variant: 'destructive',
        })
      );
    });
  });

  it('should handle image upload errors', async () => {
    const user = userEvent.setup();
    const uploadErrorMessage = 'Failed to upload image';
    const errorMock = createSupabaseMock({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: null, error: new Error(uploadErrorMessage) }),
        }),
      },
    });

    vi.mocked(supabase.storage.from).mockImplementation(errorMock.storage.from);

    renderWithProviders(<Authors />);

    // Open add author form
    const addButton = screen.getByRole('button', { name: /add author/i });
    await user.click(addButton);

    // Try to upload an image
    const imageInput = screen.getByLabelText(/profile image/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await user.upload(imageInput, file);

    // Fill other required fields
    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/biography/i);
    
    await user.type(nameInput, 'Test Author');
    await user.type(bioInput, 'Test biography for image upload error');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add author/i });
    await user.click(submitButton);

    // Verify error message
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: expect.stringContaining(uploadErrorMessage),
          variant: 'destructive',
        })
      );
    });
  });

  it('should handle network errors', async () => {
    // Mock network error
    const networkErrorMock = createSupabaseMock({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockRejectedValue(new Error('Network error')),
      }),
    });

    vi.mocked(supabase.from).mockImplementation(networkErrorMock.from);

    renderWithProviders(<Authors />);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});