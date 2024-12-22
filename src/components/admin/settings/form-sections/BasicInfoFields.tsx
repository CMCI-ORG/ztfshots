import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SiteSettingsFormData } from "../SiteSettingsForm";

interface BasicInfoFieldsProps {
  form: UseFormReturn<SiteSettingsFormData>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="site_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter site name..." {...field} />
            </FormControl>
            <FormDescription>
              The name of your site that appears in the browser tab and SEO.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tag_line"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tagline</FormLabel>
            <FormControl>
              <Input placeholder="Enter tagline..." {...field} />
            </FormControl>
            <FormDescription>
              A short description that appears below your site name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter site description..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A detailed description of your site for SEO purposes.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}