import { SiteSettings } from "@/components/admin/settings/SiteSettings";
import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <Card className="p-6">
        <SiteSettings />
      </Card>
    </div>
  );
}