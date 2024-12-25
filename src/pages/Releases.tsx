import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-[#F2FCE2] text-green-700 border-green-200";
    case "in_progress":
      return "bg-[#FEF7CD] text-yellow-700 border-yellow-200";
    case "planned":
      return "bg-[#D3E4FD] text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-[#FFDEE2] text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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
                        <Badge className={getStatusColor(release.status)}>
                          {release.status}
                        </Badge>
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

          {/* Right Column */}
          <div className="lg:border-l lg:pl-8">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Release Status Guide</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor("completed")}>completed</Badge>
                  <span className="text-sm text-muted-foreground">Released and available</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor("in_progress")}>in progress</Badge>
                  <span className="text-sm text-muted-foreground">Currently being worked on</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor("planned")}>planned</Badge>
                  <span className="text-sm text-muted-foreground">Scheduled for future release</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor("cancelled")}>cancelled</Badge>
                  <span className="text-sm text-muted-foreground">No longer planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Releases;