import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteStats } from "@/components/analytics/QuoteStats";
import { DailyQuotePost } from "@/components/quotes/DailyQuotePost";

const mockQuotes = [
  {
    quote: "Prayer is not asking. Prayer is putting oneself in the hands of God.",
    author: "Mother Teresa",
    category: "Prayer & Intercession",
    date: "2024-02-20",
  },
  {
    quote: "Faith is taking the first step even when you don't see the whole staircase.",
    author: "Martin Luther King Jr.",
    category: "Faith & Trust",
    date: "2024-02-19",
  },
  {
    quote: "The greatest way to live with honor in this world is to be what we pretend to be.",
    author: "Socrates",
    category: "Holiness & Purity",
    date: "2024-02-18",
  },
];

const dailyQuote = {
  title: "The Power of Prayer",
  quote: "Prayer is not asking. Prayer is putting oneself in the hands of God.",
  author: "Mother Teresa",
  reflection: "In our fast-paced world, we often approach prayer as a transaction - asking for things we need. Mother Teresa reminds us that true prayer is about surrender and relationship. It's about placing ourselves completely in God's hands, trusting His wisdom and timing.",
};

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">Today's Featured Quote</h1>
              <DailyQuotePost {...dailyQuote} />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
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