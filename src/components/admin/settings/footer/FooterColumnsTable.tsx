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

export function FooterColumnsTable() {
  const { handleAddColumn, handleDeleteColumn } = useColumnManagement();
  const { handleMoveContent, handleDeleteContent, handleToggleActive } = useContentManagement();

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

  const handleEdit = (content: any) => {
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