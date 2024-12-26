import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { evaluatePerformance, evaluateErrorRate, evaluateTestCoverage } from "@/utils/releaseEvaluation";
import { useToast } from "@/hooks/use-toast";

interface EvaluationResult {
  category: string;
  status: 'pass' | 'warn' | 'fail';
  details: string;
}

export const ReleaseEvaluation = () => {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runEvaluation = async () => {
    setIsLoading(true);
    try {
      const [performance, errorRate, testCoverage] = await Promise.all([
        evaluatePerformance(),
        evaluateErrorRate(),
        evaluateTestCoverage()
      ]);
      setResults([performance, errorRate, testCoverage]);
    } catch (error) {
      console.error('Evaluation failed:', error);
      toast({
        title: "Evaluation Failed",
        description: "Could not complete release evaluation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Release Evaluation</span>
          <Button 
            onClick={runEvaluation}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Evaluation
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 && !isLoading ? (
          <Alert>
            <AlertDescription>
              Click "Run Evaluation" to check if the app is ready for release
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-medium">{result.category}</h3>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};