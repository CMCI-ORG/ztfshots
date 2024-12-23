import { TestDigestButton } from "@/components/admin/subscribers/TestDigestButton";
import { SubscribersTable } from "@/components/subscribers/SubscribersTable";
import { NotificationHistory } from "@/components/admin/notifications/NotificationHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Subscribers() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <TestDigestButton />
      </div>
      
      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="notifications">Notification History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribers">
          <SubscribersTable />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}