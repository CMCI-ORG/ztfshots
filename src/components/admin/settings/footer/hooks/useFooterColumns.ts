import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterColumn, FooterContent, FooterContentType } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useFooterColumns() {
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to load footer data. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
  });

  return {
    columns,
    isLoading,
    error
  };
}