import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateField } from "../utils/validation";

interface TextFieldsProps {
  form: UseFormReturn<any>;
}

export const TextFields = ({ form }: TextFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="content.text"
      rules={{ 
        required: "Text content is required",
        validate: (value) => {
          if (!value || value.trim() === '') {
            return "Text content cannot be empty";
          }
          if (value.trim().length < 2) {
            return "Text content must be at least 2 characters";
          }
          return validateField(value, 'string', 'Text');
        }
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Text Content</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className={form.formState.errors?.content?.text ? 'border-destructive' : ''}
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};