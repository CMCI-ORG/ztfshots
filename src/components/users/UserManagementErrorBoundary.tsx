import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserManagementErrorBoundary() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>An error occurred in the user management system</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}