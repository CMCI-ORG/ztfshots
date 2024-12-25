import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: author, isLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
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
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!author) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Author not found</h1>
            <p className="text-muted-foreground">
              The author you're looking for doesn't exist or has been removed.
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={author.image_url} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{author.name}</h1>
              {author.bio && (
                <p className="text-muted-foreground mt-2">{author.bio}</p>
              )}
            </div>
          </div>
        </Card>

        <QuotesGrid 
          filters={{
            search: "",
            authorId: id,
            categoryId: "",
            sourceId: "",
            timeRange: "lifetime"
          }}
        />
      </div>
    </MainLayout>
  );
};

export default AuthorDetail;