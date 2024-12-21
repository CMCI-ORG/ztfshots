import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import Categories from '@/pages/Categories';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '123',
            name: 'Faith & Trust',
            description: 'Quotes about faith and trust',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({
        data: [
          {
            id: '456',
            name: 'Test Category',
            description: 'Test Description',
          },
        ],
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
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

describe('Category Management End-to-End Flow', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('displays categories in the table', async () => {
    renderWithProviders(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
    });
  });

  it('handles adding a new category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Categories />);

    // Open the add category form
    const addButton = screen.getByRole('button', { name: /add category/i });
    await user.click(addButton);

    // Fill out the category form
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'Test Category');
    await user.type(descriptionInput, 'Test Description');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/category has been added/i)).toBeInTheDocument();
    });
  });

  it('handles category deletion', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Categories />);

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Faith & Trust')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Verify confirmation dialog
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/category deleted/i)).toBeInTheDocument();
    });
  });

  it('handles form validation errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Categories />);

    // Open the add category form
    const addButton = screen.getByRole('button', { name: /add category/i });
    await user.click(addButton);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    // Verify validation errors
    await waitFor(() => {
      expect(screen.getByText(/category name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/description must be at least/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'API Error' },
      }),
      insert: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      order: vi.fn().mockReturnThis(),
    }));

    renderWithProviders(<Categories />);

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});