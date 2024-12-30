import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useColumnManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddColumn = async () => {
    try {
      const { data: columns } = await supabase
        .from('footer_columns')
        .select('position')
        .order('position');
      
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

  return {
    handleAddColumn,
    handleDeleteColumn,
  };
}