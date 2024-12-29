import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { FooterContent, FooterColumn, FooterContentType } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FooterColumn as FooterColumnComponent } from "./content/FooterColumn";

interface FooterContentListProps {
  contents: FooterContent[];
  columns: FooterColumn[];
  contentTypes: FooterContentType[];
  onEdit: (content: FooterContent) => void;
  isLoading?: boolean;
}

export function FooterContentList({ 
  contents, 
  columns, 
  contentTypes, 
  onEdit,
  isLoading 
}: FooterContentListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMove = async (content: FooterContent, direction: 'up' | 'down') => {
    try {
      if (!Array.isArray(contents)) {
        throw new Error("Contents data is not in the expected format");
      }

      const columnContents = contents
        .filter(c => c.column_id === content.column_id)
        .sort((a, b) => a.order_position - b.order_position);
      
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

      queryClient.invalidateQueries({ queryKey: ['footerContents'] });
      
      toast({
        title: "Success",
        description: "Content order updated successfully",
      });
    } catch (error) {
      console.error('Error reordering content:', error);
      toast({
        title: "Error",
        description: "Failed to reorder content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_contents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['footerContents'] });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((column) => (
          <div key={column} className="space-y-4">
            <Skeleton className="h-6 w-24" />
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(contents) || !Array.isArray(columns) || !Array.isArray(contentTypes)) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          There was an error loading the footer content. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <FooterColumnComponent
            key={column.id}
            column={column}
            contents={contents}
            contentTypes={contentTypes}
            onMove={handleMove}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}