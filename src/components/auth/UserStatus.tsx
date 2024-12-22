import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const UserStatus = () => {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Not authenticated. Please log in.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">Email:</span>
        <span>{user.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Role:</span>
        <Badge variant={profile?.role === "admin" || profile?.role === "superadmin" ? "default" : "secondary"}>
          {profile?.role || "user"}
        </Badge>
      </div>
      <div className="text-sm text-gray-500">
        {profile?.role === "admin" || profile?.role === "superadmin" ? (
          <p>You have full administrative rights to manage quotes, authors, and categories.</p>
        ) : (
          <p>You have limited access. Contact an administrator for elevated privileges.</p>
        )}
      </div>
    </div>
  );
};