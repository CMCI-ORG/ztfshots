import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, ThumbsUp, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareableQuoteDialog } from "./ShareableQuoteDialog";
import { useState } from "react";

interface QuoteCardProps {
  id?: string;
  quote: string;
  author: string;
  category: string;
  date: string;
  sourceTitle?: string;
  sourceUrl?: string;
  hashtags?: string[];
}

export const QuoteCard = ({ 
  id,
  quote, 
  author, 
  category, 
  date,
  sourceTitle,
  sourceUrl,
  hashtags = []
}: QuoteCardProps) => {
  // State for interaction counts
  const [likes, setLikes] = useState(0);
  const [stars, setStars] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleStar = () => {
    if (isStarred) {
      setStars(prev => prev - 1);
    } else {
      setStars(prev => prev + 1);
    }
    setIsStarred(!isStarred);
  };

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-sm text-muted-foreground font-['Roboto'] p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="bg-[#E5DEFF] text-[#8B5CF6] px-2 py-0.5 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-xs">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 sm:px-6">
        <Link to={id ? `/quote/${id}` : "#"} className="block">
          <blockquote className="text-lg sm:text-xl font-['Open_Sans'] font-bold leading-relaxed text-gray-800 hover:text-[#8B5CF6] transition-colors">
            "{quote}"
          </blockquote>
        </Link>
        <p className="mt-2 text-sm font-medium italic text-[#8B5CF6]">— {author}</p>
        {sourceTitle && (
          <p className="text-xs text-muted-foreground font-['Roboto']">
            From{" "}
            {sourceUrl ? (
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
              >
                {sourceTitle}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              sourceTitle
            )}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs text-[#8B5CF6] bg-[#E5DEFF] px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-100 p-2 sm:p-4">
        <div className="flex gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 text-gray-600 hover:text-[#8B5CF6] ${isLiked ? 'text-[#8B5CF6]' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="ml-1 text-xs">{likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 text-gray-600 hover:text-[#8B5CF6] ${isStarred ? 'text-[#8B5CF6]' : ''}`}
            onClick={handleStar}
          >
            <Star className="h-4 w-4" />
            <span className="ml-1 text-xs">{stars}</span>
          </Button>
          <Link to={id ? `/quote/${id}#comments` : "#"}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 text-gray-600 hover:text-[#8B5CF6]"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="ml-1 text-xs">{comments}</span>
            </Button>
          </Link>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <ShareableQuoteDialog 
            quote={quote}
            author={author}
            sourceTitle={sourceTitle}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 text-gray-600 hover:text-[#8B5CF6]"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};