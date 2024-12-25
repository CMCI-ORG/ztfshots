import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DynamicPage = () => {
  const { pageKey } = useParams();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["page", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages_content")
        .select("*")
        .eq("page_key", pageKey)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <ContentLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </ContentLayout>
    );
  }

  if (error || !page) {
    return (
      <ContentLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? "Error loading page content." : "Page not found."}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="prose dark:prose-invert max-w-none">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </ContentLayout>
  );
};

export default DynamicPage;