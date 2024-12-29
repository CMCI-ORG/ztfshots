import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FooterSettingsForm } from '@/components/admin/settings/footer/FooterSettingsForm';
import { renderWithProviders } from '@/test/utils/testUtils';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        error: null,
        data: [{ id: '1' }]
      }))
    }))
  }
}));

describe('FooterSettings Integration', () => {
  const mockDefaultValues = {
    column_1_description: 'Test description',
    column_1_playstore_link: 'https://play.google.com/store',
    column_2_title: 'Useful Links',
    column_2_links: [],
    column_3_title: 'Quick Links',
    column_3_links: [],
    column_4_title: 'Connect With Us',
    column_4_contact_email: 'test@example.com',
    column_4_contact_phone: '1234567890',
    column_4_social_links: []
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form with default values', () => {
    renderWithProviders(
      <FooterSettingsForm 
        defaultValues={mockDefaultValues}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://play.google.com/store')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Useful Links')).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    renderWithProviders(
      <FooterSettingsForm 
        defaultValues={mockDefaultValues}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        column_1_description: 'Test description'
      }));
    });
  });

  test('validates required fields', async () => {
    renderWithProviders(
      <FooterSettingsForm 
        defaultValues={{
          ...mockDefaultValues,
          column_2_title: ''
        }}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });
});