import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Bell, Globe } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userPreferences } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("users")
        .select("notify_new_quotes, notify_weekly_digest, notify_whatsapp, whatsapp_phone")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (values: {
      display_name?: string;
      bio?: string;
      website?: string;
    }) => {
      if (!user?.id) throw new Error("No user ID");
      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async (values: {
      notify_new_quotes?: boolean;
      notify_weekly_digest?: boolean;
      notify_whatsapp?: boolean;
      whatsapp_phone?: string;
    }) => {
      if (!user?.id) throw new Error("No user ID");
      const { error } = await supabase
        .from("users")
        .update(values)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast.success("Preferences updated successfully");
    },
    onError: (error) => {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{profile?.display_name?.[0] || user?.email?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{profile?.display_name || user?.email}</h1>
          <p className="text-muted-foreground">Member since {new Date(profile?.created_at || "").toLocaleDateString()}</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information visible to other users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  defaultValue={profile?.display_name || ""}
                  onChange={(e) => {
                    setIsUpdating(true);
                    updateProfile.mutate({ display_name: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={profile?.bio || ""}
                  onChange={(e) => {
                    setIsUpdating(true);
                    updateProfile.mutate({ bio: e.target.value });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  defaultValue={profile?.website || ""}
                  onChange={(e) => {
                    setIsUpdating(true);
                    updateProfile.mutate({ website: e.target.value });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Language & Regional Settings</CardTitle>
              <CardDescription>
                Manage your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Preferred Language</Label>
                <div className="flex gap-4">
                  {availableLanguages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={currentLanguage === lang.code ? "default" : "outline"}
                      onClick={() => setLanguage(lang.code)}
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you want to receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Quotes Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when new quotes are published
                  </p>
                </div>
                <Switch
                  checked={userPreferences?.notify_new_quotes}
                  onCheckedChange={(checked) =>
                    updatePreferences.mutate({ notify_new_quotes: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of the best quotes
                  </p>
                </div>
                <Switch
                  checked={userPreferences?.notify_weekly_digest}
                  onCheckedChange={(checked) =>
                    updatePreferences.mutate({ notify_weekly_digest: checked })
                  }
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={userPreferences?.notify_whatsapp}
                    onCheckedChange={(checked) =>
                      updatePreferences.mutate({ notify_whatsapp: checked })
                    }
                  />
                </div>
                {userPreferences?.notify_whatsapp && (
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+1234567890"
                      defaultValue={userPreferences?.whatsapp_phone || ""}
                      onChange={(e) =>
                        updatePreferences.mutate({ whatsapp_phone: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;