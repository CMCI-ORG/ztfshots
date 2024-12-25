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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map(column => {
        const columnContents = contents
          .filter(content => content.column_id === column.id)
          .sort((a, b) => a.order_position - b.order_position);

        return (
          <div key={column.id} className="space-y-4">
            <h3 className="font-medium">Column {column.position}</h3>
            {columnContents.map((content, index) => {
              const contentType = contentTypes.find(type => type.id === content.content_type_id);
              
              return (
                <Card key={content.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{content.title || contentType?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Type: {contentType?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Column: {column.position}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMove(content, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMove(content, 'down')}
                          disabled={index === columnContents.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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