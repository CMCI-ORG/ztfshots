import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 1, // Only retry failed requests once
    },
  },
});

// Prefetch configurations for common queries
export const prefetchQueries = async () => {
  // Prefetch site settings
  await queryClient.prefetchQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('*').single();
      return data;
    },
  });

  // Prefetch footer settings
  await queryClient.prefetchQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data } = await supabase.from('footer_settings').select('*').single();
      return data;
    },
  });
};