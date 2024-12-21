import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

const Quotes = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Add New Quote</h1>
              <AddQuoteForm />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quotes;