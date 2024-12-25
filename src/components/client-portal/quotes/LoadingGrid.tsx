import { Skeleton } from "@/components/ui/skeleton";

interface LoadingGridProps {
  itemsPerPage: number;
}

export const LoadingGrid = ({ itemsPerPage }: LoadingGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {[...Array(itemsPerPage)].map((_, i) => (
        <Skeleton key={i} className="h-[400px] w-full" />
      ))}
    </div>
  );
};