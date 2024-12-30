import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateField } from "../utils/validation";

interface LinkFieldsProps {
  form: UseFormReturn<{
    content: {
      text?: string;
      url?: string;
    };
  }>;
}

export const LinkFields = ({ form }: LinkFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="content.text"
        rules={{ 
          required: "Link text is required",
          validate: (value) => {
            if (!value || value.trim() === '') {
              return "Link text cannot be empty";
            }
            if (value.trim().length < 2) {
              return "Link text must be at least 2 characters";
            }
            return validateField(value, 'string', 'Link text');
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link Text</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className={form.formState.errors.content?.text ? 'border-destructive' : ''}
                required
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.content?.text?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content.url"
        rules={{ 
          required: "URL is required",
          validate: (value) => {
            if (!value || value.trim() === '') {
              return "URL cannot be empty";
            }
            return validateField(value, 'url', 'URL');
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input 
                type="url"
                {...field} 
                className={form.formState.errors.content?.url ? 'border-destructive' : ''}
                required
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.content?.url?.message}
            </FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
};