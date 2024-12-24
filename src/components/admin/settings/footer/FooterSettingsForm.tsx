import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function FooterSettingsForm() {
  const { toast } = useToast();
  const form = useForm<FooterSettings>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      column_2_links: [],
      column_3_links: [],
      column_4_social_links: []
    }
  });

  const { data: footerSettings, isLoading } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .single();
      
      // Parse JSON fields with proper typing
      return {
        ...data,
        column_2_links: data?.column_2_links as FooterLink[] ?? [],
        column_3_links: data?.column_3_links as FooterLink[] ?? [],
        column_4_social_links: data?.column_4_social_links as SocialLink[] ?? []
      } as FooterSettings;
    },
  });

  const onSubmit = async (data: FooterSettings) => {
    try {
      const { error } = await supabase
        .from('footer_settings')
        .update(data)
        .eq('id', footerSettings?.id);

      if (error) throw error;

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields will be implemented in the next iteration */}
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}