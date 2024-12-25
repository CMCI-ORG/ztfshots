import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FooterSettingsForm } from "@/components/admin/settings/footer/FooterSettingsForm";
import { FeedSettings } from "@/components/admin/settings/feed/FeedSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { FooterSettings } from "@/components/client-portal/footer/types";
import { useToast } from "@/components/ui/use-toast";

const FooterManagement = () => {
  const { toast } = useToast();
  
  const { data: footerSettings, isLoading: isLoadingFooter } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .single();
      return data as FooterSettings;
    },
  });

  const handleFooterSubmit = async (data: FooterSettings) => {
    try {
      const { error } = await supabase
        .from('footer_settings')
        .upsert(data);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Footer settings have been updated.",
      });
    } catch (error) {
      console.error('Error updating footer settings:', error);
      toast({
        title: "Error",
        description: "Failed to update footer settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Footer Management</h2>
        <p className="text-muted-foreground">
          Customize your website's footer content, links, and RSS feeds.
        </p>
      </div>

      <Tabs defaultValue="layout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="layout">Layout & Content</TabsTrigger>
          <TabsTrigger value="feeds">RSS Feeds</TabsTrigger>
        </TabsList>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Footer Layout</CardTitle>
              <CardDescription>
                Configure the footer columns, links, and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFooter ? (
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
                  onSubmit={handleFooterSubmit}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds">
          <Card>
            <CardHeader>
              <CardTitle>RSS Feeds</CardTitle>
              <CardDescription>
                Manage RSS feeds displayed in the footer columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterManagement;