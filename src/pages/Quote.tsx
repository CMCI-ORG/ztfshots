import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";

const Quote = () => {
  const { id } = useParams();

  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </MainLayout>
    );
  }

  if (!quote) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Quote not found</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <QuoteCard
          id={quote.id}
          quote={quote.text}
          author={quote.authors?.name || "Unknown"}
          category={quote.categories?.name || "Uncategorized"}
          date={format(new Date(quote.created_at), "MMMM d, yyyy")}
          sourceTitle={quote.source_title}
          sourceUrl={quote.source_url}
          hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
        />
      </div>
    </MainLayout>
  );
};

export default Quote;