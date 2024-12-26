import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, AlertOctagon, CheckSquare, XSquare, Download, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetchErrorLogs = async () => {
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="h-4 w-4 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'medium':
      return <XSquare className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <CheckSquare className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ErrorMonitoring = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: errors, isLoading, isError } = useQuery({
    queryKey: ['error-logs'],
    queryFn: fetchErrorLogs,
  });

  const filteredErrors = errors?.filter(error => {
    if (severityFilter !== 'all' && error.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && error.is_resolved !== (statusFilter === 'resolved')) return false;
    return true;
  });

  const handleExport = () => {
    if (!filteredErrors) return;
    
    const csv = [
      ['Timestamp', 'Message', 'Severity', 'Status', 'URL', 'Browser Info'].join(','),
      ...filteredErrors.map(error => [
        error.created_at,
        `"${error.error_message.replace(/"/g, '""')}"`,
        error.severity,
        error.is_resolved ? 'Resolved' : 'Open',
        error.url || '',
        `"${JSON.stringify(error.browser_info).replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load error logs. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Error Monitoring</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading error logs...
                </TableCell>
              </TableRow>
            ) : filteredErrors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No error logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredErrors?.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(error.severity)}
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {error.error_message}
                  </TableCell>
                  <TableCell className="text-sm">
                    {error.url || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(error.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={error.is_resolved ? "success" : "secondary"}>
                      {error.is_resolved ? "Resolved" : "Open"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};