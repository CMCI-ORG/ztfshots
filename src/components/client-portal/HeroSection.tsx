import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useNavigate } from "react-router-dom";
import { QuoteInteractions } from "@/components/quotes/interactions/QuoteInteractions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const HeroSection = () => {
  const navigate = useNavigate();
  
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
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative bg-gradient-to-br from-[#EDF4FF] to-white border-b">
      <div className="container mx-auto py-12 px-4">
        {featuredQuote && (
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-[#2B4C7E] font-['Open_Sans'] mb-2">
              Quote of the Day
            </h1>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <span className="absolute -top-8 left-0 text-7xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
              <blockquote className="text-2xl font-serif italic text-[#2B4C7E] pt-4 px-8 leading-relaxed">
                {featuredQuote.text}
              </blockquote>
              <span className="absolute -bottom-4 right-4 text-6xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
            </div>
            <p className="text-lg text-[#5A7BA6] italic">
              — {featuredQuote.authors?.name}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-[#33A1DE] hover:bg-[#2B4C7E] w-full sm:w-auto transition-colors"
                onClick={() => navigate("/quotes")}
              >
                Explore Quotes
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-[#33A1DE] text-[#33A1DE] hover:bg-[#33A1DE]/10"
                  >
                    Subscribe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subscribe to Daily Inspiration</DialogTitle>
                  </DialogHeader>
                  <SubscriptionForm />
                </DialogContent>
              </Dialog>
            </div>
            <div className="max-w-sm mx-auto">
              <QuoteInteractions 
                quoteId={featuredQuote.id}
                quote={featuredQuote.text}
                author={featuredQuote.authors?.name || ''}
                showComments={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};