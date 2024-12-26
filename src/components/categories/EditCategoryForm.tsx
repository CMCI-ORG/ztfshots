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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }).max(50, {
    message: "Category name must not exceed 50 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters.",
  }),
});

interface EditCategoryFormProps {
  category: {
    id: string;
    name: string;
    description: string;
    translations?: Record<string, any>;
    primary_language?: string;
  };
  onSuccess: () => void;
}

export function EditCategoryForm({ category, onSuccess }: EditCategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: values.name,
          description: values.description,
        })
        .eq("id", category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category has been updated successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSuccess();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name..." {...field} />
              </FormControl>
              <FormDescription>
                A short, descriptive name for the category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter category description..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed description of what this category represents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </Form>
  );
}