import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { QuotesTable } from "@/components/quotes/QuotesTable";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
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
    <div className="min-h-screen">
      <Navbar />
      <PageHeader 
        title="Quotes" 
        subtitle="Manage and organize your collection of inspirational quotes"
      />
      <main className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Quote of the Day
              </Button>
            </div>
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
        </div>
      </main>
    </div>
  );
};

export default Quotes;