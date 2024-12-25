import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PageFormValues } from "../types";

interface MetaDescriptionFieldProps {
  form: UseFormReturn<PageFormValues>;
}

export const MetaDescriptionField = ({ form }: MetaDescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="meta_description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Meta Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter meta description for SEO"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};