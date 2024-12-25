import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DynamicContentProps {
  pageKey: string;
}

interface RichTextNode {
  type: string;
  text?: string;
  content?: RichTextNode[];
}

interface RichTextContent {
  type: string;
  content?: RichTextNode[];
}

export const DynamicContent = ({ pageKey }: DynamicContentProps) => {
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages_content')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle();

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
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching page content:', error);
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Error Loading Page</h1>
        <p className="text-gray-600">There was an error loading this page. Please try again later.</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist or hasn't been created yet.</p>
      </div>
    );
  }

  const renderContent = () => {
    if (page.rich_text_content && typeof page.rich_text_content === 'object') {
      // First cast to unknown, then to RichTextContent to satisfy TypeScript
      const richContent = (page.rich_text_content as unknown) as RichTextContent;
      
      if (richContent.type === 'doc' && Array.isArray(richContent.content)) {
        return richContent.content.map((node, index) => {
          if (node.type === 'paragraph' && Array.isArray(node.content)) {
            return <p key={index} className="mb-4">{node.content.map(n => n.text).join('')}</p>;
          }
          return null;
        });
      }
    }
    
    // Fallback to regular content if rich text is not available
    return <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />;
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{page.title}</h1>
      {renderContent()}
    </div>
  );
};