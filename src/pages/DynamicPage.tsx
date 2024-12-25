import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentLayout } from "@/components/client-portal/content/ContentLayout";
import { RouteLoadingIndicator } from "@/components/routes/RouteLoadingIndicator";

const DynamicPage = () => {
  const { pageKey } = useParams();
  
  // List of reserved paths that should not be handled by DynamicPage
  const reservedPaths = ['quotes', 'quote'];
  
  // Check if the current path is reserved
  if (pageKey && reservedPaths.some(path => pageKey.startsWith(path))) {
    return <Navigate to="/404" replace />;
  }

  const { data: pageContent, isLoading, error } = useQuery({
    queryKey: ["page-content", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages_content")
        .select("*")
        .eq("page_key", pageKey)
        .maybeSingle();

      if (error) {
        console.error("Error fetching page content:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <RouteLoadingIndicator />;
  }

  // If no content is found or there's an error, redirect to 404
  if (!pageContent || error) {
    console.error("Page not found or error:", error);
    return <Navigate to="/404" replace />;
  }

  return <ContentLayout content={pageContent} />;
};

export default DynamicPage;