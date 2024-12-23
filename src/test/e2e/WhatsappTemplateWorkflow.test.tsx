import { test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WhatsappTemplatesTable } from '@/components/whatsapp/WhatsappTemplatesTable';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import { createSupabaseMock } from '../mocks/supabaseMock';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: createSupabaseMock()
}));

// Sample template data
const sampleTemplate = {
  id: '1',
  name: 'Test Template',
  language: 'en',
  content: 'Test content',
  status: 'pending',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

test('WhatsApp template CRUD operations', async () => {
  // Render the component
  render(<WhatsappTemplatesTable />);

  // Wait for the templates to load
  await waitFor(() => {
    expect(screen.getByText('Test Template')).toBeInTheDocument();
  });

  // Test creating a new template
  fireEvent.click(screen.getByText('Add Template'));
  
  const nameInput = screen.getByPlaceholderText('Template name');
  fireEvent.change(nameInput, { target: { value: 'New Template' } });
  
  const contentInput = screen.getByPlaceholderText('Template content');
  fireEvent.change(contentInput, { target: { value: 'New content' } });
  
  fireEvent.click(screen.getByText('Save'));
  
  // Test editing a template
  const editButton = screen.getAllByRole('button')[1]; // Second button should be edit
  fireEvent.click(editButton);
  
  fireEvent.change(nameInput, { target: { value: 'Updated Template' } });
  fireEvent.click(screen.getByText('Save'));
  
  // Test deleting a template
  const deleteButton = screen.getAllByRole('button')[2]; // Third button should be delete
  fireEvent.click(deleteButton);
  
  // Verify the template was deleted
  await waitFor(() => {
    expect(screen.queryByText('Test Template')).not.toBeInTheDocument();
  });
});

test('WhatsApp template error handling', async () => {
  // Mock an error response
  const errorMock = createSupabaseMock();
  vi.spyOn(errorMock, 'from').mockImplementation(() => ({
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch templates'),
    }),
  }));

  vi.mocked(supabase.from).mockImplementation(errorMock.from);

  render(<WhatsappTemplatesTable />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load WhatsApp templates')).toBeInTheDocument();
  });
});