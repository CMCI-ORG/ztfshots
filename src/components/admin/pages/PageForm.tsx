import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TitleField } from "./form/TitleField";
import { PageKeyField } from "./form/PageKeyField";
import { RichTextField } from "./form/RichTextField";
import { MetaDescriptionField } from "./form/MetaDescriptionField";
import { PageFormValues } from "./types";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  page_key: z.string().min(1, "Page key is required"),
  content: z.string().optional(),
  rich_text_content: z.any(),
  meta_description: z.string().optional(),
  sidebar_content: z.any().optional(),
});

interface PageFormProps {
  page?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PageForm = ({ page, onSuccess, onCancel }: PageFormProps) => {
  const { toast } = useToast();
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      page_key: page?.page_key || "",
      content: page?.content || "",
      rich_text_content: page?.rich_text_content || {},
      meta_description: page?.meta_description || "",
      sidebar_content: page?.sidebar_content || {},
    },
  });

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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pages
        </Button>
        <h2 className="text-2xl font-bold">
          {page ? "Edit Page" : "Create New Page"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <TitleField form={form} />
            <PageKeyField form={form} />
          </div>
          
          <div className="min-h-[400px]">
            <RichTextField form={form} />
          </div>
          
          <MetaDescriptionField form={form} />

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {page ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};