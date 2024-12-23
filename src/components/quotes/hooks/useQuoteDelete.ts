import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useQuoteDelete() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting quote:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
      return true;
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete quote",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleDelete };
}