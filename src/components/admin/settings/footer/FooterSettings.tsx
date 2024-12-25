import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FooterSettingsForm } from "./FooterSettingsForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterSettings as FooterSettingsType } from "@/components/client-portal/footer/types";
import { Skeleton } from "@/components/ui/skeleton";

export function FooterSettings() {
  const { data: footerSettings, isLoading } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching footer settings:", error);
        throw error;
      }
      
      return data as FooterSettingsType;  // Return the first item or undefined
    },
  });

  const handleSubmit = async (data: FooterSettingsType) => {
    const { error } = await supabase
      .from('footer_settings')
      .upsert(data);
    
    if (error) throw error;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <CardDescription>
          Manage your website's footer content including links, social media, and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <FooterSettingsForm 
            defaultValues={footerSettings || {
              column_1_description: '',
              column_1_playstore_link: '',
              column_2_title: 'Useful Links',
              column_2_links: [],
              column_3_title: 'Quick Links',
              column_3_links: [],
              column_4_title: 'Connect With Us',
              column_4_contact_email: '',
              column_4_contact_phone: '',
              column_4_social_links: []
            }}
            onSubmit={handleSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}