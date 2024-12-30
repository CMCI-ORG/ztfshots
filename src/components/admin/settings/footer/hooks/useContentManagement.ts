import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FooterContent } from "../types";

export function useContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMoveContent = async (content: FooterContent, direction: 'up' | 'down') => {
    try {
      const { data: columnContents } = await supabase
        .from('footer_contents')
        .select('*')
        .eq('column_id', content.column_id)
        .order('order_position');

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

  const handleToggleActive = async (content: FooterContent) => {
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

  return {
    handleMoveContent,
    handleDeleteContent,
    handleToggleActive,
  };
}