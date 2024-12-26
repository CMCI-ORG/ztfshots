import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FooterContent, FooterColumn, FooterContentType } from "./types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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
  onCancel: () => void;
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
      
      onCancel();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter content title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
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
            name="column_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Column</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        Column {column.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {selectedContent ? "Updating..." : "Creating..."}
              </>
            ) : (
              selectedContent ? "Update Content" : "Create Content"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}