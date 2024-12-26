/**
 * FormFields component renders the common form fields used in footer management.
 * It handles content type selection and column assignment.
 */
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FooterColumn, FooterContentType } from "../types";

interface FormFieldsProps {
  /** Form instance from react-hook-form */
  form: UseFormReturn<any>;
  /** Available content types for selection */
  contentTypes: FooterContentType[];
  /** Available footer columns */
  columns: FooterColumn[];
  /** Callback when content type changes */
  onContentTypeChange: (contentTypeId: string) => void;
}

export const FormFields = ({ form, contentTypes, columns, onContentTypeChange }: FormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="content_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Type</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onContentTypeChange(value);
              }} 
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
    </div>
  );
};