import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export function UserManagementErrorBoundary({ error, resetErrorBoundary }: Props) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error.message || "An error occurred in the user management system"}</p>
        <Button 
          variant="outline" 
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}