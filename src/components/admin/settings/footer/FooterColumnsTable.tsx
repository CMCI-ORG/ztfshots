import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useFooterColumns } from "./hooks/useFooterColumns";
import { useFooterContentTypes } from "./hooks/useFooterContentTypes";
import { useColumnManagement } from "./hooks/useColumnManagement";
import { useContentManagement } from "./hooks/useContentManagement";
import { DeleteConfirmationDialog } from "./dialogs/DeleteConfirmationDialog";
import { ColumnHeader } from "./content/ColumnHeader";
import { ContentTypeDisplay } from "./content/ContentTypeDisplay";
import { ContentActions } from "./content/ContentActions";
import { FooterContent } from "./types";

export function FooterColumnsTable() {
  const { toast } = useToast();
  const { columns, isLoading, error } = useFooterColumns();
  const { contentTypes } = useFooterContentTypes();
  const { handleAddColumn, handleDeleteColumn } = useColumnManagement();
  const { handleMoveContent, handleDeleteContent, handleToggleActive } = useContentManagement();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    type: 'column' | 'content';
    id: string | null;
  }>({
    isOpen: false,
    type: 'content',
    id: null
  });

  const handleEdit = (content: FooterContent) => {
    console.log('Edit content:', content);
  };

  const confirmDelete = (type: 'column' | 'content', id: string) => {
    setDeleteDialogState({
      isOpen: true,
      type,
      id
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!deleteDialogState.id) return;

      if (deleteDialogState.type === 'column') {
        await handleDeleteColumn(deleteDialogState.id);
      } else {
        await handleDeleteContent(deleteDialogState.id);
      }

      toast({
        title: "Success",
        description: `${deleteDialogState.type === 'column' ? 'Column' : 'Content'} deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${deleteDialogState.type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogState({ isOpen: false, type: 'content', id: null });
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full animate-pulse bg-muted rounded" />
              ))}
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
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete('column', column.id)}
                        className="ml-2"
                      >
                        Delete Column
                      </Button>
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
                                onDelete={() => confirmDelete('content', content.id)}
                                onToggleActive={() => handleToggleActive(content)}
                                isFirst={index === 0}
                                isLast={index === column.contents.length - 1}
                                isActive={content.is_active}
                              />
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

      <DeleteConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, type: 'content', id: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteDialogState.type === 'column' ? 'Column' : 'Content'}`}
        description={`This will permanently delete this ${deleteDialogState.type} and all its contents. This action cannot be undone.`}
      />
    </ErrorBoundary>
  );
}