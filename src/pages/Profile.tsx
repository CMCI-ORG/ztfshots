import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/providers/AuthProvider";

const Profile = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { user } = useAuth();

  // Check if user has admin access
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <ProfileHeader />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Language</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Language & Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <label className="text-sm font-medium">Preferred Language</label>
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  onLanguageChange={setLanguage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;