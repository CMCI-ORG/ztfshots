import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCategoryForm } from '../AddCategoryForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

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
    vi.clearAllMocks();
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
    vi.mocked(supabase.from).mockImplementation(() => ({
      insert: () => Promise.resolve({ data: { id: '1' }, error: null })
    }) as any);

    const user = userEvent.setup();
    renderWithProviders(<AddCategoryForm onSuccess={mockOnSuccess} />);

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(nameInput, 'Test Category');
    await user.type(descriptionInput, 'This is a test category description');
    
    const submitButton = screen.getByRole('button', { name: /add category/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});