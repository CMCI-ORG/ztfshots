import { MainLayout } from "@/components/layout/MainLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RecentQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .eq('status', 'live')
        .order('post_date', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Recent Quotes
          </h1>
          <p className="text-lg text-gray-600 font-['Roboto']">
            Stay updated with our latest additions of inspiring quotes.
          </p>
        </div>
        <QuotesGrid quotes={quotes} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default RecentQuotes;