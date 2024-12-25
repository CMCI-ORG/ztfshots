import { MainLayout } from "@/components/layout/MainLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 12;

const FeaturedQuotes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: quotes, isLoading, refetch } = useQuery({
    queryKey: ["featured-quotes", currentPage],
    queryFn: async () => {
      // First, get all quote stars from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: starCounts, error: starsError } = await supabase
        .from("quote_stars")
        .select("quote_id, created_at")
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (starsError) throw starsError;

      // Count stars for each quote
      const quotesWithStarCount = starCounts.reduce((acc, curr) => {
        acc[curr.quote_id] = (acc[curr.quote_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sort quotes by star count and get paginated quote IDs
      const topQuoteIds = Object.entries(quotesWithStarCount)
        .sort(([, a], [, b]) => b - a)
        .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        .map(([quoteId]) => quoteId);

      if (topQuoteIds.length === 0) {
        return { data: [], count: 0 };
      }

      // Fetch the actual quotes with their related data
      const { data, error, count } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name),
          sources:source_id(title)
        `, { count: 'exact' })
        .in('id', topQuoteIds)
        .eq('status', 'live');

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    },
  });

  // Subscribe to real-time updates for quotes and stars
  useEffect(() => {
    const channel = supabase
      .channel('featured-quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_stars'
        },
        () => {
          refetch();
          toast({
            title: "Featured quotes updated",
            description: "The list has been refreshed with the latest changes.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Featured Quotes
          </h1>
          <p className="text-lg text-gray-600 font-['Roboto']">
            Explore our most popular and inspiring quotes from the last 30 days.
          </p>
        </div>
        <QuotesGrid 
          quotes={quotes?.data} 
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={quotes?.count || 0}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </MainLayout>
  );
};

export default FeaturedQuotes;