import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterContentType } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useFooterContentTypes() {
  const { toast } = useToast();

  const { data: contentTypes, isLoading, error } = useQuery({
    queryKey: ['footerContentTypes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('footer_content_types')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return data as FooterContentType[];
      } catch (err) {
        console.error('Error fetching content types:', err);
        toast({
          title: "Error",
          description: "Failed to load content types. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
  });

  return {
    contentTypes,
    isLoading,
    error
  };
}