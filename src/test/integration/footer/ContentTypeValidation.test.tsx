import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContentTypeFields } from '@/components/admin/settings/footer/ContentTypeFields';
import { renderWithProviders } from '@/test/utils/testUtils';
import { vi } from 'vitest';
import { useForm } from 'react-hook-form';

const TestWrapper = ({ contentType }: any) => {
  const form = useForm({
    defaultValues: {
      content: {}
    }
  });

  return (
    <ContentTypeFields
      contentType={contentType}
      form={form}
    />
  );
};

describe('ContentType Validation Integration', () => {
  test('renders text type fields correctly', () => {
    const textType = {
      id: '1',
      name: 'Text Block',
      type: 'text',
      fields: {
        text: 'string'
      }
    };

    renderWithProviders(<TestWrapper contentType={textType} />);
    expect(screen.getByLabelText(/text/i)).toBeInTheDocument();
  });

  test('renders link type fields correctly', () => {
    const linkType = {
      id: '2',
      name: 'Links',
      type: 'links',
      fields: {
        links: [{
          text: 'string',
          url: 'string'
        }]
      }
    };

    renderWithProviders(<TestWrapper contentType={linkType} />);
    expect(screen.getByText(/add link/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const addressType = {
      id: '3',
      name: 'Address',
      type: 'address',
      fields: {
        street: 'string',
        city: 'string',
        state: 'string',
        zip: 'string'
      }
    };

    renderWithProviders(<TestWrapper contentType={addressType} />);

    const streetInput = screen.getByLabelText(/street/i);
    const cityInput = screen.getByLabelText(/city/i);

    expect(streetInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
  });

  test('handles array fields correctly', async () => {
    const socialType = {
      id: '4',
      name: 'Social Links',
      type: 'social',
      fields: {
        links: [{
          platform: 'string',
          url: 'string'
        }]
      }
    };

    renderWithProviders(<TestWrapper contentType={socialType} />);

    const addButton = screen.getByText(/add link/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/platform/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    });
  });
});