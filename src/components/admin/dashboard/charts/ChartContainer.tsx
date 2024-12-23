import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
}

export const ChartContainer = ({ children, isLoading, isError }: ChartContainerProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load chart data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return children;
};