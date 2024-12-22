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
import { SiteSettingsFormData } from "@/integrations/supabase/types/site";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BasicInfoFieldsProps {
  form: UseFormReturn<SiteSettingsFormData>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="header_display_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Header Display Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="text" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Display site name as text
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="logo" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Display logo image
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose how to display your site identity in the header
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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