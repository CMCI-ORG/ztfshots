import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { QuoteFormValues } from "../types";
import { formatPostDate, getQuoteStatus } from "@/utils/dateUtils";

export const useQuoteSubmit = (mode: 'add' | 'edit', quoteId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuote = async (values: QuoteFormValues) => {
    try {
      const status = getQuoteStatus(values.post_date);
      const formattedDate = formatPostDate(values.post_date);
      
      const quoteData = {
        text: values.text,
        author_id: values.author_id,
        category_id: values.category_id,
        source_title: values.source_title || null,
        source_url: values.source_url || null,
        post_date: formattedDate,
        status,
      };

      if (mode === 'add') {
        const { error } = await supabase.from("quotes").insert(quoteData);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Quote has been added successfully.",
        });
      } else {
        const { error } = await supabase
          .from("quotes")
          .update(quoteData)
          .eq('id', quoteId);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Quote has been updated successfully.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      return true;
    } catch (error) {
      console.error("Error managing quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to manage quote. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submitQuote };
};