import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function WhatsappTemplatesErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <Alert variant="destructive" className="m-4">
          <AlertTitle>WhatsApp Templates Error</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>There was an error loading the WhatsApp templates. Please try again.</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Templates
            </Button>
          </AlertDescription>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
}