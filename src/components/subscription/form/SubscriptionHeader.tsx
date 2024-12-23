import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionHeader = () => {
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Skeleton className="h-16 w-48" />
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-6">
      {siteSettings?.logo_url ? (
        <img 
          src={siteSettings.logo_url} 
          alt={siteSettings?.site_name || "Site Logo"} 
          className="h-16 w-auto"
        />
      ) : (
        <h2 className="text-2xl font-semibold text-[#8B5CF6]">
          {siteSettings?.site_name || "Subscribe"}
        </h2>
      )}
    </div>
  );
};