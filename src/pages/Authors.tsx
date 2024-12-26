import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthorsTable } from "@/components/authors/AuthorsTable";
import { AddAuthorForm } from "@/components/authors/AddAuthorForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Authors = () => {
  const [open, setOpen] = useState(false);

  return (
    <main className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Authors</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Author
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Author</DialogTitle>
              </DialogHeader>
              <AddAuthorForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <AuthorsTable />
      </div>
    </main>
  );
};

export default Authors;