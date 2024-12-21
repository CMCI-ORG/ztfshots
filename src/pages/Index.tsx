import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteStats } from "@/components/analytics/QuoteStats";

const mockQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration",
    date: "2024-02-20",
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "Life",
    date: "2024-02-19",
  },
  {
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "Philosophy",
    date: "2024-02-18",
  },
];

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
              <QuoteStats />
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Recent Quotes</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockQuotes.map((quote, index) => (
                <QuoteCard key={index} {...quote} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;