import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [quotesCount, authorsCount, categoriesCount, subscribersCount] = await Promise.all([
        supabase.from("quotes").select("id", { count: "exact" }),
        supabase.from("authors").select("id", { count: "exact" }),
        supabase.from("categories").select("id", { count: "exact" }),
        supabase.from("subscribers").select("id", { count: "exact" }),
      ]);

      return {
        quotes: quotesCount.count || 0,
        authors: authorsCount.count || 0,
        categories: categoriesCount.count || 0,
        subscribers: subscribersCount.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-8 w-16" />
              </div>
              <p className="text-xs text-muted-foreground">
                <Skeleton className="h-3 w-32" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { title: "Total Quotes", value: metrics?.quotes || 0, label: "Active quotes in the system" },
    { title: "Authors", value: metrics?.authors || 0, label: "Contributing authors" },
    { title: "Categories", value: metrics?.categories || 0, label: "Quote categories" },
    { title: "Subscribers", value: metrics?.subscribers || 0, label: "Newsletter subscribers" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};