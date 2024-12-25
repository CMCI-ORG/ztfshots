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
  id: z.string().optional(),
  column_id: z.string().min(1, "Column is required"),
  content_type_id: z.string().min(1, "Content type is required"),
  title: z.string().nullable(),
  content: z.record(z.any()).default({})
});

type FormValues = z.infer<typeof formSchema>;

interface FooterContentFormProps {
  contentTypes: FooterContentType[];
  columns: FooterColumn[];
  contents: FooterContent[];
}

export function FooterContentForm({ contentTypes, columns, contents }: FooterContentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: null,
      content: {},
      column_id: '',
      content_type_id: ''
    },
  });

  const selectedContentType = contentTypes.find(
    type => type.id === form.watch('content_type_id')
  );

  const handleSubmit = async (values: FormValues) => {
    try {
      const { id, ...updateData } = values;
      
      if (id) {
        const { error } = await supabase
          .from('footer_contents')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Footer content updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('footer_contents')
          .insert({
            ...updateData,
            order_position: contents.filter(c => c.column_id === values.column_id).length
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Footer content added successfully",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['footerContents'] });
      form.reset();
    } catch (error) {
      console.error('Error managing footer content:', error);
      toast({
        title: "Error",
        description: `Failed to ${values.id ? 'update' : 'add'} footer content`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (content: FooterContent) => {
    form.reset({
      id: content.id,
      column_id: content.column_id,
      content_type_id: content.content_type_id,
      title: content.title,
      content: content.content || {}
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="column_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Column</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <FormItem className="flex-1">
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="flex justify-end gap-2">
            <Button type="submit">
              {form.getValues('id') ? 'Update' : 'Add'} Content
            </Button>
            
            {form.getValues('id') && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset({
                    title: null,
                    content: {},
                    column_id: '',
                    content_type_id: ''
                  });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Form>

      <FooterContentList
        contents={contents}
        columns={columns}
        contentTypes={contentTypes}
        onEdit={handleEdit}
      />
    </div>
  );
}