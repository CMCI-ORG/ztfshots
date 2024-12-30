import { UseFormReturn } from "react-hook-form";
import { FooterContentType } from "./types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddressFields } from "./fields/AddressFields";
import { ArrayFields } from "./fields/ArrayFields";
import { TextFields } from "./fields/TextFields";
import { LinkFields } from "./fields/LinkFields";

interface ContentTypeFieldsProps {
  contentType: FooterContentType;
  form: UseFormReturn<any>;
}

export function ContentTypeFields({ contentType, form }: ContentTypeFieldsProps) {
  const renderContentTypeFields = () => {
    switch (contentType.type) {
      case 'text':
        return <TextFields form={form} />;
      case 'link':
        return <LinkFields form={form} />;
      case 'address':
        return <AddressFields form={form} />;
      case 'social':
      case 'links':
        return <ArrayFields key={contentType.type} form={form} fieldKey={contentType.type} fields={contentType.fields[0]} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        rules={{ 
          required: "Title is required",
          validate: (value) => {
            if (!value || value.trim() === '') {
              return "Title cannot be empty";
            }
            if (value.trim().length < 2) {
              return "Title must be at least 2 characters";
            }
            return true;
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value || ''} 
                className={form.formState.errors.title ? 'border-destructive' : ''}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {renderContentTypeFields()}
    </div>
  );
}