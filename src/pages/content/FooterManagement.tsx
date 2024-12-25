import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FooterSettingsForm } from "@/components/admin/settings/footer/FooterSettingsForm";
import { FeedSettingsForm } from "@/components/admin/settings/feed/FeedSettingsForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FooterManagement = () => {
  const { data: footerSettings, isLoading: isLoadingFooter } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .single();
      return data;
    },
  });

  const { data: feedSettings, isLoading: isLoadingFeed } = useQuery({
    queryKey: ['feedSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('feed_settings')
        .select('*');
      return data || [];
    },
  });

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
                    column_2_links: [],
                    column_3_links: [],
                    column_4_social_links: []
                  }}
                  onSubmit={async (data) => {
                    const { error } = await supabase
                      .from('footer_settings')
                      .upsert(data);
                    
                    if (error) throw error;
                  }}
                  isSubmitting={false}
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
              {isLoadingFeed ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  {feedSettings?.map((feed) => (
                    <Card key={feed.id} className="bg-muted/50">
                      <CardContent className="pt-6">
                        <FeedSettingsForm
                          defaultValues={feed}
                          onSubmit={async (data) => {
                            const { error } = await supabase
                              .from('feed_settings')
                              .update(data)
                              .eq('id', feed.id);
                            
                            if (error) throw error;
                          }}
                          isSubmitting={false}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterManagement;