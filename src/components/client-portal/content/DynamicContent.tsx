import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DynamicContentProps {
  pageKey: string;
}

interface RichTextContent {
  type: string;
  content?: Array<{
    type: string;
    content?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
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

  const renderContent = () => {
    if (page.rich_text_content && typeof page.rich_text_content === 'object') {
      // First cast to unknown, then to our specific type to satisfy TypeScript
      const richContent = (page.rich_text_content as unknown) as RichTextContent;
      if (richContent.type === 'doc' && richContent.content?.[0]?.content?.[0]?.text) {
        return richContent.content[0].content[0].text;
      }
    }
    return page.content;
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: renderContent() }} />
    </div>
  );
};