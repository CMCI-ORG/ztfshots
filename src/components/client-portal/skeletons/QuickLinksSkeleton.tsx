import { Skeleton } from "@/components/ui/skeleton";

export const QuickLinksSkeleton = () => {
  return (
    <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-24 sm:h-32 bg-white/80 backdrop-blur-sm rounded-md"
          />
        ))}
      </div>
    </div>
  );
};