import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, ThumbsUp, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareableQuoteDialog } from "./ShareableQuoteDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [likes, setLikes] = useState(0);
  const [stars, setStars] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInteractionCounts();
      if (user) {
        checkUserInteractions();
      }
    }
  }, [id, user]);

  const fetchInteractionCounts = async () => {
    if (!id) return;

    const [likesCount, starsCount] = await Promise.all([
      supabase.from('quote_likes').select('*', { count: 'exact' }).eq('quote_id', id),
      supabase.from('quote_stars').select('*', { count: 'exact' }).eq('quote_id', id),
    ]);

    setLikes(likesCount.count || 0);
    setStars(starsCount.count || 0);
  };

  const checkUserInteractions = async () => {
    if (!id || !user) return;

    const [userLike, userStar] = await Promise.all([
      supabase.from('quote_likes').select('*').eq('quote_id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('quote_stars').select('*').eq('quote_id', id).eq('user_id', user.id).maybeSingle(),
    ]);

    setIsLiked(!!userLike.data);
    setIsStarred(!!userStar.data);
  };

  const handleLike = async () => {
    if (!id || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id);
        setLikes(prev => prev - 1);
      } else {
        await supabase
          .from('quote_likes')
          .insert({ quote_id: id, user_id: user.id });
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleStar = async () => {
    if (!id || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to star quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isStarred) {
        await supabase
          .from('quote_stars')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id);
        setStars(prev => prev - 1);
      } else {
        await supabase
          .from('quote_stars')
          .insert({ quote_id: id, user_id: user.id });
        setStars(prev => prev + 1);
      }
      setIsStarred(!isStarred);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    
    try {
      await supabase
        .from('quote_downloads')
        .insert({ 
          quote_id: id,
          user_id: user?.id || null
        });
    } catch (error) {
      console.error('Failed to record download:', error);
    }
  };

  const handleShare = async (shareType: string) => {
    if (!id) return;
    
    try {
      await supabase
        .from('quote_shares')
        .insert({ 
          quote_id: id,
          user_id: user?.id || null,
          share_type: shareType
        });
    } catch (error) {
      console.error('Failed to record share:', error);
    }
  };

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-sm text-muted-foreground font-['Roboto'] p-4">
        <div className="flex items-center justify-between">
          <span className="bg-[#E5DEFF] text-[#8B5CF6] px-2 py-0.5 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-xs">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        <Link to={id ? `/quote/${id}` : "#"} className="block">
          <blockquote className="text-lg font-['Open_Sans'] font-bold leading-relaxed text-gray-800 hover:text-[#8B5CF6] transition-colors">
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
      <CardFooter className="flex justify-between border-t border-gray-100 p-2">
        <div className="flex gap-1">
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
        <div className="flex gap-1">
          <ShareableQuoteDialog 
            quote={quote}
            author={author}
            sourceTitle={sourceTitle}
            onDownload={handleDownload}
            onShare={() => handleShare('dialog')}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2 text-gray-600 hover:text-[#8B5CF6]"
            onClick={() => handleShare('quick')}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};