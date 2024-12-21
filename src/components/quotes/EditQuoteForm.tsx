import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { QuoteSourceFields } from "./QuoteSourceFields";

const formSchema = z.object({
  text: z.string().min(2, {
    message: "Quote must be at least 2 characters.",
  }),
  author_id: z.string().uuid(),
  category_id: z.string().uuid(),
  source_title: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal("")),
});

interface Quote {
  id: string;
  text: string;
  author_id: string;
  category_id: string;
  source_title?: string;
  source_url?: string;
}

interface EditQuoteFormProps {
  quote: Quote;
  onSuccess?: () => void;
}

export function EditQuoteForm({ quote, onSuccess }: EditQuoteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: quote.text,
      author_id: quote.author_id,
      category_id: quote.category_id,
      source_title: quote.source_title || "",
      source_url: quote.source_url || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          text: values.text,
          author_id: values.author_id,
          category_id: values.category_id,
          source_title: values.source_title || null,
          source_url: values.source_url || null,
        })
        .eq('id', quote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote has been updated successfully.",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error updating quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update quote",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the quote..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <QuoteSourceFields control={form.control} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update Quote"}
        </Button>
      </form>
    </Form>
  );
}