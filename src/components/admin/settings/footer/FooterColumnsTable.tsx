import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FooterColumnsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: columns, isLoading, error } = useQuery({
    queryKey: ['footerColumns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddColumn = async () => {
    try {
      const nextPosition = columns?.length ? Math.max(...columns.map(c => c.position)) + 1 : 1;
      
      const { error } = await supabase
        .from('footer_columns')
        .insert({ position: nextPosition });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerColumns'] });
      
      toast({
        title: "Success",
        description: "Footer column added successfully",
      });
    } catch (error) {
      console.error('Error adding footer column:', error);
      toast({
        title: "Error",
        description: "Failed to add footer column",
        variant: "destructive",
      });
    }
  };

  const handleDeleteColumn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_columns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerColumns'] });
      
      toast({
        title: "Success",
        description: "Footer column deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting footer column:', error);
      toast({
        title: "Error",
        description: "Failed to delete footer column",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load footer columns. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Columns</CardTitle>
        <CardDescription>
          Manage the columns in your footer layout
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns?.map((column) => (
                  <TableRow key={column.id}>
                    <TableCell>Column {column.position}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteColumn(column.id)}
                        title="Delete column"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button onClick={handleAddColumn}>
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}