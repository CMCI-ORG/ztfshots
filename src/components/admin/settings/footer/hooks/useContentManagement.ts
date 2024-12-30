import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
    } catch (error) {
      console.error('Error reordering content:', error);
      throw error;
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
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
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
    } catch (error) {
      console.error('Error toggling content status:', error);
      throw error;
    }
  };

  return {
    handleMoveContent,
    handleDeleteContent,
    handleToggleActive,
  };
}