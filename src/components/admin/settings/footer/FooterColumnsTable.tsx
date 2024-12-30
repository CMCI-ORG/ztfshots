import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ColumnHeader } from "./content/ColumnHeader";
import { ContentTypeDisplay } from "./content/ContentTypeDisplay";
import { ContentActions } from "./content/ContentActions";
import { useColumnManagement } from "./hooks/useColumnManagement";
import { useContentManagement } from "./hooks/useContentManagement";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "@/hooks/use-toast";

export function FooterColumnsTable() {
  const { handleAddColumn, handleDeleteColumn } = useColumnManagement();
  const { handleMoveContent, handleDeleteContent, handleToggleActive } = useContentManagement();

  const { data: columns, isLoading, error } = useQuery({
    queryKey: ['footerColumns'],
    queryFn: async () => {
      try {
        const { data: columnsData, error: columnsError } = await supabase
          .from('footer_columns')
          .select('*')
          .order('position');
        
        if (columnsError) throw columnsError;

        const { data: contentsData, error: contentsError } = await supabase
          .from('footer_contents')
          .select(`
            *,
            content_type:footer_content_types(*)
          `)
          .order('order_position');

        if (contentsError) throw contentsError;

        return columnsData.map(column => ({
          ...column,
          contents: contentsData.filter(content => content.column_id === column.id)
        }));
      } catch (err) {
        console.error('Error fetching footer data:', err);
        throw err;
      }
    },
  });

  const handleEdit = (content: any) => {
    console.log('Edit content:', content);
  };

  const handleContentDelete = async (contentId: string) => {
    try {
      await handleDeleteContent(contentId);
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleColumnDelete = async (columnId: string) => {
    try {
      await handleDeleteColumn(columnId);
      toast({
        title: "Success",
        description: "Column deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting column:', error);
      toast({
        title: "Error",
        description: "Failed to delete column. Please try again.",
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
    <ErrorBoundary>
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
                    <div className="flex items-center justify-between">
                      <ColumnHeader 
                        position={column.position} 
                        contentCount={column.contents?.length || 0}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                          >
                            Delete Column
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Column</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this column and all its contents.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleColumnDelete(column.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    {column.contents?.length > 0 ? (
                      <div className="space-y-2 ml-4">
                        {column.contents.map((content: any, index: number) => (
                          <div
                            key={content.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <ContentTypeDisplay 
                              content={content}
                              contentType={content.content_type}
                            />
                            <div className="flex items-center gap-2">
                              <ContentActions
                                onMoveUp={() => handleMoveContent(content, 'up')}
                                onMoveDown={() => handleMoveContent(content, 'down')}
                                onEdit={() => handleEdit(content)}
                                onDelete={() => handleContentDelete(content.id)}
                                onToggleActive={() => handleToggleActive(content)}
                                isFirst={index === 0}
                                isLast={index === column.contents.length - 1}
                                isActive={content.is_active}
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Content</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this content item.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleContentDelete(content.id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
    </ErrorBoundary>
  );
}