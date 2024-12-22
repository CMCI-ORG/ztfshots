import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { render } from '@testing-library/react';

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

export const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};