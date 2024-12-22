import { AdminLayout } from "@/components/layout/AdminLayout";
import { QuotesTable } from "@/components/quotes/QuotesTable";
import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Quotes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <main className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Quotes</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Quote
                </Button>
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
      </main>
    </AdminLayout>
  );
};

export default Quotes;