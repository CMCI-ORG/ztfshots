import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingMetrics = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-12 w-16" />
        </Card>
      ))}
    </>
  );
};