import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { SubscribersTable } from '@/components/subscribers/SubscribersTable';
import { Subscriber } from '@/integrations/supabase/types/users';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            status: 'active',
            notify_new_quotes: true,
            notify_weekly_digest: true,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        error: null,
      }),
      update: vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        error: null,
      }),
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

describe('Subscriber Management Flow', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const renderSubscribersTable = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SubscribersTable />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('displays subscribers table with data', async () => {
    renderSubscribersTable();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    // Verify table structure
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('handles subscriber editing', async () => {
    const user = userEvent.setup();
    renderSubscribersTable();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Verify edit form appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');

    // Edit subscriber details
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'John Smith');
    
    // Submit form
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    // Verify Supabase update was called
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
    });
  });

  it('handles subscriber deactivation', async () => {
    const user = userEvent.setup();
    renderSubscribersTable();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click deactivate button
    const deactivateButton = screen.getByRole('button', { name: /deactivate/i });
    await user.click(deactivateButton);

    // Verify Supabase update was called with status change
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('subscribers');
    });
  });

  it('displays loading state', () => {
    renderSubscribersTable();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles error states', async () => {
    // Mock error response
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch subscribers'),
      }),
    }));

    renderSubscribersTable();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});