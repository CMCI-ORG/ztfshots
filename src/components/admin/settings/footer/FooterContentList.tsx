import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FooterContent, FooterColumn, FooterContentType } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Trash, Pencil } from "lucide-react";

interface FooterContentListProps {
  contents: FooterContent[];
  columns: FooterColumn[];
  contentTypes: FooterContentType[];
  onEdit: (content: FooterContent) => void;
}

export function FooterContentList({ contents, columns, contentTypes, onEdit }: FooterContentListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMove = async (content: FooterContent, direction: 'up' | 'down') => {
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

    try {
      const { error } = await supabase
        .from('footer_contents')
        .upsert(updates);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['footerContents'] });
    } catch (error) {
      console.error('Error reordering content:', error);
      toast({
        title: "Error",
        description: "Failed to reorder content",
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
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => {
        const columnContents = contents
          .filter(content => content.column_id === column.id)
          .sort((a, b) => a.order_position - b.order_position);

        return (
          <div key={column.id} className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Column {column.position}</h3>
            {columnContents.map((content, index) => {
              const contentType = contentTypes.find(type => type.id === content.content_type_id);
              
              return (
                <Card key={content.id} className="shadow-sm">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium truncate">
                          {content.title || contentType?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {contentType?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMove(content, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMove(content, 'down')}
                          disabled={index === columnContents.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}