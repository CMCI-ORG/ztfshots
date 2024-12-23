import { TestDigestButton } from "@/components/admin/subscribers/TestDigestButton";
import { SubscribersTable } from "@/components/admin/subscribers/SubscribersTable";

export default function Subscribers() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <TestDigestButton />
      </div>
      <SubscribersTable />
    </div>
  );
}
