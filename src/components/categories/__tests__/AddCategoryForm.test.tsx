import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCategoryForm } from '../AddCategoryForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      order: vi.fn().mockReturnThis(),
      url: new URL('https://example.com'),
      headers: {},
    })),
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
      {component}
    </QueryClientProvider>
  );
};

describe('AddCategoryForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    queryClient.clear();
    mockOnSuccess.mockClear();
  });

  it('renders form fields correctly', () => {
    renderWithProviders(<AddCategoryForm onSuccess={mockOnSuccess} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddCategoryForm onSuccess={mockOnSuccess} />);
    
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/category name must be at least/i)).toBeInTheDocument();
      expect(screen.getByText(/description must be at least/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddCategoryForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'Test Category');
    await user.type(descriptionInput, 'This is a test category description');
    
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      insert: vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error('API Error') 
      }),
    }));

    renderWithProviders(<AddCategoryForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'Test Category');
    await user.type(descriptionInput, 'This is a test category description');
    
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to add category/i)).toBeInTheDocument();
    });
  });
});