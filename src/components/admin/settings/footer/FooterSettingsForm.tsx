import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { FooterSettings } from "@/components/client-portal/footer/types";

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
  const form = useForm<FooterSettings>({
    resolver: zodResolver(footerSchema),
    defaultValues,
  });

  const handleSubmit = async (data: FooterSettings) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
      });
    } catch (error) {
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
        {/* Form fields will be implemented in the next iteration */}
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
