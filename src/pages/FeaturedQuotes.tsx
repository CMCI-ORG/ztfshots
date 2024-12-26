import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["featured-quotes"],
    queryFn: async () => {
      // First get quotes with high engagement
      const { data: quoteIds, error: countError } = await supabase
        .from('quotes')
        .select(`
          id,
          (
            select count(*) 
            from quote_likes 
            where quote_id = quotes.id
          ) as like_count,
          (
            select count(*) 
            from quote_stars 
            where quote_id = quotes.id
          ) as star_count,
          (
            select count(*) 
            from quote_shares 
            where quote_id = quotes.id
          ) as share_count
        `)
        .eq('status', 'live')
        .order('created_at', { ascending: false });

      if (countError) throw countError;

      // Calculate engagement score and get top quotes
      const topQuoteIds = quoteIds
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