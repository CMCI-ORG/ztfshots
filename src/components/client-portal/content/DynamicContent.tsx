import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DynamicContentProps {
  pageKey: string;
}

export const DynamicContent = ({ pageKey }: DynamicContentProps) => {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ["page-content", pageKey],
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load page content</AlertDescription>
      </Alert>
    );
  }

  if (!content) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Page not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
};