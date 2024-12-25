import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Releases = () => {
  const { data: releases, isLoading } = useQuery({
    queryKey: ["releases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*")
        .order("release_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Release Notes</h1>
          
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {releases?.map((release) => (
                <div key={release.id} className="relative pl-8 pb-8 border-l-2 border-[#8B5CF6]">
                  <div className="absolute -left-2 top-0">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6]" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold">{release.title}</h2>
                      <Badge variant="outline">v{release.version}</Badge>
                      <Badge>{release.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(release.release_date), "MMMM d, yyyy")}
                    </p>
                    <div className="prose prose-sm max-w-none">
                      {release.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Releases;