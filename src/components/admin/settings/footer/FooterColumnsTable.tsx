import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ColumnHeader } from "./content/ColumnHeader";
import { ContentTypeDisplay } from "./content/ContentTypeDisplay";
import { ContentActions } from "./content/ContentActions";

export function FooterColumnsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: columns, isLoading, error } = useQuery({
    queryKey: ['footerColumns'],
    queryFn: async () => {
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
      // First, delete all content associated with this column
      const { error: contentDeleteError } = await supabase
        .from('footer_contents')
        .delete()
        .eq('column_id', id);

      if (contentDeleteError) throw contentDeleteError;

      // Then delete the column
      const { error: columnDeleteError } = await supabase
        .from('footer_columns')
        .delete()
        .eq('id', id);

      if (columnDeleteError) throw columnDeleteError;

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

  const handleDeleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('footer_contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerColumns'] });
      
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const handleMoveContent = async (content: any, direction: 'up' | 'down') => {
    try {
      const columnContents = columns
        ?.find(col => col.id === content.column_id)
        ?.contents.sort((a, b) => a.order_position - b.order_position);

      if (!columnContents) return;

      const currentIndex = columnContents.findIndex(c => c.id === content.id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= columnContents.length) return;

      const updates = [
        { id: content.id, order_position: columnContents[newIndex].order_position },
        { id: columnContents[newIndex].id, order_position: content.order_position }
      ];

      const { error } = await supabase
        .from('footer_contents')
        .upsert(updates);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerColumns'] });
      
      toast({
        title: "Success",
        description: "Content order updated successfully",
      });
    } catch (error) {
      console.error('Error reordering content:', error);
      toast({
        title: "Error",
        description: "Failed to reorder content",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (content: any) => {
    try {
      const { error } = await supabase
        .from('footer_contents')
        .update({ is_active: !content.is_active })
        .eq('id', content.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerColumns'] });
      
      toast({
        title: "Success",
        description: `Content ${content.is_active ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling content status:', error);
      toast({
        title: "Error",
        description: "Failed to update content status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (content: any) => {
    // This will be implemented by the parent component
    console.log('Edit content:', content);
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
                  <ColumnHeader 
                    position={column.position} 
                    contentCount={column.contents?.length || 0}
                  />
                  
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
                          <ContentActions
                            onMoveUp={() => handleMoveContent(content, 'up')}
                            onMoveDown={() => handleMoveContent(content, 'down')}
                            onEdit={() => handleEdit(content)}
                            onDelete={() => handleDeleteContent(content.id)}
                            onToggleActive={() => handleToggleActive(content)}
                            isFirst={index === 0}
                            isLast={index === column.contents.length - 1}
                            isActive={content.is_active}
                          />
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