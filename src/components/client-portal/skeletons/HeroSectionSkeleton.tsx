import { Skeleton } from "@/components/ui/skeleton";

export const HeroSectionSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#EDF4FF] to-white border-b">
      <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton className="h-10 w-64 mx-auto" />
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <Skeleton className="h-24 w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 px-4 sm:px-0">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};