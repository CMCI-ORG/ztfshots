import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProfileHeader = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, bio, created_at")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.avatar_url} />
        <AvatarFallback>{profile?.display_name?.[0] || user?.email?.[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-semibold">{profile?.display_name || user?.email}</h1>
        <p className="text-muted-foreground">
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
        </p>
      </div>
    </div>
  );
};