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
import { useQuery } from "@tanstack/react-query";

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

interface AddCategoryFormProps {
  onSuccess: () => void;
}

export function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the current user's preferred language
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();
      
      return data;
    },
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("categories").insert({
        name: values.name,
        description: values.description,
        primary_language: profile?.preferred_language || 'en',
        translations: {},
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category has been added successfully.",
      });
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSuccess();
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category. Please try again.",
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
          {form.formState.isSubmitting ? "Adding..." : "Add Category"}
        </Button>
      </form>
    </Form>
  );
}