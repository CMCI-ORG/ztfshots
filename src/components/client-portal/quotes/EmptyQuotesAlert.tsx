import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmptyQuotesAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No quotes found. Try adjusting your filters or check back later.
      </AlertDescription>
    </Alert>
  );
};