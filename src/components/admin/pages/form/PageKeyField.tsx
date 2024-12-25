import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PageFormValues } from "../types";

interface PageKeyFieldProps {
  form: UseFormReturn<PageFormValues>;
}

export const PageKeyField = ({ form }: PageKeyFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="page_key"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Page Key</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., about, privacy-policy" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};