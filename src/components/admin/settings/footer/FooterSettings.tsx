import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FooterSettingsForm } from "./FooterSettingsForm";

export function FooterSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <CardDescription>
          Manage your website's footer content including links, social media, and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FooterSettingsForm />
      </CardContent>
    </Card>
  );
}