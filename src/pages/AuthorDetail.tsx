import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorDetail = () => {
  const { id } = useParams();

  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (authorLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!author) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Author not found</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={author.image_url} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
              <p className="text-gray-600">{author.bio}</p>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-semibold mb-6">Quotes by {author.name}</h2>
        <QuotesGrid authorId={author.id} />
      </div>
    </MainLayout>
  );
};

export default AuthorDetail;