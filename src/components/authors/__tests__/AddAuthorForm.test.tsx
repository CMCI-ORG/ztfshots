import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AddAuthorForm } from '../AddAuthorForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' } }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://test.com/test.jpg' } }),
      }),
    },
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// Mock the toast component
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AddAuthorForm', () => {
  const queryClient = new QueryClient();

  const renderForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddAuthorForm />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/biography/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    renderForm();
    const submitButton = screen.getByRole('button', { name: /add author/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/author name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/bio must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('successfully submits the form with valid data', async () => {
    renderForm();
    
    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/biography/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(bioInput, 'This is a test biography that is long enough to pass validation.');
    
    const submitButton = screen.getByRole('button', { name: /add author/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('authors');
    });
  });
});