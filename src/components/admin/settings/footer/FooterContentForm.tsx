import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { FooterContent, FooterColumn, FooterContentType } from "./types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormFields } from "./form/FormFields";
import { FormActions } from "./form/FormActions";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content_type_id: z.string().min(1, "Content type is required"),
  column_id: z.string().min(1, "Column is required"),
  content: z.record(z.any()).default({}),
});

interface FooterContentFormProps {
  contentTypes: FooterContentType[];
  columns: FooterColumn[];
  contents: FooterContent[];
  selectedContent?: FooterContent;
  onCancel?: () => void;
}

export function FooterContentForm({
  contentTypes,
  columns,
  contents,
  selectedContent,
  onCancel,
}: FooterContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedContent?.title || "",
      content_type_id: selectedContent?.content_type_id || "",
      column_id: selectedContent?.column_id || "",
      content: selectedContent?.content || {},
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const columnContents = contents.filter(
        (c) => c.column_id === values.column_id
      );
      const maxOrder = Math.max(
        ...columnContents.map((c) => c.order_position),
        -1
      );

      const contentData = {
        ...values,
        order_position: selectedContent?.order_position ?? maxOrder + 1,
      };

      const { error } = await supabase
        .from("footer_contents")
        .upsert({
          id: selectedContent?.id,
          ...contentData,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["footerContents"] });
      
      toast({
        title: "Success",
        description: `Footer content ${selectedContent ? "updated" : "created"} successfully`,
      });
      
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error saving footer content:", error);
      toast({
        title: "Error",
        description: "Failed to save footer content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!Array.isArray(contentTypes) || !Array.isArray(columns)) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          There was an error loading the form data. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFields 
          form={form}
          contentTypes={contentTypes}
          columns={columns}
        />
        <FormActions 
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          mode={selectedContent ? "edit" : "create"}
        />
      </form>
    </Form>
  );
}