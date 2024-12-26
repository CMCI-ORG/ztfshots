import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { QuoteFormValues } from "../types";
import { formatPostDate, getQuoteStatus } from "@/utils/dateUtils";
import { useAuth } from "@/providers/AuthProvider";
import { useSourceManagement } from "./useSourceManagement";

export const useQuoteSubmit = (mode: 'add' | 'edit', quoteId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { handleSource } = useSourceManagement();

  const submitQuote = async (values: QuoteFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to manage quotes.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const status = getQuoteStatus(values.post_date);
      const formattedDate = formatPostDate(values.post_date);
      const sourceId = await handleSource(values.source_title || '', values.source_url);

      const quoteData = {
        text: values.text,
        author_id: values.author_id,
        category_id: values.category_id,
        source_title: values.source_title,
        source_url: values.source_url,
        post_date: formattedDate,
        status,
        source_id: sourceId,
        title: values.title
      };

      let error;
      
      if (mode === 'add') {
        const { error: insertError } = await supabase
          .from("quotes")
          .insert(quoteData);
        error = insertError;
      } else if (quoteId) {
        const { error: updateError } = await supabase
          .from("quotes")
          .update(quoteData)
          .eq('id', quoteId);
        error = updateError;
      }

      if (error) {
        if (error.code === '42501') {
          throw new Error('You do not have permission to manage quotes. Please contact an administrator.');
        }
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
      
      toast({
        title: "Success",
        description: `Quote has been ${mode === 'add' ? 'added' : 'updated'} successfully.`,
      });
      
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