import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FooterSettings } from "@/components/client-portal/footer/types";
import { Textarea } from "@/components/ui/textarea";

const footerSchema = z.object({
  column_1_description: z.string().nullable(),
  column_1_playstore_link: z.string().url().nullable(),
  column_2_title: z.string().min(1, "Title is required"),
  column_2_links: z.array(z.object({
    title: z.string(),
    url: z.string()
  })),
  column_3_title: z.string().min(1, "Title is required"),
  column_3_links: z.array(z.object({
    title: z.string(),
    url: z.string()
  })),
  column_4_title: z.string().min(1, "Title is required"),
  column_4_contact_email: z.string().email().nullable(),
  column_4_contact_phone: z.string().nullable(),
  column_4_social_links: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  }))
});

interface FooterSettingsFormProps {
  defaultValues: FooterSettings;
  onSubmit: (data: FooterSettings) => Promise<void>;
}

export function FooterSettingsForm({ defaultValues, onSubmit }: FooterSettingsFormProps) {
  const { toast } = useToast();
  
  // Set default values with corrected links
  const initialValues = {
    ...defaultValues,
    column_2_links: defaultValues.column_2_links?.filter(link => link.title.toLowerCase() !== 'releases') || [],
    column_3_links: (defaultValues.column_3_links || []).map(link => ({
      ...link,
      url: link.title.toLowerCase() === 'categories' ? '/categories' : link.url
    }))
  };

  const form = useForm<FooterSettings>({
    resolver: zodResolver(footerSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (data: FooterSettings) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating footer settings:', error);
      toast({
        title: "Error",
        description: "Failed to update footer settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="column_1_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Column 1 Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="column_1_playstore_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playstore Link</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Column titles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="column_2_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Column 2 Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="column_3_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Column 3 Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="column_4_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Column 4 Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="column_4_contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="column_4_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}