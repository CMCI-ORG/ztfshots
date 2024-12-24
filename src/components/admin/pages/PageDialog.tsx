import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  page_key: z.string().min(1, "Page key is required"),
  content: z.string().min(1, "Content is required"),
  meta_description: z.string().optional(),
});

interface PageDialogProps {
  page?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PageDialog = ({
  page,
  open,
  onOpenChange,
  onSuccess,
}: PageDialogProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      page_key: "",
      content: "",
      meta_description: "",
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title,
        page_key: page.page_key,
        content: page.content,
        meta_description: page.meta_description || "",
      });
    } else {
      form.reset({
        title: "",
        page_key: "",
        content: "",
        meta_description: "",
      });
    }
  }, [page, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (page) {
        const { error } = await supabase
          .from("pages_content")
          .update(values)
          .eq("id", page.id);

        if (error) throw error;

        toast({
          title: "Page updated",
          description: "The page has been successfully updated.",
        });
      } else {
        const { error } = await supabase.from("pages_content").insert([values]);

        if (error) throw error;

        toast({
          title: "Page created",
          description: "The page has been successfully created.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: "Failed to save the page. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {page ? "Edit Page" : "Create New Page"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="page_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., about, privacy-policy" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter page content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter meta description for SEO"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {page ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};