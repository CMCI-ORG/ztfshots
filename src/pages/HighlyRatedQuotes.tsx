import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HighlyRatedQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["highly-rated-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id (name, image_url),
          categories:category_id (name),
          sources:source_id (title)
        `)
        .eq("status", "live")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Highly Rated Quotes</h1>
          <p className="text-muted-foreground mt-2">
            Discover our most impactful and highly rated quotes
          </p>
        </div>
        <QuotesGrid quotes={quotes} isLoading={isLoading} columnCount="two" />
      </div>
    </ContentLayout>
  );
};

export default HighlyRatedQuotes;