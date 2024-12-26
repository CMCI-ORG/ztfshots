import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { ContentLayout } from "@/components/client-portal/content/ContentLayout";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ContentLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </ContentLayout>
    );
  }

  if (!category) {
    return (
      <ContentLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Category not found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>

        <QuotesGrid 
          filters={{
            search: "",
            authorId: "",
            categoryId: id,
            sourceId: "",
            timeRange: "lifetime"
          }}
          columnCount="two"
        />
      </div>
    </ContentLayout>
  );
};

export default CategoryDetail;