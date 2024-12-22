import { useRouteError } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

export function RouteErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-lg w-full">
        <AlertTitle className="text-lg font-semibold mb-2">
          Something went wrong
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-xs bg-secondary/50 p-2 rounded-md overflow-auto max-h-32">
              {error?.stack}
            </pre>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload page
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return home
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}