import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShareableQuoteDialog } from "./ShareableQuoteDialog";
import { SubscriptionForm } from "../subscription/SubscriptionForm";
import { CommentSection } from "../comments/CommentSection";

interface DailyQuotePostProps {
  title: string;
  quote: string;
  author: string;
  reflection: string;
  id: string; // Add id prop
}

export const DailyQuotePost = ({
  title,
  quote,
  author,
  reflection,
  id, // Include id in props
}: DailyQuotePostProps) => {
  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">{title}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <blockquote className="text-xl font-serif italic text-center border-l-4 border-primary/20 pl-4 py-2">
            "{quote}"
            <footer className="text-sm font-medium mt-2">— {author}</footer>
          </blockquote>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Daily Reflection</h3>
              <p className="text-muted-foreground">{reflection}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Today's Challenge</h3>
              <p className="text-muted-foreground">How will you live this out today?</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Share This Quote</h3>
        <ShareableQuoteDialog 
          quote={quote} 
          author={author}
        />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-6">
          <SubscriptionForm />
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-6">
          <CommentSection quoteId={id} />
        </CardContent>
      </Card>
    </div>
  );
};