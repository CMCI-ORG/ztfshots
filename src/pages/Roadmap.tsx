import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Roadmap = () => {
  const { data: roadmapItems, isLoading } = useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_items")
        .select("*")
        .order("year", { ascending: true })
        .order("quarter", { ascending: true })
        .order("priority", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const groupedItems = roadmapItems?.reduce((acc, item) => {
    const key = `${item.year}-${item.quarter}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof roadmapItems>);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Product Roadmap</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedItems || {}).map(([timeframe, items]) => {
                const [year, quarter] = timeframe.split("-");
                return (
                  <div key={timeframe}>
                    <h2 className="text-2xl font-bold mb-6">
                      {quarter} {year}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items?.map((item) => (
                        <Card key={item.id} className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <Badge>{item.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Roadmap;