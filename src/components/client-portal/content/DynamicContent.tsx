import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DynamicContentProps {
  pageKey: string;
}

export const DynamicContent = ({ pageKey }: DynamicContentProps) => {
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages_content')
        .select('*')
        .eq('page_key', pageKey)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (page?.meta_description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', page.meta_description);
    }
  }, [page?.meta_description]);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>;
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ 
        __html: page.rich_text_content?.content?.[0]?.content?.[0]?.text || page.content 
      }} />
    </div>
  );
};