import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, ArrowLeft, Bug } from "lucide-react";
import { Link } from "react-router-dom";
import { logError } from "@/utils/errorTracking";
import { toast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  timestamp: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorCount: 0,
    timestamp: ''
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  private async logError(error: Error, errorInfo: ErrorInfo) {
    const timestamp = new Date().toISOString();
    
    try {
      await logError(error, {
        componentStack: errorInfo.componentStack,
        timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      this.setState(prevState => ({
        error,
        errorInfo,
        errorCount: prevState.errorCount + 1,
        timestamp
      }));
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
      toast({
        title: "Error Logging Failed",
        description: "Unable to record error details. Please try again later.",
        variant: "destructive",
      });
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.logError(error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.reload();
  };

  private handleBack = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.history.back();
  };

  private getErrorSeverity(count: number): string {
    if (count >= 3) return "Critical";
    if (count >= 2) return "High";
    return "Low";
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPersistentError = this.state.errorCount > 2;
      const errorTime = new Date(this.state.timestamp).toLocaleTimeString();
      const severity = this.getErrorSeverity(this.state.errorCount);

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert 
            variant="destructive" 
            className="max-w-lg w-full"
            role="alert"
            aria-live="assertive"
          >
            <AlertTitle className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Bug className="h-5 w-5" />
              {isPersistentError 
                ? "Persistent Error Detected" 
                : "Something went wrong"}
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                <div className="flex gap-2 text-xs">
                  <span>Severity: {severity}</span>
                  <span>•</span>
                  <span>Time: {errorTime}</span>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <div className="space-y-2">
                  <p className="text-xs font-medium">Debug Information:</p>
                  <pre className="text-xs bg-secondary/50 p-2 rounded-md overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                  {this.state.error?.stack && (
                    <pre className="text-xs bg-secondary/50 p-2 rounded-md overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  aria-label="Reload page"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleBack}
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go back
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="/" aria-label="Return to home page">
                    <Home className="mr-2 h-4 w-4" />
                    Return home
                  </Link>
                </Button>
              </div>

              {isPersistentError && (
                <div className="mt-4 p-3 bg-secondary/20 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    This error has occurred multiple times. Please try:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Clearing your browser cache</li>
                      <li>Using a different browser</li>
                      <li>Contacting support if the problem persists</li>
                    </ul>
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}