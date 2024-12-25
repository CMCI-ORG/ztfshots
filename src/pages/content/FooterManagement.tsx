import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FooterContentForm } from "@/components/admin/settings/footer/FooterContentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FooterManagement = () => {
  const { data: contentTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['footerContentTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_content_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: columns, isLoading: isLoadingColumns } = useQuery({
    queryKey: ['footerColumns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: contents, isLoading: isLoadingContents } = useQuery({
    queryKey: ['footerContents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_contents')
        .select('*')
        .order('order_position');
      
      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingTypes || isLoadingColumns || isLoadingContents;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Footer Management</h2>
        <p className="text-muted-foreground">
          Customize your website's footer content and layout.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
          <CardDescription>
            Add and manage content blocks in your footer columns.
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
            <FooterContentForm 
              contentTypes={contentTypes || []}
              columns={columns || []}
              contents={contents || []}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterManagement;