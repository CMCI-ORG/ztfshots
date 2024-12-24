import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export function UserManagementErrorBoundary({ error }: Props) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || "An error occurred in the user management system"}
      </AlertDescription>
    </Alert>
  );
}