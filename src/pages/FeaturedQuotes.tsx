import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteEngagementCounts } from "@/components/quotes/types/engagement";

const FeaturedQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["featured-quotes"],
    queryFn: async () => {
      // First get quotes with high engagement
      const { data: quoteIds, error: countError } = await supabase
        .from('quotes')
        .select(`
          id,
          like_count:quote_likes(count),
          star_count:quote_stars(count),
          share_count:quote_shares(count)
        `)
        .eq('status', 'live');

      if (countError) throw countError;

      // Calculate engagement score and get top quotes
      const topQuoteIds = (quoteIds as QuoteEngagementCounts[])
        ?.map(q => ({
          id: q.id,
          score: (q.like_count || 0) + (q.star_count || 0) * 2 + (q.share_count || 0) * 3
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map(q => q.id);

      if (!topQuoteIds?.length) return [];

      // Get full quote data for top engaged quotes
      const { data: featuredQuotes, error } = await supabase
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
      return featuredQuotes;
    },
  });

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Featured Quotes</h1>
          <p className="text-muted-foreground mt-2">
            Explore our most impactful and engaging quotes
          </p>
        </div>
        <QuotesGrid quotes={quotes} isLoading={isLoading} columnCount="two" />
      </div>
    </ContentLayout>
  );
};

export default FeaturedQuotes;