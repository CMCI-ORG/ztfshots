import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form-sections/BasicInfoFields";
import { ImageFields } from "./form-sections/ImageFields";
import { SiteSettingsFormData } from "@/integrations/supabase/types/site";

const formSchema = z.object({
  site_name: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  tag_line: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon_url: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
});

interface SiteSettingsFormProps {
  defaultValues: SiteSettingsFormData;
  onSubmit: (data: SiteSettingsFormData) => void;
  isSubmitting: boolean;
}

export function SiteSettingsForm({ defaultValues, onSubmit, isSubmitting }: SiteSettingsFormProps) {
  const form = useForm<SiteSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">
              Configure the basic information about your site.
            </p>
            <div className="mt-4">
              <BasicInfoFields form={form} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Images</h3>
            <p className="text-sm text-muted-foreground">
              Upload or update your site's visual assets.
            </p>
            <div className="mt-4">
              <ImageFields form={form} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}