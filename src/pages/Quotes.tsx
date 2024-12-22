import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { QuotesTable } from "@/components/quotes/QuotesTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="space-y-6">
              <div className="flex flex-col items-start space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
                <div>
                  {siteSettings?.logo_url && (
                    <img
                      src={siteSettings.logo_url}
                      alt={siteSettings?.site_name || "Site Logo"}
                      className="h-12 mb-2"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-[#8B5CF6]">Quotes</h1>
                  {siteSettings?.tag_line && (
                    <p className="text-muted-foreground mt-1">
                      {siteSettings.tag_line}
                    </p>
                  )}
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Quote of the Day
                </Button>
              </div>
              <QuotesTable />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quotes;