import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingMetrics = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card 
          key={i} 
          className="p-4"
          role="presentation"
          aria-label="Loading metric"
        >
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </Card>
      ))}
    </>
  );
};