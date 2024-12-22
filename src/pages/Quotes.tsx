import { QuotesTable } from "@/components/quotes/QuotesTable";
import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { UserStatus } from "@/components/auth/UserStatus";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function Quotes() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quotes Management</h1>
            <UserStatus />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Quote</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Quote</DialogTitle>
              </DialogHeader>
              <AddQuoteForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <QuotesTable />
      </div>
    </AdminLayout>
  );
}