import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { HeroSection } from "@/components/client-portal/HeroSection";
import { QuickLinks } from "@/components/client-portal/QuickLinks";
import { SearchFilterPanel } from "@/components/client-portal/SearchFilterPanel";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const ClientPortal = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
              #ZTFBooks Quotes
            </h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/client-portal" className={navigationMenuTriggerStyle()}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/client-portal/quotes" className={navigationMenuTriggerStyle()}>
                    Quotes
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <p className="text-muted-foreground mt-2 font-['Roboto']">
              Daily inspiration for your spiritual journey
            </p>
          </div>
        </div>
      </header>
      
      <main>
        <HeroSection />
        <QuickLinks />
        <SearchFilterPanel />
        
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-8 text-[#8B5CF6] font-['Open_Sans'] tracking-tight">
            Recent Quotes
          </h2>
          <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {quotes?.map((quote) => (
              <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
                <QuoteCard
                  quote={quote.text}
                  author={quote.authors?.name || "Unknown"}
                  category={quote.categories?.name || "Uncategorized"}
                  date={format(new Date(quote.created_at), "MMMM d, yyyy")}
                  sourceTitle={quote.source_title}
                  sourceUrl={quote.source_url}
                  hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientPortal;