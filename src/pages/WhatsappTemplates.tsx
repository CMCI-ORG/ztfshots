import { WhatsappTemplatesTable } from "@/components/whatsapp/WhatsappTemplatesTable";
import { WhatsappTemplatesErrorBoundary } from "@/components/whatsapp/WhatsappTemplatesErrorBoundary";

const WhatsappTemplates = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp Templates</h2>
        <p className="text-muted-foreground">
          Manage your WhatsApp message templates for notifications.
        </p>
      </div>
      <WhatsappTemplatesErrorBoundary>
        <WhatsappTemplatesTable />
      </WhatsappTemplatesErrorBoundary>
    </div>
  );
};

export default WhatsappTemplates;