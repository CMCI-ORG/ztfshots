import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRolesTable } from "@/components/users/UserRolesTable";
import { SubscribersTable } from "@/components/subscribers/SubscribersTable";

export default function UserManagement() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Roles</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserRolesTable />
        </TabsContent>
        
        <TabsContent value="subscribers">
          <SubscribersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}