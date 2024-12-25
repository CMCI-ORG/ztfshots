import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
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

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 2:
      return "bg-[#FFDEE2] text-red-700 border-red-200";
    case 1:
      return "bg-[#FEF7CD] text-yellow-700 border-yellow-200";
    default:
      return "bg-[#D3E4FD] text-blue-700 border-blue-200";
  }
};

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold">{item.title}</h3>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(item.priority)}>
                                  {item.priority === 2 ? "High" : item.priority === 1 ? "Medium" : "Low"}
                                </Badge>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </div>
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

          {/* Right Column */}
          <div className="lg:border-l lg:pl-8">
            <div className="sticky top-8 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">Status Guide</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor("completed")}>completed</Badge>
                    <span className="text-sm text-muted-foreground">Feature is live</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor("in_progress")}>in progress</Badge>
                    <span className="text-sm text-muted-foreground">Currently in development</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor("planned")}>planned</Badge>
                    <span className="text-sm text-muted-foreground">Coming soon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor("cancelled")}>cancelled</Badge>
                    <span className="text-sm text-muted-foreground">Not moving forward</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6">Priority Levels</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(2)}>High</Badge>
                    <span className="text-sm text-muted-foreground">Critical feature</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(1)}>Medium</Badge>
                    <span className="text-sm text-muted-foreground">Important feature</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(0)}>Low</Badge>
                    <span className="text-sm text-muted-foreground">Nice to have</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Roadmap;