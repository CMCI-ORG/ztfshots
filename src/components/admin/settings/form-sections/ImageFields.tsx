import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "../ImageUpload";
import { SiteSettingsFormData } from "@/integrations/supabase/types/site";

interface ImageFieldsProps {
  form: UseFormReturn<SiteSettingsFormData>;
}

export function ImageFields({ form }: ImageFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="icon_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Icon</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="site-assets"
                path="icon"
              />
            </FormControl>
            <FormDescription>
              The icon that appears in browser tabs (favicon).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Logo</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="site-assets"
                path="logo"
              />
            </FormControl>
            <FormDescription>
              Your site's logo that appears in the header.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cover_image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                bucket="site-assets"
                path="cover"
              />
            </FormControl>
            <FormDescription>
              The default image used for social media sharing and the login page background.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}