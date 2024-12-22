import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { QuotesTable } from "@/components/quotes/QuotesTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
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
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Quotes</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Quote
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Quote</DialogTitle>
                  </DialogHeader>
                  <AddQuoteForm onSuccess={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <QuotesTable />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quotes;