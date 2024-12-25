import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FooterContentType, FooterColumn, FooterContent } from "./types";
import { ContentTypeFields } from "./ContentTypeFields";
import { FooterContentList } from "./FooterContentList";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  column_id: z.string().min(1, "Column is required"),
  content_type_id: z.string().min(1, "Content type is required"),
  title: z.string().nullable(),
  content: z.record(z.any())
});

interface FooterContentFormProps {
  contentTypes: FooterContentType[];
  columns: FooterColumn[];
  contents: FooterContent[];
}

export function FooterContentForm({ contentTypes, columns, contents }: FooterContentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: null,
      content: {}
    },
  });

  const selectedContentType = contentTypes.find(
    type => type.id === form.watch('content_type_id')
  );

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('footer_contents')
        .insert({
          ...values,
          order_position: contents.filter(c => c.column_id === values.column_id).length
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Footer content added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['footerContents'] });
      form.reset();
    } catch (error) {
      console.error('Error adding footer content:', error);
      toast({
        title: "Error",
        description: "Failed to add footer content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="column_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="content_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </div>

          {selectedContentType && (
            <ContentTypeFields
              contentType={selectedContentType}
              form={form}
            />
          )}

          <Button type="submit">Add Content</Button>
        </form>
      </Form>

      <FooterContentList
        contents={contents}
        columns={columns}
        contentTypes={contentTypes}
      />
    </div>
  );
}