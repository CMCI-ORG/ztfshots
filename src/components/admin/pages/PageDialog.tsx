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
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TitleField } from "./form/TitleField";
import { PageKeyField } from "./form/PageKeyField";
import { RichTextField } from "./form/RichTextField";
import { MetaDescriptionField } from "./form/MetaDescriptionField";
import { PageFormValues } from "./types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  page_key: z.string().min(1, "Page key is required"),
  content: z.string().optional(),
  rich_text_content: z.any(),
  meta_description: z.string().optional(),
  sidebar_content: z.any().optional(),
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
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      page_key: "",
      content: "",
      rich_text_content: {},
      meta_description: "",
      sidebar_content: {},
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title,
        page_key: page.page_key,
        content: page.content,
        rich_text_content: page.rich_text_content || {},
        meta_description: page.meta_description || "",
        sidebar_content: page.sidebar_content || {},
      });
    } else {
      form.reset({
        title: "",
        page_key: "",
        content: "",
        rich_text_content: {},
        meta_description: "",
        sidebar_content: {},
      });
    }
  }, [page, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const pageData = {
        title: values.title,
        page_key: values.page_key,
        content: values.content || "",
        rich_text_content: values.rich_text_content,
        meta_description: values.meta_description || null,
        sidebar_content: values.sidebar_content || {},
      };

      if (page) {
        const { error } = await supabase
          .from("pages_content")
          .update(pageData)
          .eq("id", page.id);

        if (error) throw error;

        toast({
          title: "Page updated",
          description: "The page has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from("pages_content")
          .insert([pageData]);

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
            <TitleField form={form} />
            <PageKeyField form={form} />
            <RichTextField form={form} />
            <MetaDescriptionField form={form} />

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