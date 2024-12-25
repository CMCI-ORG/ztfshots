import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
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

  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["page-content", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages_content")
        .select("*")
        .eq("page_key", pageKey)
        .single();

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

  if (!pageContent) {
    return <Navigate to="/404" replace />;
  }

  return <ContentLayout content={pageContent} />;
};

export default DynamicPage;