import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { DailyQuotePost } from "@/components/quotes/DailyQuotePost";
import { Search, Star, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const { data: featuredQuote } = useQuery({
    queryKey: ["featured-quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .eq("status", "live")
        .order("post_date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: recentQuotes } = useQuery({
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

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
            {/* Hero Section */}
            <div className="relative bg-white/80 backdrop-blur-sm border-b">
              <div className="container mx-auto py-12 px-4">
                {featuredQuote && (
                  <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl font-bold text-[#8B5CF6] font-['Open_Sans'] mb-2">
                      Quote of the Day
                    </h1>
                    <blockquote className="text-2xl font-serif italic text-gray-800">
                      "{featuredQuote.text}"
                    </blockquote>
                    <p className="text-lg text-[#8B5CF6]">
                      — {featuredQuote.authors?.name}
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                      <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                        Explore Quotes
                      </Button>
                      <Button size="lg" variant="outline">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="container mx-auto py-8 px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                  variant="outline"
                  className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <Star className="mr-2 h-5 w-5 text-[#8B5CF6]" />
                  Highly Rated
                </Button>
                <Button
                  variant="outline"
                  className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <Clock className="mr-2 h-5 w-5 text-[#8B5CF6]" />
                  Recent Quotes
                </Button>
                <Button
                  variant="outline"
                  className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <Sparkles className="mr-2 h-5 w-5 text-[#8B5CF6]" />
                  Featured Quotes
                </Button>
              </div>
            </div>

            {/* Search and Filter Panel */}
            <div className="container mx-auto px-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Search for a quote or topic..."
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                          {format(new Date(2024, i, 1), "MMMM")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Recent Quotes Grid */}
            {recentQuotes && recentQuotes.length > 0 && (
              <div className="container mx-auto px-4 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-[#8B5CF6] font-['Open_Sans']">
                  Recent Quotes
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {recentQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="transform transition-transform hover:-translate-y-1"
                    >
                      <QuoteCard
                        quote={quote.text}
                        author={quote.authors?.name || "Unknown"}
                        category={quote.categories?.name || "Uncategorized"}
                        date={format(new Date(quote.created_at), "yyyy-MM-dd")}
                        sourceTitle={quote.source_title}
                        sourceUrl={quote.source_url}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;