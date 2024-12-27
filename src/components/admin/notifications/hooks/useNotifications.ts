import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationUser } from "../types";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notification-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          name,
          email,
          status,
          email_status,
          created_at,
          last_notification:email_notifications(sent_at)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      const transformedData: NotificationUser[] = (data || []).map(user => ({
        ...user,
        last_notification: user.last_notification?.[0]?.sent_at || null
      }));
      
      return transformedData;
    },
  });
};