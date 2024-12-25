import { useState } from "react";
import { PagesTable } from "@/components/admin/pages/PagesTable";
import { PageForm } from "@/components/admin/pages/PageForm";

const PagesManagement = () => {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pages Management</h1>
      </div>
      {isEditing ? (
        <div className="border rounded-lg bg-card">
          <PageForm 
            page={selectedPage}
            onSuccess={() => {
              setIsEditing(false);
              setSelectedPage(null);
            }}
            onCancel={() => {
              setIsEditing(false);
              setSelectedPage(null);
            }}
          />
        </div>
      ) : (
        <div className="border rounded-lg bg-card">
          <PagesTable 
            onEdit={(page) => {
              setSelectedPage(page);
              setIsEditing(true);
            }}
            onAdd={() => {
              setSelectedPage(null);
              setIsEditing(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PagesManagement;