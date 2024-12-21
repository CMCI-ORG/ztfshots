import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QuoteSourceFields } from "./QuoteSourceFields";
import { quoteFormSchema, type QuoteFormValues } from "./types";

interface AddQuoteFormProps {
  onSuccess?: () => void;
}

export function AddQuoteForm({ onSuccess }: AddQuoteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: authors, error: authorsError } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      text: "",
      source_title: "",
      source_url: "",
    },
  });

  if (authorsError) throw authorsError;
  if (categoriesError) throw categoriesError;

  async function onSubmit(values: QuoteFormValues) {
    try {
      const { error } = await supabase.from("quotes").insert({
        text: values.text,
        author_id: values.author_id,
        category_id: values.category_id,
        source_title: values.source_title || null,
        source_url: values.source_url || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quote has been added successfully.",
      });
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add quote. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <ErrorBoundary>
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
                    placeholder="Enter the quote text..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The inspirational quote you want to share.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {authors?.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <QuoteSourceFields form={form} />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Adding..." : "Add Quote"}
          </Button>
        </form>
      </Form>
    </ErrorBoundary>
  );
}