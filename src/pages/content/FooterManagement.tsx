import { FooterSettings } from "@/components/admin/settings/footer/FooterSettings";

const FooterManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Footer Management</h2>
        <p className="text-muted-foreground">
          Customize your website's footer content and layout.
        </p>
      </div>
      <FooterSettings />
    </div>
  );
};

export default FooterManagement;