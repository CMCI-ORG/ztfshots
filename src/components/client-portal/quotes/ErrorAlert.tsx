import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
  error: Error;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load quotes. Please try again later.
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
        )}
      </AlertDescription>
    </Alert>
  );
};