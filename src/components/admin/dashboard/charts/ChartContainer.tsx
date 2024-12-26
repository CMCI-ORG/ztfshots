import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
  title: string;
}

export const ChartContainer = ({ children, isLoading, isError, title }: ChartContainerProps) => {
  if (isLoading) {
    return (
      <div role="status" aria-label={`Loading ${title}`}>
        <Skeleton className="w-full h-[200px] sm:h-[300px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert 
        variant="destructive"
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load {title} data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div 
      className="w-full h-[200px] sm:h-[300px]"
      role="region"
      aria-label={title}
    >
      {children}
    </div>
  );
};