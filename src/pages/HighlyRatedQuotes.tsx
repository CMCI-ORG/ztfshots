import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteEngagementCounts } from "@/components/quotes/types/engagement";

const HighlyRatedQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["highly-rated-quotes"],
    queryFn: async () => {
      // Get quotes with their like counts
      const { data: quotesWithLikes, error: likesError } = await supabase
        .from('quotes')
        .select(`
          id,
          like_count:quote_likes(count)
        `)
        .eq('status', 'live');

      if (likesError) throw likesError;

      // Get top liked quote IDs
      const topQuoteIds = (quotesWithLikes as QuoteEngagementCounts[])
        ?.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
        .slice(0, 20)
        .map(q => q.id);

      if (!topQuoteIds?.length) return [];

      // Get full quote data for highly rated quotes
      const { data: highlyRatedQuotes, error } = await supabase
        .from('quotes')
        .select(`
          *,
          authors:author_id (name, image_url),
          categories:category_id (name),
          sources:source_id (title)
        `)
        .in('id', topQuoteIds)
        .eq('status', 'live')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return highlyRatedQuotes;
    },
  });

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Highly Rated Quotes</h1>
          <p className="text-muted-foreground mt-2">
            Discover our most liked and appreciated quotes
          </p>
        </div>
        <QuotesGrid quotes={quotes} isLoading={isLoading} columnCount="two" />
      </div>
    </ContentLayout>
  );
};

export default HighlyRatedQuotes;