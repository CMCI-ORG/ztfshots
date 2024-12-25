import { PagesTable } from "@/components/admin/pages/PagesTable";

const PagesManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pages Management</h1>
      </div>
      <div className="border rounded-lg bg-card">
        <PagesTable />
      </div>
    </div>
  );
};

export default PagesManagement;