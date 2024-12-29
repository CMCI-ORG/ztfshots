/**
 * FooterColumnsTable component provides a management interface for footer columns.
 * It allows adding and removing columns, displaying them in a table format.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash, List, ArrowDown, ArrowUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function FooterColumnsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch footer columns data and their contents
  const { data: columns, isLoading, error } = useQuery({
    queryKey: ['footerColumns'],
    queryFn: async () => {
      const { data: columnsData, error: columnsError } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');
      
      if (columnsError) throw columnsError;

      // Fetch contents for each column
      const { data: contentsData, error: contentsError } = await supabase
        .from('footer_contents')
        .select(`
          *,
          content_type:footer_content_types(name)
        `)
        .order('order_position');

      if (contentsError) throw contentsError;

      // Combine columns with their contents
      return columnsData.map(column => ({
        ...column,
        contents: contentsData.filter(content => content.column_id === column.id)
      }));
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
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Footer Columns Structure
        </CardTitle>
        <CardDescription>
          Manage the columns and content structure in your footer layout
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
          <div className="space-y-6">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {columns?.map((column) => (
                <div key={column.id} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Column {column.position}
                      <Badge variant="secondary">
                        {column.contents?.length || 0} items
                      </Badge>
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteColumn(column.id)}
                      title="Delete column"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {column.contents?.length > 0 ? (
                    <div className="space-y-2 ml-4">
                      {column.contents.map((content, index) => (
                        <div
                          key={content.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div>
                            <span className="font-medium">
                              {content.title || content.content_type.name}
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {content.content_type.name}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={index === column.contents.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground ml-4">
                      No content items in this column
                    </p>
                  )}
                  
                  <Separator className="my-4" />
                </div>
              ))}
            </ScrollArea>

            <div className="flex justify-end">
              <Button onClick={handleAddColumn}>
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}