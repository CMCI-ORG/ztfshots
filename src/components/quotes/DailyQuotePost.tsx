import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DailyQuotePostProps {
  title: string;
  quote: string;
  author: string;
  reflection: string;
}

export const DailyQuotePost = ({
  title,
  quote,
  author,
  reflection,
}: DailyQuotePostProps) => {
  return (
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
  );
};